import React, { Component } from "react";
import {
  Container,
  ListGroup,
  Form,
  InputGroup,
  FormControl,
  Button
} from "react-bootstrap";
import io from "socket.io-client";
import Header from "./components/Header";
import Swal from "sweetalert2";

import Loader from "./components/Loader";
import constants from "../config/constants";
import Message from "./components/Message";

const GLOBAL = {};

class Chat extends Component {
  state = {
    messages: [],
    message: "",
    isLoading: false
  };

  async componentDidMount() {
    await this.fetchMessages();
    this.setupListener();
  }

  fetchMessages = async () => {
    try {
      const room = JSON.parse(localStorage.getItem("room"));
      const user = JSON.parse(localStorage.getItem("user"));
      const otherUser = JSON.parse(localStorage.getItem("otherUser"));

      const body = {
        room: room._id,
        user: user._id
      };
      // const body = {
      //   reciever: otherUser._id,
      //   sender: user._id
      // };

      console.log(body)

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      };

      const response = await fetch(
        `${constants.BASE_URL}/api/chat/message`,
        options
      );
      const json = await response.json();
      console.log(json)
      this.setState({ messages: json.messages });
    } catch (e) {
      Swal.fire("Error!", e.message, "error");
    }

    return { message: "success" };
  };

  setupListener = () => {
    const socket = io(`${constants.BASE_URL}/chat`);
    GLOBAL.socket = socket;

    const room = JSON.parse(localStorage.getItem("room"));
    const user = JSON.parse(localStorage.getItem("user"));

    const payload = {
      sender: user._id,
      room: room._id
    };

    socket.on("connect", () => {
      socket.emit("room-join", payload);
    });

    socket.on("new-message", payload => {
      console.log(payload)
      const { messages } = this.state;
      console.log(messages)
      this.setState({
        messages: [
          ...messages,
          { message: payload, user: payload.user }
        ]
      });
    });
  };

  handleChange = e => {
    this.setState({ message: e.target.value });
  };

  sendMessage = async e => {
    const { messages, message } = this.state;
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const room = JSON.parse(localStorage.getItem("room"));
    const otherUser = JSON.parse(localStorage.getItem("otherUser"));

    // const payload = {
    //   message,
    //   sender: user._id,
    //   room: room._id,
    //   reciever: otherUser._id
    // };
    const payload = {
      message,
      userId: user._id,
      room: room._id,
    };

    this.setState({ messages: [...messages, { message, userId: user._id }] });
    GLOBAL.socket.emit("new-message", payload);
  };

  render() {
    const { messages, message } = this.state;
    const user = JSON.parse(localStorage.getItem("user"))._id;
    console.log(messages)
    console.log(user)

    return (
      <Container className="h-100vh d-flex flex-column">
        <Header />
        <ListGroup
          className="my-2 d-flex flex-column flex-grow-1"
          style={{ overflowY: "auto" }}
        >
          {messages.map(item => {
            console.log("item.user =>", item.userId);
            console.log("user =>", user);
            console.log("item.user === user =>", item.userId === user);

            return (
              <Message type={item.userId === user ? "self" : "other"}>
                {item.message}
              </Message>
            );
          })}
        </ListGroup>
        <Form onSubmit={this.sendMessage} className="my-2">
          <InputGroup>
            <FormControl
              value={message}
              onChange={this.handleChange}
              type="text"
              placeholder="Enter message..."
            />
            <Button type="submit">Send</Button>
          </InputGroup>
        </Form>
      </Container>
    );
  }
}

// function Chat() {
//   console.log("chat");
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([{ message: "I" }]);

//   useEffect(() => {
//     handleMount();
//   }, []);

//   function handleMount() {
//     console.log("mount");
//     const socket = io("http://localhost:5000/chat");
//     GLOBAL.socket = socket;

//     const room = JSON.parse(localStorage.getItem("room"));
//     const user = JSON.parse(localStorage.getItem("user"));

//     const payload = {
//       user: user._id,
//       room: room._id
//     };

//     console.log(payload);
//     socket.on("connect", () => {
//       socket.emit("room-join", payload);
//     });

//     socket.on("new-message", handleNewMessage);
//   }

//   function handleNewMessage(payload) {
//     console.log("new Message =>", payload);
//     console.log("messages =>", messages);
//     setMessages([...messages, { message: payload.message }]);
//   }

//   function handleChange(e) {
//     setMessage(e.target.value);
//   }

//   async function sendMessage(e) {
//     e.preventDefault();

//     console.log("GLOBAL =>", GLOBAL);
//     const user = JSON.parse(localStorage.getItem("user"));
//     const room = JSON.parse(localStorage.getItem("room"));
//     const otherUser = JSON.parse(localStorage.getItem("otherUser"));

//     const payload = {
//       message,
//       user: user._id,
//       room: room._id,
//       otherUser: otherUser._id
//     };

//     console.log("payload =>", payload);
//     console.log("messages =>", messages);
//     setMessages([...messages, { message }]);
//     GLOBAL.socket.emit("new-message", payload);
//   }

//   return (
//     <Container className="h-100vh d-flex flex-column">
//       <ListGroup
//         className="my-2 d-flex flex-column flex-grow-1"
//         style={{ overflowY: "auto" }}
//       >
//         {messages.map(item => (
//           <Message>{item.message}</Message>
//         ))}
//       </ListGroup>
//       <Form onSubmit={sendMessage} className="my-2">
//         <InputGroup>
//           <FormControl
//             value={message}
//             onChange={handleChange}
//             type="text"
//             placeholder="Enter message..."
//           />
//           <Button type="submit">Send</Button>
//         </InputGroup>
//       </Form>
//     </Container>
//   );
// }

export default Chat;
