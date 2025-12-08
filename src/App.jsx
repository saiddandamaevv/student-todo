import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import MainPage from './pages/MainPage/MainPage'
import Signup from './pages/Signup/Signup'
import Signin from './pages/Signin/Signin'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TodoPage from './pages/TodoPage/TodoPage'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import NotesPage from './pages/NotesPage/NotesPage'
import TestSignInPage from './pages/TestSigninPage/TestSignInPage'
import UserProvider from './context/UserContext'

function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/" element={<TodoPage />} />
            <Route path="/signin-test" element={<TestSignInPage />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/signin-test" element={<TestSignInPage />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>

    </ThemeProvider>
  );
}

export default App
