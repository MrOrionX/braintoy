import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logoIcon from "../img/hi_icon.png";
import microsoftIcon from "../img/Microsoft.png";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateCurrentUser } = useContext(AuthContext);
  const [userEmailError, setUserEmailError] = useState("");
  const [userPasswordError, setUserPasswordError] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userEmail = e.target[0].value;
    const userPassword = e.target[1].value;

    const loginData = {
      email: userEmail,
      password: userPassword,
    };

    // Connect to backend
    if (userEmail && userPassword) {
      try {
        const response = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        if (response.ok) {
          const data = await response.json();
          const { message, username, uid } = data;
          updateCurrentUser({ username, uid });
          // console.log(message);
          // console.log("Success login for: ", username);
          navigate("/");
        } else {
          const data = await response.json();
          if (response.status === 401) {
            setError("Invalid email or password.");
          } else {
            setError(data.detail);
            console.error("Error", data.detail);
          }
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again later.");
        console.error("Error", error);
      }
    } else if (!userEmail) {
      setUserEmailError("User email required.");
    } else if (!userPassword) {
      setUserPasswordError("User password required.");
    }
  };

  const handleChange = () => {
    if (userEmailError) {
      setUserEmailError("");
    }

    if (userPasswordError) {
      setUserPasswordError("");
    }
  };

  const handleNotice = () => {
    if (notice) {
      setNotice("");
    } else {
      setNotice("OAuth2.0 in Progress");
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
              <span className="logo">iChat</span>
            </div>
            <span className="title">Login</span>
            <form onSubmit={handleSubmit}>
              <input type="email" placeholder="Email" onChange={handleChange} />
              {userEmailError && (
                <span className="error">{userEmailError}</span>
              )}
              <input
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />
              {userPasswordError && (
                <span className="error">{userPasswordError}</span>
              )}
              <button>Sign In</button>
              {error && <span className="error">{error}</span>}
            </form>
            <div className="signInOption">
              <p>~or~</p>
              <button onClick={handleNotice}>
                Sign in with <img src={microsoftIcon} alt="" />
              </button>
              {notice && <span className="notice">{notice}</span>}
            </div>
            <p>
              No account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
        <p>&copy;2023-2024 Jon</p>
      </div>
    </div>
  );
};

export default Login;
