// pages/quAndAns/quAndAns.js
//问答题
const http = require('../../utils/netUtil.js');
const plugin = requirePlugin("WechatSI")
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()
const app = getApp()
var innerAudioContext = wx.createInnerAudioContext()
var playing = false
var areaWidth //播放进度滑块移动区域宽度
var viewWidth //播放进度滑块宽度
var lastTime //滑块移动间隔计算
function getToken() {
  if (wx.getStorageSync('userData')) {
    var token = JSON.parse(wx.getStorageSync('userData')).token;
  } else {
    var token = ''
  }
  return token;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    isOpen: false,
    j: 1,//帧动画初始图片
    isSpeaking: false,//是否正在说话
    voices: [],//音频数组    
    voice: {
      playing: false, //是否正在播放
      canPlay: false, //是否可以播放、加载完毕
      time: {}, //当前播放时间
      tip: "",
      src: "",
      margin: 0
    },
    activeN: '',
    question: 1,//题目id
    questionID: '',//试卷ID
    courseData: {},
    activeN: '',
    anserWt: '',
    paperTotalNum: 0,
    questionNo:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //第一次进来应该获取节点信息，用来计算滑块长度
    if (areaWidth == undefined || areaWidth == null || viewWidth == undefined || viewWidth == null) {
      var query = wx.createSelectorQuery()
      setTimeout(function () { //代码多的情况下需要延时执行，否则可能获取不到节点信息
        //获取movable的宽度，计算改变进度使用
        query.select('#movable-area').boundingClientRect(function (rect) {
          areaWidth = rect.width
          console.log("areaWidth------->", areaWidth)
        }).exec()
        query.select('#movable-view').boundingClientRect(function (rect) {
          viewWidth = rect.width // 节点的宽度
          console.log("viewWidth------->", viewWidth)
        }).exec()
      }, 1000)
    }

    this.initRecord()
    //语音权限
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.record']) {
          console.log('2')
        } else {
          console.log("44444")
          // that.openConfirm();
          wx.authorize({
            scope: 'scope.record',
            success() {
              console.log('3333')
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
            }
          })

        }
      }
    })
    this.setData({
      questionID: options.id
    })
    http.postRequest('/reply/getPaperDetail', {
      id: options.id,
      testType: 2,
      nextQuestion: 1
    }, function (data) {
      console.log(data)
      that.audioContent(data.body.questionContent)
      that.setData({
        courseData: data.body,
        question: data.body.id,
        questionNo: data.body.questionNo,
        paperTotalNum: data.body.paperTotalNum
      }) 
    }) 
     
  },
  /**
   * 语音设置值
   */
  audioContent(content){
    var that=this
    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: content,
      success: function (res) {
        console.log("succ tts", res.filename)
        that.setData({
          voice: {
            playing: false, //是否正在播放
            canPlay: false, //是否可以播放、加载完毕
            time: {}, //当前播放时间
            tip: "",
            src: res.filename,
            margin: 0
          },
        })
        that.initLUyin(that);
      },
      fail: function (res) {
        console.log("fail tts", res)
        wx.showToast({
          title: res,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //移动结束再setData，否则真机上会产生 “延迟重放” 
  seekTouchEnd: function (e) {
    var that = this
    setTimeout(function () {
      that.setData({
        voice: that.data.voice
      })
      innerAudioContext.seek(innerAudioContext.duration * (that.data.voice.progress / 100))
      innerAudioContext.play()
    }, 300)
  },
  //移动音频滑块，此处不能设置moveable-view 的x值，会有冲突延迟
  voiceSeekMove: function (e) {
    var that = this
    if (e.detail.source == "touch") {
      innerAudioContext.stop()
      console.log(e)
      if (that.data.voice.canPlay) {
        var progress = Math.round(e.detail.x / (areaWidth - viewWidth) * 100)
        that.data.voice.progress = progress
        that.data.voice.margin = e.detail.x
        that.data.voice.time = dateformat(Math.round(innerAudioContext.duration * (that.data.voice.progress / 100)))
      }
    }
  },
  //点击播放、暂停
  voiceClick: function () {
    var playing2 = this.data.voice.playing
    if (playing2) {
      innerAudioContext.pause()
    } else {
      innerAudioContext.play()
    }
  },
  openConfirm: function () {
    wx.showModal({
      content: '检测到您没打开录音机权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      confirmColor: "#64A9EC",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  }, 
  openLuyin() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.record']) {
          if (that.data.isOpen) {
            that.setData({
              isOpen: false
            })
          } else {
            that.setData({
              isOpen: true
            })
          }
        } else {
          that.openConfirm();
        }
      }
    })    
  },
  //手指按下
  touchdown: function () {
    manager.start({
      lang: "zh_CN",
    })
    this.setData({
      isSpeaking: true
    })
    console.log("手指按下了...")
    speaking.call(this);
  },
  //手指抬起
  touchup: function () {
    manager.stop()
    this.setData({
      isSpeaking: false,
    })
  },
  //点击播放录音
  gotoPlay: function (e) {
    var filePath = e.currentTarget.dataset.key;
    //点击开始播放
    wx.showToast({
      title: '开始播放',
      icon: 'success',
      duration: 1000
    })
    wx.playVoice({
      filePath: filePath,
      success: function () {
        wx.showToast({
          title: '播放结束',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  bindKeyInput(e) {
    console.log('bindKeyInput', e)
    this.setData({
      activeN: e.detail.value
    })
  },
  nextWT() {
    var  that = this;
    console.log(this.data.anserWt)
    if (this.data.anserWt === ''){
      wx.showToast({
        title: '请先回答问题',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    }else{
      //提交答案
      http.postRequest('reply/pushReply', {
        paperId: Number(that.data.questionID),
        replyId: that.data.question,
        replyType: 2,
        reply: this.data.anserWt
      }, function (data) {
        console.log(data)

        if (that.data.question !== that.data.paperTotalNum) {
          var num = that.data.questionNo + 1;
          that.setData({
            questionNo: num,
            anserWt: '',
            activeN: ''
          })
          that.nextQuestion();
        } else {
          wx.showToast({
            title: '提交答案成功',
            icon: 'none',
            mask: true,
            duration: 2000
          })
          // wx.switchTab({
          //   url: "../../pages/quAndAnswers/quAndAnswers"
          // })
          wx.redirectTo({
            url: '../../pages/quAndAnswers/quAndAnswers?paperId=' + that.data.questionID
          })
        } 
        
      })    
    }
  },
  sendWT(){
    var that = this;
    this.setData({
      anserWt: that.data.activeN,
      activeN: ''
    })
  },
  /**
   * 下一题
   */
  nextQuestion() {
    var that = this;
    console.log("----------")
    console.log(that.data.questionID, that.data.questionNo)
    http.postRequest('/reply/getPaperDetail', {
      id: that.data.questionID,
      testType: 2,
      nextQuestion: that.data.questionNo
    }, function (data) {
      console.log(data)
      that.setData({
        courseData: data.body,
        question: data.body.id,
        questionNo: data.body.questionNo
      })
    })
  },

  /**
   * 识别内容为空时的反馈
   */
  showRecordEmptyTip: function () {
    wx.showToast({
      title: "录音未成功",
      icon: 'success',
      image: '/image/no_voice.png',
      duration: 1000,
      success: function (res) {

      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  /**
   * 初始化语音识别回调
   * 绑定语音播放开始事件
   */
  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      // let currentData = Object.assign({}, this.data.currentTranslate, {
      //   text: res.result,
      // })
      // this.setData({
      //   currentTranslate: currentData,
      // })
      // this.scrollToNew();
    }

    // 识别结束事件
    manager.onStop = (res) => {

      let text = res.result

      if (text == '') {
        this.showRecordEmptyTip()
        return
      }

      // let lastId = this.data.lastId + 1
      console.log(res.result)
      let currentData = Object.assign({}, {
        text: res.result,
        voicePath: res.tempFilePath
      })

      this.setData({
        activeN: res.result
      })

      // this.scrollToNew();

      // this.translateText(currentData)
    }

    // 识别错误事件
    manager.onError = (res) => {

      // this.setData({
      //   recording: false,
      //   bottomButtonDisabled: false,
      // })

    }

    // 语音播放开始事件
    wx.onBackgroundAudioPlay(res => {

      const backgroundAudioManager = wx.getBackgroundAudioManager()
      let src = backgroundAudioManager.src

      this.setData({
        currentTranslateVoice: src
      })

    })
  },  
  /**
   * 翻译
   */
  translateText: function (item) {
    let lfrom = item.lfrom || 'zh_CN'
    let lto = item.lto || 'en_US'
    console.log(item)
    plugin.translate({
      lfrom: 'zh_CN',
      lto: 'zh_CN',
      content: item.text,
      tts: true,
      success: (resTrans) => {

        let passRetcode = [
          0, // 翻译合成成功
          -10006, // 翻译成功，合成失败
          -10007, // 翻译成功，传入了不支持的语音合成语言
          -10008, // 翻译成功，语音合成达到频率限制
        ]
        console.log(resTrans)
        // if (passRetcode.indexOf(resTrans.retcode) >= 0) {
        //   let tmpDialogList = this.data.dialogList.slice(0)

        //   if (!isNaN(index)) {

        //     let tmpTranslate = Object.assign({}, item, {
        //       autoPlay: true, // 自动播放背景音乐
        //       translateText: resTrans.result,
        //       translateVoicePath: resTrans.filename || "",
        //       translateVoiceExpiredTime: resTrans.expired_time || 0
        //     })

        //     tmpDialogList[index] = tmpTranslate


        //     this.setData({
        //       dialogList: tmpDialogList,
        //       bottomButtonDisabled: false,
        //       recording: false,
        //     })

        //     this.scrollToNew();

        //   } else {
        //     console.error("index error", resTrans, item)
        //   }
        // } else {
        //   console.warn("翻译失败", resTrans, item)
        // }

      },
      fail: function (resTrans) {
        console.error("调用失败", resTrans, item)
        // this.setData({
        //   bottomButtonDisabled: false,
        //   recording: false,
        // })
      },
      complete: resTrans => {
        // this.setData({
        //   recordStatus: 1,
        // })
        // wx.hideLoading()
      }
    })

  }, 
  initLUyin (that) {
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = that.data.voice.src
    //播放
    console.log("播放-->", that.data.voice.src)
    innerAudioContext.obeyMuteSwitch = false
    innerAudioContext.autoplay = false
    innerAudioContext.onPlay(() => {
      console.log('onPlay')
      playing = true
      that.data.voice.tip = "Playing"
      that.data.voice.playing = true
      that.data.voice.canPlay = true //加载完成后可以
      that.setData({
        voice: that.data.voice
      })
    })
    innerAudioContext.onStop(() => {
      console.log('onStop')
      playing = false
      that.data.voice.tip = "Stop"
      that.data.voice.playing = false

      that.setData({
        voice: that.data.voice
      })
    })
    innerAudioContext.onPause(() => {
      console.log('Pause')
      playing = false
      that.data.voice.tip = "Pause"
      that.data.voice.playing = false
      that.setData({
        voice: that.data.voice
      })
    })
    //播放进度
    innerAudioContext.onTimeUpdate(() => {
      that.data.voice.progress = Math.round(100 * innerAudioContext.currentTime / innerAudioContext.duration)
      that.data.voice.time = dateformat(Math.round(innerAudioContext.currentTime))
      that.data.voice.margin = Math.round((areaWidth - viewWidth) * (innerAudioContext.currentTime / innerAudioContext.duration)) //计算当前滑块margin-left
      console.log('进度', innerAudioContext.currentTime + "  " + innerAudioContext.duration)
      that.setData({
        voice: that.data.voice
      })
    })
    //播放结束
    innerAudioContext.onEnded(() => {
      console.log("onEnded")
      playing = false
      that.data.voice.progress = 100
      that.data.voice.tip = "End Playing"
      that.data.voice.playing = false
      that.data.voice.time = dateformat(Math.round(innerAudioContext.duration))
      that.data.voice.margin = Math.round(areaWidth - viewWidth)
      that.setData({
        voice: that.data.voice
      })

    })
    //播放错误
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      playing = false
      that.data.voice.tip = "Error Playing"
      that.data.voice.playing = false
      that.setData({
        voice: that.data.voice
      })
      wx.showToast({
        title: '错误:' + res.errMsg,
        icon: "none"
      })
    })    
  }  
})

function dateformat(second) {
  //天
  var day = Math.floor(second / (3600 * 24))
  // 小时位
  var hour = Math.floor((second - day * 3600 * 24) / 3600);
  // 分钟位
  var min = Math.floor((second - day * 3600 * 24 - hour * 3600) / 60);
  // 秒位
  var sec = (second - day * 3600 * 24 - hour * 3600 - min * 60); // equal to => var sec = second % 60;

  return {
    'day': day,
    'hour': p(hour),
    'min': p(min),
    'sec': p(sec)
  }
}
//创建补0函数
function p(s) {
  return s < 10 ? '0' + s : s;
}

//麦克风帧动画
function speaking() {
  var _this = this;
  //话筒帧动画
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 5;
    _this.setData({
      j: i
    })
  }, 200);
}