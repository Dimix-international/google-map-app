import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import s from './AutoComplete.module.css'
import React, {useEffect} from "react";
import {DefaultCenterType} from "../../App";

type AutoCompleteType = {
    isLoaded:boolean
    onSelect:(coordinate: DefaultCenterType) => void //перемещение карты к веденному метсу
}

// AutoComplete - позволяет искать населенные пункты, дом, улицы но адрес конвертируем в координаты
//функция  getGeocode - она конвертирует описание в координаты
// поэтому в cloudPlatform необходим Geocoding API

export const AutoComplete:React.FC<AutoCompleteType> = React.memo( (props) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        init,
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        initOnMount:false, //чтобы не загрузил библиотеку - добавить тег script
        debounce: 300,
    });

    const { isLoaded, onSelect } = props;

    const ref = useOnclickOutside(() => {
        // When user clicks outside of the component, we can dismiss
        // the searched suggestions by calling this method
        clearSuggestions();
    });

    const handleInput = (e:any) => {
        // Update the keyword of the input element
        setValue(e.target.value);
    };

    const handleSelect =
        ({ description }:{ description:string }) =>
            () => {
                // When user selects a place, we can replace the keyword without request data from API
                // by setting the second parameter to "false"
                setValue(description, false);
                clearSuggestions();
                console.log(description)
                // Get latitude and longitude via utility functions
                getGeocode({ address: description })
                    .then((results) => getLatLng(results[0]))
                    .then(({ lat, lng }) => {
                        console.log("📍 Coordinates: ", { lat, lng });
                        onSelect({ lat, lng });
                    })
                    .catch((error) => {
                        console.log("😱 Error: ", error);
                    });
            };

    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li className={s.listItem} key={place_id} onClick={handleSelect(suggestion)}>
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });

    useEffect(() => {
        isLoaded && init(); //можем искать, когда библиотека будет загружена
    },[isLoaded, init])

    return (
        <div className={s.root} ref={ref}>
            <input
                value={value}
                className={s.input}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Where are you going?"
            />
            {/* We can use the "status" to decide whether we should display the dropdown or not */}
            {status === "OK" && <ul className={s.suggestion}>{renderSuggestions()}</ul>}
        </div>
    )
})