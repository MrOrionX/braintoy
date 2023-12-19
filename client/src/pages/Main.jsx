import { useNavigate } from "react-router-dom";
import logoIcon from "../img/hi_icon.png";
import mainPageImg from "../img/mainPage.png";

const Main = () => {
  const navigate = useNavigate();

  const gotoRegister = () => {
    navigate("/register");
  }

  const gotoLogin = () => {
    navigate("/login");
  }

  return (
    <div className="formContainer">
      <div className="mainWrapper">
        <div className="navBar">
          <div className="navLeft">
            <div className="logo">
              <img src={logoIcon} alt="" />
              <span>iChat</span>
            </div>
            <p>Explore</p>
            <p>Careers</p>
            <p>Privacy</p>
          </div>
          <div className="navRight">
            <p onClick={gotoRegister}>Register</p>
            <p onClick={gotoLogin}>Login</p>
          </div>
        </div>
        <div className="mainPage">
          <div className="leftPage">
            <img src={mainPageImg} alt="" />
          </div>
          <div className="rightPage">
            <div className="mainForm">
              <div className="mainLogo">
                <img src={logoIcon} alt="" />
              </div>
              <span className="title">Welcome to hiChat</span>
              <div className="bottomPart">
                <div className="logo">
                  <img src={logoIcon} alt="" />
                  <span>iChat</span>
                </div>
                <form>
                  <button onClick={gotoRegister}>Register</button>
                  <button onClick={gotoLogin}>Login</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <p>&copy;2023-2024 Jon</p>
      </div>
    </div>
  );
};

export default Main;
