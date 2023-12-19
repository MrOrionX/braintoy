import Add from "../img/add.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import logoIcon from "../img/hi_icon.png";

const Register = () => {
  const [error, setError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [userEmailError, setUserEmailError] = useState("");
  const [userPasswordError, setUserPasswordError] = useState("");
  const navigate = useNavigate();
  const { serverReload } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userName = e.target[0].value;
    const userEmail = e.target[1].value;
    const userPassword = e.target[2].value;

    const newUserData = {
      uid: "",
      username: userName,
      email: userEmail,
      password: userPassword,
    };

    if (userName && userEmail && userPassword) {
      await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      })
        .then((response) => {
          if (response.status === 200) {
            serverReload();
            navigate("/login");
          } else {
            response.json().then((data) => {
              setError(data.detail);
              console.error("Error", data.detail);
            });
          }
        })
        .catch((error) => {
          console.error("Error", error);
        });
    } else if (!userName) {
      setUserNameError("User name required.");
    } else if (!userEmail) {
      setUserEmailError("User e-mail required.");
    } else if (!userPassword) {
      setUserPasswordError("User password required.");
    }
  };

  const handleChange = () => {
    if (userNameError) {
      setUserNameError("");
    }
    if (userEmailError) {
      setUserEmailError("");
    }
    if (userPasswordError) {
      setUserPasswordError("");
    }
  };

  const gotoMain = () => {
    navigate("/main");
  };

  return (
    <div className="formContainer">
      <div className="mainWrapper">
        <div className="navBar">
          <div className="navLeft">
            <div className="logo" onClick={gotoMain}>
              <img src={logoIcon} alt="" />
              <span>iChat</span>
            </div>
            <p>Explore</p>
            <p>Careers</p>
            <p>Privacy</p>
          </div>
          <div className="navRight">
            <p onClick={gotoMain}>Main</p>
          </div>
        </div>
        <div className="formPage">
          <div className="formWrapper">
            <div className="logo" onClick={gotoMain}>
              <img src={logoIcon} alt="" />
              <span>iChat</span>
            </div>
            <span className="title">Register</span>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="display name"
                onChange={handleChange}
              />
              {error && <span className="error">{error}</span>}
              {userNameError && <span className="error">{userNameError}</span>}
              <input type="email" placeholder="email" onChange={handleChange} />
              {userEmailError && (
                <span className="error">{userEmailError}</span>
              )}
              <input
                type="password"
                placeholder="password"
                onChange={handleChange}
              />
              {userPasswordError && (
                <span className="error">{userPasswordError}</span>
              )}
              <input type="file" id="user_img" className="display-none" />
              <label htmlFor="user_img">
                <img src={Add} alt="" />
                <span>Add profile picture</span>
              </label>
              <button>Sign Up</button>
            </form>
            <p>
              Registered account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
        <p>&copy;2023-2024 Jon</p>
      </div>
    </div>
  );
};

export default Register;
