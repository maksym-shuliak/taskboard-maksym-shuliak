# TaskBoard

TaskBoard to aplikacja internetowa służąca do zarządzania zadaniami. Umożliwia dodawanie, przeglądanie i organizowanie zadań w jednym miejscu.

## Technologie

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** PHP
- **Baza danych:** MySQL
- **Narzędzia:** Visual Studio Code, Git, GitHub, XAMPP

## Wymagane środowisko

- Windows 11
- Visual Studio Code
- Git
- XAMPP
- Przeglądarka internetowa

## Uruchomienie

1. Sklonuj repozytorium na komputer.
2. Umieść folder projektu w katalogu htdocs programu XAMPP.
3. Uruchom Apache i MySQL w XAMPP.
4. Otwórz projekt w przeglądarce internetowej.

## Struktura projektu

| Folder | Za co odpowiada |
| --- | --- |
| frontend/ | Zawiera pliki odpowiedzialne za wygląd i interfejs użytkownika. |
| backend/ | Zawiera kod odpowiedzialny za działanie aplikacji. |
| database/ | Zawiera pliki i strukturę bazy danych. |
| docs/ | Zawiera dokumentację projektu i zadania. |

## Materiały

Pliki potrzebne podczas praktyk są w folderze [materialy](materialy/README.md).

## Autor

Maksym Shuliak 3TP

## Baza danych

Projekt korzysta z bazy danych MySQL o nazwie `taskboard`.

Baza zawiera trzy tabele: `users`, `boards` i `tasks`.
Struktura bazy oraz przykładowe dane znajdują się w pliku
`database/taskboard.sql`.

Zadania można dodawać, edytować i usuwać logicznie (soft delete).
Usunięte zadania pozostają w bazie, ale nie są wyświetlane przez API.

Kopia zapasowa została przywrócona do bazy `taskboard_test`.
Porównano liczbę rekordów w obu bazach i wyniki były zgodne.

## API zadań

Backend działa na Node.js i Express, na porcie 3000.

Dostępne endpointy:

- `GET /api/boards/:boardId/tasks` – lista zadań tablicy.
- `GET /api/tasks/:id` – szczegóły zadania.
- `POST /api/tasks` – dodawanie zadania.
- `PUT /api/tasks/:id` – edycja zadania.
- `DELETE /api/tasks/:id` – usuwanie logiczne zadania.
- `GET /api/users` – lista użytkowników bez haseł.

API sprawdza poprawność danych i zwraca odpowiednie kody HTTP:
200, 201, 204, 400 i 404.

## Testowanie API

Endpointy zostały przetestowane w programie Postman.
Sprawdzono dodawanie, edycję, usuwanie oraz pobieranie danych.
Przetestowano również błędy walidacji (400)
i nieistniejące zadania (404).

Kolekcja Postman znajduje się w folderze `docs/postman/`.
