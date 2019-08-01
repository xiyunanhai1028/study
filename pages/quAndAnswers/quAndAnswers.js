//问答题答案
const app = getApp();
const http = require('../../utils/netUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    answersArr:[]
    // paperId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   paperId: options.paperId
    // })
    var that=this
    //请求答案
    http.postRequest('/reply/getOtherUserReplyList', {
      paperId: options.paperId,
      no: ''
    }, function (data) {
      console.log(data)
      that.setData({
        answersArr:data.body
      })
    }) 
  },
})