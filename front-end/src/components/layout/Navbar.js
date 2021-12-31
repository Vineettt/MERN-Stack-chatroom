/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useContext} from 'react'
import { UserContext } from "../../UserContext";
import SignInMenu from './SignInMenu';
import SignOutMenu from './SignOutMenu';

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);

    const logout = async () =>{
        try {
            const res = await fetch("http://localhost:5000/logout", {
                credentials: "include",
                headers: { "Content-type": "application/json" },
              });
              const data = await res.json();
              setUser(null);
        } catch (error) {
            console.log(error);
        }
    }

    const menu = user?<SignInMenu logout={logout} />:<SignOutMenu/>

    return (
        <>
        <nav className='green'>
            <div className="nav-wrapper">
                <a href="/" className="brand-logo">Chat</a>
                <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                {menu}
                </ul>
            </div>
        </nav>
          <ul className="sidenav" id="mobile-demo">
            {menu}
        </ul>
           </>     
    )
}

export default Navbar
