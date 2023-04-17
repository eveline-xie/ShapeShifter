import * as React from "react";
import { useContext } from "react";
import GlobalStoreContext from "../../store";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

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
    This component serves as a popup modal. It only shows up when the user clicks the export button on the map.
*/

export default function ExportModal(props) {
   const { store } = useContext(GlobalStoreContext);

  function handleClose() {
    props.setOpen(false);
  }

  function handleExportSHPDBF() {
    console.log("test", store.mapIdMarkedForExport);
    store.exportToSHPDBF();
    handleClose();
  }

  function handleExportGeoJson() {
    console.log("yes", store.mapIdMarkedForExport);
    store.exportToGeoJSON();
    handleClose();
  }

  return (
    <div>
      <Modal
        id="delete-modal"
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
            Which format do you want to Export the “North America” Map?
          </Typography>
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
            onClick={handleExportSHPDBF}
          >
            DBF/SHP
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
            onClick={handleExportGeoJson}
          >
            GeoJson
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
