const fetchData = async () => {
  try {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${store.city}&appid=${apiKey}&units=metric`);
    const data = await result.json();

    currentlyWeatherCreate(data);
    weatherForWeekCreate(data);
    deleteRequest();
    createLastRequest();
    setInterval(() => {
      myTimer();
    }, 1000);

    document.addEventListener('click', (event) => {
      if (event.target.matches('p') && event.target.closest('.requestElement') !== null) {
        event.stopImmediatePropagation();
        store.city = event.target.closest('.requestElement_title').textContent;
        weekWeather.innerHTML = '';
        fetchData();
      }
    });

    input.addEventListener('input', (event) => {
      if (input.value.length === 1 && event.data === ' ') {
        input.value = '';
      } else {
        input.value = input.value.replace(/[^a-z\s]/gi, '')
          .toLowerCase();
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      errorMessage.classList.remove('showErrorMessage');
      if (!input.value) {
        return false;
      }
      store.city = input.value;
      requestValuesArr();
      fetchData();
      input.value = '';
      weekWeather.innerHTML = '';
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
    catchErrorFunc(err);
  }
};

fetchData();
