import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

function NavBar() {
    return(
        <nav className="navbar">
            <div className="logo">
            <NavLink to='/' className="nav-item">
                Percussion Playground
            </NavLink>
            </div>
            <div className="nav-links">
            <NavLink to='/create-account' className="nav-item">
                Create Account
            </NavLink>
            <NavLink to='/instruments' className="nav-item">
                Instruments
            </NavLink>
            <NavLink to='/members' className="nav-item">
                Members
            </NavLink>
            </div>
        </nav>
    )
}

export default NavBar