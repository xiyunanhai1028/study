// pages/purchaseRecord/purchaseRecord.js
const http = require('../../utils/netUtil.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    courseList: [],
    pageNo: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    http.postRequest('course/getOrderHistory', {
      // pageNo: 1,
      // pageSize: 15,
      // courseType: 1
    }, function (data) {
      that.setData({
        courseList: data.body
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
  // onReachBottom() {
  //   var that = this;
  //   // console.log(that.data)   
  //   http.postRequest('course/getOrderHistory', {
  //     pageNo: that.data.pageNo,
  //     pageSize: 15,
  //     courseType: 1
  //   }, function (data) {
  //     that.setData({
  //       courseList: [...that.data.courseList, ...data.body.dataList]
  //     })
  //     var pageNUM = that.data.pageNo + 1;
  //     that.setData({
  //       pageNo: pageNUM
  //     })
  //   })

  // }  
})