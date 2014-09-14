

  Polymer('paper-slider', {

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
     * Fired when the slider's value changes.
     *
     * @event core-change
     */

    /**
     * Fired when the slider's value changes due to user interaction.
     *
     * Changes to the slider's value due to changes in an underlying
     * bound variable will not trigger this event.
     *
     * @event change
     */

    /**
     * If true, the slider thumb snaps to tick marks evenly spaced based
     * on the `step` property value.
     *
     * @attribute snaps
     * @type boolean
     * @default false
     */
    snaps: false,

    /**
     * If true, a pin with numeric value label is shown when the slider thumb
     * is pressed.  Use for settings for which users need to know the exact
     * value of the setting.
     *
     * @attribute pin
     * @type boolean
     * @default false
     */
    pin: false,

    /**
     * If true, this slider is disabled.  A disabled slider cannot be tapped
     * or dragged to change the slider value.
     *
     * @attribute disabled
     * @type boolean
     * @default false
     */
    disabled: false,

    /**
     * The number that represents the current secondary progress.
     *
     * @attribute secondaryProgress
     * @type number
     * @default 0
     */
    secondaryProgress: 0,

    /**
     * If true, an input is shown and user can use it to set the slider value.
     *
     * @attribute editable
     * @type boolean
     * @default false
     */
    editable: false,

    /**
     * The immediate value of the slider.  This value is updated while the user
     * is dragging the slider.
     *
     * @attribute immediateValue
     * @type number
     * @default 0
     */

    observe: {
      'min max step snaps': 'update'
    },

    ready: function() {
      this.verticalChanged(false, this.vertical);
      this.update();
    },

    update: function() {
      this.positionKnob(this.calcRatio(this.value));
      this.updateMarkers();
    },

    valueChanged: function() {
      this.update();
      this.fire('core-change');
    },

    immediateValueChanged: function() {
      if (!this.dragging) {
        this.value = this.immediateValue;
      }
    },

    expandKnob: function() {
      this.expand = true;
    },

    resetKnob: function() {
      this.expandJob && this.expandJob.stop();
      this.expand = false;
    },

    positionKnob: function(ratio) {
      this.immediateValue = this.calcStep(this.calcKnobPosition(ratio)) || 0;
      this._ratio = this.snaps ? this.calcRatio(this.immediateValue) : ratio;
      this.$.sliderKnob.style[this.start] = this._ratio * 100 + '%';
    },

    inputChange: function() {
      this.value = this.$.input.value;
      this.fire('change');
    },

    calcKnobPosition: function(ratio) {
      return (this.max - this.min) * ratio + this.min;
    },

    trackStart: function(e) {
      this._w = this.$.sliderBar[this.offset];
      this._x = this._ratio * this._w;
      this._startx = this._x || 0;
      this._minx = - this._startx;
      this._maxx = this._w - this._startx;
      this.$.sliderKnob.classList.add('dragging');
      this.dragging = true;
      e.preventTap();
    },

    track: function(e) {
      if (e.type !== 'track' + this.axis) {
        return;
      }
      var delta = (this.vertical ? -1 : 1) * e['d'+this.axis];
      var x = Math.min(this._maxx, Math.max(this._minx, delta));
      this._x = this._startx + x;
      this.immediateValue = this.calcStep(
          this.calcKnobPosition(this._x / this._w)) || 0;
      var s =  this.$.sliderKnob.style;
      var offset = (this.snaps ?
          (this.calcRatio(this.immediateValue) * this._w) - this._startx : x);
      offset = (this.vertical ? -1 : 1) * offset + 'px';
      s.transform = s.webkitTransform = 'translate3d('
          + (this.vertical ? '0, ' + offset : offset + ', 0') + ', 0)';
    },

    trackEnd: function() {
      var s =  this.$.sliderKnob.style;
      s.transform = s.webkitTransform = '';
      this.$.sliderKnob.classList.remove('dragging');
      this.dragging = false;
      this.resetKnob();
      this.value = this.immediateValue;
      this.fire('change');
    },

    bardown: function(e) {
      this.transiting = true;
      this._w = this.$.sliderBar[this.offset];
      var rect = this.$.sliderBar.getBoundingClientRect();
      var ratio = (this.vertical ? -1 : 1) * (e[this.axis] - rect[this.start]) / this._w;
      this.positionKnob(ratio);
      this.expandJob = this.job(this.expandJob, this.expandKnob, 60);
      this.fire('change');
    },

    knobTransitionEnd: function(e) {
      if (e.target === this.$.sliderKnob) {
        this.transiting = false;
      }
    },

    updateMarkers: function() {
      this.markers = [], l = (this.max - this.min) / this.step;
      for (var i = 0; i < l; i++) {
        this.markers.push('');
      }
    },

    increment: function() {
      this.value = this.clampValue(this.value + this.step);
    },

    decrement: function() {
      this.value = this.clampValue(this.value - this.step);
    },

    incrementKey: function(ev, keys) {
      if (keys.key === "end") {
        this.value = this.max;
      } else {
        this.increment();
      }
      this.fire('change');
    },

    decrementKey: function(ev, keys) {
      if (keys.key === "home") {
        this.value = this.min;
      } else {
        this.decrement();
      }
      this.fire('change');
    }

  });

