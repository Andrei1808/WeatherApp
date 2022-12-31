const fetchData = async () => {
  try {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${store.city}&appid=${apiKey}&units=metric`);
    const data = await result.json();

    currentlyWeatherCreate(data);
    weatherForWeekCreate(data);
    deleteRequest();
    createLastRequest();


    const deleteCityButton = document.querySelectorAll('.deleteCityButton');

    deleteCityButton.forEach((elem) => {
        elem.addEventListener('click', (event) => {
          console.log(event.target)
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
  
    catchErrorFunc(err)
  }
};

fetchData();
