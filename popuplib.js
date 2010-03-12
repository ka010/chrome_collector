
var tabStats = chrome.extension.getBackgroundPage().getTabStats();
var domainStats = chrome.extension.getBackgroundPage().getDomainStats();


function render() {
   
   var button = "<div class='container'><input type='button' value='Clean Up!' onClick='cleanUp();'/></div>"
   $('body').append(button);
   
   var tabs = tabStats.getCollectedTabs();
   for (count in tabs) {
      if (count != null) {
         var tab = tabs[count];
         var thumb = "<img class='thumb' width='250px' height='250px' src='"+tab.thumbnail+"'/>";
         var item = "<div id ='"+tab.tabID+ "' class='container'><img src='" + tab.favIconUrl + "' alt='favicon'/><input type='checkbox' name='" + tab.url + "' value='" + tab.tabID + "'>" + tab.title + "</div>";
         
         $('body').append(item);
         
         
      } 
    $(":checkbox").attr('checked',true);
   }
   
   $('.container').click(function() {

   $("input[value="+this.id+"]").attr('checked',!($("input[value="+this.id+"]").attr('checked')));
   });

}

function cleanUp() {
    $(':checked').each(function(x) {

        chrome.tabs.remove(parseInt(this.value));
        $('#'+this.value).hide('slow');
     //   $('#'+this.value).remove();
    });
}
