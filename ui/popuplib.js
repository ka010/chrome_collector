var tabStats = chrome.extension.getBackgroundPage().getTabStats();

function render() {
   var collectedTabs = tabStats.getCollectedTabs();
   var coList = createList(collectedTabs,'tablist1');
   var closedTabs = tabStats.getClosedTabs();
   var clList = createList(closedTabs,'tablist2');

   coList.forEach(function(item) {
      $('.list1').append(item);
   });

   clList.forEach(function(item) {
      $('.list2').append(item);
   });

   $('.listitem').click(function() {
      $("input[value="+this.id+"]").attr('checked',!($("input[value="+this.id+"]").attr('checked')));
   });
   
   $(':checkbox').click(function() {
       $("input[value="+this.value+"]").attr('checked',!($("input[value="+this.value+"]").attr('checked')));
    });

}

function createList(data,id) {
   var list = new Array();
   data.forEach(function(tab) {

      if(tab != null) {
         var thumbSize = "200px"
         if(tab.favIconUrl == undefined || tab.favIconUrl == ""){
            tab.favIconUrl = "icon.png";
         }

         if(tab.thumbnail == undefined){
            tab.thumbnail = "icon.png";
            thumbSize = "100px";
         }

         var item = "<li class='listitem' id='" + tab.tabID + "'><a class='screenshot' rel='"+tab.thumbnail+"' rev='"+thumbSize+"'><div class='"+id+"'><img src='" + tab.favIconUrl + "' alt='favicon' width='20px'/><input class='checkitem' type='checkbox' checked='true' name='" + tab.url + "' value='" + tab.tabID + "'>" + tab.title + "</div></a></li>";
	console.log(tab.title);
         list.push(item);
      }
   });    


   return list;
}

function cleanUp() {
   $(':checked').each(function(x) {
      chrome.tabs.remove(parseInt(this.value));
      $('#'+this.value).hide('slow');
   });
}

function restoreTabs() {
    
             $('.tablist2 > input:checkbox:checked').each(function(i) {
               
               var props = {
                   'url': this.name
               };
                chrome.tabs.create(props);
                
             });
     

  
}
