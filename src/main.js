import MainPresenter from './presenter/main-presenter';

const filtersContainer = document.querySelector('.trip-controls');
const listContainer = document.querySelector('.trip-events');

const presenter = new MainPresenter({
  filtersContainer,
  listContainer,
});

presenter.init();
