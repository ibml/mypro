<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        fluid
        fill-height
      >
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            xs12
            sm8
            md4
          >
            <v-card class="elevation-12">
              <v-img
                class="white--text"
                height="200px"
                :src="require('@/assets/bj.jpg')"
              >
                <v-container
                  fill-height
                  fluid
                >
                  <v-layout
                    align-center
                    justify-center
                    column
                    fill-height
                  >
                    <v-flex
                      xs12
                      align-end
                      flexbox
                    >
                      <v-avatar
                        size="78"
                        color="grey lighten-4"
                      >
                        <img
                          src="@/assets/user.png"
                          alt="avatar"
                        >
                      </v-avatar>
                    </v-flex>
                    <p />
                    <p />
                    <v-flex
                      xs12
                      align-end
                      flexbox
                    >
                      <span
                        class="headline"
                        v-if="_sysConfig"
                      >{{_sysConfig.defualtApp.systemName}}</span>&nbsp;
                      <span style="font-size: 10px;">{{_sysConfig.defualtApp.version}}</span>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-img>
              <v-card-text>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <v-text-field
                    v-model="userName"
                    v-focus="usernameFocus"
                    v-on:keyup.13.native="tabKey()"
                    prepend-icon="mdi-account"
                    name="login"
                    label="账号："
                    type="text"
                    :rules="nameRules"
                    required
                    ref="username"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    v-model="userPass"
                    v-focus="pwdFocus"
                    v-on:keyup.13.native="newLogin"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="密码："
                    :rules="passRules"
                    required
                    type="password"
                    ref="pwd"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  dark
                  @click="newLogin"
                  color="indigo"
                >登录</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>

</template>

<script>
import { mapState, mapActions } from "vuex";
import AuthenticationService from "@/services/AuthenticationService";
import UserService from "@/services/UserService";
import UtilsService from "@/services/UtilsService";
import MenuService from "@/services/MenuService";
import SiteService from "@/services/SiteService";
import { setStore } from "@/utils/storage";

export default {
  data: () => ({
    drawer: null,
    userName: "",
    nameRules: [v => !!v || "帐号 不能为空。"],
    userPass: "",
    passRules: [v => !!v || "密码 不能为空。"],
    valid: true,
    dialog: {
    	status: false,
    	title: "",
    	message: "",
    	type: ""
    },
    usernameFocus: true,
    pwdFocus: false,
    loading: false
  }),
  computed: {},
  mounted() {
    //AuthenticationService.logout();//清空授权
    //console.log("$route.meta.requireAuth",this.$route.meta.requireAuth)
    //console.log("$route.meta.requireAuth",this.$route.meta.requireAuth)

    let name = this.getUrlKey("name");
    let word = this.getUrlKey("word");
    if(name && word){
      this.userName = name;
      this.userPass = word;

      setTimeout(()=>{
        this.newLogin();
      },100)
    }
  },
  methods: {
    tabKey: function() {
      //console.log(this.$refs.pwd.$el.children[1].children[0].children[0].children[1]);
      this.$refs.pwd.$el.children[1].children[0].children[0].children[1].focus();
      (this.usernameFocus = false), (this.pwdFocus = true);
    },
    getMenuTree(menuList, pid) {
      var itemsTemp = [];
      for (var i = 0; i < menuList.length; i++) {
        if (menuList[i].parent_id == pid) {
          itemsTemp.push(menuList[i]);
        }
      }

      if (itemsTemp.length > 0) {
        for (var i = 0; i < itemsTemp.length; i++) {
          var itemTemp2 = this.getMenuTree(menuList, itemsTemp[i].menu_id);
          if (itemTemp2.length > 0) {
            itemsTemp[i].children = [];
            itemsTemp[i].children = itemTemp2;
          }
        }
      }
      return itemsTemp;
    },
    getMenuList(menuList, level, pid) {
      var itemsTemp = [];
      for (var i = 0; i < menuList.length; i++) {
        if (menuList[i].parent_id == pid) {
          var minfo = menuList[i];

          var item = {
            title: "",
            icon: "tune",
            name: "",
            component: ""
          };
          if (pid == -1) {
            item.header = "";
            item.header = minfo.menu_name;
          }
          if (level < 3) {
            item.group = "";
            item.group = minfo.parent_id + "";
          }
          item.title = minfo.menu_name;
          item.name = minfo.menu_id;

          item.component = minfo._routerName; //murl.component.replace(/.vue/g,"");
          itemsTemp.push(item);
        }
      }

      if (itemsTemp.length > 0) {
        level++;
        for (var i = 0; i < itemsTemp.length; i++) {
          var itemTemp2 = this.getMenuList(menuList, level, itemsTemp[i].name);
          if (itemTemp2.length > 0) {
            itemsTemp[i].items = [];
            itemsTemp[i].items = itemTemp2;
          }
        }
      }
      return itemsTemp;
    },
    register() {},
    newLogin() {
      //表单验证
      if (!this.$refs.form.validate()) {
        //验证未通过
        return;
      }

      if (this.userName == "" || this.userPass == "") {
        return;
      } else {
        var user = {
          username: this.userName,
          password: this.userPass
        };

        this.$mvc.MDialog.show({
          message: "数据处理中...",
          titleIcon: "mdi-info",
          title: "提示",
          type: "loading"
        });

        setTimeout(() => {
          UserService.checkLogin(user)
            .then(resultData => {
              console.log(resultData);
              //console.log("resultData",resultData)
              if (!resultData || resultData.resultKey == "-1") {
                this.$mvc.MDialog.hide();
                //打开dialog
                this.$mvc.MDialog.show({
                  title: "验证失败",
                  titleIcon: "error",
                  message: resultData ? resultData.resultMessage : "未知错误！",
                  showCancel: false
                });

                return;
              } else {
                var loginUser = {
                  userInfo: {}, //登录用户的信息
                  userErpAuth: {}, //用户erp授权信息
                  token: ""
                };
                loginUser.userInfo = resultData.dataList[0];
                loginUser.token = resultData.dataList[0].user_token;

                // if (UtilsService.isEmpty(loginUser.token)) {
                //   this.$mvc.MDialog.show({
                //     title: "验证失败",
                //     titleIcon: "error",
                //     message: "无法获取用户token",
                //     showCancel: false
                //   });
                //   return;
                // }

                AuthenticationService.setCurrentUser(loginUser); //保存用户信息到session
                //获取授权菜单
                MenuService.getUserMenuList()
                  .then(data => {
                    //保存菜单字符串，刷新时候重用
                    // setStore("routesStr", data.dataList);
                    // console.log('登录路由0',data.dataList)
                    var routes = UtilsService.initRoutes(data.dataList);
                    // console.log("登录路由", routes);
                    this.$router.addRoutes(routes);
                    this.$mvc.MDialog.hide();
                    this.$router.push({
                      path: "/home"
                    });
                  })
                  .catch(
                    function(error) {
                      console.log(error);
                    }.bind(this)
                  );
              }
            })
            .catch(
              function(error) {
                this.$mvc.MDialog.show({
                  title: "错误",
                  titleIcon: "error",
                  message: error,
                  showCancel: false
                });
              }.bind(this)
            );
        }, 2000);
      }
    },
    async login2() {
      if (this.$refs.form.validate()) {
        var user = {
          username: this.userName,
          password: this.userPass
        };
        var dialog = {};
        this.loading = true;
        dialog.status = true;
        dialog.title = "提示";
        dialog.message = "数据处理中...";
        dialog.type = "loading";
        this.$store.commit("GlobalDialog/SET_DIALOG", dialog);
        // window.getApp.$emit('APP_SHOW_DIALOG', dialog);
        let res = await UserService.checkLogin(user);
        console.log(res);
        let { resultKey, resultMessage, dataList } = res;
        if (resultKey != "-1") {
          var loginUser = {
            userInfo: dataList[0], //登录用户的信息
            userErpAuth: {}, //用户erp授权信息
            token: ""
          };
          AuthenticationService.setCurrentUser(loginUser); //记录登录用户
          dialog.status = false;
          this.$store.commit("GlobalDialog/SET_DIALOG", dialog);
          // window.getApp.$emit('APP_SHOW_DIALOG', dialog);
          this.$router.push("/home");
        } else {
          this.loading = false; //验证失败，用户可输入
          dialog.status = true;
          dialog.type = "confirm";
          dialog.title = "用户验证失败";
          dialog.ok = "1";
          dialog.message = resultMessage;
          this.$store.commit("GlobalDialog/SET_DIALOG", dialog);
          // window.getApp.$emit('APP_SHOW_DIALOG', dialog);
        }
      }
    },
    login() {
      //表单验证
      if (this.$refs.form.validate()) {
      }

      if (this.userName == "" || this.userPass == "") {
        return;
      } else {
        var user = {
          username: this.userName,
          password: this.userPass
        };

        this.loading = true;
        this.dialog.status = true;
        this.dialog.title = "提示";
        this.dialog.message = "数据处理中...";
        this.dialog.type = "loading";
        this.$store.commit("GlobalDialog/SET_DIALOG", this.dialog);
        // window.getApp.$emit('APP_SHOW_DIALOG', this.dialog);

        setTimeout(() => {
          UserService.checkLogin(user)
            .then(resultData => {
              this.loading = false;
              //this.dialog.status = false;
              if (!resultData || resultData.resultKey == "-1") {
                this.dialog.status = true;
                this.dialog.type = "confirm";
                this.dialog.title = "用户验证失败";
                this.dialog.ok = "1";
                if (resultData) {
                  this.dialog.message = resultData.resultMessage;
                } else {
                  this.dialog.message = "未知错误！";
                }
                this.$store.commit("GlobalDialog/SET_DIALOG", dialog);
                // window.getApp.$emit('APP_SHOW_DIALOG', this.dialog);
                return;
              } else {
                var loginUser = {
                  userInfo: {}, //登录用户的信息
                  userErpAuth: {}, //用户erp授权信息
                  token: ""
                };
                loginUser.userInfo = resultData.dataList[0];
                loginUser.token = resultData.dataList[0].user_token;

                if (UtilsService.isEmpty(loginUser.token)) {
                  return;
                }
                AuthenticationService.setCurrentUser(loginUser); //保存用户信息到session
                //获取系统信息
                SiteService.getSiteList(loginUser.userInfo.site_id).then(
                  data => {
                    if (!data || data.resultKey == "-1") {
                      this.dialog.status = true;
                      this.dialog.type = "confirm";
                      this.dialog.title = "系统信息获取失败";
                      this.dialog.ok = "1";
                      if (resultData) {
                        this.dialog.message = resultData.resultMessage;
                      } else {
                        this.dialog.message = "未知错误！";
                      }
                      this.$store.commit(
                        "GlobalDialog/SET_DIALOG",
                        this.dialog
                      );
                      // window.getApp.$emit('APP_SHOW_DIALOG', this.dialog);
                      return;
                    } else {
                      var site = data.dataList[0];
                      this._sysConfig.systemName = site.siteName;
                      this._sysConfig.copyright = site.siteDescribe;
                    }
                  }
                );
                //获取授权菜单
                MenuService.getUserMenuList()
                  .then(data => {
                    console.log("菜单", data);

                    var _userMenu = data.dataList;
                    var children = [];

                    var _appConfig = this._sysConfig.appConfig;
                    var menuItems = [];
                    var _topMenu = [{}]; //第一级菜单
                    var k = 0;
                    for (var i = 0; i < _userMenu.length; i++) {
                      var parent_id = _userMenu[i].parent_id;
                      _userMenu[i].IsTopMenu = false;
                      _userMenu[i]._path =
                        "/" + //"/home/"
                        this._sysConfig.appConfig.pathPrefix +
                        _userMenu[i].menu_id;
                      _userMenu[i]._routerName = "M" + _userMenu[i].menu_id;

                      if (_userMenu[i].menu_id == _appConfig.rootMenuId) {
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
                      }

                      try {
                        var item = JSON.parse(_userMenu[i].menu_url);
                        if (item.noCache) {
                          _userMenu[i].noCache = item.noCache;
                        } else {
                          item.noCache = false;
                        }

                        //使用嵌套路由的情况
                        if (_userMenu[i].IsTopMenu) {
                          var itemm2 = {
                            path:
                              "/home/" +
                              this._sysConfig.appConfig.pathPrefix +
                              _userMenu[i].menu_id, //item.path,
                            name: _userMenu[i]._routerName, //"M" + _userMenu[i].menu_id,
                            component: require("@/" + item.component).default,
                            // component: require("@/views/home.vue").default,
                            meta: {
                              requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                              menuInfo: _userMenu[i],
                              canExitApp: _userMenu[i].IsTopMenu,
                              title: _userMenu[i].menu_name,
                              noCache: _userMenu[i]._noCache
                            }
                          };
                          children.push(itemm2);
                        } else {
                          //不使用嵌套路由的情况
                          var itemm = {
                            path:
                              "/" +
                              this._sysConfig.appConfig.pathPrefix +
                              _userMenu[i].menu_id, //item.path,
                            name: _userMenu[i]._routerName, //"M" + _userMenu[i].menu_id, //item.name,
                            component: require("@/" + item.component).default,
                            //component: require("@/views/home.vue").default,
                            meta: {
                              requireAuth: true,
                              menuInfo: _userMenu[i],
                              canExitApp: _userMenu[i].IsTopMenu,
                              title: _userMenu[i].menu_name,
                              noCache: _userMenu[i]._noCache
                            }
                          };
                          menuItems.push(itemm);
                        }
                      } catch (error) {
                        // console.log(error)
                        /* this.loadings = false;
													  this.msg = "发生异常：" + error;
													  this.alert = true;
													  return; */
                        continue;
                      }
                    }
                    /* if (children && children.length > 0) {
												children[0]["alias"] = "/home"; //默认打开的菜单页面
											}
											var home = {
												path: "/home",
												component: require("@/views/NewHome.vue").default,
												children: children,
												canExitApp: true
											};
											menuItems.push(home); */

                    var menuTree = this.getMenuTree(_userMenu, "-1");
                    this._sysConfig.appConfig.menuTree = menuTree; //保存到全局变量
                    this._sysConfig.appConfig.menuList = this.getMenuList(
                      _userMenu,
                      1,
                      "-1"
                    );
                    this._sysConfig.appConfig.topMenu = _topMenu;
                    this._sysConfig.appConfig.userMenu = _userMenu; //保存到全局变量
                    //保存左侧菜单到localstorage中，浏览器刷新也能取得到
                    setStore("appMenues", this._sysConfig.appConfig.menuList);
                    this.$router.addRoutes(menuItems);

                    this.$store.commit("routes/setRoutes", menuItems);

                    //this.$router.push({ path: "/" +this._sysConfig.appConfig.pathPrefix+ _topMenu[0].menu_id });
                    /* this.$router.push({
												path: "/home"
											}); */

                    this.$router.push("/home");
                  })
                  .catch(function(error) {}.bind(this));
              }
              this.dialog.status = false;
            })
            .catch(function(error) {}.bind(this));
        }, 2000);
      }
    },

    // 获取url参数
    getUrlKey(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
    },
  }
};
</script>