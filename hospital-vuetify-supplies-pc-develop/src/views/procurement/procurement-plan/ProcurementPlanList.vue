<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card
          class="pa-2"
          outlined
          tile
        >
          <v-row
            align-content="center"
            justify="center"
          >
            <v-col cols="3">
              <v-menu
                ref="menu"
                v-model="dateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
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
            <v-col cols="2">
              <v-select
                v-model="status"
                :items="statusItems"
                item-text="text"
                item-value="val"
                label="状态"
                no-data-text="无可用数据"
              ></v-select>
            </v-col>
            <v-col
              cols="4"
              class="text-center"
              align-self="center"
            >
              <v-select
                v-model="supllier"
                :items="supplierItems"
                item-text="supply"
                item-value="supplyid"
                label="供应商"
                no-data-text="无可用数据"
              ></v-select>
            </v-col>
            <v-col
              cols="3"
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

              <v-btn
                depressed
                color="primary"
                @click="exportEXCEL"
              >
                <v-icon medium>mdi-file-document-box-search</v-icon> 导出Excel
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

      <el-table
        border
        id="outTable"
        :data="dataList"
        style="width: 100%;"
        :height="computedTableHeight"
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
  </div>
</template>
<script>
/**
 * 采购计划明细查询
 */
export default {
  data: vm => {
    return {
      menuInfo: null,
      supllier: "",
      supplierItems: [],
      status: "",
      statusItems: [
        { val: "", text: "全部" },
        { val: " and a.type in('99') ", text: "已确认" },
        { val: " and a.type in('a6') ", text: "未确认" }
      ],
      rangeDate: [
        vm.$utilsService.dateFormat(new Date(), "yyyy-MM-dd"),
        vm.$utilsService.dateFormat(new Date(), "yyyy-MM-dd")
      ],
      dateMenu: false,
      tabs: 0,
      dataList: [],
      columns1: []
    };
  },
  computed: {
    computedDate() {
      return this.rangeDate.join("至");
    },
    computedTableHeight() {
      return `${document.documentElement.clientHeight - 320}px`;
    }
  },
  created() {
    this.initColumns();
    this.getSupplyItems();
  },
  methods: {
    initColumns() {
      //初始化显示列
      this.menuInfo = this.$route.meta.menuInfo;
      this.columns1 = this.$utilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config.split("^`")[0] //按 ^` 这两个符号劈开
      );
    },
    async doSearch() {
      let sqlstr = " and a.code='a' ";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.sqlstr)
      ) {
        sqlstr += `${this.menuInfo.params.sqlstr} `; //菜单传入tj参数
      }
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.no1)
      ) {
        sqlstr += `${this.menuInfo.params.no1} `; //菜单传入tj参数
      }
      if (this.supllier) {
        sqlstr += ` and a.custno='${this.supllier}' `;
      }
      if (this.status) {
        sqlstr += this.status;
      }

      let pkgtype = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.pkgtype)
      ) {
        pkgtype = this.menuInfo.params.pkgtype; //菜单传入参数
      }
      let param = {
        date1: this.rangeDate[0]
          ? this.$utilsService.dateFormat(this.rangeDate[0], "MM-dd-yyyy")
          : "",
        date2: this.rangeDate[1]
          ? this.$utilsService.dateFormat(this.rangeDate[1], "MM-dd-yyyy")
          : "",
        mark: "",
        sqlstr,
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
        "spdService",
        "getContract",
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
          this.dataList = list;
        });
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
        list.unshift({ supplyid: " ", supply: "全部" }); //数组前面加入一个对象
        this.supplierItems = list;
      }
    },
    exportEXCEL() {
      let menuName = this.menuInfo.menu_name; //菜单名称
      this.$nextTick(() => {
        this.$exportExcel("outTable", menuName); //outTable 为表格的id
      });
    }
  }
};
</script>