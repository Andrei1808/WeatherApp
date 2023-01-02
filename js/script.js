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

    burgerMenuButton.addEventListener('click', (event) => {
      event.stopImmediatePropagation()
      requests.classList.toggle('requests_burgerMenu')
      if (requests.classList.contains('requests_burgerMenu')) {
        weekWeather.classList.add('hide')
        subInfo.classList.add('hide')
        currentlyWeather.classList.add('hide')
        clocks.classList.add('hide')
      } else {
        weekWeather.classList.remove('hide')
        subInfo.classList.remove('hide')
        currentlyWeather.classList.remove('hide')
        clocks.classList.remove('hide')
       }
    })

    
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


    document.addEventListener('click', (event) => {
      if (event.target.matches('p') && event.target.closest('.requestElement') !== null && window.innerWidth > 768) {
        event.stopImmediatePropagation();
        store.city = event.target.closest('.requestElement_title').textContent;
        weekWeather.innerHTML = '';
        fetchData();
      } else if(event.target.closest('.requestElement') !== null) {
        event.stopImmediatePropagation();
        store.city = event.target.closest('.requestElement_title').textContent;
        weekWeather.innerHTML = '';
        requests.classList.remove('requests_burgerMenu')
        weekWeather.classList.remove('hide')
        subInfo.classList.remove('hide')
        currentlyWeather.classList.remove('hide')
        clocks.classList.remove('hide')
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


  } catch (err) {
    catchErrorFunc(err);
  }
};

fetchData();
