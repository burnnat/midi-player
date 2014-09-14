

    Polymer('paper-progress', {

      vertical: false,

      axis: 'x',
      crossAxis: 'y',
      dimension: 'width',
      crossDimension: 'height',
      offset: 'offsetWidth',
      start: 'left',
      crossStart: 'bottom',
      edge: 'right',
      crossEdge: 'top',

      verticalChanged: function(wasVertical, isVertical) {
        var values = isVertical
          ? {
            axis: 'y',
            crossAxis: 'x',
            dimension: 'height',
            crossDimension: 'width',
            offset: 'offsetHeight',
            start: 'bottom',
            crossStart: 'left',
            edge: 'top',
            crossEdge: 'right'
          }
          : {
            axis: 'x',
            crossAxis: 'y',
            dimension: 'width',
            crossDimension: 'height',
            offset: 'offsetWidth',
            start: 'left',
            crossStart: 'bottom',
            edge: 'right',
            crossEdge: 'top'
          };

        for (var key in values) {
          this[key] = values[key];
        }
      },

      /**
       * The number that represents the current secondary progress.
       *
       * @attribute secondaryProgress
       * @type number
       * @default 0
       */
      secondaryProgress: 0,

      step: 0,

      observe: {
        'value secondaryProgress min max': 'update'
      },

      update: function() {
        this.super();
        this.secondaryProgress = this.clampValue(this.secondaryProgress);
        this.secondaryRatio = this.calcRatio(this.secondaryProgress) * 100;
      }

    });

  