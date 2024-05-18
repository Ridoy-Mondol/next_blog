"use client"
import React, { useState } from 'react';
import img from "@/app/Images/signin-image.jpg";
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import TokenExpired from '../hooks/TokenExpired';

const Login = () => {
    const [error, setError] = useState({});
    const [isChecked, setIsChecked] = useState(false);
    const [value, setValue] = useState({
        email: "",
        password: "",
    });

    const InputValue = (event) => {
        const { name, value } = event.target;
        setValue(prevValue => ({
            ...prevValue,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formError = validate();
        setError(formError);
        if (Object.keys(formError).length === 0 && isChecked) {
            try {
                const response = await fetch("http://localhost:3000/api/users/login", {
                    method: "POST",
                    body: JSON.stringify(value),
                });
                 console.log("res", response.status);
                if (response.ok) {
                    const res_data = await response.json();
                    console.log("res_data", res_data);
                    if (res_data.status === 200) {
                    localStorage.setItem("token", res_data.token);
                    setError({});
                    window.location.href = '/';
                    } else {
                        setError({ invalid: res_data.message});
                    }
                } else {
                    const responseData = await response.json();
                    setError({ invalid: responseData.message });
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    const validate = () => {
        const error = {};
        if (!value.email) {
            error.email = "Please enter your email";
        }
        if (!value.password) {
            error.password = "Please enter your password";
        }
        return error;
    };

    return (
        <div className="register-div">
            <div className="text-center form reg-form">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="md:col-span-1 flex justify-center items-center">
                        <Image src={img} alt="" className="reg-img" />
                    </div>

                    <div className="md:col-span-1">
                        <form className="my-auto p-0 text-start" onSubmit={handleSubmit}>
                            <h4 className="reg-head">Log In</h4>

                            <div className="relative">
                                <FontAwesomeIcon icon={faEnvelope} className="reg-icon" />
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="input reg-input"
                                    name="email"
                                    value={value.email}
                                    onChange={InputValue}
                                />
                            </div>
                            <div className="error-msg reg-error-msg">{error.email}</div>
                            {error.invalid && <div className="error-msg reg-error-msg">{error.invalid}</div>}

                            <div className="relative">
                                <FontAwesomeIcon icon={faLock} className="reg-icon" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="input reg-input"
                                    name="password"
                                    value={value.password}
                                    onChange={InputValue}
                                />
                            </div>
                            <div className="error-msg reg-error-msg">{error.password}</div>
                            {error.invalid && <div className="error-msg reg-error-msg">{error.invalid}</div>}

                            <label className="reg-checkbox">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                />
                                <span className="ms-2">
                                    I accept all terms & conditions
                                </span>
                                <span className="checkmark"></span>
                            </label>

                            <button type="submit" className="btn-1 reg-btn">Log in</button>

                            <p className="mt-3">
                                <span className="reg-bold">
                                    Don't have an account?
                                </span>
                                <Link href="/signup" className="text-decoration-none redirect"> Signup Now</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenExpired(Login);


