var crime_spots = [];
var crimes = [];

//initialize google map
function initMap() {
  console.log('initMap ran');

  //assign center los angeles coordinates and create new google map
  var losAngeles = {lat: 34.048868, lng: -118.252829};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: losAngeles
  });
  //get user location input element
  var input = document.getElementById('pac-input');
  //declares the polygon of acceptable LA locations in an array of coordinates
  //and creates maps polygon
  var LAcoordinates = [
    {lat: 34.8146, lng: -117.6596},
    {lat: 33.3427, lng: -118.8513},
    {lat: 34.8146, lng: -118.8513},
    {lat: 33.3427, lng: -117.6596}
  ];
  console.log('LAcoordinates is: ' + LAcoordinates);
  return LAcoordinates;
  var LAboundary = new google.maps.Polygon({paths: LAcoordinates});
  console.log('LAboundary is: ' + LAboundary);

  //sets up autocomplete feature
  var autocomplete = new google.maps.places.Autocomplete(input);
    // autocomplete.setOptions({strictBounds: this.checked});
    autocomplete.bindTo(LAcoordinates, map);

    crimes.forEach(function(crime,i){
    console.log("crimes.forEach ran")
    crime_spots.push(new google.maps.LatLng(crime.location_1.coordinates[1],crime.location_1.coordinates[0]));
  });

  // Add some markers to the map.
  // Note: The code uses the JavaScript Array.prototype.map() method to
  // create an array of markers based on a given "crimes" array.
  // The map() method here has nothing to do with the Google Maps API.
  var crimeMarkers = crime_spots.forEach(function(location) {
    var resultColor = google.maps.geometry.poly.containsLocation(location, LAboundary) ?
      'red' : 'gray';
    return new google.maps.Marker({
      position: location,
      // label: labels[i % labels.length]
      map: map,
      icon: {
        path: LAboundary,
        fillColor: resultColor,
        fillOpacity: .2,
        strokeColor: 'white',
        strokeWeight: .5,
        scale: 10
      }
    });
  });

  // Add a marker clusterer to manage the markers.
  var markerCluster = new MarkerClusterer(map, crimeMarkers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

  //create a listener called 'place_changed'
  autocomplete.addListener('place_changed', function() {
    crimeMarkers.setVisible(false);
    var place = autocomplete.getPlace();
          /*
          if (!place.geometry) {
            window.alert(place.name + "falls outside of the LA boundary.")
            return;
          }
          */
          if (!google.maps.geometry.poly.containsLocation(place, LAboundary)) {
            window.alert(place.name + "falls outside of the LA boundary.")
            return;
          }

    if (google.maps.geometry.poly.containsLocation(place, LAboundary)) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      new google.maps.Marker({
            position: e.latLng,
            map: map,
          });
    crimeMarkers.setVisible(true);
  });

}

function findCrimes() {
  $.ajax({
      url: "https://data.lacity.org/resource/7fvc-faax.json",
      type: "GET",
      data: {
        "$limit" : 5000,
        "$$app_token" : "Dhj5YCkjjtNfUHELSklScfzCw"
      }
    }).done(function(data) {
      console.log(data);
      data.forEach(function(item){
        crimes.push(item);
      });
    });
}

function renderPage() {
  initMap();
  findCrimes();
  // handleStart();
  // handleCrimeClick();
  // handleArrestClick();
  // handleVehiclePedestrianClick();
  // handleAllClick();
  // handleZipSubmit();
}

$(renderPage);
