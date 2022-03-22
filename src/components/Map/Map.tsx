import {GoogleMap, Marker} from "@react-google-maps/api"
import React, {useCallback, useRef} from "react";
import s from './Map.module.css'
import {defaultTheme} from "./Theme";
import {CurrentLocationMarker} from "../CurrentLocationMarker";
import {MarkerMy} from "../Marker";


const containerStyle = {
    width: '100%',
    height: '100%'
};

export const MODES = {
    MOVE: 0,
    SET_MARKER: 1,
}


const defaultOptions = {
    panControl: true,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    clickableIcons: false,
    keyboardShortcuts: false,
    scrollwheel: true, //масштаб колесиком
    disableDoubleClickZoom: false,
    fullscreenControl: false,
    styles: defaultTheme //кастомизированная тема
}

export const Map = ({mode, center, markers,onMarkerAdd}:
                        {mode: any, center: any, markers: any, onMarkerAdd:any }) => {
    //храним ссылку на карту чтобы постоянно карта не перезагружалась
    const mapRef = useRef(undefined)

    const onLoad = React.useCallback(function callback(map) {
        mapRef.current = map;
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        mapRef.current = undefined; //чтобы не было утечок памяти
    }, []);

    const onClickHandler = useCallback((loc:any) => {
        if(mode === MODES.SET_MARKER) {
            //получаем координаты
            const lat = loc.latLng.lat();
            const lng = loc.latLng.lng();
            onMarkerAdd({lat, lng});
        }
    },[mode, onMarkerAdd]);

    return (
        <div className={s.container}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={defaultOptions}
                onClick={onClickHandler}
            >{//стандартный маркер <Marker position={center} />
                }
               <CurrentLocationMarker position={center} />
                {
                    markers.map((pos: any) => {
                        console.log(pos, 'pos')
                        // @ts-ignore
                        return <Marker key={Math.random()} position={pos} />
                    })
                }
            </GoogleMap>
        </div>
    )
}