import React from "react";
import { GoogleLogin } from 'react-google-login';

export default function Login() {
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  return (
    <div className="container pt-6">
      <div className="columns is-centered">
        <div className="column is-7-tablet is-6-desktop is-5-widescreen">
          <form action="" class="box">
            <div className="text-center mb-4">
            <div className="d-inline">
              <GoogleLogin
                clientId="747358695027-vehsgoqad55lbl5jmdfbef9qm6ff4v7i.apps.googleusercontent.com"
                buttonText={"Sign in"}
                onSuccess={(data) => {
                  console.log(data);
                  // window.location.href = "http://localhost:3001";
                  setIsSignedIn(true);
                }}
                onFailure={null}
                isSignedIn={true}
                />
            </div>
            </div>
            <div className="field">
              <label for="" className="label">Email</label>
              <div className="control has-icons-left">
                <input type="email" placeholder="e.g. bobsmith@gmail.com" className="input" required />
                <span className="icon is-small is-left">
                  <i className="fa fa-envelope"></i>
                </span>
              </div>
            </div>
            <div className="field">
              <label for="" className="label">Password</label>
              <div className="control has-icons-left">
                <input type="password" placeholder="*******" className="input" required />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock"></i>
                </span>
              </div>
            </div>
            <div className="field">
              <label for="" className="checkbox">
                <input type="checkbox" />{'  '}
               Remember me
              </label>
            </div>
            <div className="field pt-4 text-center">
              <button className="button is-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
