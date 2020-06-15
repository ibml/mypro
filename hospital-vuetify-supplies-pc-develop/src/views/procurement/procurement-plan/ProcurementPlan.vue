<template>
  <v-card>
    <v-row class="ma-0">
      <v-col
        cols="12"
        class="pa-0"
      >
        <v-card
          class="px-2"
          outlined
          tile
        >
          <v-row
            align-content="center"
            justify="center"
            class="ma-0"
          >
            <v-col
              cols="3"
              class="text-center pa-0"
              align-self="center"
            >
              <v-select
                v-model="sourceDept"
                :items="deptItems"
                item-text="deptname"
                item-value="dept"
                label="源仓库"
                no-data-text="无可用数据"
              ></v-select>
            </v-col>
            <v-col
              cols="3"
              class="text-center pa-0"
              align-self="center"
            >
              <v-btn
                @click="setLimited"
                depressed
                color="primary"
              >
                库存上下限设置
              </v-btn>
            </v-col>
            <v-col
              cols="6"
              class="text-center pa-0"
              align-self="center"
            >
              <v-text-field
                outline
                label="要货备注"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row
            class="ma-0"
            align-content="center"
            justify="center"
          >
            <v-col
              cols="3"
              class="text-center pa-0"
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
              class="text-center pa-0"
              align-self="center"
            >
              <v-btn
                depressed
                color="primary"
                @click="doSearch"
              >
                查询
              </v-btn>
            </v-col>
            <v-col
              cols="6"
              class="text-center pa-0"
              align-self="center"
            >
              <v-row>
                <v-col
                  cols="6"
                  class="pa-0"
                >
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="date"
                        label="过期时间"
                        prepend-icon="mdi-calendar-range"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      no-title
                      scrollable
                      locale="zh-cn"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="menu = false"
                      >取消</v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(date)"
                      >保存</v-btn>
                    </v-date-picker>
                  </v-menu>

                </v-col>
                <v-col cols="6">
                  <v-btn
                    block
                    depressed
                    color="primary"
                  >
                    生成采购计划
                  </v-btn>
                </v-col>
              </v-row>

            </v-col>
          </v-row>

          <v-row
            class="ma-0"
            align-content="center"
            justify="center"
          >
            <v-col
              cols="3"
              class="text-center pa-0"
              align-self="center"
            >
              <v-text-field
                label="快速过滤"
                outline
                v-model="search"
                append-icon="mdi-file-document-box-search"
              ></v-text-field>
            </v-col>
            <v-col
              cols="3"
              class="text-center pa-0"
              align-self="center"
            >
              <!-- <v-btn
                depressed
                color="primary"
                class="mx-2"
              >
                全选
              </v-btn>
              <v-btn
                depressed
                color="primary"
              >
                全清
              </v-btn> -->
            </v-col>
            <v-col
              cols="6"
              class="text-center pa-0"
              align-self="center"
            >
              <span style="color:red;">***</span>同一品种存在多条采购计划
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
        highlight-current-row
        @current-change="handleCurrentChange"
        :data="filterList"
        style="width: 100%;"
        :height="computedTableHeight"
        @row-dblclick="rowDBClick"
      >
        <template v-for="(col ,index) in columns">
          <el-table-column
            :prop="col.columnName"
            :label="col.text"
            :key="index"
          >
          </el-table-column>
        </template>

      </el-table>

    </v-card>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="800px"
    >
      <v-card>
        <v-card-title class="pa-0">
          <span class="headline">上下限库存信息</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container >
            <v-row>
              <v-col
              class="py-0"
                cols="3"
                align-self="center"
              >
                <span class="title">供应商：</span>
              </v-col>
              <v-col cols="3" class="py-0">
                <v-text-field
                  readonly
                  v-model="currentRow.supplyid"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  readonly
                  v-model="currentRow.supply"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="3"
                class="py-0"
                align-self="center"
              >
                <span class="title">商品名称：</span>
              </v-col>
              <v-col cols="3" class="py-0">
                <v-text-field
                  readonly
                  v-model="currentRow.itemid"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  readonly
                  v-model="currentRow.itemname"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="py-0">
                <v-row>
                  <v-col
                    cols="6"
                    align-self="center"
                  ><span class="title">公司编码：</span></v-col>
                  <v-col cols="6" class="py-0">
                    <v-text-field
                      readonly
                      v-model="currentRow.comp"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-row>
                  <v-col
                    cols="6"
                    class="py-0"
                    align-self="center"
                  ><span class="title">部门编码：</span></v-col>
                  <v-col cols="6" class="py-0">
                    <v-text-field
                      readonly
                      v-model="currentRow.dept"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6" class="py-0">
                <v-row>
                  <v-col
                    cols="6"
                    class="py-0"
                    align-self="center"
                  ><span class="title">计量单位：</span></v-col>
                  <v-col cols="6" class="py-0">
                    <v-text-field
                      readonly
                      v-model="currentRow.unit"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-row>
                  <v-col
                    cols="6"
                    class="py-0"
                    align-self="center"
                  ><span class="title">计量单位类型：</span></v-col>
                  <v-col cols="6" class="py-0">
                    <v-select
                      v-model="pkgtype"
                      :items="[{text:'件包',value:'PKGTYPE_FULL'},{text:'基本包装',value:'PKGTYPE_MIDDLE'},{text:'最小包装',value:'PKGTYPE_BULK'}]"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="py-0">
                <v-row>
                  <v-col
                    cols="6"
                    align-self="center"
                  ><span class="title">最高库存：</span></v-col>
                  <v-col cols="6">
                    <v-text-field v-model="currentRow.maxqty"></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col
                    cols="6"
                    class="py-0"
                    align-self="center"
                  ><span class="title">最低库存：</span></v-col>
                  <v-col cols="6" class="py-0">
                    <v-text-field v-model="currentRow.minqty"></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="py-0">
                <v-row>
                  <v-col
                    cols="6"
                    class="py-0"
                    align-self="center"
                  ><span class="title">定数包基数：</span></v-col>
                  <v-col cols="6">
                    <v-text-field v-model="currentRow.pack"></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-row>
                  <v-col
                    cols="6"
                    class="py-0"
                    align-self="center"
                  ><span class="title">状态：</span></v-col>
                  <v-col cols="6" class="py-0">
                    <v-select
                      v-model="currentRow.status"
                      :items="[{text:'在用',value:'1'},{text:'停用',value:'0'}]"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pa-0">
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >关闭</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="setLimitedSave"
          >保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
/**
 * 采购计划生成
 */
var debounce = require("lodash/debounce");
export default {
  data() {
    return {
      menuInfo: null,
      columns: [],
      resultList: [],
      sourceDept: "",
      deptItems: [],
      supllier: "",
      supplierItems: [],
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      search: "",
      cacheSearch: "",
      currentRow: {},
      selectedRow: {},
      dialog: false,
      pkgtype: ""
    };
  },
  computed: {
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
        return this.resultList;
      }
    },
    computedTableHeight() {
      return `${document.documentElement.clientHeight - 330}px`;
    }
  },
  created() {
    this.$watch(
      "search",
      debounce(key => {
        // newQuery为输入的值
        this.cacheSearch = key;
      }, 1200)
    );
    this.initColumns();
    this.getDeptSelect();
    this.getSupplyItems();
  },
  mounted() {
    if (
      !this.$utilsService.isUndefined(this.menuInfo.params) &&
      !this.$utilsService.isUndefined(this.menuInfo.params.pkgtype)
    ) {
      this.pkgtype = this.menuInfo.params.pkgtype; //菜单传入参数
    }
  },
  methods: {
    initColumns() {
      //初始化显示列
      this.menuInfo = this.$route.meta.menuInfo;
      this.columns = this.$utilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config
      );
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
        console.log(resultData);
        let list = resultData.dataList;
        list.unshift({ supplyid: " ", supply: "全部" }); //数组前面加入一个对象
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
        list.unshift({ dept: " ", deptname: "全部" }); //数组前面加入一个对象
        this.deptItems = list;
      }
    },
    async doSearch() {
      let sqlstr = "";

      let pkgtype = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.pkgtype)
      ) {
        pkgtype = this.menuInfo.params.pkgtype; //菜单传入参数
      }
      let param = {
        comp: "01",
        sdept: this.supllier || "",
        ddept: this.sourceDept || "",
        mark: "2",
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
        "dtcService",
        "getRepList",
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
          this.resultList = list;
        });
      }
    },
    handleCurrentChange(val) {
      console.log(val);
      this.selectedRow = val;
    },
    async setLimited() {
      if (JSON.stringify(this.selectedRow) == "{}") {
        this.$mvc.MDialog.show({
          title: "注意",
          titleBarColor: "red",
          titleIcon: "error",
          message: "未选中任何行！",
          showCancel: false
        });
      } else {
        await this.doSearchForLimitedItem(this.selectedRow);
        this.dialog = true;
      }
    },
    async setLimitedSave() {
      let param = {
        itemid: "",
        comp: "",
        dept: "",
        maxqty: "",
        minqty: "",
        pkgtype: "",
        status: "",
        fnpqty: "",
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
        "saveOrUpdateInvenstrategy",
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
        this.$mvc.MDialog.show({
          title: "提示",
          titleIcon: "error",
          message: resultData ? resultData.resultMessage : "未知错误！",
          showCancel: false
        });
      }
      this.dialog = false;
    },
    async doSearchForLimitedItem(row) {
      let pkgtype = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.pkgtype)
      ) {
        pkgtype = this.menuInfo.params.pkgtype; //菜单传入参数
      }
      let param = {
        itemid: row && row.itemid,
        dept: row && row.ddept && row.ddept.split("_")[0],
        sqlstr: "",
        pkgtype,
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };

      var resultData = await this.$commonService.executeService(
        "dtcService",
        "getInvenstrategyInfoList",
        param,
        true
      );

      if (!resultData || resultData.resultKey == "-1") {
        this.$mvc.MDialog.show({
          title: "失败",
          titleIcon: "error",
          message: (resultData && resultData.resultMessage) || "未知错误！",
          showCancel: false
        });
      } else {
        var item = resultData.dataList[0];
        for (let key in item) {
          item[key] = item[key].trim();
        }
        this.currentRow = item;
      }
    },
    rowDBClick() {}
  }
};
</script>