// pages/personalInfor1/personalInfor1.js
const http = require('../../utils/netUtil.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    personData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this ;
    http.postRequest('/edu/user/getUserInfoOne', {
    },function(data){
      console.log(data)
      that.setData({
        personData: data.body
      })
    })
  },
  goPage(e){
    console.log('2222', e.target.dataset.data)
    http.postRequest('/edu/user/addUserInfoOne', {
      ids: e.target.dataset.data.id
    }, function (data) {
      //更新保存的用户信息
      wx.setStorageSync('userData', JSON.stringify(data.body));
      wx.navigateTo({
        url: '../../pages/personalInfor2/personalInfor2' + '?id=' + e.target.dataset.data.id
      })      
    })    
  }
})