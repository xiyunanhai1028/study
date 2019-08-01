// pages/offlineAddress/offlineAddress.js
//线下VIP
const http = require('../../utils/netUtil.js');
const wxPay=require('../../utils/pay.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    viplist:[],
    totalMoney:0,//需要支付的总钱数
    courseIds:[],//支付是所需要的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    http.postRequest('course/getVipOffline', {}, function (data) {
      console.log(data);
      that.setData({
        viplist: data.body
      })
    })
  },
  checkboxHandler(res){
    console.log(res)
    var checkeds=res.detail.value
    var totalMoney=0
    var courseIdArr=[]
    for(var i=0;i<checkeds.length;i++){
      totalMoney+=this.data.viplist[checkeds[i]].money
      courseIdArr[checkeds[i]] = this.data.viplist[checkeds[i]].id
    }
    // totalMoney += this.data.viplist[checkeds[i]].orderNum
    // courseIdArr[checkeds[i]] = this.data.viplist[checkeds[i]].id
    this.setData({
      totalMoney: totalMoney,
      courseIds: courseIdArr
    })
  },
  /**
   * 支付
   */
  gpPage(event) {
    // wx.navigateTo({
    //   url: event.currentTarget.dataset.page
    // })

    var id = this.data.courseIds[0]
    if (this.data.totalMoney===0){
      wx.showToast({
        title: '请选择课程',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return
    }
    var ids=''
    for (var i = 0; i < this.data.courseIds.length;i++){
      if (i === this.data.courseIds.length-1){
        ids += this.data.courseIds[i]
      }else if (this.data.courseIds[i]!=null){
        ids += this.data.courseIds[i] + ","
      }
    }
    var price = this.data.totalMoney
    console.log("ids:", ids, "price:", price)
    wxPay.wxPay(ids,price);
  }    
})