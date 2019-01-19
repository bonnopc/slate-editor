import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import HomeComponent from "../modules/home/components/HomeComponent";

class App extends Component {
  render() {
    return (
        <Switch>
            <Route path="/" component={HomeComponent} />
        </Switch>
    );
  }
}

export default withRouter(App);
