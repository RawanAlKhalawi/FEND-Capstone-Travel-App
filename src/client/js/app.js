
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
const username = '&username=' + "rawanalkhalawi";
const weatherBitURL = 'https://api.weatherbit.io/v2.0/forecast/daily?city=';
const weatherBitKey = '&key=aafbf3c5251f4467b08422ae258da8e2';
const pixabayURL = 'https://pixabay.com/api/?key=' + "17002099-7aee7153096e0f607f59fc104";

function handleSubmit(event) {

    event.preventDefault()
    const city = document.getElementById('city').value;


    getGeoNames(geoNamesURL + city + username)
        .then(function (geoResult) {
            postData('http://localhost:3000/addData', {
                latitude: geoResult.geonames[0].latitude,
                longitude: geoResult.geonames[0].longitude,
                country: geoResult.geonames[0].country,
            })
            getWeatherBit(weatherBitURL + city + weatherBitKey)
                .then(function (webitResult) {
                    postData('http://localhost:3000/addData', {
                        high: webitResult.data[0].high,
                        low: webitResult.data[0].low,

                    })

                })

            getPixabay(pixabayURL + "&q=" + city + "&image_type=photo")
                .then(function (imageurl) {
                    postData('http://localhost:3000/addData', {
                        'Image': imageurl
                    })
                    updateUI(imageurl)
                }).catch((error) => {
                    console.log('Error:', error);
                })

        });


}


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

const getWeatherBit = async (weatherBitURL) => {
    const res = await fetch(weatherBitURL);
    try {
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error:', error);
    }
}

const getPixabay = async (pixabayURL) => {
    const res = await fetch(pixabayURL);
    try {
        let pixaImage = await res.json();
        const imageurl = pixaImage.hits[0].webformatURL;
        return imageurl;
    } catch (error) {
        console.log('Error:', error);
    }
}

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