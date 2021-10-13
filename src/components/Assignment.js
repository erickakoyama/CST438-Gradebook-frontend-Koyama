import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import {DataGrid} from '@material-ui/data-grid';

import NewAssignment from './NewAssignment';
import {SERVER_URL} from '../constants.js'

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

const PERM_TYPES = {
  instructor: 'instructor',
  student: 'student'
}

class Assignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      perms: null,
      rowsLoading: null,
      rows: []
    };
  };
 
  componentDidMount() {
    this.fetchUserPerms();
  }

  componentDidUpdate() {
    if (this.state.perms && this.state.rowsLoading === null) {
      this.fetchAssignments();
    }
  }

  fetchUserPerms = () => {
    const token = Cookies.get('XSRF-TOKEN');
    fetch(`${SERVER_URL}/user/perms`, 
      {  
        method: 'GET', 
        headers: { 'X-XSRF-TOKEN': token, credentials: 'include' },
      } )
    .then((response) => {
      return response.text();
    }) 
    .then((responseData) => {
      this.setState({perms: responseData})       
    })
    .catch(err => {
      console.error(err)
    }); 
  }
 
  fetchAssignments = () => {
    this.setState({rowsLoading: true});
    const fetchAssignmentsUrl = this.state.perms === PERM_TYPES.instructor ?
      `${SERVER_URL}/gradebook`: // if instructor, fetch assignments needing grading
      `${SERVER_URL}/assignment-grade`; // if student, fetch assignment grades for all courses
    console.log("Assignment.fetchAssignments");
    const token = Cookies.get('XSRF-TOKEN');
    fetch(fetchAssignmentsUrl, 
      {  
        method: 'GET', 
        headers: { 'X-XSRF-TOKEN': token, credentials: 'include' },
      } )
    .then((response) => response.json()) 
    .then((responseData) => {
      if (!Array.isArray(responseData.assignments) && !Array.isArray(responseData.assignmentGrades)) {
        toast.error("Fetch failed.", {
          position: toast.POSITION.BOTTOM_LEFT
        });
        return;
      }
      
      //  add to each row attribute "id"  This is required by DataGrid  id is the index value of row in table 
      const data = this.state.perms === PERM_TYPES.instructor ?
        responseData.assignments :
        responseData.assignmentGrades;

      this.setState({ 
        rows: data.map((row, index) => ( { id: index, ...row } )),
        rowsLoading: false
      });
    })
    .catch(err => {
      console.error(err)
      this.setState({
        rowsLoading: false
      });
    }); 
  }

  createAssignment = (data) => {
    const token = Cookies.get('XSRF-TOKEN');
    const url = `${SERVER_URL}/assignment`;
    const fetchOptions = {  
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': token,
        credentials: 'include'
      }, 
      body: JSON.stringify({
        assignmentName: data.name,
        courseId: data.courseId,
        dueDate: data.dueDate,
      })
    }

    fetch(url, fetchOptions)
      .then(res => {
        if (res.ok) {
          toast.success("Assignment successfully created", {position: toast.POSITION.BOTTOM_LEFT});
          this.fetchAssignments();
        } else {
          toast.error("Assignment creation failed", {position: toast.POSITION.BOTTOM_LEFT});
          console.error('Put http status =' + res.status);
        }
      })
      .catch(err => {
        toast.error("Assignment creation failed", {position: toast.POSITION.BOTTOM_LEFT});
        console.error(err);
      });
  }
  
   onRadioClick = (event) => {
    console.log("Assignment.onRadioClick " + event.target.value);
    this.setState({selected: event.target.value});
  }
  
  render() {
    const isInstructor = this.state.perms === PERM_TYPES.instructor;
    const assignmentGradeColumns = [
      { field: 'assignmentName', headerName: 'Assignment Name', width: 300 },
      { field: 'courseTitle', headerName: 'Course', width: 300 },
      { field: 'dueDate', headerName: 'Due Date', width: 300 },
      { field: 'score', headerName: 'Score', width: 300 },
    ];
    const assignmentColumns = [
      {
        field: 'assignmentName',
        headerName: 'Assignment',
        width: 400,
        renderCell: (params) => (
          <div>
          <Radio
            checked={params.row.id === this.state.selected}
            onChange={this.onRadioClick}
            value={params.row.id}
            color="default"
            size="small"
          />
          {params.value}
          </div>
        )
      },
      { field: 'courseTitle', headerName: 'Course', width: 300 },
      { field: 'dueDate', headerName: 'Due Date', width: 200 }
    ];
    const titleText = isInstructor ?
      'Assignment(s) ready to grade: ':
      'Assignment grade(s): ';

    console.log(this.state.rows[this.state.selected])

    return (
      <div align="left" >
        {isInstructor && <NewAssignment onAddAssignment={this.createAssignment} />}
          <h4 style={{paddingLeft: '16px'}}>{titleText}</h4>
          <div style={{ height: 450, width: '100%', align:"left"   }}>
            <DataGrid rows={this.state.rows} columns={isInstructor ? assignmentColumns : assignmentGradeColumns} />
          </div>                
        {isInstructor && (
          <Button
            component={Link}
            to={{pathname:'/gradebook' , assignment: this.state.rows[this.state.selected]}} 
            variant="outlined"
            color="primary"
            disabled={this.state.rows.length===0} 
            style={{margin: 10}}
          >
            Grade
          </Button>
        )}
        <ToastContainer autoClose={1500} />   
      </div>
    )
  }
}  

export default Assignment;