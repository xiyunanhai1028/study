//快速智能练习
const http = require('../../utils/netUtil.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    optionsID: '',
    tabIndex:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      optionsID: options.id,
      tabIndex:options.tabIndex
    })
  },
  gpPage(event) {
    var that = this
    var tabIndex=that.data.tabIndex
    var type = event.currentTarget.dataset.type
    var questionID = that.data.optionsID
    console.log(tabIndex)
    console.log(type)
    console.log(questionID)
    if (tabIndex==1){//历年真题
      wx.navigateTo({
        url: event.currentTarget.dataset.page + "?id=" + questionID
      })
    } else if (tabIndex == 2){//作业
      if (type == 0) {

      } else if (type == 1) {

      }
      wx.navigateTo({
        url: event.currentTarget.dataset.page + "?id=" + questionID
      })
    } else if (tabIndex == 3) {//历史
      var url=""
      if (type==0){
        url = "../../pages/subResults/subResults" + "?id=" + questionID
      }else if(type==1){
        url = "../../pages/quAndAnswers/quAndAnswers" + "?paperId=" + questionID
      }
      wx.navigateTo({
        url: url
      })
    }
   
  }
})