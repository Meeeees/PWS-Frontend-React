import React, { useState, useRef } from "react";
import { Button, TextField } from "@mui/material";
import styles from "./styles/app.module.css";
import Video from "./pages/Video";
import AddPeople from "./pages/addPeople";

function App() {
  const [videoOpen, setVideoOpen] = useState(true);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [queryString, setQueryString] = useState("")
  const usernameRef = useRef("");
  const passwordRef = useRef("")

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gezichts herkenning</h1>
        {(username == null || password == null) ? (
          <div className={styles.login}>
            <h4>Login</h4>
            <form onSubmit={(e) => {
              e.preventDefault()
              setUsername(usernameRef.current.value);
              setPassword(passwordRef.current.value);
              setQueryString(`?username=${usernameRef.current.value}&password=${passwordRef.current.value}`)
            }}>
              <TextField
                type="text"
                placeholder="Gebruikersnaam"
                inputRef={usernameRef}
              />
              <TextField
                type="password"
                placeholder="Wachtwoord"
                inputRef={passwordRef}
              />
              <Button type="submit" variant="outlined">
                Bevestig
              </Button>
            </form>
          </div>
        ) : (
          <div className={styles.main}>
            <Button variant="outlined" onClick={() => setVideoOpen(!videoOpen)}>{videoOpen ? "beheer gezichten" : "Ga naar video"}</Button>

            {videoOpen && <Video queryString={queryString} />}
            {!videoOpen && <AddPeople queryString={queryString} />}
          </div>

        )}

      </header >
    </div >
  );
}

export default App;
