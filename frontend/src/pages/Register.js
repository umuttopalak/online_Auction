import React from 'react';
import { Link } from 'react-router-dom';


const handleSubmit = () => {
    // fetch()
    const url = 'http://localhost:8000/register';
    const options = {
        method: 'POST',
        body: {
            "username": "string",
            "mail": "string",
            "password": "string"
        },
        headers: {
            "Content-Type": "application/json",
        },
    };

    fetch(url, options)
        .then(response => {
            console.log(response.status);
        });
}

const Register = () => {



    return (
        <div classNameName="App ">
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <div className="container">
                    <div className="row d-flex justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="card bg-white">
                                <div className="card-body p-5">
                                    <form onSubmit={
                                        (e) => {
                                            e.preventDefault();
                                            handleSubmit()
                                        }} className="mb-3 mt-md-4">
                                        <h2 className="fw-bold mb-2 text-uppercase ">Sign Up</h2>

                                        <div className="mb-3">
                                            <label for="username" className="form-label ">Username</label>
                                            <input type="text" className="form-control" id="username" placeholder="example" />
                                        </div>

                                        <div className="mb-3">
                                            <label for="email" className="form-label ">Email address</label>
                                            <input type="email" className="form-control" id="email" placeholder="name@example.com" />
                                        </div>


                                        <div className="mb-3">
                                            <label for="password" className="form-label ">Password</label>
                                            <input type="password" className="form-control" id="password" placeholder="*******" />
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
