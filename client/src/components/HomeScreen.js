import { useContext, useState } from 'react';
// import AuthContext from '../auth';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NavBar from './NavBar';
// import Copyright from './Copyright'
import MapCard from "./MapCard";

export default function HomeScreen() {


    return (
        <div>
            <MapCard></MapCard>
        </div>
    )
}