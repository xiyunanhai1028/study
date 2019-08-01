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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goPage() {
    var that = this;
    http.postRequest('/edu/user/addUserInfoTwo', {
      ids: that.data.checkedList.join(",")
    }, function (data) {
      wx.reLaunch({
        url: '../../pages/Practice/Practice'
      })
    })
  },
  checkboxChange(e) {
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