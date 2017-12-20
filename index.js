var crimeSpots = [];
var crimes = [];
var month_array = ["Month","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var year_array = [];
var monthData = [];

// Initialize google map and find the crimes!
function initMap() {
  findCrimes();

  // Assign center los angeles to new google map and get user input location
  var losAngeles = {lat: 34.048868, lng: -118.252829};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: losAngeles
    });
  var input = document.getElementById('pac-input');

  // Creates a LatLngBounds object to use as a bounds area for autocomplete
  // Uses northeast and southwest coordinates
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

  // Creates arrays for autocomplete listener
  var placeMarker;
  var crimeMarkers = [];

  // Function to set placeMarker and crimeMarkers array on map
  function setMapOnPlace() {
    placeMarker.setMap();
    }
  function setMapOnCrime() {
    crimeMarkers.forEach(function(crime){
      crime.setMap(null);
    })
  }

  // Create a listener called 'place_changed' and create place variable
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();

    // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
    if (!place.geometry) {
      window.alert(place.name + " is outside of the acceptable LA boundary");
      return;
      }

    // If placeMarker and crimeMarkers have value then make values null/empty.
    // placeMarker is an object and crimeMarkers is an array
    if (placeMarker) {
        setMapOnPlace();
        placeMarker = null;
      }
    if (crimeMarkers.length > 0) {
        setMapOnCrime();
        crimeMarkers = [];
      }

    // Set map to center of place variable and zoom
    map.setCenter(place.geometry.location);
    map.setZoom(15);

    // Set marker for place variable with selected parameters
    // zIndex establishes view order for marker to bring it to top
    placeMarker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      zIndex: google.maps.Marker.MAX_ZINDEX,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());

    // Get bounds of window and check if each crimeMarker in crimeSpots is within getBounds
    // then push a new marker into the crimeMarkers array and map it
    var currentBounds = map.getBounds();

    var DR_numbers = [];
    var months = [];
    var years = [];
    // crimeSpots.forEach(function(crimeMarker){
    //   if (currentBounds.contains(crimeMarker)) {
    //     crimeMarkers.push(new google.maps.Marker({
    //       map: map,
    //       position: new google.maps.LatLng(crimeMarker.lat,crimeMarker.lng),
    //       icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    //       }));
    //       }
    //     })
    //   });
    crimes.forEach(function(crimeMarker){
      if (currentBounds.contains(new google.maps.LatLng(crimeMarker["lat"],crimeMarker["lng"]))) {
        crimeMarkers.push(new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(crimeMarker["lat"],crimeMarker["lng"]),
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }));
        DR_numbers.push(crimeMarker["DR_number"]);
        months.push(crimeMarker["month"]);
        years.push(crimeMarker["year"]);
        }
      })
    // console.log(monthly_data);
    console.log(DR_numbers.length);
    getMonthData(months,years,DR_numbers);
    console.log("getMOnth ran");
    google.charts.load('current', {'packages':['corechart']});
    // google.charts.setOnLoadCallback(drawVisualization);

    var currentData = [];
    var no_crimes = 0;
    currentData.push(year_array);
    for(i=0;i<monthData.length;i++){currentData.push(monthData[i])}
    google.charts.setOnLoadCallback(drawVisualization);
    console.log(JSON.stringify(currentData));
    function drawVisualization() {
    currentData = google.visualization.arrayToDataTable(currentData);

    var options = {
      title : 'has it gotten better?',
      color: 'red',
      lineWidth: 2,
      vAxis: {title: '# Crimes', gridlines: {count: 0}, textStyle: {color: "#E5E5E5"}},
      hAxis: {title: 'Month', gridlines: {count: 0}, textStyle: {color: "#E5E5E5"}},
      seriesType: 'bars',
      backgroundColor: '#212529',
      series: {5: {type: 'line', pointShape: 'star', pointSize: 20, color: '#E5E5E5'}},
      legend: {position: 'top', textStyle: {color: '#E5E5E5', fontSize: 16}, alignment: 'center'}
      };

    var chart = new google.visualization.ComboChart(document.getElementById('hist_stats'));
    chart.draw(currentData, options);
  }


    console.log(typeof currentData);
    console.log(currentData);
    console.log("updated_visualization");

    // END add listener function
    });


}

// Functions to transform crime data receievd from API
function getMonthName(number){
  if (number === 1) {return "January";}
  else if (number === 2) {return "February";}
  else if (number === 3) {return "March";}
  else if (number === 4) {return "April";}
  else if (number === 5) {return "May";}
  else if (number === 6) {return "June";}
  else if (number === 7) {return "July";}
  else if (number === 8) {return "August";}
  else if (number === 9) {return "September";}
  else if (number === 10) {return "October";}
  else if (number === 11) {return "November";}
  else if (number === 12) {return "December";}
  else {return "Unknown";}
}
function bucketAge(age){
  if (age >= 0 && age < 10) {return "under 10";}
  else if (age >= 10 && age < 20) {return "10-19";}
  else if (age >= 20 && age < 30) {return "20-29";}
  else if (age >= 30 && age < 40) {return "30-39";}
  else if (age >= 40 && age < 50) {return "40-49";}
  else if (age >= 50 && age < 60) {return "50-59";}
  else if (age >= 60 && age < 70) {return "60-69";}
  else if (age >= 70 && age < 80) {return "70-79";}
  else if (age >= 80 && age < 90) {return "80-89";}
  else if (age >=90) {return "90+";}
  else {return "Unknown";}
}
function findGender(sex){
  if (sex === "F") {gender = "Female"}
  else if (sex === "M") {gender = "Male"}
  else {gender = "Unknown"}
  return gender;
}
function findTime(time){
  if (Number(time) > 1200) {
    time = Number(time) - 1200;
    if (time.toString().length === 1) {
      time = "12:0" + time.toString() + "PM";
      }
    else if (time.toString().length === 2) {
      time = "12:" + time + "PM";
      }
    else if (time.toString().length === 3) {
      time = time.toString().substring(0,1) + ":" + time.toString().substring(1,3) + "PM";
      }
    else {
      time = time.toString().substring(0,2) + ":" + time.toString().substring(2,4) + "PM";
      }
    }
  else if (Number(time) === 1200) {time = "12:00PM"}
  else if (Number(time) > 0) {
    if (Number(time).toString().length === 1) {
      time = "12:0" + Number(time) + "AM";
      }
    else if (Number(time).toString().length === 2) {
      time = "12:" + Number(time) + "AM";
    }
    else if (Number(time).toString().length === 3) {
      time = Number(time).toString().substring(0,1) + ":" + Number(time).toString().substring(1,3) + "AM";
    }
    else {
      time = Number(time).toString().substring(0,2) + ":" + Number(time).toString().substring(2,4) + "AM";
    }
  }
  // else if (Number(time) > 9) {
  //   time = time.toString().substring(0,)
  // }
  else {console.log(time); console.log("last else");}
  return time;
  }
function findRace(descent){
  if(descent==="A"){return "Other Asian"}
    else if (descent==="B") {return "Black"}
    else if (descent==="C") {return "Chinese"}
    else if (descent==="D") {return "Cambodian"}
    else if (descent==="F") {return "Filipino"}
    else if (descent==="G") {return "Guamanian"}
    else if (descent==="H") {return "Hispanic/Latin/Mexican"}
    else if (descent==="I") {return "American Indian/Alaskan Native"}
    else if (descent==="J") {return "Japanese"}
    else if (descent==="K") {return "Korean"}
    else if (descent==="L") {return "Laotian"}
    else if (descent==="O") {return "Other"}
    else if (descent==="P") {return "Pacific Islander"}
    else if (descent==="S") {return "Samoan"}
    else if (descent==="U") {return "Hawaiian"}
    else if (descent==="V") {return "Vietnamese"}
    else if (descent==="W") {return "White"}
    else if (descent==="Z") {return "Z"}
    else {return "Unknown"}
  }
function roundHour(time){
  if (Number(time) >= 0 && Number(time) < 100) {return "12AM";}
  else if (Number(time) >= 100 && Number(time) < 200) {return "1AM";}
  else if (Number(time) >= 200 && Number(time) < 300) {return "2AM";}
  else if (Number(time) >= 300 && Number(time) < 400) {return "3AM";}
  else if (Number(time) >= 400 && Number(time) < 500) {return "4AM";}
  else if (Number(time) >= 500 && Number(time) < 600) {return "5AM";}
  else if (Number(time) >= 600 && Number(time) < 700) {return "6AM";}
  else if (Number(time) >= 700 && Number(time) < 800) {return "7AM";}
  else if (Number(time) >= 800 && Number(time) < 900) {return "8AM";}
  else if (Number(time) >= 900 && Number(time) < 1000) {return "9AM";}
  else if (Number(time) >= 1000 && Number(time) < 1100) {return "10AM";}
  else if (Number(time) >= 1100 && Number(time) < 1200) {return "11AM";}
  else if (Number(time) >= 1200 && Number(time) < 1300) {return "12PM";}
  else if (Number(time) >= 1300 && Number(time) < 1400) {return "1PM";}
  else if (Number(time) >= 1400 && Number(time) < 1500) {return "2PM";}
  else if (Number(time) >= 1500 && Number(time) < 1600) {return "3PM";}
  else if (Number(time) >= 1600 && Number(time) < 1700) {return "4PM";}
  else if (Number(time) >= 1700 && Number(time) < 1800) {return "5PM";}
  else if (Number(time) >= 1800 && Number(time) < 1900) {return "6PM";}
  else if (Number(time) >= 1900 && Number(time) < 1000) {return "7PM";}
  else if (Number(time) >= 2000 && Number(time) < 2100) {return "8PM";}
  else if (Number(time) >= 2100 && Number(time) < 2200) {return "9PM";}
  else if (Number(time) >= 2200 && Number(time) < 2300) {return "10PM";}
  else if (Number(time) >= 2300 && Number(time) < 2400) {return "11PM";}
  else {return "unknown";}
}
function getMonth(date){
  return Number(date.substring(0,10).split(/-/)[1]);
}
function getYear(date){
  return Number(date.substring(0,10).split(/-/)[0]);
}
function getMonthData(months,years,DR_numbers){
  var max_year = Math.max.apply(null,years);
  year_array = ["month",(max_year-4).toString(),(max_year-3).toString(),(max_year-2).toString(),(max_year-1).toString(),max_year.toString()];
  monthData = [
      ["jan",0,0,0,0,0],
      ["feb",0,0,0,0,0],
      ["mar",0,0,0,0,0],
      ["apr",0,0,0,0,0],
      ["may",0,0,0,0,0],
      ["jun",0,0,0,0,0],
      ["jul",0,0,0,0,0],
      ["aug",0,0,0,0,0],
      ["sep",0,0,0,0,0],
      ["oct",0,0,0,0,0],
      ["nov",0,0,0,0,0],
      ["dec",0,0,0,0,0]
      ];
  for (i = 0; i < years.length; i++) {
    if(years[i] === max_year - 4) {
      monthData[months[i]-1][1] += 1;
      no_crimes += 1;
    }
    else if(years[i] === max_year - 3) {
      monthData[months[i]-1][2] += 1;
      no_crimes += 1;
    }
    else if(years[i] === max_year - 2) {
      monthData[months[i]-1][3] += 1;
      no_crimes += 1;
    }
    else if(years[i] === max_year - 1) {
      monthData[months[i]-1][4] += 1;
      no_crimes += 1;
    }
    else if(years[i] === max_year) {
      monthData[months[i]-1][5] += 1;
      no_crimes += 1;
    }
    // else {
    //   console.log("could not getMonthData for: " + years[i] + " in " + DR_numbers[i]);
    // }
  }
  var current_max = 0;
  for (i = 0; i < monthData.length; i++){
    var sum = monthData[i][1]+monthData[i][2]+monthData[i][3]+monthData[i][4]+monthData[i][5];
    if (sum > current_max) {current_max = sum}
    var count = 0;
    for (j=1;j<monthData[i].length;j++){
      if (monthData[i][j] > 0){
        count += 1;
      }
    }
    var average = sum/count;
    monthData[i].push(average);
  }
  year_array.push("avg");
}

function findCrimes() {
  $.ajax({
      url: "https://data.lacity.org/resource/7fvc-faax.json",
      type: "GET",
      data: {
        "$limit" : 100000,
        "$$app_token" : "Dhj5YCkjjtNfUHELSklScfzCw"
      }
    }).done(function(data) {
      data.forEach(function(item){
        // console.log(item.dr_no);
        if (item.location_1){
        crimes.push({
          "DR_number": item.dr_no,
          "area": item.area_name,
          "crime": item.crm_cd_desc,
          "date": item.date_occ,
          "month": getMonth(item.date_occ),
          "year": getYear(item.date_occ),
          "time": findTime(item.time_occ),
          "hour": roundHour(item.time_occ),
          "time_military": item.time_occ,
          "race": findRace(item.vict_descent),
          "race_descent": item.vict_descent,
          "age": item.vict_age,
          "gender": findGender(item.vict_sex),
          "gender_sex": item.vict_sex,
          "lat":item.location_1.coordinates[1],
          "lng":item.location_1.coordinates[0]
          //170713038
          //for (i=0;i<crimes.length;i++){if(crimes[i]["DR_number"] === '170713038'){console.log(crimes[i]);}}
          })
        }
        });
        console.log(crimes);
      return crimes;
    });
}

function renderPage() {
  google.charts.load('current', {'packages':['corechart']});
  initMap();
  // handleStart();
  // handleCrimeClick();
  // handleArrestClick();
  // handleVehiclePedestrianClick();
  // handleAllClick();
  // handleZipSubmit();
}

$(renderPage);
