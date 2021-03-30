// pages/book/booklist.js

var util = require('../../utils/util.js')
var networkUtil = require('../../utils/networkUtil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'加载中...',
    list:[],
    loading:true,
    type:'us_box',
    offset:0,
    count:20,
    hasMore:false,
  },

  loadBooks: function(){
    var that = this
    networkUtil.NetRequest({
      url: "/api2/book/lists",
      data: {
        offset: this.data.offset,
        count:this.data.count,
      },
      success: function (res1) {
        console.log(res1);
        wx.stopPullDownRefresh({
          success: (res) => {},
        });
        //读取cookie并存储
        if (res1.code == 0) {
          if(that.data.offset == 0){
            that.setData({
              offset:res1.data.offset+res1.data.count,
              list:res1.data.items,
              hasMore: res1.data.hasMore,
              title:'',
              loading: false,
            })
          }else{
            var tmp_list = that.data.list.concat(res1.data.items)
            console.log(tmp_list)
            that.setData({
              offset:res1.data.offset+res1.data.count,
              list:tmp_list,
              hasMore: res1.data.hasMore,
              title:'',
              loading: false,
            })
          }
          
        }
      },
      fail: function (res) {
        console.log("error"+res);
        wx.stopPullDownRefresh({
          success: (res) => {},
        });
      },
      method: 'GET'
    });
  },

  bookAction: function(bookId){
    wx.navigateTo({
      url: '/pages/bookdetail/bokdetail?bookId='+bookId.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadBooks('');
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
    console.log('下拉刷新了 重新请求数据吧！')
    var that = this;
    that.setData({
      loading: true,
      offset: 0,
    });
    that.loadBooks('');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉刷新了 重新请求数据吧！')
    if(this.data.hasMore){
      this.loadBooks('');
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})