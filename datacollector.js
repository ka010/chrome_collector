
/*
 * Global stuff
 */

var logging = true;
var db = new DataBase();
var domStats = new DomainStats(); 

function getDB() {
   var db = new DataBase();
   return db;
}

log = function(txt) {
   if(logging) {
      console.log(txt);
   }
}

function parseDate(str) {
   var parts = str.split('T'),
   dateParts = parts[0].split('-'),
   timeParts = parts[1].split('Z'),
   timeSubParts = timeParts[0].split(':'),
   timeSecParts = timeSubParts[2].split('.'),
   timeHours = Number(timeSubParts[0]),
   d = new Date;

   d.setUTCFullYear(Number(dateParts[0]));
   d.setUTCMonth(Number(dateParts[1])-1);
   d.setUTCDate(Number(dateParts[2]));
   d.setUTCHours(Number(timeHours));
   d.setUTCMinutes(Number(timeSubParts[1]));
   d.setUTCSeconds(Number(timeSecParts[0]));
   if (timeSecParts[1]) d.setUTCMilliseconds(Number(timeSecParts[1]));

 return d;
}

/*
 * Listeners to collect data and store it in HTML5 storage 
 */


function getTabData(tab) {
   if (db.isItemInDB(tab.id)) {
      return db.getItem(tab.id);
   } else {
      var currentDate = new Date();
      return {
         "tabID": tab.id,
         "url": tab.url,
         "dateCreated":  currentDate, 
         "dateLastViewed": currentDate,
         "dateLastUpdated": currentDate,
         "dateLastMoved": currentDate,
         "viewCount": 0,
         "updateCount": 0
      };  
   }
}


chrome.tabs.onCreated.addListener(function(tab) {
   log("tab created: " + tab.id + ":" + tab.url);
   db.setItem(tab.id, getTabData(tab));
}); 


chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
   chrome.tabs.get(tabId, 
      function(tab) {
         log("tab selected: " + tab.id + ":" + tab.url);
         var item = getTabData(tab);

         item.url = tab.url;
         item.dateLastViewed = new Date();
         item.viewCount += 1;
         db.setItem(tabId, item);
         domStats.addView(tab.url);
      }
   );
}); 

chrome.tabs.onMoved.addListener(function(tabId, moveInfo) {
   chrome.tabs.get(tabId, 
      function(tab) {
         log("tab moved: " + tab.id + ":" + tab.url);
         var item = getTabData(tab);

         item.url = tab.url;
         item.dateLastMoved = new Date();
         db.setItem(tabId, item);
         domStats.addMove(tab.url);
      }
   );
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   log("tab updated: " + tab.id + ":" + tab.url);
   var item = getTabData(tab);
  
   item.url = tab.url;
   item.dateLastUpdated = new Date();
   if (changeInfo.status == "complete") {
      item.updateCount += 1;
      domStats.addUpdate(tab.url);
   }

   db.setItem(tabId, item);
});

chrome.tabs.onRemoved.addListener(function(tabId) {
   log("tab removed: " + tabId);

   var item = db.getItem(tabId);
   var currentDate = new Date();
   var oldDate = parseDate(item.dateCreated);
   
   db.removeItem(tabId);
});
