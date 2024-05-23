import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';

function Atividades() {
    const [atividades, setAtividades] = useState([]);
    const [nome, setNome] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch('http://localhost:3001/api/atividades', {
            headers: { 'Authorization': token }
        })
        .then(response => response.json())
        .then(data => setAtividades(data));
    }, [token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/atividades', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ nome })
        })
        .then(response => response.json())
        .then(data => setAtividades([...atividades, data]));
        setNome('');
    };

    return (
        <>
            <Header />
            <h1>Atividades</h1>
            <ul>
                {atividades.map(atividade => (
                    <li key={atividade.id}>{atividade.nome}</li>
                ))}
            </ul>
            <h2>Criar Nova Atividade</h2>
            <form onSubmit={handleSubmit}>
                <label>Nome:</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                <button type="submit">Criar</button>
            </form>
        </>
    );
}

export default Atividades;
