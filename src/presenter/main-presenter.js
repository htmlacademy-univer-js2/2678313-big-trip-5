import FiltersView from '../view/filters.js';
import SortView from '../view/sort.js';
import RoutePointView from '../view/route-point.js';
import EditFormView from '../view/form-editing.js';
import TripEventsListView from '../view/trip-events-list';
import { render } from '../render.js';
import RoutePointsModel from '../model/route-points-model';
import { destinations, offers } from '../mock/route-point';


export default class MainPresenter {
  constructor({ filtersContainer, listContainer }) {
    this.filtersContainer = filtersContainer;
    this.listContainer = listContainer;
    this.pointsModel = new RoutePointsModel();
  }

  init() {
    render(new FiltersView(), this.filtersContainer);
    render(new SortView(), this.listContainer);

    const tripEventsListView = new TripEventsListView();
    render(tripEventsListView, this.listContainer);

    const points = this.pointsModel.getPoints();

    points.forEach((point, index) => {
      const destination = destinations.find(
        (d) => d.id === point.destinationId
      );

      const pointOffers = offers.filter(
        (offer) => point.offers.includes(offer.id)
      );

      if (index === 0) {
        render(
          new EditFormView({
            point,
            destination,
            offers: pointOffers
          }),
          tripEventsListView.getElement()
        );
      } else {
        render(
          new RoutePointView({
            point,
            destination,
            offers: pointOffers
          }),
          tripEventsListView.getElement()
        );
      }
    });

  }

}
