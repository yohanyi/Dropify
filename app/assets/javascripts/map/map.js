Dropify.Map = function(mapSelector) {
	var noPoi = [
		{
			featureType: "poi",
			stylers: [ { visibility: "off" } ]   
		}
	];

	var mapOptions = {
		center: { lat: 37, lng: -122},
		zoom: 18,
		disableDefaultUI: true,
		panControl: false,
		zoomControl: false,
		scaleControl: false,
		scrollwheel: false,
		disableDoubleClickZoom: true,
		mapTypeControl: false,
		draggable:false,
		streetViewControl: false,
		styles: noPoi
	};

	this.markers = [];

	this.init(mapSelector, mapOptions);
}

Dropify.Map.prototype = {
	init: function(mapSelector, mapOptions) {
		this.map = new google.maps.Map($(mapSelector)[0],mapOptions);
		this.setupGeolocation(5000);
		this.blockTouchEvents();
	},
	blockTouchEvents: function() {
		document.body.addEventListener("touchmove", this.blockTouchMove, true);
		document.ontouchmove = function(e){ 
			e.preventDefault(); 
		}	
	},
	blockTouchMove: function(evt) {
		if (evt.touches.length > 1) {
			evt.preventDefault()
		}

		return false;
	},
	setupGeolocation: function(interval) {
		this.centerOnLocation();
		this.geolocationTimer = setInterval(this.centerOnLocation.bind(this), interval);
	},
	centerOnLocation: function() {
		this.getLocation().then(function(pos) { this.map.setCenter(pos); }.bind(this));
	},
	handleNoGeolocation: function(errorFlag) {
		if (errorFlag) {
			alert('Error: The Geolocation service failed.');
		} else {
			alert('Error: Your browser doesn\'t support geolocation.');
		}
	},
	renderMarkers: function(markers) {
		for(var i = 0; i < markers.length; i++) {
			this.renderMarker(markers[i]);
		}
	},
	renderMarker: function(message) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(message.latitude, message.longitude),
			map: this.map
		});
		
		var markerShit = new Dropify.MessageViewer(message)

  	google.maps.event.addListener(marker, 'click', function() {
  		var yolo = new Dropify.MessageViewer(message);
  		yolo.showMessage();
  	})
		this.markers.push(marker);
	},

	getLocation: function() {
		return new Promise(function(success, error) {
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					success(pos);
				}, function() {
					error(true);
				});
			}
			else {
	      // Browser doesn't support Geolocation
	      error(false);
	    }
	  });
	},
	setExploreMode: function() {
		this.setMarkerVisibility(true);
		this.lockMap();
	},
	setAdvertMode: function() {
		this.setMarkerVisibility(false);
		this.unlockMap();
	},
	setMarkerVisibility: function(visiblity) {
		for(var i = 0; i < this.markers.length; i++) {
			this.markers[i].setVisible(visiblity);
		}
	},
	unlockMap: function() {
		this.map.setOptions({
			disableDefaultUI: false,
			panControl: true,
			zoomControl: true,
			scaleControl: true,
			scrollwheel: true,
			disableDoubleClickZoom: false,
			mapTypeControl: true,
			draggable:true
		});
		clearInterval(this.geolocationTimer);
		this.addAdvertClickListener();
	},
	lockMap: function() {
		this.map.setOptions({
			zoom: 18,
			disableDefaultUI: true,
			panControl: false,
			zoomControl: false,
			scaleControl: false,
			scrollwheel: false,
			disableDoubleClickZoom: true,
			mapTypeControl: false,
			draggable:false
		});
		this.setupGeolocation();
		google.maps.event.removeListener(this.clickListener);
		this.clickListener = null;
	},
	addAdvertClickListener: function() {
		if(!this.clickListener) {
			this.clickListener = google.maps.event.addListener(this.map, 'click', this.handleMapClick.bind(this));
		}
	},
	handleMapClick: function(evt) {
		console.log(evt.latLng);
	}
};