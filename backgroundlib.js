/*
 * DB access layer with logging features for better debugging
 */

var db = new DataBase();

function getDB() {
   return db;
}

function DataBase() {
   var logging = true;

   // this is private
   this.log = function(txt) {
      if(logging) {
         console.log(txt);
      }
   }
}

DataBase.prototype.setItem = function(key, value) {
   try {
      this.log("setItem: " + key + ": " + value);
      window.localStorage.removeItem(key);
      window.localStorage.setItem(key, value);
   } catch(e) {
      this.log("Error inside setItem");
      this.log(e);
   }
}

DataBase.prototype.getItem = function(key) {
   var value;
   this.log('Get Item:' + key);
   
   try {
      value = window.localStorage.getItem(key);
   } catch(e) {
      this.log("Error inside getItem() for key:" + key);
      this.log(e);
      value = "null";
   }
   this.log("return: " + value);
   return value;
}

DataBase.prototype.removeItem = function(key) {
   this.log('Removing Item:' + key);
   
   try {
      window.localStorage.removeItem(key);
   } catch(e) {
      this.log("Error inside removeItem() for key:" + key);
      this.log(e);
   }
}

DataBase.prototype.clear = function() {
   window.localStorage.clear();
   this.log('cleared');
}

/*
 * Listeners to collect data and store it in HTML5 storage 
 */

chrome.tabs.onCreated.addListener(function(tab) {

}); 


chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {

}); 

chrome.tabs.onMoved.addListener(function(tabId, moveInfo) {
      
});

chrome.tabs.onRemoved.addListener(function(tabId) {

}); 

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

}); 
