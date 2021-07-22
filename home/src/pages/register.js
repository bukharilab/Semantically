import React from "react";

export default function Register() {
  return (
    <div className="container pt-6">
      <div className="columns is-centered">
        <div className="column is-9-tablet is-8-desktop is-7-widescreen">
          <form action="" class="box">
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
