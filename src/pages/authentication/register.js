import React from "react";
import { GoogleLogin } from 'react-google-login';
import {Redirect, Link} from 'react-router-dom';
import {register} from './hooks/authenticate';

export default function Register({loggedIn, setLoggedIn, setAlert}) {
  return (
    <>
      {
        loggedIn ?
        <Redirect to="/" /> :
        <div className="text-center">
          <div class="card container w-25 text-center py-3 mt-5">
            <div class="card-body">
            {/* Google authentication */}
            <GoogleLogin
              clientId="747358695027-vehsgoqad55lbl5jmdfbef9qm6ff4v7i.apps.googleusercontent.com"
              buttonText={"Register"}
              onSuccess={(data) => {
                console.log(data);
                const userInfo = {
                  email: data.profileObj.email,
                  first_name: data.profileObj.givenName,
                  last_name: data.profileObj.familyName,
                  img_url: data.profileObj.imageUrl,
                  google_id: data.profileObj.googleId
                };
                register(userInfo, setLoggedIn, setAlert);
              }}
              onFailure={null}
              isSignedIn={loggedIn}
              />
            </div>
          </div>
          <p className="text-muted mt-2">Already registered? <Link to="/login">click here!</Link></p>
        </div>
      }
    </>
  );
}
