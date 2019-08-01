// pages/subResults/subResults.js
//单选题成绩
const http = require('../../utils/netUtil.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
  rustData: {},
    questionID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      questionID: options.id//试卷ID
      })
    http.postRequest('reply/getUserReplyList', {
    paperId: options.id
    }, function (data) {
      console.log(data)
      that.setData({
        rustData: data.body
      })
      // console.log(data)
    })   
  },
  gpPage() {
    var that = this;
    wx.navigateTo({
      url: '../../pages/analysis/analysis' + "?id=" + that.data.questionID
    })   
  }
})