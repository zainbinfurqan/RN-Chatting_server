import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "../Screens/Home";
import Chat from "../Screens/Chat";
import Users from "../Screens/Users";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/users" component={Users} />
        <Route path="/chat" component={Chat} />
      </Switch>
    </Router>
  );
}
