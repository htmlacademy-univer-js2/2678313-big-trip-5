export const destinations = [
  {
    id: 'dest-1',
    name: 'Amsterdam',
    description: 'Lorem ipsum dolor sit amet...',
    pictures: [
      'https://loremflickr.com/248/152?random=1'
    ]
  },
  {
    id: 'dest-2',
    name: 'Chamonix',
    description: 'Lorem ipsum dolor sit amet...',
    pictures: [
      'https://loremflickr.com/248/152?random=2'
    ]
  }
];

export const offers = [
  {
    id: 'offer-1',
    type: 'flight',
    title: 'Add luggage',
    price: 50
  },
  {
    id: 'offer-2',
    type: 'flight',
    title: 'Switch to comfort',
    price: 80
  }
];

export const generateRoutePoint = () => ({
  id: 'point-1',
  type: 'flight',
  destinationId: 'dest-2',
  dateFrom: '2019-03-18T10:30',
  dateTo: '2019-03-18T11:00',
  basePrice: 160,
  offers: ['offer-1', 'offer-2'],
  isFavorite: true
});
