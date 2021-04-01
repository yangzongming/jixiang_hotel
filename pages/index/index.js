
var util = require('../../utils/util.js')
var networkUtil = require('../../utils/networkUtil.js')

// 模拟服务器数据(假数据/记得在onload里请求服务器)
//const constants = require('../../utils/constants.js');


// 右侧每一类的 bar 的高度（固定）
const RIGHT_BAR_HEIGHT = 20;

// 右侧每个子类的高度（固定）
const RIGHT_ITEM_HEIGHT = 100;

// 左侧每个类的高度（固定）
const LEFT_ITEM_HEIGHT = 50

Page({

  data: {

    imgUrl: 'http://iyoukar.com/image/dish/27ca388c5d545ee43c1e95be6f5ade13.jpg',
    // 是否显示下面的购物车
    HZL_isCat: 0,

    // 购物车的商品
    my_cart: [],

    // 购物车的数量
    HZL_num:0,

    // 左 => 右联动 右scroll-into-view 所需的id
    HZL_toView: null,

    // 右侧每类数据到顶部的距离（用来与 右 => 左 联动时监听右侧滚动到顶部的距离比较）
    HZL_eachRightItemToTop: [],
    HZL_leftToTop: 0,

    // 当前左侧选择的
    HZL_currentLeftSelect: null,   
 
    // 数据
    constants: [
      
    ],

    //下单数据
    orderData: {},

    centerId: 0,
    deskId: 0,
    welcome: '吉祥大酒店欢迎您',
  },





  
  /**
   * 记录swiper滚动
   */
  HZL_swiperchange: function(e)
  {
    var that = this;
    that.setData({
      HZL_swiper_ID: e.detail.current,
    })
  },

  
  /**
   * 点击分类栏
   */
  HZL_categories:function(e)
  {
    var that = this;
    that.setData({
      HZL_swiper_ID: e.currentTarget.dataset.index
    })
  },


  /**
   * 获取每个右侧的 bar 到顶部的距离，
   * 用来做后面的计算。
   */
  HZL_getEachRightItemToTop: function ()
  {
    var obj = {};
    var totop = 0;
    // 右侧第一类肯定是到顶部的距离为 0
    var constants = this.data.constants;
    if(constants.length == 0){
      return;
    }
    obj[constants[0].index] = totop    
    //console.log('===========================') 
    //console.log(constants)
    // 循环来计算每个子类到顶部的高度
    for (let i = 1; i < (constants.length + 1); i++) {  
      totop += (RIGHT_BAR_HEIGHT + constants[i - 1].dishs.length * RIGHT_ITEM_HEIGHT)
      // 这个的目的是 例如有两类，最后需要 0-1 1-2 2-3 的数据，所以需要一个不存在的 'last' 项，此项即为第一类加上第二类的高度。
      obj[constants[i] ? constants[i].index : 'last'] = totop    
    }
    return obj
  },


  /**
   * 监听右侧的滚动事件与 HZL_eachRightItemToTop 的循环作对比
   * 从而判断当前可视区域为第几类，从而渲染左侧的对应类
   */
  right: function (e)
  { 
    //console.log('right click')  
    //console.log(e)
    for (let i = 0; i < this.data.constants.length; i++) {
      let left = this.data.HZL_eachRightItemToTop[this.data.constants[i].index]
      let right = this.data.HZL_eachRightItemToTop[this.data.constants[i + 1] ? this.data.constants[i + 1].index : 'last']
      if (e.detail.scrollTop < right && e.detail.scrollTop >= left) {
        this.setData({
          HZL_currentLeftSelect: this.data.constants[i].index,
          HZL_leftToTop: LEFT_ITEM_HEIGHT * i
        })
      }
    }
  },


  /**
   * 左侧类的点击事件，
   * 点击时，右侧会滚动到对应分类
   */
  left: function (e)
  {    
    //console.log(e)
    this.setData({
      HZL_toView: e.target.id || e.target.dataset.id,
      HZL_currentLeftSelect: e.target.id || e.target.dataset.id
    })
  },


  /**
   * 去结算按钮
   * 具体功能自己写
   */
  go: function()
  {

    // 用户购物车(包含选择的商品)
    //console.log(this.data.my_cart)
  },


  /**
   * 是否显示下面的购物车
   */
  HZL_isCat:function(e)
  {
    var that = this;
    if (that.data.HZL_isCat == 0 && that.data.HZL_num > 0) {
      that.setData({
        HZL_isCat: 1
      })
    } else if (that.data.HZL_isCat == 1 && that.data.HZL_num > 0) {
      that.setData({
        HZL_isCat: 0
      })
    }
  },


  /**
   * 黑背景模态墙点外侧关闭
   */
  HZL_isCat_close:function(e)
  {
    this.setData({
      HZL_isCat: 0
    })
  },


  /**
   * 清空购物车
   */
  HZL_zero:function(e)
  {
    for (var i = 0; i < this.data.constants.length; i++) {
      for (var j = 0; j < this.data.constants[i].dishs.length; j++) {
        this.data.constants[i].dishs[j].num = 0
      }
    }
    this.setData({
      HZL_isCat: 0,
      HZL_num: 0,
      my_cart: [],
      constants: this.data.constants,
    })
  },


  /**
   * 增加数量按钮
   */
  HZL_jia:function(e)
  {
    var index = e.currentTarget.dataset.index;
    var parentIndex = e.currentTarget.dataset.parentindex;
    var my_cart = this.HZL_my_jia(parentIndex, index)
    this.setData({
      HZL_num: this.data.HZL_num,
      my_cart: my_cart,
      constants: this.data.constants,
    })
  },


  /**
   * 减少数量按钮
   */
  HZL_jian:function(e)
  {
    var index = e.currentTarget.dataset.index;
    var parentIndex = e.currentTarget.dataset.parentindex;
    var my_cart = this.HZL_my_jian(parentIndex, index)

    if (this.data.HZL_num == 0) {
      this.data.HZL_isCat = 0;
    } else {
      this.data.HZL_isCat = 1;
    }

    this.setData({
      HZL_num: this.data.HZL_num,
      my_cart: my_cart,
      constants: this.data.constants,
    })
  },


  /**
   * 下面购物车增加按钮
   */
  HZL_jia1: function (e)
  {
    var index = e.currentTarget.dataset.index;
    var parentIndex = e.currentTarget.dataset.parentindex;
    var my_cart = this.HZL_my_jia(parentIndex, index)
    this.setData({
      HZL_num: this.data.HZL_num,
      my_cart: my_cart,
      constants: this.data.constants,
    })
  },


  /**
   * 下面购物车减少按钮
   */
  HZL_jian1: function (e)
  {
    var index = e.currentTarget.dataset.index;
    var parentIndex = e.currentTarget.dataset.parentindex;
    var my_cart = this.HZL_my_jian(parentIndex, index)

    if (this.data.HZL_num == 0) {
      this.data.HZL_isCat = 0;
    } else {
      this.data.HZL_isCat = 1;
    }

    this.setData({
      HZL_num: this.data.HZL_num,
      my_cart: my_cart,
      constants: this.data.constants,
      HZL_isCat: this.data.HZL_isCat
    })
  },


  /**
   * 封装加的方法
   */
  HZL_my_jia: function (parentIndex, index)
  {
    this.data.HZL_num++;
    var index = index;
    var parentIndex = parentIndex;
    console.log(this.data.constants)
    var id = this.data.constants[parentIndex].dishs[index].dishId;
    var name = this.data.constants[parentIndex].dishs[index].name;
    var num = ++this.data.constants[parentIndex].dishs[index].num ;
    //弄一个元素判断会不会是重复的
    var mark = 'a' + index + 'b' + parentIndex + 'c' + '0' + 'd' + '0'
    var obj = { 
      dishId: id,
      num: num, 
      name: name, 
      mark: mark, 
      index: index, 
      parentIndex: parentIndex 
    };
    var my_cart = this.data.my_cart;
    my_cart.push(obj)

    var arr = [];
    //去掉重复的
    for (var i = 0; i < my_cart.length; i++) {
      if (obj.mark == my_cart[i].mark) {
        my_cart.splice(i, 1, obj)
      }
      if (arr.indexOf(my_cart[i]) == -1) {
        arr.push(my_cart[i]);
      }
    }
    return arr
  },


  /**
   * 封装减的方法
   */
  HZL_my_jian: function (parentIndex, index)
  {
    this.data.HZL_num--;
    var index = index;
    var parentIndex = parentIndex;
    var id = this.data.constants[parentIndex].dishs[index].dishId;
    var name = this.data.constants[parentIndex].dishs[index].name;
    var num = --this.data.constants[parentIndex].dishs[index].num;
    //弄一个元素判断会不会是重复的
    var mark = 'a' + index + 'b' + parentIndex + 'c' + '0' + 'd' + '0'
    var obj = { 
      dishId: id,
      num: num, 
      name: name, 
      mark: mark, 
      index: index, 
      parentIndex: parentIndex 
    };
    var my_cart = this.data.my_cart;
    my_cart.push(obj)

    var arr = [];
    //去掉重复的
    for (var i = 0; i < my_cart.length; i++) {
      if (obj.mark == my_cart[i].mark) {
        my_cart.splice(i, 1, obj)
      }
    }
    

    var arr1 = [];
    //当数量大于1的时候加
    for (var i = 0; i < my_cart.length; i++) {
      if (arr1.indexOf(my_cart[i]) == -1) {
        arr1.push(my_cart[i]);
        if (my_cart[i].num > 0) {
          arr.push(arr1[i])
        }
      }
    }

    return arr
  },


  previewImageClick: function (e){
    //console.log(e.currentTarget.dataset['item'])
    var imgUrl = e.currentTarget.dataset['item']
    wx.previewImage({
      urls:[imgUrl],
      current: '',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options)
  {
    var that = this;
    // 高度大小
    wx.getSystemInfo({
      success: function (res) {
        var HZL_height = res.windowHeight
        var HZL_height1 = res.windowHeight + 50
        that.setData({
          HZL_height: HZL_height,
          HZL_height1: HZL_height1
        })
      }
    });

    // 获取服务器数据
    //console.log('请求接口: 获取服务器数据')
    that.loadDishData('');
    console.log(options)
    console.log('pass')
    var centerId = options.centerid;
    var deskId = options.deskId;
    if(centerId != null && deskId != null && centerId != 0 && deskId != 0){
      that.setData({
        centerId: centerId,
        deskId: deskId,
      })
      this.freshDeskInfo(deskId);
    }else{
      this.freshDeskInfo(0);
    }
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () 
  {
    this.freshDeskInfo(this.data.deskId)
  },

   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //console.log('下拉刷新了 重新请求数据吧！')
    var that = this;
    that.setData({
      loading: true,
      offset: 0,
    });
    that.loadDishData('');
  },

  loadDishData: function ()
  {
    var that = this
    networkUtil.NetRequest({
      url: "/api2/dish/index?centerId=1008",
      data: {
        
      },
      success: function (res1) {
        console.log("首页数据");
        console.log(res1.data.categorys);
        wx.stopPullDownRefresh({
          success: (res) => {},
        });
        //读取cookie并存储
        if (res1.code == 0) {

          var i = 1;
          for(var t=0;t<res1.data.categorys.length;t++ ){
            var category = res1.data.categorys[t];
            category.index = 'id'+i;
            i+=1;
            var dishs = category.dishs;
            for(var j=0;j<dishs.length;j++){
              var dish = dishs[j];
              dish.num = 0;
            }
          }
          that.setData({
            constants: res1.data.categorys,
            HZL_currentLeftSelect: res1.data.categorys[0].index,
          });
          setTimeout(function (){
            that.setData({
              HZL_eachRightItemToTop: that.HZL_getEachRightItemToTop()
            })
            that.HZL_zero()
          },"100");
        }
      },
      fail: function (res) {
        //console.log("error"+res);
        wx.stopPullDownRefresh({
          success: (res) => {},
        });
      },
      method: 'GET'
    });
  },

  createOrder: function (tmpData){
    var that = this;
    networkUtil.NetRequest({
      url: "/api2/dish/order/create",
      data: tmpData,
      success: function(res1){
        console.log(res1)
        wx.showToast({
          title: '下单成功',
        })
        that.HZL_zero()
      },
      fail: function(res2){
        wx.showToast({
          title: '下单失败',
        })
      },
      method: 'POST'
    });
  },

  freshDeskInfo: function (deskid){
    var that = this;
    var nickName = wx.getStorageSync('nickName')
    if(nickName == null || nickName == ''){
      nickName = '顾客'
    }
    if(null != deskid && deskid != 0){
      networkUtil.NetRequest({
        url: "/api2/dish/desk/info",
        data:{
          deskId: deskid,
        },
        success: function(res1){
          console.log(res1)
          that.setData({
            welcome: nickName + '，欢迎您。'+res1.data.roomName +' 餐桌：' +res1.data.deskNum
          })
        },
        fail: function(res2){
  
        },
        method: 'GET'
      });
    }else{
      var nickName = wx.getStorageSync('nickName')
      if(nickName != null){
        this.setData({
          welcome: nickName + '，欢迎您。'
        })
      }else{
        this.setData({
          welcome: '顾客' + '，欢迎您。'
        })
      }
    }
  },

  order_button_click: function (){

    var that = this;

    var userId = wx.getStorageSync('userId')
    var deskId = that.data.deskId;
    var centerId = that.data.centerId;
    //console.log('userId='+userId)

    if(that.data.my_cart.length == 0){
      wx.showToast({
        title: '你还没有点菜哦～',
      })
      return;
    }

    if(userId == null || userId == '' || userId == 0){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }

    if(that.data.centerId == 0 || that.data.centerId == '' || that.data.deskId == 0 || that.data.deskId == ''){
      wx.showModal({
        title: '点餐提示',
        content: '点餐需要扫描餐桌上的二维码，点击确定开始扫描~',
        success: function(res){
          if(res.confirm){
            wx.scanCode({
              onlyFromCamera: true,
              success(res){
                var scanCodeMsg = res.path; //获取二维码的路径信息
                console.log(scanCodeMsg) //输出二维码信息
                // pages/index/index?deskId=1002&centerid=1008

                centerId = that.getQueryVariable(scanCodeMsg, 'centerid')
                deskId = that.getQueryVariable(scanCodeMsg, 'deskId')
                this.freshDeskInfo(deskId);
                that.setData({
                  centerId: centerId,
                  deskId: deskId,
                })
                wx.showToast({
                  title: '扫码'+centerId+'_'+deskId,
                })
              },
              fail(res){
                console.log(res)
              }
            })
          }else{

          }
        }
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确定提交订单？',
      success: function(res){
        if(res.confirm){
          console.log('confirm')
          that.placeOrder(userId, deskId, centerId);
        }
      },

    })
  },

  placeOrder: function(userId, deskId, centerId){
    //console.log(this.data.my_cart);
    var that = this;
    var tmpList = [];
    for(var i=0;i<this.data.my_cart.length;++i){
      var dish = this.data.my_cart[i]
      var dic = {
        dishId: dish.dishId,
        count: dish.num,
      }
      tmpList.push(dic)
    }
    //console.log('fuck')
    //console.log(tmpList)
    var tmpData = {
      data: {
        userId: userId,
        deskId: deskId,
        centerId: centerId,
        dishOrderList: tmpList
      }
    };
    var json = JSON.stringify(tmpData);
    //var map = {"data":json};
    console.log(json)
    that.createOrder(json)
  },

  getQueryVariable: function(url, variable)
  {
    var query = url.replace("pages/index/index?","");//window.location.search.substring(1);
    var vars = query.split("&");
    console.log(vars)
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  }

})