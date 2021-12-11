import React, {useEffect} from "react";
import { GoogleLogin } from 'react-google-login';
import {Redirect} from 'react-router-dom';
import {logout} from './hooks/authenticate';

export default function Logout({loggedIn, setLoggedIn}) {
  useEffect(() => logout(setLoggedIn), []);
  return <>{loggedIn ? null : <Redirect to="/login" />}</>
};
