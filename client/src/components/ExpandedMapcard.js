import * as React from "react";
import { useContext } from "react";
// import { GlobalStoreContext } from '../store'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid, Card, CardContent, TextField, Avatar, CardMedia } from "@mui/material";
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1250,
    height: 600,
    bgcolor: "#145374",
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: 10,
    p: 4,
};

export default function ExportModal(props) {
    // const { store } = useContext(GlobalStoreContext);

    function handleClose() {
        props.setOpen(false);
    }

    async function handleExport(event, id) {
        event.stopPropagation();
        props.setOpenExport(true);
    }
    async function handleFork(event, id) {
        event.stopPropagation();
        props.setOpenFork(true);
    }



    return (
        <div>
            <Modal
                id="view-modal"
                open={props.open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Button
                        variant="contained"
                        sx={{ maxWidth: 20 }}
                        style={{
                            borderRadius: 50,
                            backgroundColor: "#AEAFFF",
                            padding: "7px 10px",
                            margin: "0px 0px 8px",
                            fontSize: "13px",
                            color: "#000000",
                        }}
                        onClick={handleClose}
                    >
                        X
                    </Button>

                    <Grid container direction="row" justifyContent="space-between" alignItems="stretch">
                        {/* left */}
                        <Grid item xs={6}>

                            <Grid container direction="column" justifyContent="space-between" alignItems="stretch" >
                                {/* name and comment box */}
                                <Grid item>

                                    <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
                                        <Grid item>

                                            <Grid container direction="row" justifyContent="space-between" alignItems="stretch">
                                                <Grid item xs={8}>
                                                    <Typography
                                                        id="mapcard-name"
                                                        variant="h3"
                                                        component="h2"
                                                        style={{
                                                            color: "#AEAFFF"
                                                        }}>
                                                        North America
                                                    </Typography>

                                                    <Typography
                                                        id="mapcard-owner"
                                                        variant="h6"
                                                        component="h2"
                                                        style={{
                                                            color: "#B3B3B3"
                                                        }}>
                                                        Lucas Shmo
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={3}>
                                                    <Button
                                                        variant="contained"
                                                        style={{
                                                            borderRadius: 50,
                                                            backgroundColor: "rgba(255, 255, 255, .2)",
                                                            padding: "13px 34px",
                                                            margin: "10px 10px",
                                                            fontSize: "10px",
                                                            color: "#ffffff",
                                                        }}
                                                        onClick={(event) => {
                                                            handleFork(event);
                                                        }}
                                                    >
                                                        Fork
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        style={{
                                                            borderRadius: 50,
                                                            backgroundColor: "rgba(255, 255, 255, .2)",
                                                            padding: "13px 34px",
                                                            margin: "10px 10px",
                                                            fontSize: "10px",
                                                            color: "#ffffff",
                                                        }}
                                                        onClick={(event) => {
                                                            handleExport(event);
                                                        }}
                                                    >
                                                        Export
                                                    </Button>
                                                </Grid>

                                            </Grid>

                                            <Grid item>

                                                <Card
                                                    sx={{ display: "flex", width: "100%", borderRadius: "30px", justifyContent: 'space-between' }}
                                                    style={{ backgroundColor: "rgba(255, 255, 255, .2)" }}
                                                >
                                                    <CardContent >

                                                        {/* <Typography
                                                            component="div"
                                                            variant="h6"
                                                            style={{
                                                                color: "#B3B3B3",
                                                            }}
                                                        >
                                                            Comment...
                                                        </Typography> */}
                                                        <TextField
                                                            id="comment-text"
                                                            label="Comment..."
                                                            variant="filled"
                                                            fullWidth
                                                            multiline
                                                            style={{
                                                                width: "510px",
                                                                height: "100px"
                                                            }} />
                                                    </CardContent>
                                                </Card>

                                            </Grid>
                                        </Grid>

                                    </Grid>

                                    {/* Comments */}
                                    <Grid item>

                                        <Box sx={{ height: "250px", width: "500px", marginLeft: "20px", marginTop: "20px" }}>
                                            <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
                                                <Grid item>

                                                    <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
                                                        <Grid item>

                                                            <Grid container direction="row" alignItems="stretch">
                                                                <Grid item xs={1}>
                                                                    <Avatar>P</Avatar>
                                                                </Grid>

                                                                <Grid item xs={4}>
                                                                    <Typography
                                                                        component="div"
                                                                        variant="h6"
                                                                        style={{
                                                                            color: "#ffffff",
                                                                        }}
                                                                    >
                                                                        Peter Pan
                                                                    </Typography>

                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            borderRadius: 50,
                                                                            backgroundColor: "rgba(255, 255, 255, .2)",
                                                                            padding: "7px 14px",
                                                                            margin: "10px 10px",
                                                                            fontSize: "8px",
                                                                            color: "#FFB9B9",
                                                                        }}
                                                                    >
                                                                        Reply
                                                                    </Button>

                                                                </Grid>

                                                            </Grid>

                                                        </Grid>

                                                        <Grid item>

                                                            <Box sx={{ height: "60px", width: "300px", marginLeft: "50px" }}>
                                                                <Typography
                                                                    // mt={2}
                                                                    component="div"
                                                                    variant="subtitle1"
                                                                    style={{
                                                                        color: "#ffffff",
                                                                    }}
                                                                >
                                                                    Really nice map! I love Geography!!! Can I collaborate with you on this map?
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                                <Grid item>
                                                    <Grid container direction="column" justifyContent="space-between" alignItems="stretch">
                                                        <Grid item>

                                                            <Grid container direction="row" alignItems="stretch">
                                                                <Grid item xs={1}>
                                                                    <Avatar>C</Avatar>
                                                                </Grid>

                                                                <Grid item xs={4}>
                                                                    <Typography
                                                                        component="div"
                                                                        variant="h6"
                                                                        style={{
                                                                            color: "#ffffff",
                                                                        }}
                                                                    >
                                                                        Chandler Bing
                                                                    </Typography>

                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <Button
                                                                        variant="contained"
                                                                        style={{
                                                                            borderRadius: 50,
                                                                            backgroundColor: "rgba(255, 255, 255, .2)",
                                                                            padding: "7px 14px",
                                                                            margin: "10px 10px",
                                                                            fontSize: "8px",
                                                                            color: "#FFB9B9",
                                                                        }}
                                                                    >
                                                                        Reply
                                                                    </Button>

                                                                </Grid>

                                                            </Grid>

                                                        </Grid>

                                                        <Grid item>

                                                            <Box sx={{ height: "60px", width: "300px", marginLeft: "50px" }}>
                                                                <Typography
                                                                    // mt={2}
                                                                    component="div"
                                                                    variant="subtitle1"
                                                                    style={{
                                                                        color: "#ffffff",
                                                                    }}
                                                                >
                                                                    EWWWWWWWW
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                            </Grid>
                                        </Box>

                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* right */}
                        <Grid item xs={6}>
                            <Box sx={{ marginLeft: "30px", marginTop: "10px" }}>
                                <Card sx={{ borderRadius: "30px" }}>
                                    <CardMedia
                                        component="img"
                                        alt="green iguana"
                                        height="410"
                                        image="cardBackground.png"
                                        style={{ objectFit: "cover" }}
                                    />
                                </Card>
                            </Box>

                            <Button
                                variant="contained"
                                style={{
                                    borderRadius: 50,
                                    backgroundColor: "rgba(255, 255, 255, .2)",
                                    padding: "7px 14px",
                                    margin: "20px 30px",
                                    fontSize: "10px",
                                    color: "#ffffff",
                                }}
                            >
                                Keyword
                            </Button>

                            <Button
                                variant="contained"
                                style={{
                                    borderRadius: 50,
                                    backgroundColor: "rgba(255, 255, 255, .2)",
                                    padding: "7px 14px",
                                    margin: "20px 30px",
                                    fontSize: "10px",
                                    color: "#ffffff",
                                }}
                            >
                                Keyword
                            </Button>

                            <Button
                                variant="contained"
                                style={{
                                    borderRadius: 50,
                                    backgroundColor: "rgba(255, 255, 255, .2)",
                                    padding: "7px 14px",
                                    margin: "20px 30px",
                                    fontSize: "10px",
                                    color: "#ffffff",
                                }}
                            >
                                Keyword
                            </Button>



                        </Grid>

                    </Grid>

                </Box>
            </Modal>
        </div>
    );
}
