function saveCookieStorage(customer_id, open_id, center_id) {
  if (open_id != null && open_id != '') {
    wx.setStorageSync("i_openid", open_id);
  }
  if (customer_id != null && customer_id != 0) {
    wx.setStorageSync("i_customerid", customer_id);
  }
  if (center_id != null && center_id != 0) {
    wx.setStorageSync("i_centerid", center_id);
  }
}

//统一获取请求
function NetRequest({ url, data, success, fail, complete, method = 'GET' }) {
  var Server = getApp().globalData.BASE_URL + "";
  var session_id = wx.getStorageSync('JSESSIONID');//本地取存储的sessionID
  var accessToken = wx.getStorageSync('accessToken');
  var i_centerid = "0";
    
  if(method == 'GET'){
    if (session_id != "" && session_id != null) {
      var header = { 'content-type': 'application/x-www-form-urlencoded', 
      'Cookie': 'JSESSIONID=' + session_id + 
      ',accessToken=' + accessToken + 
      ',versionNumber=' + getApp().globalData.versionNumber + 
      ',versionCode=' + getApp().globalData.versionCode + 
      ',i_centerid=' + i_centerid };
    } else {
      var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'versionNumber=' + getApp().globalData.versionNumber + ',versionCode=' + getApp().globalData.versionCode + ',i_centerid=' + i_centerid }
    }
  }else{
    if (session_id != "" && session_id != null) {
      var header = { 'content-type': 'application/json; charset=utf-8', 
      'Cookie': 'JSESSIONID=' + session_id + 
      ',accessToken=' + accessToken + 
      ',versionNumber=' + getApp().globalData.versionNumber + 
      ',versionCode=' + getApp().globalData.versionCode + 
      ',i_centerid=' + i_centerid };
    } else {
      var header = { 'content-type': 'application/json; charset=utf-8', 'Cookie': 'versionNumber=' + getApp().globalData.versionNumber + ',versionCode=' + getApp().globalData.versionCode + ',i_centerid=' + i_centerid }
    }
  }
  
  url = Server + url;

  console.log("NetRequest() session_id=" + session_id);
  console.log("NetRequest() header=");
  console.log(header);
  console.log("NetRequest() url=" + url + " data=");
  console.log(data);

  wx.request({
    url: url,
    method: method,
    data: data,
    header: header,
    success: res => {
      if (session_id == "" || session_id == null) {
        wx.setStorageSync('JSESSIONID', res.data.session_id) //如果本地没有就说明第一次请求 把返回的session id 存入本地
      }
      var data = res.data
      res['statusCode'] === 200 ? success(data) : fail(res)
    },
    fail: fail,
    complete: complete
  })
}

//微信用户手机号登录
function loginWithPhone({ encryptedData, iv, sessionkey,sucess,loginType,fail}) {
  NetRequest({
    url: '/api2/wechat/login',
    data: {
      encryptedData: encryptedData,
      iv: iv,
      sessionkey:sessionkey,
      loginType: loginType,
    },
    method: 'GET',
    success: function (res) {
      //console.log(res);
      if(res.code == 0){
        wx.setStorageSync("accessToken", res.data.token);
        wx.setStorageSync("userId", res.data.uid)
        //getWebUserInfo();
        sucess(res);
      }
    },
    fail: function (res) {
      fail(res);
    }
  });
}

//获取web端用户的详情 / 信息
function getWebUserInfo({ success, fail}){

  var userId = wx.getStorageSync('userId')
  
  NetRequest({
    url: '/api2/user/' + userId +'/info',
    data: {

    },
    method: 'GET',
    success: function (res) {
      console.log(res);
      if (res.code == 0) {
        console.log("获取到了用户信息");
        wx.setStorageSync("wechatUserInfo", res.data);
        getApp().globalData.wechatUserInfo = res.data;
        success(res);
      }
    },
    fail: function (res) {
      fail(res);
    }
  });
}

function getWechatUserInfo(that) {
  var S = this;
  wx.getUserInfo({
    success: function (res) {
      console.log(res)
      //getUserUniqId(wx.getStorageSync("code"), res.encryptedData,res.iv);
    },
    fail: S.showPrePage
  })
}

/*
  *获取課時列表
  * schedule/1/course/list?offset=0&limit=100
  */
function getTimeSlotsUtil({scheduleId, successCallback, failCallback}) {
    wx.showLoading();
    console.log("getTimeSlots() scheduleId=" + scheduleId);
    NetRequest({
      url: "/schedule/" + scheduleId + "/timeslot/list?offset=0&limit=100",
      data: {
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        console.log("getTimeSlots() success");
        console.log(res);
        console.log(successCallback);
        if (res.code == 0 && res.data != null) {
            console.log(res.data);
            successCallback(res.data.items);
        } else {
          //如果没有课表，什么也不做
          console.log("getTimeSlots没有获取到了课程信息: res.code =" + res.code);
        }

      },
      fail: function (res) {
        wx.hideLoading();
        failCallback(res);
      }
    });
}

/*
  *获取課時列表
  * schedule/1/course/list?offset=0&limit=100
  */
function importShareSchedule({scheduleId, userId, successCallback, failCallback}) {
  wx.showLoading();
  console.log("getTimeSlots() scheduleId=" + scheduleId);
  NetRequest({
    url: "/schedule/share/" + scheduleId + "/import?userId="+userId,
    data: {
    },
    method: 'GET',
    success: function (res) {
      wx.hideLoading();
      console.log("importShareSchedule() success");
      console.log(res);
      console.log(successCallback);
      if (res.code == 0 && res.data != null) {
          console.log(res.data);
          successCallback(res.data.items);
      } else {
        //如果没有课表，什么也不做
        console.log("importShareSchedule没有获取到了课程信息: res.code =" + res.code);
      }

    },
    fail: function (res) {
      wx.hideLoading();
      failCallback(res);
    }
  });
}

 //获取用户所有的课表
function getUserAllSchedules({userId, date, successFallback, failFallback}) {

  if (userId == null) {
     console.log("getUserAllSchedules() 获取数据失败 userId=" + userId);
     return;
   }
   wx.showLoading();
   console.log("getUserAllSchedules() userId=" + userId + " date" + date);
   networkUtil.NetRequest({
     url: "/user/"+userId+"/schedule/list",
     data: {
     },
     method: 'GET',
     success: function (res) {
       wx.hideLoading();
       console.log("getUserAllSchedules success");      
       console.log(res);
       if (res.code == 0 && res.data.length > 0) {
         console.log("getUserAllSchedules获取到了课表信息:res.data=");
         console.log(res.data)

         successFallback(res);            
       } else {
        failFallback(res);
       }
      
     },
     fail: function (res) {
       wx.hideLoading();
       console.log("getUserAllSchedules() 获取数据失败");
     }
   });
 }

 //获取用户所有的课表
function getUserSchedule({userId, scheduleId, date, successFallback, failFallback}) {

  if (userId == null) {
     console.log("getUserSchedule() 获取数据失败 userId=NULL");
     return;
   }
   wx.showLoading();
   console.log("getUsertSchedule() userId=" + userId + " scheduleId="+scheduleId+ " date" + date);
   NetRequest({
     url: "/user/"+userId+"/schedule?scheduleId="+scheduleId,
     data: {
     },
     method: 'GET',
     success: function (res) {
       wx.hideLoading();
       console.log("getUserSchedule() success");      
       console.log(res);
       if (res.code == 0) {
         console.log("getUserSchedule(): 获取到了课表信息:res=");
         console.log(res)
         successFallback(res);            
       } else {
        failFallback(res);
       }
      
     },
     fail: function (res) {
       wx.hideLoading();
       failFallback(null);
       //console.log("getUserSchedule() 获取数据失败");
     }
   });
 }


module.exports = {
  NetRequest: NetRequest,
  loginWithPhone: loginWithPhone,
  getWechatUserInfo:getWechatUserInfo,
  getWebUserInfo: getWebUserInfo,
  getTimeSlotsUtil:getTimeSlotsUtil,
  importShareSchedule:importShareSchedule,
  getUserSchedule:getUserSchedule,
  getUserAllSchedules:getUserAllSchedules
}
