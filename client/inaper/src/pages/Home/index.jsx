import React, { useState } from 'react';
import Header from '../../components/Header';
import LoginForm from '../../components/LoginForm';

function Home({ onLogin }) {
    return (
        <>
            <Header />
            <LoginForm onLogin={onLogin} />
        </>
    );
}

export default Home;
