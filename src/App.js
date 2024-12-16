import React, { useState } from "react";
import Button from "@mui/material/Button";
import styles from "./styles/app.module.css";
import Video from "./pages/Video";
import AddPeople from "./pages/addPeople";

function App() {
  const [videoOpen, setVideoOpen] = useState(true);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gezichts herkenning</h1>
        <Button variant="outlined" onClick={() => setVideoOpen(!videoOpen)}>{videoOpen ? "beheer gezichten" : "Ga naar video"}</Button>
        <div className={styles.main}>

          {videoOpen && <Video />}
          {!videoOpen && <AddPeople />}

        </div>
      </header >
    </div >
  );
}

export default App;
