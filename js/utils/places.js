
var map;

var largeInfowindow;

var defaultIcon;
var highlightedIcon;

var bouncer;

var searchBox;

var placeMarkers = [];

var bounds;

var pointOfInterest = "El Monte";

// Create a new blank array for all the listing markers.
var markers = [];

// Constructor creates a new map
function initMap() {
	// Create a styles array to use with the map.
	var styles = [
	  {
		featureType: 'water',
		stylers: [
		  { color: '#19a0d8' }
		]
	  },{
		featureType: 'administrative',
		elementType: 'labels.text.stroke',
		stylers: [
		  { color: '#ffffff' },
		  { weight: 6 }
		]
	  },{
		featureType: 'administrative',
		elementType: 'labels.text.fill',
		stylers: [
		  { color: '#e85113' }
		]
	  },{
		featureType: 'road.highway',
		elementType: 'geometry.stroke',
		stylers: [
		  { color: '#efe9e4' },
		  { lightness: -40 }
		]
	  },{
		featureType: 'transit.station',
		stylers: [
		  { weight: 9 },
		  { hue: '#e85113' }
		]
	  },{
		featureType: 'road.highway',
		elementType: 'labels.icon',
		stylers: [
		  { visibility: 'off' }
		]
	  },{
		featureType: 'water',
		elementType: 'labels.text.stroke',
		stylers: [
		  { lightness: 100 }
		]
	  },{
		featureType: 'water',
		elementType: 'labels.text.fill',
		stylers: [
		  { lightness: -100 }
		]
	  },{
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [
		  { visibility: 'on' },
		  { color: '#f0e4d3' }
		]
	  },{
		featureType: 'road.highway',
		elementType: 'geometry.fill',
		stylers: [
		  { color: '#efe9e4' },
		  { lightness: -25 }
		]
	  }
	];
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 34.087115, lng: -118.015921},
		zoom: 15,
		styles: styles
	});
}

// Function is called if the Google Maps script fails to load,
function googleMapsError() {
	alert("Ooops!\nLooks like the satellite is down!\nRefresh or try later!");
}

// Load markers
function loadMarkers(locations) {
	bounds = new google.maps.LatLngBounds();
	bouncer = new google.maps.Marker({
		title: ""
	});
	
	largeInfowindow = new google.maps.InfoWindow();
	
	// Style the markers a bit. This will be our listing marker icon.
	defaultIcon = makeMarkerIcon('0091ff');
	
	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	highlightedIcon = makeMarkerIcon('FFFF24');
	
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
			viewModel.show(false);
			// check if the item is clicked again!
			if(this !== bouncer) {
				// Stop the bouncing marker, if there is one 
				if ( bouncer && bouncer.getAnimation() !== null ) {
					bouncer.setAnimation(null);
				}

				this.setAnimation(google.maps.Animation.BOUNCE);
				bouncer = this;
				populateInfoWindow(this, largeInfowindow);
				
				// Load Foursquare photos for this markers location 
				for (var i = 0; i < viewModel.placeList().length; i++) {
					if (bouncer.title == viewModel.placeList()[i].name()) {
						viewModel.currentPlace(viewModel.placeList()[i]);
						break;
					}
				}
			}
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

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
		
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {		
		// Clear the infowindow content to give the streetview time to load.
		infowindow.setContent('');
		infowindow.marker = marker;
		
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
			marker.setAnimation(null);
			infowindow.marker = null;
			bouncer = new google.maps.Marker({
				title: ""
			});
		});
		
		var streetViewService = new google.maps.StreetViewService();
		var radius = 50;
		
		
		// Use streetview service to get the closest streetview image within
		// 50 meters of the markers position
		streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
		
		// Open the infowindow on the correct marker.
		infowindow.open(map, marker);
		
		// In case the status is OK, which means the pano was found, compute the
		// position of the streetview image, then calculate the heading, then get a
		// panorama from that and set the options
		function getStreetView(data, status) {
			if (status == google.maps.StreetViewStatus.OK) {
				var nearStreetViewLocation = data.location.latLng;
				
				var heading = google.maps.geometry.spherical.computeHeading(
					nearStreetViewLocation, marker.position
				);
				
				infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
				
				var panoramaOptions = {
					position: nearStreetViewLocation,
					pov: {
						heading: heading,
						pitch: 30
					}
				};
				
				var panorama = new google.maps.StreetViewPanorama(
					document.getElementById('pano'), panoramaOptions
				);
					
			} else {
				infowindow.setContent('<div>' + marker.title + '</div>' +
					'<div>No Street View Found</div>'
				);
			}
		
		}
	}
}
			
// This function fires when the user select search button on the places search.
function textSearchPlaces(query) {
	var placesService = new google.maps.places.PlacesService(map);
	placesService.textSearch({
		query: query,
		bounds: bounds,
	}, function(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			createMarkersForPlaces(results);
		}
	});
}
			
// This function creates markers for each place found in either places search.
function createMarkersForPlaces(places) {
	for (var i = 0; i < places.length; i++) {
		var place = places[i];
		var icon = {
			url: place.icon,
			size: new google.maps.Size(35, 35),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(15, 34),
			scaledSize: new google.maps.Size(25, 25)
		};
		// Create a marker for each place.
		var marker = new google.maps.Marker({
			map: map,
			icon: icon,
			title: place.name,
			position: place.geometry.location,
			id: place.place_id
		});
		
		// Create a single infowindow to be used with the place details information
		// so that only one is open at once.
		var placeInfoWindow = new google.maps.InfoWindow();
		// If a marker is clicked, do a place details search on it in the next function.
		marker.addListener('click', function() {
			if (placeInfoWindow.marker == this) {
				console.log("This infowindow already is on this marker!");
			} else {
				getPlacesDetails(this, placeInfoWindow);
			}
		});

		placeMarkers.push(marker);
		if (place.geometry.viewport) {
			// Only geocodes have viewport.
			bounds.union(place.geometry.viewport);
		} else {
			bounds.extend(place.geometry.location);
		}
	}
	
	map.fitBounds(bounds);
}
			
// This is the PLACE DETAILS search.
function getPlacesDetails(marker, infowindow) {
	var service = new google.maps.places.PlacesService(map);
	service.getDetails({
		placeId: marker.id
	}, function(place, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			// Set the marker property on this infowindow so it isn't created again.
			infowindow.marker = marker;
			var innerHTML = '<div>';
			if (place.name) {
				innerHTML += '<strong>' + place.name + '</strong>';
			}
			if (place.formatted_address) {
				innerHTML += '<br>' + place.formatted_address;
			}
			if (place.formatted_phone_number) {
				innerHTML += '<br>' + place.formatted_phone_number;
			}
			if (place.opening_hours) {
				innerHTML += '<br><br><strong>Hours:</strong><br>' +
					place.opening_hours.weekday_text[0] + '<br>' +
					place.opening_hours.weekday_text[1] + '<br>' +
					place.opening_hours.weekday_text[2] + '<br>' +
					place.opening_hours.weekday_text[3] + '<br>' +
					place.opening_hours.weekday_text[4] + '<br>' +
					place.opening_hours.weekday_text[5] + '<br>' +
					place.opening_hours.weekday_text[6];
			}
			if (place.photos) {
				innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
					{maxHeight: 100, maxWidth: 200}) + '">';
			}
			innerHTML += '</div>';
			infowindow.setContent(innerHTML);
			infowindow.open(map, marker);
			// Make sure the marker property is cleared if the infowindow is closed.
			infowindow.addListener('closeclick', function() {
				infowindow.marker = null;
			});
		}
	});
}