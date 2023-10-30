import React from 'react';
import {NavLink} from "react-router-dom";

function Nav(props){
    const logout = async () => {
      await fetch('http://localhost:8000/user/logout/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      });

      props.setDisplayName('');
      props.setRole('');

    }

    let menu;

    // Not logged in
    if (props.displayName === undefined) {
        menu = (
          <div className="container-fluid">
            <ul className="flex space-x-4">
              <li className="nav-item active">
                <NavLink to="/login" className="nav-link">Login</NavLink>
              </li>
              <li className="nav-item active">
                <NavLink to="/register" className="nav-link">Register</NavLink>
              </li>
            </ul>
          </div>
        )
    } else {
      
        menu = (
          <div className="container-fluid flex items-center">
            <NavLink to="/" className="navbar-link" onClick={logout}>Logout</NavLink>
            <ul className="navbar-nav ml-auto flex space-x-4">
          
              <li className="nav-item active">{props.displayName}</li>
              <li className="nav-item active">{props.role}</li>
            </ul>
          </div>

        )
    }

    return (
        <nav>
          {menu}
        </nav>
    );
};

export default Nav;