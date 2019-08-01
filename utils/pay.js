const http = require('./netUtil.js');
function wxPay(courseId, amount){
  //courseId:VIP课程id  amount:价格  code
  var courseId = courseId;
  var amount = amount;
  wx.login({
    success: function (res) {
      if (res.code) {
        console.log("code:" + res.code);
        http.postRequest('course/orderPayOffline', {
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
}

module.exports={
  wxPay: wxPay
}