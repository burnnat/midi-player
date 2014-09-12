
var expected_failures = [
  {
    browser_configurations: [{ firefox: true }],
    tests: [
      '#animTR at t=(0|(1|2|10|11)000)ms',
      '#animBL at t=(0|(7|8|10)000)ms',
      '#animBR at t=(0|10000)ms',
    ],
    message: 'Doesn\'t quite follow path correctly.',
  }, {
    browser_configurations: [{ firefox: true, version: '29|30|31' }],
    tests: [
      '#animTR at t=9000ms',
      '#animBL at t=5000ms',
      '#animBR at t=(3|8|9)000ms',
    ],
    message: 'Doesn\'t quite follow path correctly.',
  }, {
    browser_configurations: [{ msie: true }],
    tests: [
      '#animTR at t=(0|(1|2|3|4|9|10|11)000)ms',
      '#animBL at t=(0|(1|3|4|7|8|10|11)000)ms',
      '#animBR at t=(0|(1|3|9|10|11)000)ms',
    ],
    message: 'Doesn\'t quite follow path correctly.',
  }
];
