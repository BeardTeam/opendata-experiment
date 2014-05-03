// "jsonFile" name is by convention
var jsonFile = "divertimento_e_ristoro_-_timeline/divertimento_e_ristoro_-_timeline.json";

// "visualize(data)" function signature is by convention
function visualize(data) {
var width = 500;

var colorScale = d3.scale.ordinal()
	//		 purple,   pink,     light blue, blue, 	dark green, bordeaux, red,		black
	.range(['#ff00cc','#9900ff','#3399CC','#000033','#009900','#990000','#ff0000',"#000000"])
	.domain(["Discoteca","DiscoPub","Cocktail","American","Panineria","Pub","Wine","Default"]);

var chart = d3
	.timeline()	
	.colors( colorScale )
	.colorProperty('tipiSpecificiReduced')
	.width(width*2)
	.stack()
	.margin({left:120, right:10, top:0, bottom:0})
	.tickFormat( // 
		{	format: d3.time.format("%H"), 
			tickTime: d3.time.hours,
			tickInterval: 1,
			tickSize: 6})
	.hover(function (d, i, datum) {
		var div = $('#hover');
		var colors = chart.colors();
		div.find('.colored').css('background-color', colors(i));
		div.find('#name').text(datum.label);
	})
	.scroll(function (x, scale) {
		$("#scrolled_date").text(scale.invert(x) + " to " + scale.invert(x+width));
	})
	.click(function (d, i, datum) {
		var title = datum.label;
		var address = datum.indirizzo+" "+datum['numeroCivico'];
		var tipiSpecifici = datum['tipiSpecifici'];
		var latlngArray = datum.geolocazione.split(",");
		var lat = latlngArray[0];
		var lng = latlngArray[1];
		var latlng = new google.maps.LatLng(lat,lng);
		var phone = getPhone(datum);
		palerMobileMap.setMarker(latlng, title, address, phone, tipiSpecifici, datum.web);
		scrollToElement('#map-canvas_timeline');
		
		
		function getPhone(datum) {
			var tel = checkField(datum.telefono);
			if (tel != "")
				return tel;
			return checkField(datum.mobile);
		}
	});

var svg = d3.select("#out").append("svg")
	.attr("width", width*3)
	.datum(data).call(chart);
}
      