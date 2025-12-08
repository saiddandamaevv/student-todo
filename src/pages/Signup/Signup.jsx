import React from "react"
import "./styles.scss";
import { Box } from "@mui/material";
import SignupForm from "../../components/SignupForm/SignupForm";
import Header from "../../components/Header/Header";



export default function Signup() {
    return (<Box
        sx={{
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            maxHeight: "100%",
            overflow: "hidden"
        }}
    >

        <SignupForm />

    </Box>

    )
}