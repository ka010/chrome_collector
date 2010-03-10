
/*
 * Domain statg
 */


function DomainStats () {
   var db = new DataBase();

   this.getDomainData = function(url) {
      var domain = getDomainForURL(url);

      if (db.isItemInDB(domain)) {
         return db.getItem(domain);
      } else {
         return {
            "domain": domain,
            "views": 0,
            "updates": 0,
            "moves": 0,
            "activities": []
         }
      }
   }

   this.setDomainData = function(data) {
     db.setItem(data.domain, data); 
   }

   function getDomainForURL(url) {
      return url.split("/")[2];
   }

}

DomainStats.prototype.addView = function(url) {
   var data = this.getDomainData(url);
   data.views += 1;
   this.setDomainData(data);
}

DomainStats.prototype.addUpdate = function(url) {
   var data = this.getDomainData(url);
   data.updates += 1;
   this.setDomainData(data);
}

DomainStats.prototype.addMove = function(url) {
   var data = this.getDomainData(url);
   data.moves += 1;
   this.setDomainData(data);
}
