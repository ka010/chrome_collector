/*
 * DB access layer with logging features for better debugging
 */


var logging = true;

function getDB() {
   var db = new DataBase();
   return db;
}

log = function(txt) {
   if(logging) {
      console.log(txt);
   }
}

function DataBase() {
}

DataBase.prototype.setItem = function(key, value) {
   value = JSON.stringify(value);
   try {
      log("setItem(): " + key + ": " + value);
      window.localStorage.setItem(key, value);
   } catch(e) {
      log("Error inside setItem");
      log(e);
   }
}

DataBase.prototype.getItem = function(key) {
   var value;
   log('getItem(): ' + key);
   
   try {
      value = JSON.parse(window.localStorage.getItem(key));
   } catch(e) {
      log("Error inside getItem() for key:" + key);
      log(e);
      value = null;
   }
   log("return: " + alue);
   return value;
}

DataBase.prototype.removeItem = function(key) {
   log('removeItem(): ' + key);
   
   try {
      window.localStorage.removeItem(key);
   } catch(e) {
      log("Error inside removeItem() for key:" + key);
      log(e);
   }
}

DataBase.prototype.isItemInDB = function(key) {
   log('isItemInDB(): ' + key);
   
   try {
      var item = window.localStorage.getItem(key);
      return (item != null && item != undefined);
   } catch(e) {
      log("Error inside removeItem() for key:" + key);
      log(e);
   }
}


DataBase.prototype.clear = function() {
   window.localStorage.clear();
   log('cleared');
}

function getDomainData(url) {
   if (db.isItemInDB(url)) {
      return db.getItem(url);
   } else {
      return {
         "url": url,

         "lifeTime": {
            "count": 0,
            "time": 0
         },

         "timeBetweenUpdates": {
            "count": 0,
            "time": 0
         },

         "timeBetweenMoves": {
            "count": 0,
            "time": 0
         },

         "timeBetweenViews": {
            "count": 0,
            "time": 0
         }
      }
   }
}

function addLifeTime(domainData, lifeTime) {
   domainData.lifeTime.time += lifeTime;
   domainData.lifeTime.count += 1;
}

function getAVGLifeTime(domainData) {
   if (domainData.lifeTime.count == 0) {
      return 0;
   } else {
      return (domainData.lifeTime.time/domainData.lifeTime.count);
   }
}

function addTimeBetweenUpdates(domainData, timeBetweenUpdates) {
   domainData.timeBetweenUpdates.time += timeBetweenUpdates;
   domainData.timeBetweenUpdates.count += 1;
}

function getAVGTimeBetweenUpdates(domainData) {
   if (domainData.timeBetweenUpdates.count == 0) {
      return 0;
   } else {
      return (domainData.timeBetweenUpdates.time/domainData.timeBetweenUpdates.count);
   }
}

function addTimeBetweenViews(domainData, timeBetweenViews) {
   domainData.timeBetweenViews.time += timeBetweenViews;
   domainData.timeBetweenViews.count += 1;
}

function getAVGTimeBetweenViews(domainData) {
   if (domainData.timeBetweenViews.count == 0) {
      return 0;
   } else {
      return (domainData.timeBetweenViews.time/domainData.timeBetweenViews.count);
   }
}

function addTimeBetweenMoves(domainData, timeBetweenMoves) {
   domainData.timeBetweenMoves.time += timeBetweenMoves;
   domainData.timeBetweenMoves.count += 1;
}

function getAVGTimeBetweenMoves(domainData) {
   if (domainData.timeBetweenMoves.count == 0) {
      return 0;
   } else {
      return (domainData.timeBetweenMoves.time/domainData.timeBetweenMoves.count);
   }
}

function getDomainForURL(url) {
   return url.split("/")[2];
}


/*
 * Listeners to collect data and store it in HTML5 storage 
 */

var db = new DataBase();

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
         var currentDate = new Date();
         var domain = getDomainForURL(tab.url);
         var item = getTabData(tab);
         var domainData = getDomainData(domain);

         addTimeBetweenViews(domainData, currentDate - item.dateLastViewed);
         db.setItem(domain, domainData);

         item.url = tab.url;
         item.dateLastViewed = currentDate;
         item.viewCount += 1;
         db.setItem(tabId, item);
      }
   );
}); 

chrome.tabs.onMoved.addListener(function(tabId, moveInfo) {
   chrome.tabs.get(tabId, 
      function(tab) {
         log("tab moved: " + tab.id + ":" + tab.url);
         var currentDate = new Date();
         var domain = getDomainForURL(tab.url);
         var item = getTabData(tab);
         var domainData = getDomainData(domain);

         addTimeBetweenMoves(domainData, currentDate - item.dateLastMoved);
         db.setItem(domain, domainData);

         item.url = tab.url;
         item.dateLastMoved = new Date();
         db.setItem(tabId, item);
      }
   );
});

chrome.tabs.onRemoved.addListener(function(tabId) {
   log("tab removed: " + tabId);
   db.removeItem(tabId);
}); 

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   log("tab updated: " + tab.id + ":" + tab.url);
   var currentDate = new Date();
   var domain = getDomainForURL(tab.url);
   var item = getTabData(tab);
   var domainData = getDomainData(domain);
  
   addTimeBetweenUpdates(domainData, currentDate - item.dateLastUpdated); 
   db.setItem(domain, domainData);

   item.url = tab.url;
   item.dateLastUpdated = new Date();
   item.updateCount += 1;
   db.setItem(tabId, item);
});
