import MainPresenter from './presenter/main-presenter';
import RoutePointsModel from './model/route-points-model';

const filtersContainer = document.querySelector('.trip-controls');
const listContainer = document.querySelector('.trip-events');
const pointsModel = new RoutePointsModel();

const presenter = new MainPresenter({
  filtersContainer,
  listContainer,
  pointsModel
});

presenter.init();
