// pages/openingVIP/openingVIP.js
const http = require('../../utils/netUtil.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  /**
   * 支付功能
   */
  gpPage (){
    // console.log('333')
    // new Date
    var ordercode = this.data.txtOrderCode;
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log('code',res.code)
          http.postRequest('course/orderPay', {
            courseId: '1',
            amount: '15',
            code: res.code
          }, function (res) {
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: 'MD5',
              paySign: res.data.paySign,
              success: function (res) {
                // success
                console.log(res);
              },
              fail: function (res) {
                // fail
                console.log(res);
              },
              complete: function (res) {
                // complete
                console.log(res);
              }
            })
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  }
  
})