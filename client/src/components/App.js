import React, { useEffect, useState } from "react";
import { Link, Switch, Route } from "react-router-dom";

import Home from "./Home"

function App() {
  return (
    <>
    <header>
      <h1>NavBar</h1>
    </header>
    <main>
      <Switch>
        <Route exact path="/">
          <h1>Phase 4 Project</h1>
        </Route>
        <Route exact path="/Home">
          <Home />
        </Route>
      </Switch>
    </main>
    </>
  );
}

export default App;
