
document.addEventListener('click', (event) => {
    if (event.target.matches('p') && event.target.closest('.requestElement') !== null) {
      event.stopImmediatePropagation();
      store.city = event.target.closest('.requestElement_title').textContent;
      weekWeather.innerHTML = '';
      fetchData();
    }
  });

  input.addEventListener('input', (event) => {
    if (input.value.length === 1 && event.data === ' '){
      input.value = '';
    }else{
    input.value= input.value.replace(/[^a-z\s]/gi, '')
      .toLowerCase()}
      
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    errorMessage.classList.remove('showErrorMessage')
    if (!input.value) {
      return false;
    }
    store.city = input.value;
    requestValuesArr();
    fetchData();
    input.value = '';
    weekWeather.innerHTML = '';
    console.log(requestValues);
  });



