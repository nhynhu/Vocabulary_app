import React from 'react';
import Header from '../header/Header';
import HomeContent from './HomeContent';

const HomePage = () => {
    return (
        <>
            <Header />
            <main>
                <HomeContent />
            </main>
        </>
    );
};

export default HomePage;