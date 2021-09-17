import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export default class NewAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        courseId: null,
        dueDate: null,
        name: null,
      },
      open: false,
    };
  }

  handleChange = (event) => {
    const key = event.target.name;
    
    this.setState({
      formData: {
        ...this.state.formData,
        [key]: event.target.value
      }
    });
  }

  handleCloseDialog = () => {
    this.setState({open: false});
  }

  handleOpenDialog = () => {
    this.setState({open: true});
  }

  handleSubmit = () => {
    this.props.onAddAssignment(this.state.formData);
    this.handleCloseDialog();
  };    

  render() {
    return (
      <div>
        <Button variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleOpenDialog}>
          Add Assignment
        </Button>
        <Dialog open={this.state.open} onClose={this.handleCloseDialog}>
            <DialogTitle>Add Assignment</DialogTitle>
            <DialogContent>

            <Grid container direction={"column"} spacing={2}>
              <Grid item>
                <TextField
                  autoFocus
                  fullWidth
                  label="Assignment Name"
                  name="name"
                  onChange={this.handleChange}
                />
              </Grid>

              <Grid item>
                <TextField
                  autoFocus
                  fullWidth
                  label="Due Date"
                  name="dueDate"
                  onChange={this.handleChange}
                />
              </Grid>

              <Grid item>
                <TextField
                  autoFocus
                  fullWidth
                  label="Course ID"
                  name="courseId"
                  onChange={this.handleChange}
                />
              </Grid>
            </Grid>
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={this.handleCloseDialog}>Cancel</Button>
              <Button color="primary" onClick={this.handleSubmit}>Add</Button>
            </DialogActions>
          </Dialog>      
      </div>             
    );
  }
}

NewAssignment.propTypes = {
  onAddAssignment: PropTypes.func.isRequired
}
