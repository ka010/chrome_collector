
var tabStats = chrome.extension.getBackgroundPage().getTabStats();
var domainStats = chrome.extension.getBackgroundPage().getDomainStats();


function render() {
   var tabs = tabStats.getAllTabs();

   for (count in tabs) {
      if (count != null) {
         var tab = tabs[count];
         var item = "<div id='shadow-container'><img src='" + tab.favIconUrl + "' alt='favicon'/><input type='checkbox' name='" + tab.url + "' value='" + tab.url + "'>" + tab.title + "</div>";
         $('body').append(item);
      } 
   }
}
