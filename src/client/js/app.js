
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
const username = '&username=' + "rawanalkhalawi";
const weatherBitURL = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const weatherBitKey = '&key=aafbf3c5251f4467b08422ae258da8e2';
const pixabayURL = 'https://pixabay.com/api/?key=' + "17002099-7aee7153096e0f607f59fc104";
const submit = document.getElementById('submit')

document.addEventListener('DOMContentLoaded', function () {
    submit.addEventListener('click', handleSubmit);
});

//main function
function handleSubmit(event) {

    event.preventDefault()
    const city = document.getElementById('city').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    getGeoNames(geoNamesURL + city + username)
        .then(function (geoResult) {

            getWeatherBit(geoResult.geonames[0].lat, geoResult.geonames[0].lng, startDate, endDate)
                .then(function (webitResult) {



                    getPixabay(pixabayURL + "&q=" + city + "&image_type=photo")
                        .then(function (image) {
                            postData('http://localhost:3000/addData', {
                                'Image': image,
                                high: webitResult.data[0].max_temp,
                                low: webitResult.data[0].low_temp,
                                latitude: geoResult.geonames[0].lat,
                                longitude: geoResult.geonames[0].lng,
                                country: geoResult.geonames[0].countryName,
                            })
                            updateUI(image);

                        })

                });
        })


}

//function to get data from geonames
const getGeoNames = async (geoNamesURL) => {
    const res = await fetch(geoNamesURL);
    try {

        const data = await res.json();
        console.log(data);

        return data;
    } catch (error) {
        console.log('Error:', error);
    }
}

//function to get data from WeatherBit
const getWeatherBit = async (latitude, longitude, startDate, endDate) => {
    const res = await fetch(weatherBitURL + "&lat=" + latitude + "&lon=" + longitude + "&start_date=" + startDate + "&end_date=" + endDate + "&units=I" + weatherBitKey);
    try {
        const data = await res.json();
        console.log(data);
        return data;

    } catch (error) {
        console.log('Error:', error);
    }
}

//function to get image from Pixabay
const getPixabay = async (pixabayURL) => {
    const res = await fetch(pixabayURL);
    try {
        let pixa = await res.json();
        const image = pixa.hits[0].webformatURL;
        return image;

    } catch (error) {
        console.log('Error:', error);
    }
}

//function to update page
const updateUI = async (imageurl) => {
    const request = await fetch('http://localhost:3000/all');

    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.round(Math.abs((start - end) / 86400000));

    try {
        const allData = await request.json();


        document.getElementById('duration').innerHTML = days;
        document.getElementById('country').innerHTML = allData.country;
        document.getElementById('latitude').innerHTML = allData.latitude;
        document.getElementById('longitude').innerHTML = allData.longitude;
        document.getElementById('high').innerHTML = allData.high;
        document.getElementById('low').innerHTML = allData.low;
        document.getElementById('pixa').setAttribute('src', imageurl);

    }
    catch (error) {
        console.log('error', error);
    }
}

//Post
const postData = async (url = '', data = {}) => {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    try {
        const newData = await res.json();
        console.log(newData);
        return newData
    } catch (error) {
        console.log("error", error);

    }
}

export { handleSubmit }