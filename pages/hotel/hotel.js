// pages/hotel/hotel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    hideNotice: false,
    notice: '请和您的医生一起根据个体情况决定',
    address: '位于大田集镇石马西100米路北，一、三层是包间装修典雅舒适，二楼是大厅提供大中型会议及婚宴用餐，提供正宗鲁、东北、川、粤菜肴，是宴请适宜之选 。',
    imgUrl: 'http://iyoukar.com/image/dish/28281e7d933512a0da56444744c2aea2.jpg',
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  phoneclick: function () {
    wx.makePhoneCall({
      phoneNumber: '0530-8775123',
    })
  },

  loginclick: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  diancanClick: function () {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }
})