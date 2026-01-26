import { generateRoutePoint } from '../mock/route-point';

export default class RoutePointsModel {
  constructor() {
    this.points = Array.from({ length: 3 }, generateRoutePoint);
  }

  getPoints() {
    return this.points;
  }
}
