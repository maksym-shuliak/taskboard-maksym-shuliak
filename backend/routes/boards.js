const express = require('express');
const pool = require('../db');
const router = express.Router();
 
// GET /api/boards – lista tablic bez usuniętych
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, description, ownerId, createdAt FROM boards WHERE isDeleted = 0'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});
 
// POST /api/boards – nowa tablica z walidacją
router.post('/', async (req, res, next) => {
  try {
    const name = (req.body.name || '').trim();
    if (name.length < 1 || name.length > 80) {
      return res.status(400).json({ error: 'Nazwa musi mieć od 1 do 80 znaków' });
    }
    const ownerId = req.session.userId; // od poniedziałku 3 z sesji
    const [result] = await pool.query(
      'INSERT INTO boards (name, description, ownerId) VALUES (?, ?, ?)',
      [name, req.body.description || null, ownerId]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    next(err);
  }
});
 
// PUT /api/boards/:id – zmiana nazwy i opisu
router.put('/:id', async (req, res, next) => {
  try {
    const name = (req.body.name || '').trim();
    if (name.length < 1 || name.length > 80) {
      return res.status(400).json({ error: 'Nazwa musi mieć od 1 do 80 znaków' });
    }
    const [result] = await pool.query(
      'UPDATE boards SET name = ?, description = ? WHERE id = ? AND isDeleted = 0',
      [name, req.body.description || null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nie znaleziono tablicy' });
    }
    res.json({ id: Number(req.params.id), name });
  } catch (err) {
    next(err);
  }
});
 
// DELETE /api/boards/:id – soft delete
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'UPDATE boards SET isDeleted = 1, deletedAt = NOW(), deletedById = ? WHERE id = ? AND isDeleted = 0',
      [req.session.userId, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nie znaleziono tablicy' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
 
// GET /api/boards/:boardId/tasks?priority=high – zadania tablicy z filtrem
router.get('/:boardId/tasks', async (req, res, next) => {
  try {
    // Sprawdzanie, czy tablica istnieje
    const [boards] = await pool.query(
      'SELECT id FROM boards WHERE id = ? AND isDeleted = 0',
      [req.params.boardId]
    );
 
    if (boards.length === 0) {
      return res.status(404).json({ error: 'Nie znaleziono tablicy' });
    }
 
    // Pobieranie parametrów filtrowania
    const { priority, assigneeId, q } = req.query;
 
    let sql = 'SELECT id, title, status, priority, deadline, assigneeId FROM tasks WHERE boardId = ? AND isDeleted = 0';
    const params = [req.params.boardId];
 
    // Filtrowanie według priorytetu
    if (priority) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ error: 'Nieprawidłowy priorytet' });
      }
 
      sql += ' AND priority = ?';
      params.push(priority);
    }
 
    // Filtrowanie według przypisanej osoby
    if (assigneeId !== undefined) {
      const id = Number(assigneeId);
 
      if (
        typeof assigneeId !== 'string' ||
        !/^[1-9]\d*$/.test(assigneeId) ||
        !Number.isSafeInteger(id)
      ) {
        return res.status(400).json({ error: 'Nieprawidłowa osoba' });
      }
 
      sql += ' AND assigneeId = ?';
      params.push(id);
    }
 
    // Wyszukiwanie fragmentu tytułu
    if (q) {
      if (typeof q !== 'string') {
        return res.status(400).json({ error: 'Nieprawidłowe wyszukiwanie' });
      }
 
      sql += ' AND title LIKE ?';
      params.push(`%${q}%`);
    }
 
    // Pobieranie przefiltrowanych zadań
    const [rows] = await pool.query(sql, params);
 
    res.json(rows);
  } catch (err) {
    next(err);
  }
});
 
module.exports = router;
 