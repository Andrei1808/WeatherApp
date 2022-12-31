const valuesOfMinMaxTemp = [];
const weatherDescription = [];
let choosedPic;

function pushToArr(dailyData) {
    dailyData.forEach((elem) => {
      valuesOfMinMaxTemp.push(elem.main.temp);
      valuesOfMinMaxTemp.sort((a, b) => a - b);
      weatherDescription.push([elem.weather[0].description, elem.weather[0].icon]);
    });
}
  

function weatherDescriptionValue() {
    const resultOfWeatherDescription = {};
    weatherDescription.forEach((elem) => {
      resultOfWeatherDescription[elem[0]] = resultOfWeatherDescription[elem[0]] + 1 || 1;
    });
    descriptionValue = Object.entries(resultOfWeatherDescription).sort((a, b) => a[1] - b[1]);
    choosedDescr = descriptionValue[descriptionValue.length - 1];
}
  
function weatherPicValue() {
    weatherDescription.forEach((elem) => {
      if (elem.includes(choosedDescr[0])) {
        choosedPic = elem[1];
      }
    });
}
  
function createWeekWeather(date){
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
}
    
function bgTheme(data) {
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