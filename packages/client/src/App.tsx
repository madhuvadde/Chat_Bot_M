import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setmessage] = useState("");
  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setmessage(data.message));
  }, []);
  return <p>{message}</p>;
}

export default App;
