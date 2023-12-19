import React from "react";
import axios from "axios";

const App = () => {
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    axios.get("http://localhost:8000/").then((response) => {
      setMessage(response.data.message);
    });
  }, []);

  return (
    <div>
      {/* <h1>FastAPI GET Request Endpoint</h1> */}
      <p>{message}</p>
    </div>
  );
};

export default App;
