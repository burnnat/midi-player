/**
 *
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      bounds: {
        width: 800,
        height: 225
      }
    },
    function(createdWindow) {
      var launchItems = launchData.items;

      if (launchItems) {
        createdWindow.contentWindow.setFile(launchItems[0].entry);
      }
    }
  );
});
