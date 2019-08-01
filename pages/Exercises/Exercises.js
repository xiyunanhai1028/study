// pages/Exercises/Exercises.js
//单选题库
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
    question: 1,//题目id
    questionID: '',//试卷ID
    paperTotalNum: '',
    questionNo:0
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
        courseData: data.body,
        question:data.body.id,
        questionNo: data.body.questionNo,
        paperTotalNum: data.body.paperTotalNum
      })
    })
  },
  gpPage(e) {
    var that = this;
    if(this.data.activeN === ''){
      wx.showToast({
        title: '请选择一个答案',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    }else{
      //提交答案
      http.postRequest('reply/pushReply', {
        paperId: Number(that.data.questionID),//回答试卷Id
        replyId: that.data.question,//题目id
        replyType: 1,//回答类型1:选择题2：问答题文字答案3:问答题语音答案
        reply: that.data.activeN//选择答案 如: "B" 问答题回答:文字->传文字 ；语音——>传URL
      }, function (data) {
        console.log(data)
        if (that.data.questionNo < that.data.paperTotalNum) {//是否是最后一道题
          var num = that.data.questionNo + 1;
          that.setData({
            questionNo: num,
            activeN: ''
          })
          that.nextQuestion();
        } else {
          wx.redirectTo({
            url: "../../pages/subResults/subResults" + "?id=" + that.data.questionID
          })
        }
      })          
     

    }
  },
  touchABCD(event){
    this.setData({
      activeN: event.currentTarget.dataset.data
    })
  },
  /**
   * 下一题
   */
  nextQuestion(){
    var that = this;
    console.log("-----------------")
    console.log(that.data.questionID, that.data.questionNo)
    http.postRequest('/reply/getPaperDetail', {
      id: that.data.questionID,
      testType: 1,
      nextQuestion: that.data.questionNo
    }, function (data) {
      console.log(data)
      that.setData({
        courseData: data.body,
        question: data.body.id,
        questionNo: data.body.questionNo
      })
    })    
  }
})