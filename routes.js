const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/allTasks', (req, res) => {
    db.all('SELECT * FROM tb_tasks', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener tareas' });
            return;
        }
        res.json(rows);
    });
});

// Ruta para insertar un nuevo registro
router.post('/insertTask', (req, res) => {
    const { campo1, campo2 } = req.body; // Suponiendo que los datos se envían en el cuerpo de la solicitud
    db.run('INSERT INTO tb_tasks (title, description, dateCreated, dateEdited) VALUES (?, ?)', [campo1, campo2], function(err) {
        if (err) {
            console.error('Error al insertar el registro:', err.message);
            res.status(500).json({ error: 'Error al insertar el registro' });
            return;
        }
        res.json({ message: 'Registro insertado correctamente', id: this.lastID });
    });
});

module.exports = router;
