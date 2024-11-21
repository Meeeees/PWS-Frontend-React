import React, { useState } from "react";
import WebcamCapture from "./webcam";
import config from "./config.json";
import Button from "@mui/material/Button";
import styles from "./styles/app.module.css";
import { Box, Input, Modal, Typography } from "@mui/material";
function App() {
  const [imgSrc, setImgSrc] = useState(null);
  const [Status, setStatus] = useState(null);
  const [ModalIsOpen, SetModalIsOpen] = useState(false);
  const handleOpen = () => SetModalIsOpen(true);
  const handleClose = () => SetModalIsOpen(false);

  const startTimer = () => {
    const interval = setInterval(() => {
      setStatus(Status - 1);
    }, 1000);
    return () => clearInterval(interval);
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className={styles.main}>
          <h1>Image Processing</h1>
          {/* <WebcamCapture imgState={imageSrc} setImgState={setImageSrc} /> */}

          <div className={styles.subDivision}>
            {!ModalIsOpen && <img src={`${config.Backend}/video`} alt="live feed" />}
            <div>
              <Button variant="outlined" onClick={() => {
                fetch(config.Backend + "/recognize").then(async res => {
                  res = await res.json()
                  console.log(res)
                  setImgSrc(res);
                })
              }}>recognize</Button>

              {imgSrc && (
                <div>
                  <h3>laatste herkende foto:</h3>
                  <img src={config.Backend + "/" + imgSrc} alt="laatste herkende foto" />
                </div>
              )}
            </div>
            <div>
              <Button variant="outlined" onClick={handleOpen}>
                Add new people
              </Button>
            </div>

            <Modal
              open={ModalIsOpen}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              style={{ padding: "20px" }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  padding: "20px",
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: "60vw",
                  height: "60vh",
                  bgcolor: 'background.paper',
                  border: '2px solid #000',
                  boxShadow: 24,
                  p: 4
                }}
              >
                <Typography id="modal-title" variant="h6" component="h2">
                  Add New People
                </Typography>
                {/* <Typography id="modal-description" sx={{ mt: 2 }}> */}
                <form action={`${config.Backend}/add`} method="post">
                  <Input variant="outlined" type="text" name="name" placeholder="name" />
                  Tevreden met de video?<Button variant="outlined" type="submit">Voeg toe</Button>
                </form>
                {ModalIsOpen && <img src={`${config.Backend}/video`} alt="live feed" />}
                <Button variant="outlined" onClick={() => {
                  fetch(config.Backend + "/start").then(async res => {
                    setStatus(5)
                    startTimer()
                  })
                }}>Start video</Button>
                <p>{Status}</p>
                <p>Neem een video waarbij je het complete gezicht in meerdere hoeken laat zien</p>
                {/* </Typography> */}
              </Box>
            </Modal>


          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
