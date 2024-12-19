import styles from "../styles/app.module.css";
import config from "../config.json";
import { TextField, Button, Modal, Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

const styleRemove = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};
const styleAdd = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const AddPeople = ({ queryString }) => {
    const [name, setName] = useState("");
    const [Status, setStatus] = useState(null);
    const [voltooid, setVoltooid] = useState(false);
    const [gestart, setGestart] = useState(false);
    const [mensen, setMensen] = useState([]);

    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [AddPicturesModal, setAddPicturesModal] = useState(false);

    const [nieuwPersoon, setNieuwPersoon] = useState(false);

    const [geselecteerdPersoon, setGeselecteerdPersoon] = useState(null);
    useEffect(() => {
        fetch(config.Backend + "/info" + queryString + "&type=2").then(async res => {
            res = await res.json()
            setMensen(res)
        })
    }, [])

    return (
        <div className={styles.MensenMain}>
            <h3>Beheer gezichten</h3>
            <p>Verwijder mislukte foto's, voeg meer foto's toe, voeg een nieuw persoon toe of verwijder een persoon. Als er wijzingen worden gemaakt, zal het model opnieuw moeten laden, waardoor de volgende keer gezichtsherkenning langer zal duren</p>
            <div>
                <ul className={styles.personen}>
                    {Object.keys(mensen).map((key) => {
                        return (
                            <li key={key}>
                                <h4 className={styles.persoon} style={{ fontSize: geselecteerdPersoon == key ? "20px" : "15px" }}
                                    onClick={() => {
                                        geselecteerdPersoon == key ? setGeselecteerdPersoon(null) : setGeselecteerdPersoon(key)
                                    }}>{key}</h4>
                                {geselecteerdPersoon == key &&
                                    <div>
                                        <p>Klik op een foto waar de persoon die erop staat niet degene is met de naam <b>{key}</b> om te verwijderen, dit kan niet ongedaan gemaakt worden</p>
                                        <div><Button color='error' variant="outlined" onClick={() => {
                                            setConfirmDeleteModal(true)
                                        }}>Verwijder persoon</Button>
                                            <Button variant="outlined" onClick={() => {
                                                setAddPicturesModal(true)
                                                setName(key)
                                            }} >Voeg nieuwe foto's toe</Button>
                                        </div>
                                    </div>}
                                {geselecteerdPersoon == key && (
                                    <ul>
                                        {mensen[key][0].map((frame) => {
                                            return (
                                                <li className={styles.frame} id={frame} key={frame} onClick={() => {
                                                    fetch(config.Backend + "/verwijder" + queryString + "&naam=" + key + "&frame=" + frame).then(async res => {
                                                        document.getElementById(frame).remove();
                                                    })
                                                }}>
                                                    <img src={config.Backend + "/gezichten/" + key + "/" + frame} alt="gezicht" loading="lazy" width="100px" height="56px" />
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </li>
                        )
                    })}
                    <li>
                        <Button variant="outlined" onClick={() => {
                            setAddPicturesModal(true)
                            setName("")
                            setNieuwPersoon(true)
                        }}>
                            Voeg nieuw persoon toe</Button>
                    </li>
                </ul>
                <div>

                </div>

            </div>

            <Modal
                open={confirmDeleteModal}
                onClose={() => setConfirmDeleteModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleRemove}>
                    <p>Weet je zeker dat je deze persoon wilt verwijderen?
                        dit kan niet ongedaan gemaakt worden</p>
                    <Button color='error' variant="outlined" onClick={() => {
                        fetch(config.Backend + "/verwijder" + queryString + "&naam=" + geselecteerdPersoon).then(() => {
                            fetch(config.Backend + "/info" + queryString + "&type=2").then(async res => {
                                res = await res.json()
                                setMensen(res)
                            })
                        })
                        setConfirmDeleteModal(false)
                    }}>bevestig</Button>

                </Box>
            </Modal>

            <Modal
                open={AddPicturesModal}
                onClose={() => setAddPicturesModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleAdd}>
                    <img className={styles.video} src={`${config.Backend}/video` + queryString} alt="live feed" />
                    {nieuwPersoon && (
                        <TextField id="outlined-basic" label="Naam" variant="outlined" onChange={(e) => setName(e.target.value)} />
                    )}
                    <div>
                        <Button variant="outlined" onClick={() => {
                            setGestart(true)
                            fetch(config.Backend + "/start" + queryString + "&name=" + name).then(async res => {
                                res = await res.json()
                                if (res.status === 400) {
                                    setStatus("De naam mag niet leeg zijn")
                                } else if (res.status === 409) {
                                    setStatus(`de naam ${name} is al in gebruik`)
                                } else {
                                    setVoltooid(true);
                                    setGestart(false);
                                    fetch(config.Backend + "/info" + queryString + "&type=2").then(async res => {
                                        res = await res.json()
                                        setMensen(res)
                                    })
                                }
                            })
                        }}>{!gestart ? "Video opnemen" : "Video wordt opgenomen"}</Button>
                        <p><b>{name}</b></p>
                        <p>Neem een video waarbij de contouren van je gezicht duidelijk zijn, zorg ervoor dat de belichting zo goed mogelijk is.</p>
                        <p>Deze video zal 5 seconde duren, probeer langszaam aan te bewegen terwijl je de camera recht aan kijkt</p>
                        <p>{voltooid && "Het opnemen van de video is voltooid!"}</p>
                    </div>
                </Box>
            </Modal>

        </div>
    )
}

export default AddPeople