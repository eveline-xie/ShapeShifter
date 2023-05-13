import * as React from "react";
import { useContext } from "react";
// import { GlobalStoreContext } from '../store'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Grid,
  Card,
  CardContent,
  TextField,
  Avatar,
  CardMedia,
} from "@mui/material";
import ForkModal from "./modals/ForkModal";
import ExportModal from "./modals/ExportModal";
import { useState, useEffect } from "react";
import GlobalStoreContext from "../store";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import geo_file from './custom.geo.json'
/*
    This React component represents the expanded mapcard, after the user clicks on the "view" button of a map card,
    where the user can comment on the map depending on if they are logged in or are a guest.
    
*/

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

export default function ExpandedMapcard(props) {
  const { store } = useContext(GlobalStoreContext);
  const [openExport, setOpenExport] = useState(false);
  const [openFork, setOpenFork] = useState(false);
  const [reply, setReply] = useState(false);
  const [replytext, setReplytext] = useState(false);
  const [comment, setComment] = useState("");
  let navigate = useNavigate();
  useEffect(() => {
    if (props.mapid) {
      store.loadComments(props.mapid);
      console.log("load comments~~~")
    }
  }, []);

  function handleClose() {
    props.setOpen(false);
     if (window.location.pathname == "/community") {
       navigate("/community");
     } else if (window.location.pathname == "/communityguest") {
       navigate("/communityguest");
     }

  }

  async function handleExport(event, id) {
    event.stopPropagation();
    setOpenExport(true);
    store.markMapForExport(props.id);

  }
  async function handleFork(event, id) {
    event.stopPropagation();
    setOpenFork(true);
    store.duplicateMapById(props.mapid);
  }

  function handleReply() {
    setReply(true)
  }

  function keyPress(e) {
    if (e.keyCode == 13) {
      console.log("value", e.target.value);
      setReply(false)
      setReplytext(true)
      // put the login here
    }
  }
  function handleChange(evt) {
    setComment(evt.target.value);
  }
  const handleKeyDown = async (evt) => {
    if (["Enter"].includes(evt.key)) {
      evt.preventDefault();
      console.log("comment: " + comment + props.mapid)
      store.updateMapComments(comment, props.mapid);
      setComment("");
    }
  };

  let replyTextbox = ""
  if (reply) {
    replyTextbox = (
      <TextField
        id="comment-text"
        label="Comment..."
        variant="filled"
        fullWidth
        multiline
        style={{
          width: "510px",
          height: "100px",
        }}
        onKeyDown={keyPress}
      />
    );
  }

  let replyText = ""
  if (replytext) {
    replyText = (
      <Box
        sx={{
          height: "60px",
          width: "300px",
          marginLeft: "70px",
        }}
      >
        <Typography
          // mt={2}
          component="div"
          variant="subtitle1"
          style={{
            color: "#ffffff",
          }}
        >
          Yes
        </Typography>
      </Box>
    );
  }

  let forkButton = <Button
    variant="contained"
    style={{
      borderRadius: 50,
      backgroundColor: "rgba(255, 255, 255, .2)",
      padding: "13px 34px",
      margin: "10px 10px",
      fontSize: "10px",
      color: "#ffffff",
    }}
    sx={{ maxWidth: 100 }}
    onClick={(event) => {
      handleFork(event);
    }}
  >
    Fork
  </Button>

  let commentBox = (
    <Grid item>
      <Card
        sx={{
          display: "flex",
          width: "100%",
          borderRadius: "30px",
          justifyContent: "space-between",
        }}
        style={{
          backgroundColor: "rgba(255, 255, 255, .2)",
        }}
      >
        <CardContent>
          <TextField
            id="comment-text"
            label="Comment..."
            variant="filled"
            fullWidth
            multiline
            style={{
              width: "510px",
              height: "100px",
            }}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            value={comment}
          />
        </CardContent>
      </Card>
    </Grid>
  );

  let replyButton = <Button
    variant="contained"
    style={{
      borderRadius: 50,
      backgroundColor:
        "rgba(255, 255, 255, .2)",
      padding: "7px 14px",
      margin: "10px 10px",
      fontSize: "8px",
      color: "#FFB9B9",
    }}
    onClick={handleReply}
  >
    Reply
  </Button>

  if (window.location.pathname == '/communityguest') {
    forkButton = '';
    commentBox = '';
    replyButton = '';
  }
  let commentsMap = ""
  if (store.mapComments) {
    console.log(store.mapComments);
    commentsMap = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "260px",
          overflow: "auto",
        }}
      >
        {store.mapComments.map((map) => (
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            alignItems="stretch"
          >
            <Grid item>
              <Grid container direction="row" alignItems="stretch">
                <Grid item xs={1}>
                  <Avatar sx={{ bgcolor: "#AEAFFF" }}> {map[0][0]}</Avatar>
                </Grid>

                <Grid item xs={4}>
                  <Typography
                    component="div"
                    variant="h6"
                    style={{
                      color: "#ffffff",
                    }}
                  >
                    {map[0]}
                  </Typography>
                </Grid>

                {/* <Grid item xs={6}>
                      {replyButton}
                    </Grid> */}
              </Grid>
            </Grid>

            <Grid item>
              <Box
                sx={{
                  height: "60px",
                  width: "300px",
                  marginLeft: "50px",
                }}
              >
                <Typography
                  // mt={2}
                  component="div"
                  variant="subtitle1"
                  style={{
                    color: "#ffffff",
                  }}
                >
                  {map[1]}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ))}
      </Box>
    );
  }
  let keywords = props.keywords;
  let keywordButtons = ""
  if(keywords){
    console.log("KEYWORDS HERE: "+keywords)
    keywordButtons = (
      <Grid>
        {keywords.map((k) => (
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
            {k}
          </Button>
        ))}
      </Grid>
    );
  }

  let geojsonData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-122.408986, 37.78356]
        },
        "properties": {
          "name": "San Francisco"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-73.985664, 40.748817]
        },
        "properties": {
          "name": "New York"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [139.691706, 35.689487]
        },
        "properties": {
          "name": "Tokyo"
        }
      }
    ]
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

          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="stretch"
          >
            {/* left */}
            <Grid item xs={6}>
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="stretch"
              >
                {/* name and comment box */}
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    justifyContent="space-between"
                    alignItems="stretch"
                  >
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="stretch"
                      >
                        <Grid item xs={8}>
                          <Typography
                            id="mapcard-name"
                            variant="h3"
                            component="h2"
                            style={{
                              color: "#AEAFFF",
                            }}
                          >
                            {props.name}
                          </Typography>

                          <Typography
                            id="mapcard-owner"
                            variant="h6"
                            component="h2"
                            style={{
                              color: "#B3B3B3",
                            }}
                          >
                            {props.ownername}
                          </Typography>
                        </Grid>

                        <Grid item xs={3}>
                          {/* {forkButton}

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
                              sx={{ maxWidth: 100 }}
                              onClick={(event) => {
                                handleExport(event);
                              }}
                            >
                              Export
                            </Button> */}
                          {/* <ExportModal
                              open={openExport}
                              setOpen={setOpenExport}
                              name={props.name}
                            />
                            <ForkModal
                              open={openFork}
                              setOpen={setOpenFork}
                              name={props.name}
                            /> */}
                        </Grid>
                      </Grid>
                      <br></br>
                      {commentBox}
                    </Grid>
                  </Grid>

                  {/* Comments */}
                  <Grid item>
                    <br></br>
                    {commentsMap}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* right */}
            <Grid item xs={6}>
              <Box sx={{ marginLeft: "30px", marginTop: "10px" }}>
                <Card sx={{ borderRadius: "30px" }}>
                  {/* <CardMedia
                    component="img"
                    alt="green iguana"
                    height="470"
                    image={props.thumbnail}
                    style={{ objectFit: "cover" }}
                  /> */}
                  <div id="map-container" style={{ width: "1000px", height: "480px" }}>
                  <MapContainer center={[0, 500]} zoom={0} container="map-container">
                    <TileLayer 
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                     <GeoJSON data={geo_file} />
                    <pre/><pre/><pre/><pre/><pre/><pre/><pre/><pre/><pre/><pre/><pre/>
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                  </MapContainer>
                  </div>
                </Card>
              </Box>
                  {keywordButtons}
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
