// pages/personalInfor2/personalInfor2.js
const http = require('../../utils/netUtil.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    personData: [],
    checkedList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    http.postRequest('edu/user/getUserInfoMap', {
      type: options.id
    }, function (data) {
      console.log(data)
      that.setData({
        personData: data.body
      })
    })
  },
  goPage() {
    var that = this;
    console.log(that.data.checkedList);
    if (that.data.checkedList == null || that.data.checkedList.length==0){
      wx.showToast({
        title: '请选择选择你感兴趣的专业',
        icon:'none',
        duration: 2000
      });
      return;
    }
    http.postRequest('/edu/user/addUserInfoTwo', {
      ids: that.data.checkedList.join(",")
    }, function (data) {
      // if (wx.getStorageSync('userData')) {
      //   var userData = JSON.parse(wx.getStorageSync('userData'));
      //   userData.status=2
      //   wx.setStorageSync('userData', JSON.stringify(userData));
      // } 
      console.log(data)
      //更新保存的用户信息
      wx.setStorageSync('userData', JSON.stringify(data.body));
      wx.reLaunch({
        url: '../../pages/homePage/homePage'
      })
    })    
  },
  checkboxChange(e){
    var that = this;
    console.log(e)
    // if (e.detail.checked){
      this.setData({
        checkedList: e.detail.value
      })
    // }
    console.log(that.data.checkedList)
  }  
})