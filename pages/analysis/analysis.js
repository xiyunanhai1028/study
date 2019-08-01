// pages/analysis/analysis.js
//单选题答案
const http = require('../../utils/netUtil.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    rustData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.id)
    http.postRequest('reply/getUserReplyList', {
      paperId: options.id
    }, function (data) {
      console.log(data)
      that.setData({
        rustData: data.body
      })
    })   
  }
})