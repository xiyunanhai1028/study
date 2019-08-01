// pages/Exercises/Exercises.js
const http = require('../../utils/netUtil.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    courseData: {},
    activeN: '',
    question: 1,
    questionID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      questionID: options.id
    })
    http.postRequest('reply/getPaperDetail', {
      id: options.id,
      testType: 1,
      nextQuestion: 1
    }, function (data) {
      console.log(data)
      that.setData({
        courseData: data.body
      })
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
  gpPage(e) {
    // wx.navigateTo({
    //   url: '../../pages/subResults/subResults'
    // })
    var that = this;
    if (this.data.activeN === '') {
      wx.showToast({
        title: '请选择一个答案',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    } else {
      http.postRequest('reply/pushReply', {
        paperId: Number(that.data.questionID),
        replyId: that.data.question,
        replyType: 1,
        reply: that.data.activeN
      }, function (data) {
        console.log(data)
        that.setData({
          courseData: data.body
        })
        console.log(data)
      })
      if (that.data.question !== 2) {
        this.nextQuestion();
        var num = this.data.question + 1;
        this.setData({
          question: num,
          activeN: ''
        })
      } else {
        wx.navigateTo({
          url: "../../pages/subResults/subResults" + "?id=" + that.data.questionID
        })
      }

    }
  },
  goPage(){
    wx.navigateTo({
      url: "../../pages/OtherAnswers/OtherAnswers"
    })
  },
  touchABCD(event) {
    this.setData({
      activeN: event.currentTarget.dataset.data
    })
  },
  nextQuestion() {
    var that = this;
    http.postRequest('/reply/getPaperDetail', {
      id: that.data.questionID,
      testType: 1,
      nextQuestion: that.data.question
    }, function (data) {
      console.log(data)
      that.setData({
        courseData: data.body
      })
      console.log(data)
    })
  }
})