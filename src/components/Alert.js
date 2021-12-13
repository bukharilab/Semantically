import React, {useState} from 'react';
import {Alert} from 'react-bootstrap';

const AlertMessage = ({alert, setAlert}) => {
  const [show, setShow] = useState(true);
  const close = () => {
    setShow(false);
    setAlert({});
  }
  const {header, message, type} = alert;

  return (
    <Alert className="container my-2" variant={type ? type : 'warning'} onClose={close} dismissible>
        <Alert.Heading>{header}</Alert.Heading>
        <p>{message}</p>
    </Alert>
  )
};

export default AlertMessage;
