import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';

function Acolhidos() {
    const [acolhidos, setAcolhidos] = useState([]);
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch('http://localhost:3001/api/acolhidos', {
            headers: { 'Authorization': token }
        })
        .then(response => response.json())
        .then(data => setAcolhidos(data));
    }, [token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/acolhidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ nome, sobrenome })
        })
        .then(response => response.json())
        .then(data => setAcolhidos([...acolhidos, data]));
        setNome('');
        setSobrenome('');
    };

    return (
        <>
            <Header />
            <h1>Acolhidos</h1>
            <ul>
                {acolhidos.map(acolhido => (
                    <li key={acolhido.id}>{acolhido.nome} {acolhido.sobrenome}</li>
                ))}
            </ul>
            <h2>Criar Novo Acolhido</h2>
            <form onSubmit={handleSubmit}>
                <label>Nome:</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                <label>Sobrenome:</label>
                <input type="text" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} />
                <button type="submit">Criar</button>
            </form>
        </>
    );
}

export default Acolhidos;
