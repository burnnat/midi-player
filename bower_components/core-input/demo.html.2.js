
      document.querySelector('.validation').addEventListener('input-invalid', function(e, value, s) {
        console.log(e.target.id, 'invalid, inputValue:', e.detail.value, e.target.validity);
      });
      document.querySelector('.validation').addEventListener('input-valid', function(e, value, s) {
        console.log(e.target.id, 'valid, inputValue:', e.detail.value, e.target.validity);
      });
    