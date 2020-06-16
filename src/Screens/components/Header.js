import React from "react";
import { Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";

function Header(props) {
  const otherUser = JSON.parse(localStorage.getItem("otherUser") || {});
  const user = JSON.parse(localStorage.getItem("user") || {});

  function handleLogout() {
    props.history.replace("/");
  }

  return (
    <div id="header-container">
      <span>Chatting with {otherUser.name}</span>
      <div className="d-flex align-items-center">
        <span className="mr-2">{user.name}</span>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
}

export default withRouter(Header);
