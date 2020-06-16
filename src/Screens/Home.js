import React, { useState } from "react";
import {
  Container,
  Form,
  InputGroup,
  FormControl,
  Button
} from "react-bootstrap";
import Swal from "sweetalert2";

import Loader from "./components/Loader";
import constants from "../config/constants";

function Home(props) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await fetch(
        `${constants.BASE_URL}/api/user?name=${name}`
      );
      const json = await response.json();
      console.log(json.data)

      if (response.status !== 200) {
        throw new Error(json.message);
      }

      localStorage.setItem("user", JSON.stringify(json.data));

      props.history.push("/users");
    } catch (e) {
      Swal.fire("Error!", e.message, "error");
    }

    setIsLoading(false);
  }

  function handleChange(e) {
    setName(e.target.value);
  }

  return (
    <Container className="h-100vh d-flex justify-content-center align-items-center">
      <Form onSubmit={handleSubmit} className="w-100">
        <InputGroup>
          <FormControl
            value={name}
            onChange={handleChange}
            type="text"
            placeholder="Enter your name..."
          />
          <Button type="submit">Submit</Button>
        </InputGroup>
      </Form>
      {isLoading && <Loader />}
    </Container>
  );
}

export default Home;
