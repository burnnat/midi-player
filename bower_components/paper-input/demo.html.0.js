

    document.addEventListener('polymer-ready', function() {

      setTimeout(function() {
        Array.prototype.forEach.call(document.querySelectorAll('paper-input[hidden]'), function(node) {
          node.removeAttribute('hidden');
        });
      }, 500);

    });

  