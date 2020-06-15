<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-row>
      <v-col
        cols="12"
        class="pb-2 pt-0"
      >
        <v-card
          class="pa-2"
          outlined
          tile
        >
          <v-row
            align-content="center"
            justify="center"
          >
            <v-col
              cols="3"
              class="py-0"
            >
              <v-menu
                ref="menu"
                v-model="dateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="computedDate"
                    label="目标日期"
                    prepend-icon="mdi-calendar-range"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="rangeDate"
                  no-title
                  scrollable
                  range
                  locale="zh-cn"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="dateMenu = false"
                  >取消</v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(rangeDate)"
                  >保存</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col
              cols="2"
              class="py-0"
            >
              <v-select
                v-model="status"
                :items="statusItems"
                item-text="text"
                item-value="val"
                label="消耗类型"
                no-data-text="无可用数据"
              ></v-select>
            </v-col>
            <v-col
              cols="4"
              class="text-center py-0"
              align-self="center"
            >
              <v-select
                v-model="tagetDept"
                :items="deptItems"
                item-text="deptname"
                item-value="dept"
                label="目标部门"
                no-data-text="无可用数据"
              ></v-select>
            </v-col>
            <v-col
              cols="3"
              class="py-0"
              align-self="center"
            >
              <v-btn
                depressed
                color="primary"
                class="mx-2"
                @click="doSearch"
              >
                <v-icon medium>mdi-file-document-box-search</v-icon> 查询
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-card
      class="pa-2"
      outlined
      tile
    >
      <v-tabs v-model="tabs">
        <v-tab><span>单据列表</span></v-tab>
        <v-tab><span>单据明细</span></v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">
        <v-tab-item :value="0">
          <v-card
            class="pa-2"
            outlined
            tile
          >
            <v-card-title class="pa-1">
              <v-spacer></v-spacer>
              <!-- <v-btn
                depressed
                outlined
                class="px-2"
              >
                全选
              </v-btn>
              <v-btn
                depressed
                outlined
              >
                全清
              </v-btn> -->
              <v-btn
                class="px-2"
                depressed
                outlined
              >
                导出Excel
              </v-btn>
            </v-card-title>
            <el-table
              border
              :data="dataList"
              style="width: 100%;"
              :height="computedTableHeight"
              @row-dblclick="rowDBClick"
            >
              <template v-for="(col ,index) in columns1">
                <el-table-column
                  :prop="col.columnName"
                  :label="col.text"
                  :width="col.width"
                  sortable
                  :key="index"
                >
                </el-table-column>
              </template>

            </el-table>
          </v-card>
        </v-tab-item>
        <v-tab-item :value="1">
          <v-card
            class="pa-2"
            outlined
            tile
          >
            <v-card-title class="pa-1">
              <v-spacer></v-spacer>
              <v-btn
                class="px-2"
                depressed
                outlined
              >
                导出Excel
              </v-btn>
            </v-card-title>
            <el-table
              border
              :data="dataList2"
              style="width: 100%;"
              :height="computedTableHeight"
              @row-dblclick="rowDBClick"
            >
              <template v-for="(col ,index) in columns2">
                <el-table-column
                  :prop="col.columnName"
                  :label="col.text"
                  :width="col.width"
                  sortable
                  :key="index"
                >
                </el-table-column>
              </template>

            </el-table>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<script>
/**
 * 室耗材使用情况汇总查询（管理员）
 */
export default {
  data: vm => {
    return {
      menuInfo: null,
      supllier: "",
      supplierItems: [],
      tagetDept: "",
      deptItems: [],
      status: "",
      statusItems: [{ val: "", text: "全部" }],
      rangeDate: [
        vm.$utilsService.dateFormat(new Date(), "yyyy-MM-dd"),
        vm.$utilsService.dateFormat(new Date(), "yyyy-MM-dd")
      ],
      dateMenu: false,
      tabs: 0,
      dataList: [],
      dataList2: [],
      columns1: [],
      columns2: []
    };
  },
  computed: {
    computedDate() {
      return this.rangeDate.join("至");
    },
    computedTableHeight() {
      return `${document.documentElement.clientHeight - 340}px`;
    }
  },
  created() {
    this.initColumns();
    this.getDeptSelect();
  },
  methods: {
    initColumns() {
      //初始化显示列
      this.menuInfo = this.$route.meta.menuInfo;
      this.columns1 = this.$utilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config.split("^`")[0] //按 ^` 这两个符号劈开
      );
      this.columns2 = this.$utilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config.split("^`")[1] //按 ^` 这两个符号劈开
      );
      console.log("this.columns1", this.columns2);
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.codeSelect)
      ) {
        let codeSelect = this.menuInfo.params.codeSelect;
        for (let [index, item] of codeSelect.split("|").entries()) {
          this.statusItems.push({
            val: item.split("-")[0],
            text: item.split("-")[1]
          });
        }
      }
    },
    async getSupplyItems() {
      let param = {
        code1: this.$authenticationService.getCurrentUser().userInfo.user_code,
        conditions: "''",
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };

      var resultData = await this.$commonService.executeService(
        "dtcService",
        "getSupply",
        param,
        true
      );

      if (!resultData || resultData.resultKey == "-1") {
        this.$mvc.MDialog.show({
          title: "供应商获取失败",
          titleIcon: "error",
          message: resultData ? resultData.resultMessage : "未知错误！",
          showCancel: false
        });
      } else {
        let list = resultData.dataList;
        list.unshift({ supplyid: " ", supply: "全部" }); //集合前面加入一个对象，部门集合
        this.supplierItems = list;
      }
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
      let userDept=resultData2.dataList[0].dept;
      if(!isNaN(userDept)){               //如果是纯数字字符串，则转换成数字
        userDept=parseInt(userDept);
      }
      //let userDept = this.$authenticationService.getCurrentUser().userInfo.dept_id;
      console.log(this.$authenticationService.getCurrentUser().userInfo);
      if (userDept !== 13) {
        deptSqltj = " and  dept ='" + userDept + "' " + deptSqltj;
      }

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

      if (!resultData || resultData.resultKey == "-1") {
        this.$mvc.MDialog.show({
          title: "科室获取失败",
          titleIcon: "error",
          message: resultData ? resultData.resultMessage : "未知错误！",
          showCancel: false
        });
      } else {
        let list = resultData.dataList;
        list.unshift({ dept: "", deptname: "全部" }); //数组前面加入一个对象
        this.deptItems = list;

        let limitDept = false;
        if (
          !this.$utilsService.isUndefined(this.menuInfo.params) &&
          !this.$utilsService.isUndefined(this.menuInfo.params.limitDept)
        ) {
          limitDept = !!this.menuInfo.params.limitDept; //菜单传入tj参数
        }
        if (limitDept) {
          const item = list.find(item => item.dept == userDept);  //部门集合中查找与用户部门名称相同的部门
          if (item) {
            //this.deptItems = [{ dept: "", deptname: "全部" }, item];  //设置部门集合
            this.tagetDept=item.dept;    //将该部门设置为默认目标部门
          }
        }
      }
    },
    async doSearch() {
      let sqlstr = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.tj)
      ) {
        sqlstr += `${this.menuInfo.params.tj} `; //菜单传入tj参数
      }
      let pkgtype = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.pkgtype)
      ) {
        pkgtype = this.menuInfo.params.pkgtype; //菜单传入参数
      }
      let mark = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.mark)
      ) {
        mark = this.menuInfo.params.mark; //菜单传入参数
      }
      if (this.tagetDept) {
        sqlstr +=
          " and a.custno in (select custno from bm where dept = '" +
          this.tagetDept +
          "')";
      }
      if (this.status) {
        sqlstr += ` and a.code in(" ${this.status} ") `;
      }

      let param = {
        rq1: this.rangeDate[0]
          ? this.$utilsService.dateFormat(this.rangeDate[0], "MM-dd-yyyy")
          : "",
        rq2: this.rangeDate[1]
          ? this.$utilsService.dateFormat(this.rangeDate[1], "MM-dd-yyyy")
          : "",
        mark: mark,
        pkgtype,
        tj: sqlstr,
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
        "spdService",
        "getOutinfoDept",
        param,
        true
      );
      this.$mvc.MDialog.hide();

      if (!resultData || resultData.resultKey == "-1") {
        this.$mvc.MDialog.show({
          title: "失败",
          titleIcon: "error",
          message: (resultData && resultData.resultMessage) || "未知错误！",
          showCancel: false
        });
      } else {
        console.log(resultData);
        let list = resultData.dataList;
        this.$nextTick(() => {
          this.dataList = list;
        });
      }
    },
    rowDBClick(row) {
      this.doSearch2(row);
      this.tabs = 1;
    },
    async doSearch2(row) {
      let pkgtype = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.pkgtype)
      ) {
        pkgtype = this.menuInfo.params.pkgtype; //菜单传入参数
      }
      let sqlstr = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.tj)
      ) {
        sqlstr += `${this.menuInfo.params.tj} `; //菜单传入tj参数
      }
      let mark2 = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.mark2)
      ) {
        mark2 = this.menuInfo.params.mark2; //菜单传入参数
      }

      sqlstr +=
        " and a.custno='" +
        (row["custno"] + "").trim() +
        "'" +
        " and a.gcode='" +
        (row["gcode"] + "").trim() +
        "'" +
        " and a.code='" +
        (row["code"] + "").trim() +
        "'" +
        " and (a.code='e' or (a.code='c' and a.contno not like 'D00%' and length(a.contno )>0))";

      let param = {
        date1: this.rangeDate[0]
          ? this.$utilsService.dateFormat(this.rangeDate[0], "MM-dd-yyyy")
          : "",
        date2: this.rangeDate[1]
          ? this.$utilsService.dateFormat(this.rangeDate[1], "MM-dd-yyyy")
          : "",
        mark: mark2,
        no: "",
        code: "",
        pkgtype: row["pkgtype"].trim(),
        tj: sqlstr,
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };

      var resultData = await this.$commonService.executeService(
        "dtcService",
        "getOutinfo",
        param,
        true
      );

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
          this.dataList2 = list;
        });
      }
    }
  }
};
</script>