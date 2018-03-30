
var map;

var largeInfowindow;

var defaultIcon;
var highlightedIcon;

var bouncer;

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
	
	var bounds = new google.maps.LatLngBounds();
	
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