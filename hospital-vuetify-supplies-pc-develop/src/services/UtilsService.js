import http from '../utils/Http'
import sysConfig from '../config'
import AuthenticationService from '../services/AuthenticationService'
import MenuService from '../services/MenuService'
import timeago from 'timeago.js'
import {
	setStore
} from '@/utils/storage'

var isUndefined = function (vars) {
	if (typeof (vars) === 'undefined') {
		return true;
	}
	return false;
}

var isEmpty = function (vars) {
	if (typeof (vars) === 'undefined') {
		return true;
	}
	if (vars === null) {
		return true;
	}
	//针对json对象
	if (typeof (vars) === 'object' && vars.length <= 0) {
		return true;
	}
	//字符串
	if (typeof (vars) === 'string' && vars.length <= 0) {
		return true;
	}

	return false;
}
/**
 * @description
 * @param {*} url
 * @param {*} jsonData 参数
 * @param {*} httpConfig 
 * @param {*} userConfig 用户配置参数
 * @param {*} isHttpGet 请求方式 get/post
 * @returns
 */
var getDataByHttp = function (url, jsonData, httpConfig, userConfig, isHttpGet) {

	if (typeof (isHttpGet) !== "boolean") {
		alert("参数isHttpGet类型错误，应该为boolean类型");
		return;
	}

	var allJsonData = {};

	if (typeof (userConfig) !== "undefined") {
		if (typeof (userConfig.includeUserErpAuth) === "boolean" && userConfig.includeUserErpAuth) {
			if (typeof (AuthenticationService.getCurrentUser().userErpAuth) != "undefined")
				allJsonData = AuthenticationService.getCurrentUser().userErpAuth;
		}
	}
	if (typeof (AuthenticationService.getUserToken()) !== "undefined") {
		allJsonData._token = AuthenticationService.getUserToken();
		//console.log("---2-UtilsService---_token---",allJsonData._token);
		allJsonData.userIdentity = AuthenticationService.getUserToken(); //不知道旧的版本怎么传的userIdentity，后面再看
	}

	if (typeof (jsonData.dataType) === "undefined" || jsonData.dataType.trim() === '')
		jsonData.dataType = "json"; //数据返回类型

	Object.assign(allJsonData, jsonData); //合并json对象
	if (isHttpGet) {
		allJsonData = {
			params: allJsonData
		}
		Object.assign(allJsonData, httpConfig); //合并json对象
	}
	//console.log("-UtilsService--allJsonData--",allJsonData);
	if (isHttpGet) {
		//console.log("get");
		//console.log("http.get(url, allJsonData)",http.get(url, allJsonData));
		return http.get(url, allJsonData);
	} else {
		console.log("post");
		return http.post(url, allJsonData);

	}
}
var logout = function () {
	AuthenticationService.logout();
	window.location.href = './'
}

/**封装get或post方法，传入方法类型，调用接口的service配置，传入的参数 */
var doHttp = function (methodType, serviceConfig, params) {
	Object.assign(serviceConfig, params);
	if (methodType.toLowerCase() == "get") {
		return UtilsService.eliteHttpGet(serviceConfig, {
			cache: true
		});
	} else {
		return UtilsService.eliteHttpPost(serviceConfig, {
			cache: true
		});
	}
}

var eliteHttpGet = function (jsonData, httpConfig, userConfig) {
	return getDataByHttp(sysConfig.defualtApp.apiUrl, jsonData, httpConfig, userConfig, true);
}
var eliteHttpPost = function (jsonData, httpConfig, userConfig) {
	return getDataByHttp(sysConfig.defualtApp.apiUrl, jsonData, httpConfig, userConfig, false);
}



//判断是否有汉字
var isContainChinese = function (obj) {
	if (/.*[\u4e00-\u9fa5]+.*$/.test(obj)) {
		return true;
	}
	return false;
}
const getTimeAgo = (time) => {
	let timeagoInstance = new timeago();
	const str = timeagoInstance.format(time, 'zh_CN');
	return str
}


/*
 重写Date的format方法
 var date = new Date(parseInt("1347497754133"));
 date.format("yyyy-MM-dd");
 */
const dateFormat = function (date, fmt) {
	var tempDate = date;
	date = new Date(date)
	if (date == 'Invalid Date') {
		//处理苹果手机时间格式转换出错
		// var arr = tempDate.split(/[- : \/]/);
		// if (arr.length > 3) {
		// 	date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
		// } else {
		// 	date = new Date(arr[0], arr[1] - 1, arr[2]);
		// }
		var date = new Date(tempDate.replace(/\-/g, "/"));
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	};
	for (let k in o) {
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + '';
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
		}
	}
	return fmt;
};

const getBeforeDate = function (n) {
	//获取当前日期前n天 n>0往前 n<0往后
	var date = new Date();
	var year, month, day;
	date.setDate(date.getDate() - n);
	year = date.getFullYear();
	month = date.getMonth() + 1;
	day = date.getDate();
	var s =
		year +
		"-" +
		(month < 10 ? "0" + month : month) +
		"-" +
		(day < 10 ? "0" + day : day);
	return s;
}

function padLeftZero(str) {
	return ('00' + str).substr(str.length);
}


//初始化显示列配置（string配置转成json配置）
var initVuetifyColumnConfig = function (columnConfig) {
	var resultConfig = [];
	if (typeof (columnConfig) === "undefined" || columnConfig.trim() === '') {
		alert("未设置显示列，请联系管理员！");
		return resultConfig;
	}
	var cfig = [];
	cfig = (columnConfig + '').split('^');
	for (var i = 0; i < cfig.length; i++) {
		var a = cfig[i].split('~');
		var width = a[2];
		if (width === '0')
			continue;

		if (a[3] === '') {
			a[3] = 'left'; //'left' | 'center' | 'right'
		}

		if (width === '') {
			width = "100px";
		} else {
			width = width + "px";
		}

		var stylestr = ''
		var styleObject = {}
		styleObject.width = width
		stylestr += "width:" + width + ";";
		if (a[5] !== '') {
			stylestr += "color:" + a[5] + ";";
			styleObject.color = a[5]
		}
		if (a[3] !== '') {
			stylestr += "text-align: " + a[3] + ";";
			//styleObject.display = a[3]
		}

		/* var item = {
		    "columnTitle": a[0],
		    "columnName": a[1],
		    "width": width,
		    "display": a[3],
		    "textOverflow": a[4],
		    "fontColor": a[5],
		    "filterExpression": a[6],
		    'style': stylestr,
		    'styleObject': styleObject
		}; */
		var sortable = true;
		if (a[1] == '_index' || a[1] == '_actions' || a[1] == '_sum')
			sortable = false;
		var item = {
			text: a[0],
			value: a[1],
			width: width,
			align: a[3],
			type: a[4],
			class: a[5],
			sortable: false,
			filterExpression: a[6],
			point: a[8],
			columnName: a[1],
			style: stylestr,
			styleObject: styleObject
		};

		resultConfig.push(item);

	}
	return resultConfig;
}

var initColumnConfig = function (columnConfig) {
	var resultConfig = [];
	if (typeof (columnConfig) === "undefined" || columnConfig.trim() === '') {
		alert("未设置显示列，请联系管理员！");
		return resultConfig;
	}
	var cfig = [];
	cfig = (columnConfig + '').split('^');
	for (var i = 0; i < cfig.length; i++) {
		var a = cfig[i].split('~');
		var width = a[2];
		if (width === '0')
			continue;

		if (a[3] === 'block') {
			width = "100%";
		} else {
			a[3] = 'inline-block'
			if (width === '') {
				width = "150px";
			} else {
				width = width + "px";
			}
		}

		var stylestr = ''
		var styleObject = {}
		styleObject.width = width
		stylestr += "width:" + width + ";";
		if (a[5] !== '') {
			stylestr += "color:" + a[5] + ";";
			styleObject.color = a[5]
		}
		if (a[3] !== '') {
			stylestr += "display:" + a[3] + ";";
			styleObject.display = a[3]
		}

		var item = {
			"columnTitle": a[0],
			"columnName": a[1],
			"width": width,
			"display": a[3],
			"textOverflow": a[4],
			"fontColor": a[5],
			"filterExpression": a[6],
			'style': stylestr,
			'styleObject': styleObject
		};

		resultConfig.push(item);

	}
	return resultConfig;
}

//将显示列数组转换成字符串配置
var initColumnConfigByArray = function (columns) {
	var configStr = '' //客户~exp4+exp5~~block~true~~~~~^数量~exp11~~inline-block~true~#000080~number:2~~~^
	for (var i = 0; i < columns.length; i++) {
		configStr += columns[i].columnTitle + '~' + columns[i].columnName + '~' + columns[i].width + '~' +
			columns[i].display + '~' + columns[i].textOverflow + '~' + columns[i].fontColor + '~' + columns[i].filterExpression +
			'~~~^'
	}
	if (configStr.length > 0)
		configStr = configStr.substring(0, configStr.length - 1)

	return initColumnConfig(configStr);
}

var getMenuParams = function (menuId, to) {
	return new Promise(function (resolve, reject) {
		MenuService.getMenuList(menuId)
			.then(data => {
				if (data.resultKey === "1") {
					var menuInfo = data.dataList[0];
					if (menuInfo.menu_url.trim()) {
						var menuUrl = JSON.parse(menuInfo.menu_url.trim());
						var params = {};
						if (typeof menuUrl.params != "undefined") {
							Object.assign(params, menuUrl.params); //合并json对象
						}
						menuInfo["params"] = params;
					}

					if (!isUndefined(to)) {
						Object.assign(to.meta.menuInfo, menuInfo);
					}
					//to.meta.menuInfo["params"] = params
					//JSON.stringify()
				} else {}
				resolve(data)
			})
			.catch(err => {
				reject(err)
			})
	})
}


var initeParams = function (to) {
	return new Promise(function (resolve, reject) {
		if (to.meta.menuInfo) {
			getMenuParams(to.meta.menuInfo.menu_id, to)
				.then(data => {
					// if (data[0].result === "1") {
					//   var menuInfo = data[0].data[0];
					//   var menuUrl = JSON.parse(menuInfo.menu_url);
					//   var params = {};
					//   if (typeof menuUrl.params != "undefined") {
					//     Object.assign(params, menuUrl.params); //合并json对象
					//   }
					//   menuInfo["params"] = params;
					//   Object.assign(to.meta.menuInfo, menuInfo);
					//   //to.meta.menuInfo["params"] = params
					//   //JSON.stringify()
					// } else {
					//   showMessage("提示！", data[0].msg);
					// }
					resolve(data)
				})
				.catch(err => {
					//this.showMessage("提示！", err + "");
					reject(err)
				})
		} else {
			resolve()
		}
	})
}

//js 自定义保留小数四舍五入
function number2(s, n) {
	if (isUndefined(s) || s === '') {
		return ''
	}
	var n = n || 2; //默认保留两位小数
	var number = s;
	var multipe = Math.pow(10, n); //把一个数放大10的次方倍
	if (!isNaN(number)) {
		number = Math.round(number * multipe); //四舍五入
		//处理小数点
		number = number.toString().split("");
		if (number.length < n + 1) {
			//当数值小于1的时候的处理方法
			for (var i = 0; i <= n + 1 - number.length; i++) {
				number.splice(0, 0, "0");
			}
		}
		number.splice(number.length - n, 0, "."); //给一个放大后的数的字符串插入小数点
		number = number.join("");
		return number;
	} else {
		//Tofixed方法只能对数字使用
		return s;
	}
}

//js方法格式化数字，加入千分符，并可以指定小数点位数
function number(s, n) {
	if (isUndefined(s) || s === '') {
		return ''
	}
	n = n >= 0 && n <= 20 ? n : 2;
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s
		.split(".")[0]
		.split("")
		.reverse(),
		r = s.split(".")[1];
	r = r == null ? "" : "." + r;
	var t = "";
	if (l[l.length - 1] === '-') { //负数不需要分隔号,

		for (var i = 0; i < l.length; i++) {
			if (l[i] === '-') {
				t += l[i] + ""
				continue
			}
			//不是数组的倒数第二个元素才加"," ["0", "4", "5", "-"]
			t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length - 1 ? "," : "");
		}
	} else {
		for (var i = 0; i < l.length; i++) {
			t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
		}
	}
	return (
		t
		.split("")
		.reverse()
		.join("") + r
	);
}

/**获取地址栏上的参数
 * @param url 地址字符串
 */
var getParamInUrl = function (url) {
	url = url.replace(/#\//, "%26sourcePath%3D"); //去除#/
	var name, value;
	var parms = {}
	var str = url
	var num = str.lastIndexOf("?");
	if (num > 0) {
		str = str.substr(num + 1);
		var arr = str.split("&"); //各个参数放到数组里
		for (var i = 0; i < arr.length; i++) {
			num = arr[i].indexOf("=");
			if (num > 0) {
				name = arr[i].split("=")[0]; //键
				value = arr[i].split("=")[1]; //值
				if (name == "state") {
					//取得路劲
					// var path = value.substring(value.indexOf("#") + 1);
					// value = value.substring(0, value.indexOf("#"));
					// value = value.replace(/#\//, ""); //去除#/
					value = decodeURIComponent(value);
					var temp = value.split("&"); //各个参数放到数组里  
					var n, newName, newValue;
					var tempState = {}
					for (var j = 0; j < temp.length; j++) {
						n = temp[j].indexOf("=");
						if (n > 0) {
							newName = temp[j].split("=")[0]; //键
							newValue = temp[j].split("=")[1]; //值
							tempState[newName] = newValue
						}
					}
					// tempState['path'] = path;
					value = tempState;
				}
				parms[name] = value;
			}
		}
	} else {
		//UtilsService.showMessage("错误", "检测不到当前登录用户！");
	}
	return parms;
}

/**获取地址栏上的参数
 * @param url 地址字符串
 */
const getParamInUrl2 = function (url) {
	var name, value;
	var parms = {};
	var str = url;
	var num = str.indexOf("?");
	if (num > 0) {
		str = str.substr(num + 1);
		str = str.replace(/#/g, ""); //替换字符串中的#
		str = str.replace(/\//g, ""); //替换字符串中的 /
		var arr = str.split("&"); //各个参数放到数组里
		for (var i = 0; i < arr.length; i++) {
			num = arr[i].indexOf("=");
			if (num > 0) {
				name = arr[i].substring(0, num);
				value = arr[i].substr(num + 1);
				parms[name] = value;
			}
		}
	} else {
		//UtilsService.showMessage("错误", "检测不到当前登录用户！");
		return;
	}
	return parms;
}

var goBack = function (_that) {
	if (window.history.length <= 1) {
		_that.$router.push({
			path: '/home'
		})
	} else {
		_that.$router.go(-1)
	}
};

const getRouteMenu = function (menus, menuId) {
	var menu = {};
	for (var i = 0; i < menus.length; i++) {
		if (menus[i].menu_id == menuId) {
			menu = menus[i];
			break;
		}
	}

	return menu;
};

const resetObject = function (obj) {
	var newObj = Object.assign({}, obj)
	Object.keys(newObj).some(function (key) {
		switch (typeof newObj[key]) {
			case 'number':
				//代码
				return newObj[key] = null
			case 'string':
				//代码
				return newObj[key] = ''
			case 'boolean':
				//代码
				return newObj[key] = false
			case 'function':
				//代码
				return newObj[key] = null
			case 'object':
				//代码
				return newObj[key] = null
			default:
				//代码
				return newObj[key] = null
		}
	});
	return newObj
};

const getMenuList = function (menuList, level, pid) {
	var itemsTemp = [];
	for (var i = 0; i < menuList.length; i++) {
		if (menuList[i].parent_id == pid) {
			var minfo = menuList[i];
			var murl = {};

			try {
				murl = JSON.parse(minfo.menu_url);
			} catch (e) {
				//TODO handle the exception
				console.log("menu_url格式化异常", minfo.menu_url)
			}
			var item = {
				title: '', //菜单名称
				icon: 'mdi-monitor', //菜单图标
				name: '', //菜单ID
				action: "/" + sysConfig.appConfig.pathPrefix + minfo.menu_id, //路由path
				component: "", //路由name
				url: minfo.menu_url
			};
			/* if(pid==-1){
				item.header="";
				item.header=minfo.menu_name;
			} */
			if (level < 3) {
				/* item.group = "";
				item.group = minfo.parent_id + "" */
				item.group = "";
				if (minfo.parent_id == -1) {
					item.group = "MROOT"
				} else {
					item.group = "M" + minfo.parent_id + ""
				}
			}
			if (murl.icon) {
				item.icon = murl.icon;
			}
			/* item.title = minfo.menu_name;
			item.name = minfo.menu_id;
			if (murl.component) {
				item.component = murl.component;
			} */

			item.title = minfo.menu_name;
			item.name = minfo.menu_id;
			item.component = minfo._routerName
			itemsTemp.push(item);
		}
	}

	if (itemsTemp.length > 0) {
		level++;
		for (var i = 0; i < itemsTemp.length; i++) {
			var itemTemp2 = getMenuList(menuList, level, itemsTemp[i].name);
			if (itemTemp2.length > 0) {
				itemsTemp[i].items = [];
				itemsTemp[i].items = itemTemp2;
			}
		}
	}
	return itemsTemp;
}

const initRoutes = function (userMenu) {
	var _userMenu = userMenu;
	var children = [];

	var _appConfig = sysConfig.appConfig;
	var menuItems = [];
	var _topMenu = [{}]; //第一级菜单
	var k = 0;
	for (var i = 0; i < _userMenu.length; i++) {
		var parent_id = _userMenu[i].parent_id;
		_userMenu[i].IsTopMenu = false;
		_userMenu[i]._path =
			"/" + //"/home/"
			sysConfig.appConfig.pathPrefix +
			_userMenu[i].menu_id;
		_userMenu[i]._routerName = "M" + _userMenu[i].menu_id;

		/* if (_userMenu[i].menu_id == _appConfig.rootMenuId) {
			continue;
		}
		if (parent_id == _appConfig.rootMenuId) {
			_userMenu[i].IsTopMenu = true; //是否是顶级菜单
			_userMenu[i]._path =
				"/home/" + //"/home/"
				this._sysConfig.appConfig.pathPrefix +
				_userMenu[i].menu_id;
			_topMenu[k] = _userMenu[i]; //第一级菜单
			k++;
		} 
		if (_topMenu.length == 0) {
			return;
		}*/
		try {
			var item = JSON.parse(_userMenu[i].menu_url.trim());
			var component = require("@/" + item.component).default;
			//设置缓存
			//_userMenu[i]._noCache=false;

			//使用嵌套路由的情况
			if (_userMenu[i].IsTopMenu) {
				var itemm2 = {
					path: "/home/" +
						sysConfig.appConfig.pathPrefix +
						_userMenu[i].menu_id, //item.path,
					name: _userMenu[i]._routerName, //_userMenu[i].menu_id, //item.name,
					component: component,
					// component: require("@/views/home.vue").default,
					meta: {
						requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
						menuInfo: _userMenu[i],
						canExitApp: _userMenu[i].IsTopMenu,
						title: _userMenu[i].menu_name,
						icon: item.icon,
						cacheKey: component.name || '',
						noCache: _userMenu[i]._noCache
					}
				};
				children.push(itemm2);
			} else {
				//不使用嵌套路由的情况
				var itemm = {
					path: "/" +
						sysConfig.appConfig.pathPrefix +
						_userMenu[i].menu_id, //item.path,
					name: _userMenu[i]._routerName, // _userMenu[i]._routerName,//_userMenu[i].menu_id, //item.name,
					component: component,
					//component: require("@/views/home.vue").default,
					meta: {
						requireAuth: true,
						menuInfo: _userMenu[i],
						canExitApp: _userMenu[i].IsTopMenu,
						title: _userMenu[i].menu_name,
						icon: item.icon,
						cacheKey: component.name || '',
						noCache: _userMenu[i]._noCache
					}
				};
				menuItems.push(itemm);
			}
		} catch (error) {
			continue;
		}
	}


	sysConfig.appConfig.topMenu = _topMenu;
	sysConfig.appConfig.userMenu = _userMenu; //保存到全局变量
	sysConfig.appConfig.menuList = getMenuList(_userMenu, 1, "-1");
	//保存左侧菜单到localstorage中，浏览器刷新也能取得到
	//setStore("appMenues", sysConfig.appConfig.menuList);

	window.sessionStorage.setItem('userMenu', JSON.stringify(_userMenu));
	window.sessionStorage.setItem('topMenu', JSON.stringify(_topMenu));
	window.sessionStorage.setItem('menuList', JSON.stringify(sysConfig.appConfig.menuList));
	window.sessionStorage.setItem('routes', JSON.stringify(menuItems));

	return menuItems;

}

/**
 * 初始化session数据
 */
const initSessionStorage = function () {
	window.sessionStorage.removeItem(sysConfig.appConfig.appSessionUserKey);
	window.sessionStorage.removeItem('userMenu');
	window.sessionStorage.removeItem('topMenu');
	window.sessionStorage.removeItem('menuList');
	window.sessionStorage.removeItem('routes');
}

/* 部分隐藏处理
 ** str 需要处理的字符串
 ** frontLen 保留的前几位
 ** endLen 保留的后几位
 ** cha 替换的字符串
 */
const replaceSomeChar = function (str, frontLen, endLen, cha) {
	var len = str.length - frontLen - endLen;
	var xing = '';
	for (var i = 0; i < len; i++) {
		xing += cha;
	}
	return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
}

/**
 * 获取间隔日期， n为往前或者往后几个月，可以为负数
 * @param {Object} var n
 */
const getIntervalMonth = function (n, format) {
	var nowdate = new Date();
	nowdate.setMonth(nowdate.getMonth() - n);
	var y = nowdate.getFullYear();
	var m = nowdate.getMonth() + 1;
	var d = nowdate.getDate();
	var formatwdate = y + '-' + m + '-' + d;
	if (format && !isEmpty(format)) {
		formatwdate = dateFormat(formatwdate, format)
	}
	return formatwdate;
}

/**
 * 判断一个值是不是数字
 * @param {Object} input
 */
const checkNumber = function (input) {
	var reg = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 ，判断正整数用/^[1-9]+[0-9]*]*$/
	return reg.test(input);
}

/**
 * 是否为日期格式字符串
 * @param {Object} input
 */
const isDate = function (input) {
	//返回为false则是日期格式;isNaN(data)排除data为纯数字的情况（此处不考虑只有年份的日期，如‘2018’）
	if (isNaN(input) && !isNaN(Date.parse(input))) {
		//console.log("data是日期格式！")
		return true;
	} else {
		return false;
	}
}

/**
 * 十六进制字符串转十进制
 * @param {Object} hex
 */
const hexStringToInt = function (hex) {
	var len = hex.length,
		a = new Array(len),
		code;
	for (var i = 0; i < len; i++) {
		code = hex.charCodeAt(i);
		if (48 <= code && code < 58) {
			code -= 48;
		} else {
			code = (code & 0xdf) - 65 + 10;
		}
		a[i] = code;
	}

	return a.reduce(function (acc, c) {
		acc = 16 * acc + c;
		return acc;
	}, 0);
}

/**
 * 两个日期对象的相差
 * @param {Object} startDate
 * @param {Object} endDate
 */
const diffTime = function (startDate, endDate) {
	var diff = endDate.getTime() - startDate.getTime(); //时间差的毫秒数  

	//计算出相差天数  
	var days = Math.floor(diff / (24 * 3600 * 1000));

	//计算出小时数  
	var leave1 = diff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数  
	var hours = Math.floor(leave1 / (3600 * 1000));
	//计算相差分钟数  
	var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数  
	var minutes = Math.floor(leave2 / (60 * 1000));

	//计算相差秒数  
	var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数  
	var seconds = Math.round(leave3 / 1000);

	var returnStr = seconds + "秒";
	if (minutes > 0) {
		returnStr = minutes + "分" + returnStr;
	}
	if (hours > 0) {
		returnStr = hours + "小时" + returnStr;
	}
	if (days > 0) {
		returnStr = days + "天" + returnStr;
	}
	return {
		day: days,
		hour: hours,
		minute: minutes,
		second: seconds
	}
}

const checkIDCard = function (id) {
	// 1 "验证通过!", 0 //校验不通过 // id为身份证号码
	var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
	//号码规则校验
	if (!format.test(id)) {
		return {
			'status': 0,
			'msg': '身份证号码不合规'
		};
	}
	//区位码校验
	//出生年月日校验  前正则限制起始年份为1900;
	var year = id.substr(6, 4), //身份证年
		month = id.substr(10, 2), //身份证月
		date = id.substr(12, 2), //身份证日
		time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
		now_time = Date.parse(new Date()), //当前时间戳
		dates = (new Date(year, month, 0)).getDate(); //身份证当月天数
	if (time == 'Invalid Date') {
		//处理苹果手机时间格式转换出错
		time = new Date(tempDate.replace(/\-/g, "/"));
	}
	if (time > now_time || date > dates) {
		return {
			'status': 0,
			'msg': '出生日期不合规'
		}
	}
	//校验码判断
	var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //系数
	var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); //校验码对照表
	var id_array = id.split("");
	var sum = 0;
	for (var k = 0; k < 17; k++) {
		sum += parseInt(id_array[k]) * parseInt(c[k]);
	}
	if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
		return {
			'status': 0,
			'msg': '身份证校验码不合规'
		}
	}
	return {
		cardInfo: {
			birthday: `${year}-${month}-${date}`,
			sex: parseInt(id.substr(16, 1)) % 2 === 0 ? 0 : 1
		}, //奇数为男
		status: 1,
		msg: '校验通过'
	}
}

/**
 * 将菜单传入的公式，转换为适合 element table 需要格式的数据
 *   由于 element 表格里formatter方法格式化数据时，数据都是从row对象里面取值，如row.code,row.gname
 *   所以菜单中写的公式'code+gname'想要正常运算该公式，最终要转换成 'row["code"]+row["gname"]'这种格式
 * 	 同时弃用牛头菜单公式中 IFF 用法，改用if else用法
 */
const formatterExpression = function (row, column, meunCol){
	let NumType = "";
	let point = 0;
	let results = row[column.property];//该行该列的值
	let resultStr = "";

	if(meunCol[0].type == "num"){//数据类型 number或 text(默认)
		NumType = meunCol[0].type
		 point = meunCol[0].point
	}

	if(meunCol[0].filterExpression){//获取公式 'item+gname' ......等 (弃用牛头菜单公式中 IFF 用法，改用if else用法)
		let expression = meunCol[0].filterExpression;
		if(expression.indexOf("if") > -1){// "if(status ==1){'已审核'}else if(status ==2){'未审核'}else{'其他'}"
			let expstr = expression.match(/if((\S*))/)[1].substring(1);//截取if(到)之间的字符串
			resultStr = expression.replace(new RegExp(expstr, 'g'),`row["${expstr}"]`)//全局替换
		}else{//例如公式为：'(a+b)/a'
			let splitArr = expression.split("")
			let cacheArr = []
			let lastIsWord = false
			let itemStr = ""
			for (let i = 0; i < splitArr.length; i++) {
				if(splitArr[i] == "(" ||
					splitArr[i] == ")" ||
					splitArr[i] == "+" ||
					splitArr[i] == "-" ||
					splitArr[i] == "*" ||
					splitArr[i] == "/" ||
					splitArr[i] == "%"
				) {
					if (lastIsWord) {
						if(itemStr)
							cacheArr.push(itemStr)
						itemStr = ""
						lastIsWord = false
					}
					cacheArr.push(splitArr[i])
				} else {
					itemStr += splitArr[i]
					lastIsWord = true
				}

			}
			if (!!itemStr) {
				cacheArr.push(itemStr)
			}

			let replaceArr = cacheArr.map((item,index)=>{
				if (item != "(" &&
					item != ")" &&
					item != "+" &&
					item != "-" &&
					item != "*" &&
					item != "/" &&
					item != "%"
				){
					//有数字和''字符串不替换
					let reg = /^(\-|\+)?\d+(\.\d+)?$/
					if(!reg.test(item)&&item.charAt(0)!=="'"&&item.charAt(item.length-1)!=="'")
						item = item.replace(item,`row["${item}"]`)//'row["a"]'
				}
				return item
			})
			resultStr = replaceArr.join("")//'(row["a"]+row["b"])/row["a"]'
		}
		try {
			results = eval(resultStr)
		} catch (e) {
			console.error(e.message)
		}
		
	
	}
	if(NumType =="num"){
		//results = Number(this.$options.filters['number'](results, point))
		results = number(results, point)
	}
	return results
}



export default {
	initColumnConfig: initColumnConfig,
	initVuetifyColumnConfig: initVuetifyColumnConfig,
	initColumnConfigByArray: initColumnConfigByArray,
	dateFormat: dateFormat,
	getBeforeDate: getBeforeDate,
	isUndefined: isUndefined,
	isEmpty: isEmpty,
	/*
	 $http的参数(httpConfig)
	 method: string,
	 url: string,
	 params: object,
	 data: string or object,
	 headers: object,
	 transformRequest: function transform(data, headersGetter) or an array of functions,
	 transformResponse: function transform(data, headersGetter) or an array of functions,
	 cache: boolean or Cache object,
	 timeout: number,
	 withCredentials: boolean

	 isHttpGet=true表示使用get方法请求服务，否则使用post请求服务
	 * */
	getDataByHttp: getDataByHttp,
	logout: logout,
	eliteHttpGet: eliteHttpGet,
	eliteHttpPost: eliteHttpPost,
	//判断是否有汉字
	isContainChinese: isContainChinese,
	getTimeAgo: getTimeAgo,
	initeParams: initeParams,
	number: number,
	number2: number2,
	getMenuParams: getMenuParams,
	getParamInUrl: getParamInUrl,
	goBack: goBack,
	getRouteMenu: getRouteMenu,
	resetObject: resetObject,
	initRoutes: initRoutes,
	replaceSomeChar,
	getIntervalMonth,
	checkNumber,
	isDate,
	hexStringToInt,
	initSessionStorage,
	diffTime,
	checkIDCard,
	formatterExpression
}