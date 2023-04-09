import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteModal from './DeleteModal';
import { useNavigate } from 'react-router-dom';

export default function MapCard(props) {

  let navigate = useNavigate();
  var owner = ""
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
  async function handleDeleteList(event, id) {
    event.stopPropagation();
    props.setOpenDelete(true);
    // store.markListForDeletion(id);
  }

  async function handleExport(event, id) {
    event.stopPropagation();
    props.setOpenExport(true);
  }
  async function handleFork(event, id) {
    event.stopPropagation();
    props.setOpenFork(true);
  }

  async function handleEditMap() {
    console.log("Test");
    navigate('/createmap');
  }
  var leftButton = <Button variant="contained" sx={{ maxWidth: 100 }} style={{
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
  return (
    <Card sx={{
      maxWidth: 325, borderRadius: "30px",
      backgroundColor: 'grey',
      backgroundImage: `url(${"cardBackground.png"})`,
      backgroundSize: 'cover',
      position: 'absolute',
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
          North America
        </Typography>
        {/* if published, add owner */}
        {owner}
      </CardContent>
      <CardActions>
        <div>
          {leftButton}
          {deleteButton}
        </div>
        <div>
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