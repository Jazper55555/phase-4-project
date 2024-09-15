import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./Home"
import NavBar from "./NavBar";

function App() {
  return (
    <>
    <header>  
      <NavBar/>
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
