import * as React from "react";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, Typography, Toolbar, Box, AppBar } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import AddIcon from "@mui/icons-material/Add";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import MergeIcon from "@mui/icons-material/Merge";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import CircleIcon from "@mui/icons-material/Circle";
import SouthAmericaIcon from "@mui/icons-material/SouthAmerica";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
export default function EditMap() {
  let navigate = useNavigate();

    return (
      <div>
        <div id="create-map-screen">
          <IconButton
            aria-label="back"
            onClick={(event) => {
              navigate("/createmap");
            }}
          >
            <ArrowBackIosIcon />
            Back
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <UndoIcon />
                </IconButton>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <RedoIcon />
                </IconButton>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <BorderColorIcon />
                </IconButton>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <FormatColorFillIcon />
                </IconButton>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <CircleIcon />
                </IconButton>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <SouthAmericaIcon />
                </IconButton>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MergeIcon />
                </IconButton>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <CallSplitIcon />
                </IconButton>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <InfoIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
          </Box>
        </div>
        <div>
          <Box
            component="img"
            sx={{
              height: 900,
              width: "100%",
              //   maxHeight: { xs: 233, md: 167 },
              //   maxWidth: { xs: 350, md: 250 },
            }}
            alt="Map Preview"
            src="map.png"
          />
        </div>
      </div>
    );
}