const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'markband1',
    host: 'localhost',
    database: 'pokemon',
    password: '123456',
    port: 5432,
});

// Rutas API
app.get('/api/characters', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM characters');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener personajes:', error);
        res.status(500).json({ error: 'Error al obtener personajes.' });
    }
});

app.post('/api/characters', async (req, res) => {
    const { name, species, type, level } = req.body;
    const query = 'INSERT INTO characters (name, species, type, level) VALUES ($1, $2, $3, $4) RETURNING *';

    try {
        const { rows } = await pool.query(query, [name, species, type, level]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al crear personaje:', error);
        res.status(500).json({ error: 'Error al crear personaje.' });
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
