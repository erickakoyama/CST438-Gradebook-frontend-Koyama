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

class Assignment extends Component {
    constructor(props) {
      super(props);
      this.state = {selected: 0, rows: []};
    };
 
   componentDidMount() {
    this.fetchAssignments();
  }
 
  fetchAssignments = () => {
    console.log("Assignment.fetchAssignments");
    const token = Cookies.get('XSRF-TOKEN');
    fetch(`${SERVER_URL}/gradebook`, 
      {  
        method: 'GET', 
        headers: { 'X-XSRF-TOKEN': token }
      } )
    .then((response) => response.json()) 
    .then((responseData) => { 
      if (Array.isArray(responseData.assignments)) {
        //  add to each row attribute "id"  This is required by DataGrid  id is the index value of row in table 
        this.setState({ rows: responseData.assignments.map((row, index) => ( { id: index, ...row } )) });
      } else {
        toast.error("Fetch failed.", {
          position: toast.POSITION.BOTTOM_LEFT
        });
      }        
    })
    .catch(err => console.error(err)); 
  }

  createAssignment = (data) => {
    const token = Cookies.get('XSRF-TOKEN');
    const url = `${SERVER_URL}/assignment`;
    const fetchOptions = {  
      method: 'POST', 
      headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': token }, 
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
     const columns = [
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
      return (
        <div align="left" >
          <NewAssignment onAddAssignment={this.createAssignment} />
          <h4>Assignment(s) ready to grade: </h4>
            <div style={{ height: 450, width: '100%', align:"left"   }}>
              <DataGrid rows={this.state.rows} columns={columns} />
            </div>                
          <Button component={Link} to={{pathname:'/gradebook' , assignment: this.state.rows[this.state.selected]}} 
                  variant="outlined" color="primary" disabled={this.state.rows.length===0}  style={{margin: 10}}>
            Grade
          </Button>
          <ToastContainer autoClose={1500} />   
        </div>
      )
  }
}  

export default Assignment;