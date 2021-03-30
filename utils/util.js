//获取当前时间，格式YYYY-MM-DD
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  console.log(currentdate);
  return currentdate;
}

//获取当前年，格式YYYY
function getCurrentYear() {
  var date = new Date();
  var year = date.getFullYear();
  return year;
}

function getCurrentMonth() {
  var date = new Date();
  var m = date.getMonth()+1;
  return [m].map(formatNumber);
}

function getCurrentDay() {
  var date = new Date();
  var d = date.getDate();
  return [d].map(formatNumber);
}

function getCurrentHM() {
  var date = new Date();
  var h = date.getHours();
  var m = date.getMinutes();

  return [h].map(formatNumber) + ":" + [m].map(formatNumber);
}

//比较日期大小
function compareDate(date1, date2) {
  var date1 = new Date(date1);
  var date2 = new Date(date2);
  if (date1.getTime() > date2.getTime()) {
    return true;
  } else {
    return false;
  }
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const toHMS = function toHMS(number) {
  const date = new Date(number);
  return (date.getHours()+":"+date.getMinutes()+":"+date.getSeconds())
}

const toDate1 = function toDate1(number) {
  const n = number * 1000;
  const date = new Date(n);
  const Y = date.getFullYear() + '年';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
  const D = date.getDate() < 10 ? '0' + date.getDate() + '日' : date.getDate() + '日';
  return (M + D + "更新")
}
const toDatevip = function toDatevip(number) {
  const n = number * 1000;
  const date = new Date(n);
  const Y = date.getFullYear() + '年';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
  const D = date.getDate() < 10 ? '0' + date.getDate() + '日' : date.getDate() + '日';
  return (Y + M + D)
}
const toDate = function toDate(n) {
  const ntime = n * 1000;
  const date = new Date(ntime);
  const Y = date.getFullYear() + '年';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
  const D = date.getDate() < 10 ? '0' + date.getDate() + '日' : date.getDate() + '日';
  var result;
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - ntime;
  if (diffValue < 0) {
    return;
  }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  if (monthC >= 1) {
    if (monthC <= 12)
      result = (M + D + " 更新");
    else {
      result = (M + D + " 更新");
    }
  }
  else if (weekC >= 1 || dayC > 1) {
    result = (M + D + " 更新");
  }
  else if (dayC == 1) {
    result = "昨日更新";
  }
  else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前 更新";
  }
  else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前 更新";
  } else {
    result = "刚刚 更新";
  }
  return result;
}

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

function getDistance(lat1, lng1, lat2, lng2, callback) {
  if (lat1 != null && lng1 != null && lat2 != null && lng2 != null) {
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;
    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var r = 6378137;
    var distenceMi = (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0);

    var distenceStr = '';
    if (distenceMi < 10000 && distenceMi > 0) {
      distenceStr = distenceMi + '米';
    } else if (distenceMi > 10000) {

      var tem_dis = distenceMi * 1.0 / 1000.0;
      distenceStr = (Math.round(tem_dis * 100) / 100) + '公里';
    }
    console.log('距离旧宫' + distenceMi);
    console.log('距离旧宫' + distenceStr);
    typeof callback == "function" && callback(distenceStr);
  } else {
    return 0;
  }
}

function getLoopModeArray() {
  return [{value:'ONE'},{value:'DAY'},{value:'WEEK'},{value:'TWO_WEEKS'},{value:'MONTH'},{value:'YEAR'}];
}

function warnModalTrue(title, msg, callback) {
  var self = this;
  wx.showModal({
    title: title,
    content: msg,
    confirmColor: '#007aff',
    cancelColor: '#007aff',
    confirmText:'是',
    cancelText: '否',
    success: function (res) {
      if (res.confirm) {
        callback();
      } else if (res.cancel) {
        
      }
    }
  })
}

module.exports = {
  getNowFormatDate: getNowFormatDate,
  getCurrentYear: getCurrentYear,
  getCurrentMonth: getCurrentMonth,
  getCurrentDay: getCurrentDay,
  formatTime: formatTime,
  toDate: toDate,
  toDatevip: toDatevip,
  toDate1: toDate1,
  saveCookieStorage: saveCookieStorage,
  getDistance: getDistance,
  toHMS:toHMS,
  getCurrentHM: getCurrentHM,
  getLoopModeArray:getLoopModeArray,
  warnModalTrue:warnModalTrue

}
