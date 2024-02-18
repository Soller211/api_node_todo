const express = require('express');
const app = express();
const db = require('./db');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.get('/allTasks', (req, res) => {
    db.all('SELECT * FROM tb_tasks', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener tareas' });
            return;
        }
        res.json(rows);
    });
});

app.get('/tasksActive', (req, res) => {
    db.all('SELECT * FROM tb_tasks WHERE deleted = 0', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener tareas' });
            return;
        }
        res.json(rows);
    });
});

app.get('/tasksDeleted', (req, res) => {
    db.all('SELECT * FROM tb_tasks WHERE deleted = 1', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener tareas' });
            return;
        }
        res.json(rows);
    });
});


app.post('/insertTask', (req, res) => {
    const { title, description } = req.body;
    const dateCreated = new Date().toISOString();

    const query = `
        INSERT INTO tb_tasks (title, description, dateCreated)
        VALUES (?, ?, ?)
    `;

    db.run(query, [title, description, dateCreated], function(err) {
        if (err) {
            console.error('Error al insertar el registro:', err.message);
            res.status(500).json({ error: 'Error al insertar el registro' });
            return;
        }
        console.log('Registro insertado correctamente, ID:', this.lastID);
        res.json({ message: 'Registro insertado correctamente' });
    });
});

app.put('/updateTask/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, description } = req.body;
    const dateEdited = new Date().toISOString();

    const query = `
        UPDATE tb_tasks
        SET title = ?,
            description = ?,
            dateEdited = ?
        WHERE id = ?
    `;

    db.run(query, [title, description, dateEdited, taskId], function(err) {
        if (err) {
            console.error('Error al actualizar el registro:', err.message);
            res.status(500).json({ error: 'Error al actualizar el registro' });
            return;
        }
        console.log('Registro actualizado correctamente, ID:', taskId);
        res.json({ message: 'Registro actualizado correctamente' });
    });
});

// Ruta (soft delete)
app.delete('/deleteTask/:id', (req, res) => {
    const taskId = req.params.id;

    const query = `
        UPDATE tb_tasks
        SET deleted = 1
        WHERE id = ?
    `;

    db.run(query, [taskId], function(err) {
        if (err) {
            console.error('Error al marcar la tarea como borrada:', err.message);
            res.status(500).json({ error: 'Error al marcar la tarea como borrada' });
            return;
        }
        console.log('Tarea marcada como borrada correctamente, ID:', taskId);
        res.json({ message: 'Tarea marcada como borrada correctamente' });
    });
});



module.exports = app;
