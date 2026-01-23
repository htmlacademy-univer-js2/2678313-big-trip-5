import { createElement } from '..//render.js';

export default class TripEventsListView {
  getTemplate() {
    return `
      <ul class="trip-events__list"></ul>
    `;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
}
