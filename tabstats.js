
/*
 * Tab stats
 */

function TabStats () {
   var db = new DataBase();

   this.addTab = function(tab) {
      var tabData = getTabData(tab);
      tabData.score = getScoreForTabData(tabData);
      db.setItem(tab.id, tabData); 
   }

   this.removeTab = function(tabId) {
      var tabData = db.getItem(tabId);
      addClosedTabScore(tabData.score);
      db.removeItem(tabId);
   }

   this.updateTabView = function(tab) {
      var tabData = getTabData(tab);
      tabData.dateLastViewed = new Date();
      tabData.viewCount += 1;
      tabData.score = getScoreForTabData(tabData);
      db.setItem(tab.id, tabData);
   }

   this.updateTabMove = function(tab) {
      var tabData = getTabData(tab);
      tabData.dateLastMoved = new Date();
      tabData.moveCount += 1;
      tabData.score = getScoreForTabData(tabData);
      db.setItem(tab.id, tabData);
   }

   this.updateTabUpdates = function(tab) {
      var tabData = getTabData(tab);

      tabData.url = tab.url;
      tabData.title = tab.title;
      tabData.favIconUrl = tab.favIconUrl;
      tabData.dateLastUpdated = new Date();
      tabData.updateCount += 1;
      tabData.score = getScoreForTabData(tabData);
      db.setItem(tab.id, tabData);
   }

   this.getAllTabs = function() {
      var all = db.getAllItems(); 
      tabs = all.filter(function(tabData) {
         return (tabData.tabID != undefined);
      });
      return tabs;
   }

   this.getTab = function(tabID) {
      return db.getItem(tabID);
   }

   this.getAvgOpenScore = function() {
      var allTabs = this.getAllTabs();
      var totalScore = 0;
      allTabs.forEach(function(tabData) {
         totalScore += tabData.score; 
      });
      return (totalScore / allTabs.length);
   }

   this.getAvgClosedScore = function() {
      var allScores = db.getItem("tabScores");
      if (allScores != null && allScores.length > 0) {
         var totalScore = 0;
         allScores.forEach(function(score) {
            totalScore += score;
         });
         return (totalScore / allScores.length);
      }
      return 0;
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
            "moveCount": 0,
            "updateCount": 0,
            "score": 0
         };  
      }
   }

   function addClosedTabScore(score) {
      var allScores = db.getItem("tabScores");
      if (allScores == null) {
         allScores = new Array();
      }
      allScores.push(score);
      db.setItem("tabScores", allScores);
   }


   function getScoreForTabData(tabData) {
      var score = tabData.viewCount + tabData.moveCount + tabData.updateCount; 
      return score;
   }
}
