import * as React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Button from "@mui/material/Button";
import { useState } from "react";
import ExportModal from "./modals/ExportModal";
import ForkModal from "./modals/ForkModal";
import { useNavigate } from "react-router-dom";
import { FormControl, FormLabel, TextField, Box } from "@mui/material";
import GlobalStoreContext from "../store";
import { useContext } from 'react'

/*
    This React component lets us create and attach custom properties to a map, which only
    happens when we are on the proper route.
    
*/

export default function CreateMap() {
  const { store } = useContext(GlobalStoreContext);

  const [openExport, setOpenExport] = useState(false);
  const [openFork, setOpenFork] = useState(false);

  const [name, setName] = useState(store.currentMap.name);
  const [keywords, setKeywords] = useState(store.currentMap.keywords.toString());
  const [collaborators, setCollaborators] = useState(store.currentMap.collaborators.toString());
  let navigate = useNavigate();
  async function handleExport(event, id) {
    event.stopPropagation();
    setOpenExport(true);
  }
  async function handleFork(event, id) {
    event.stopPropagation();
    setOpenFork(true);
  }

  const handleSave = (event) => {
    store.updateMapCustomProperties(name, keywords, collaborators);
  };
  const handlePublish = (event) => {
    navigate("/home");
  };
  const handleEdit = (event) => {
    navigate("/editmap");
  };

  return (
    <div id="main-screen">
      <IconButton
        aria-label="back"
        onClick={(event) => {
          navigate("/home");
        }}
      >
        <ArrowBackIosIcon />
        Home
      </IconButton>
      <div id="create-map-screen">
        <div>
          <div>
            <Button
              variant="contained"
              sx={{ maxWidth: 100 }}
              style={{
                borderRadius: 50,
                backgroundColor: "#FFE484",
                padding: "7px 34px",
                margin: "10px 10px",
                fontSize: "13px",
                color: "#000000",
              }}
              onClick={(event) => {
                handleFork(event);
              }}
            >
              Fork
            </Button>
            <Button
              variant="contained"
              sx={{ maxWidth: 100 }}
              style={{
                borderRadius: 50,
                backgroundColor: "#FFE484",
                padding: "7px 34px",
                margin: "10px 10px",
                fontSize: "13px",
                color: "#000000",
              }}
              onClick={(event) => {
                handleExport(event);
              }}
            >
              Export
            </Button>
          </div>
          <Box
            component="img"
            sx={{
              height: 500,
              width: 700,
              mr: 5,
              //   maxHeight: { xs: 233, md: 167 },
              //   maxWidth: { xs: 350, md: 250 },
            }}
            alt="Map Preview"
            src="map.png"
          />
          <div>
            <Button
              variant="contained"
              sx={{ maxWidth: 300 }}
              style={{
                borderRadius: 50,
                backgroundColor: "#AEAFFF",
                padding: "7px 34px",
                margin: "10px 10px",
                fontSize: "13px",
                color: "#000000",
              }}
              onClick={(event) => {
                handleEdit(event);
              }}
            >
              Edit Map Properties
            </Button>
          </div>
          <ExportModal open={openExport} setOpen={setOpenExport} />
          <ForkModal open={openFork} setOpen={setOpenFork} />
        </div>
        <div>
          <FormControl>
            <h1 style={{ color: "#AEAFFF" }}>Attach Custom Properties</h1>
            <TextField
              margin="normal"
              required
              fullWidth
              name="Name"
              label="Name"
              type="Name"
              variant="outlined"
              // color="secondary"
              focused
              defaultValue = {store.currentMap.name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              name="Keywords"
              label="Keywords"
              //   type="Keywords"
              variant="outlined"
              // color="secondary"
              focused
              defaultValue = {store.currentMap.keywords.toString()}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              name="Invite Collaborators"
              label="Invite Collaborators:"
              //   type="Invite Collaborators"
              variant="outlined"
              // color="secondary"
              focused
              defaultValue = {store.currentMap.collaborators.toString()}
              onChange={(e) => setCollaborators(e.target.value)}
            />
            <div>
              <Button
                variant="contained"
                sx={{ maxWidth: 100 }}
                style={{
                  borderRadius: 50,
                  backgroundColor: "#AEAFFF",
                  padding: "7px 34px",
                  margin: "10px 10px",
                  fontSize: "13px",
                  color: "#000000",
                }}
                onClick={(event) => {
                  handleSave(event);
                }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                sx={{ maxWidth: 100 }}
                style={{
                  borderRadius: 50,
                  backgroundColor: "#FFE484",
                  padding: "7px 34px",
                  margin: "10px 10px",
                  fontSize: "13px",
                  color: "#000000",
                }}
                onClick={(event) => {
                  handlePublish(event);
                }}
              >
                Publish
              </Button>
            </div>
          </FormControl>
        </div>
      </div>
    </div>
  );
}
