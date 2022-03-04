<?php

  function success_message($message) {
    http_response_code(200);
    echo json_encode(array('message' => $message));
  }

  function success_response($response) {
    http_response_code(200);
    echo json_encode($response);
  }

  function error_message($message, $status_code) {
    http_response_code($status_code);
    echo json_encode(array('error' => $message));
  }

	function post_request_error() {
    error_message("Only POST requests are accepted", 400);
  }

	function user_id_error() {
    error_message("User id not given", 400);
  }

	function invalid_argument_error() {
    error_message("Invalid request arguments", 400);
  }

  function system_error($error) {
    error_message($error, 500);
  }


