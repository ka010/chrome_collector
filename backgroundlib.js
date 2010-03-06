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
      value = window.localStorage.getItem(key);
   } catch(e) {
      log("Error inside getItem() for key:" + key);
      log(e);
      value = "null";
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

/*
 * Listeners to collect data and store it in HTML5 storage 
 */


var db = new DataBase();

function getTabData(tab) {
   var data = null;

   if (db.isItemInDB(tab.url)) {
      data = db.getItem(tab.url);
   } else {
      var currentDate = new Date();
      data = {
         "tabID": tab.id,
         "url": tab.url,
         "dateCreated":  currentDate, 
         "dateLastViewed": currentDate,
         "dateLastUpdated": currentDate,
         "dateLastMoved": currentDate,
         "viewCount": 0
      };  
   }

   return data;
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

chrome.tabs.onRemoved.addListener(function(tabId) {
   log("tab removed: " + tabId);
   db.removeItem(tabId);
}); 

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   log("tab updated: " + tab.id + ":" + tab.url);
   var item = getTabData(tab);
   item.url = tab.url;
   item.dateLastUpdated = new Date();
   db.setItem(tabId, item);
});
