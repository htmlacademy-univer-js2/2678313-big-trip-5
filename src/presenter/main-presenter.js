import FiltersView from '../view/filters.js';
import SortView from '../view/sort.js';
import RoutePointView from '../view/route-point.js';
import EditFormView from '../view/form-editing.js';
import { render } from '../render.js';

export default class MainPresenter {
  constructor({ filtersContainer, listContainer }) {
    this.filtersContainer = filtersContainer;
    this.listContainer = listContainer;
  }

  init() {
    render(new FiltersView(), this.filtersContainer);
    render(new SortView(), this.filtersContainer);
    render(new EditFormView(), this.listContainer);
    render(new RoutePointView(), this.listContainer);
    render(new RoutePointView(), this.listContainer);
    render(new RoutePointView(), this.listContainer);
  }
}
