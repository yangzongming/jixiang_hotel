// pages/login/login.js
var util = require('../../utils/util.js')
var networkUtil = require('../../utils/networkUtil.js')
var TAG = "auth.js"
var THIS = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    THIS = this;
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

  //用户选择了输入手机号来登录
  clickPhoneNumberLogin: function(){
    wx.navigateTo({
      url: '/pages/bindcard/bindcard',
    })
  },
  //授权取得用户手机号
  getPhoneNumber: function(e){
    var token = wx.getStorageSync("token");
    networkUtil.loginWithPhone({
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      sessionkey: token.session_key,
      loginType:"mobile",
      sucess : function(res){
        networkUtil.getWebUserInfo({
          success: function(e){
            wx.navigateBack({
              
            })
          },
          fail: function(e){

          }
        });
      },
      fail: function(res){

      }
    });
  },
  //授权微信获取用户数据
  getUserInfoFun: function (e) {
    var token = wx.getStorageSync("token");
    //console.log(TAG +' getUserInfoFun() pass and e=');
    //console.log(e);
    networkUtil.loginWithPhone({
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      sessionkey: token.session_key,
      loginType: "auth",
      sucess: function (res) {
        console.log('login sucess');
        console.log(res)
        wx.setStorageSync('userId', res.data.userId);
        wx.setStorageSync('nickName',res.data.nickName);
        THIS.setData({
          message: "sucess",
        });
        networkUtil.getWebUserInfo({
          success: function (e) {
            //console.log('success to getWebUserInfo');
            THIS.setData({
              message:JSON.stringify(res),
            });
            
            wx.navigateBack({})
          },
          fail: function (e) {
              THIS.setData({
                message: "sucess fail",
              });
          }
        });
      },
      fail: function (res) {
        console.log("failed");
        THIS.setData({
          message:JSON.stringify(res),
        });
      }
    });
  }
})