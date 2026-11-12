# Database

Folder zawiera pliki związane z bazą danych projektu.
Znajdują się tutaj informacje o strukturze bazy danych i jej zasobach.

## Test kopii zapasowej

Data: 2026-11-10

Utworzono kopię zapasową:

`database/backup/taskboard_2026-11-10.sql`

Kopię przywrócono do bazy `taskboard_test`.

Porównanie liczby rekordów:

| Tabela | taskboard | taskboard_test |
| --- | --- | --- |
| users | 5 | 5 |
| boards | 2 | 2 |
| tasks | 10 | 10 |

Wynik: przywracanie kopii zapasowej zakończyło się pomyślnie. Liczba rekordów jest zgodna.
