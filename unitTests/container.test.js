const { pushNewContainer } = require('../js/container.js');

// Tworzymy przykładowy stan kontenerów i localStorage
const storedContainers = {
  containers: [], // Tutaj możesz dodać istniejące kontenery, jeśli to konieczne
};

document.body.innerHTML = `
  <div class="sraj-modules-container">
    <div class="container"></div>
    <div class="container"></div>
    <!-- Dodaj więcej kontenerów, aby osiągnąć warunek else -->
  </div>
`;


// Przed każdym testem tworzymy kopię localStorage, aby uniknąć interferencji między testami
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('containerConfig', JSON.stringify(storedContainers));
});

test('Dodawanie nowego kontenera', () => {
  // Wywołujemy funkcję pushNewContainer
  pushNewContainer(storedContainers);

  // Sprawdzamy, czy kontener został dodany do DOM
  const containers = document.querySelectorAll('.container');
  expect(containers.length).toBe(3); // Powinno być 1, ponieważ dodaliśmy jeden kontener

  // Sprawdzamy, czy kontener został dodany do storedContainers
  const storedContainersData = JSON.parse(localStorage.getItem('containerConfig'));
  expect(storedContainersData.containers.length).toBe(1); // Powinno być 1, ponieważ dodaliśmy jeden kontener

  // Możesz również dodać więcej asercji, aby sprawdzić stan nowego kontenera i inne aspekty funkcji.
});

// Pozostała część testu (przekroczenie limitu kontenerów) pozostaje bez zmian
test('Przekroczenie limitu kontenerów', () => {
  // Tworzymy kontenery w ilości, która przekroczy limit
  for (let i = 0; i < 7; i++) {
    pushNewContainer(storedContainers);
  }

  // Sprawdzamy, czy alert został wywołany
  const alertSpy = jest.spyOn(window, 'alert');
  pushNewContainer(storedContainers);
  expect(alertSpy).toHaveBeenCalledWith('Nie możesz mieć więcej niż 7 kontenerów.');
  alertSpy.mockRestore(); // Przywracamy window.alert do stanu pierwotnego
});