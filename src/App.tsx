import React, {useCallback, useEffect, useState} from 'react';
import {Map, MODES} from "./components/Map";
import {useJsApiLoader} from "@react-google-maps/api";
import {AutoComplete} from "./components/AutoComplete";

import s from './app.module.css'
import {defaultCenter, getBrowserLocation} from "./utils/geo";

const API_KEY = process.env.REACT_APP_API_KEY;
export type DefaultCenterType = { lat:number, lng:number }



type LibrariesType =  "places" | "drawing" | "geometry" | "localContext" | "visualization";
const libraries:LibrariesType[]  = ['places'];

function App() {
  const [center, setCenter] = useState<DefaultCenterType>(defaultCenter);
  const [mode, setMode] = useState(MODES.MOVE);
  const [markers, setMarkers] = useState([]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${API_KEY}`,
    libraries
  })

  const onPlaceSelect = useCallback((coordinates: DefaultCenterType) => {
    setCenter(coordinates)
  },[])

  const onMarkerAdd = useCallback((coordinates: any) => {
    // @ts-ignore
    setMarkers([...markers, coordinates]);
  },[markers])

  const clearMarkers = useCallback(() => {
    setMarkers([]);
  },[])

  const toggleMode = useCallback( () => {
    switch (mode) {
      case MODES.MOVE:
        setMode(MODES.SET_MARKER);
        break;
      case MODES.SET_MARKER:
        setMode(MODES.MOVE);
        break;
      default: setMode(MODES.MOVE);
    }
    console.log('mode', mode);
  },[mode]);

  //переместимся к текущей координате пользователя
  useEffect(() => {
    getBrowserLocation()
        .then((curLoc) => {
          setCenter(curLoc);
        })
        .catch((defLoc) => {
          setCenter(defLoc);
        })
  },[])

  return (
    <div>
      <div className={s.addressSearchContainer}>
        <AutoComplete isLoaded={isLoaded} onSelect={onPlaceSelect} />
        <button onClick={toggleMode} className={s.modeToggle}>Set markers</button>
        <button onClick={clearMarkers} className={s.modeToggle}>Clear</button>
      </div>
      {isLoaded ? <Map
          markers={markers} mode={mode} center={center}
          onMarkerAdd={onMarkerAdd}
          />
          : <div>Loading ...</div>}
    </div>
  );
}

export default App;
