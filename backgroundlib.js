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
   log("return: " + value);
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

         "updateCount": {
            "count": 0,
            "updates": 0
         },

         "viewCount": {
            "count": 0,
            "views": 0
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

function addUpdateCount(domainData, updateCount) {
   domainData.updateCount.updates += updateCount;
   domainData.updateCount.count += 1;
}

function getAVGTimeBetweenUpdates(domainData) {
   if (domainData.updateCount.count == 0) {
      return 0;
   } else {
      return (domainData.updateCount.updates/domainData.updateCount.count);
   }
}

function addViewCount(domainData, viewCount) {
   domainData.viewCount.views += viewCount;
   domainData.viewCount.count += 1;
}

function getAVGTimeBetweenViews(domainData) {
   if (domainData.viewCount.count == 0) {
      return 0;
   } else {
      return (domainData.viewCount.views/domainData.viewCount.count);
   }
}

function getDomainForURL(url) {
   return url.split("/")[2];
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
         var item = getTabData(tab);

         item.url = tab.url;
         item.dateLastViewed = new Date();
         item.viewCount += 1;
         db.setItem(tabId, item);
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
   }
   db.setItem(tabId, item);
});

chrome.tabs.onRemoved.addListener(function(tabId) {
   log("tab removed: " + tabId);

   var item = db.getItem(tabId);
   var currentDate = new Date();
   var oldDate = parseDate(item.dateCreated);
   var domain = getDomainForURL(item.url);
   var domainData = getDomainData(domain);

   addLifeTime(domainData, Math.ceil((currentDate - oldDate)/(1000*60)));
   addViewCount(domainData, item.viewCount);
   addUpdateCount(domainData, item.updateCount);

   if (domain != null) {
      db.setItem(domain, domainData);
   }

   db.removeItem(tabId);
});
