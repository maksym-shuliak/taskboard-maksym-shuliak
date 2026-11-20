const express = require('express');
const pool = require('../db');
const router = express.Router();
 
const STATUSES = ['todo', 'in_progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];
 
async function validateTask(body) {
    const title = typeof body.title === 'string'
        ? body.title.trim() : '';
 
    if (title.length < 3 || title.length > 100) {
        return 'Tytul musi miec od 3 do 100 znakow';
    }
 
    const status = body.status === undefined ? 'todo' : body.status;
    if (!STATUSES.includes(status)) {
        return 'Nieprawidlowy status';
    }
 
    const priority = body.priority === undefined
        ? 'medium' : body.priority;
 
    if (!PRIORITIES.includes(priority)) {
        return 'Nieprawidlowy priorytet';
    }
 
    if (body.deadline !== null && body.deadline !== undefined
        && body.deadline !== '') {
        if (typeof body.deadline !== 'string'
            || !/^\d{4}-\d{2}-\d{2}$/.test(body.deadline)) {
            return 'Nieprawidlowa data';
        }
 
        const date = new Date(body.deadline + 'T00:00:00Z');
        if (Number.isNaN(date.getTime())
            || date.toISOString().slice(0, 10) !== body.deadline) {
            return 'Nieprawidlowa data';
        }
    }
 
    if (!Number.isInteger(body.boardId) || body.boardId <= 0) {
        return 'Nieprawidlowa tablica';
    }
 
    const [boards] = await pool.query(
        'SELECT id FROM boards WHERE id = ? AND isDeleted = 0',
        [body.boardId]
    );
 
    if (boards.length === 0) {
        return 'Wybrana tablica nie istnieje';
    }
 
    if (body.assigneeId !== null && body.assigneeId !== undefined
        && body.assigneeId !== '') {
        if (!Number.isInteger(body.assigneeId)
            || body.assigneeId <= 0) {
            return 'Nieprawidlowy uzytkownik';
        }
 
        const [users] = await pool.query(
            'SELECT id FROM users WHERE id = ?',
            [body.assigneeId]
        );
 
        if (users.length === 0) {
            return 'Wybrany uzytkownik nie istnieje';
        }
    }
 
    return null;
}
 
// Szczegoly zadania
router.get('/:id', async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM tasks WHERE id = ? AND isDeleted = 0',
            [req.params.id]
        );
 
        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Nie znaleziono zadania'
            });
        }
 
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});
 
// Dodawanie zadania
router.post('/', async (req, res, next) => {
    try {
        const error = await validateTask(req.body);
 
        if (error) {
            return res.status(400).json({ error });
        }
 
        const { title, description, boardId } = req.body;
        const status = req.body.status ?? 'todo';
        const priority = req.body.priority ?? 'medium';
        const deadline = req.body.deadline || null;
        const assigneeId = req.body.assigneeId || null;
 
        const [result] = await pool.query(
            `INSERT INTO tasks
            (title, description, status, priority,
             deadline, boardId, assigneeId)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                title.trim(), description ?? null,
                status, priority, deadline, boardId, assigneeId
            ]
        );
 
        res.status(201).json({
            id: result.insertId,
            title: title.trim()
        });
    } catch (err) {
        next(err);
    }
});
 
// Edycja zadania
router.put('/:id', async (req, res, next) => {
    try {
        const [existing] = await pool.query(
            'SELECT id FROM tasks WHERE id = ? AND isDeleted = 0',
            [req.params.id]
        );
 
        if (existing.length === 0) {
            return res.status(404).json({
                error: 'Nie znaleziono zadania'
            });
        }
 
        const error = await validateTask(req.body);
 
        if (error) {
            return res.status(400).json({ error });
        }
 
        const { title, description, boardId } = req.body;
        const status = req.body.status ?? 'todo';
        const priority = req.body.priority ?? 'medium';
        const deadline = req.body.deadline || null;
        const assigneeId = req.body.assigneeId || null;
 
        await pool.query(
            `UPDATE tasks
             SET title = ?, description = ?, status = ?,
                 priority = ?, deadline = ?, boardId = ?,
                 assigneeId = ?
             WHERE id = ? AND isDeleted = 0`,
            [
                title.trim(), description ?? null, status,
                priority, deadline, boardId, assigneeId,
                req.params.id
            ]
        );
 
        res.json({
            id: Number(req.params.id),
            title: title.trim(),
            status,
            priority,
            deadline,
            boardId,
            assigneeId
        });
    } catch (err) {
        next(err);
    }
});
 
// Soft delete zadania
router.delete('/:id', async (req, res, next) => {
    try {
        const [result] = await pool.query(
            `UPDATE tasks
             SET isDeleted = 1, deletedAt = NOW()
             WHERE id = ? AND isDeleted = 0`,
            [req.params.id]
        );
 
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: 'Nie znaleziono zadania'
            });
        }
 
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});
 
module.exports = router;
