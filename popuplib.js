
function DB() {
  this.db = chrome.extension.getBackgroundPage().getDB(); 
}

DB.prototype.getItem = function(key) {
  return this.db.getItem(key); 
}

DB.prototype.setItem= function(key, value) {
  this.db.setItem(key, value); 
}


DB.prototype.removeItem = function(key) {
  this.db.removeItem(key); 
}

DB.prototype.clear = function(key) {
  this.db.clear(); 
}


log = function(txt) {
   if(logging) {
      console.log(txt);
   }
}