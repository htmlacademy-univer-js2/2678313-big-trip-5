import SortView from '../view/sort.js';
import CreateFormView from '../view/form-creation.js';
import TripEventsListView from '../view/trip-events-list.js';
import NoPointsView from '../view/no-points.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import RoutePointPresenter from './route-point-presenter.js';
import { SortType, UpdateType, FilterType, UserAction } from '../const.js';
import { filter } from '../filter.js';

export default class MainPresenter {
  #listContainer;
  #pointsModel;
  #filterModel;
  #newEventButton;

  #tripEventsListView = new TripEventsListView();
  #sortView = null;
  #noPointsView = null;
  #createFormView = null;

  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #boardPoints = [];
  #isCreating = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: 350,
    upperLimit: 1000
  });

  constructor({ listContainer, pointsModel, filterModel, newEventButton }) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newEventButton = newEventButton;
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #handlePointChange = async (actionType, update) => {
    this.#uiBlocker.block();

    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          await this.#pointsModel.updatePoint(update);
          break;
        case UserAction.DELETE_POINT:
          await this.#pointsModel.deletePoint(update);
          break;
        case UserAction.ADD_POINT:
          await this.#pointsModel.addPoint(update);
          break;
      }

      this.#clearBoard();
      this.#renderBoard();
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    if (this.#isCreating) {
      this.#isCreating = false;
      this.#toggleNewEventButton(false);
      remove(this.#createFormView);
      this.#createFormView = null;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.MAJOR) {
      this.#currentSortType = SortType.DAY;
      this.#clearBoard();
      this.#renderBoard();
    }
  };

  #handleNewPointButtonClick = () => {
    if (this.#isCreating) {
      return;
    }

    this.#handleModeChange();
    this.#isCreating = true;
    this.#toggleNewEventButton(true);
    this.#currentSortType = SortType.DAY;

    if (this.#filterModel.filter !== FilterType.EVERYTHING) {
      this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      return;
    }

    this.#clearBoard();
    this.#renderBoard();
  };

  #handleCreateFormSubmit = async (newPoint) => {
    this.#createFormView.setSaving();
    this.#uiBlocker.block();

    try {
      await this.#pointsModel.addPoint(newPoint);
      this.#isCreating = false;
      this.#toggleNewEventButton(false);
      this.#clearBoard();
      this.#renderBoard();
    } catch {
      this.#createFormView.shake(() => this.#createFormView.resetState());
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleCreateFormCancel = () => {
    this.#isCreating = false;
    this.#toggleNewEventButton(false);
    this.#clearBoard();
    this.#renderBoard();
  };

  get points() {
    const points = this.#pointsModel.getPoints();
    const currentFilterType = this.#filterModel.filter;

    return filter[currentFilterType](points);
  }

  init() {
    this.#newEventButton.addEventListener('click', this.#handleNewPointButtonClick);
    this.#renderBoard();
  }

  #renderBoard() {
    this.#boardPoints = [...this.points];
    this.#sortPoints(this.#currentSortType);

    if (this.#boardPoints.length === 0 && !this.#isCreating) {
      this.#renderNoPoints();
      return;
    }

    if (this.#boardPoints.length > 0) {
      this.#renderSort();
    }
    render(this.#tripEventsListView, this.#listContainer);

    this.#renderPoints();
    if (this.#isCreating) {
      this.#renderCreateForm();
    }
  }

  #renderCreateForm() {
    this.#createFormView = new CreateFormView({
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      onSubmit: this.#handleCreateFormSubmit,
      onCancel: this.#handleCreateFormCancel
    });

    render(this.#createFormView, this.#tripEventsListView.element, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    this.#sortView = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortView, this.#listContainer);
  }

  #renderNoPoints() {
    this.#noPointsView = new NoPointsView({ filterType: this.#filterModel.filter });
    render(this.#noPointsView, this.#listContainer);
  }

  #renderPoints() {
    this.#boardPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const presenter = new RoutePointPresenter({
      container: this.#tripEventsListView.element,
      point,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    presenter.init(point);
    this.#pointPresenters.set(point.id, presenter);
  }

  #clearBoard() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#createFormView);
    remove(this.#sortView);
    remove(this.#noPointsView);
    remove(this.#tripEventsListView);
    this.#createFormView = null;
    this.#sortView = null;
    this.#noPointsView = null;
  }

  #toggleNewEventButton(isDisabled) {
    this.#newEventButton.disabled = isDisabled;
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this.#boardPoints.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case SortType.TIME:
        this.#boardPoints.sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA;
        });
        break;
      case SortType.DAY:
        this.#boardPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        break;
    }
    this.#currentSortType = sortType;
  }
}
