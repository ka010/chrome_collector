
var tabStats = chrome.extension.getBackgroundPage().getTabStats();
var domainStats = chrome.extension.getBackgroundPage().getDomainStats();


function render() {

   var tabs = tabStats.getCollectedTabs();
   for (count in tabs) {
      if (count != null) {
         var tab = tabs[count];

		 var thumbSize = "200px"
		 if(tab.favIconUrl == undefined || tab.favIconUrl == ""){
			tab.favIconUrl = "icon.png";
		 }
		 if(tab.thumbnail == undefined){
		 tab.thumbnail = "icon.png";
		 thumbSize = "100px";
		 }
         var item = "<li class='listitem' id='" + tab.tabID + "'><a class='screenshot' rel='"+tab.thumbnail+"' rev='"+thumbSize+"'><div id='shadow-container'><img src='" + tab.favIconUrl + "' alt='favicon' width='20px'/><input type='checkbox' name='" + tab.url + "' value='" + tab.tabID + "'>" + tab.title + "</div></a></li>";
         $('.list').append(item);
         
      } 
      $(":checkbox").attr('checked',true);
   }

   $('.listitem').click(function() {
      $("input[value="+this.id+"]").attr('checked',!($("input[value="+this.id+"]").attr('checked')));
   });

}

function cleanUp() {

    $(':checked').each(function(x) {

        chrome.tabs.remove(parseInt(this.value));
        $('#'+this.value).hide('slow');
     //$('#'+this.value).remove();
    });
}
