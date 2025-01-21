<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Выбор города</title>
    <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
    <script>
        // Telegram WebApp объект
        const tg = window.Telegram.WebApp;

        ymaps.ready(function () {
            const map = new ymaps.Map("map", {
                center: [55.76, 37.64], // Координаты Москвы по умолчанию
                zoom: 5
            });

            let placemark;

            // Событие клика по карте
            map.events.add('click', function (e) {
                const coords = e.get('coords');

                // Если уже есть метка, перемещаем её
                if (placemark) {
                    placemark.geometry.setCoordinates(coords);
                } else {
                    // Создаем новую метку
                    placemark = new ymaps.Placemark(coords, {
                        hintContent: 'Выбранное место'
                    });
                    map.geoObjects.add(placemark);
                }

                // Отправка данных в Telegram WebApp
                tg.MainButton.text = "Подтвердить выбор";
                tg.MainButton.show();

                tg.onEvent('mainButtonClicked', function () {
                    tg.sendData(JSON.stringify({ city_coords: coords })); // Отправка данных
                });
            });
        });
    </script>
</head>
<body>
    <div id="map" style="width: 100%; height: 100vh;"></div>
</body>
</html>
