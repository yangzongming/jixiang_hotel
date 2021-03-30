//app.js

var util = require('/utils/util.js')
var networkUtil = require('/utils/networkUtil.js')

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

        wx.setStorageSync("code", res.code);
        networkUtil.NetRequest({
          url: "/api2/wechat/weixinOauth",
          data: {
            code: res.code
          },
          success: function (res1) {
            console.log("App default login:token=");
            console.log(res1);
            wx.setStorageSync("token",res1.data);
            //读取cookie并存储
            if (res.code == 0) {
              //util.saveCookieStorage(res.data.customerId, res.data.openId, 0);
              //getUserInfo(that);
              
              // util.getCustomerInfoData(function (res) {
              //   getApp().globalData.wechatUserInfo = res.data.wechatUserInfo;
              // });
            }
          },
          fail: function (res) {
            console.log("error"+res);
          },
          method: 'GET'
        });

      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    defaultScheduleId:0,
    customer: null,
    wechatUserInfo: wx.getStorageSync('wechatUserInfo'),
    versionNumber: '1.0.2',
    versionCode: 102,
    BASE_URL: "https://iyoukar.com", //正式版
  }
})
