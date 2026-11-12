-- 1. Zadania o wysokim priorytecie według terminu
SELECT * FROM tasks
WHERE priority = 'high'
ORDER BY deadline;

-- 2. Zadania po terminie i niezakończone
SELECT * FROM tasks
WHERE deadline < CURDATE()
AND status != 'done';

-- 3. Zadania z nazwą tablicy i loginem użytkownika
SELECT tasks.title, boards.name, users.login
FROM tasks
JOIN boards ON tasks.boardId = boards.id
LEFT JOIN users ON tasks.assigneeId = users.id;

-- 4. Liczba zadań według statusu
SELECT status, COUNT() AS liczba
FROM tasks
GROUP BY status;

-- 5. Usunięcie zadania
-- Najpierw sprawdź, które zadanie usuwasz
SELECT FROM tasks WHERE id = 10;

DELETE FROM tasks
WHERE id = 10;

-- 6. Użytkownicy bez żadnego aktywnego zadania
SELECT users.login
FROM users
LEFT JOIN tasks
ON users.id = tasks.assigneeId
AND tasks.isDeleted = 0
WHERE tasks.id IS NULL;

-- 7. Zadania zawierające wybrane słowo
SELECT * FROM tasks
WHERE title LIKE '%README%';

-- 8. Zmiana statusu zadania
UPDATE tasks
SET status = 'done'
WHERE id = 1;

-- 9. Soft delete zadania
UPDATE tasks
SET isDeleted = 1,
    deletedAt = NOW(),
    deletedById = 1
WHERE id = 9;

-- 10. Trwałe usunięcie zadań usuniętych
-- ponad 30 dni temu (konto administratora)
DELETE FROM tasks
WHERE isDeleted = 1
AND deletedAt < NOW() - INTERVAL 30 DAY;
