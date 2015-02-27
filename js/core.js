//从本地存储中获取黑名单
/*var BlackList=[
  {
    "name":'思密客',
    "cover":""
  },
  {
    "name":'宝寿司',
    "cover":""
  },
  {
    "name":'陈掌柜的茶和肉肉',
    "cover":""
  }
]*/
var BlackList=[]
var temp=[]

//更新本度存储中的黑名单
var updateblacklist=function(BlackList){
  chrome.storage.local.set({'blacklist': BlackList});
}

//遇到店名过长的店家，需要切割店名
var cutName=function(shopname){
  if(shopname.length>7){
    return shopname.substr(0,6)+".."
  }else{
    return shopname
  }
}

//过滤黑名单中的店家
var filter=function(){
  for(var i=0;i<BlackList.length;i++){
    $("table tr td").each(function(){
      var blackshop=$(this).children("div")
      if($.trim(blackshop.children(".line-one").children(".info").children(".name").text())==cutName(BlackList[i].name)){
        blackshop.parent().remove()
      }
    }) 
  }
}

//增加黑名单入口
var blackListEntrance="<div class='btn-site-feedback btn-setup-shop' id='blacklist'>拉黑商户</div>"
$(".btn-app-qrcode").before(blackListEntrance)
$("#blacklist").click(function(){
  $(".list").fadeToggle()
  $("ul.blackshoplist li").remove()
  for(var i=0;i<BlackList.length;i++){
    $("ul.blackshoplist").append("<li class='blackshop'><a href='"+BlackList[i].url+"'>"+BlackList[i].name+"</a></li>")
  }
})

//黑名单列表
var list= "<div class='list'><ul class='blackshoplist'></ul></div>"
$("#blacklist").append(list)
$(".list").append("<button id='clearcash' style='z-index:999999'>清空黑名单</button>")
$("#clearcash").click(function(){
  chrome.storage.local.remove('blacklist',function(){
    //console.log('clear')
    window.location.reload()
  })
})
//增加黑名单店铺详情页标识和对应操作按钮
var blockbutton="<div class='rst-block rst-fav'><span class='status' id='block'>拉黑</span></div>"
$(".rst-fav-wrapper").prepend(blockbutton)
var blockshopshow=function(){
  var shopboard="<div class='shopboard'><div style='text-align:center;font-size:20px'>已加入黑名单</div></div>"
  var shophead=$(".restaurant-header")
  shophead.children().prepend(shopboard)
  shophead.css("height","132px")
  var shopslide=$(".rst-fav-wrapper")
  shopslide.css("top","145px")
  shopslide.children('div').children('span').text('取消 拉黑')
}

// 页面初始化
var initalshopshow = function(){
  for(var i=0;i<BlackList.length;i++){
  if(BlackList[i].name==$(".rst-name").text()){
    blockshopshow()
    }
  }
}
chrome.storage.local.get('blacklist', function (result) {
  var dbe=result.blacklist;
	if(dbe == undefined){
   chrome.storage.local.set({'blacklist': temp});
	}else{
    BlackList=dbe
    //需要根据不同页面判断一下，避免执行过多的方法
    if(window.location.href.indexOf("place")!=-1){
      filter()
    }else if(window.location.host=='r.ele.me'){
      initalshopshow()
    }
  }
});

//拉黑按钮操作
var block=function(){
  var shop={
    "name":$(".rst-name").text(),
    "url":window.location.href
  }
  BlackList.push(shop)
  updateblacklist(BlackList)
  blockshopshow()
}
var unblock=function(shopname){
  for(var i=0;i<BlackList.length;i++){
    if(BlackList[i].name==shopname){
      BlackList.splice(i,1)
      $(".shopboard").remove()
      $(".restaurant-header").css('height',"92px")
      $(".rst-fav-wrapper").css("top","106px")
      $("#block").text('拉黑')
      updateblacklist(BlackList)
      break
    }
  }
}
$(".rst-block.rst-fav #block").click(function(){
  if($("#block").text()=='拉黑'){
    block()
  }else{
    unblock($(".rst-name").text())
  }
})