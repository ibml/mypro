<template>
  <v-container
    fluid
    grid-list-lg
    class="pa-3"
  >
    <v-layout column>
      <v-flex md6>
        <v-card style="height: 70%;">
          <v-card-text>
            <v-form
              ref="form1"
              lazy-validation
            >
              <v-container
                fluid
                grid-list-lg
                pa-0
              >
                <v-layout row>

                  <template>
                    <v-flex md2>
                      <v-menu
                        v-model="dateMenu1"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="date1"
                            hide-details
                            label="开始日期"
                            persistent-hint
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date1"
                          locale="zh-cn"
                          no-title
                          @input="dateMenu1 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex md2>
                      <v-menu
                        v-model="dateMenu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="date2"
                            hide-details
                            label="结束日期"
                            persistent-hint
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date2"
                          locale="zh-cn"
                          no-title
                          @input="dateMenu2 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex md3>
                      <v-select
                        :items="supplyItems"
                        v-model="supplyId"
                        label="供应商"
                        item-text="supply"
                        item-value="supplyid"
                        append-icon="mdi-chevron-down"
                        required
                        hide-details
                      >
                      </v-select>
                    </v-flex>
                    <!-- <v-flex md3 v-show="false">
                      <v-select :items="statusItems" v-model="statusId" item-text="status_name" item-value="status_id"
                        append-icon="mdi-chevron-down" label="状态" prepend-icon="mdi-check-underline"></v-select>
                    </v-flex> -->
                  </template>

                  <v-flex md6>
                    <v-btn
                      color="info"
                      class="px-0"
                      @click="doSearch"
                    >
                      查询
                    </v-btn>
                    <v-btn
                      color="blue-grey"
                      class="white--text"
                      @click="excel()"
                    >
                      <v-icon
                        left
                        dark
                        class="mr-2"
                      >mdi-file-excel</v-icon>导出Excel
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex md6>
        <v-card>
          <v-tabs
            v-model="active"
            light
            slider-color="info"
          >
            <v-tab>{{ "单据列表" }}</v-tab>
            <v-tab>{{ "单据明细" }}</v-tab>
            <v-tab-item>
              <v-card>
                <v-layout
                  row
                  class="ma-0"
                >
                  <v-flex
                    md3
                    class="pt-1"
                  >
                    <v-text-field
                      hide-details
                      label="快速过滤"
                      v-model="filterSearch"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <el-table
                  id="outTable"
                  :data="tables"
                  :height="tableHeight +'px'"
                  style="width: 100%;"
                  stripe
                  border
                  @row-dblclick="doSearch2"
                >
                  <el-table-column
                    fixed
                    label="序号"
                    width="60"
                    align="center"
                  >
                    <template slot-scope="scope"><span>{{scope.$index+(carCurrentPage - 1) * carPagesize + 1}} </span></template>
                  </el-table-column>
                  <template v-for="(col ,index) in gridColumns">
                    <el-table-column
                      :label="col.text"
                      :key="index"
                      :prop="col.value"
                      :width="col.width"
                    >
                    </el-table-column>
                  </template>
                </el-table>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-layout
                  row
                  class="ma-0"
                >
                  <v-flex
                    md3
                    class="pt-1"
                  >
                    <v-text-field
                      hide-details
                      label="快速过滤"
                      v-model="filterSearch2"
                    ></v-text-field>
                  </v-flex>
                  <v-flex
                    md4
                    class="pt-1"
                  >
                    <v-btn
                      color="red"
                      dark
                      @click="pass('no')"
                    >
                      <v-icon class="pr-2">mdi-close-outline</v-icon>取消单据
                    </v-btn>
                    <v-btn
                      color="info"
                      class="ml-2"
                      dark
                      @click="pass('yes')"
                    >
                      <v-icon class="pr-2">mdi-check-outline</v-icon>单据确认
                    </v-btn>
                  </v-flex>
                </v-layout>
                <!-- <el-table :data="items2.slice((carCurrentPage2 - 1) * carPagesize2, carCurrentPage2 * carPagesize2)"   -->
                <el-table
                  id="outTable2"
                  :data="tables2"
                  :height="tableHeight2 +'px'"
                  style="width: 100%"
                  stripe
                  border
                >
                  <el-table-column
                    fixed
                    label="序号"
                    width="60"
                    align="center"
                  >
                    <template slot-scope="scope"><span>{{scope.$index+(carCurrentPage - 1) * carPagesize + 1}} </span></template>
                  </el-table-column>
                  <template v-for="(col ,index) in gridColumns2">
                    <el-table-column
                      v-if="col.value =='qty' "
                      :label="col.text"
                      :key="index"
                      :width="col.width"
                    >
                      <template slot-scope="scope">
                        <div
                          @click="modQty(col.value+scope.$index,scope.row)"
                          v-show="!scope.row.modQtyMark"
                        ><span style="color:#337ab7;">&nbsp;{{ scope.row.qty }}</span></div>
                        <v-text-field
                          :id="col.value+scope.$index"
                          type="number"
                          v-show="!!scope.row.modQtyMark"
                          @blur="scope.row.modQtyMark = false"
                          class="pt-0 mt-0"
                          v-model="scope.row.qty"
                          hide-details
                        ></v-text-field>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-else-if="col.value =='note' "
                      :label="col.text"
                      :key="index"
                      :width="col.width"
                    >
                      <template slot-scope="scope">
                        <div
                          @click="modNote(col.value+scope.$index,scope.row)"
                          v-show="!scope.row.modNoteMark"
                        ><span style="color:#337ab7;">&nbsp;{{ scope.row.note }}</span></div>
                        <v-text-field
                          :id="col.value+scope.$index"
                          v-show="!!scope.row.modNoteMark"
                          @blur="scope.row.modNoteMark = false"
                          class="pt-0 mt-0"
                          v-model="scope.row.note"
                          hide-details
                        ></v-text-field>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-else
                      :label="col.text"
                      :key="index"
                      :prop="col.value"
                      :width="col.width"
                    >
                    </el-table-column>
                  </template>
                </el-table>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/**
 * 采购计划审批
 */
import UtilsService from "@/services/UtilsService";
import AuthenticationService from "@/services/AuthenticationService";
import CommonService from "@/services/CommonService";

import FileSaver from "file-saver";
import { utils, write } from "xlsx/dist/xlsx.mini.min.js";

export default {
  name: "procurementPlanConfirmPC",
  data: () => ({
    userInfo: AuthenticationService.getCurrentUser().userInfo,
    menuInfo: {},

    items: [], //结果集
    items2: [],

    gridColumns: [], //显示列
    gridColumns2: [],
    supplyItems: [], //供应商下拉列表
    supplyId: "", //供应商下拉列表绑定的值
    //状态
    statusItems: [
      { status_id: "0", status_name: "全部" },
      { status_id: "1", status_name: "已确认" },
      { status_id: "2", status_name: "未确认" }
    ],
    statusId: "0",
    date1: UtilsService.dateFormat(new Date(), "yyyy-MM-dd"),
    date2: UtilsService.dateFormat(new Date(), "yyyy-MM-dd"),
    dateMenu1: false,
    dateMenu2: false,

    no1: "",

    carPagesize: 10, //每页总数
    carCurrentPage: 1, //页码
    carPagesize2: 10,
    carCurrentPage2: 1,

    active: 0, //绑定的tab标签页下标
    //isDeptShow: false,//是否显示科室列表
    //表格的高度(这里默认给浏览器可视区高度 - 表格以上部分的高度)
    tableHeight: document.documentElement.clientHeight - 288 - 60, //第一个表格的高度
    tableHeight2: document.documentElement.clientHeight - 288 - 60, //第二个表格的高度

    filterSearch: "", //快速过滤搜索
    //isFilterTableShow: false,//是否显示快速过滤

    filterSearch2: "" //快速过滤搜索
  }),

  created() {
    this.init();
    //console.log("userifo",this.userInfo);//登录用户信息
  },

  filters: {
    number(value, point) {
      let num = Number(value);
      if (!isNaN(num)) {
        return num.toFixed(point);
      } else {
        return "";
      }
    }
  },

  computed: {
    dialog() {
      return this.$store.state.GlobalDialog.dialog;
    },

    //快速过滤对应的表格数据
    tables() {
      let search = this.filterSearch;
      if (search) {
        return this.items.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return String(dataNews[key]).indexOf(search) > -1;
            //return String(dataNews[key]).toLowerCase().indexOf(search) > -1 //如果有字母统一按小写来过滤
          });
        });
      }
      return this.items;
    },

    tables2() {
      let search = this.filterSearch2;
      if (search) {
        return this.items2.filter(dataNews => {
          return Object.keys(dataNews).some(key => {
            return String(dataNews[key]).indexOf(search) > -1;
            //return String(dataNews[key]).toLowerCase().indexOf(search) > -1 //如果有字母统一按小写来过滤
          });
        });
      }
      return this.items2;
    }
  },

  methods: {
    //初始方法
    init() {
      this.menuInfo = this.$route.meta.menuInfo;
      if (this.menuInfo.params.mark) {
        this.mark = this.menuInfo.params.mark; //菜单中获取mark赋值
      }
      if (this.menuInfo.params.mark2) {
        this.mark2 = this.menuInfo.params.mark2;
      }
      if (this.menuInfo.params.interfacename) {
        this.interfacename = this.menuInfo.params.interfacename;
      }
      /* this.gridColumns = UtilsService.initVuetifyColumnConfig(//默认菜单
          this.menuInfo.columns_config
        ); */

      //从菜单中获取显示列
      this.gridColumns = UtilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config.split("^`")[0] //按 ^` 这两个符号劈开
      );
      this.gridColumns2 = UtilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config.split("^`")[1]
      );
      //console.log(this.gridColumns);

      this.getSelect();

      /* 判断 科室列表是否显示 dept=true */
      /* let menuDept = "";
        if (!UtilsService.isUndefined(this.menuInfo.params)&&!UtilsService.isUndefined(this.menuInfo.params.dept)) {
          menuDept = this.menuInfo.params.dept;//菜单传入dept参数
        }
        if (menuDept == "true"){
          this.isDeptShow = true;//显示科室列表
          //this.getSelect();
        }else{
          this.isDeptShow = false;//隐藏科室列表
        } */

      /* 判断 快速过滤 是否显示*/
      /* if (!UtilsService.isUndefined(this.menuInfo.params)&&!UtilsService.isUndefined(this.menuInfo.params.panel1)) {
          let panel1 = this.menuInfo.params.panel1;
          if(panel1 == "true"){
            this.isFilterTableShow = true;
            this.tableHeight = this.tableHeight - 60;
          }else{
            this.isFilterTableShow = false;
          }
        } */
    },

    showLoading() {
      //显示加载框
      /* this.dialog.onConfirm = null;
        this.dialog.onCancel = null;
        this.dialog.type = "loading";
        this.dialog.title = "提示";
        this.dialog.titleIcon = "info";
        this.dialog.message =  "数据处理中...";
        this.dialog.status = true; */
      this.showDialog(
        null,
        null,
        "loading",
        "提示",
        "info",
        "数据处理中...",
        true
      );
    },

    showDialog(onConfirm, onCancel, type, title, titleIcon, message, status) {
      this.dialog.onConfirm = onConfirm;
      this.dialog.onCancel = onCancel;
      this.dialog.type = type;
      this.dialog.title = title;
      this.dialog.titleIcon = titleIcon;
      this.dialog.message = message;
      this.dialog.status = status;
    },

    //获取供应商下拉列表
    async getSelect() {
      this.param = {
        code1: this.userInfo.user_code,
        conditions: "''",
        //whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };

      var resultData = await CommonService.executeService(
        "dtcService",
        "getSupply",
        this.param,
        true,
        this._sysConfig.appInfo.elite_url
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
        list.unshift({ supplyid: "", supply: "全部" }); //数组前面加入一个对象
        this.supplyItems = list;
      }
    },

    //单据列表查询
    doSearch() {
      let time1 = new Date(this.date1);
      let time2 = new Date(this.date2);
      if (time1 > time2) {
        this.$mvc.MDialog.show({
          title: "错误",
          titleIcon: "error",
          message: "查询日期有误：开始日期不允许大于结束日期。",
          showCancel: false
        });
      }

      this.items = []; //清空第一个列表
      this.items2 = []; //清空第二个列表
      this.active = 0; //查询默认在第一个Tab标签页

      let sqlstr = "";
      if (this.menuInfo.params.tj) {
        sqlstr = this.menuInfo.params.tj;
      }

      if (this.statusId == "1") sqlstr += " and a.type in('99') ";
      else if (this.statusId == "2") sqlstr += " and a.type in('a6') ";
      if (this.supplyId.trim().length > 0)
        sqlstr += "and a.custno='" + this.supplyId.trim() + "'";

      this.interfaceConditions = {
        mark: "1",
        date1: UtilsService.dateFormat(this.date1, "MM/dd/yyyy"),
        date2: UtilsService.dateFormat(this.date2, "MM/dd/yyyy"),
        tj: sqlstr,
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };
      this.$mvc.MDialog.show({
        message: "数据处理中...",
        type: "loading"
      });

      CommonService.executeService(
        "dtcService",
        "getOutorderList",
        this.interfaceConditions,
        true,
        this._sysConfig.appInfo.elite_url
      )
        .then(resultData => {
          this.$mvc.MDialog.hide(); //隐藏加载框

          if (!resultData || resultData.resultKey == "-1") {
            this.$mvc.MDialog.show({
              title: "失败",
              titleIcon: "error",
              message: resultData ? resultData.resultMessage : "未知错误！",
              showCancel: false
            });
          } else {
            this.items = resultData.dataList.map((item, index) => {
              //对查询出来的结果进行字段的公式运算
              item.gys = item.custno.trim() + item.custname.trim();
              return item;
            });
          }
        })
        .catch(function(error) {}.bind(this));
    },

    //单据明细查询， 其中item是双击选中行的值
    doSearch2(item) {
      let time1 = new Date(this.date1);
      let time2 = new Date(this.date2);
      if (time1 > time2) {
        this.$mvc.MDialog.show({
          title: "错误",
          titleIcon: "error",
          message: "查询日期有误：开始日期不允许大于结束日期。",
          showCancel: false
        });
      }

      /* if(!this.isTabShow){//如果不显示第二个标签页则返回
          return;
        } */

      this.active = 1; //跳转到第二个tab标签页面
      this.items2 = []; //清空第二个列表
      this.showEdit = true;
      this.no1 = item.no1;
      //this.itemType = item.type;
      let sqlstr = " and a.code='a'";
      let pkg = "";
      if (item.no1) {
        sqlstr += " and a.no1='" + item.no1.trim() + "'";
      }
      if (this.menuInfo.params.pkgtype) {
        pkg = this.menuInfo.params.pkgtype;
      }
      this.interfaceConditions = {
        mark: "",
        date1: "",
        date2: "",
        pkgtype: pkg,
        tj: sqlstr,
        whsid: "hmis_gg_01",

        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };
      this.$mvc.MDialog.show({
        message: "数据处理中...",
        type: "loading"
      });

      //console.log(this.interfaceConditions);
      CommonService.executeService(
        "spdService",
        "getContract",
        this.interfaceConditions,
        true,
        this._sysConfig.appInfo.elite_url
      )
        .then(resultData => {
          this.$mvc.MDialog.hide();
          if (!resultData || resultData.resultKey == "-1") {
            this.$mvc.MDialog.show({
              title: "失败",
              titleIcon: "error",
              message: resultData ? resultData.resultMessage : "未知错误！",
              showCancel: false
            });
          } else {
            //this.items2 = resultData.dataList;//得到结果集
            this.items2 = resultData.dataList.map((item, index) => {
              //在菜单显示列中配的公式无效，所以在此运算公式
              item.gys = item.custno.trim() + item.custname.trim();
              let name0_0 = item.name0_0 ? item.name0_0.trim() : "";
              let name1_0 = item.name1_0 ? item.name1_0.trim() : "";
              item.zdr = item.name0.trim() + name0_0;
              item.shr = item.name1.trim() + name1_0;
              item.note = item.note.trim(); //备注trim处理
              item.kc = this.$options.filters["number"](item.kc, 2);
              item.qtyold = this.$options.filters["number"](item.qtyold, 2);
              item.qty = this.$options.filters["number"](item.qty, 2);
              item.price = this.$options.filters["number"](item.price, 2);
              item.maxqty = this.$options.filters["number"](item.maxqty, 0);
              item.minqty = this.$options.filters["number"](item.minqty, 0);
              item.dstockqty = this.$options.filters["number"](
                item.dstockqty,
                0
              );
              item.total = this.$options.filters["number"](item.total, 2);
              item.pack = this.$options.filters["number"](item.pack, 0);

              item.modQtyMark = false;
              item.modNoteMark = false;
              return item;
            });
            //console.log("items22",this.items2);
          }
        })
        .catch(function(error) {}.bind(this));
    },

    //单据确认或取消计划
    pass(type) {
      let stautsName = type === "yes" ? "单据确认" : "取消计划";
      let is_ok = true;
      let no1 = "";
      let status = "";
      let check = true;

      for (let [i, v] of this.tables2.entries()) {
        if (v.qty.trim().length == 0) {
          this.$mvc.MDialog.show({
            title: "错误",
            titleIcon: "error",
            message: "操作失败，第" + (i + 1) + "行计划数量不能为空！",
            showCancel: false
          });

          return false;
        }
        no1 = v.no1.trim();
        status = v.status.trim();
      }

      if (!check) {
        return;
      }
      if (no1.trim().length == 0) {
        this.$mvc.MDialog.show({
          title: "错误",
          titleIcon: "error",
          message: "操作失败，参数“no1”不能为空！",
          showCancel: false
        });

        return;
      }
      if (status.trim().length == 0) {
        this.$mvc.MDialog.show({
          title: "错误",
          titleIcon: "error",
          message: "操作失败，参数“status”不能为空！",
          showCancel: false
        });
        return;
      }
      let that=this;
      this.$mvc.MDialog.show({
        title: "提示",
        message: "确定执行 “" + stautsName + "” 操作吗？",
        onConfirm: function() {
          //console.log(this.tables2);
          for (let [index, item] of this.tables2.entries()) {
            no1 = item.no1.trim();
            status = item.status.trim();
            this.interfaceConditions = {
              code: "a", //单据类型
              no: item.no.trim(), //票/单号
              custno: item.custno.trim(), //客户编码
              ym: "", //签订年月
              gcode: item.itemid.trim(), //商品码
              custno2: "", //厂家编码
              conf: "", //合同属性
              date1: UtilsService.dateFormat(new Date(), "MM-dd-yyyy"), // 开单日期 牛头用当前日期
              price: item.price.trim() / item.convertrate.trim(), //单价
              //qty = this.items[i].qty.trim(); //数量
              qty1: "",
              qty2: "",
              disc: "",
              price1: "",
              price2: "",
              psdcode1: this.userInfo.user_code, //制单人
              note: item.note.trim(), //备注
              note1: "", //付款方式
              comp: "", //公司编码
              mark: "",
              tran: "",
              invo: "",
              date2: "",
              no1: item.no1.trim(),
              name1: "",
              name2: "", //销售区域
              name3: item.itemid.trim(),
              name4: "",
              date3: UtilsService.dateFormat(item.date3.trim(), "MM-dd-yyyy"), //有效日期
              date4: "",
              date5: "",
              extent: "",
              ckinven: item.ckinven.trim(), //库存地点
              type: item.status.trim(), //审核状态
              id: "",
              gname: "", //商品名称
              gspn: "", //产地
              gplc: "", //来货破损处理方式

              appProject: "dtc",
              appVersion: "hmis_gg_01"
            };

            if (type == "yes") {
              //单据确认
              this.interfaceConditions.qty =
                item.qty.trim() * item.convertrate.trim();
            } else if (type == "no") {
              //取消计划
              this.interfaceConditions.qty = "0";
            }
            //console.log(this.interfaceConditions )
            this.$mvc.MDialog.show({
              message: "数据处理中...",
              type: "loading"
            });

            CommonService.executeService(
              "erpOperationService",
              "saveOrUpdateContractInfo",
              this.interfaceConditions,
              true,
              this._sysConfig.appInfo.elite_url
            )
              .then(resultData => {
                this.$mvc.MDialog.hide();

                if (!resultData || resultData.resultKey == "-1") {
                  this.$mvc.MDialog.show({
                    title: "生成合同失败！",
                    titleIcon: "error",
                    message: resultData
                      ? resultData.resultMessage
                      : "未知错误！",
                    showCancel: false
                  });

                  is_ok = false;
                  return false;
                } else {
                  is_ok = true;
                }
              })
              .catch(function(error) {}.bind(this));
          }

          if (is_ok) {
            //进入流程
            let param = {
              tabname: "contract",
              no: no1,
              colname: "contract.no1",
              tj: "",
              time: "0",
              step: status,
              sql: "",
              name: this.userInfo.user_code
            };

            this.showLoading(); //显示加载框
            this.$mvc.MDialog.show({
              message: "数据处理中...",
              type: "loading"
            });

            CommonService.executeService(
              "erpService",
              "doFlowwork",
              this.param,
              true,
              this._sysConfig.appInfo.elite_url
            )
              .then(resultData => {
                this.$mvc.MDialog.hide();

                if (!resultData || resultData.resultKey == "-1") {
                  this.$mvc.MDialog.show({
                    title: "失败",
                    titleIcon: "error",
                    message: resultData
                      ? resultData.resultMessage
                      : "未知错误！",
                    showCancel: false
                  });
                } else {
                  this.$mvc.MDialog.show({
                    title: "提示",
                    message: "操作成功！",
                    onCancel() {
                      console.log(1); // 非当前 vm
                    },
                    onConfirm: function() {
                      this.showEdit = false;
                      this.doSearch();
                    }.bind(this)
                  });
                }
              })
              .catch(function(error) {}.bind(this));
          }
        }.bind(that)
      });
    },

    modQty(e, row) {
      row.modQtyMark = true;
      this.$nextTick(() => {
        document.getElementById(e).focus(); //获取id给输入框焦点
      });
    },

    modNote(e, row) {
      row.modNoteMark = true;
      this.$nextTick(() => {
        document.getElementById(e).focus(); //获取id给输入框焦点
      });
    },

    //导出Excle
    excel() {
      let menuName = this.menuInfo.menu_name; //菜单名称
      if (this.active == 0) {
        //在第一个tab标签页时导出第一个tab标签页的表格
        this.exportExcel("outTable", menuName + "单据列表"); //outTable 为表格的id
      } else if (this.active == 1) {
        //在第二个tab标签页时导出第二个tab标签页的表格
        this.exportExcel("outTable2", menuName + "单据明细");
      }
    },

    /*导出Excel公共方法：(表格的id, 导出Excel文件的名称)
        使用该方法须知：需要引入 导出Excel的两个依赖
        ① 安装相关依赖  npm install --save xlsx file-saver
        ② 组件里头引入  import FileSaver from 'file-saver'; 
                       import{ utils, write} from 'xlsx/dist/xlsx.mini.min.js'; //xlsx迷你版
      */
    exportExcel(id, title) {
      /* el-table的fixed属性来让某一列固定，但elementui的实现方式是：创建了两个tabledom，
          通过一个隐藏一个显示来实现交互效果。当导出整个el-table 就会将两个div内的table都导出，
          导致导出表格时会出现导出两次的问题，这里删除掉
          判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去。
        */
      let table = document.querySelector("#" + id);
      let fix = document.getElementById(id).querySelector(".el-table__fixed"); //哪个表格下面的类
      let wb = utils.table_to_book(table);
      if (fix) {
        wb = utils.table_to_book(table.removeChild(fix));
        table.appendChild(fix);
      }
      let wbout = write(wb, { bookType: "xlsx", bookSST: true, type: "array" });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          title +
            "(" +
            UtilsService.dateFormat(new Date(), "yyyyMMdd") +
            ").xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  }
};
</script>