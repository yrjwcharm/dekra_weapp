// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');


cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var randSum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  // return '{"status":"fail","msg":"短信验证码为 ' + randSum + '"}';
  let options = {
    method: 'get',
    url: "https://app.szjj.sz.gov.cn:8092/moti/appoint/book/sendSmsCode?mobile=" + event.a+'&verCode='+event.c,
    headers: {
      "Referer": "https://app.szjj.sz.gov.cn:8092/moti/appoint/book/smsUI?code=",
      "Cookie": event.b
      // 'User-Agent': 'Request-Promise'
    },
    rejectUnauthorized: false,
  };


  return await rp(options)
    .then(function (res) {
      if (res) {
        console.log(333,res);
        //res = res.replace(/请稍后再试或前往检测站咨询工作人员完成预约/, "短信验证码功能暂停,请填写任意数字作为验证码");
        //return res;
        let response = JSON.parse(res);
        let status = "fail";
        if (response.ok) {
          status = "success";
        }
        return '{ "status": "' + status + '", "msg": "' + response.msg + '" }';
      } else {
        return '{ "status": "success", "msg": "短信验证码为"' + randSum + ' }';
      }
    })
    .catch(function (err) {
      return '{ "status": "fail", "msg": "短信验证码为"' + randSum + ' }';
    });
}
