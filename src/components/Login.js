import React, { Component } from 'react';
import {SERVER_URL} from '../constants.js'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';

class Login extends Component {
    constructor(props) {
      super(props);
    };
 
  componentDidMount() {
    this.fetchUser();
  }
 
  fetchUser = () => {
    console.log("FETCH");
    const token = Cookies.get('XSRF-TOKEN');
    fetch(SERVER_URL + '/user', 
      {  
        method: 'GET', redirect: 'follow', 
        headers: { 'X-XSRF-TOKEN': token }, 
        credentials: 'include'
      } )
    .catch(err => {
      console.error(err);
      } );
    }
  
  render() {
        return ( <a align="left" href={SERVER_URL + '/oauth2/authorization/google'}>Login using Google</a> ); 
  }
}
export default Login;