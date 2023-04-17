import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import MapCard from "../MapCard";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { Container, InputAdornment, TextField, List } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DeleteModal from "../modals/DeleteModal";
import ExportModal from "../modals/ExportModal";
import ForkModal from "../modals/ForkModal";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from 'react'
import GlobalStoreContext from "../../store";

/*
This screen lists all the maps that the logged in user owns and all the maps that have been shared with the user.
*/

export default function HomeScreen() {
  const { store } = useContext(GlobalStoreContext);

  const [dropdown, setDropdown] = React.useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openFork, setOpenFork] = useState(false);

  const [shpFile, setShpFile] = useState(null);
  const [dbfFile, setDbfFile] = useState(null);
  const [geoJsonFile, setGeoJsonFile] = useState(null);

  const shpInputRef = React.useRef();
  const dbfInputRef = React.useRef();
  const geoJsonInputRef = React.useRef();

  useEffect(() => {
    store.loadUserMaps();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDropdown = (event) => {
    setDropdown(event.target.value);
  };
  const openDeleteModal = (show) => {
    setOpenDelete(show);
  };

  const openExportModal = (show) => {
    setOpenExport(show);
  };
  const openForkModal = (show) => {
    setOpenFork(show);
  };

  const handleUploadSHP = () => {
    shpInputRef.current.click();
  };

  const handleUploadDBF = () => {
    dbfInputRef.current.click();
  }

  const handleUploadGeoJson = () => {
    geoJsonInputRef.current.click();
  };

  const handleShpFileChange = (event) => {
    //setShpFile(event.target.files[0])

    var reader = new FileReader();
    reader.onload = function (buffer) {
      console.log("shp", buffer.target.result);
      setShpFile(buffer.target.result);

      if (event.target.files[0] && dbfFile !== null) {
        store.createNewMapSHPDBF(buffer.target.result, dbfFile);
      }
    };
    reader.readAsArrayBuffer(event.target.files[0]);
  };

  const handleDbfFileChange = (event) => {
    //setDbfFile(event.target.files[0])

    var reader = new FileReader();
    reader.onload = function (buffer) {
      console.log("dbf", buffer.target.result);
      setDbfFile(buffer.target.result);

      if (event.target.files[0] && shpFile !== null) {
        store.createNewMapSHPDBF(shpFile, buffer.target.result);
      }
    };
    reader.readAsArrayBuffer(event.target.files[0]);
  };

  const handleGeoJsonFileChange = (event) => {

    var reader = new FileReader();
    reader.onload = function (buffer) {
      console.log("geojson", buffer.target.result);
      console.log("type", typeof buffer.target.result);
      setGeoJsonFile(buffer.target.result);
      store.createNewMapGeoJson(buffer.target.result);
    };

    reader.readAsArrayBuffer(event.target.files[0]);
  };


  let mapcards = "";
  if (store.userMaps) {

    mapcards = (
      <List
        id="mapcards"
      >
        {store.userMaps.map((map) => (
          <MapCard
            id={map._id}
            mapName={map.name}
            ownerUsername={map.ownerUsername}
            setOpenDelete={openDeleteModal}
            setOpenExport={openExportModal}
            setOpenFork={openForkModal}
            dropdown={dropdown}
          />
        ))}
      </List>
    );
  }

  return (
    <div id="main-screen">
      {/* create map */}
      <div id="create-map">
        <Card
          sx={{
            display: "flex",
            width: "100%",
            borderRadius: "30px",
            justifyContent: "space-between",
          }}
          style={{ backgroundColor: "rgba(0,0,0, 0.4)" }}
        >
          <Box display="flex" sx={{ flex: "50%", pl: "5%" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto", mt: 6 }}>
                <Typography
                  component="div"
                  variant="h5"
                  style={{
                    color: "#FFE484",
                  }}
                  id="create-map-title"
                >
                  Create New Map
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
                <div>
                  <Button
                    variant="contained"
                    style={{
                      borderRadius: 50,
                      backgroundColor: "#AEAFFF",
                      padding: "13px 34px",
                      margin: "10px 10px",
                      fontSize: "13px",
                      color: "#000000",
                    }}
                    onClick={handleUploadSHP}
                  >
                    SHP
                  </Button>
                  <input
                    type="file"
                    ref={shpInputRef}
                    onChange={handleShpFileChange}
                    accept=".shp"
                    style={{ display: 'none' }}
                  />
                </div>
                <div>
                  <Button
                    variant="contained"
                    style={{
                      borderRadius: 50,
                      backgroundColor: "#AEAFFF",
                      padding: "13px 34px",
                      margin: "10px 10px",
                      fontSize: "13px",
                      color: "#000000",
                    }}
                    onClick={handleUploadDBF}
                  >
                    DBF
                  </Button>
                  <input
                    type="file"
                    ref={dbfInputRef}
                    onChange={handleDbfFileChange}
                    accept=".dbf"
                    style={{ display: 'none' }}
                  />
                </div>
                <div>
                  <Button
                    variant="contained"
                    style={{
                      borderRadius: 50,
                      backgroundColor: "#FFE484",
                      padding: "13px 34px",
                      margin: "10px 10px",
                      fontSize: "13px",
                      color: "#000000",
                    }}
                    onClick={handleUploadGeoJson}
                  >
                    GeoJson
                  </Button>
                  <input
                    type="file"
                    ref={geoJsonInputRef}
                    accept=".json"
                    onChange={handleGeoJsonFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </Box>
            </Box>
            <CardMedia
              component="img"
              sx={{ width: 400, m: 4, pl: "30%" }}
              image="logo.png"
              alt="Live from space album cover"
            />
          </Box>
        </Card>
      </div>
      <br></br>

      <div
        id="home-dropdown"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* dropdown */}
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <Select
            disableUnderline
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={dropdown}
            onChange={handleDropdown}
            defaultValue={dropdown}
            sx={{ borderRadius: "30px" }}
          >
            <MenuItem value={10}>Maps I Own</MenuItem>
            <MenuItem value={20}>Shared With Me</MenuItem>
          </Select>
        </FormControl>

        {/* search bar */}
        <TextField
          id="search-bar"
          type="search"
          label="Search"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: 600 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <br></br>
      {/* mapcards */}
      <div>{mapcards}</div>

      <DeleteModal open={openDelete} setOpen={setOpenDelete} />
      <ExportModal open={openExport} setOpen={setOpenExport} />
      <ForkModal open={openFork} setOpen={setOpenFork} />
    </div>
  );
}
