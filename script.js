const apiKey = '08823c6a4b3b1dc99b1f2fe807a11809';
const store = {
  city: 'Minsk',
};

const button = document.querySelector('.header_button');
const form = document.querySelector('.form');
const input = document.querySelector('.header_inputText');
const weekWeather = document.querySelector('.weekWeather');
const requestValues = [];

const fetchData = async () => {
  const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${store.city}&appid=${apiKey}&units=metric`);
  const data = await result.json();

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
  const weatherBg = document.querySelector('.currentlyWeather');
  const requests = document.querySelector('.requests');

  console.log(data.list);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!input.value) {
      return false;
    }
    store.city = input.value;
    requestValuesPush()
    fetchData();
    input.value = '';
    weekWeather.innerHTML = '';
    console.log(requestValues);
  });

  // TODO:
  // Try Catch сделать для отлова ошибок
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
    if (data.list[0].sys.pod === 'n') {
      weatherBg.classList.add('night-theme');
    } else {
      weatherBg.classList.remove('night-theme');
    }

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

  async function weatherForWeek() {
    const DAY_MILSEC = 24 * 60 * 60 * 1000;
    const todayDate = new Date().getTime();

    for (let i = 0; i < 5; i++) {
        const date = new Date(todayDate + DAY_MILSEC * i);
        const dailyData = data.list.filter((reading) => reading.dt_txt.includes(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`));

        //= =================================================================================================================================================
        // FIXME: функция для вычисления min/max температуры.
        const valuesOfMinMaxTemp = [];
        const weatherDescription = [];
        let choosedPic;

        function pushArr() {
          dailyData.forEach((elem) => {
            valuesOfMinMaxTemp.push(elem.main.temp);
            valuesOfMinMaxTemp.sort((a, b) => a - b);
            weatherDescription.push([elem.weather[0].description, elem.weather[0].icon]);
          });
        }
        pushArr();

        function weatherDescriptionValue() {
          const resultOfWeatherDescription = {};
          weatherDescription.forEach((elem) => {
            resultOfWeatherDescription[elem[0]] = resultOfWeatherDescription[elem[0]] + 1 || 1;
          });

          descriptionValue = Object.entries(resultOfWeatherDescription).sort((a, b) => a[1] - b[1]);
          choosedDescr = descriptionValue[descriptionValue.length - 1];
        }
        weatherDescriptionValue();

        function choosedPicFunc() {
          weatherDescription.forEach((elem) => {
            if (elem.includes(choosedDescr[0])) {
              choosedPic = elem[1];
            }
          });
        }
        choosedPicFunc();
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

        if (data.list[0].sys.pod === 'n') {
          weekWeather.classList.add('night-theme');
        } else {
          weekWeather.classList.remove('night-theme');
        }
      
    }
  }
  weatherForWeek();


  const requestLastChild = document.querySelector('.requests > div:last-child');
  const deleteCityButton = document.querySelector('.deleteCityButton')
  const requestElement = document.querySelector('.requestElement')

  function previousRequests() {
    console.log(requestValues);
    console.log(requestLastChild);
    if (requestValues.length <= 10
      && requestValues.length) {
      return requests.insertAdjacentHTML('afterbegin', ` <div class="requestElement">
        <p class="requestElement_title"> ${requestValues[0]}</p>
        <button type="button" class='deleteCityButton'></button>
    </div>  `);
    }
    else if (requestValues.length) {
      requestValues.splice(10, 1);
      requests.removeChild(requestLastChild);
      return requests.insertAdjacentHTML('afterbegin', ` <div class="requestElement">
        <p class="requestElement_title"> ${requestValues[0]}</p>
        <button type="button"></button>
    </div>  `);
    }
  }
  
  function requestValuesPush() {
    if (!requestValues.includes(input.value)) {
      requestValues.unshift(input.value);
      previousRequests();
    }else{return}
  }

 
//TODO: тут нужно сделать что бы удаленные элементы из списка, удалялись так же и из массива. Как вариант отфильтровать массив на совпадения с удаляющимся элементом и кдалить его из массива.
  deleteCityButton.addEventListener('click',  function deleteCity() {
    let city = deleteCityButton.closest('div')
    city.remove() 
  })


};

fetchData();
