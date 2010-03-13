
/*
 * Global stuff
 */

var logging = false;
var domainStats = new DomainStats(); 
var tabStats = new TabStats();
var lastSelectedTab = null;

chrome.tabs.getSelected(null, function(tab) {
   lastSelectedTab = tab;
});

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

function getDomainForURL(url) {
   return url.split("/")[2];
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
      domainStats.updateLastActivity(lastSelectedTab.url);
      domainStats.addActivity(tab.url);
      lastSelectedTab = tab;
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
      if (getDomainForURL(tab.url) != (getDomainForURL(lastSelectedTab.url))) {
         domainStats.updateLastActivity(lastSelectedTab.url);
         domainStats.addActivity(tab.url);
      }
      tabStats.updateTabUpdates(tab);
   }
});

chrome.tabs.onRemoved.addListener(function(tabId) {
   log("tab removed: " + tabId);
   sendData(tabStats.getTab(tabId));
   tabStats.removeTab(tabId)
});


/*
 * HTTP HELPER
 */

function sendData(tabdata) {
   var data = "tabdata=" + encodeURIComponent(JSON.stringify(tabdata));
   httpPost(data);
}

function httpPost(data) {
   var xhr = new XMLHttpRequest();
   var url = "http://pub.roothausen.de/test.php";
   xhr.open("POST", url, true, username, password);
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

   xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
         log(xhr.responseText);
      }
   }
   xhr.send(data);
}
