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
          <Home />
        </Route>
      </Switch>
    </main>
    </>
  );
}

export default App;
