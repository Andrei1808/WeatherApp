const apiKey = '08823c6a4b3b1dc99b1f2fe807a11809';
const store = {
  city: 'Minsk',
};

const button = document.querySelector('.header_button');
const form = document.querySelector('.form');
const input = document.querySelector('.header_inputText');
const weekWeather = document.querySelector('.weekWeather');
let requestValues = [];

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!input.value) {
    return false;
  }
  store.city = input.value;
  requestValues.push(input.value)
  fetchData();
  input.value = '';
  weekWeather.innerHTML = '';
  console.log(requestValues)
});




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
  const requestElement_title = document.querySelector('.requestElement_title');

  console.log(data.list);


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
     /* const dailyData1 = data.list.filter((reading) => reading.dt_txt.includes('12:00:00')); */
    const weekWeather = document.querySelector('.weekWeather');
    const DAY_MILSEC = 24 * 60 * 60 * 1000;
    const todayDate = new Date().getTime();
 

/*     console.log(dailyData1)
    for (let i of dailyData1) {
      weekWeather.innerHTML = i.weather[0].description
      console.log(i.weather[0].description)
  console.log(dailyData1[0].main.temp)
} */
    

    
    
    
    for (let i = 0; i < 5; i++) {
      for (const elem of data.list[0].weather) {
        const date = new Date(todayDate + DAY_MILSEC * i);
        const dailyData = data.list.filter((reading) => reading.dt_txt.includes(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`));
    
        /* console.log(dailyData) */

  
        
        
       
        //= =================================================================================================================================================
        // FIXME: функция для вычисления min/max температуры.
        const valuesOfMinMaxTemp = [];
        const weatherDescription = [];
        let choosedPic;

        function pushArr(){
        dailyData.forEach((elem) => {
          valuesOfMinMaxTemp.push(elem.main.temp);
          valuesOfMinMaxTemp.sort((a, b) => a - b);
          weatherDescription.push([elem.weather[0].description, elem.weather[0].icon]);
 
        });
        
        }
        pushArr()
       /*  console.log(valuesOfMinMaxTemp) */

        //TODO: тут нужно отсортировать картинки/описания и вывести самое много повторяющиеся
        /* function weatherPicValue() {
          let resultOfWeatherPic = {};
          weatherPic.forEach(function (a) {
            resultOfWeatherPic[a] = resultOfWeatherPic[a] + 1 || 1;
          });
          console.log(resultOfWeatherPic)

          picAverrageValue = Object.entries(resultOfWeatherPic).sort((a, b) => a[1] - b[1]);
          choosedWeatherPic = picAverrageValue[picAverrageValue.length - 1]
          console.log( choosedWeatherPic[0])
         
        }
        weatherPicValue() */
        //TODO: ДОстать от сюда правильные картинки (описания уже есть) Надо как-то по описанию достать правильную для него картинку.
        function weatherDescriptionValue() {
          let resultOfWeatherDescription = {};
          weatherDescription.forEach(function (elem) {
            resultOfWeatherDescription[elem[0]] = resultOfWeatherDescription[elem[0]] + 1 || 1;
           /*  console.log(elem) */
                       
          });

          descriptionValue = Object.entries(resultOfWeatherDescription).sort((a, b) => a[1] - b[1]);
          choosedDescr = descriptionValue[descriptionValue.length - 1]
          /* console.log(descriptionValue) */
         
        }
        weatherDescriptionValue()

        function choosedPicFunc(){
        weatherDescription.forEach(elem => {
          if (elem.includes(choosedDescr[0])) {
            choosedPic = elem[1]
           
          }
        })}
        choosedPicFunc()
        //= =======================================================================================================

        weekWeather.innerHTML += `<div class="weekWeather_date">
        <div class="weekWeather_date-wrapper">
            <div class="weekWeather_day">
                <h2 class="weekDay">${date.toString().substr(0, 3)}</h2>
                <p class="date">${date.getDate()}/${date.getMonth() + 1}</p>
            </div>
            <img src="http://openweathermap.org/img/wn/${choosedPic.replace('n','d')}@2x.png" alt="${choosedPic}">
            <div class="weekWeather_temp">
                <p class="temp_week">${Math.round(valuesOfMinMaxTemp[valuesOfMinMaxTemp.length - 1])}°/${Math.round(valuesOfMinMaxTemp[0])}° </p>
            </div>
        </div>        
        <div class="weekWeather_subInfo">
            <p>${choosedDescr[0].split(',')[0].split('.') // FIXME: Исправить описание и иконки, что бы оно было для правильного дня. Иконку и описание надо брать за 12.00 каждого дня.
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
  }
  weatherForWeek();



  function previousRequests() {
    console.log(requestValues)
     requestValues.forEach(elem=>{
      requests.innerHTML = ` <div class="requestElement">
                    <p class="requestElement_title">${elem}</p>
                    <button type="button"></button>
                </div>  `
                })
                }
  previousRequests()
  
};

fetchData();
