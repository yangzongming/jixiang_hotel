// pages/bookdetail/bokdetail.js

var util = require('../../utils/util.js')
var networkUtil = require('../../utils/networkUtil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookId:0,
    detailObj:{},
  },

  loadBookInfo:function(){
    var that = this
    networkUtil.NetRequest({
      url: "/api2/book/info",
      data: {
        bookId: this.data.bookId,
      },
      success: function (res1) {
        console.log(res1);
        //读取cookie并存储
        if (res1.code == 0) {
          that.setData({
            detailObj:res1.data,
          });
        }
      },
      fail: function (res) {
        console.log("error"+res);
      },
      method: 'GET'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      bookId:options.bookId,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.loadBookInfo();
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

  }
})