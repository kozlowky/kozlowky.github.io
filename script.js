// let tg = window.Telegram.WebApp; //получаем объект webapp телеграма 
tg.expand(); //расширяем на все окно

let fromCity = null; // Для хранения города отправки
let toCity = null; // Для хранения города доставки
let fromMarker = null; // Маркер для города отправки
let toMarker = null; // Маркер для города доставки

// Инициализация карты
ymaps.ready(init);

function init() {
    const myMap = new ymaps.Map("map", {
        center: [55.76, 37.64], // Москва по умолчанию
        zoom: 5,
        controls: []
    }, {
        suppressMapOpenBlock: true,
    });

    // Центрирование поиска по текущему положению карты
    const searchControl = new ymaps.control.SearchControl({
        options: {
            float: 'right',
            provider: 'yandex#map',
            size: 'large',
            useMapBounds: true // Используем текущие границы карты для поиска
        }
    });
    myMap.controls.add(searchControl);

    // Обработчик выбора города на карте через поиск
    searchControl.events.add('resultselect', (e) => {
        const index = e.get('index');
        searchControl.getResult(index).then((res) => {
            const coords = res.geometry.getCoordinates();
            const name = res.properties.get('name');

            // Добавляем маркер на выбранное место
            if (!fromCity) {
                fromCity = { coords, name };
                document.getElementById('from-city').value = name;
                fromMarker = new ymaps.Placemark(coords, {
                    balloonContent: name
                }, {
                    preset: 'islands#blueIcon' // Синий маркер для города отправки
                });
                myMap.geoObjects.add(fromMarker);
            } else if (!toCity) {
                toCity = { coords, name };
                document.getElementById('to-city').value = name;
                toMarker = new ymaps.Placemark(coords, {
                    balloonContent: name
                }, {
                    preset: 'islands#greenIcon' // Зеленый маркер для города доставки
                });
                myMap.geoObjects.add(toMarker);
            }

            // Если оба города выбраны, активируем кнопку
            if (fromCity && toCity) {
                document.getElementById('done-button').disabled = false;
            }
        });
    });

    // Обработчик клика по карте для выбора города
    myMap.events.add('click', function (e) {
        const coords = e.get('coords');
        const geoCoder = ymaps.geocode(coords);
        geoCoder.then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            let name = 'Неизвестный город'; // Значение по умолчанию
            if (firstGeoObject) {
                // Получаем только города или административные области
                const locality = firstGeoObject.getLocalities();
                const administrativeArea = firstGeoObject.getAdministrativeAreas();
                name = locality.length ? locality.join(', ') : administrativeArea.join(', ');
            }

            // Добавляем маркер на выбранное место
            if (!fromCity) {
                fromCity = { coords, name };
                document.getElementById('from-city').value = name;
                fromMarker = new ymaps.Placemark(coords, {
                    balloonContent: name
                }, {
                    preset: 'islands#blueIcon' // Синий маркер для города отправки
                });
                myMap.geoObjects.add(fromMarker);
            } else if (!toCity) {
                toCity = { coords, name };
                document.getElementById('to-city').value = name;
                toMarker = new ymaps.Placemark(coords, {
                    balloonContent: name
                }, {
                    preset: 'islands#greenIcon' // Зеленый маркер для города доставки
                });
                myMap.geoObjects.add(toMarker);
            }

            // Если оба города выбраны, активируем кнопку
            if (fromCity && toCity) {
                document.getElementById('done-button').disabled = false;
            }
        });
    });
}

// Обработчик клика на кнопку "Отправить"
document.getElementById('done-button').addEventListener('click', () => {
    if (fromCity && toCity) {
        const payload = JSON.stringify({ from: fromCity, to: toCity });
        // Здесь вы можете отправить данные в другой файл или API
        alert("Данные отправлены: " + payload);
    } else {
        alert("Пожалуйста, выберите оба города.");
    }
});

// Добавляем обработчики для крестиков (сброс значений в полях)
document.getElementById('clear-from-city').addEventListener('click', () => {
    fromCity = null;
    document.getElementById('from-city').value = '';
    if (fromMarker) {
        fromMarker.geometry.setCoordinates([0, 0]); // Удаляем маркер
        fromMarker = null;
    }
    document.getElementById('done-button').disabled = true;
});

document.getElementById('clear-to-city').addEventListener('click', () => {
    toCity = null;
    document.getElementById('to-city').value = '';
    if (toMarker) {
        toMarker.geometry.setCoordinates([0, 0]); // Удаляем маркер
        toMarker = null;
    }
    document.getElementById('done-button').disabled = true;
});
