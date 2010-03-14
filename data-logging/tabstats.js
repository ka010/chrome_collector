
/*
 * Tab stats
 */

function TabStats () {
   var db = new DataBase();
   var classifier = new MLP;
   classifier.init(4,4,4);
   if (db.getItem('classifierState') != null) {
       classifier.load(db.getItem('classifierState'));
   } 

   
   this.addTab = function(tab) {
      var tabData = getTabData(tab);
      tabData.score = getScoreForTabData(tabData);
      db.setItem(tab.id, tabData); 
   }

   this.removeTab = function(tabId) {
      var tabData = db.getItem(tabId);
      addClosedTab(tabData);
      addClosedTabScore(tabData.score);
      
      // train neural network
      classifier.train(tabData);
      
      // persist neural network
      var classifierState=classifier.store();
      db.setItem('classifierState',classifierState);
      
      db.removeItem(tabId);

   }

   this.updateTabView = function(tab) {
      var tabData = getTabData(tab);
      tabData.dateLastViewed = new Date();
      tabData.viewCount += 1;
      tabData.score = getScoreForTabData(tabData);
      chrome.tabs.captureVisibleTab(null, function(thumbnail) {
         tabData.thumbnail = thumbnail; 
         db.setItem(tab.id, tabData);
      });
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

   this.getCollectedTabs = function() {
      var all = this.getAllTabs();
      var avgScore = getAvgClosedScore();
      
      // classifier
      var classifierResults = new Array();
      all.forEach(function(tabData){
         classifierResults.push(classifier.classify(tabData));
      });

      // metric
      var i=0;
      tabs = all.filter(function(tabData) {
            i +=1;
            return ((tabData.score ) - avgScore  < 2);
      });
      return tabs;
   }

   this.getClosedTabs = function() {
      var closedTabs = db.getItem("closedTabs");
      if (closedTabs != null) {
         return closedTabs;
      }
      return new Array();
   }

   this.getTab = function(tabID) {
      return db.getItem(tabID);
   }

   getAvgOpenScore = function() {
      var allTabs = this.getAllTabs();
      var totalScore = 0;
      allTabs.forEach(function(tabData) {
         totalScore += tabData.score; 
      });
      return (totalScore / allTabs.length);
   }

   getAvgClosedScore = function() {
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
            "thumbnail": tab.favIconUrl,
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

   function addClosedTab(tabData) {
      var closedTabs = db.getItem("closedTabs");
      if (closedTabs == null) {
         closedTabs = new Array();
      }
      closedTabs.push(tabData);
      var range = closedTabs.length > 10 ? closedTabs.length - 10 : 0;
      db.setItem("closedTabs", closedTabs.slice(range));
   }



   function getScoreForTabData(tabData) {
      var score = tabData.viewCount * 1.2 + tabData.moveCount * 1.0 + tabData.updateCount * 0.8; 
      return score;
   }
}
