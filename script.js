//guessing number start! 
//function that have length of result from map 
var num_object,
    radio_value,
    map,service,
    currentLocation;

function number_of_objects(results){
     num_object = results.length; 
}
function make_guess() {  
    var the_guess = $('#guess_input').val();    
    if(the_guess > num_object){
        $('#show_result').val('too high!');
    }else if (the_guess < num_object){
        $('#show_result').val('too low!');
    }else{
        if(num_object > 0){
        $('#show_result').val('Congrats ! You guessed it. We\'ve found ' + num_object + ' Starbucks near you' );       
        }
        if(num_object === 0){
        $('#show_result').val('You guessed it.There is ' + num_object + ' Starbucks near you. Please increase miles.' );     
        }
    $("#map").css("visibility", "visible");
    }    
}
$(document).ready(function () {
           $("#button").click(make_guess);
        $('#radioButtonContainer input:radio').click(function() {
            radio_value = $('input[name=optradio]:checked').val();
            radio_value = Number(radio_value);
            navigator.geolocation.getCurrentPosition(initialize);
            $("#map").css("visibility", "hidden");
         });    
});
//guessing number section ends !

function handleSearchResults(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
    number_of_objects(results);
      }
    //create marker for the search
function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: placeLoc,
//            icon:place.icon
            icon:'images/starbucks_icon.ico'
        });
                   
        //adding click handler for marker   
       google.maps.event.addListener(marker, 'click', function() {
           var content = '<div>'+place.name+'</div>' + '<br>' + 
            '<div>' + place.vicinity+'</div>' + '<br>' + '<div>' + 'Rating:'+place.rating+'</div>' ;
       var infowindow = new google.maps.InfoWindow({
      content: content
    });
      infowindow.open(map, this);
    });
}
function performSearch(){
    var request = {
        //show result that fit the bound of the map
//        bounds:map.getBounds(),
        location:currentLocation,
    radius:radio_value,
        name:"Starbucks"
    }
  service.nearbySearch(request,handleSearchResults);
}

function initialize(location){
     currentLocation = new google.maps.LatLng(location.coords.latitude,location.coords.longitude);
    
    var mapOptions = {
            zoom: 12,
            center:currentLocation,
            MapTypeId:google.maps.MapTypeId.ROADMAP
    }                    
    map = new google.maps.Map(document.getElementById('map'),mapOptions);    
    //create marker for current location
    var marker = new google.maps.Marker({
        position: currentLocation,
        map:map,
        title:'you\'re here'
    });    
    //create info window for current location 
    var infowindow = new google.maps.InfoWindow({
          content: "you're here"
        });   
    //add click handler for current location marker
    marker.addListener('click', function() {
          infowindow.open(map, marker);
        });   
    service = new google.maps.places.PlacesService(map);   
    //bounds changed before run performSearch!!
    google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);   
    //Drawing circle on map
    var cityCircle = {
            strokeColor: '#00008B',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00008B',
            fillOpacity: 0.35,
            map: map,
            center: currentLocation
};
    var circle = new google.maps.Circle(cityCircle);   
    //traffic button
    //creating traffic layer on map 
    var trafficLayer = new google.maps.TrafficLayer();
     $('#traffic').click(function(){
         if(trafficLayer.getMap()){
             trafficLayer.setMap(null);
         }else{
         trafficLayer.setMap(map);
         }      
     });
}



