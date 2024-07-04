"use client"
import React, { useState } from 'react';
import img from "@/app/Images/signin-image.jpg";
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { setCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import GoogleLogInButton from "@/app/components/LogInButton";


const Login = () => {
    const [error, setError] = useState({});
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsloading] = useState (false);
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
            setIsloading(true);
            try {
                const response = await fetch("/api/users/login", {
                    method: "POST",
                    body: JSON.stringify(value),
                });
                if (response.ok) {
                    const res_data = await response.json();
                    if (res_data.status === 200) {
                        setCookie('token2', res_data.token, { maxAge: 10 * 24 * 60 * 60 });
                        setError({});
                        toast.success("Log in succcessfull");
                        setTimeout(() => {
                          window.location.href = '/';
                        }, 1000);
                    } else {
                        toast.error(res_data.message);
                    }
                } else {
                    const responseData = await response.json();
                    toast.error(responseData.message);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                toast.error("Something went wrong. Please try again");
            }
            setIsloading(false);
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
            {isLoading && (
  <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 py-2 px-4 rounded-md shadow-md z-50 flex items-center">
    <div className="spinner spinner-2 mr-2"></div>
    <span className="text-sm font-medium text-white">Processing...</span>
  </div>
)}
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
                                    autoComplete='off'
                                    onChange={InputValue}
                                />
                            </div>
                            <div className="error-msg reg-error-msg">{error.email}</div>

                            <div className="relative">
                                <FontAwesomeIcon icon={faLock} className="reg-icon" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="input reg-input"
                                    name="password"
                                    value={value.password}
                                    autoComplete='off'
                                    onChange={InputValue}
                                />
                            </div>
                            <div className="error-msg reg-error-msg">{error.password}</div>

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

                            <button type="submit" className="btn-1 reg-btn">LOG IN</button>
                            </form>
                            <p className='text-center font-bold text-lg my-1 w-[85%]'>or</p>
                            <GoogleLogInButton props = "LOG IN WITH GOOGLE"/>
                            
                            <p className="mt-3 text-start">
                                <Link href="/login/reset_password" className="hover:underline redirect">Forgot Password?</Link>
                            </p>
                            <p className="mt-2 text-start">
                                <span className="reg-bold">
                                Don&apos;t have an account?
                                </span>
                                <Link href="/signup" className="redirect hover:underline"> Signup Now</Link>
                            </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;


