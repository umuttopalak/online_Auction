import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useSignIn } from 'react-auth-kit';



const Login = () => {

    const [email, setMail] = useState("");
    const [password, setPassword] = useState("");
    const signIn = useSignIn();
    


    const handleSubmit = (e) => {
        e.preventDefault();

        try {
            axios.post('http://localhost:8000/api/auth/token',
                `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            ).then((response) => {
                console.log(response.data);
                signIn({
                    token: response.data.access_token,
                    expiresIn: 300,
                    tokenType: response.data.token_type,
                    authState: { email: email }
                })
            }).catch((error) => {
                console.error(error);
            });
        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        <div className='App'>
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="card bg-white">
                                <div className="card-body p-5">
                                    <form onSubmit={handleSubmit} className="mb-3 mt-md-4">
                                        <h2 className="fw-bold mb-2 text-uppercase ">Sign In</h2>
                                        <p className=" mb-5">Please enter your email and password!</p>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label ">Email address</label>
                                            <input value={email} onChange={e => setMail(e.target.value)} type="email" className="form-control" id="email" placeholder="name@example.com" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label ">Password</label>
                                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="*******" />
                                        </div>
                                        <div className="d-grid">
                                            <button className="btn btn-outline-dark" type="submit">Login</button>
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
