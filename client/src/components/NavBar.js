import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

function NavBar() {
    return(
        <nav className="navbar">
            <NavLink to='/home' className="nav-item">
                Home
            </NavLink>
            <NavLink to='/' className="nav-item">
                Phase 4 Project
            </NavLink>
        </nav>
    )
}

export default NavBar