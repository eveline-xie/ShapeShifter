import * as React from "react";
import { useContext } from "react";
// import { GlobalStoreContext } from '../store'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "#145374",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: 10,
  p: 4,
};

/*
    This component serves as a popup modal. It only shows up when the user clicks the fork button on the map.
*/

export default function ForkModal(props) {
  // const { store } = useContext(GlobalStoreContext);
  let navigate = useNavigate();

  function handleClose() {
    props.setOpen(false);
    if (window.location.pathname == '/shared'){
      navigate("/home");
    }
  }

  return (
    <div>
      <Modal
        id="fork-modal"
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
            onClick={handleClose}
          >
            X
          </Button>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            “Copy of {props.name}” has been added to your home page.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
