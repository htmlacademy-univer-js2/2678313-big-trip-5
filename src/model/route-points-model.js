import { generateRoutePoint, destinations, offers } from '../mock/route-point';

export default class RoutePointsModel {
  constructor() {
    this.points = Array.from({ length: 3 }, generateRoutePoint);
    this.destinations = destinations;
    this.offers = offers;
  }

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
