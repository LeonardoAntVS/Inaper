import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';

function Voluntarios() {
    const [voluntarios, setVoluntarios] = useState([]);
    const [nome, setNome] = useState('');
    const [atividadeId, setAtividadeId] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch('http://localhost:3001/api/voluntarios', {
            headers: { 'Authorization': token }
        })
        .then(response => response.json())
        .then(data => setVoluntarios(data));
    }, [token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/voluntarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ nome, atividade_id: atividadeId })
        })
        .then(response => response.json())
        .then(data => setVoluntarios([...voluntarios, data]));
        setNome('');
        setAtividadeId('');
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:3001/api/voluntarios/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        })
        .then(() => setVoluntarios(voluntarios.filter(voluntario => voluntario.id !== id)));
    };

    return (
        <>
            <Header />
            <h1>Voluntários</h1>
            <ul>
                {voluntarios.map(voluntario => (
                    <li key={voluntario.id}>
                        {voluntario.nome}
                        <button onClick={() => handleDelete(voluntario.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
            <h2>Criar Novo Voluntário</h2>
            <form onSubmit={handleSubmit}>
                <label>Nome:</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                <label>Atividade ID:</label>
                <input type="text" value={atividadeId} onChange={(e) => setAtividadeId(e.target.value)} />
                <button type="submit">Criar</button>
            </form>
        </>
    );
}

export default Voluntarios;
