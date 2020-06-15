<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-row no-gutters>
      <v-col
        cols="4"
        class="pa-0"
        align-self="center"
      >
        <v-combobox
          outlined
          dense
          hide-details
          v-model="tagetDept"
          :items="deptItems"
          item-text="deptname"
          item-value="dept"
          label="目标部门"
          no-data-text="无可用数据"
          @change="comboboxChange"
        ></v-combobox>
      </v-col>
      <v-col cols="1">
        <v-spacer></v-spacer>
      </v-col>
      <v-col
        cols="6"
        class="pa-0"
        align-self="center"
      >
        <v-text-field
          id="my-input"
          dense
          outlined
          hide-details
          v-model="fnpNo"
          @keyup.enter="doFNno"
        ></v-text-field>
      </v-col>
      <v-col
        cols="1"
        class="pa-0"
        align-self="center"
      >
        <v-btn
          color="primary"
          height="40"
          block
          depressed
          @click="doFNno"
        >消耗</v-btn>
      </v-col>

    </v-row>
    <v-row
      no-gutters
      class="pt-1"
    >
      <v-col
        cols="12"
        class="pa-0"
      >
        <v-tabs
          dense
          background-color="#dddd"
          v-model="tab"
        >
          <v-tab>货位信息</v-tab>
          <v-tab>货位图</v-tab>
          <v-tab>未上架品种</v-tab>
          <v-tab>科室库存</v-tab>
          <v-tab>今日消耗</v-tab>
          <v-tab>日清单查询</v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <v-row
            align-content="center"
            justify="start"
            align="center"
            no-gutters
          >
            <v-col cols="6">
              <v-list-item dense>
                <v-list-item-action class="pa-0 mr-0">
                  <v-subheader class="pa-0">快速过滤：</v-subheader>
                </v-list-item-action>
                <v-list-item-content>
                  <v-text-field
                    dense
                    outlined
                    hide-details
                    placeholder="直接输入即可查询"
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col
              cols="2"
              class="py-0"
            >
              <v-btn
                depressed
                text
                color="primary"
                @click="getTagLocator"
              > 查询</v-btn>
            </v-col>
          </v-row>
          <v-card-text class="pt-0">
            <el-table
              border
              :data="dataList1"
              style="width: 100%;"
              :height="computedTableHeight"
            >
              <template v-for="(col ,index) in columns0">
                <el-table-column
                  :prop="col.columnName"
                  :label="col.text"
                  :width="col.width"
                  :key="index"
                >
                </el-table-column>
              </template>

            </el-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-row
            align-content="center"
            justify="start"
            align="center"
            no-gutters
          >
            <v-col cols="6">
              <v-list-item>
                <v-list-item-action class="pa-0 mr-0">
                  <v-subheader class="pa-0">快速过滤：</v-subheader>
                </v-list-item-action>
                <v-list-item-content>
                  <v-text-field
                    dense
                    outlined
                    hide-details
                    v-model="quickSearch1"
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
          <v-card-text class=" py-0">
            <div
              id="scroll-target"
              :style="{maxHeight:`${computedTableHeight}`}"
              class="overflow-y-auto pt-0"
            >
              <v-row dense>
                <v-col
                  cols="3"
                  class="pa-0"
                  v-for="(item,i) in filterList"
                  :key="i"
                >
                  <v-card
                    outlined
                    tile
                  >
                    <v-card-text class="pa-2 pb-0">
                      <span
                        style="display:block"
                        class="text-truncate"
                      > 名称：{{item.item_desc}}</span>
                      <span style="display:block"> 编码：{{item.item_code}}</span>
                      <span style="display:block"> 规格：{{item.item_spec}}</span>
                    </v-card-text>
                    <v-card-actions class="px-2 py-0">
                      <v-row
                        dense
                        justify="center"
                        align="center"
                      >
                        <v-col cols="12">
                          <span>ID:{{item.id}}</span>
                          <v-btn
                            text
                            color="primary"
                            small
                          >
                            上架
                          </v-btn>
                          <span>余：{{item.num}}</span>
                        </v-col>
                      </v-row>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-row
            align-content="center"
            justify="start"
            align="center"
            no-gutters
          >
            <v-col cols="6">
              <v-list-item>
                <v-list-item-action class="pa-0 mr-0">
                  <v-subheader class="pa-0">快速过滤：</v-subheader>
                </v-list-item-action>
                <v-list-item-content>
                  <v-text-field
                    dense
                    outlined
                    hide-details
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col
              cols="2"
              class="py-0"
            >
              <v-btn
                depressed
                text
                color="primary"
                @click="getBaseItem"
              > 查询</v-btn>
            </v-col>
          </v-row>
          <v-card-text class="pt-0">
            <el-table
              border
              :data="dataList2"
              style="width: 100%;"
              :height="computedTableHeight"
            >
              <template v-for="(col ,index) in columns1">
                <el-table-column
                  :prop="col.columnName"
                  :label="col.text"
                  :width="col.width"
                  :key="index"
                >
                </el-table-column>
              </template>

            </el-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-row
            align-content="center"
            justify="start"
            align="center"
            no-gutters
          >
            <v-col cols="6">
              <v-list-item>
                <v-list-item-action class="pa-0 mr-0">
                  <v-subheader class="pa-0">快速过滤：</v-subheader>
                </v-list-item-action>
                <v-list-item-content>
                  <v-text-field
                    dense
                    outlined
                    hide-details
                    v-model="quickSearch3"
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col
              cols="2"
              class="py-0"
            >
              <v-btn
                depressed
                text
                color="primary"
                @click="getHisgoodsKc"
              > 查询</v-btn>
            </v-col>
          </v-row>
          <v-card-text>
            <el-table
              border
              :data="dataList3"
              style="width: 100%;"
              :height="computedTableHeight"
            >
              <template v-for="(col ,index) in columns2">
                <el-table-column
                  :prop="col.columnName"
                  :label="col.text"
                  :width="col.width"
                  :key="index"
                >
                </el-table-column>
              </template>

            </el-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text class="pa-0">
            <v-card
              class="pa-1"
              outlined
              tile
            >
              <v-row
                align-content="center"
                justify="start"
                align="center"
                no-gutters
              >
                <v-col
                  md="auto"
                  class="pa-0"
                  align-self="center"
                >
                  <v-menu
                    v-model="dateMenu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="date1"
                        hide-details
                        label="目标日期"
                        persistent-hint
                        append-icon="mdi-calendar-range"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      @change="getFNnoList"
                      v-model="date1"
                      locale="zh-cn"
                      no-title
                      @input="dateMenu1 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col
                  cols="2"
                  class="py-0"
                  justify-self="center"
                  style="text-align:center"
                >
                  <v-btn
                    depressed
                    text
                    color="primary"
                    @click="getFNnoList"
                  > 查询</v-btn>
                </v-col>
                <v-col
                  cols="auto"
                  class="pa-0"
                  align-self="center"
                >
                  <v-subheader class="font-weight-black title">{{`￥${totalSum1}`}}</v-subheader>
                </v-col>
              </v-row>
              <v-card-text>
                <el-table
                  border
                  :data="dataList4"
                  style="width: 100%;"
                  :height="computedTableHeight"
                >
                  <template v-for="(col ,index) in columns3">
                    <el-table-column
                      :prop="col.columnName"
                      :label="col.text"
                      :width="col.width"
                      :key="index"
                    >
                    </el-table-column>
                  </template>

                </el-table>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text class="pa-0">
            <v-card
              class="pa-1"
              outlined
              tile
            >
              <v-row
                align-content="center"
                justify="start"
                align="center"
                no-gutters
              >
                <v-col
                  md="auto"
                  class="pa-0"
                >
                  <v-subheader>日清单号：</v-subheader>
                </v-col>
                <v-col
                  cols="6"
                  class="pa-0"
                  align-self="center"
                >
                  <v-text-field
                    dense
                    outlined
                    hide-details
                    v-model="no"
                    @keyup.enter="doSearch5"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="2"
                  class="py-0"
                  justify-self="center"
                  style="text-align:center"
                >
                  <v-btn
                    depressed
                    text
                    color="primary"
                    @click="doSearch5"
                  > 查询</v-btn>
                </v-col>
                <v-col
                  cols="auto"
                  class="pa-0"
                >
                  <v-subheader class="font-weight-black title">{{`￥${totalSum0}`}}</v-subheader>
                </v-col>
              </v-row>
              <v-card-text>
                <el-table
                  border
                  :data="dataList5"
                  style="width: 100%;"
                  :height="computedTableHeight"
                  id="outTable"
                >
                  <template v-for="(col ,index) in columns4">
                    <el-table-column
                      :prop="col.columnName"
                      :label="col.text"
                      :width="col.width"
                      :key="index"
                    >
                    </el-table-column>
                  </template>

                </el-table>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
var debounce = require("lodash/debounce");

export default {
  data: vm => {
    return {
      tab: 0,
      columns0: [],
      columns1: [],
      columns2: [],
      columns3: [],
      columns4: [],
      menuInfo: {},
      dataList1: [],
      dataList2: [],
      dataList3: [],
      dataList4: [],
      dataList5: [],
      no: "",
      totalSum0: `0.00`,
      totalSum1: `0.00`,

      fnpNo: "",
      deptItems: [],
      tagetDept: "",
      dateMenu1: false,
      date1: vm.$utilsService.dateFormat(new Date(), "yyyy-MM-dd"),
      quickSearch3: "",
      quickSearch1: "",
      cacheSearch1: "",
      totalCardSize: 120,
      computedHeight: "600"
    };
  },
  computed: {
    computedTableHeight() {
      return `${document.documentElement.clientHeight - 300}px`;
    },
    filterList() {
      let { dataList1 } = this;
      var search = this.cacheSearch1;
      if (search) {
        return dataList1.filter(function(dataNews) {
          return Object.keys(dataNews).some(function(key) {
            return (
              String(dataNews[key])
                .toLowerCase()
                .indexOf(search) > -1
            );
          });
        });
      } else {
        return this.dataList1;
      }
    }
  },
  created() {
    this.computedHeight = this.initColumns();
    this.getDeptSelect();
    this.$watch(
      "quickSearch1",
      debounce(key => {
        // newQuery为输入的值
        this.cacheSearch1 = key;
      }, 3000)
    );
    this.$watch("tab", (val, old) => {
      switch (val) {
        case 4:
          if (this.dataList4.length === 0) {
            /**this.getFNnoList()*/
          }
      }
      if(val!==old){
        this.setInputfocus();
      }
    });
    //this.setInputfocus();
  },
  methods: {
    comboboxChange(val) {
      console.log(val, this.tagetDept);
    },
    initColumns() {
      //初始化显示列
      this.menuInfo = this.$route.meta.menuInfo;
      this.columns0 = this.$utilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config.split("^`")[0] //按 ^` 这两个符号劈开
      );
      this.columns1 = this.$utilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config.split("^`")[1] //按 ^` 这两个符号劈开
      );
      this.columns2 = this.$utilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config.split("^`")[2] //按 ^` 这两个符号劈开
      );
      this.columns3 = this.$utilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config.split("^`")[3] //按 ^` 这两个符号劈开
      );
      this.columns4 = this.$utilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config.split("^`")[4] //按 ^` 这两个符号劈开
      );
      console.log(this.columns4);
    },
    async getDeptSelect() {
      let deptSqltj = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.deptSqltj)
      ) {
        deptSqltj = this.menuInfo.params.deptSqltj; //菜单传入tj参数
      }
      //获取PSD部门编号
      let param2 = {
        userCode: this.$authenticationService.getCurrentUser().userInfo.user_code,
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };
      var resultData2 = await this.$commonService.executeService(
              "spdService",
              "getLoginUserByPsd",
              param2,
              true
      );
      //let userDept = this.$authenticationService.getCurrentUser().userInfo.dept_id;
      let userDept=resultData2.dataList[0].dept;
      if(!isNaN(userDept)){               //如果是纯数字字符串，则转换成数字
        userDept=parseInt(userDept);
      }
      console.log("-----userInfo------",resultData2,this.$authenticationService.getCurrentUser());
      if (userDept !== 13) {
        deptSqltj = " and  dept ='" + userDept + "' " + deptSqltj;
      }
      console.log();

      let param = {
        mark: "1",
        tj: deptSqltj,
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };

      var resultData = await this.$commonService.executeService(
        "dtcService",
        "getDept",
        param,
        true
      );
      //console.log("-----resultData------",JSON.stringify(resultData));
      if (!resultData || resultData.resultKey == "-1") {
        this.$mvc.MDialog.show({
          title: "科室获取失败",
          titleIcon: "error",
          message: resultData ? resultData.resultMessage : "未知错误！",
          showCancel: false
        });
      } else {
        let list = resultData.dataList;
        let list2=resultData2.dataList;
        console.log("---Psddept----",list2[0].dept);
        this.deptItems = list;
        for (let i=0; i<list.length; i++){  //遍历部门集合
          if(list[i].dept==list2[0].dept){    //当部门集合中存在与用户部门相同的对象时，将此对象设置为默认目标部门
            this.tagetDept = (list.length && list[i]) || "";
            break;
          }else{
            this.tagetDept = (list.length && list[0]) || "";   //否则将集合的第一个对象设置为默认目标部门
          }
        }


        let limitDept = false;
        if (
          !this.$utilsService.isUndefined(this.menuInfo.params) &&
          !this.$utilsService.isUndefined(this.menuInfo.params.limitDept)
        ) {
          limitDept = !!this.menuInfo.params.limitDept; //菜单传入tj参数
        }
        if (limitDept) {
          //let userDept = this.$authenticationService.getCurrentUser().userInfo.dept_id;
          const item = list.find(item => item.dept.trim() == userDept);
          if (item) {
            this.tagetDept = item;
          }
        }
      }
    },
    //货位信息查询
    async getTagLocator() {
      let tj = `and region_no ='${this.tagetDept.custno}' order by tag_id`;
      let param = {
        tj,
        dept: "",
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };
      this.$mvc.MDialog.show({
        message: "数据处理中...",
        type: "loading"
      });
      var resultData = await this.$commonService.executeService(
        "spdService",
        "getTagLocator",
        param,
        true
      );
      this.$mvc.MDialog.hide();

      if (!resultData || resultData.resultKey == "-1") {
        this.$mvc.MDialog.show({
          title: "失败",
          titleIcon: "error",
          message: resultData ? resultData.resultMessage : "未知错误！",
          showCancel: false
        });
      } else {
        let list = resultData.dataList;
        this.dataList1 = list;
        //
        this.setInputfocus();
      }
    },
    //未上架查询
    async getBaseItem() {
      let tj = `and region_no ='${this.tagetDept.custno}' and (locator = '' or locator is null)`;
      let param = {
        tj,
        dept: "",
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };
      this.$mvc.MDialog.show({
        message: "数据处理中...",
        type: "loading"
      });
      var resultData = await this.$commonService.executeService(
        "spdService",
        "getBaseItem",
        param,
        true
      );
      this.$mvc.MDialog.hide();

      if (!resultData || resultData.resultKey == "-1") {
        this.$mvc.MDialog.show({
          title: "失败",
          titleIcon: "error",
          message: resultData ? resultData.resultMessage : "未知错误！",
          showCancel: false
        });
      } else {
        let list = resultData.dataList;
        this.dataList2 = list;
        this.setInputfocus()
      }
    },
    //库存
    async getHisgoodsKc() {
      let deptId = "";
      deptId = this.tagetDept.dept.trim();
      if (!deptId) {
        return;
      }
      console.log("--deptId----",deptId);
      let gcode = "''";
      let sqlstr = "''";
      let param = {
        gcode,
        sqlstr,
        //dept: "",
        dept: deptId,//24
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };
      this.$mvc.MDialog.show({
        message: "数据处理中...",
        type: "loading"
      });
      var resultData = await this.$commonService.executeService(
        "dtcService",
        "getHisgoodsKc",
        param,
        true
      );
      this.$mvc.MDialog.hide();

      if (!resultData || resultData.resultKey == "-1") {
        this.$mvc.MDialog.show({
          title: "失败",
          titleIcon: "error",
          message: resultData ? resultData.resultMessage : "未知错误！",
          showCancel: false
        });
        console.log("---message---",this.message);
      } else {
        let list = resultData.dataList;
        console.log("----list------",list);
        this.dataList3 = list;
        this.setInputfocus();
      }
    },
    async doFNno() {

      if (this.fnpNo.trim() === "") return;
      /**let pkgtype = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.pkgtype)
      ) {
        pkgtype = this.menuInfo.params.pkgtype; //菜单传入tj参数
      }*/
      //定数包消耗查询参数：
      let param = {
        serviceName: "dtcService",
        methodName: "getFnpList",
        mark: "1",
        code: "fnp_num",
        pkgtype: "PKGTYPE_BULK",
        tj: "",
        no: this.fnpNo,

        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };

      this.$mvc.MDialog.show({
        message: "数据处理中...",
        title: "提示",
        type: "loading"
      });

      let resultList = await this.$commonService.executeService(
        "dtcService",
        "getFnpList",
        param,
        true
      );
      //   this.$mvc.MDialog.hide();

      console.log(resultList);
      var { dataList, resultKey } = resultList;
      if (!dataList.length) {
        this.$mvc.MDialog.hide();
        this.$mvc.MDialog.show({
          title: "失败",
          titleIcon: "error",
          message: "对应编号的定书包记录不存在！",
          showCancel: false
        });
        return;
      }
      let scustno = dataList[0]["scustno"];
      console.log(scustno);
      let curUser = this.$authenticationService.getCurrentUser();
      let userInfo = curUser["userInfo"];
      if (dataList.length && resultKey === "1") {
        if (!userInfo) {
          //检测不到用户信息
          this.$mvc.MDialog.show({
            title: "失败",
            titleIcon: "error",
            message: "查询不到当前用户信息，消耗失败！",
            showCancel: false
          });
          return;
        }
        //查询到定书包记录，做消耗
        let newparam = {
          serviceName: "dtcService",
          methodName: "doFnpMove",
          mark: "0", // 操作属性(0--下架，1--上架 3:手术备货,4:手术备货退回)
          code: "e", // 业务属性（c--移库，e--消耗，b--红购)
          no: this.fnpNo, // 定数包条码
          custno: scustno, // 接收部门客户编码,  从查询结果集中取scustno字段
          psdcode1: userInfo["user_code"], // 制单人ID "0003"
          note: "", // 制单备注
          whsareaid: "", // 目标货位
          tj: "", //
          whsid: "hmis_gg_01",
          appProject: "dtc",
          appVersion: "hmis_gg_01"
        };
        let result = await this.$commonService.executeService(
          "dtcService",
          "getFnpList",
          newparam,
          true
        );
        const { dataList, resultKey, resultMessage } = result;
        this.$mvc.MDialog.hide();

        if (resultKey == "1") {
          //提示成功
          let sb = {
            show: true,
            color: "green",
            y: "top",
            x: "right",
            mode: "",
            timeout: 3000,
            text: "消耗成功"
          };
          this.$mvc.MSnackbar.show(sb);
        } else {
          this.$mvc.MDialog.show({
            title: "失败",
            titleIcon: "error",
            message: result ? result.resultMessage : "未知错误！",
            showCancel: false
          });
        }
      }
    },
    async getFNnoList() {
      if (!(this.tagetDept && this.tagetDept.dept)) {
        return;
      }
      let tj =
        " and date(b.version)>='" +
        this.$utilsService.dateFormat(this.date1, "MM-dd-yyyy") +
        "' and date(b.version)<='" +
        this.$utilsService.dateFormat(this.date1, "MM-dd-yyyy") +
        "' and a.dept in('" +
        this.tagetDept.dept +
        "') and a.code in('e') ";
      let pkgtype = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.pkgtype)
      ) {
        pkgtype = this.menuInfo.params.pkgtype; //菜单传入tj参数
      }
      let param = {
        mark: "4",
        code: "",
        no: "",
        tj: tj,
        pkgtype,
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };
      this.$mvc.MDialog.show({
        message: "数据处理中...",
        type: "loading"
      });
      let resultData = await this.$commonService.executeService(
        "dtcService",
        "getFnpList",
        param,
        true
      );
      this.$mvc.MDialog.hide();

      if (!resultData || resultData.resultKey == "-1") {
        this.$mvc.MDialog.show({
          title: "失败",
          titleIcon: "error",
          message: resultData ? resultData.resultMessage : "未知错误！",
          showCancel: false
        });
      } else {
        let list = resultData.dataList;
        this.$nextTick(() => {
          this.dataList4 = list;
          let sum = list.reduce((pre, cur, index, list) => {
            return pre + parseFloat(cur["fnpqty"]) * parseFloat(cur["price"]);
          }, 0);
          this.totalSum1 = sum.toFixed(2);
          this.setInputfocus();
        });
      }
    },
    async doSearch5() {
      if (this.no.trim() === "") return;
      let param = {
        date1: "",
        date2: "",
        code: "a.no2",
        no: this.no,
        mark: "a",
        tj: "",
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };

      this.$mvc.MDialog.show({
        message: "数据处理中...",
        title: "提示",
        type: "loading"
      });

      var resultData = await this.$commonService.executeService(
        "dtcService",
        "getOutinfo",
        param,
        true
      );
      this.$mvc.MDialog.hide();

      if (!resultData || resultData.resultKey == "-1") {
        this.$mvc.MDialog.show({
          title: "失败",
          titleIcon: "error",
          message: resultData ? resultData.resultMessage : "未知错误！",
          showCancel: false
        });
      } else {
        console.log(resultData);
        let list = resultData.dataList;
        this.$nextTick(() => {
          this.dataList5 = list;
          let sum = list.reduce((pre, cur, index, list) => {
            return pre + parseFloat(cur["qty"]) * parseFloat(cur["price"]);
          }, 0);
          this.totalSum0 = sum.toFixed(2);
          this.setInputfocus();
        });
      }
    },
    setInputfocus(){
      console.log("--获得焦点---");
      window.document.getElementById("my-input").focus();
    },
  },
  mounted() {
    this.setInputfocus();
    this.setIner=setInterval(function(){
      //console.log("--获得焦点--");
      window.document.getElementById("my-input").focus()},10000);  //每十秒光标定位到input框
  },
  beforeDestroy(){
    clearInterval(this.setIner ); //离开或者关闭页面时清除定时任务
  }
};
</script>