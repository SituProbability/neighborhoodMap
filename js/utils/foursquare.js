
var SEARCH_URL = "https://api.foursquare.com/v2/venues/search?\
ll=%LL%&intent=match&name=%TITLE%\
&client_id=Q4QXZWZPJA3A2FLXTA2EXRGI1FWJCGV0BEXJ3VZF2PH3OQO5\
&client_secret=BKALZ4MOIMHNK5ST2EVLTBUJDYJJ1IL14R1SEN3EM0UPSLLN&v=20180324";

var PHOTOS_URL = "https://api.foursquare.com/v2/venues/%ID%/photos?\
&client_id=Q4QXZWZPJA3A2FLXTA2EXRGI1FWJCGV0BEXJ3VZF2PH3OQO5\
&client_secret=BKALZ4MOIMHNK5ST2EVLTBUJDYJJ1IL14R1SEN3EM0UPSLLN&v=20180324";

function loadFoursquarePhotos(title, ll, fourSquarePhotos) {
	
	var urlTitle = SEARCH_URL.replace("%TITLE%", title);
	var searchUrl = urlTitle.replace("%LL%", ll);
	
	$.getJSON(searchUrl, function(data) {
		var venue_id = data.response.venues[0].id;
		var title = data.response.venues[0].name;

		var PhotosUrl = PHOTOS_URL.replace("%ID%", venue_id);
		$.getJSON(PhotosUrl, function(data) {
			var items = data.response.photos.items;
			for (var i = 0; i < items.length; i++) {
				var url =items[i].prefix + "300x300" + items[i].suffix;			
				fourSquarePhotos.push(new FoursquarePhoto(url, title));
			}
		});
	});
}
