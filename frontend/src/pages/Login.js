import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';


const Login = () => {

    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();

        let user = {
            'mail': mail,
            'password': password
        }

        const options = {
            
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: user
        }

       
    }

    return (
        <div className="App ">
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="card bg-white">
                                <div className="card-body p-5">
                                    <form className="mb-3 mt-md-4">
                                        <h2 className="fw-bold mb-2 text-uppercase ">Sign In</h2>
                                        <p className=" mb-5">Please enter your email and password!</p>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label ">Email address</label>
                                            <input value={mail} onChange={e => setMail(e.target.value)} type="mail" className="form-control" id="mail" placeholder="name@example.com" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label ">Password</label>
                                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="*******" />
                                        </div>
                                        <div className="d-grid">
                                            <button onSubmit={handleSubmit} className="btn btn-outline-dark" type="submit">Login</button>
                                        </div>
                                    </form>
                                    <div>
                                        <p className="mb-0  text-center">Don't have an account? <Link to="/register" className="text-primary fw-bold">Sign Up</Link></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
