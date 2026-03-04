import MainPresenter from './presenter/main-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import RoutePointsModel from './model/route-points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './api/points-api.js';
import LoadingView from './view/loading.js';
import FailedLoadView from './view/failed-load.js';
import { render, remove } from './framework/render.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const listContainer = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = `Basic ${Math.random().toString(36).slice(2, 12)}`;

const apiService = new PointsApiService(END_POINT, AUTHORIZATION);
const pointsModel = new RoutePointsModel(apiService);
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter({
  filtersContainer,
  filterModel
});

const presenter = new MainPresenter({
  listContainer,
  pointsModel,
  filterModel,
  newEventButton
});

const loadingView = new LoadingView();
render(loadingView, listContainer);

pointsModel.init()
  .then(() => {
    remove(loadingView);
    filterPresenter.init();
    presenter.init();
  })
  .catch(() => {
    remove(loadingView);
    render(new FailedLoadView(), listContainer);
  });
