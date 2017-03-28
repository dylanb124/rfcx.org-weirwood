import * as L from 'leaflet';

let baseIconSize: any = [20, 28];

export let rfcxMapIcon = L.divIcon({
  html: '<img class="rfcx-map-marker-img" src="assets/img/map/location-marker@2x.png" alt="">',
  iconSize: baseIconSize,
  iconAnchor: [10, 28],
  className: 'rfcx-map-marker'
});

export let rfcxMapRedIcon = L.divIcon({
  html: '<img class="rfcx-map-marker-img" src="assets/img/map/location-marker-red@2x.png" alt="">',
  iconSize: baseIconSize,
  iconAnchor: [10, 28],
  className: 'rfcx-map-marker'
});

export let rfcxRangerIcon = L.divIcon({
  html: '<img class="rfcx-map-marker-img" src="assets/img/map/ranger-marker@2x.png" alt="">',
  iconSize: [17, 28],
  iconAnchor: [8, 28],
  className: 'rfcx-map-marker'
});

export let rfcxRangerGrayIcon = L.divIcon({
  html: '<img class="rfcx-map-marker-img" src="assets/img/map/ranger-marker-gray@2x.png" alt="">',
  iconSize: [17, 28],
  iconAnchor: [8, 28],
  className: 'rfcx-map-marker'
});
