import React from "react";
import { useForm } from "react-hook-form";
import "../App.css";
const BankFormRegistrationAdmin = ({ onRegisterSuccess }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: "onChange" });

  const fieldsConfig = [
    {
      name: "adminName",
      label: "Admin Name",
      type: "text",
      required: true,
      pattern: {
        value: /^[a-zA-Z\s]{3,30}$/,
        message: "Admin Name must be 3-30 characters & only letters/spaces",
      },
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      required: true,
      pattern: {
        value: /^[6-9]\d{9}$/,
        message: "Phone Number must be exactly 10 digits & start with 6-9",
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,8}$/,
        message: "Password must be 6-8 characters,include letters,numbers & special characters",
      },
    },
    {
      name: "confirmpassword",
      label: "Confirm Password",
      type: "password",
      required: true,
      validate: (value) => value === (watch("password") || "") || "Passwords do not match",
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
    console.log("Admin Form Submitted:", data);

    let existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const username = data.adminName.trim().toLowerCase();

  const isDuplicate = existingUsers.some((u) => u.username.toLowerCase() === username);
  if (isDuplicate) {
    alert("Admin already exists! Please login instead.");
    return;
  }

    const newAdmin = {
      username: data.adminName.trim().toLowerCase(),
      fullName: data.adminName.trim(),
      password: data.password,
      phone: data.phone,
      userType: "admin", 
    };

    localStorage.setItem("users", JSON.stringify([...existingUsers, newAdmin]));

    alert("Admin registered successfully!");
    if (onRegisterSuccess) onRegisterSuccess();
  };

  return (
    <div className="form-container">
      <h1>Admin Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {fieldsConfig.map(renderField)}
        <button type="submit" className="submit-btn">Register Admin</button>
      </form>
    </div>
  );
};

export default BankFormRegistrationAdmin;
