
var SEARCH_URL = "https://api.foursquare.com/v2/venues/search?" +
	"ll=%LL%&intent=match&name=%TITLE%" +
	"&client_id=Q4QXZWZPJA3A2FLXTA2EXRGI1FWJCGV0BEXJ3VZF2PH3OQO5" +
	"&client_secret=BKALZ4MOIMHNK5ST2EVLTBUJDYJJ1IL14R1SEN3EM0UPSLLN&v=20180324";

var PHOTOS_URL = "https://api.foursquare.com/v2/venues/%ID%/photos?limit=10" +
	"&client_id=Q4QXZWZPJA3A2FLXTA2EXRGI1FWJCGV0BEXJ3VZF2PH3OQO5" +
	"&client_secret=BKALZ4MOIMHNK5ST2EVLTBUJDYJJ1IL14R1SEN3EM0UPSLLN&v=20180324";

// Get photos of the place using Foursquare APIs.
function loadFoursquarePhotos(title, ll, fourSquarePhotos, fourSquareError) {
	if(title != "" && ll != "") {
		var urlTitle = SEARCH_URL.replace("%TITLE%", title);
		var searchUrl = urlTitle.replace("%LL%", ll);
		
		$.getJSON(searchUrl, function(data) {
			var venue_id = data.response.venues[0].id;
			var title = data.response.venues[0].name;
			var PhotosUrl = PHOTOS_URL.replace("%ID%", venue_id);
			
			$.getJSON(PhotosUrl, function(data) {
				fourSquarePhotos([]);
				fourSquareError("");
				var items = data.response.photos.items;
				for (var i = 0; i < items.length; i++) {
					var url =items[i].prefix + "300x300" + items[i].suffix;			
					fourSquarePhotos.push(new FoursquarePhoto(url, title));
				}
			}).fail(function() {
				fourSquareError("Oops! We didn't find any photos for this place. Refresh or try later!");
			});
		}).fail(function() {
			fourSquareError("Oops! We didn't find any venue matched this place. Refresh or try later!");
		});
	}
}
