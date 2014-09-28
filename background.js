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
        var file = launchItems[0].entry;
        var win = createdWindow.contentWindow;

        if (win.setFile) {
          win.setFile(file);
        }
        else {
          win.FILE = file;
        }
      }
    }
  );
});
