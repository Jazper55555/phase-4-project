import { Switch, Route } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

import Home from "./Home"
import NavBar from "./NavBar";
import Members from "./Members";
import Instruments from "./Instruments";
import CreateAccount from "./CreateAccount";
import InstrumentDetails from "./InstrumentDetails";
import MemberDetails from "./MemberDetails";
import SignIn from "./SignIn";
import AddReview from "./AddReview";
import EditReview from "./EditReview";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); 
  };

  return (
    <>
    <header>  
      <NavBar user={user} onLogout={handleLogout}/>
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
          {user && <EditReview user={user} />}
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
        </Route>
      </Switch>
    </main>
    </>
  );
}

export default App;
