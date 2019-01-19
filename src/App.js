import React, { Component } from 'react';
import { BrowserRouter } from "react-router-dom";
import Route from "../src/route";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route/>
      </BrowserRouter>
    );
  }
}

export default App;