import React from 'react';
import { useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import '../LogRegPage.css'
const Home = () => {

    const singOut = useSignOut();
    const navitage = useNavigate();

    const logout = () => {
        singOut();
        navitage("/login")
    }

    return (
        <div>
            zoortt
            <button onClick={logout}>ÇIKIŞ YAP</button>
        </div>
    );
}

export default Home;
