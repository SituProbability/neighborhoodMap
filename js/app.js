var search = ko.observable("")


// Default points of interest
var initialLocations = [
					{title: "Chuck E. Cheese's", location: {lat: 34.087622, lng : -118.0166958}},
					{title: "Ichiban Buffet & Grill", location: {lat: 34.0728839, lng: -118.0231782}},
					{title: "China Great Buffet", location: {lat: 34.0637512, lng: -118.0212161}},
					{title: "Shakey's Pizza Parlor", location: {lat: 34.0692741, lng: -118.0293583}},
					{title: "Pho Kim", location: {lat: 34.0806082, lng: -118.0188375}},
					{title: "Alberto's Mexican Food", location: {lat: 34.075125, lng: -118.0225922}},
					{title: "El Salvadoreño Restaurant", location: {lat: 34.065706, lng: -118.029991}},
					{title: "Longo Toyota", location: {lat: 34.0694683, lng: -118.0217854}},
					{title: "Bert's Mega Mall", location: {lat: 34.10089980000001, lng: -117.9093383}}
				];

var Place = function(data) {

	this.name = ko.observable(data.title);
	this.isFilterOut = ko.computed(function() {
		var isFilterOut;
		if (this.name().toLowerCase().indexOf(search().toLowerCase()) > -1) {
			isFilterOut = true;
		} else {
			return isFilterOut = false;
		}
		
		return isFilterOut;

	}, this);

}
				
var ViewModel = function() {
	self = this;
		
	self.placeList = ko.observableArray([]);
	initialLocations.forEach(function(item) {
		self.placeList.push(new Place(item));
	});
	
	
	self.matchMarkers = ko.computed(function() {
			hideFilterOutMarkers(search());
	}, self);
	
//	self.currentPlace = ko.observable(self.placeList()[0]);
//	self.setPlace = function(clickedPlace) {
//		self.currentPlace(clickedPlace);
//	}
	
	self.populateInfowindow = function(clickedPlace) {
		// check if the item is clicked again!
		if(clickedPlace.name() != bouncer.title){
			// Stop the bouncing marker, if there is one 
			if ( bouncer && bouncer.getAnimation() !== null ) {
				bouncer.setAnimation(null);
			}
			
			for (var i = 0; i < markers.length; i++) {
		
				if (markers[i].title == clickedPlace.name()) {
					markers[i].setAnimation(google.maps.Animation.BOUNCE);
					bouncer = markers[i];
					populateInfoWindow(markers[i], largeInfowindow);
				}
			}
		
		
		}
		
		
	}
	
	self.coloredMarker = function(mouseOverPlace) {
		for (var i = 0; i < markers.length; i++) {
			if (markers[i].title == mouseOverPlace.name()) {
				markers[i].setIcon(highlightedIcon);
			}
		}
	}
	
	self.uncoloredMarker = function(mouseOverPlace) {
		for (var i = 0; i < markers.length; i++) {
			if (markers[i].title == mouseOverPlace.name()) {
				markers[i].setIcon(defaultIcon);
			}
		}
	}
	
    initMap();
    loadMarkers(initialLocations);
	
}

function run() {
	viewModel = new ViewModel()
	ko.applyBindings(new ViewModel());
	
}