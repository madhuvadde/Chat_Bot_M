import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setmessage] = useState("");
  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setmessage(data.message));
  }, []);
  return <p className="font-bold p-4">{message}</p>;
}

export default App;
