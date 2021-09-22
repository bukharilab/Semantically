import React from "react";
import { GoogleLogin } from 'react-google-login';
import {Redirect} from 'react-router-dom';

export default function Register() {
  const [isRegistered, setIsRegistered] = React.useState(false);
  return (
    <div className="container pt-6">
      <div className="columns is-centered">
        <div className="column is-9-tablet is-8-desktop is-7-widescreen">
          <form action="" class="box">
          <div className="text-center mb-4">
          <div className="d-inline">
            <GoogleLogin
              clientId="747358695027-vehsgoqad55lbl5jmdfbef9qm6ff4v7i.apps.googleusercontent.com"
              buttonText={"Sign Up"}
              onSuccess={(data) => {
                console.log(data);
                setIsRegistered(true);
              }}
              onFailure={null}
              isSignedIn={true}
              />
              {isRegistered ? <Redirect to='/survey'/> : null}
          </div>
          </div>
          <div class="field is-horizontal">
  <div class="field-body">
  <div className="field">
    <label for="" className="label">Name</label>
    <div className="control has-icons-left">
      <input type="text" className="input" placeholder="e.g. Bob Smith" required />
      <span className="icon is-small is-left">
        <i className="fa fa-user"></i>
      </span>
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
  </div>
</div>

<div class="field is-horizontal">
<div class="field-body">
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
              <label for="" className="label">Repeat Password</label>
              <div className="control has-icons-left">
                <input type="password" placeholder="*******" className="input" required />
                <span className="icon is-small is-left">
                  <i className="fa fa-lock"></i>
                </span>
              </div>
            </div>
      </div>
      </div>
            <div className="field pt-4 text-center">
              <button className="button is-primary">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
