var crimeSpots = [];
var crimes = [];

//initialize google map
function initMap() {
  console.log('initMap ran');

  findCrimes();

  //assign center los angeles coordinates and create new google map
  var losAngeles = {lat: 34.048868, lng: -118.252829};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: losAngeles
  });
  //get user location input element
  var input = document.getElementById('pac-input');
    console.log(input);

  //LA boundaries from data
  // var LAcoordinates = [
  //   {lat: 34.8146, lng: -117.6596},
  //   {lat: 33.3427, lng: -118.8513},
  //   {lat: 34.8146, lng: -118.8513},
  //   {lat: 33.3427, lng: -117.6596}
  // ];

  //creates a LatLngBounds object to use as a bounds area for autocomplete
  //uses northeast and southwest coordinates
  var LAcoordinates = new google.maps.LatLngBounds(
    new google.maps.LatLng(33.3427,-118.8513),
    new google.maps.LatLng(34.8146,-117.6596)
    );
    console.log('LAcoordinates is: ' + JSON.stringify(LAcoordinates));

  //sets up autocomplete feature with options specified
  var options = {
    bounds: LAcoordinates,
    strictBounds: true
    };
  var autocomplete = new google.maps.places.Autocomplete(input,options);
    console.log("autocomplete set");

  //grab each item and push to a new crimeSpots array
  // crimes.forEach(function(crime) {
  //   console.log("crimes.forEach ran");
  //   crimeSpots.push(new google.maps.LatLng(crime.location_1.coordinates[1],crime.location_1.coordinates[0]));
  //   console.log(JSON.stringify(crimeSpots));
  // });


  // Add some markers to the map.
  // Note: The code uses the JavaScript Array.prototype.map() method to
  // create an array of markers based on a given "crimes" array.
  // The map() method here has nothing to do with the Google Maps API.
  // var crimeMarkers = crimeSpots.forEach(function(location) {
  //   // var resultColor = google.maps.geometry.poly.containsLocation(location, LAboundary) ?
  //   //     'red' : 'gray';
  //   console.log(location);
  //   if (google.maps.containsLocation(location,LAcoordinates)) {
  //     return new google.maps.Marker({
  //       position: location,
  //       // label: labels[i % labels.length]
  //       map: map,
  //       icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
  //       });
  //     }
  // });

  var placeMarker;
  var crimeMarkers;

  function setMapOnPlace(map) {
    placeMarker.setMap(map);
    placeMarker = null;
  }

  function setMapOnCrime(map) {
    crimeMarkers.setMap(map);
    // for (var i = 0; i < crimeMarkers.length; i++) {
    //       crimeMarkers[i].setMap(map);
    //     }
  }

  // Create a listener called 'place_changed'
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    console.log(place.geometry.location);

    // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
    if (!place.geometry) {
      window.alert(place.name + " is outside of the acceptable LA boundary");
      return;
      }

    // If placeMarker and crimeMarkers have value then make values null/empty.
    if (placeMarker){
        setMapOnPlace(null);
      }
    if (crimeMarkers){
        setMapOnCrime(null);
        crimeMarkers = null;
      }
      console.log('set map on null');

    // If place is within boundaries, then fit
    map.setCenter(place.geometry.location);
    map.setZoom(15);

    placeMarker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });

    console.log(place.geometry.location.lat());
    console.log(place.geometry.location.lng());
    console.log(place.geometry.location);
    console.log('crimeMarkssss are: ' + JSON.stringify(crimeMarkers));

    var currentBounds = map.getBounds();

    crimeMarkers = crimeSpots.forEach(function(crimeMarker){
      if (currentBounds.contains(crimeMarker)) {
        new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(crimeMarker.lat,crimeMarker.lng),
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          })
        }
    })
  });
}

function findCrimes() {
  $.ajax({
      url: "https://data.lacity.org/resource/7fvc-faax.json",
      type: "GET",
      data: {
        "$limit" : 1000,
        "$$app_token" : "Dhj5YCkjjtNfUHELSklScfzCw"
      }
    }).done(function(data) {
      console.log(data);
      data.forEach(function(item){
        crimes.push(item);
        });
      // console.log('findCrimes crimes is: ' + JSON.stringify(crimes));

      //grab each item and push to a new crimeSpots array
      crimes.forEach(function(crime) {
        console.log("crimes.forEach ran");
        crimeSpots.push({"lat":crime["location_1"]["coordinates"][1],"lng":crime["location_1"]["coordinates"][0]});
        });
      // console.log('findCrimes crimeSpots is: ' + JSON.stringify(crimeSpots));

      return crimes;
      return crimeSpots;
    });
    // console.log('crimes: ' + JSON.stringify(crimes));
}

function renderPage() {
  initMap();
  // handleStart();
  // handleCrimeClick();
  // handleArrestClick();
  // handleVehiclePedestrianClick();
  // handleAllClick();
  // handleZipSubmit();
}

$(renderPage);
