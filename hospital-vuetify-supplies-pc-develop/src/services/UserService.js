import UtilsService from '@/services/UtilsService'
import AuthenticationService from '@/services/AuthenticationService'
import MenuService from "@/services/MenuService";
export default {
    checkLogin: function (user) {

        var jsonData = {
            dataType: "json",
            //serviceName: "spdService",
            serviceName: "mybitisUserService",
            // serviceName: "userService",
            //methodName: "getLoginUserByPsd",
            methodName: "getLoginUser",
            //methodName: "getPsdList",
            //code1:user.username,
            userCode: user.username,
            password: user.password,
            saPassword: user.password,
            saAccount: user.username,
            isPlatform: user.isPlatform
        };

        if (!UtilsService.isEmpty(user.type)) {
            jsonData.type = user.type;
        }
        if (!UtilsService.isEmpty(user.wxid)) {
            jsonData.wxid = user.wxid;
        }
        Object.assign(jsonData, user);
        //console.log("---1--UserService---jsonData-",jsonData);
        //console.log("----user----",user);
        return UtilsService.eliteHttpGet(jsonData, {
            cache: true
        }, {
            includeUserErpAuth: false
        });

    },
    changePwd: function (user) {
        var jsonData = {
            dataType: "json",
            serviceName: "userService",
            methodName: "updatePwd",
            userId: AuthenticationService.getUserId()
        };
        Object.assign(jsonData, user); //合并json对象
        return UtilsService.eliteHttpPost(jsonData, {
            cache: false
        }, {
            includeUserErpAuth: false
        });
    },
    getErpUserAuth: function (userId) {
        var jsonData = {
            dataType: "json",
            serviceName: "systemAccountsService",
            methodName: "getErpUserAuthList",
            eliteUserId: userId
        };
        return UtilsService.eliteHttpGet(jsonData, {
            cache: true
        }, {
            includeUserErpAuth: false
        });
    },
    /**
     * 
     * @param {*} resultData 登录返回的结果
     * @param {*} _this -vue对象
     * @param {*} toPath 要跳转到的路径
     * @description 登陆成功存储用户信息到session，并初始化路由
     */
    initUserInfo: function (resultData, _this, toPath) {

        return new Promise(function (resolve, reject) {
            //登录成功，需要读取菜单
            // await UserService.initUserInfo(data1, _this, param.state.toPath);
            var loginUser = {
                userInfo: {}, //登录用户的信息
                userErpAuth: {}, //用户erp授权信息
                token: ""
            };
            console.log("----UserService--resultData---",resultData);
            //loginUser.userInfo = resultData.dataList[0];
            //loginUser.token = resultData.dataList[0].user_token;
            console.log("---11-UserService----token----",loginUser.token);

            if (UtilsService.isEmpty(loginUser.token)) {
                //隐藏loading
                // _this.dialog.status = false;
                return;
            }
            AuthenticationService.setCurrentUser(loginUser); //保存用户信息到session
            //获取授权菜单
            MenuService.getUserMenuList()
                .then(data => {
                    //隐藏loading
                    // _this.dialog.status = false;
                    var routes = UtilsService.initRoutes(data.dataList);
                    _this.$router.addRoutes(routes);
                    if (!UtilsService.isUndefined(toPath) && !UtilsService.isEmpty(toPath)) {
                        _this.$router.push({
                            path:toPath
                        });
                    } else {
                        _this.$router.push({
                            path: "/home"
                        });
                    }
                    resolve();

                })
                .catch(function (error) {
                    //隐藏loading
                    // _this.dialog.status = false;
                    console.log(error)
                    reject()
                }.bind(_this));

        })
    }
}