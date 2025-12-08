import React from "react";
import { Box } from "@mui/material";
import "./styles.scss";
import SigninForm from "../../components/SigninForm/SigninForm";
import Header from "../../components/Header/Header";



export default function Signin() {
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

        <SigninForm />

    </Box>

    )
}