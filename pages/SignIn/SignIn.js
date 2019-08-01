// pages/SignIn/SignIn.js
//登录页面
const http = require('../../utils/netUtil.js');
const app = getApp();
function getUserData() {
  if (wx.getStorageSync('userData')) {
    var token = JSON.parse(wx.getStorageSync('userData'));
  } else {
    var token = ''
  }
  return token;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    mobile: '',
    password: '',
    userData: {},
    
  },
  onLoad:function(){
   
  },
  gpPage() {
    var that = this;
    if (that.data.mobile === '') {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.password === '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    console.log(that.data.mobile, that.data.password)
    http.postRequest('/edu/user/login', {
      mobile: that.data.mobile,
      password: that.data.password,
    }, function (data) {
      console.log(data)
      wx.showToast({
        title: '登录成功',
        mask: true,
        icon: 'none',
        duration: 2000
      })
      that.setData({
        userData: data.body
      })
      wx.setStorageSync('userData', JSON.stringify(data.body));
      console.log(data.body.status)
      //完善信息状态0 未完成1 完成信息12全部完成 3:老师
      if(data.body.status === 0){
        setTimeout(function () {
          wx.reLaunch({
            url: '../../pages/personalInfor1/personalInfor1'
          })
        }, 1500)
      } else if (data.body.status === 1){
        setTimeout(function () {
          wx.reLaunch({
            url: '../../pages/personalInfor1/personalInfor1'
          })
        }, 1500)
      }else{
        setTimeout(function () {
          wx.reLaunch({
            url: '../../pages/homePage/homePage'
          })
        }, 1500)
      }
    })            
  },
  mobileInput(e) {
    console.log(e.detail.value)
    this.setData({
      [e.target.id]: e.detail.value
    })
  }      
})