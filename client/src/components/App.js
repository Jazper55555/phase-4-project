import { Switch, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./Home"
import NavBar from "./NavBar";
import Members from "./Members";
import Instruments from "./Instruments";
import CreateAccount from "./CreateAccount";
import InstrumentDetails from "./InstrumentDetails";
import MemberDetails from "./MemberDetails";
import SignIn from "./SignIn";
import AddReview from "./AddReview";

function App() {
  const [user, setUser] = useState(null)

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
        <Route exact path="/members">
          <Members />
        </Route>
        <Route exact path="/members/:id">
          <MemberDetails />
        </Route>
        <Route exact path="/instruments">
          <Instruments />
        </Route>
        <Route exact path="/instruments/:id">
          <InstrumentDetails />
          {user && <AddReview user={user} />}
        </Route>
        <Route exact path="/create-account">
          <CreateAccount />
        </Route>
        <Route exact path='/sign-in'>
          <SignIn setUser={setUser} />
          {user && <AddReview user={user} />}
        </Route>
      </Switch>
    </main>
    </>
  );
}

export default App;
