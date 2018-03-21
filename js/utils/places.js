
var map;

// Create a new blank array for all the listing markers.
var markers = [];

//constructor creates a new map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 34.087115, lng: -118.015921},
		zoom: 13,
		mapTypeControl: false
	});
}

function loadMarkers(locations) {
	
	var bounds = new google.maps.LatLngBounds();
	
	// Style the markers a bit. This will be our listing marker icon.
	var defaultIcon = makeMarkerIcon('0091ff');
	
	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	var highlightedIcon = makeMarkerIcon('FFFF24');
	
	for (var i = 0; i < locations.length; i++) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			icon: defaultIcon,
			animation: google.maps.Animation.DROP,
			id: i
		});
		// Push the marker to our array of markers.
		markers.push(marker);
		
		bounds.extend(marker.position);
		
		map.fitBounds(bounds);
				
		// Create an onclick event to open an infowindow at each marker.
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
		
		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		
		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
	
	}
}

// This function will hide the filter out markers.
function hideFilterOutMarkers(string) {
	for (var i = 0; i < markers.length; i++) {
		if (markers[i].title.toLowerCase().indexOf(string.toLowerCase()) < 0) {
			markers[i].setMap(null);
		} else {
			markers[i].setMap(map);
		}
	}
}
	
// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21,34)
	);
	return markerImage;
}