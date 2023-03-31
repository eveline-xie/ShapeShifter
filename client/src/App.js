import React, {useState} from 'react';
import axios from "axios";

const api = axios.create({
  baseURL: 'https://shapeshifter-api.onrender.com/api'
})
export default function App() {
  const [text, setText] = useState("ttttttt");
  const onSubmit = async () => {
    await api.post("/post", {text});
  }
  return (
    <div>
      <input type = "text" value = {text} onChange = {(e) => setText(e.target.value)}/>
      <button onClick = {onSubmit}> Submit</button>
    </div>
  )
}