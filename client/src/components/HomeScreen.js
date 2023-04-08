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

export default function HomeScreen() {
  const theme = useTheme();
  const [dropdown, setDropdown] = React.useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [openFork, setOpenFork] = useState(false);


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
    <div id="home-screen">
      {/* create map */}
      <div id="create-map">
        <Card
          sx={{ display: "flex", width: "100%", borderRadius: "30px" }}
          style={{ backgroundColor: "rgba(20,83,116, 0.6)" }}
        >
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
              >
                GeoJson
              </Button>
            </Box>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 400, m: 4, pl: "10%" }}
            image="logo.png"
            alt="Live from space album cover"
          />
        </Card>
      </div>

      <br></br>

      <div id="home-dropdown">
        {/* dropdown */}
        <Box sx={{ minWidth: 320 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Map I Own</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dropdown}
              label="dropdown"
              onChange={handleDropdown}
            >
              <MenuItem value={10}>Shared With Me</MenuItem>
            </Select>
          </FormControl>
        </Box>

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
      {mapcards}

      <DeleteModal open={openDelete} setOpen={setOpenDelete} />
      <ExportModal open={openExport} setOpen={setOpenExport} />
      <ForkModal open={openFork} setOpen={setOpenFork} />
    </div>
  );
}
