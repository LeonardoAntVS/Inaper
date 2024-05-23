import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Voluntarios from './pages/Voluntarios';
import Atividades from './pages/Atividades';
import Acolhidos from './pages/Acolhidos';

function App() {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleLogin = () => {
        setLoggedIn(true);
    };

    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    {loggedIn ? <Redirect to="/voluntarios" /> : <Home onLogin={handleLogin} />}
                </Route>
                <Route path="/voluntarios" exact>
                    {loggedIn ? <Voluntarios /> : <Redirect to="/" />}
                </Route>
                <Route path="/atividades" exact>
                    {loggedIn ? <Atividades /> : <Redirect to="/" />}
                </Route>
                <Route path="/acolhidos" exact>
                    {loggedIn ? <Acolhidos /> : <Redirect to="/" />}
                </Route>
                <Redirect to="/" />
            </Switch>
        </Router>
    );
}

export default App;
