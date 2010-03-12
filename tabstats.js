
/*
 * Tab stats
 */

function TabStats () {
   var db = new DataBase();

   this.addTab = function(tab) {
      db.setItem(tab.id, getTabData(tab)); 
   }
   
   this.removeTab = function(tabId) {
      db.removeItem(tabId);
   }

   this.updateTabView = function(tab) {
      var item = getTabData(tab);
      item.dateLastViewed = new Date();
      item.viewCount += 1;
      db.setItem(tab.id, item);
   }

   this.updateTabMove = function(tab) {
      var item = getTabData(tab);
      item.dateLastMoved = new Date();
      db.setItem(tab.id, item);
   }

   this.updateTabUpdates = function(tab) {
      var item = getTabData(tab);

      item.url = tab.url;
      item.title = tab.title;
      item.favIconUrl = tab.favIconUrl;
      item.dateLastUpdated = new Date();
      item.updateCount += 1;
      db.setItem(tab.id, item);
   }

   this.getAllTabs = function() {
      var all = db.getAllItems(); 
      tabs = all.filter(function(item) {
         return (item.tabID != undefined);
      });
      return tabs;
   }

   this.getTab = function(tabID) {
      return db.getItem(tabID);
   }

   function getTabData(tab) {
      if (db.isItemInDB(tab.id)) {
         return db.getItem(tab.id);
      } else {
         var currentDate = new Date();
         return {
            "tabID": tab.id,
            "url": tab.url,
            "title": tab.title,
            "favIconUrl": tab.favIconUrl,
            "dateCreated":  currentDate, 
            "dateLastViewed": currentDate,
            "dateLastUpdated": currentDate,
            "dateLastMoved": currentDate,
            "viewCount": 0,
            "updateCount": 0
         };  
      }
   }
}
