import { NavLink, useHistory } from "react-router-dom";

function NavBar({user, onLogout}) {
    const history = useHistory()

    const handleProfileClick = () => {
        if (user) {
            history.push(`/members/${user.id}`)
        }
    }

    return(
        <nav className="navbar">
            <div className="logo">
            <NavLink to='/'>
                <div className="logo-content">
                    <img src='https://www.shutterstock.com/image-vector/drum-sticks-crossed-vector-black-600nw-1634223691.jpg' alt='drumsticks logo' className="logo-image"/>
                    <span>Percussion Playground</span>
                </div>
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
            {!user && (
            <NavLink to="/sign-in" className="nav-item">
            Sign In
            </NavLink>
            )}
            {user && (
            <div>
            <button onClick={handleProfileClick} className="nav-item">My Profile</button>
            <button onClick={onLogout} className="nav-item logout-button">Logout</button>
            </div>
            )}
            </div>
        </nav>
    )
}

export default NavBar