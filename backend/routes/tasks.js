const express = require('express');
const pool = require('../db');
const router = express.Router();

const STATUSES = ['todo', 'in_progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

const validId = value => /^[1-9]\d*$/.test(String(value));

async function validateTask(data) {
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const status = data.status ?? 'todo';
  const priority = data.priority ?? 'medium';
  const deadline = data.deadline || null;
  const assigneeId = data.assigneeId ?? null;

  if (title.length < 3 || title.length > 100) {
    return { error: 'Tytuł musi mieć od 3 do 100 znaków' };
  }

  if (!STATUSES.includes(status)) {
    return { error: 'Nieprawidłowy status' };
  }

  if (!PRIORITIES.includes(priority)) {
    return { error: 'Nieprawidłowy priorytet' };
  }

  if (deadline !== null) {
    if (typeof deadline !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(deadline) ||
        Number.isNaN(Date.parse(deadline)) ||
        new Date(deadline).toISOString().slice(0, 10) !== deadline) {
      return { error: 'Nieprawidłowa data' };
    }
  }

  if (!validId(data.boardId)) {
    return { error: 'Nieprawidłowe boardId' };
  }

  const [boards] = await pool.query(
    'SELECT id FROM boards WHERE id = ? AND isDeleted = 0',
    [data.boardId]
  );

  if (boards.length === 0) {
    return { error: 'Wybrana tablica nie istnieje' };
  }

  if (assigneeId !== null) {
    if (!validId(assigneeId)) {
      return { error: 'Nieprawidłowe assigneeId' };
    }

    const [users] = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [assigneeId]
    );

    if (users.length === 0) {
      return { error: 'Użytkownik nie istnieje' };
    }
  }

  return {
    title,
    description: data.description ?? null,
    status,
    priority,
    deadline,
    boardId: data.boardId,
    assigneeId
  };
}

// Zadania wybranej tablicy
router.get('/boards/:boardId/tasks', async (req, res, next) => {
  try {
    const [boards] = await pool.query(
      'SELECT id FROM boards WHERE id = ? AND isDeleted = 0',
      [req.params.boardId]
    );

    if (boards.length === 0) {
      return res.status(404).json({ error: 'Nie znaleziono tablicy' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE boardId = ? AND isDeleted = 0',
      [req.params.boardId]
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Szczegóły zadania
router.get('/tasks/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND isDeleted = 0',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nie znaleziono zadania' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Dodawanie zadania
router.post('/tasks', async (req, res, next) => {
  try {
    const data = await validateTask(req.body);

    if (data.error) {
      return res.status(400).json(data);
    }

    const [result] = await pool.query(
      `INSERT INTO tasks
      (title, description, status, priority, deadline, boardId, assigneeId)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title, data.description, data.status,
        data.priority, data.deadline, data.boardId, data.assigneeId
      ]
    );

    res.status(201).json({ id: result.insertId, ...data });
  } catch (err) {
    next(err);
  }
});

// Edycja zadania
router.put('/tasks/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND isDeleted = 0',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nie znaleziono zadania' });
    }

    const data = await validateTask(req.body);

    if (data.error) {
      return res.status(400).json(data);
    }

    await pool.query(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?,
           priority = ?, deadline = ?, boardId = ?, assigneeId = ?
       WHERE id = ? AND isDeleted = 0`,
      [
        data.title, data.description, data.status,
        data.priority, data.deadline, data.boardId,
        data.assigneeId, req.params.id
      ]
    );

    res.json({ id: Number(req.params.id), ...data });
  } catch (err) {
    next(err);
  }
});

// Soft delete zadania
router.delete('/tasks/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query(
      `UPDATE tasks
       SET isDeleted = 1, deletedAt = NOW(), deletedById = 1
       WHERE id = ? AND isDeleted = 0`,
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nie znaleziono zadania' });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
