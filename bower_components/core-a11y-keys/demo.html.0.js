
    addEventListener('template-bound', function(ev) {
      ev.target.print = function(ev) {
        console.log(ev.detail);
        this.$.output.textContent += ev.detail.key + ' pressed!\n';
      }
    });
  