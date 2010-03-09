/*
 * DB access layer with logging features for better debugging
 */


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
      log("Error inside isItemInDB() for key:" + key);
      log(e);
   }
}

DataBase.prototype.getAllItems = function() {
   log('getAllItems()');
 
   var items = new Array(); 
   
   try {
      for (var count = 0; count < window.localStorage.length; count++) {
         var key = window.localStorage.key(count);
         items.push(this.getItem(key));
      }
   } catch(e) {
      log("Error inside getAllItems() for key:" + key);
      log(e);
   }

   return items;
}


DataBase.prototype.clear = function() {
   window.localStorage.clear();
   log('cleared');
}


