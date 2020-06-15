import UtilsService from "@/services/UtilsService";

const isEmpty = function (vars) {
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

var isUndefined = function (vars) {
	if (typeof (vars) === 'undefined') {
		return true;
	}
	return false;
}

//默认时间
const normalTime = time => {
	if (time) {
		var oDate = new Date();
		oDate.setTime(time);

		var y = oDate.getFullYear();
		var m = oDate.getMonth() + 1;
		var d = oDate.getDate();

		var h = oDate.getHours();
		var m = oDate.getMinutes();
		var s = oDate.getSeconds();

		return y + "-" + m + "-" + d + " " + h + ":" + m + ":" + s;
	}
};

//补零
const fillZero = num => {
	return num < 10 ? "0" + num : num;
};

//带参数
//货币形式
const currency = (value, unit, decimal) => {

	if (value == null || value == '') {
		return '';
	}

	let reg = /^[0-9]+.?[0-9]*$/;
	if (!reg.test(value)) return "";
	value = decimal == undefined ? value : value.toFixed(decimal);
	return `${unit}${value}`;
};

//首字母大写
const capitalize = value => {
	if (!value) return "";
	value = value.toString();
	return value.charAt(0).toUpperCase() + value.slice(1);
};

//时间戳转换为指定格式时间
const timeFormat = (value, format) => {
	//https://www.cnblogs.com/xinwusuo/p/5948908.html
	//验证非零的正整数：^\+?[1-9][0-9]*$ 
	if (value == null || value == '') {
		return '';
	}
	const pattern = /^\+?[1-9][0-9]*$/
	if (pattern.test(value)) {
		value = parseInt(value);
	}
	
	

	let date = new Date(value);
	
	if(date=='Invalid Date'){
		return value;
	}
	
	let y = date.getFullYear();
	let m = date.getMonth() + 1;
	let d = date.getDate();
	let h = date.getHours();
	let min = date.getMinutes();
	let s = date.getSeconds();
	let result = "";

	if (format == "yyyy-MM-dd") {
		result = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
	} else if (format == "yyyy-MM") {
		result = `${y}-${m < 10 ? "0" + m : m}`;
	} else if (format == "MM-dd") {
			result = `${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
	} else if (format == "hh:mm") {
		result = ` ${h < 10 ? "0" + h : h}:${min < 10 ? "0" + min : min}`;
	} else if (format == undefined || format == "yyyy-MM-dd HH:mm:ss") {
		result =
			`${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${
      h < 10 ? "0" + h : h
    }:${min < 10 ? "0" + min : min}:${s < 10 ? "0" + s : s}`;
	} else {
		result =
			`${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${
		  h < 10 ? "0" + h : h
		}:${min < 10 ? "0" + min : min}:${s < 10 ? "0" + s : s}`;
	}
	return result;
};

const gridItemFormat = (item, col) => {
	//把item传进来，输出他的item.exp5
	var str = '';
	if (col.filterExpression.indexOf("item") === -1) {
		let name = col.columnName.split("+");
		name.forEach(element => {
			try {
				if (item[element]) {
					str = str + item[element];
				}
			} catch (e) {
				//TODO handle the exception
				console.log("异常-item[element]", e);
			}
		});
	}

	if (col.filterExpression.trim().length > 0) {
		var array = col.filterExpression.split("|");
		for (const val of array) {
			if (val.length > 0) {
				if (val.indexOf("item") > -1) {
					try {
						str = eval(val); //如果存在item，那么显示数据将根据公式显示，否则根据列明取值显示
					} catch (error) {
						console.log(888, '出错了')
						str = 'ERROR:参数处理异常'
					}
					//str = eval(val); //如果存在item，那么显示数据将根据公式显示，否则根据列明取值显示
				} else if (val.indexOf("number") != -1) {
					//若number存在则证明需要转化小数
					var a = val.split(":");
					if (!this.isEmpty(str)) {
						str = eval(a[0] + "(" + str + "" + "," + eval(a[1]) + ")");
					}
				} else if (val.indexOf("currency") != -1) {
					var a = val.split(":");
					if (str != null && str != '') {
						str = eval(a[0] + "(" + str + "" + "," + a[1] + ")");
					}

				} else if (val.indexOf("timeFormat") != -1) {
					str = timeFormat(str, val.substr(val.indexOf(":") + 1))
				}
			}
		}
	}

	return str;
};


//js 自定义保留小数四舍五入
const numberRound = (s, n) => {
	if (this.isUndefined(s) || s === '') {
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
const number = (s, n) => {
	if (this.isUndefined(s) || s === '') {
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

export default {
	normalTime,
	fillZero,
	currency,
	capitalize,
	timeFormat,
	gridItemFormat,
	number,
	numberRound
};
