# TB-1: Struktura repozytorium i opis danych
 
## Część 1 (poniedziałek 1)
 
**Termin:** piątek 18:00, zmiany scalone do `main`.
 
### Do zrobienia
 
- Foldery `frontend/`, `backend/`, `database/`, `docs/` i `docs/zadania/`; w każdym plik `README.md` z 2–4 zdaniami, za co folder odpowiada.
- Główne `README.md`: opis aplikacji, technologie, tabela folderów, szkic sekcji „Uruchomienie”, autor.
- Plik `.gitignore` z wpisami `node_modules/` i `.env`.
- Ochrona gałęzi `main`: pull request wymagany, blokada force pusha i usunięcia; w ustawieniach tylko scalanie przez merge commit.
- Treść tego zadania w `docs/zadania/TB-1.md`.
 
### Gotowe, gdy
 
- [ ] Na branchu `feature/tb-1-start` są co najmniej 3 commity z opisem.
- [ ] Pull request ma zielony workflow.
- [ ] Pull request jest scalony przez merge commit, a branch nie został usunięty.
 
## TB-1 Część 2. Opis danych i wstępny diagram ERD
 
## Cel
 
Celem zadania jest opisanie danych przechowywanych w aplikacji TaskBoard oraz przygotowanie wstępnego diagramu ERD.
 
## Co zostało zrobione
 
1. Utworzono branch `feature/tb-1-dane`.
2. Skopiowano plik `materialy/dane-szablon.md` do `docs/dane.md`.
3. Opisano dane użytkownika, tablicy i zadania.
4. Dodano przykładowe informacje do każdej tabeli.
5. Opisano powiązania między użytkownikami, tablicami i zadaniami.
6. Dodano przykładowe zadanie w formacie JSON.
7. Przygotowano wstępny diagram ERD w Mermaid.
 
## Opis danych
 
Aplikacja TaskBoard przechowuje informacje o użytkownikach, tablicach i zadaniach.
 
**Użytkownik** posiada login, imię, nazwisko, adres email i hasło.
 
**Tablica** posiada nazwę, opis, datę utworzenia i właściciela.
 
**Zadanie** posiada tytuł, opis, status, priorytet, termin wykonania i przypisanego użytkownika.
 
Szczegółowy opis danych znajduje się w pliku `docs/dane.md`.
 
## Wstępny diagram ERD
 
Diagram ERD został przygotowany w Mermaid i znajduje się w pliku `docs/dane.md`.
 
Diagram zawiera trzy tabele:
 
- uzytkownicy
- tablice
- zadania
 
Każda tabela posiada klucz główny (PK). Tabele są połączone za pomocą kluczy obcych (FK).
 
## Powiązania
 
1. Jeden użytkownik może utworzyć wiele tablic.
2. Jedna tablica może zawierać wiele zadań.
3. Jeden użytkownik może mieć przypisanych wiele zadań.
 
## Podsumowanie
 
W tej części zadania przygotowano opis danych aplikacji TaskBoard oraz wstępny diagram ERD. Diagram przedstawia podstawowe tabele i relacje między nimi.n
