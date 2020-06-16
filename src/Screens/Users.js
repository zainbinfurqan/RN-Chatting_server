import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";

import Loader from "./components/Loader";
import constants from "../config/constants";
import User from "./components/User";

function Users(props) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      setIsLoading(true);

      const response = await fetch(
        // `${constants.BASE_URL}/api/users?user=${user._id}`
        `${constants.BASE_URL}/api/user/users`
      );
      const json = await response.json();
      console.log(json)
      if (response.status !== 200) {
        throw new Error(json.message);
      }

      setUsers(json.data);
    } catch (e) {
      Swal.fire("Error!", e.message, "error");
    }

    setIsLoading(false);
  }

  async function handleClick(otherUser) {
    try {
      setIsLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user)
      const body = {
        sender: user._id,
        receiver: otherUser._id
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      };

      const response = await fetch(`${constants.BASE_URL}/api/chat/room`, options);
      // const response = await fetch(`${constants.BASE_URL}/chat`, options);
      const json = await response.json();

      if (response.status !== 200) {
        throw new Error(json.message);
      }

      console.log(json);
      localStorage.setItem("room", JSON.stringify(json.room));
      localStorage.setItem("otherUser", JSON.stringify(otherUser));

      props.history.push("/chat");
    } catch (e) {
      Swal.fire("Error!", e.message, "error");
    }

    setIsLoading(false);
  }

  return (
    <Container className="my-2">
      {users.map(item => (
        <User key={item._id} data={item} onClick={handleClick}>
          {item.firstName}
        </User>
      ))}
      {isLoading && <Loader />}
    </Container>
  );
}

export default Users;
