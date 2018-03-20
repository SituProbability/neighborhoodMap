var search = ko.observable("")

// Default points of interest
var initialLocations = [
					{title: "Chuck E. Cheese's", location: {lat: 34.087622, lng : -118.0166958}},
					{title: "Ichiban Buffet & Grill", location: {lat: 34.0728839, lng: -118.0231782}},
					{title: "China Great Buffet", location: {lat: 34.0637512, lng: -118.0212161}},
					{title: "Shakey's Pizza Parlor", location: {lat: 34.0692741, lng: -118.0293583}},
					{title: "Pho Kim", location: {lat: 34.0806082, lng: -118.0188375}},
					{title: "Alberto's Mexican Food", location: {lat: 34.075125, lng: -118.0225922}},
					{title: "El Salvadoreño Restaurant", location: {lat: 34.065706, lng: -118.029991}}
				];

var place = function(data) {

	this.name = ko.observable(data.title);
	
}
				
var ViewModel = function() {
	self = this;
		
	this.placeList = ko.observableArray([]);
	initialLocations.forEach(function(item) {
		self.placeList.push(new place(item));
	});
	
	
	
	
	
    initMap();
    loadMarkers(initialLocations);	
}

function run() {
	viewModel = new ViewModel()
	ko.applyBindings(new ViewModel());
	
}