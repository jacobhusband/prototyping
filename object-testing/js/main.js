const $animalView = document.querySelector('[data-view="animals"]')
const $carModelView = document.querySelector('[data-view="car-models"]')

const $animalList = $animalView.firstElementChild;
const $carModelList = $carModelView.firstElementChild;

const animalViewController = new ViewController($animalView);
const carModelViewController = new ViewController($carModelView);

const animalListController = new ListController($animalList);
const carModelListController = new ListController($carModelList);

const animals = ['dog', 'cat', 'mouse', 'giraffe'];
