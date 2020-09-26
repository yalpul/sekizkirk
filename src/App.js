import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core';

import LandingPage from './components/LandingPage';
import Form from './components/Form';
import theme from './components/Theme';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <LandingPage />
                <Form />
            </main>
        </ThemeProvider>
    );
};

export default App;
