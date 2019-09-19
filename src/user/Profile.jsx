import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import { readUser, updateUser, updateUserLocalStorage } from "./apiUser";

const Profile = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: false,
    success: false
  });

  const { token } = isAuthenticated();

  const { name, email, password, error, success } = values;

  const init = userId => {
    readUser(userId, token).then(data => {
      if (data.error) {
        setValues({ ...values, error: true });
      } else {
        setValues({ ...values, name: data.name, email: data.email });
      }
    });
  };

  // handleChange
  const handleChange = name => e => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  // submit form
  const clickSubmit = e => {
    e.preventDefault();
    updateUser(match.params.userId, token, { name, email, password }).then(
      data => {
        if (data.error) {
          console.log(error);
        } else {
          updateUserLocalStorage(data, () => {
            setValues({
              ...values,
              name: data.name,
              email: data.email,
              success: true
            });
          });
        }
      }
    );
  };

  // redirect User
  const redirectUser = success => {
    if (success) {
      return <Redirect to="/cart" />;
    }
  };

  // user form
  const profileUpdate = (name, email, password) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          onChange={handleChange("name")}
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="email"
          onChange={handleChange("email")}
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          onChange={handleChange("password")}
          className="form-control"
          value={password}
        />
      </div>

      <button onClick={clickSubmit} className="btn btn-primary">
        Submit
      </button>
    </form>
  );

  useEffect(() => {
    init(match.params.userId);
  }, []);

  return (
    <Layout
      title="Profile"
      description="Update your profile"
      className="container-fluid"
    >
      <h2 className="mb-4"> Profile Update</h2>
      {profileUpdate(name, email, password)}
      {redirectUser(success)}
    </Layout>
  );
};

export default Profile;
