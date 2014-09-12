

  Polymer({

    publish: {

      /**
       * The element associated with this dropdown, usually the element that triggers
       * the menu.
       *
       * @attribute relatedTarget
       * @type Node
       */
      relatedTarget: null,

      /**
       * If true, the menu is currently visible.
       *
       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false,

      /**
       * The horizontal alignment of the popup relative to `relatedTarget`. `left`
       * means the left edges are aligned together. `right` means the right edges
       * are aligned together.
       *
       * @attribute halign
       * @type 'left' | 'right'
       * @default 'left'
       */
      halign: 'left',

      /**
       * The vertical alignment of the popup relative to `relatedTarget`. `top` means
       * the top edges are aligned together. `bottom` means the bottom edges are
       * aligned together.
       *
       * @attribute valign
       * @type 'top' | 'bottom'
       * @default 'top'
       */
      valign: 'top',

      /**
       * A pixel amount around the dropdown that will be reserved. It's useful for
       * ensuring that, for example, a shadow displayed outside the dropdown will
       * always be visible.
       *
       * @attribute margin
       * @type number
       * @default 0
       */
      margin: 0,

      /**
       * The transition property specifies a string which identifies a 
       * <a href="../core-transition/">`core-transition`</a> element that 
       * will be used to help the overlay open and close. The default
       * `core-transition-fade` will cause the overlay to fade in and out.
       *
       * @attribute transition
       * @type string
       * @default null
       */
      transition: null

    }

  });

