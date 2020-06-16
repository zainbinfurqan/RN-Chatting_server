import React from "react";
import { ListGroupItem } from "react-bootstrap";

function User(props) {
  return (
    <ListGroupItem onClick={() => props.onClick(props.data)}>
      {props.children}
    </ListGroupItem>
  );
}

User.defaultProps = {
  onClick: function() {}
};

export default User;
