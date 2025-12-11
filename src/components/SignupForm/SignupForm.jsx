import React, { useContext } from "react"
import "./styles.scss";
import { signup } from "../../api/auth";
import { Button, TextField, Box, Typography, Divider, Alert } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";


export default function SignupForm() {

    const navigate = useNavigate();
    const user = useContext(UserContext);

    const [form, setForm] = React.useState({
        name: "",
        email: "",
        login: "",
        password: "",
        repeatPassword: ""
    })

    const [errors, setErrors] = React.useState({
        name: false,
        email: false,
        login: false,
        password: false,
        repeatPassword: false
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
            name: form.name.trim() === "",
            email: form.email.trim() === "",
            login: form.login.trim() === "",
            password: form.password.trim() === "",
            repeatPassword: form.repeatPassword.trim() === ""
        };

        setErrors(newErrors);

        if (form.password != form.repeatPassword) {
            setErrorMessage("Пароли не совпадают");
            valid = false;
        }

        if (newErrors.email || newErrors.name || newErrors.login || newErrors.password || newErrors.repeatPassword) {
            setErrorMessage("Пожалуйста, заполните все поля");
            valid = false;
        }

        return valid;
    }

    async function handleSignup() {
        if (!validateForm()) return;
        const res = await signup(form.name, form.email, form.login, form.password, form.repeatPassword);

        if (!res.error) {
            // user.onFetch();
            navigate("/");
        } else {
            setErrorMessage("Ошибка регистрации");
        }
        setErrorMessage("Ошибка регистрации");

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
                    Регистрация
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <form className="signupForm"
                    sx={{
                        bgcolor: "divider",
                        borderRadius: 5,
                        padding: 4,
                        pt: 3,
                    }}
                >
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Имя"
                        variant="outlined"
                        type="text"
                        onChange={(ev) => handleChange(ev)}
                        error={errors.name}
                        helperText={errors.name ? "Поле обязательно для заполнения" : ""}
                        value={form.name}
                    />
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Почта"
                        variant="outlined"
                        type="email"
                        onChange={(ev) => handleChange(ev)}
                        error={errors.email}
                        helperText={errors.email ? "Поле обязательно для заполнения" : ""}
                        value={form.email}
                    />
                    <TextField
                        fullWidth
                        id="login"
                        name="login"
                        label="Логин"
                        variant="outlined"
                        type="text"
                        onChange={(ev) => handleChange(ev)}
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
                        onChange={(ev) => handleChange(ev)}
                        error={errors.password}
                        helperText={errors.password ? "Поле обязательно для заполнения" : ""}
                        value={form.password}
                    />
                    <TextField
                        fullWidth
                        id="repeatPassword"
                        name="repeatPassword"
                        label="Повторите пароль"
                        variant="outlined"
                        type="password"
                        onChange={(ev) => handleChange(ev)}
                        error={errors.repeatPassword}
                        helperText={errors.repeatPassword ? "Поле обязательно для заполнения" : ""}
                        value={form.repeatPassword}
                    />

                    <Button variant="contained" onClick={() => handleSignup()}>Зарегистрироваться</Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                        <Divider sx={{ flexGrow: 1 }} />
                        <Box sx={{ px: 2 }}>или</Box>
                        <Divider sx={{ flexGrow: 1 }} />
                    </Box>

                    <Link to="/signin">
                        <Button fullWidth variant="outlined">Вход</Button>
                    </Link>

                </form>
            </Box>

        </ThemeProvider>
    )
}