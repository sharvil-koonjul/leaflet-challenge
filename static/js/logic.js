
// Creating a function to create the map
function createMap(earthquakes){
    // Tile Layera
    let tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    // Setting Map View as the name of the tile Layer
    let baseMaps = {
        "Map View" : tileLayer
    }
    // Setting Earthquake Points as the overlay selection 
    let overlayMaps = {
        "Earthquake Points" : earthquakes
    }
    // Using Salt Lake City as the center point on the map and adding layers
    let map = L.map("map",{
        center: [40.7608,-111.8910],
        zoom: 5,
        layers: [tileLayer,earthquakes]
    })

    //Control Layers
    L.control.layers(baseMaps,overlayMaps,{
        collapsed:false
    }).addTo(map)

    // Legend Setup

    // Legend Location
    let legend = L.control({ position: 'bottomright' });

    // Legend criteria and sizing
    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        // Setting background of the legend to white
        div.style.backgroundColor = 'white'
        // Legend padding size
        div.style.padding = '10px'
        // Rounded edges 
        div.style.borderRadius = '5px'
        // Legend Title centered
        div.innerHTML = '<div style="text-align: center;font-weight: bold;">Depth</div>';
        // Depths as labels
        let labels = ['-10-10', '11-30', '31-50', '51-70', '71-90', '90+'];
        // Colors as colors
        let colors = ['PaleGreen', 'rgb(243, 255, 51)', 'rgb(255, 213, 110)', 'orange', 'DarkOrange', 'DarkRed'];

        // Creating a for loop that will create a small square of each color and the corresponding depths on each line
        let legendContent = '';
        for (let i = 0; i < labels.length; i++) {
            legendContent += '<div style="background-color:' + colors[i] + '; width: 15px; height: 15px; display: inline-block;"></div>' +
                             '<div style="display: inline-block; margin-left: 10px;">' + labels[i] + '</div><br>';
        }

        div.innerHTML += legendContent;

        return div;
    };

    // Add legend to the map
    legend.addTo(map);
}

// Function to create the earthquake markers
function createMarkers(response) {
    let locations = response.features;

    // Array to store the markers
    let earthquakeMarkers = [];

    for (let index=0; index < locations.length; index++) {
        let location = locations[index];

        let depth = location.geometry.coordinates[2]

        // Assigning colors to the depth ranges
        let fillColor
        if (depth<= 10) {
            fillColor = "PaleGreen";
        } else if (depth > 10 && depth <= 30) {
            fillColor = "rgb(243, 255, 51)";
        } else if (depth > 30 && depth <= 50) {
            fillColor = "rgb(255, 213, 110)";
        } else if (depth > 50 && depth <= 70) {
            fillColor = "orange";
        } else if (depth > 70 && depth <= 90) {
            fillColor = "DarkOrange";
        } else if (depth > 90) {
            fillColor = "DarkRed";
        }

        // Setting the marker criteria and colors
        let earthquakeMarker = L.circleMarker([location.geometry.coordinates[1],location.geometry.coordinates[0]],{
            radius: location.properties.mag *4,
            color: "black",
            opacity: 0.3,
            fillColor: fillColor,
            fillOpacity:1
        })

        // Popups for each marker
        earthquakeMarker.bindPopup(`${location.properties.title}<br>Depth: ${depth}`);

        // Push each marker to the empty array
        earthquakeMarkers.push(earthquakeMarker)
    }

    // Calling the createMap function and creating the layer group for earthquake markers
    createMap(L.layerGroup(earthquakeMarkers))
}

// URL and calling the createMarkers function
const URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
d3.json(URL).then(createMarkers)