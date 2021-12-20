import React from "react";

export default function Survey() {
  return (
    <div>
      <h2>Please answer the following questions for a better Semantically experiene.</h2>
      <div className="mt-5">
        <div class="card mb-5">
          <div class="card-content">
            <div class="content">
              Who are you?
              <br />
            </div>
          </div>
          <footer class="card-footer control">
            <label class="radio card-footer-item">
              <input type="radio" name="q1" />
              <span className="ml-3">Developer</span>
            </label>
            <label class="radio card-footer-item">
              <input type="radio" name="q1" />
              <span className="ml-3">Researcher</span>
            </label>
            <label class="radio card-footer-item">
              <input type="radio" name="q1" />
              <span className="ml-3">Other</span>
            </label>
          </footer>
        </div>
        <div class="card mb-5">
          <div class="card-content">
            <div class="content">
              What is the highest level of education?
              <br />
            </div>
          </div>
          <footer class="card-footer control">
            <label class="radio card-footer-item">
              <input type="radio" name="q2" />
              <span className="ml-3">Bachelors</span>
            </label>
            <label class="radio card-footer-item">
              <input type="radio" name="q2" />
              <span className="ml-3">Masters</span>
            </label>
            <label class="radio card-footer-item">
              <input type="radio" name="q2" />
              <span className="ml-3">PhD</span>
            </label>
            <label class="radio card-footer-item">
              <input type="radio" name="q2" />
              <span className="ml-3">Other</span>
            </label>
          </footer>
        </div>
        <div class="card mb-5">
          <div class="card-content">
            <div class="content">
              What will be your primary domain of interest?
              <br />
            </div>
          </div>
          <footer class="card-footer control">
            <label class="radio card-footer-item">
              <input type="radio" name="q3" />
              <span className="ml-3">Biomedical</span>
            </label>
            <label class="radio card-footer-item">
              <input type="radio" name="q3" />
              <span className="ml-3">Other</span>
            </label>
          </footer>
        </div>
        <div className="text-center">
        <button class="button is-primary is-medium d-inline" onClick={() => {window.location.href = "http://localhost:3001";}}>Submit</button>
        </div>
      </div>
    </div>
  )
}
