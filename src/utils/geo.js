
export const defaultCenter = {
    lat: 52.4345,
    lng: 30.9754,
};
//определение текущ координаты пользователя
export const getBrowserLocation = () => {
    return new Promise ((resolve, reject) => {
        if('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const {latitude:lat, longitude:lng} = pos.coords;
                    resolve({lat, lng});
                },
                () => {
                    reject(defaultCenter);
                },
            );
        } else {
            reject(defaultCenter);
        }
    })
}