export function initMap(mapDiv) {
    mapboxgl.accessToken = 'pk.eyJ1IjoibHVjaWFubXVyZGluIiwiYSI6ImNsaHJmamM5bzA1YXkzbm1zd2JlaGduN3UifQ.-aJkhXyJRf9rBlH2A3IDFA'
    var map = new mapboxgl.Map({
      container: mapDiv,
      center: [0, 0],
      zoom: 2,
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v12'
    });
  
    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'main-layer', (e) => {
      // Copy coordinates array.
      // Picking the last element because I'm drawing them backwards
      const lastEl = e.features.length - 1
      const coordinates = e.features[lastEl].geometry.coordinates.slice();
      const description = e.features[lastEl].properties.description;
      const popupColour = e.features[lastEl].properties.popupColour;
      const properties = e.features[lastEl].properties
      
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
    });

    map.on('load', () => {
      window.mapLoaded = true
    });
    
    window.map = map;
  }
  
  /* Wrapper for adding an image to a mapboxgl map */
  
  // @param colour   Colour of the dot image to add
  // @param pulsing  Whether or not the dot is pulsing
  
  export function addDotToMap(colour, pulsing, name) {
    const map = window.map
    let size = 150;
  
    if (pulsing == false) {
      size = size / 2
    }
  
    // White fill by default
    let centerFill = 'rgba(255, 255, 255, 1)';
      
    if (colour == 'green') {
      centerFill = 'rgba(100, 255, 100, 1)';
    } else if (colour == 'red') {
      centerFill = 'rgba(255, 100, 100, 1)';
    }
   
    // This implements `StyleImageInterface`
    // to draw a dot icon on the map.
    const dot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
      
      // When the layer is added to the map,
      // get the rendering context for the map canvas.
      onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },
      
      // Call once before every frame where the icon will be used.
      render: function () {
        const duration = 2000;
        const t = (performance.now() % duration) / duration;
        
        let radius = (size / 2) * 0.3;
        const context = this.context;
        
        // Draw the outer circle. If not pulsing, dont
        if (pulsing) {
          const outerRadius = (size / 2) * 0.7 * t + radius;
          
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );
          if (colour == 'green') {
            context.fillStyle = `rgba(200, 255, 200, ${1 - t})`;
          } else {
            context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
          }
          context.fill();
        } else {
          radius = size * 0.3;
        }
    
        // Draw the inner circle.
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          radius,
          0,
          Math.PI * 2
        );
        context.fillStyle = centerFill;
        context.strokeStyle = 'white';
        context.fill();
        
        if (pulsing) {
          context.lineWidth = 2 + 4 * (1 - t); 
        } else {
          context.lineWidth = 2;
        }
        context.stroke();
        // Update this image's data with data from the canvas.
        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;
        
        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        map.triggerRepaint();
        
        // Return `true` to let the map know that the image was updated.
        return true;
      }
      
    };
  
    map.addImage(name, dot, { pixelRatio: 2 });
  }
  
export function addCheveronToMap(colour, name){
    const map = window.map
    let size = 80;
    // White fill by default
    let centerFill = 'rgba(255, 255, 255, 1)';
      
    if (colour == 'green') {
      centerFill = 'rgba(100, 255, 100, 1)';
    } else if (colour == 'red') {
      centerFill = 'rgba(255, 100, 100, 1)';
    }
   
    const cheveron = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
      
      // When the layer is added to the map,
      // get the rendering context for the map canvas.
      onAdd: function () {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },
      
      // Call once before every frame where the icon will be used.
      render: function () {
        // Draw the chevron
   
        this.context.beginPath();
        this.context.moveTo(this.width/2, 0); // Starting point
        // Draw the top part of the chevron
        this.context.lineTo((this.width/2)+20, 30);
        this.context.lineTo((this.width/2)+20, 50);
        this.context.lineTo(this.width/2, 35);
        // Draw the bottom part of the chevron
        this.context.lineTo((this.width/2)-20, 50);
        this.context.lineTo((this.width/2)-20, 30);
        // Close the path to connect the last point with the first
        this.context.closePath();
        // Close the path to connect the last point with the first
        this.context.closePath();
        this.context.fillStyle = centerFill;
        this.context.fill(); // Fill the shape with the chosen color
  
        // Update this image's data with data from the canvas.
        this.data = this.context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;
        
        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        map.triggerRepaint();
        
        // Return `true` to let the map know that the image was updated.
        return true;
      }
    };
    map.addImage(name, cheveron, { pixelRatio: 2 });
  }

export function addWindBarbToMap(magnitude, direction, index){
    const map = window.map
    let size = 400;
  
    const windBarb = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
      
      // When the layer is added to the map,
      // get the rendering context for the map canvas.
      onAdd: function () {
        const canvas = document.createElement('canvas');
        console.log(canvas)
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },
       render: function () {
        const duration = 2000;
        const t = (performance.now() % duration) / duration;
        
        const context = this.context;
        // Draw wind barbs
        addWindBarb(magnitude, direction, context, this.width, this.height);
  
        this.data = context.getImageData(
          0,
          0,
          this.width,
          this.height
        ).data;
  
        map.triggerRepaint();
        
        // Return `true` to let the map know that the image was updated.
        return true;
      } 
    };
  
    map.addImage('wind-barb-'+index, windBarb, { pixelRatio: 2 });
  
    console.log('Added Wind Barb')
  }
  
export function addSourceToMap(sourceName, source){
    const map = window.map;
        
    console.log(window.mapLoaded)
  
    // Add source to map, if it hasn't loaded then add a listener to do it on load.
    if (window.mapLoaded){
        map.on('styledata', () => {
            map.addSource(sourceName, source)
            console.log("Added source.")
        })
    } else {
      map.on('load', () => {
        map.addSource(sourceName, source)
        console.log("Added source to be loaded.")
      })
    }
  }
  
export function addLayerClickListener(layerId) {
    const map = window.map
    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', layerId, (e) => {
      // Copy coordinates array.
      // Picking the last element because I'm drawing them backwards
      const lastEl = e.features.length - 1
      const coordinates = e.features[lastEl].geometry.coordinates.slice();
      const description = e.features[lastEl].properties.description;
      const popupColour = e.features[lastEl].properties.popupColour;
      const properties = e.features[lastEl].properties
      
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
  
      // Raise event immediately
      const event = new CustomEvent('popupButtonClick', { detail: properties });
      document.dispatchEvent(event);
    });
  }
  
export function addLayerToMap(layer, clickable) {
    const map = window.map;
  
    if (clickable) {
      // Change the cursor to a pointer when the mouse is over the places layer.
      map.on('mouseenter', layer.id, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
    
      // Change it back to a pointer when it leaves.
      map.on('mouseleave', layer.id, () => {
        map.getCanvas().style.cursor = '';
      });
      addLayerClickListener(layer.id)
    }
  
    if (window.mapLoaded) {
        map.on('styledata', () => {
            map.addLayer(layer)
            console.log("Added layer.")
        })
    } else {
      map.on('load', () => {
        map.addLayer(layer)
        console.log("Added layer to be loaded.")
      })
    }
  }
  
export function removeSource(source){
    const map = window.map;
  
    if (window.mapLoaded) {
      map.removeSource(source)
      console.log("Removed source.")
    } else {
      map.on('load', () => {
        map.removeSource(source)
        console.log("Removed source to be loaded.")
      })
    }
  }
  
  
export function removeLayer(layer){
    const map = window.map;
    
    if (window.mapLoaded) {
      map.removeLayer(layer)
      console.log("Removed layer.")
    } else {
      map.on('load', () => {
        map.removeLayer(layer)
        console.log("Removed layer to be loaded.")
      })
    }
  }
  
export function setBounds(coords1, coords2) {
    const map = window.map
  
    if (window.mapLoaded) {
      map.fitBounds([coords1, coords2], {
          'padding': 0
      })
      console.log("Set bounds.")
    } else {
      map.on('load', () => {
        map.fitBounds([coords1, coords2], {
          'padding': 100
        })
        console.log("Set bounds for load.")
      })
    }
  }
  
  // Function to convert degrees to radians
export function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }
  
  function addWindBarb(magnitude, direction, context, width, height){
    // Convert to knots
    magnitude /= 1.852 
    // Call the drawWindBarb function with wind direction and speed values
    drawWindBarb(context, width, height, direction, magnitude); // Example values (45 degrees wind from north, 20 knots wind speed)
  }
  
  // Function to draw a wind barb
  
export function drawWindBarb(ctx, width, height, direction, speed){
   // Get the canvas and 2d drawing context
    //var ctx = canvas.getContext("2d");
  
    // Define the line's starting point
    var startX = width/2;
    var startY = height/2;
  
    // Define the length of the line
    var lineLength = 50;
  
    // Define the rotation angle in degrees
    var angleInDegrees =  270+direction; // Adjust the rotation angle as needed
  
    // Calculate the endpoint of the line
    var endX = startX + lineLength * Math.cos((angleInDegrees * Math.PI) / 180);
    var endY = startY + lineLength * Math.sin((angleInDegrees * Math.PI) / 180);
  
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // A triangle for speeds of 50 knots or greater
    if(speed >= 50){
  
      // Calculate the equilateral triangle's coordinates
      var triangleSize = 60; // Adjust the size of the equilateral triangle
  
      // Calculate the position of the triangle's first vertex
      var triangleX1 = endX;
      var triangleY1 = endY;
  
      // Calculate the position of the triangle's second vertex
      var triangleX2 = triangleX1 + (lineLength / 6) * Math.cos((angleInDegrees * Math.PI) / 180);
      var triangleY2 = triangleY1 + (lineLength / 6) * Math.sin((angleInDegrees * Math.PI) / 180);
  
      // Calculate the position of the third vertex of the equilateral triangle
      var triangleX3 = triangleX2 - (triangleSize / 2) * Math.cos(((angleInDegrees + 65) * Math.PI) / 180);
      var triangleY3 = triangleY2 - (triangleSize / 2) * Math.sin(((angleInDegrees + 65) * Math.PI) / 180);
  
      // Draw the equilateral triangle
      ctx.beginPath();
      ctx.moveTo(triangleX1, triangleY1);
      ctx.lineTo(triangleX2, triangleY2);
      ctx.lineTo(triangleX3, triangleY3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      var remainder = speed - 50;
      var fullBarbs = Math.floor(remainder / 10);
        // Calculate the number of half barbs
      var halfBarbs = Math.floor((remainder % 10) / 5);
    }
    else{
      var fullBarbs = Math.floor(speed / 10);
          // Calculate the number of half barbs
      var halfBarbs = Math.floor((speed % 10) / 5);
    }
    
    let total = fullBarbs+halfBarbs
    // Increments and positions
    let increment = 5;
    
    if(total == 4){
      var pos = 25;
    }
    else if(total == 3){
      pos = 15;
    }
    else if(total == 2){
      pos = 10;
    }
    else{
      pos = 10;
    }  
    
    // Draw full barbs
    for(let i=0; i<fullBarbs;i++){
      
      // Wind barbs
      // Draw a small line at a 45-degree angle at the start of the first line
      const fullBarbLength = 20;
  
      windBarb(ctx, fullBarbLength, lineLength, endX, endY, pos, angleInDegrees);
      pos -= 3;
    }
    
    // Draw full barbs
    for(let i=0; i<halfBarbs;i++){  	
      // Wind barbs
      // Draw a small line at a 45-degree angle at the start of the first line
      const halfBarbLength = 10;
    
      windBarb(ctx, halfBarbLength, lineLength, endX, endY, pos, angleInDegrees)
          
      pos -= 3;
    }
    
  }
  
export function windBarb(ctx, barbLength, lineLength, endX, endY, pos, dirAngle){
      
    var barbStartX = endX - (lineLength * (1/pos)) * Math.cos((dirAngle * Math.PI) / 180);
    var barbStartY = endY - (lineLength * (1/pos)) * Math.sin((dirAngle * Math.PI) / 180);
  
    // Special angles
    if(dirAngle == 0 || dirAngle == 180 || dirAngle == 360){
      var barbEndX = barbStartX - barbLength * Math.cos((dirAngle * Math.PI) / 180);
      var barbEndY = barbStartY - barbLength * Math.cos((dirAngle * Math.PI) / 180);
     
    }
    else if(dirAngle == 90 || dirAngle == 270){
      var barbEndX = barbStartX + barbLength * Math.sin((dirAngle * Math.PI) / 180);
      var barbEndY = barbStartY - barbLength * Math.sin((dirAngle * Math.PI) / 180);
    }
    else if(dirAngle < 180 && dirAngle > 90){
      var barbEndX = barbStartX + barbLength * Math.sin((dirAngle * Math.PI) / 180);
      var barbEndY = barbStartY - barbLength * Math.cos((dirAngle * Math.PI) / 180);
    }
    else if(dirAngle < 90){
      var barbEndX = barbStartX + barbLength * Math.sin((dirAngle * Math.PI) / 180);
      var barbEndY = barbStartY - barbLength * Math.sin((dirAngle * Math.PI) / 180);
    }
    else if(dirAngle >200){
      var barbEndX = barbStartX + barbLength * Math.sin((dirAngle * Math.PI) / 180);
      var barbEndY = barbStartY - barbLength * Math.cos((dirAngle * Math.PI) / 180);
    }
  
    ctx.beginPath();
    ctx.moveTo(barbStartX, barbStartY);
    ctx.lineTo(barbEndX, barbEndY);
    ctx.stroke();  
    
  }
  
export function filterMap(devices, mapFilter) {
    setTimeout(500)
    // Remove wind barbs
    //removeWindBarbOnFilter();
    const map = window.map;
  
    // Filter on all devices
    devices.forEach(function(device) {
      console.log(device)
      if(device[0] !== 'Test Device'){    
        map.setFilter(device[1][0]+'-main-layer', mapFilter);
        let recentLayer = map.getLayer(device[1][0]+'-recent-layer');
        let recentLayerFilter = map.getFilter(device[1][0]+'-recent-layer')
        console.log(recentLayerFilter, device)
        // If recent layer filter only has more than 1 item, remove it
        if(recentLayerFilter.length > 2){
          recentLayerFilter.pop()
        }
        recentLayerFilter.push(mapFilter);
        map.setFilter(device[1][0]+'-recent-layer', recentLayerFilter);
        // Add pulsing image back in
        map.setLayoutProperty(device[1][0]+'-recent-layer', 'icon-image', ['concat', 'pulsing-', ['get', 'image']]);
  
        // Line layer
        const filteredFeatures = map.querySourceFeatures(device[1][0]+'-points', {
          filter: mapFilter // Use the filter you applied to the feature layer
        });
        if(device[1][1].includes('pipeclam')){
          var filteredCoordinates = filteredFeatures.map(feature => {
            return [feature.properties['gps_lng'], feature.properties['gps_lat']];
          });
        }
  
        else{
          filteredCoordinates = filteredFeatures.map(feature => {
            return feature.geometry.coordinates;
          });
        }
           
        var lineLayer = map.getLayer(device[1][0]+'-linestring-layer');
        
        // Get the source of the LineString layer
        var source = map.getSource(device[1][0]+'-linestring');
      
        // Get the source data
        var data = source._data; // This is the GeoJSON data of the source
  
        // Data Clam
        data.geometry.coordinates = filteredCoordinates
        // Update the source data with the new coordinates
        source.setData(data);
  
      }
    });
  }
  
  /* Show everything on the map per device */
export function showAllMap(devices) {
    const map = window.map;
    const dateNow = new Date();
    const timestamp = Math.floor(dateNow / 1000);
  
    const mapFilter = ['<=', ['get', 'gps_time'], timestamp];
    filterMap(devices, mapFilter)
  }
  
export function sliderFilter(sliderLevel, devices, startTime, init){
    if(init){
      removeWindBarbOnFilter()
    }
    let dateNow = new Date(startTime * 1000);
    // Set date to slider value
    dateNow.setHours(dateNow.getHours() - sliderLevel);
    let timestamp = Math.floor(dateNow / 1000);
  
    const mapFilter = ['>=', ['get', 'gps_time'], timestamp];
    filterMap(devices, mapFilter)
  }
  
export function removeWindBarbOnFilter(){
    const map = window.map;
    const style = map.getStyle();
    if (style && style.layers) {
      style.layers.forEach((layer) => {
        if (layer.id.includes('windbarb')) {
          map.removeLayer(layer.id);
        }
      });
    }
  }
  
export function printMap() {
    const style = window.map.getStyle();
    console.log(style.layers, style.sources);
}
  
  
export function removeMap(){
    window.location.reload();
}

// Load the map
export function loadPipeclamMessagesOntoMap(messages, deviceGuid) {
    var bestTime = [0, 0, 0, 0];
    
    // Earliest and Latest messages for plotting opacities
    const earliestMessage = messages[0]['15_min']['gps_time'];
    const latestMessage = messages[messages.length - 1]['30_min']['gps_time'];

    const features = [];
    const lineStringCoordinates = [];

    for (let idx = 0; idx < messages.length; idx++) {
        const message = messages[messages.length - 1 - idx];
        const generalInfo = message['general'];
        const minute15 = message['15_min'];
        const minute30 = message['30_min'];

        if (minute15['gps_time'] > bestTime[0]) {
            bestTime[0] = minute15['gps_time'];
            bestTime[1] = idx + '-15_min';
            bestTime[2] = minute15['gps_lat'];
            bestTime[3] = minute15['gps_lng'];
        }

        if (minute30['gps_time'] > bestTime[0]) {
            bestTime[0] = minute30['gps_time'];
            bestTime[1] = idx + '-30_min';
            bestTime[2] = minute30['gps_lat'];
            bestTime[3] = minute30['gps_lng'];
        }

        const coordinates = [
            [message['15_min']['gps_lng'], message['15_min']['gps_lat']],
            [message['30_min']['gps_lng'], message['30_min']['gps_lat']]
        ];

        const messageType = generalInfo['message_type'];
        const messageColour = messageType === 'pipeclam_long' ? 'green' : 'red';

        minute15['message_type'] = messageColour;

        let image;
        if (minute15['gps_heading'] < Math.pow(2, 16) - 1) {
        image = messageColour + '-chevron';
        } else {
        image = messageColour + '-dot';
        }

        const min15Feature = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinates[0]
            },
            properties: {
                index: idx + '-15_min',
                'sort-key': messages.length - idx,
                image: image,
                popupColour: messageColour,
                general: generalInfo,
                rotation: minute15['gps_heading'],
                ...minute15
            }
        };

        minute30['message_type'] = messageColour;

        if (minute30['gps_heading'] < Math.pow(2, 16) - 1) {
        image = messageColour + '-chevron';
        } else {
        image = messageColour + '-dot';
        }

        const min30Feature = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coordinates[1]
            },
            properties: {
                index: idx + '-30_min',
                'sort-key': messages.length - idx,
                image: image,
                popupColour: messageColour,
                general: generalInfo,
                rotation: minute30['gps_heading'],
                ...minute30
            }
        };

        features.push(min15Feature);
        features.push(min30Feature);
        lineStringCoordinates.push(coordinates[0]);
        lineStringCoordinates.push(coordinates[1]);
    }

    const lineStringSource = {
        type: 'geojson',
        lineMetrics: true,
        data: {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: lineStringCoordinates
        }
        }
    };

    const mainSource = {
        type: 'geojson',
        data: {
        type: 'FeatureCollection',
        features: features
        }
    };

    addSourceToMap(deviceGuid + '-linestring', lineStringSource);
    addSourceToMap(deviceGuid + '-points', mainSource);

    const currentDatetime = new Date();
    const threeDaysAgo = new Date(currentDatetime - 3 * 24 * 60 * 60 * 1000); // 5 days in milliseconds
    const unixTimestamp = threeDaysAgo.getTime() / 1000; // Convert to seconds

    const lineStringLayer = {
        id: deviceGuid + '-linestring-layer',
        type: 'line',
        source: deviceGuid + '-linestring',
        layout: {
        'line-join': 'round',
        'line-cap': 'round'
        },
        paint: {
        'line-color': '#888',
        'line-width': 8,
        'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0, 'rgba(128, 128, 128, 1)',
            1, 'rgba(128, 128, 128, 0.2)'
        ]
        }
    };

    addLayerToMap(lineStringLayer, false);

    const mainLayer = {
        id: deviceGuid + '-main-layer',
        type: 'symbol',
        source: deviceGuid + '-points',
        layout: {
        'icon-image': ['get', 'image'],
        'icon-rotate': ['get', 'rotation'],
        'icon-allow-overlap': true,
        'symbol-sort-key': ['get', 'sort-key']
        },
        paint: {
        'icon-opacity': ['interpolate', ['linear'], ['get', 'gps_time'], earliestMessage, 0.2, latestMessage, 1]
        }
    };

    const recentLayer = {
        id: deviceGuid + '-recent-layer',
        type: 'symbol',
        source: deviceGuid + '-points',
        filter: ['all', ['==', ['get', 'index'], bestTime[1]]],
        layout: {
        'icon-image': ['concat', 'pulsing-', ['get', 'image']],
        'icon-rotate': ['get', 'rotation'],
        'icon-allow-overlap': true
        }
    };

    addLayerToMap(recentLayer, false);
    addLayerToMap(mainLayer, true);
}
