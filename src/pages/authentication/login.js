import React, {useState} from "react";
import { GoogleLogin } from 'react-google-login';
import {Redirect, Link} from 'react-router-dom';
import {login} from './hooks/authenticate';
import {Col,Row, Image, Card} from "react-bootstrap";


export default function Login({loggedIn, setLoggedIn, setAlert}) {
  return (
    <>
   
    
      {
        loggedIn ?
        <Redirect to="/" /> :
        <div className="text-center">
           <div class="card container w-25 text-center py-3 mt-5">
           <Image width="300" src="logo.png" style={{marginTop:'0px', marginBottom:'0px'}} />
           </div>
           
          <div class="card container w-25 text-center py-3 mt-5">
            <div class="card-body">
            {/* Google authentication */}
            <GoogleLogin
              clientId="747358695027-vehsgoqad55lbl5jmdfbef9qm6ff4v7i.apps.googleusercontent.com"
              buttonText={"Sign in"}
              onSuccess={(data) => {
                console.log(data);
                const email = data.profileObj.email;
                const googleId = data.profileObj.googleId;
                login(email, googleId, setLoggedIn, setAlert);
              }}
              onFailure={null}
              isSignedIn={loggedIn}
              />
            </div>
          </div>
          <p className="text-muted mt-2">Not registered? <Link to="/register">click here!</Link></p>
        </div>
      }
    </>
  );
}
