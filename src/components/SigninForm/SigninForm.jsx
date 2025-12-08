import React, { useContext } from "react"
import "./styles.scss";
import { signin } from "../../api/auth";
import { Divider, Button, TextField, Box, Typography, Alert } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function SigninForm() {

    const navigate = useNavigate();
    const user = useContext(UserContext);

    const [form, setForm] = React.useState({
        login: "",
        password: ""
    });
    const [errors, setErrors] = React.useState({
        login: false,
        password: false
    });
    const [errorMessage, setErrorMessage] = React.useState("");

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    function handleChange(ev) {
        setForm(prev => ({
            ...prev,
            [ev.target.name]: ev.target.value
        }));
        setErrors(prev => ({
            ...prev,
            [ev.target.name]: false
        }));
        setErrorMessage("");
    }

    function validateForm() {
        let valid = true;
        const newErrors = {
            login: form.login.trim() === "",
            password: form.password.trim() === ""
        };

        setErrors(newErrors);

        if (newErrors.login || newErrors.password) {
            setErrorMessage("Пожалуйста, заполните все поля");
            valid = false;
        }

        return valid;
    }

    async function handleSignin() {
        if (!validateForm()) return;

        const res = await signin(form.login, form.password);
        if (!res.error) {
            user.onFetch();
            navigate("/");
        } else {
            setErrorMessage("Ошибка при входе. Проверьте логин и пароль.");
        }
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: "600px",
                    mx: 'auto',
                    mt: 8,
                    bgcolor: "divider",
                    borderRadius: 5,
                    padding: 4,
                    pt: 3,
                    textAlign: "center",
                }}
            >
                <Typography variant="h5" component="h2">
                    Вход
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <form className="signinForm"
                    sx={{
                        bgcolor: "divider",
                        borderRadius: 5,
                        padding: 4,
                        pt: 3,
                    }}
                >
                    <TextField
                        fullWidth
                        id="login"
                        name="login"
                        label="Логин"
                        variant="outlined"
                        type="text"
                        onChange={handleChange}
                        error={errors.login}
                        helperText={errors.login ? "Поле обязательно для заполнения" : ""}
                        value={form.login}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Пароль"
                        variant="outlined"
                        type="password"
                        onChange={handleChange}
                        error={errors.password}
                        helperText={errors.password ? "Поле обязательно для заполнения" : ""}
                        value={form.password}
                        sx={{ mt: 2 }}
                    />

                    <Button
                        variant="contained"
                        onClick={handleSignin}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Войти
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                        <Divider sx={{ flexGrow: 1 }} />
                        <Box sx={{ px: 2 }}>или</Box>
                        <Divider sx={{ flexGrow: 1 }} />
                    </Box>

                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                        <Button fullWidth variant="outlined">Регистрация</Button>
                    </Link>
                </form>
            </Box>
        </ThemeProvider>
    )
}