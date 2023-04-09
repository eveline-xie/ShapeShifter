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
import { Container, InputAdornment, TextField, List, Grid} from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DeleteModal from "./DeleteModal";
import ExportModal from "./ExportModal";
import ForkModal from "./ForkModal";

export default function CommunityScreen() {
    //   const theme = useTheme();
    //   const [dropdown, setDropdown] = React.useState("");
    //   const [searchTerm, setSearchTerm] = useState("");
      const [openDelete, setOpenDelete] = useState(false);
      const [openExport, setOpenExport] = useState(false);
      const [openFork, setOpenFork] = useState(false);


    //   const handleSearch = (event) => {
    //     setSearchTerm(event.target.value);
    //   };

    //   const handleDropdown = (event) => {
    //     setDropdown(event.target.value);
    //   };
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
        <div id="community-screen">

            <Grid container spacing={1}>

                <Grid item xs={1}>
                    {/* <Button
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
                    </Button> */}
                </Grid>

            </Grid>

            
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





            <br></br>
            {/* mapcards */}
            {mapcards}

            <DeleteModal open={openDelete} setOpen={setOpenDelete} />
            <ExportModal open={openExport} setOpen={setOpenExport} />
            <ForkModal open={openFork} setOpen={setOpenFork} />
        </div>
    );
}
