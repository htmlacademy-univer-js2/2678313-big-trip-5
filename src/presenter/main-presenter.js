import FiltersView from '../view/filters.js';
import SortView from '../view/sort.js';
import RoutePointView from '../view/route-point.js';
import EditFormView from '../view/form-editing.js';
import CreateFormView from '../view/form-creation.js';
import TripEventsListView from '../view/trip-events-list';
import { render } from '../render.js';

export default class MainPresenter {
  constructor({ filtersContainer, listContainer }) {
    this.filtersContainer = filtersContainer;
    this.listContainer = listContainer;
  }

  init() {
    render(new FiltersView(), this.filtersContainer);
    render(new SortView(), this.listContainer);

    const tripEventsListView = new TripEventsListView();
    render(tripEventsListView, this.listContainer);

    render(new CreateFormView(), tripEventsListView.getElement());
    render(new EditFormView(), tripEventsListView.getElement());
    render(new RoutePointView(), tripEventsListView.getElement());
    render(new RoutePointView(), tripEventsListView.getElement());
    render(new RoutePointView(), tripEventsListView.getElement());

  }
}
