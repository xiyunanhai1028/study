// pages/Practice/Practice.js
//练习页面
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
    tabList: [] ,
    index:1,
    paperType: 1,//1:公务员 2: 事业单位 3：银行考试 4：政法干警考试 5：教师资格证 6：教师招聘 7：选调研究生 8：公务员（省考）
    paperTypeArr:[
      {
        id:1,
        name:"公务员"
      },
      {
        id: 2,
        name: "事业单位"
      },
      {
        id: 3,
        name: "银行考试"
      },
      {
        id: 4,
        name: "政法干警考试"
      },
      {
        id: 5,
        name: "教师资格证"
      },
      {
        id: 6,
        name: "教师招聘"
      },
      {
        id: 7,
        name: "选调研究生"
      },
      {
        id: 8,
        name: "公务员（省考）"
      },
    ]   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    http.postRequest('edu/homepage/getUserTabs', {
    }, function (data) {
      console.log(data)
      that.setData({
        // bannerImgList: data.body.bannerImgList,
        tabList: data.body,
        // courseList: data.body.courseList
      })
      that.qiehuan(data.body[0].id)
      that.setData({
        paperType: data.body[0].id
      })
    })      
  },
  tabSelect(e) {
    console.log(e);
    var that = this;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.setData({
      paperType: that.data.tabList[e.currentTarget.dataset.id].id
    })
    // this.qiehuan(this.data.tabList[e.currentTarget.dataset.id].id)
    this.qiehuan();
  }, 
  /**
   * 点击试题
   */
  gpPage(event) {
    wx.navigateTo({
      url: event.currentTarget.dataset.page + "?id=" + event.currentTarget.dataset.id 
    })
  },
  goPage(event) {
    var that = this;
    var index = String(event.target.dataset.index)
    that.setData({
      index:index
    })
    console.log(event)
    that.qiehuan();
    
  },  
  /**
   * 切换
   */
  qiehuan() {
    var that=this
    var index=this.data.index
    var paperType = this.data.paperType
    console.log(paperType)
    console.log(index)
    http.postRequest('reply/getPaperList', {
      paperType: paperType,//1:公务员 2: 事业单位 3：银行考试 4：政法干警考试 5：教师资格证 6：教师招聘 7：选调研究生 8：公务员（省考）
      publishId: index//1:历史真题2:作业3:历史回答
    }, function (data) {
      that.setData({
        PaperList: data.body
      })
    })
  },
  itemHandler(event){
    var id = event.currentTarget.dataset.id
    var index=this.data.index
    console.log(event)
    // data - page='{{"../../pages/biAndMian/biAndMian"}}'
    wx.navigateTo({
      url: '../../pages/biAndMian/biAndMian?id='+id+"&tabIndex="+index
    })
  }
})