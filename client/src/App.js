import React, {useState} from 'react';
import axios from "axios";
export default function App() {
  const [text, setText] = useState("");
  const onSubmit = async () => {
    await axios.post("/api/post", {text});
  }
  return (
    <div>
      <input type = "text" value = {text} onChange = {(e) => setText(e.target.value)}/>
      <button onClick = {onSubmit}> Submit</button>
    </div>
  )
}