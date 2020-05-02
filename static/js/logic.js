//Set up API key, link json
console.log ("Hello");
var API_KEY = "pk.eyJ1IjoibmNtMTAzIiwiYSI6ImNrOGxveHp0aDBlZHIzZG8yam5tanVhMXkifQ.BddzMSbYqNmr0YYVYvZDww";
var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 3
  });
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
    function(data){
    //add circles to map
    //console.log(data);
    function earthquakes(feature){
        return{
            opacity:1,
            fillOpacity:1,
            fillColor:getColor(feature.properties.mag),
            color: getColor(feature.properties.mag),
            radius:getCircles(feature.properties.mag),
            stroke:"true",
            weight:0.5
        }; 
    }
    //define which color circle will appear in relation to earthquake mag
    function getColor(magnitude){
        switch(true){
            case magnitude > 5.0:
            //  console.log("I am here")
                return"#0000FF";
            case magnitude > 4.0:
                return"#6600FF";
            case magnitude > 3.0:
                return"#9900FF";
            case magnitude > 2.0:
                return"#CC00FF";
            case magnitude > 1.0:
                return"#FF00FF";
            default:
                return"#FF99CC";
        }
    }
    //define radius of circle
    function getCircles(magnitude){
        if (magnitude===0){
            return 3;
      //  if (magnitude)
        }
        return (magnitude*4);
    }

    L.geoJson(data,{
        pointToLayer: function(feature,latlng){
            return L.circleMarker(latlng);
        },
      style: earthquakes,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: "+feature.properties.mag+"<br>location: "+feature.properties.place);
        }
    }).addTo(myMap);

  // create a legend control object.
  var legend = L.control({
    position: "bottomright"
  });
  // Then add all the details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#FF99CC",
      "#FF00FF",
      "#CC00FF",
      "#9900FF",
      "#6600FF",
      "#0000FF"
    ];
    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  // Finally, we our legend to the map.
  legend.addTo(myMap);
});