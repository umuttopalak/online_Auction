import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const Register = () => {

    const [username, setUsername] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        let user = {
            'username': username,
            'mail': mail,
            'password': password
        }

        const options = {
            url: 'http://localhost:8000/api/register',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            data: user
        };


        axios(options)
            .then(response => {
                if (response.status === 201) {
                    alert("yeyyy")
                }
            }).catch((error) => {
                if(error.response.status === 400){
                    alert("o_O")
                }
            })

    }

    return (
        <div className='App'>
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="card bg-white">
                                <div className="card-body p-5">
                                    <form className="mb-3 mt-md-4" onSubmit={handleSubmit}>
                                        <h2 className="fw-bold mb-2 text-uppercase ">Sign Up</h2>
                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label ">Username</label>
                                            <input value={username} onChange={e => setUsername(e.target.value)} type="text" className="form-control" id="username" placeholder="example" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label ">Email address</label>
                                            <input value={mail} onChange={e => setMail(e.target.value)} type="email" className="form-control" id="mail" placeholder="name@example.com" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label ">Password</label>
                                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="*******" />
                                        </div>
                                        <div className="d-grid">
                                            <button className="btn btn-outline-dark" type="submit">Register</button>
                                        </div>
                                    </form>
                                    <div>
                                        <p className="mb-0  text-center">Do you have an account? <Link to="/login" className="text-primary fw-bold">Sign In</Link></p>
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

export default Register;
