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
import { useContext, useEffect } from "react";
import api from "../api";
import AuthContext from "../auth";
import L from 'leaflet';
import { createCanvas, canvas } from 'canvas';
import { geoMercator, geoPath } from 'd3-geo';
import {SimpleMapScreenshoter} from 'leaflet-simple-map-screenshoter';




/*
    This React component lets us create and attach custom properties to a map, which only
    happens when we are on the proper route.
    
*/

export default function CreateMap() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [openExport, setOpenExport] = useState(false);
  const [openFork, setOpenFork] = useState(false);

  const [name, setName] = useState(store.currentMap.name);
  const [keywords, setKeywords] = useState(
    // store.currentMap.keywords.toString()
    store.currentMap.keywords
  );
  // const [collaborators, setCollaborators] = useState(
  //   store.currentMap.collaborators.toString()
  // );
  const [collaborators, setCollaborators] = useState(
    store.currentMap.collaborators
  );
  const [value, setValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState(null);
  const [keywordError, setKeywordError] = useState(null);

  // useEffect(() => {
  //   if (auth.error) {
  //     console.log(auth.errMessage);
  //     setError(auth.errMessage);
  //   }
  // });


  let navigate = useNavigate();

  async function handleExport(event, id) {
    event.stopPropagation();
    setOpenExport(true);
    store.markMapForExport(store.currentMap._id);
  }
  async function handleFork(event, id) {
    event.stopPropagation();
    setOpenFork(true);
    store.duplicateMapById(store.currentMap._id);
  }

  const handleSave = (event) => {
    store.updateMapCustomProperties(name, keywords, collaborators);
  };
  const handlePublish = (event) => {
    console.log(store.currentMap);
    store.updateMapCustomProperties(name, keywords, collaborators);
    store.publishMap();
  };
  const handleEdit = (event) => {
    console.log(store.currentMap._id);
    navigate("/editmap/" + store.currentMap._id);
  };

  async function isValid(email) {
    let error = null;
    email = email.trim();
    if (email === store.currentMap.ownerEmail) {
      error = `You can not share the map to yourself`;
      setError(error);
      return false;
    }
    if (email === "") {
      error = `Please enter an email`;
      setError(error);
      return false;
    }
    if (isInList(email)) {
      error = `${email} has already been added.`;
      setError(error);
      return false;
    }
    if (!isEmail(email)) {
      error = `${email} is not a valid email address.`;
      setError(error);
      return false;
    }
    const response = await auth.getUserByEmail(email, store.currentMap._id);
    if (!response) {
      error = `${email} is not registered.`;
      setError(error);
      return false;
    }
    return true;
  }

  function isInList(email) {
    return collaborators.includes(email);
  }

  function isEmail(email) {
    return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
  }

  function handleDelete(item) {
    console.log("item: " + item);
    let temp_collab = collaborators.filter((i) => i !== item);
    store.removeSharedMap(store.currentMap._id, item);
    console.log("after delete: " + temp_collab);
    setCollaborators(temp_collab);
  }

  function handleChange(evt) {
    setValue(evt.target.value);
    setError(null);
  }

  function handleKeywords(evt) {
    setKeyword(evt.target.value);
    setKeywordError(null);

  }

  const handleKeyDown = async (evt) => {
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();
      // var value = value.trim();
      // collaborators.map((item) => (console.log(item+"\n")))
      const isValidValue = await isValid(value);
      if (value && isValidValue) {
        setError(null);
        setValue("");
        collaborators.push(value);
        console.log("collaborators: " + collaborators);
        setCollaborators(collaborators);
      }
    }
  };


  const handleKeywordKeyDown = async (evt) => {
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();
      if(keyword.trim()){
        if(keywords.includes(keyword)){
          setKeywordError(`${keyword} has already been added.`);
          return;
        }
        keywords.push(keyword);
        setKeywords(keywords);
        setKeyword("")
      }  
    }
  };

   function handleKeywordDelete(item) {
     let temp_key = keywords.filter((i) => i !== item);
     setKeywords(temp_key);
   }
   console.log(auth.user.username+", "+store.currentMap.ownerUsername);
   let share = "";
   if (auth.user.username === store.currentMap.ownerUsername) {
     share = (
       <div>
         <TextField
           margin="normal"
           fullWidth
           name="Invite Collaborators"
           label="Invite Collaborators:"
           //   type="Invite Collaborators"
           variant="outlined"
           // color="secondary"
           focused
           // defaultValue={store.currentMap.collaborators.toString()}
           value={value}
           placeholder="Type email addresses and press `Enter`"
           // onChange={(e) => setValue(e.target.value)}
           onKeyDown={handleKeyDown}
           onChange={handleChange}
         />
         {error && <p className="collaborator-error">{error}</p>}
         {collaborators.map((item) => (
           <div className="tag-item" key={item}>
             {item}
             <button
               type="button"
               className="button"
               onClick={() => handleDelete(item)}
             >
               &times;
             </button>
           </div>
         ))}
       </div>
     );
   }
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
      <div id="create-map-screen" >
        <div>
          {/* <div>
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
          </div> */}

          <Box
            id="img"
            component="img"
            sx={{
              height: 500,
              width: 700,
              mr: 5,

              //   maxHeight: { xs: 233, md: 167 },
              //   maxWidth: { xs: 350, md: 250 },
            }}
            alt="Map Preview"
            src={store.currentMap.thumbnail}
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
              defaultValue={store.currentMap.name}
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
              placeholder="Type keywords and press `Enter`"
              value={keyword}
              defaultValue={store.currentMap.keywords.toString()}
              onChange={handleKeywords}
              onKeyDown={handleKeywordKeyDown}
            />
            {keywordError && (
              <p className="collaborator-error">{keywordError}</p>
            )}
            {keywords.map((item) => (
              <div className="tag-item" key={item}>
                {item}
                <button
                  type="button"
                  className="button"
                  onClick={() => handleKeywordDelete(item)}
                >
                  &times;
                </button>
              </div>
            ))}
            {share}
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
