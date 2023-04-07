import { useContext, useState } from 'react';
// import AuthContext from '../auth';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NavBar from './NavBar';
// import Copyright from './Copyright'

export default function SplashScreen() {
    // const { auth } = useContext(AuthContext);
    // function handleGuest(event) {
    //     console.log("guest log in rn")
    //     auth.guestLogin();
    // }
    return (
        <div >
            <div id="splash-screen">
            <div id="welcome-text">
                Welcome to ShapeShifter
            </div>
            <div id="welcome-subtext">
            Demigod of the GeoJSON and Shapefiles, Hero of Geography
            </div>
            <br />

            <div id="welcome-intro">
            Shapeshifter,  the ultimate 2D map platform  designed to transform your geospatial analysis and mapping experience.   Our mission is to provide you with a comprehensive and powerful tool that combines the capabilities of individual services, giving you access to a wide range of functionalities that enable you to create, edit,  and visualize geographical  data in a more  intuitive way.  Whether you're a geography professional, researcher, or enthusiast, Shapeshifter is your go-to resource for all your mapping needs. Join our community today to connect with like-minded individuals, share your maps, and learn from others. Get ready to experience the power of Shapeshifter!
            </div>
            <br />
            <br />

            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
            <Box sx={{ paddingRight: 2 }}>
                <Button variant="contained" style={{
        borderRadius: 40,
        backgroundColor: "#FFE484",
        padding: "13px 34px",
        fontSize: "15px",
        color: "#000000"
    }} >Explore Our Community</Button>
            </Box>
            

            </Box>
            </div>

            {/* <Copyright></Copyright> */}
        </div>
    )
}