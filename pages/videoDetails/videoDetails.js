// pages/videoDetails/videoDetails.js
const http = require('../../utils/netUtil.js');
const imgUrl ="https://wq.juren5280.com/eduOnline/";
function getUserData() {
  if (wx.getStorageSync('userData')) {
    var token = JSON.parse(wx.getStorageSync('userData'));
  } else {
    var token = ''
  }
  return token;
}
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    scrollLeft: 0 ,
    navList: ['详情', '目录'],
    courseData: {},
    userData: getUserData(),
    courseId:'',
    videoSrcArr: [],//视频集合
    index: 0,//下标
    src: '',
    isVip:false,//是否已经购买VIP
    chcekedArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var courseId = options.id;
    this.setData({
      userData: getUserData(),
      courseId: courseId
    })

    //判断是否是已经购买VIP
    var isVip = this.data.userData.courseList.indexOf(courseId) == -1 ? false : true
    this.setData({
      isVip: isVip
    })
    
    var that = this;
    http.postRequest('course/detail', {
      courseId: this.data.courseId
    }, function (data) {
      console.log(data)
      var courseCategory=data.body.courseCategory
      var chcekedArr=[]
      for (var i = 0; i < courseCategory.length;i++){
        chcekedArr.push(false)
      }
      that.setData({
        courseData: data.body,
        videoSrcArr: data.body.courseCategory,
        chcekedArr: chcekedArr,
        src: imgUrl+data.body.courseCategory[0].mediaUrl
      })
      that.currentPlayIndex(that.data.index);
    })
  },
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')//视频管理组件
  },
  /**
   * // 视频播放结束后执行的方法
   */
  videoEnd: function (res){
    var that = this
    if (that.data.index == that.data.videoSrcArr.length){//播放完成
      that.setData({
        index:1
      })
      this.videoContext.pause()  //暂停
    }else{//还有下一个视频
      var index=that.data.index+1
      that.currentPlayIndex(index);
      that.videoPlay(index)
    }

  },
  videoPlay: function (index){
    var that = this;
    that.setData({
      index: index,
      src: imgUrl + that.data.videoSrcArr[index].mediaUrl
    })
    this.videoContext.autoplay = true//设置自动播放
    this.videoContext.play()//播放视频
  },
  isOpenVipED(){
    wx.showToast({
      title: '请先去开通线上vip',
      mask: true,
      icon: 'none',
      duration: 2000
    })   
  },
   tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  } ,
  //调用支付接口
  gpPage(){
    //courseId:VIP课程id  amount:价格  code
    var courseId = this.data.courseId;
    var amount="0.1";
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log("code:" + res.code);
          http.postRequest('course/orderPay', {
            code: res.code,//要去换取openid的登录凭证
            courseId: courseId,
            amount: amount
          }, function (data) {
            console.log(data)
            wx.requestPayment({
              timeStamp: data.body.timeStamp,
              nonceStr: data.body.nonceStr,
              package: data.body.pkg,
              signType: 'MD5',
              paySign: data.body.paySign,
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
  },
    onShareAppMessage(res) {
      console.log(this.data.courseId)
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: this.data.courseData.courseName,
        path: '/pages/index/index'
      }
    },
  itemHandler(res){
    var index = res.target.dataset.index
    this.currentPlayIndex(index)
    this.videoPlay(index)
  },
  /**
   * 设置当前播放的位置
   */
  currentPlayIndex(index){
    var chcekedArr = this.data.chcekedArr
    for (var i = 0; i < chcekedArr.length; i++) {
      if (i === index) {
        chcekedArr[i] = true;
      } else {
        chcekedArr[i] = false;
      }
    }
    this.setData({
      chcekedArr: chcekedArr
    })
  }
})