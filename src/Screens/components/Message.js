import React from "react";
import { ListGroupItem } from "react-bootstrap";

function Message(props) {
  let backgroundColor = "#3498db";
  let alignSelf = "flex-end";

  if (props.type === "other") {
    backgroundColor = "#2ecc71";
    alignSelf = "flex-start";
  }

  return (
    <ListGroupItem
      className="my-1"
      style={{ backgroundColor, color: "white", width: "80%", alignSelf }}
    >
      {props.children}
    </ListGroupItem>
  );
}

export default Message;
