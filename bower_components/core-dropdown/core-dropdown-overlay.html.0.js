
    Polymer({

      publish: {

        /**
         * The `relatedTarget` is an element used to position the overlay. It should have
         * the same offsetParent as the target.
         *
         * @attribute relatedTarget
         * @type Node
         */
        relatedTarget: null,

        /**
         * The horizontal alignment of the overlay relative to the `relatedTarget`.
         * `left` means the left edges are aligned together and `right` means the right
         * edges are aligned together.
         *
         * @attribute halign
         * @type 'left' | 'right'
         * @default 'auto'
         */
        halign: 'left',

        /**
         * The vertical alignment of the overlay relative to the `relatedTarget`. `top`
         * means the top edges are aligned together and `bottom` means the bottom edges
         * are aligned together.
         *
         * @attribute valign
         * @type 'top' | 'bottom'
         * @default 'top'
         */
        valign: 'top',

        /**
         * A pixel amount around the overlay that will be reserved. It's useful for
         * ensuring that, for example, a shadow displayed outside the overlay will
         * always be visible.
         *
         * @attribute margin
         * @type number
         * @default 0
         */
        margin: 0

      },

      updateTargetDimensions: function() {
        this.measureTarget();
        this.super();
      },

      measureTarget: function() {
        var sizer = this.sizingTarget || this.target;

        /* position offscreen if we're auto-positioning to get the natural width and height of the dropdown */
        sizer.style.position = 'absolute';
        sizer.style.left = '-99999px';
        sizer.style.top = '-99999px';

        var rect = sizer.getBoundingClientRect();

        this._naturalSize = {
          width: rect.width,
          height: rect.height
        };

        sizer.style.position = this.targetStyle.position;
        sizer.style.left = null;
        sizer.style.top = null;
      },

      positionTarget: function() {
        if (!this.relatedTarget) {
          this.super();
          return;
        }

        var t_op = this.target.offsetParent;
        var r_op = this.relatedTarget.offsetParent;
        if (window.ShadowDOMPolyfill) {
          t_op = wrap(t_op);
          r_op = wrap(r_op);
        }

        if (t_op !== r_op && t_op !== this.relatedTarget) {
          console.warn('core-dropdown-overlay: dropdown\'s offsetParent must be the relatedTarget or the relatedTarget\'s offsetParent!');
        }

        // Don't use CSS to handle halign/valign here so _shouldPosition still works.

        var inside = t_op === this.relatedTarget;
        var ref = this.relatedTarget.getBoundingClientRect();

        if (this._shouldPosition.left) {
          var left;
          var ml = -1 * ref.left + (inside ? 0 : this.relatedTarget.offsetLeft) + this.margin;
          if (this.halign === 'right') {
            left = Math.max((inside ? 0 : this.relatedTarget.offsetLeft) + this.relatedTarget.offsetWidth - this._naturalSize.width, ml);
          } else {
            left = inside ? 0 : this.relatedTarget.offsetLeft;
          }
          this.target.style.left = left + 'px';
        }

        if (this._shouldPosition.top) {
          var top;
          var mt = -1 * ref.top + (inside ? 0 : this.relatedTarget.offsetTop) + this.margin;
          if (this.valign === 'bottom') {
            top = Math.max((inside ? 0 : this.relatedTarget.offsetTop) + this.relatedTarget.offsetHeight - this._naturalSize.height, mt);
          } else {
            top = inside ? 0 : this.relatedTarget.offsetTop;
          }
          this.target.style.top = top + 'px';
        }
      },

      sizeTarget: function() {
        var sizer = this.sizingTarget || this.target;

        sizer.style.width = this._naturalSize.width + 'px';
        sizer.style.height = this._naturalSize.height + 'px';

        // XXX: if valign=bottom, maxHeight is too tall

        this.super();
      }

    });
  