import axios from 'axios';
import sysConfig from '../config'
import AuthenticationService from '../services/AuthenticationService'
import {
    isArray
} from 'util';
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 1000000;
// axios.defaults.baseURL = '';
//设置默认请求头
/* axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest'
}
 */
//http request 拦截器
axios.interceptors.request.use(
    config => {
        //config.data = JSON.stringify(config.data);
        config.headers = config.headers || {};
        if (AuthenticationService.isLogged()) {
            config.headers = {
                'Authorization': 'Bearer ' + AuthenticationService.getCurrentUser().token,
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest'
            };
        } else {
            config.headers = {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest'
            };
        }
        return config;
    },
    error => {
        return Promise.reject(err);
    }
);


// //响应拦截器即异常处理
axios.interceptors.response.use(response => {
    return response
}, err => {
    //console.log(err)
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                err.message = '错误请求(400)。'
                break;
            case 401:
                err.message = '未授权，请重新登录(401)。'
                break;
            case 403:
                err.message = '拒绝访问(403)。'
                break;
            case 404:
                err.message = '请求错误,未找到该资源(404)。'
                break;
            case 405:
                err.message = '请求方法未允许(405)。'
                break;
            case 408:
                err.message = '请求超时(408)。'
                break;
            case 500:
                err.message = '服务器端出错(500)。'
                break;
            case 501:
                err.message = '网络未实现(501)。'
                break;
            case 502:
                err.message = '网络错误(502)。'
                break;
            case 503:
                err.message = '服务不可用。'
                break;
            case 504:
                err.message = '网络超时(504)。'
                break;
            case 505:
                err.message = 'http版本不支持该请求(505)。'
                break;
            default:
                err.message = `连接错误：${err.response.status}`
        }
    } else {
        err.message = "连接到服务器失败。"
    }
    console.log("err.message", err.message)
    return Promise.reject(err.message)
})




/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
            .then(response => {
                if (response && response.data) {
                    var {
                        data
                    } = response
                    //console.log("--1--Http--response-",response);
                    //统一返回数据类型
                    try {
                        //旧的返回数据结构格式
                        if (isArray(data)) {
                            var {
                                msg,
                                result,
                                data
                            } = data[0];
                            var res = {
                                dataList: data,
                                resultKey: result,
                                resultMessage: msg,
                            }
                            resolve(res);
                        } else {
                            /*console.log('data',data);*/
                            //新的返回数据结构
                            /* resolve(response.data); */

                            var {
                                message,
                                mark,
                                data
                            } = data;
                            var res = {
                                dataList: data,
                                resultKey: mark + "", //mark是整型，不转换会影响以前的判断
                                resultMessage: message,
                            }

                            resolve(res);
                        }
                    } catch (error) {
                        console.log(error)
                        var res = {
                            dataList: [],
                            resultKey: -1,
                            resultMessage: "Http.js发生了语法错误",
                        }
                        resolve(res);
                    }
                } else {
                    resolve(response);
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}

function get2(params = {}) {
    return get(sysConfig.webUrl, params)
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
function post(url, data = {}) {
    var params = new URLSearchParams();
    for (var val in data) {
        if (typeof (data[val]) === 'object') {
            params.append(val, JSON.stringify(data[val]));
        } else {
            params.append(val, data[val]);
        }
    }
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
                if (response && response.data) {
                    var {
                        data
                    } = response
                    try {
                        //旧的返回数据结构格式
                        if (isArray(data)) {
                            var {
                                msg,
                                result,
                                data
                            } = data[0];
                            var res = {
                                dataList: data,
                                resultKey: result,
                                resultMessage: msg,
                            }
                            resolve(res);
                        } else {
                            //新的返回数据结构
                            // resolve(response.data);
                            var {
                                message,
                                mark,
                                data
                            } = data;
                            var res = {
                                dataList: data,
                                resultKey: mark + "", //mark是整型，不转换会影响以前的判断
                                resultMessage: message,
                            }

                            resolve(res);
                        }
                    } catch (error) {
                        console.log(error)
                        var res = {
                            dataList: [],
                            resultKey: -1,
                            resultMessage: "Http.js发生了语法错误",
                        }
                        resolve(res);
                    }
                } else {
                    resolve(response);
                }
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(response => {
                resolve(response.data);
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
/**
 * 表单post，需要封装成FormData对象
 * 需要把普通对象循环然后逐个加入FormData对象
 * 若是file对象还要加上文件
 * fd.append('avatar',file.el.files[0],file.el.files[0].name)
 * 针对"Content-Type": "multipart/form-data;charset=utf-8"使用
 */
function formPost(url, data = {}) {
    var params = new FormData();
    for (var val in data) {
        // 判断是否为file
        if (data[val] && data[val].constructor.name == 'File') {
            params.append(val, data[val], data[val].name)
        } else {
            params.append(val, data[val])
        }
    }
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
    })
}

export default {
    get,
    post
}