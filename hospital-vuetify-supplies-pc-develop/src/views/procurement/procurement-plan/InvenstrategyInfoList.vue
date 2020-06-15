<template>
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
              class="text-center"
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
            <v-col cols="3">
              <v-text-field
                outline
                label="商品编码"
                append-icon="mdi-file-document-box-search"
                v-model="gcode"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
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
              align-self="center"
            >
              <v-btn
                depressed
                color="primary"
                class="mx-2"
                @click="searchByCondition"
              >
                <v-icon medium>mdi-file-document-box-search</v-icon> 查询
              </v-btn>
              <v-btn
                depressed
                color="primary"
                @click="excel()"
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
          <v-container class="py-0">
            <v-row>
              <v-col
                cols="3"
                align-self="center"
                class="py-0"
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
                align-self="center"
                class="py-0"
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
                    class="py-0"
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
                    <v-select :items="[{text:'件包',value:'PKGTYPE_FULL'},{text:'基本包装',value:'PKGTYPE_MIDDLE'},{text:'最小包装',value:'PKGTYPE_BULK'}]"></v-select>
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
                  ><span class="title">最高库存：</span></v-col>
                  <v-col cols="6">
                    <v-text-field v-model="currentRow.maxqty"></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-row>
                  <v-col
                    cols="6"
                    class="py-0"
                    align-self="center"
                  ><span class="title">最低库存：</span></v-col>
                  <v-col cols="6">
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
                  <v-col cols="6" class="py-0">
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
                      :items="[{text:'在用',value:'1         '},{text:'停用',value:'0         '}]"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >关闭</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
/**
 * 仓库库存上下限设置
 */
var debounce = require("lodash/debounce"); 

export default {
  data() {
    return {
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
      currentRow: {}
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
    /**
     * @param itemid 商品编码
     * @param dept 部门
     */
    async getInventoryList(itemid = "", dept = "") {
      let sqlstr = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.sqlstr)
      ) {
        sqlstr = this.menuInfo.params.sqlstr; //菜单传入tj参数
      }
      let pkgtype = "";
      if (
        !this.$utilsService.isUndefined(this.menuInfo.params) &&
        !this.$utilsService.isUndefined(this.menuInfo.params.pkgtype)
      ) {
        pkgtype = this.menuInfo.params.pkgtype; //菜单传入tj参数
      }
      let param = {
        itemid: itemid,
        dept,
        mark: "1",
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
        "dtcService",
        "getInvenstrategyInfoList",
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
    }
  }
};
</script>