// pages/homePage/homePage.js
const http = require('../../utils/netUtil.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    cardCur: 0,
    bannerImgList: [],
    TabCur: 0,
    scrollLeft: 0 ,
    tabList: [],
    courseList: [] 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    http.postRequest('edu/homepage/index', {
    }, function (data) {
      that.setData({
        bannerImgList: data.body.bannerImgList,
        // tabList: data.body.majorVOList,
        // courseList: data.body.courseList
      })
      console.log(that.data.tabList)
    })
    //获取当前用户喜欢课程Tab列表
    http.postRequest('edu/homepage/getUserTabs', {
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
  } ,
  gpPage(event) {
    wx.navigateTo({
      url: event.currentTarget.dataset.page + "?id=" + event.currentTarget.dataset.id
    })
    console.log(event.currentTarget.dataset.page + "?id=" + event.currentTarget.dataset.id)
  },
  gopageTab(event){
    wx.switchTab({
      url: event.currentTarget.dataset.page
    })
  },
  qiehuan(courseKind){
    var that = this;
    //首页---下半部分tab
    http.postRequest('edu/homepage/getHomePageTab', {
      courseKind: courseKind
    }, function (data) {
      that.setData({
        // bannerImgList: data.body.bannerImgList,
        // tabList: data.body.majorVOList,
        courseList: data.body.courseList
      })
      // console.log(that.data.tabList)
    })   
  }
})