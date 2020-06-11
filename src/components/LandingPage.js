import React, { useContext } from 'react';

import DataContext from './DataContext';

const LandingPage = () => {
    const data = useContext(DataContext);
    console.log(data);

    return <h1>LandingPage</h1>;
};

export default LandingPage;
