import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  getPoints() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse).then(PointsApiService.adaptPointsToClient);
  }

  getDestinations() {
    return this._load({ url: 'destinations' }).then(ApiService.parseResponse);
  }

  getOffers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse)
      .then(PointsApiService.adaptOffersToClient);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsApiService.adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiService.parseResponse)
      .then(PointsApiService.adaptPointToClient);
  }

  addPoint(point) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(PointsApiService.adaptNewPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(ApiService.parseResponse)
      .then(PointsApiService.adaptPointToClient);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }

  static adaptPointsToClient(points) {
    return points.map(PointsApiService.adaptPointToClient);
  }

  static adaptPointToClient(point) {
    return {
      id: point.id,
      type: point.type,
      destinationId: point.destination,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      basePrice: point.base_price,
      offers: point.offers,
      isFavorite: point.is_favorite,
    };
  }

  static adaptPointToServer(point) {
    return {
      'id': point.id,
      'type': point.type,
      'destination': point.destinationId,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'base_price': point.basePrice,
      'offers': point.offers,
      'is_favorite': point.isFavorite,
    };
  }

  static adaptNewPointToServer(point) {
    return {
      'type': point.type,
      'destination': point.destinationId,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'base_price': point.basePrice,
      'offers': point.offers,
      'is_favorite': point.isFavorite,
    };
  }

  static adaptOffersToClient(offersByType) {
    return offersByType.flatMap((offerType) =>
      offerType.offers.map((offer) => ({
        ...offer,
        type: offerType.type,
      }))
    );
  }
}
