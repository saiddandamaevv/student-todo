import React from "react"
import "./styles.scss";
import { signin } from "../../api/auth";
import { Button, TextField } from "@mui/material";
// import LoginForm from "../../components/LoginForm/LoginForm";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from "../../components/Header/Header";



export default function MainPage() {
    return (
        <Header />
    )
}