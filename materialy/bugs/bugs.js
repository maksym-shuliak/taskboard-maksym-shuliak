// Ćwiczenie z debuggerem (poniedziałek 3).

const zadania = [
  { tytul: 'Struktura repozytorium', status: 'done' },
  { tytul: 'Skrypt bazy danych', status: 'done' },
  { tytul: 'API tablic', status: 'in_progress' },
  { tytul: 'Widok tablicy', status: 'todo' },
  { tytul: 'Raport testów', status: 'todo' }
];

function policzWykonane(lista) {
  let licznik = 0;

  // Błąd 1: poprawiono warunek pętli (i < lista.length).
  for (let i = 0; i < lista.length; i++) {

    // Błąd 2: poprawiono operator porównania (= na ===).
    if (lista[i].status === 'done') {
      licznik++;
    }
  }

  // Błąd 3: dodano return, aby funkcja zwracała wynik.
  return licznik;
}

function pokazPodsumowanie() {
  const wykonane = policzWykonane(zadania);

  // Błąd 4: poprawiono obliczanie procentu.
  const procent = Math.round((wykonane / zadania.length) * 100);

  document.getElementById('wynik').textContent =
    `Wykonane: ${wykonane} z ${zadania.length} (${procent}%)`;
}

// Błąd 5: poprawiono nazwę funkcji w addEventListener.
document.getElementById('policz').addEventListener('click', pokazPodsumowanie);
