/**
 * Listens for the app launching then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      bounds: {width: 800, height: 124}
    },
    function(createdWindow) {
      var launchItems = launchData.items;

      if (launchItems) {
        createdWindow.contentWindow.FILE = launchItems[0].entry;
      }
    }
  );
});
