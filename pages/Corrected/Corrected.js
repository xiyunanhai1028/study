// pages/Practice/Practice.js
const http = require('../../utils/netUtil.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    scrollLeft: 0,
    PaperList: [],
    tabList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    http.postRequest('edu/user/getUserInfoTwo', {
    }, function (data) {
      that.setData({
        // bannerImgList: data.body.bannerImgList,
        tabList: data.body,
        // courseList: data.body.courseList
      })
      that.qiehuan(data.body[0].id)
      console.log(data)
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
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.qiehuan(this.data.tabList[e.currentTarget.dataset.id].id)
  },
  gpPage(event) {
    wx.navigateTo({
      url: event.currentTarget.dataset.page + "?id=" + event.currentTarget.dataset.id
    })
    console.log(event.currentTarget.dataset.page + "?id=" + event.currentTarget.dataset.id)
  },
  qiehuan(courseKind) {
    var that = this;
    http.postRequest('reply/getPaperList', {
      "paperType": 1,
      "publishId": 1
    }, function (data) {
      that.setData({
        PaperList: data.body
      })
    })
  }
})