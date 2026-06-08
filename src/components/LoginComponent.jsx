import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import "../App.css";
const LoginComponent = ({ onLogin }) => {    //onLogin is a props calls from App.jsx(Parent component) to loginComponent.jsx(Child component)
  const [loginType, setLoginType] = useState(null); 
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });  //Validation runs as user type in form field,if user leaves the field empty it does not allows to submit before submitting it checks whether user has filled the form according to validation rules or not
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getFieldsConfig = (type) => {
    const passwordField = {
      name: "password",
      label: "Password",
      category: "input",
      type: "password",
      required: true,
      pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,8}$/,  //Regex pattern is used for special character 
        message: "Password must be 6-8 characters,include letters,numbers & special characters",
      },
    };

    switch(type) {
      case "admin":
        return [
          {
            name: "adminUser",
            label: "Admin Username",
            category: "input",
            type: "text",
            required: true,  //required is used not to allow the field to be empty it allows only when user types the form according to pattern
            pattern: {
              value: /^[a-zA-Z\s]{3,30}$/,
              message: "Admin Username must be 3-30 characters & only letters/spaces",
            },
          },
          passwordField
        ];
      case "user":
        return [
          {
            name: "userName",
            label: "User Name",
            category: "input",
            type: "text",
            required: true,
            pattern: {
              value: /^[a-zA-Z\s]{3,30}$/,
              message: "Username must be 3-30 characters & only letters/spaces",
            },
          },
          passwordField
        ];
      default:
        return [];
    }
  };

  const renderField = (field) => (
    <div key={field.name} className="login-field">
      <label>{field.label}{field.required && " *"}</label>
      <input
        type={field.type}
        placeholder={`Enter ${field.label}`}
        {...register(field.name, { required: field.required && `${field.label} is required`, pattern: field.pattern })}
      />
      {errors[field.name] && <span className="error-message">{errors[field.name].message}</span>}
    </div>
  );

  const onSubmit = async (data) => {
  try {

    const payload =
      loginType === "admin"
        ? {
            username: data.adminUser,
            password: data.password,
          }
        : {
            username: data.userName,
            password: data.password,
          };

    const response = await axios.post(
      "http://localhost:5000/api/users/login",
      payload
    );

    const user = response.data.user;

    localStorage.setItem(
      "token",
      response.data.token
    );

    dispatch(
      login({
        username: user.username,
        userType: user.userType,
      })
    );

    navigate("/dashboard");

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Invalid Username or Password"
    );

  }
};

  return (

      <div className="login-container ">
      {!loginType ? (
        <>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Select Login Type</h2>
        <div className="login-type-buttons">
          <button className="user-btn" onClick={() => setLoginType("user")}>User Login</button>
          <button className="admin-btn" onClick={() => setLoginType("admin")}>Admin Login</button> 
        </div>
        </>
      ) : (
        <>
          <h1>
            Unity Bank<br />
            <span>{loginType === "user" ? "User Login" : "Admin Login"}</span> {/*Ternary Operator is used to decide the login type*/}
            </h1> {/*span is used to separate main title and sub title*/}
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            {getFieldsConfig(loginType).map(renderField)}     {/*.map is a loop function in JavaScript that takes each item from the array and applies a function to it.*/}
            <button type="submit" className="login-btn">Submit</button>
          </form>
          <button onClick={() => setLoginType(null)} className="back-btn"> 
            Back to Login Type
          </button>
          <p className="auth-link">
          Don’t have an account? <a href="/register-type">Register</a>
        </p>
        </>
      )}
    </div>
  );
};

export default LoginComponent;
