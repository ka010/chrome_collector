
/*
 * Domain stats
 */


function DomainStats () {
   var db = new DataBase();

   this.addView = function(url) {
      var data = getDomainData(url);
      data.views += 1;
      db.setItem(data.domain, data); 
   }

   this.addUpdate = function(url) {
      var data = getDomainData(url);
      data.updates += 1;
      db.setItem(data.domain, data); 
   }

   this.addMove = function(url) {
      var data = getDomainData(url);
      data.moves += 1;
      db.setItem(data.domain, data); 
   }

   this.getAllDomains = function() {
      var all = db.getAllItems(); 
      domains = all.filter(function(item) {
         console.log(item.domain);
         return (item.domain != undefined);
      });
      return domains;
   }

   getDomainData = function(url) {
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

   function getDomainForURL(url) {
      return url.split("/")[2];
   }

}



DomainStats.prototype.addMove = function(url) {
   var data = this.getDomainData(url);
   data.moves += 1;
   this.setDomainData(data);
}


