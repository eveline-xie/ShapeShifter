import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react'
import GlobalStoreContext from '../store';

/*
    This React component represents a single map item in our
    home screen, community screen, or guest community screen which can be edited, forked, exported, viewed, or deleted
    depending on the screen.
    
*/

export default function MapCard(props) {
  const { store } = useContext(GlobalStoreContext);
  let navigate = useNavigate();
  let owner = "";
  // if(published){
  //   owner = <Typography variant="body2" color="text.secondary">
  //         owner name
  //       </Typography>
  // }

  // if(published){
  //   leftButton =  <Button variant="contained" sx={{ maxWidth: 100 }} style={{
  //       borderRadius: 50,
  //       backgroundColor: "#FFE484",
  //       padding: "13px 34px",
  //       margin:"10px 10px",
  //       fontSize: "13px",
  //       color: "#000000"
  //   }} >View</Button>
  // }
  async function handleDeleteList(event) {
    event.stopPropagation();
    props.setOpenDelete(true);
    store.markMapForDeletion(props.id);
  }

  async function handleExport(event) {
    event.stopPropagation();
    props.setOpenExport(true);
    store.markMapForExport(props.id);
  }
  async function handleFork(event) {
    event.stopPropagation();
    props.setOpenFork(true);
    store.duplicateMapById(props.id);
  }

  async function handleEditMap() {
    store.loadMapById(props.id);
  }

  async function handleViewMap(event, id) {
    event.stopPropagation();
    props.setOpenView(true);
  }

  var editButton = <Button variant="contained" sx={{ maxWidth: 100 }} style={{
    borderRadius: 50,
    backgroundColor: "rgba(255,228,132, 0.4)",
    padding: "7px 34px",
    margin: "10px 10px",
    fontSize: "13px",
    color: "#FFE484",
  }} onClick={handleEditMap}>Edit</Button>

  var deleteButton = <Button variant="contained" sx={{ maxWidth: 100 }} style={{
    borderRadius: 50,
    backgroundColor: "rgba(255,228,132, 0.4)",
    padding: "7px 34px",
    margin: "10px 10px",
    fontSize: "13px",
    color: "#FFE484"
  }} onClick={(event) => {
    handleDeleteList(event)
  }}>Delete</Button>
  // if(published){
  //   deleteButton=""
  // }

  if (window.location.pathname == '/community' || window.location.pathname == '/communityguest') {
    owner = <div style={{ color: 'white' }}> JoeShmo</div>;
    editButton = "";
    deleteButton = <Button variant="contained" sx={{ maxWidth: 100 }} style={{
      borderRadius: 50,
      backgroundColor: "rgba(255,228,132, 0.4)",
      padding: "7px 34px",
      margin: "10px 10px",
      fontSize: "13px",
      color: "#FFE484"
    }} onClick={(event) => {
      handleViewMap(event)
    }}>View</Button>
  }

  let forkButton = <Button
    variant="contained"
    sx={{ maxWidth: 100 }}
    style={{
      borderRadius: 50,
      backgroundColor: "rgba(255,228,132, 0.4)",
      padding: "7px 34px",
      margin: "10px 10px",
      fontSize: "13px",
      color: "#FFE484",
    }}
    onClick={(event) => {
      handleFork(event);
    }}
  >
    Fork
  </Button>

  if (window.location.pathname == '/communityguest') {
    forkButton = '';
  }

  if (props.dropdown === 20) {
    // console.log(props.dropdown)
    deleteButton = ""
  }

  return (
    <Card sx={{
      maxWidth: 325, borderRadius: "30px",
      backgroundColor: 'grey',
      backgroundImage: `url(${"cardBackground.png"})`,
      backgroundSize: 'cover',
      left: 0
    }} id="mapcard">
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image="logo.png"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div"
          color="white" fontFamily="Kadwa" sx={{ fontSize: 30, fontWeight: 'bold' }}>
          {props.mapName}
        </Typography>
        {/* if published, add owner */}
        {owner}
      </CardContent>
      <CardActions>
        <div>
          {editButton}
          {deleteButton}
        </div>
        <div>
          {forkButton}
          <Button
            variant="contained"
            sx={{ maxWidth: 100 }}
            style={{
              borderRadius: 50,
              backgroundColor: "rgba(255,228,132, 0.4)",
              padding: "7px 34px",
              margin: "10px 10px",
              fontSize: "13px",
              color: "#FFE484",
            }}
            onClick={(event) => {
              handleExport(event);
            }}
          >
            Export
          </Button>
        </div>
      </CardActions>
    </Card>
  );
}