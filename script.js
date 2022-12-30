const apiKey = '08823c6a4b3b1dc99b1f2fe807a11809';
const store = {
  city: 'Minsk',
};

const button = document.querySelector('.header_button');
const form = document.querySelector('.form');
const wrapper = document.querySelector('.wrapper');
const input = document.querySelector('.header_inputText');
const weekWeather = document.querySelector('.weekWeather');
const requestValues = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
let arr = [];
const prevRequest = document.querySelector('.prevRequest');
const temp = document.querySelector('.temp');
const city = document.querySelector('.city');
const wethDescription = document.querySelector('.wethDescription');
const img = document.querySelector('.imgWeather');
const cloudcover = document.querySelector('.cloudcover');
const pressure = document.querySelector('.pressure');
const humidity = document.querySelector('.humidity');
const visibility = document.querySelector('.visibility');
const wind = document.querySelector('.wind');
const feelsLike = document.querySelector('.feelsLike');
const subInfo = document.querySelector('.subInfo');
const requests = document.querySelector('.requests');

const fetchData = async () => {
  try {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${store.city}&appid=${apiKey}&units=metric`);
    const data = await result.json();

    // FIXME: Одна карточка!
    function currentlyWeather() {
      temp.innerHTML = `${Math.round(data.list[0].main.temp)}°`;
      pressure.innerHTML = `${data.list[0].main.pressure}mbar`;
      humidity.innerHTML = `${data.list[0].main.humidity}%`;
      cloudcover.innerHTML = `${data.list[0].clouds.all}%`;
      visibility.innerHTML = `${data.list[0].visibility}m`;
      wind.innerHTML = `${(data.list[0].wind.speed.toFixed(1))}m/s`;
      feelsLike.innerHTML = `${Math.round(data.list[0].main.feels_like)}°`;
      city.innerHTML = `<span>Weather today in:</span>
        ${data.city.name}`;

      for (const elem of data.list[0].weather) {
        wethDescription.innerHTML = elem.description.split('.')
          .map((elem) => (elem.replace(elem[0], elem[0].toUpperCase())))
          .join('');
        img.setAttribute('src', `http://openweathermap.org/img/wn/${elem.icon.replace('n', 'd')}@2x.png`);
        wethDescription.append(img);
      }
    }
    currentlyWeather();

    //= =====================================================================================================================================================

    function weatherForWeek() {
      const DAY_MILSEC = 24 * 60 * 60 * 1000;
      const todayDate = new Date().getTime();

      // TODO: с 00 до 12 (от 0 до 5), с 12 до 00:00(c 1 по 6)
      try {
        for (let i = 0; i < 5; i++) {
          const date = new Date(todayDate + DAY_MILSEC * i);
          const getMonth = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
          const getDate = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
          const dailyData = data.list.filter((reading) => reading.dt_txt.includes(`${date.getFullYear()}-${getMonth}-${getDate}`));
          const valuesOfMinMaxTemp = [];
          const weatherDescription = [];
          let choosedPic;

          //= =================================================================================================================================================
          // FIXME: функция для вычисления min/max температуры.

          function pushToArr() {
            dailyData.forEach((elem) => {
              valuesOfMinMaxTemp.push(elem.main.temp);
              valuesOfMinMaxTemp.sort((a, b) => a - b);
              weatherDescription.push([elem.weather[0].description, elem.weather[0].icon]);
            });
          }
          pushToArr();

          function weatherDescriptionValue() {
            const resultOfWeatherDescription = {};
            weatherDescription.forEach((elem) => {
              resultOfWeatherDescription[elem[0]] = resultOfWeatherDescription[elem[0]] + 1 || 1;
            });
            descriptionValue = Object.entries(resultOfWeatherDescription).sort((a, b) => a[1] - b[1]);
            choosedDescr = descriptionValue[descriptionValue.length - 1];
          }
          weatherDescriptionValue();

          function weatherPicValue() {
            weatherDescription.forEach((elem) => {
              if (elem.includes(choosedDescr[0])) {
                choosedPic = elem[1];
              }
            });
          }
          weatherPicValue();
          //= =======================================================================================================

          weekWeather.innerHTML += `<div class="weekWeather_date">
        <div class="weekWeather_date-wrapper">
            <div class="weekWeather_day">
                <h2 class="weekDay">${date.toString().substr(0, 3)}</h2>
                <p class="date">${date.getDate()}/${date.getMonth() + 1}</p>
            </div>
            <img src="http://openweathermap.org/img/wn/${choosedPic.replace('n', 'd')}@2x.png" alt="${choosedPic}">
            <div class="weekWeather_temp">
                <p class="temp_week">${Math.round(valuesOfMinMaxTemp[valuesOfMinMaxTemp.length - 1])}°/${Math.round(valuesOfMinMaxTemp[0])}° </p>
            </div>
        </div>        
        <div class="weekWeather_subInfo">
            <p>${choosedDescr[0].split(',')[0].split('.')
    .map((elem) => (choosedDescr[0].split(',')[0].replace(elem[0], elem[0].toUpperCase())))
    .join('')}</p>
        </div>  
    </div>`;

          function bgTheme() {
            if (data.list[0].sys.pod === 'n') {
              wrapper.classList.add('night-theme');
              requests.classList.add('night-theme_smokeBg');
              subInfo.classList.add('night-theme_smokeBg');
              weekWeather.classList.add('night-theme_smokeBg');
            } else {
              wrapper.classList.remove('night-theme');
              requests.classList.remove('night-theme_smokeBg');
              subInfo.classList.remove('night-theme_smokeBg');
              weekWeather.classList.remove('night-theme_smokeBg');
            }
          }
          bgTheme();
        }
      } catch (err) {
        console.error(err.message);
        console.log(new Date(todayDate + DAY_MILSEC));
        console.log('ERRRORORORORORORO!!!!');
      }
    }
    weatherForWeek();

    function requestValuesPush() {
      console.log((input.value.replace(input.value[0], input.value[0].toUpperCase())));
      if (!requestValues.includes(input.value.replace(input.value[0], input.value[0].toUpperCase()))) {
        requestValues.unshift(input.value.replace(input.value[0], input.value[0].toUpperCase()));
        localStorage.setItem('items', JSON.stringify(requestValues));
      }
    }

    function deleteRequest() {
      const requestLastChild = document.querySelector('.prevRequest > div:last-child');
      for (let i = 0; i < requestValues.length; i++) {
        if (requestValues.length > 10) {
          prevRequest.removeChild(requestLastChild);
          arr.length = 0;
          arr.push(requestValues[requestValues.length - 1]);
          requestValues.splice(10, 1);
          localStorage.removeItem(requestValues[requestValues.length - 1]);
          localStorage.setItem('items', JSON.stringify(requestValues));
          return prevRequest.insertAdjacentHTML('afterbegin', ` <div class="requestElement">
       <p class="requestElement_title"> ${requestValues[i]}</p>
       <button type="button" class='deleteCityButton'></button>
   </div>  `);
        }
      }
    }
    deleteRequest();

    function createLastRequest() {
      prevRequest.innerHTML = '';
      console.log(data.list);
      if (localStorage.getItem('items') !== [] && requestValues.length <= 10) {
        requestValues.forEach((elem) => prevRequest.insertAdjacentHTML('beforeend', ` <div class="requestElement">
        <p class="requestElement_title"> ${elem}</p>
        <button type="button" class='deleteCityButton'></button>
    </div>  `));
      }
    }
    createLastRequest();


    document.addEventListener('click', (event) => {
      if (event.target.matches('p') && event.target.closest('.requestElement') !== null) {
        console.log(event.target);
        event.stopImmediatePropagation();
        console.log(event.target.closest('div'));
        store.city = event.target.closest('.requestElement_title').textContent;
        console.log(store.city);
        weekWeather.innerHTML = '';
        fetchData();
      }
    });

    input.addEventListener('input', (event) => {
      input.value = input.value.replace(/[^a-z\s]/gi, '')
        .toLowerCase();
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!input.value) {
        return false;
      }
      store.city = input.value;
      requestValuesPush();
      fetchData();
      input.value = '';
      weekWeather.innerHTML = '';
      console.log(requestValues);
    });

    const deleteCityButton = document.querySelectorAll('.deleteCityButton');

    deleteCityButton.forEach((elem) => {
      elem.addEventListener('click', (event) => {
        const deleteCityInArray = event.target.previousElementSibling.textContent.trim();
        const indexCityInArray = requestValues.indexOf(deleteCityInArray);
        const deletedCity = elem.closest('.requestElement');

        if (requestValues.length === 1) {
          requestValues.splice(indexCityInArray, 1);
          deletedCity.remove();
          localStorage.clear();
        } else {
          requestValues.splice(indexCityInArray, 1);
          deletedCity.remove();
          localStorage.setItem('items', JSON.stringify(requestValues));
        }
      });
    });
  } catch (err) {
    console.error('ERROR!', err.message);
    console.error(requestValues);
    // TODO: тут дорабоать!!!

    if (requestValues.length < 11 && arr[arr.length - 1] !== undefined) {
      console.log('1');
      requestValues.splice(0, 1);
      requestValues.push(arr[arr.length - 1]);
      arr = [];
      console.error(requestValues);
      store.city = requestValues[0] || 'Minsk';
    } else {
      console.log('2');
      requestValues.splice(0, 1);
      store.city = requestValues[0] || 'Minsk';
    }
    localStorage.setItem('items', JSON.stringify(requestValues));

    fetchData();
  }
};

fetchData();
