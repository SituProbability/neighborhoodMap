
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

// A class that represents a place.
var Place = function(data) {
	this.name = ko.observable(data.title);
	this.position = data.location;
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

// A class that represents a foursquare photo
var FoursquarePhoto = function (url, title) {
    var self = this;
    self.src = ko.observable(url);
    self.alt = ko.observable(title);
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
	
	self.fourSquarePhotos = ko.observableArray([]);
	self.fourSquareError = ko.observable();
	
	self.currentPlace = ko.observable(self.placeList()[0]);
	
	this.setPlace = function(clickedPlace){
		self.currentPlace(clickedPlace);		
	};
	
	self.getFoursquareHeader = ko.computed(function() {
		self.title = ko.observable(self.currentPlace().name());
		self.ll = ko.observable(self.currentPlace().position.lat + "," + self.currentPlace().position.lng);
		loadFoursquarePhotos(self.title(), self.ll(), self.fourSquarePhotos, self.fourSquareError);
	}, self);
	
	self.displaySidebar = ko.observable(false);
	self.setDisplaySidebar = function() {
		if(self.displaySidebar() == false) {
			self.displaySidebar(true);
		} else {
			self.displaySidebar(false);
		}
	};

	// Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
	ko.bindingHandlers.fadeVisible = {
		init: function(element, valueAccessor) {
			// Initially set the element to be instantly visible/hidden depending on the value
			var value = valueAccessor();
			$(element).toggle(ko.utils.unwrapObservable(value)); 
		},
		update: function(element, valueAccessor) {
			// Whenever the value subsequently changes, slowly fade the element in or out
			var value = valueAccessor();
			ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
		}
	};
	
	self.setWidth = ko.pureComputed(function(){
		return self.displaySidebar() ? "set-width" : "set-full-width"
	}, self);
}


var viewModel;
function run() {
	initMap();
    loadMarkers(initialLocations);
	viewModel = new ViewModel();
	ko.applyBindings(viewModel);
}