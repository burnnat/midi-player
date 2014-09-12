
  
    var ratings = document.querySelector('#ratings');
    ratings.addEventListener('change', function() {
      document.querySelector('#ratingsLabel').textContent = ratings.value;
    });
  
  