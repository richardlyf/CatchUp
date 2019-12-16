var backgroundPage = window.chrome.extension.getBackgroundPage();

if (backgroundPage.getIsLoaded()) {
  onBackgroundLoadingComplete();
} else {
  backgroundPage.setLoadingListener(function(success) {
    // Clearout listener
    backgroundPage.setLoadingListener(undefined);

    // Process results
    if (success) {
      onBackgroundLoadingComplete();
    } else {
      showError("There's been an error loading the Save extension. Please check your connection and try again.");
    }
  });
}

function onBackgroundLoadingComplete() {
  // Load CSS for popup
  backgroundPage.requestCss(
    backgroundPage.getFullUrl('/saved/extension/rsrc/css/'),
    function(success) {
      if (success) {
        onCssLoadingComplete();
      } else {
        showError("There's been an error loading the Save extension. Please check your connection and try again.");
      }
    },
    document);
}

function onCssLoadingComplete() {
  backgroundPage.SavedExtension.initUI(document.getElementById('savedapp'));
}

function showError(message) {
  document.getElementById('savedapp').classList.add('error');
  document.getElementById('errormessage').innerHTML = message;
}
