
/**
 * 供外部post请求调用
 */
function post(url, params,onSuccess) {
  request(url, params, "POST", function (){
    wx.showLoading({
      title: '加载中',
    })
  }, onSuccess, function(){
    wx.hideLoading()
  });
}

/**
 * 供外部get请求调用
 */
function get(url, params, onStart, onSuccess, onFailed) {
  request(url, params, "GET", function () {
    wx.showLoading({
      title: '加载中',
    })
  }, onSuccess, function () {
    wx.hideLoading()
  });
}

function getToken(){
  if (wx.getStorageSync('userData')) {
    var token = JSON.parse(wx.getStorageSync('userData')).token;
  } else {
    var token = ''
  }
  return token;
}
/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onStart 开始请求,初始加载loading等处理
 * @onSuccess 成功回调
 * @onFailed  失败回调
 */
function request(url, params, method, onStart, onSuccess, onFailed) {
  onStart(); //request start
  wx.request({
    url: 'https://wq.juren5280.com/strs/' + url,
    data: dealParams(params),
    method: method,
    header: { 
      'content-type': 'application/json',
      'token': getToken() // 默认值
     },
    success: function (res) {
      wx.hideLoading()
      if (res.data) {
        /** start 根据需求 接口的返回状态码进行处理 */
        console.log(res)
        if (res.data.errCode == '200') {
          onSuccess(res.data); //request success
        } else {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 2000
          })          
        }
        /** end 处理结束*/
      }
    },

    fail: function (error) {
      wx.hideLoading()
      wx.showToast({
        title: '网络请求失败',
        icon: 'none',
        duration: 2000
      })  
    }
  })
}

/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
  return params;
}

module.exports = {
  postRequest: post,
  getRequest: get,
}