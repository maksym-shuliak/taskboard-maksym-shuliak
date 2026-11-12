-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Ноя 12 2026 г., 10:56
-- Версия сервера: 10.11.16-MariaDB
-- Версия PHP: 8.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `taskboard`
--

-- --------------------------------------------------------

--
-- Структура таблицы `boards`
--

CREATE TABLE `boards` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(80) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `ownerId` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `deletedAt` datetime DEFAULT NULL,
  `deletedById` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Дамп данных таблицы `boards`
--

INSERT INTO `boards` (`id`, `name`, `description`, `ownerId`, `createdAt`, `isDeleted`, `deletedAt`, `deletedById`) VALUES
(1, 'Aplikacja TaskBoard', 'nowy opis', 1, '2026-11-09 10:55:16', 0, NULL, NULL),
(2, 'Organizacja praktyk', NULL, 2, '2026-11-09 10:55:16', 1, '2026-11-09 12:04:40', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `tasks`
--

CREATE TABLE `tasks` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('todo','in_progress','done') NOT NULL DEFAULT 'todo',
  `priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
  `deadline` date DEFAULT NULL,
  `boardId` int(10) UNSIGNED NOT NULL,
  `assigneeId` int(10) UNSIGNED DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `deletedAt` datetime DEFAULT NULL,
  `deletedById` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Дамп данных таблицы `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `status`, `priority`, `deadline`, `boardId`, `assigneeId`, `createdAt`, `isDeleted`, `deletedAt`, `deletedById`) VALUES
(1, 'Uzupełnić README', 'Dodać opis projektu', 'todo', 'high', '2026-11-12', 1, 1, '2026-11-10 14:36:41', 0, NULL, NULL),
(2, 'Poprawić wygląd strony', 'Zmienić kolory', 'in_progress', 'medium', '2026-11-14', 1, 2, '2026-11-10 14:36:41', 0, NULL, NULL),
(3, 'Dodać logowanie', 'Stworzyć formularz', 'todo', 'high', '2026-11-16', 1, 3, '2026-11-10 14:36:41', 0, NULL, NULL),
(4, 'Sprawdzić błędy', 'Przetestować aplikację', 'done', 'low', '2026-11-09', 1, 4, '2026-11-10 14:36:41', 0, NULL, NULL),
(5, 'Utworzyć bazę danych', 'Dodać tabele', 'done', 'high', '2026-11-10', 1, 5, '2026-11-10 14:36:41', 0, NULL, NULL),
(6, 'Napisać dokumentację', 'Opisać funkcje', 'in_progress', 'medium', '2026-11-18', 1, 1, '2026-11-10 14:36:41', 0, NULL, NULL),
(7, 'Dodać zadania', 'Utworzyć tabelę tasks', 'todo', 'medium', '2026-11-20', 1, 2, '2026-11-10 14:36:41', 0, NULL, NULL),
(8, 'Poprawić formularz', 'Sprawdzić pola', 'todo', 'low', '2026-11-22', 1, 3, '2026-11-10 14:36:41', 0, NULL, NULL),
(9, 'Przetestować API', 'Sprawdzić endpointy', 'in_progress', 'high', '2026-11-24', 1, 4, '2026-11-10 14:36:41', 0, NULL, NULL),
(10, 'Przygotować prezentację', 'Pokazać projekt', 'done', 'medium', '2026-11-26', 1, 5, '2026-11-10 14:36:41', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `login` varchar(30) NOT NULL,
  `passwordHash` char(60) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `login`, `passwordHash`, `firstName`, `lastName`, `createdAt`) VALUES
(1, 'anna.nowak', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Anna', 'Nowak', '2026-11-09 10:51:08'),
(2, 'jan.kowalski', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Jan', 'Kowalski', '2026-11-09 10:51:08'),
(3, 'ola.wisniewska', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Ola', 'Wiśniewska', '2026-11-09 10:51:08'),
(4, 'piotr.zielinski', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Piotr', 'Zieliński', '2026-11-09 10:51:08'),
(5, 'kasia.lewandowska', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Kasia', 'Lewandowska', '2026-11-09 10:51:08');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `boards`
--
ALTER TABLE `boards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ownerId` (`ownerId`),
  ADD KEY `deletedById` (`deletedById`);

--
-- Индексы таблицы `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `boardId` (`boardId`),
  ADD KEY `assigneeId` (`assigneeId`),
  ADD KEY `deletedById` (`deletedById`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `boards`
--
ALTER TABLE `boards`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `boards`
--
ALTER TABLE `boards`
  ADD CONSTRAINT `boards_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `boards_ibfk_2` FOREIGN KEY (`deletedById`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`boardId`) REFERENCES `boards` (`id`),
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assigneeId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tasks_ibfk_3` FOREIGN KEY (`deletedById`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
