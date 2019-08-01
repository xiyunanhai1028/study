// pages/register/register.js
const http = require('../../utils/netUtil.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    text: '获取验证码',
    isHq: false,
    mobile: '',
    password: '',
    verifyCode: '',
    interval:'',//定时器
  },
  gpPage(e){
    //停止定时器
    clearInterval(this.data.interval)
    console.log(e)
    if(this.data.mobile === ''){
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none',
        mask: true,
        duration: 2000
      }) 
      return;      
    }
    if (this.data.verifyCode === '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return;
    }
    if (!this.data.isHq) {
      wx.showToast({
        title: '未获取验证码',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return;
    } 
    if (this.data.password === '') {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      return;
    }      
    http.postRequest('/edu/user/register', {
      mobile: this.data.mobile,
      password: this.data.password,
      verifyCode: this.data.verifyCode
    },function(data){
      console.log(data)
      wx.showToast({
        title: data.body + ',请去登录',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '../../pages/logOrRegister/logOrRegister'
        })
      },1500)
    })          
  },
  /**
   * 获取验证码
   */
  verificateCode(){
    var that = this;
    //调用倒计时
    that.interval();
    http.postRequest('/edu/user/sendVerificateCode', {
      mobile: that.data.mobile
    },function(data){
      console.log(data)
     
    })},
    /**
     * 倒计时
     */
    interval(){
      var that = this;
      //倒计时
      that.setData({
        isHq: true,
        text: '60s'
      })
      var time = 0;
      var interval = setInterval(function () {
        if (time == 60) {
          that.setData({
            text: '获取验证码',
            isHq: false,
          })
          clearInterval(interval)
          return;
        }
        that.setData({
          interval: interval
        })
        time++;
        that.setData({
          text: 60 - time + 's'
        })
      }, 1000)      
    },
    /**
     * 监听输入框输入
     */
    mobileInput(e){
      this.setData({
        [e.target.id]: e.detail.value 
      })
    }
})