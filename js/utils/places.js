
var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 34.087115, lng: -118.015921},
		zoom: 13,
		mapTypeControl: false
	});
}

function loadMarkers(locations) {
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < locations.length; i++) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
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