//index.js
//引导页
//获取应用实例
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    motto: 'Hi 开发者！',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (!wx.getStorageSync('userData')){
      setTimeout(function(){
        wx.reLaunch({
          url: '../../pages/logOrRegister/logOrRegister'
        })
      },1000)
    }else{
      var status=JSON.parse(wx.getStorageSync('userData')).status
      if (status === 0) {
        setTimeout(function () {
          wx.reLaunch({
            url: '../../pages/personalInfor1/personalInfor1'
          })
        }, 1000)
      } else if (status === 1) {
        setTimeout(function () {
          wx.reLaunch({
            url: '../../pages/personalInfor1/personalInfor1'
          })
        }, 1000)
      } else {
        setTimeout(function () {
          wx.reLaunch({
            url: '../../pages/homePage/homePage'
          })
        }, 1000)
      }
    }
  }
})
