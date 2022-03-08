import $ from 'jquery';
import {apiAddresses} from '../../../appInfo';
import alertMessages from '../../../alertMessages';

const setUp = () => $.ajaxSetup({
  xhrFields: {
      withCredentials: true
  }
});

const checkLoggedIn = (setLoggedIn) => {
  setUp();
  $.post({
    url: apiAddresses.checkLoggedIn,
    success: () => setLoggedIn(true)});
}

const login = (email, googleId, setLoggedIn, setAlert) => {
  setUp();
  $.post({
    url: apiAddresses.login,
    data: {email: email, google_id: googleId},
    success: () => {
      setLoggedIn(true);
      setAlert({});
    },
    error: res => setAlert(alertMessages[res.responseJSON['error_key']])});
}

const logout = (setLoggedIn) => {
  setUp();
  $.post({
    url: apiAddresses.logout,
    success: () => {setLoggedIn(false); console.log('done');},
    complete: () => console.log('done now')});
}

const register = (userInfo, setLoggedIn, setAlert) => {
  setUp();
  $.post({
    url: apiAddresses.register,
    data: userInfo,
    success: () => login(userInfo.email, userInfo.google_id, setLoggedIn),
    error: res => setAlert(alertMessages[res.responseJSON['error_key']])});
}

export {login, logout, register, checkLoggedIn};
