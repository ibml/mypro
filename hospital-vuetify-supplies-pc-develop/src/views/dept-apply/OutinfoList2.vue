<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-row>
      <v-col
        cols="12"
        class="py-1"
      >
        <v-card
          class="pa-1"
          outlined
          tile
        >
          <v-row
            align-content="center"
            justify="center"
          >
            <v-col
              cols="3"
              class="text-center py-0"
              align-self="center"
            >
              <v-select
                v-model="tagetDept"
                :items="deptItems"
                item-text="deptname"
                item-value="dept"
                label="申领部门"
                no-data-text="无可用数据"
              ></v-select>
            </v-col>
            <v-col
              cols="3"
              class="text-center py-0"
              align-self="center"
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
              class="text-center py-0"
              align-self="center"
            >
              <v-select
                v-model="targetCode"
                :items="codeItems"
                item-text="text"
                item-value="val"
                label="属性"
                no-data-text="无可用数据"
              ></v-select>
            </v-col>
            <v-col
              cols="2"
              class="text-center py-0"
              align-self="center"
            >
              <v-btn
                depressed
                color="primary"
                @click="doSearch"
              >
                <v-icon medium>mdi-file-document-box-search</v-icon> 查询
              </v-btn>
            </v-col>
            <v-col
              cols="2"
              class="text-center py-0"
              align-self="center"
            >
              <v-btn
                depressed
                color="primary"
                @click="excel()"
              >
                <v-icon medium>mdi-file-document-box-search</v-icon> 导出Excel
              </v-btn>
            </v-col>
          </v-row>
          <v-row
            align-content="center"
            justify="center"
          >
            <v-col
              cols="3"
              class="text-center py-0"
              align-self="center"
            >
              <v-text-field
                label="快速过滤"
                outline
                v-model="search"
                append-icon="mdi-file-document-box-search"
              >
              </v-text-field>
            </v-col>
            <v-col
              cols="3"
              class="text-center py-0"
              align-self="center"
            >
              <v-radio-group v-model="radioGroup">
                <v-radio
                  label="按消耗科室统计"
                  value="1"
                ></v-radio>
                <v-radio
                  label="按核销科室统计"
                  value="0"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col
              cols="3"
              class="text-center py-0"
              align-self="center"
            >
              <span>{{total}}</span>
            </v-col>
            <v-col
              cols="3"
              class="text-center py-0"
              align-self="center"
            >
              <v-spacer></v-spacer>
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
      <el-table
        border
        :data="filterList"
        style="width: 100%;"
        :height="computedTableHeight"
        id="outTable"
        @row-dblclick="rowDBClick"
      >
        <template v-for="(col ,index) in columns">
          <el-table-column
            :prop="col.columnName"
            :label="col.text"
            :width="col.width"
            :key="index"
          >
          </el-table-column>
        </template>

      </el-table>
      <v-card-actions>
        <v-layout
          align-end
          justify-end
          row
          fill-height
        >
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next"
            :total="resultList.length"
          >
          </el-pagination>
        </v-layout>
      </v-card-actions>
    </v-card>

  </div>
</template>
<script>
/**
 * 科室定数包消耗查询
 */
var debounce = require("lodash/debounce");

export default {
  data: vm => {
    return {
      total: "",
      tagetDept: "",
      deptItems: [],
      columns: [],
      dataList: [],
      resultList: [],
      currentPage: 1,
      pagesize: 10,
      menuInfo: null,
      search: "",
      cacheSearch: "",
      gcode: "",
      dialog: false,
      currentRow: {},
      codeItems: [],
      targetCode: "",
      rangeDate: [
        vm.$utilsService.dateFormat(new Date(), "yyyy-MM-dd"),
        vm.$utilsService.dateFormat(new Date(), "yyyy-MM-dd")
      ],
      dateMenu: false,
      radioGroup: "0"
    };
  },
  computed: {
    computedDate() {
      return this.rangeDate.join("至");
    },
    filterList() {
      let { currentPage, pagesize, resultList } = this;
      var search = this.cacheSearch;
      if (search) {
        return resultList.filter(function(dataNews) {
          return Object.keys(dataNews).some(function(key) {
            return (
              String(dataNews[key])
                .toLowerCase()
                .indexOf(search) > -1
            );
          });
        });
      } else {
        return this.resultList.slice(
          (currentPage - 1) * pagesize,
          currentPage * pagesize
        );
      }
    },
    computedTableHeight() {
      return `${document.documentElement.clientHeight - 320}px`;
    }
  },
  created() {
    this.$watch(
      "search",
      debounce(key => {
        // newQuery为输入的值
        this.cacheSearch = key;
      }, 3000)
    );
    this.initColumns();
    this.getDeptSelect();
    // this.getInventoryList();
  },
  mounted() {},
  methods: {
    initColumns() {
      //初始化显示列
      this.menuInfo = this.$route.meta.menuInfo;
      this.columns = this.$utilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config
      );
      console.log("this.columns", this.columns);

      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.codeSelect)
      ) {
        let codeSelect = this.menuInfo.params.codeSelect;
        let code = "";
        for (let [index, item] of codeSelect.split("|").entries()) {
          this.codeItems.push({
            val: item.split("-")[0],
            text: item.split("-")[1]
          });
          code += `${item.split("-")[0]},`;
        }
        if (code) {
          code = code.substr(0, code.length - 1);
        }
        this.codeItems.push({
          val: code,
          text: "全部"
        });
        this.targetCode=this.codeItems[0].val;
      }
    },
    searchByCondition() {
      const { tagetDept, gcode } = this;
      this.getInventoryList(gcode, tagetDept);
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
      console.log("---getCurrentUser----",this.$authenticationService.getCurrentUser());
      //let userDept = this.$authenticationService.getCurrentUser().userInfo.dept_id;
      if (userDept !== 13) {
        deptSqltj = " and  dept ='" + userDept + "'" + deptSqltj;
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
            this.tagetDept = item.dept;
          }
        }
      }
    },
    /**
     * @param itemid 商品编码
     * @param dept 部门
     */
    async doSearch() {
      let code = "",
        no = "";

      let sqlstr = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.tj)
      ) {
        sqlstr = this.menuInfo.params.tj; //菜单传入tj参数
      }
      sqlstr +=
        " and date(b.version)>='" + (this.rangeDate[0]
          ? this.$utilsService.dateFormat(this.rangeDate[0], "MM-dd-yyyy")
          : this.$utilsService.dateFormat(new Date(), "MM-dd-yyyy")) +
            "' and date(b.version)<='" +
           ( this.rangeDate[1]
          ? this.$utilsService.dateFormat(this.rangeDate[1], "MM-dd-yyyy")
          : this.$utilsService.dateFormat(new Date(), "MM-dd-yyyy")) + "'";

      if (this.radioGroup==='0') {
        sqlstr +=
          " and custno in(select custno from bm where comp='" +
          "01" +
          "' and dept='" +
          this.tagetDept +
          "')";
      } else {
        sqlstr += " and a.dept in('" + this.tagetDept + "')";
      }
      if (this.codeItems.length > 0) {
        sqlstr += " and a.code in('" + this.targetCode + "') ";
      }

      let pkgtype = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.pkgtype)
      ) {
        pkgtype = this.menuInfo.params.pkgtype; //菜单传入tj参数
      }
      let param = {
        code,
        no,
        mark: "4",
        tj:sqlstr,
        pkgtype,
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };

      this.$mvc.MDialog.show({
        message: "数据处理中...",
        titleIcon: "mdi-info",
        title: "提示",
        type: "loading"
      });

      var resultData = await this.$commonService.executeService(
        "dtcService",
        "getFnpList",
        param,
        false
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
        this.resultList = list;
      }
    },

    rowDBClick(row) {
      console.log(row);
      this.currentRow = row;
      this.dialog = true;
    },
    handleSizeChange(size) {
      this.pagesize = size;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    //导出Excle
    excel() {
      let menuName = this.menuInfo.menu_name; //菜单名称
      let currentPage = this.currentPage;
      let pagesize = this.pagesize;

      this.currentPage = 1;
      this.pagesize = this.resultList.length; //显示完所有数据

      this.$nextTick(() => {
        this.$exportExcel("outTable", menuName); //outTable 为表格的id
        this.currentPage = currentPage;
        this.pagesize = pagesize; //再恢复回每页10条数据
      });
    },
    async getSpdDept() {
      let param = {
        //userCode: this.userName,
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
              "getLoginUserByPsd",
              param,
              true
      );
      this.$mvc.MDialog.hide();
      console.log(resultData);
      if (!resultData || resultData.resultKey == "-1") {
        this.$mvc.MDialog.show({
          title: "失败",
          titleIcon: "error",
          message: resultData ? resultData.resultMessage : "未知错误！",
          showCancel: false
        });
      } else {
        let list = resultData.dataList;

      }
    }
  }
};
</script>
<style>
/*.v-application .pa-2 {
    padding-top: 1px !important;
    padding-bottom: 1px !important;
    }
    */
</style>