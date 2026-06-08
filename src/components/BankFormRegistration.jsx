import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import "../App.css";
const BankFormRegistration = ({ onRegisterSuccess }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: "onChange" });
  const [successMessage, setSuccessMessage] = useState("");  

  const fieldsConfig = [
    {
      name: "firstName",
      label: "First Name",
      category: "input",
      type: "text",
      required: true,
      pattern: {
        value: /^[a-zA-Z\s]{3,30}$/,                                      
        message: "Full Name must be 3-30 characters & contain only letters and spaces",
      },
    },

    {
      name: "lastName",
      label: "Last Name",
      category: "input",
      type: "text",
      required: true,
      pattern: {
        value: /^[a-zA-Z\s]{3,30}$/,
        message: "Full Name must be 3-30 characters & contain only letters and spaces",
      },
    },

    {
      name: "phone",
      label: "Phone Number",
      category: "input",
      type: "tel",
      required: true,
      pattern: {
        value: /^[6-9]\d{9}$/,  //Regex Pattern is used in phone no to maintain 10 digit phone no as well as to start with 6-9
        message: "Phone Number must be exactly 10 digits",
      },
    },

    {
      name: "password",
      label: "Password",
      category: "input",
      type: "password",
      required: true,
      pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,8}$/,     //Regex pattern is used for special character 
        message: "Password must be 6-8 characters,include letters,numbers & special characters",
      },
    },

    {
        name: "confirmpassword",
        label: "Confirm Password",
        category: "input",
        type: "password",
        required: true,
        validate: (value) => value === (watch("password") || "") || "Passwords do not match"  //Validate is used in confirm password to check whether the password matches or not 
    },
];

  const renderField = (field) => (
    <div key={field.name} className="form-field">
      <label>{field.label}{field.required && " *"}</label>
      <input
        type={field.type}
        placeholder={`Enter ${field.label}`}
        {...register(field.name, { 
          required: field.required && `${field.label} is required`,
          pattern: field.pattern,
          validate: field.validate,
        })}
      />
      {errors[field.name] && <span className="error-message">{errors[field.name].message}</span>}
    </div>
  );

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    let existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const normalizedUsername = `${data.firstName}${data.lastName}`
    .replace(/\s+/g, "")
    .toLowerCase();
  const existingUser = existingUsers.find(
    (u) => u.username.replace(/\s+/g, "").toLowerCase() === normalizedUsername
  );
  if (existingUser && existingUser.password) {
    alert("User already exists! Please login instead.");   //User already fully registered (has password)
    return;
  }
  else if (existingUser && !existingUser.password) {
    existingUser.password = data.password;
    existingUser.phone = data.phone;
    existingUser.fullName = `${data.firstName} ${data.lastName}`;    //Admin added user without password — allow them to set password
    localStorage.setItem("users", JSON.stringify(existingUsers));
    alert("Account setup completed! You can now login.");
    console.log("Account setup completed:", existingUser);
    if (onRegisterSuccess) onRegisterSuccess();
    return;
  }
    const newUser = {
      id: uuidv4(),
      username: normalizedUsername,
      fullName: `${data.firstName} ${data.lastName}`,   //Completely new user registration
      password: data.password,
      phone: data.phone,
      userType: "user", // default role
    };
    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));
    alert("User registered successfully!");
    console.log("User registered successfully:", newUser);
    if (onRegisterSuccess) onRegisterSuccess();
  };
  return (
    <div className="form-container">
      <h1>Bank Form Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {fieldsConfig.map(renderField)}
        <button type="submit" className="submit-btn">Submit</button>
      </form>
      <p className="auth-link">
  Already have an account? <a href="/login">Login</a>
</p>
    </div>
  );
};

export default BankFormRegistration;   