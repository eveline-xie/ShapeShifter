import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import MapCard from "./MapCard";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { Container, InputAdornment, TextField, List } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DeleteModal from "./DeleteModal";
import ExportModal from "./ExportModal";
import ForkModal from "./ForkModal";
import { useNavigate } from "react-router-dom";

export default function HomeScreen() {
  const theme = useTheme();
  const [dropdown, setDropdown] = React.useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openFork, setOpenFork] = useState(false);
  let navigate = useNavigate();

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

  const handleUploadDBF = () => {
    navigate("/createmap");
  };
  const handleUploadGeoJson = () => {
    navigate("/createmap");
  };

  let mapcards = "";
  // if(store)
  mapcards = (
    <List id="mapcards">
      <MapCard
        setOpenDelete={openDeleteModal}
        setOpenExport={openExportModal}
        setOpenFork={openForkModal}
      ></MapCard>
    </List>
  );
  return (
    <div id="main-screen">
      {/* create map */}
      <div id="create-map">
        <Card
          sx={{ display: "flex", width: "100%", borderRadius: "30px", justifyContent: 'space-between' }}
          style={{ backgroundColor: "rgba(0,0,0, 0.4)" }}
        // 20,83,116
        >
          <Box display="flex" sx={{flex: '50%'}}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto", mt: 6 }}>
                <Typography
                  component="div"
                  variant="h5"
                  style={{
                    color: "#FFE484",
                  }}
                >
                  Create New Map
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
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
                  SHP/DBF
                </Button>
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
              </Box>
            </Box>
            <CardMedia
              component="img"
              sx={{ width: 400, m: 4, pl: "30%"}}
              image="logo.png"
              alt="Live from space album cover"
            />
          </Box>
        </Card>
      </div>

      <br></br>

      <div id="home-dropdown" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* dropdown */}
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <Select
            disableUnderline
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={dropdown}
            onChange={handleDropdown}
            defaultValue={dropdown}
            sx = {{borderRadius: "30px"}}
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
          sx={{ width: 600}}
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
      {mapcards}

      <DeleteModal open={openDelete} setOpen={setOpenDelete} />
      <ExportModal open={openExport} setOpen={setOpenExport} />
      <ForkModal open={openFork} setOpen={setOpenFork} />
    </div>
  );
}
