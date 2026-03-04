import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { formatDateForInput, formatDateForPoint, hasValidDateRange, initDatepickers, clearDatepickers, normalizeDateRange } from './date-utils.js';
import { TYPES } from '../const.js';

export default class CreateFormView extends AbstractStatefulView{
  #destinations;
  #offers;
  #onSubmit;
  #onCancel;
  #dateFromPicker = null;
  #dateToPicker = null;

  constructor({ destinations = [], offers = [], onSubmit, onCancel } = {}) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onSubmit = onSubmit;
    this.#onCancel = onCancel;
    const now = new Date();
    const dateTo = new Date(now.getTime() + 60 * 60 * 1000);
    this._state = {
      type: 'flight',
      destinationId: destinations[0]?.id || null,
      dateFrom: now,
      dateTo,
      basePrice: '',
      isDisabled: false,
      isSaving: false
    };

    this._restoreHandlers();
  }

  getDestinationSection() {
    const destination = this.#destinations.find((item) => item.id === this._state.destinationId);

    if (!destination) {
      return '';
    }

    const photosTemplate = destination.pictures
      .map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)
      .join('');

    return `
      <section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">
          Destination
        </h3>

        <p class="event__destination-description">
          ${destination.description}
        </p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photosTemplate}
          </div>
        </div>
      </section>
    `;
  }

  get template() {
    const { basePrice, isDisabled, isSaving } = this._state;
    const destinationOptions = this.#destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');
    const destinationName = this.#destinations.find((item) => item.id === this._state.destinationId)?.name || '';
    const dateFrom = formatDateForInput(this._state.dateFrom);
    const dateTo = formatDateForInput(this._state.dateTo);

    const offersTemplate = this.#offers
      .filter((offer) => offer.type === this._state.type)
      .map((offer) => `
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox visually-hidden"
            type="checkbox"
            name="event-offer-${offer.id}"
          >
          <label class="event__offer-label">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>
      `)
      .join('');

    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-create">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${this._state.type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-create" type="checkbox">

              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${TYPES.map((eventType) => `
                    <div class="event__type-item">
                      <input id="event-type-${eventType}-create" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${this._state.type === eventType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-create">${eventType}</label>
                    </div>
                  `).join('')}
                </fieldset>
              </div>
            </div>

            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-create">
                ${this._state.type}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-create" type="text" name="event-destination" list="destination-list-create" value="${destinationName}" required ${isDisabled ? 'disabled' : ''}>
              <datalist id="destination-list-create">
                ${destinationOptions}
              </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-create">From</label>
              <input class="event__input  event__input--time" id="event-start-time-create" type="text" name="event-start-time" value="${dateFrom}" ${isDisabled ? 'disabled' : ''}>
              &mdash;
              <label class="visually-hidden" for="event-end-time-create">To</label>
              <input class="event__input  event__input--time" id="event-end-time-create" type="text" name="event-end-time" value="${dateTo}" ${isDisabled ? 'disabled' : ''}>
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-create">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-create" type="text" inputmode="numeric" name="event-price" value="${basePrice}" required ${isDisabled ? 'disabled' : ''}>
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
            <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>
          </header>
          <section class="event__details">
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>

              <div class="event__available-offers">
                ${offersTemplate}
              </div>
            </section>

            ${this.getDestinationSection()}
          </section>
        </form>
      </li>
    `;
  }

  _restoreHandlers() {
    const handleDateFromChange = ([selectedDate]) => {
      const { dateFrom, dateTo } = normalizeDateRange(selectedDate, this._state.dateTo);
      this._setState({ dateFrom, dateTo });
      this.#dateToPicker.set('minDate', dateFrom);
      this.#dateToPicker.setDate(dateTo, true);
    };

    const handleDateToChange = ([selectedDate]) => {
      this._setState({ dateTo: selectedDate });
    };

    ({ dateFromPicker: this.#dateFromPicker, dateToPicker: this.#dateToPicker } = initDatepickers(
      this,
      this.#dateFromPicker,
      this.#dateToPicker,
      this._state.dateFrom,
      this._state.dateTo,
      handleDateFromChange,
      handleDateToChange
    ));

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element
      .querySelector('form')
      .addEventListener('reset', this.#formCancelHandler);

    this.element
      .querySelectorAll('.event__type-input')
      .forEach((input) => input.addEventListener('change', this.#typeChangeHandler));

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationInputHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
  }

  removeElement() {
    ({ dateFromPicker: this.#dateFromPicker, dateToPicker: this.#dateToPicker } = clearDatepickers(
      this.#dateFromPicker,
      this.#dateToPicker
    ));
    super.removeElement();
  }

  setSaving() {
    this.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  resetState() {
    this.updateElement({
      isDisabled: false,
      isSaving: false
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const destinationInput = this.element.querySelector('.event__input--destination');
    const priceInput = this.element.querySelector('.event__input--price');
    const dateToInput = this.element.querySelector('[name="event-end-time"]');
    const destination = this.#destinations.find((item) => item.name === destinationInput.value.trim());

    if (!destination) {
      destinationInput.setCustomValidity('Choose destination from the list');
      destinationInput.reportValidity();
      return;
    }

    this._setState({ destinationId: destination.id });

    const basePrice = Number(this._state.basePrice);
    if (!Number.isFinite(basePrice) || basePrice <= 0) {
      priceInput.setCustomValidity('Price must be greater than 0');
      priceInput.reportValidity();
      return;
    }

    priceInput.setCustomValidity('');

    if (!hasValidDateRange(this._state.dateFrom, this._state.dateTo)) {
      dateToInput.setCustomValidity('End date must be later than start date');
      dateToInput.reportValidity();
      return;
    }

    dateToInput.setCustomValidity('');

    this.#onSubmit({
      type: this._state.type,
      destinationId: destination.id,
      dateFrom: formatDateForPoint(this._state.dateFrom),
      dateTo: formatDateForPoint(this._state.dateTo),
      basePrice,
      offers: [],
      isFavorite: false
    });
  };

  #formCancelHandler = (evt) => {
    evt.preventDefault();
    this.#onCancel();
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({ type: evt.target.value });
  };

  #destinationInputHandler = (evt) => {
    evt.target.setCustomValidity('');
  };

  #destinationChangeHandler = (evt) => {
    const value = evt.target.value.trim();
    const destination = this.#destinations.find((item) => item.name === value);

    if (!destination) {
      return;
    }

    this.updateElement({
      destinationId: destination.id
    });
  };

  #priceInputHandler = (evt) => {
    const sanitizedValue = evt.target.value.replace(/\D/g, '');
    evt.target.value = sanitizedValue;
    evt.target.setCustomValidity('');
    this._setState({ basePrice: sanitizedValue });
  };
}
