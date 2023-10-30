import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const KEY = import.meta.env.VITE_MAP_API_KEY
const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: 53.380070,
  lng: -1.473830
};

function MapAPI() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDx1WcewWwmA_8lIMy_GajHIAxehT-w3QQ',
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
  ) : <></>
}

export default MapAPI;