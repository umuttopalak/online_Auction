import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useSignIn } from 'react-auth-kit'
import '../LogRegPage.css'
import { useNavigate } from 'react-router-dom';

const LogReg = () => {

    const [showError, setError] = useState('')
    const [username, setUsername] = useState();
    const [email, setMail] = useState("");
    const [password, setPassword] = useState("");
    const signIn = useSignIn();
    const navigate = useNavigate();


    const register = (e) => {
        e.preventDefault();
        let user = {
            'username': username,
            'mail': email,
            'password': password
        }

        const options = {
            url: 'http://localhost:8000/api/user/register',
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
                if (error.response.status === 400) {
                    alert("o_O")
                }
            })

    }


    const login = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/user/auth/token',
            `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then((res) => {
                if (res.status === 200) {
                    if (signIn(
                        {
                            token: res.data.token,
                            expiresIn: 3600,
                            tokenType: res.data.tokenType,
                            authState: { 'username:': res.data.username },
                        }
                    )) { // Only if you are using refreshToken feature
                        navigate('/home');
                    } else {
                        //Throw error
                    }
                }
            }).catch((axiosError) => {
                if (axiosError.response) {
                    if (axiosError.response.status === 401) {
                        console.log(axiosError);
                        setError(true);
                    }
                } else if (axiosError.request) {
                    // İstek gönderilirken bir hata oluştu
                    console.log(axiosError.request);
                    console.log("abo")
                } else {
                    // Diğer hatalar
                    console.log('Error', axiosError.message);
                }
            })
    }

    return (
        <div className="section">
            <div className="container">
                <div className="row full-height justify-content-center">
                    <div className="col-12 text-center align-self-center py-5">
                        <div className="section pb-5 pt-5 pt-sm-2 text-center">
                            <h6 className="mb-0 pb-3"><span>Log In </span><span>Sign Up</span></h6>
                            <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" />
                            <label for="reg-log"></label>
                            <div className="card-3d-wrap mx-auto a">
                                <div className="card-3d-wrapper">
                                    <div className="card-front">
                                        <div className="center-wrap">
                                            <form onSubmit={login} >
                                                <div className="section text-center">
                                                    <h4 className="mb-4 pb-3">Log In</h4>
                                                    <div className="form-group">
                                                        <input value={email} onChange={e => setMail(e.target.value)} type="email" name="email" className="form-style" placeholder="Your Email" id="email" autocomplete="off" />
                                                        <i className="input-icon uil uil-at"></i>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" className="form-style" placeholder="Your Password" id="password" autocomplete="off" />
                                                        <i className="input-icon uil uil-lock-alt"></i>
                                                    </div>
                                                    <br />
                                                    {showError && <p style={{ color: 'red' }}>Email or Password is Incorrect</p>}
                                                    <button className="btn mt-4" type='submit'>Submit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="card-back">
                                        <div className="center-wrap">
                                            <form onSubmit={register}>
                                                <div className="section text-center">
                                                    <h4 className="mb-4 pb-3">Sign Up</h4>
                                                    <div className="form-group">
                                                        <input value={username} onChange={e => setUsername(e.target.value)} type="text" name="username" className="form-style" placeholder="Your Username" id="username" autocomplete="off" />
                                                        <i className="input-icon uil uil-user"></i>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input value={email} onChange={e => setMail(e.target.value)} type="email" name="email" className="form-style" placeholder="Your Email" id="email" autocomplete="off" />
                                                        <i className="input-icon uil uil-at"></i>
                                                    </div>
                                                    <div className="form-group mt-2">
                                                        <input value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" className="form-style" placeholder="Your Password" id="password" autocomplete="off" />
                                                        <i className="input-icon uil uil-lock-alt"></i>
                                                    </div>
                                                    <button className='btn mt-4' type='submit' onSubmit={register}>Register</button>
                                                </div>
                                            </form>
                                        </div>
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

export default LogReg;
