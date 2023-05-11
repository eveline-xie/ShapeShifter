import * as React from "react";
import { useTheme } from "@mui/material/styles";
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
import { Container, InputAdornment, TextField, List, Grid} from "@mui/material";
import { useState, useContext, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DeleteModal from "../modals/DeleteModal";
import ExportModal from "../modals/ExportModal";
import ForkModal from "../modals/ForkModal";
import ExpandedMapcard from "../ExpandedMapcard";
import GlobalStoreContext from "../../store";

/*
This screen lists all the maps that are published and actions allowed by a logged in user.
*/

export default function CommunityScreen() {
    //   const theme = useTheme();
    //   const [dropdown, setDropdown] = React.useState("");
      const { store } = useContext(GlobalStoreContext);
      const [searchTerm, setSearchTerm] = useState("");
      const [openDelete, setOpenDelete] = useState(false);
      const [openExport, setOpenExport] = useState(false);
      const [openFork, setOpenFork] = useState(false);
      const [openView, setOpenView] = useState(false);
      const [exportName, setExportName] = useState("");
      const [forkName, setForkName] = useState("");
      const [expandName, setExpandName] = useState("");
      const [expandOwnerName, setExpandOwnerName] = useState("");
      const [expandThumbnail, setExpandThumbnail] = useState("");
      const [expandMapid, setExpandMapid] = useState("");

      useEffect(() => {
         store.loadPublishedMaps();
       }, []);

      const handleSearch = (event) => {
        setSearchTerm(event.target.value);
      };

    //   const handleDropdown = (event) => {
    //     setDropdown(event.target.value);
    //   };
      let searchResult = "";

      const openDeleteModal = (show) => {
        setOpenDelete(show);
      };
      const openExportModal = (show) => {
        setOpenExport(show);
      };
      const openForkModal = (show) => {
        setOpenFork(show);
      };
      const openViewModal = (show) => {
        setOpenView(show);
      };
       const exportNameSet = (show) => {
         setExportName(show);
       };
       const forkNameSet = (show) => {
         setForkName(show);
       };
      const expandNameSet = (show) => {
        setExpandName(show);
      };
      const expandOwnerNameSet = (show) => {
         setExpandOwnerName(show);
      };
      const expandThumbnailSet = (show) => {
        setExpandThumbnail(show);
      }
       const expandMapidSet = (show) => {
         setExpandMapid(show);
       };
       
      const handleSearchKeyDown = async (evt) => {
        if (["Enter"].includes(evt.key)) {
          evt.preventDefault();
          console.log("search: "+searchTerm)        }
      };

 if (searchTerm) {
   searchResult = <p>Search results for " {searchTerm}"</p>;
 }
    let mapcards = "";
    // if(store)
    // mapcards = (
    //     <List id="mapcards">
    //         <MapCard
    //             setOpenDelete={openDeleteModal}
    //             setOpenExport={openExportModal}
    //             setOpenFork={openForkModal}
    //             setOpenView={openViewModal}
    //         ></MapCard>
    //     </List>
    // );

    if (store.publishedMaps) {
      console.log("JIIIII"+store.publishedMaps.length);
      mapcards = (
        <List id="mapcards">
          {store.publishedMaps.map((map) => (
            <MapCard
              id={map._id}
              mapName={map.name}
              ownerUsername={map.ownerUsername}
              published={map.published.isPublished}
              setOpenDelete={openDeleteModal}
              setOpenExport={openExportModal}
              setOpenFork={openForkModal}
              setOpenView={openViewModal}
              setExportName={exportNameSet}
              setForkName={forkNameSet}
              setExpandName={expandNameSet}
              setExpandOwnerName={expandOwnerNameSet}
              setExpandMapid={expandMapidSet}
              thumbnail={map.thumbnail}
              setExpandThumbnail={expandThumbnailSet}
              key={map._id}
            />
          ))}
        </List>
      );
    }

    return (
      <div id="community-screen">
        <Grid container spacing={1}>
          {/* <Grid item xs={2}>
            <Button
              variant="contained"
              style={{
                borderRadius: 40,
                backgroundColor: "rgba(255, 255, 255, .4)",
                padding: "13px 34px",
                margin: "10px 10px",
                fontSize: "10px",
                color: "#000000",
              }}
            >
              View All
            </Button> */}
          {/* </Grid>

          <Grid item xs={2}>
            <Button
              variant="contained"
              style={{
                borderRadius: 40,
                backgroundColor: "rgba(255, 255, 255, .4)",
                padding: "13px 34px",
                margin: "10px 10px",
                fontSize: "10px",
                color: "#000000",
              }}
            >
              Key Word
            </Button>
          </Grid> */}

          {/* <Grid item xs={2}>
            <Button
              variant="contained"
              style={{
                borderRadius: 40,
                backgroundColor: "rgba(255, 255, 255, .4)",
                padding: "13px 34px",
                margin: "10px 10px",
                fontSize: "10px",
                color: "#000000",
              }}
            >
              Key Word
            </Button>
          </Grid> */}

          <Grid item xs={1}>
            <TextField
              id="search-bar"
              type="search"
              label="Search"
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleSearchKeyDown}
              sx={{ width: 400 }}
              // InputProps={{
              //   endAdornment: (
              //     <InputAdornment position="end">
              //       <SearchIcon />
              //     </InputAdornment>
              //   ),
              // }}
              // InputLabelProps={{
              //   style: { color: "#ffffff" },
              // }}
            />
          </Grid>
        </Grid>

        <br></br>
        {searchResult}
        {/* <Grid container spacing={1}>
          <Grid item xs={4}>
            {mapcards}

            <DeleteModal open={openDelete} setOpen={setOpenDelete} />
            <ExportModal open={openExport} setOpen={setOpenExport} />
            <ForkModal open={openFork} setOpen={setOpenFork} />
            <ExpandedMapcard open={openView} setOpen={setOpenView} />
          </Grid>
        </Grid> */}
        <div>
          {mapcards}
          <DeleteModal open={openDelete} setOpen={setOpenDelete} />
          <ExportModal
            open={openExport}
            setOpen={setOpenExport}
            name={exportName}
          />
          <ForkModal open={openFork} setOpen={setOpenFork} name={forkName} />
          <ExpandedMapcard
            open={openView}
            setOpen={setOpenView}
            name={expandName}
            ownername={expandOwnerName}
            thumbnail={expandThumbnail}
            mapid={expandMapid}
            key={expandMapid}
          />
        </div>
      </div>
    );
}
