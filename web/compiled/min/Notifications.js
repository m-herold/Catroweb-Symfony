function Notification(notifications,unseenRemixesGroupedLength,markAsReadUrl,markAllAsReadUrl,popUpClearedAllMessagesTitle,popUpClearedAllMessagesText,somethingWentWrongError,notificationsClearError){let self=this;self.notifications=notifications,self.unseenRemixesGroupedLength=unseenRemixesGroupedLength,self.markAsReadUrl=markAsReadUrl,self.popUpClearedAllMessagesTitle=popUpClearedAllMessagesTitle,self.popUpClearedAllMessagesText=popUpClearedAllMessagesText,self.somethingWentWrongError=somethingWentWrongError,self.notificationsClearError=notificationsClearError,self.init=function(){let markAllAsSeenButton=$("#mark-all-as-seen");0===self.unseenRemixesGroupedLength+self.notifications?(markAllAsSeenButton.hide(),$(".no-notifications-placeholder").show()):$(".no-notifications-placeholder").hide(),markAllAsSeenButton.click(self.markAllNotificationAsRead),$(".notification-link").click(function(){let programLayer=$(this).parent(".program"),parentProgramsLayer=programLayer.parent(".programs"),remixedProgramsLayer=parentProgramsLayer.parent(".remixed-programs");return programLayer.remove(),0===parentProgramsLayer.children().length&&(remixedProgramsLayer.remove(),0===$("#notifications").children().length&&($("#mark-all-as-seen").hide(),$(".no-notifications-placeholder").show())),window.location=$(this).attr("href"),!0})},self.markAllNotificationAsRead=function(){$.ajax({url:markAllAsReadUrl,type:"get",success:function(data){data.success?(self.clearAll(),self.showAllClearedPopUp()):swal(somethingWentWrongError,notificationsClearError,"error")},error:function(){swal(somethingWentWrongError,notificationsClearError,"error")}})},self.markAsRead=function(id){$.ajax({url:self.markAsReadUrl+"/"+id,type:"get",success:function(data){data.success?(self.notifications--,self.updateNotificationAmountText(),self.updateBadgeNumber(),$("#catro-notification-"+id).fadeOut(function(){$("#catro-notification-"+id).parent().remove(),0===$("#notifications-container").children().length&&(self.clearAll(),self.showAllClearedPopUp())})):swal(somethingWentWrongError,notificationsClearError,"error")},error:function(){swal(somethingWentWrongError,notificationsClearError,"error")}})},self.updateBadgeNumber=function(){let userNotificationBadge=$(".user-notification-badge"),current_number=userNotificationBadge.data("badge");current_number>1&&userNotificationBadge.data("badge",current_number-1)},self.updateNotificationAmountText=function(){let translations=[];translations.push({key:"%amount%",value:self.notifications});let url=Routing.generate("translate_choice",{word:"catro-notifications.summary",count:self.notifications,array:JSON.stringify(translations),domain:"catroweb"});$.get(url,function(data){$("#notifications-summary").show(),$("#total_amount_of_notifications").text(data)})},self.clearAll=function(){$("#notifications").children().remove(),$("#notifications-container").children().remove(),$("#notifications-summary").hide(),$("#mark-all-as-seen").hide(),$(".user-notification-badge").removeAttr("data-badge"),$(".no-notifications-placeholder").show()},self.showAllClearedPopUp=function(){swal({title:self.popUpClearedAllMessagesTitle,text:self.popUpClearedAllMessagesText,type:"success",confirmButtonClass:"btn btn-success"})}}