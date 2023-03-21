import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    
const handleSubmit = () => {
    alert("zuhahaha")
}
    
    return (
        <div className="App ">
            <div class="vh-100 d-flex justify-content-center align-items-center">
                <div class="container">
                    <div class="row d-flex justify-content-center">
                        <div class="col-12 col-md-8 col-lg-6">
                            <div class="card bg-white">
                                <div class="card-body p-5">
                                    <form onSubmit={handleSubmit} class="mb-3 mt-md-4">
                                        <h2 class="fw-bold mb-2 text-uppercase ">Sign In</h2>
                                        <p class=" mb-5">Please enter your email and password!</p>
                                        <div class="mb-3">
                                            <label for="email" class="form-label ">Email address</label>
                                            <input type="email" class="form-control" id="email" placeholder="name@example.com" />
                                        </div>
                                        <div class="mb-3">
                                            <label for="password" class="form-label ">Password</label>
                                            <input type="password" class="form-control" id="password" placeholder="*******" />
                                        </div>
                                        <div class="d-grid">
                                            <button class="btn btn-outline-dark" type="submit">Login</button>
                                        </div>
                                    </form>
                                    <div>
                                        <p class="mb-0  text-center">Don't have an account? <Link to="/register" class="text-primary fw-bold">Sign Up</Link></p>
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
