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
  // useEffect(() => {
  //   if (auth.error) {
  //     console.log(auth.errMessage);
  //     setError(auth.errMessage);
  //   }
  // });


  let navigate = useNavigate();
  store.currentMap.thumbnail = 'map.png';
  //let thumbnail = 'map.png';
/*
  const geojsonData = store.currentMap.geojsonMap;
  const map = L.map(document.createElement('div'));
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  //const canvas = createCanvas(800, 600);
  //const ctx = canvas.getContext("2d");
  const geojsonLayer = L.geoJson(geojsonData);
  geojsonLayer.eachLayer(function (layer) {
    //console.log(layer);
    layer.addTo(map);
  });
  //geojsonLayer.addTo(canvas);
  let format = 'image';
  var screenshot = L.simpleMapScreenshoter().addTo(map);
  const bounds = map.getBounds();

  // Get pixel position on screen of top left and bottom right
  // of the bounds of the feature
  const nw = bounds.getNorthWest();
  const se = bounds.getSouthEast();
  const topLeft = map.latLngToContainerPoint(nw);
  const bottomRight = map.latLngToContainerPoint(se);

  // Get the resulting image size that contains the feature
  const imageSize = bottomRight.subtract(topLeft);
  screenshot.takeScreen(format).then(image=> {
    const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to the size of your resultant image
        canvas.width = image.x;
        canvas.height = image.y;

        // Draw just the portion of the whole map image that contains
        // your feature to the canvas
        // from https://stackoverflow.com/questions/26015497/how-to-resize-then-crop-an-image-with-canvas
        ctx.drawImage(
          image,
          topLeft.x,
          topLeft.y,
          imageSize.x,
          imageSize.y,
          0,
          0,
          image.x,
          image.y
        );

        // Create URL for resultant png
        var imageurl = canvas.toDataURL("image/png");
        console.log(imageurl);
    store.currentMap.thumbnail=imageurl;
    console.log(store.currentMap.thumbnail)
  });
  map.remove();
  //document.getElementById('my-map').style.display='none';
  //ctx.fillStyle = "#FFFFFF"; // set canvas background color
  //ctx.fillRect(0, 0, canvas.width, canvas.height);
/*
  geojsonLayer.eachLayer((layer) => {
    layer.eachLayer((subLayer) => {
      subLayer.setStyle({
        // set sublayer style
        color: "#FF0000", // red line color
        weight: 3, // line weight
        opacity: 1, // line opacity
      });
    });
  });
  
  /*
  var thumbnail = canvas.toDataURL("image/jpeg", 0.5);
  //const thumbnail = 'data:image/png;base64,' + thumbnailBuffer.toString('base64');
  //thumbnail = 'data:image/png;base64,' + thumbnail.toString('base64');

  console.log(thumbnail);

  /*
  useEffect(() =>{
    const geojsonLayer = new L.geoJSON(store.currentMap.geoJsonMap);
    const map = new L.map('map', { zoomControl: false });
    geojsonLayer.addTo(map);
    
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    const bounds = geojsonLayer.getBounds();
    const center = bounds.getCenter();
    
    const layer = geojsonLayer.getLayers()[0];
    const topLeft = map.latLngToContainerPoint(layer.getBounds().getNorthWest());
    
    const ratio = Math.min(canvas.width / layer.getBounds().getSize().x, canvas.height / layer.getBounds().getSize().y);
    const zoom = map.getBoundsZoom(bounds, false);
    const zoomAdjusted = Math.floor(zoom + Math.log(ratio) / Math.log(2));
    
    const map2 = new L.Map(canvas, { zoomControl: false });
    map2.setView(center, zoomAdjusted, false);
    
    const geojsonLayer2 = new L.geoJSON(store.currentMap.geoJsonMap);
    geojsonLayer2.addTo(map2);
    
    const thumbnail = canvas.toDataURL();
    console.log(thumbnail)
    

    return () => {
      // Remove the map
      map.remove();
    };
  }, []);
  */

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
    store.publishMap();
    //navigate("/home");
  };
  const handleEdit = (event) => {
    navigate("/editmap");
  };

  async function isValid(email) {
    let error = null;
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
    const response = await auth.getUserByEmail(email);
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
    console.log("after delete: " + temp_collab);
    setCollaborators(temp_collab);
  }

  function handleChange(evt) {
    setValue(evt.target.value);
    setError(null);
  }

  function handleKeywords(evt) {
    setKeyword(evt.target.value);
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
      if(keyword){
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
