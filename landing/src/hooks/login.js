import $ from 'jquery';

const login = (email, password) => {
  // call login api: https://semantically.risonstudio.com/api/login.php
  $.ajax({url: 'https://semantically.risonstudio.com/api/login.php', data: {email: email}, success: (data) => {
    // parse token from response

    // set token cookie

  }, error: (errorcode) => console.log('error')});

}

export default login;
