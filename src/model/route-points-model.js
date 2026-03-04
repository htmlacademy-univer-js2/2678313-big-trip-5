export default class RoutePointsModel {
  #points;
  #destinations;
  #offers;
  #apiService;

  constructor(apiService) {
    this.#apiService = apiService;
    this.#points = [];
    this.#destinations = [];
    this.#offers = [];
  }

  get points() {
    return this.#points;
  }

  getPoints() {
    return this.#points;
  }

  setPoints(points) {
    this.#points = [...points];
  }

  setDestinations(destinations) {
    this.#destinations = [...destinations];
  }

  setOffers(offers) {
    this.#offers = [...offers];
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  getDestinationById(destinationId) {
    return this.#destinations.find((d) => d.id === destinationId);
  }

  getOffersByIds(offerIds) {
    return this.#offers.filter((offer) => offerIds.includes(offer.id));
  }

  async init() {
    const [points, destinations, offers] = await Promise.all([
      this.#apiService.getPoints(),
      this.#apiService.getDestinations(),
      this.#apiService.getOffers()
    ]);

    this.setPoints(points);
    this.setDestinations(destinations);
    this.setOffers(offers);
  }

  async updatePoint(updatedPoint) {
    const response = await this.#apiService.updatePoint(updatedPoint);
    this.#points = this.#points.map((point) =>
      point.id === response.id ? response : point
    );
    return response;
  }

  async addPoint(newPoint) {
    const response = await this.#apiService.addPoint(newPoint);
    this.#points = [response, ...this.#points];
    return response;
  }

  async deletePoint(pointToDelete) {
    await this.#apiService.deletePoint(pointToDelete);
    this.#points = this.#points.filter((point) => point.id !== pointToDelete.id);
  }
}
