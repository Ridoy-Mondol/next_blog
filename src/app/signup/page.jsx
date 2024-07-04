"use client";
import React, { useState } from 'react';
import Link from "next/link";
import Image from 'next/image';
import img from "@/app/Images/signup-image.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUnlockAlt, faImage } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import GoogleSignUpButton from "@/app/components/SignupButton";

const Registration = () => {
  const [error, setError] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState('Choose Profile Image');
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const InputValue = (event) => {
    const { name, value } = event.target;
    setValue((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      setImageName(file.name);
    }
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formError = validate();
    setError(formError);
    
    if (Object.keys(formError).length === 0 && isChecked) {
      const formData = new FormData();
      formData.append('name', value.name);
      formData.append('email', value.email);
      formData.append('password', value.password);
      image && formData.append('image', image);

      setIsLoading(true);

      try {
        const response = await fetch("/api/users/signup", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const res_data = await response.json();
          if (res_data.success) {
            toast.success(res_data.message);
            setTimeout(() => {
              window.location.href = '/signup/verify';
            }, 1000); 
          } else {
            toast.error(res_data.message);
          }
        } else {
          const errorData = await response.json();
          toast.error(errorData.message);
          throw new Error("Failed to submit the form");
        }
      } catch (error) {
        toast.error("Something went wrong.Please try again");
      }
      setIsLoading(false);
    }
  };

  const validate = () => {
    const error = {};
    if (!value.name) {
      error.name = "Please enter your name";
    }
    if (!value.email) {
      error.email = "Please enter your email";
    }
    if (!value.password) {
      error.password = "Please enter your password";
    }
    if (value.password.length > 0 && value.password.length < 6) {
      error.password = "Password must be at least 6 characters";
    }
    if (!value.cpassword) {
      error.cpassword = "Please confirm your password";
    }
    if (value.cpassword.length > 0 && value.password !== value.cpassword) {
      error.cpassword = "Confirm password does not match";
    }
    return error;
  };

  return (
    <div className='register-div'>
      <div className="text-center form reg-form">
      {isLoading && (
  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 py-2 px-4 rounded-md shadow-md z-50 flex items-center">
    <div className="spinner spinner-2 mr-2"></div>
    <span className="text-sm font-medium text-white">Processing...</span>
  </div>
)}

        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='col-span-1'>
            <form className='my-auto p-0 text-start' method="POST" onSubmit={handleSubmit}>
              <h4 className='reg-head'>Sign Up</h4>
              <div className='relative'>
                <FontAwesomeIcon icon={faUser} className="reg-icon" />
                <input
                  type="text"
                  placeholder="Your Name"
                  className="reg-input"
                  name="name"
                  value={value.name}
                  autoComplete='off'
                  onChange={InputValue}
                />
              </div>
              <div className="reg-error-msg">{error.name}</div>

              <div className='relative'>
                <FontAwesomeIcon icon={faEnvelope} className="reg-icon" />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="reg-input"
                  name="email"
                  value={value.email}
                  autoComplete='off'
                  onChange={InputValue}
                />
              </div>
              <div className="reg-error-msg">{error.email}</div>

              <div className='relative'>
                <FontAwesomeIcon icon={faLock} className="reg-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  className="reg-input"
                  name="password"
                  value={value.password}
                  autoComplete='off'
                  onChange={InputValue}
                />
              </div>
              <div className="reg-error-msg">{error.password}</div>

              <div className='relative'>
                <FontAwesomeIcon icon={faUnlockAlt} className="reg-icon" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="reg-input"
                  name="cpassword"
                  value={value.cpassword}
                  autoComplete='off'
                  onChange={InputValue}
                />
              </div>
              <div className="reg-error-msg">{error.cpassword}</div>

              <div className="file-input-container">
                <label htmlFor="blogImage1" className="file-input-label">
                  <span>
                    <FontAwesomeIcon icon={faImage} className="profile-icon" />
                    <span className='profile'>{image ? imageName : "Choose Profile Image"}</span>
                  </span>
                  <input
                    type="file"
                    name="image"
                    id="blogImage1"
                    accept="image/*"
                    className='reg-input'
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <label className="reg-checkbox">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <span className='ms-2'>
                  I accept all terms & conditions
                </span>
                <span className="checkmark"></span>
              </label>

              <button type="submit" className="reg-btn">SIGN UP NOW</button>
              </form>
              <p className='text-center font-bold text-lg my-1 w-[85%]'>or</p>
              <GoogleSignUpButton props="SIGN UP WITH GOOGLE"/>
              <p className='mt-3 text-start'>
                <span className='reg-bold'>
                  Already have an account?
                </span>
                <Link href="/login" className='hover:underline redirect'> Login now</Link>
              </p>
          </div>

          <div className='col-span-1 flex items-center'>
            <Image src={img} alt='' className='reg-img' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
