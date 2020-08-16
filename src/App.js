import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core';


import LandingPage from './components/LandingPage';
import theme from './components/Theme'


const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <LandingPage />
                <section id="main-page">
                    User forms will be here
                </section>
            </main>
        </ThemeProvider>
    )
};

export default App;
