# TB-2, częsc 1:Tabela zadan, zapytania i kopia zapasowa

## cel

Na wzór tabel users i boards z zajęćć dopisujesz najważniejszą tabelę aplikacji, tasks , i ćwiczysz
zapytania na zadaniach. Wszystko, czego potrzebujesz, było pokazane na zajęciach na tablicach.

## Plan dni

Poniedziałki są stacjonarne, pozostałe dni pracujesz zdalnie według planu:
-Wtorek: tabela tasks w skrypcie bazy i 10 zadańń testowych;    ćwiczenie z debuggerem bugs.
-Środa: 10 zapytańń w queries.sql oraz kopia zapasowa i sprawdzenie jej odtworzenia. W śśr
Teams pojawi się częśc 2.

## Co zrobic

1. Pobierz najnowszą wersję main ( git switch main , git pull ) i utwórz branch feature/tb-2-
baza .
2. W database/taskboard.sql dopisz tabelę tasks według diagramu materialy/erd.md : typy pól,
klucz główny, trzy klucze obce ( boardId do boards , assigneeId i deletedById do users ),
dozwolone wartośś ci status i priority , wartości domyśślne i pola soft delete jak w boards.
3. Skrypt ma odtwarzaćć całą bazę od zera: DROP DATABASE IF EXISTS na początku, potem tabele
dane. Użytkowników z users.csv wstaw instrukcją INSERT (hashe skopiuj z pliku).
4. Dodaj 10 zadańń testowych w różnych statusach i priorytetach, w tym 1–2 usunięte miękk
5. Utwórz database/queries.sql z 10 zapytaniami, każde z komentarzem:
6. zadania o priorytecie high według terminu;
7. zadania po terminie i niezakończone;
8. zadanie z nazwą tablicy i loginem osoby (JOIN trzech tabel);
9. liczba zadań w każdym statusie dla wybranej tablicy (GROUP BY);
10. usunięte zadania z loginem osoby, która je usunęła;
11. użytkownicy bez żadnego zadania (LEFT JOIN);
12. zadania z tytułem zawierającym słowo (LIKE);
13. zmiana statusu zadania (UPDATE);
14. soft delete zadania;
15. trwałe usunięcie zadańń usuniętych ponad 30 dni temu (DELETE, konto administratora)
16. Zrób kopię zapasową do database/backup/taskboard_RRRR-MM-DD.sql , odtwórz ją w bazie
taskboard_test i porównaj liczbę rekordów. Wynik zapisz w README.
17. Ćwiczenie z debuggerem: otwórz materialy/bugs/index.html w przeglądarce (np. przez Live Server),
 znajdźź 5 błędów w bugs.js za pomocą DevTools (F12) i przy każdej poprawce dopi
komentarz, co było nie tak. Po poprawkach strona pokazuje „Wykonane: 2 z 5 (40%)”.
18. Wklej treść tego zadania do docs/zadania/TB-2.md , potem pull request, zielony workflow i
scalenie przez merge commit.

## Gotowe gdy

-Skrypt odtwarza bazę bez błędów na czystym MySQL.
-Tabela tasks ma klucze obce, dozwolone wartośś ci i pola soft delet
-Wszystkie 10 zapytańń działa i ma komentarz
-Kopia zapasowa jest w database/backup/ , a wynik jej sprawdzenia w README.
-bugs.js działa i ma 5 poprawek opisanych komentarzami.
-Pull request z branchu feature/tb-2-baza ma zielony workflow i jest scalony do piątku 18:00.

---
