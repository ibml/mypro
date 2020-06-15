<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app id="app">
    <template v-if="isMain">
      <v-navigation-drawer
        style="top:0"
        v-model="drawer"
        :mini-variant.sync="mini"
        :clipped="$vuetify.breakpoint.lgAndUp"
        app
        fixed
        width="300"
      >
        <v-app-bar
          color="blue darken-3"
          dark
          dense
          flat
        >
          <v-btn
            class="px-8"
            icon
            large
          >
            <v-avatar
              size="36px"
              item
            >
              <v-img :src="require('@/'+appInfo.faviconPath)" />
            </v-avatar>
          </v-btn>
          <span v-show.lazy="mini===false">{{appInfo.systemName+' '+appInfo.version}}</span>
        </v-app-bar>
        <!-- <v-list-item>
				<v-list-item-avatar>
					<v-icon large v-if="!isLogin">mdi-account-circle</v-icon>
					<v-img src="https://randomuser.me/api/portraits/men/85.jpg" v-if="isLogin"></v-img>
				</v-list-item-avatar>
				<v-list-item-title class="title" v-if="isLogin">{{userInfo.user_code+' '+userInfo.user_name}}
				</v-list-item-title>
				<v-list-item-title class="title" v-else>未登录</v-list-item-title>
				<v-btn icon @click.stop="mini = !mini">
					<v-icon>mdi-chevron-left</v-icon>
				</v-btn>
			</v-list-item> -->
        <v-list-item>
          <v-list-item-avatar>
            <v-icon
              large
              v-if="!isLogin"
            >mdi-account-circle</v-icon>
            <v-img
              :src="require('@/assets/man.png')"
              v-if="isLogin  && userInfo.userSex ==='1'"
            ></v-img>
            <v-img
              :src="require('@/assets/woman.png')"
              v-if="isLogin  && userInfo.userSex !=='1'"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              class="title"
              v-if="isLogin"
            >{{userInfo.user_code+' '+userInfo.user_name}}
            </v-list-item-title>
            <v-list-item-title
              class="title"
              v-else
            >未登录</v-list-item-title>
          </v-list-item-content>
          <v-btn
            icon
            @click.stop="mini = !mini"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-list-item>
        <!-- <v-list-item two-line>
				<v-list-item-avatar>
					<v-icon large v-if="!isLogin">mdi-account-circle</v-icon>
					<v-img :src="require('@/assets/man.png')" v-if="isLogin  && userInfo.userSex ==='1'"></v-img>
					<v-img :src="require('@/assets/woman.png')" v-if="isLogin  && userInfo.userSex !=='1'"></v-img>
				</v-list-item-avatar>
			
				<v-list-item-content>
					<v-list-item-title class="title" v-if="isLogin">{{userInfo.userCode+' '+userInfo.userName}}
					</v-list-item-title>
					<v-list-item-title class="title" v-else>未登录</v-list-item-title>
					<v-list-item-subtitle v-if="isLogin">{{userInfo.deptName}}</v-list-item-subtitle>
				</v-list-item-content>
				<v-btn icon @click.stop="mini = !mini">
					<v-icon>mdi-chevron-left</v-icon>
				</v-btn>
			</v-list-item> -->

        <v-list v-if="false">
          <v-list-item>
            <v-list-item-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-item-avatar>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title
                class="title"
                v-if="isLogin"
              >{{userInfo.user_ode+' '+userInfo.user_ame}}
              </v-list-item-title>
              <v-list-item-title
                class="title"
                v-else
              >未登录</v-list-item-title>
              <v-list-item-subtitle>john@vuetifyjs.com</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-menu-down</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list
          dense
          expand
          subheader
        >
          <v-subheader>系统</v-subheader>
          <v-list-item v-if="false">
            <v-list-item-content>
              <v-list-item-title>{{userInfo.dept_name}}</v-list-item-title>
              <v-list-item-subtitle>{{userInfo.siteName}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{ path: '/supplies/DashPane' }">
            <v-list-item-action>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>首页</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            :to="{ path: '/userInfo' }"
            v-if="isLogin"
          >
            <v-list-item-action>
              <v-icon>mdi-lock-reset</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>修改密码</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            @click="checkLogout()"
            v-if="isLogin"
          >
            <v-list-item-action>
              <v-icon class="">mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>注销登录</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        <v-list
          dense
          expand
          subheader
        >
          <v-subheader>我的菜单</v-subheader>
          <template v-for="(item, i) in menus">
            <!--group with subitems-->
            <v-list-group
              v-if="item.items"
              :key="item.name"
              :prepend-icon="item.icon"
              no-action
            >
              <!-- 第一级有子节点的菜单 -->

              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </template>

              <template v-for="(subItem, i) in item.items">
                <!--sub group-->
                <v-list-group
                  v-if="subItem.items"
                  :key="subItem.name"
                  sub-group
                >
                  <v-list-item
                    slot="activator"
                    ripple="ripple"
                  >
                    <v-list-item-content>
                      <v-list-item-title style="font-size: 14px;font-weight: 500;">
                        {{ subItem.title }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <!--第三级菜单-->
                  <v-list-item
                    v-for="(grand, i) in subItem.items"
                    :key="i"
                    :to="genChildTarget(item, grand)"
                    :href="grand.href"
                    ripple="ripple"
                  >
                    <v-list-item-content>
                      <v-list-item-title style="font-size: 14px;font-weight: 500;">
                        {{ grand.title }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action v-if="grand.icon">
                      <v-icon>{{ grand.icon }}</v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-group>
                <!--第二级菜单-->
                <v-list-item
                  dense
                  v-else
                  :key="i"
                  :to="genChildTarget(item, subItem)"
                  :href="subItem.href"
                  :disabled="subItem.disabled"
                  :target="subItem.target"
                  ripple
                  link
                >
                  <v-list-item-content>
                    <v-list-item-title style="font-size: 14px;font-weight: 500;">{{ subItem.title }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action v-if="subItem.icon">
                    <v-icon>{{ subItem.icon }}</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list-group>
            <v-subheader
              v-else-if="item.header"
              :key="i"
            >{{ item.header }}</v-subheader>
            <v-divider
              v-else-if="item.divider"
              :key="i"
            ></v-divider>
            <!--top-level link-->
            <!-- 第一级没有子节点的菜单 -->
            <v-list-item
              v-else
              :to="!item.href ? { name: item.component } : null"
              :href="item.href"
              ripple="ripple"
              :disabled="item.disabled"
              :target="item.target"
              rel="noopener"
              :key="item.name"
            >
              <v-list-item-action v-if="item.icon">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title style="font-size: 14px;font-weight: 500;">{{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar
        app
        color="blue darken-3"
        dark
        dense
        flat
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <!-- <span>{{userInfo.siteName}}</span> -->
        <v-chip
          class="ma-2"
          color="orange"
          text-color="black"
          small
        >
          {{sysMode}}
        </v-chip>
        <v-spacer></v-spacer>
        <v-btn
          text
          v-show="isLogin"
          style=""
        >
          <v-icon left>mdi-settings-transfer</v-icon>系统设置
        </v-btn>
        <v-btn
          text
          @click="checkLogout()"
          v-show="isLogin"
          style=""
        >
          <v-icon left>mdi-lock-reset</v-icon>修改密码
        </v-btn>
        <v-btn
          text
          @click="tologin"
          v-show="!isLogin"
        >
          <v-icon left>mdi-login</v-icon> 登录
        </v-btn>
        <v-btn
          text
          @click="checkLogout()"
          v-show="isLogin"
          style=""
        >
          <v-icon left>mdi-logout</v-icon>注销登录
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-bell</v-icon>
        </v-btn>
      </v-app-bar>

      <v-content>
        <v-toolbar
          id="toolbar"
          dense
          flat
        >
          <tag-view />
        </v-toolbar>
        <keep-alive :include="cachedViews">
          <router-view class="pa-2" :key="$route.fullPath"></router-view>
        </keep-alive>
      </v-content>
    </template>
    <template v-else>
      <transition>
        <keep-alive>
          <router-view :key="$route.fullPath"></router-view>
        </keep-alive>
      </transition>
    </template>
  </v-app>
</template>
	<script>
import UtilsService from "@/services/UtilsService";
import AuthenticationService from "@/services/AuthenticationService";

export default {
  data: () => ({
    dialog: false,
    drawer: null,
    mini: false,
    state: "",
    code: "",
    admins: [
      ["Management", "mdi-people_outline"],
      ["Settings", "mdi-settings"]
    ],
    cruds: [
      ["Create", "mdi-add"],
      ["Read", "mdi-insert_drive_file"],
      ["Update", "mdi-update"],
      ["Delete", "mdi-delete"]
    ],
    sysMode: process.env.VUE_APP_MODE,
    isMain: false,
    isLogin: !!AuthenticationService.isLogged(),
    userInfo: {},
	menus: JSON.parse(window.sessionStorage.getItem("menuList")),
  }),
  created() {},
  computed: {
    //...mapState('app', ['isLogin']),
    appInfo: {
      get() {
        return this._sysConfig.defualtApp;
      }
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.userInfo = AuthenticationService.getCurrentUser()
          ? AuthenticationService.getCurrentUser().userInfo
          : {};
		this.isLogin = !!AuthenticationService.isLogged();
		this.menus= JSON.parse(window.sessionStorage.getItem("menuList"))||[]
      });
      if (this.$route.meta.requireAuth || !this.$route.meta.public) {
        this.isMain = true;
      } else {
        this.isMain = false;
      }
    }
  },
  methods: {
    checkLogout() {
      var vue = this;
      this.$mvc.MDialog.show({
        title: "提示",
        titleIcon: "mdi-information",
        message: "确定退出吗？",
        onCancel() {},
        onConfirm() {
          UtilsService.logout();
        }
      });
    },
    logout: function() {},
    tologin() {
      UtilsService.logout();
    },
    genChildTarget(item, subItem) {
      if (subItem.href) return;
      if (subItem.component) {
        return {
          name: subItem.component
        };
      }
      return {
        name: `${subItem.name}`
      };
    }
  },
  mounted: function() {}
};
</script>
	<style>
#toolbar .v-toolbar__content {
  padding: 0px;
  background-color: #f3f3f3;
}
</style>