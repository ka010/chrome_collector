
/*
 * Global stuff
 */

var logging = true;
var domainStats = new DomainStats(); 
var tabStats = new TabStats();

function getDomainStats() {
   return domainStats;
}

function getTabStats() {
   return tabStats;
}

function log(txt) {
   if(logging) {
      console.log(txt);
   }
}

/*
 * Listeners to collect data and store it in HTML5 storage 
 */

chrome.tabs.onCreated.addListener(function(tab) {
   log("tab created: " + tab.id + ":" + tab.url);
   tabStats.addTab(tab);
}); 


chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
   chrome.tabs.get(tabId, 
   function(tab) {
      log("tab selected: " + tab.id + ":" + tab.url);
      domainStats.addView(tab.url);
      tabStats.updateTabView(tab);
   });
}); 

chrome.tabs.onMoved.addListener(function(tabId, moveInfo) {
   chrome.tabs.get(tabId, 
   function(tab) {
      log("tab moved: " + tab.id + ":" + tab.url);
      domainStats.addMove(tab.url);
      tabStats.updateTabMove(tab);
   });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   log("tab updated: " + tab.id + ":" + tab.url);
   if (changeInfo.status == "complete") {
      domainStats.addUpdate(tab.url);
      tabStats.updateTabUpdates(tab);
   }
});

chrome.tabs.onRemoved.addListener(function(tabId) {
   log("tab removed: " + tabId);
   tabStats.removeTab(tabId)
});
