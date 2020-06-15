<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-0 pb-2">
        <v-card class="pa-2" outlined tile>
          <v-row align-content="center" justify="center">
            <v-col cols="2" class="py-0">
              <v-menu v-model="dateMenu1" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y max-width="290px" min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="date1" hide-details label="开始日期" persistent-hint
                    append-icon="mdi-calendar-range" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="date1" locale="zh-cn" no-title @input="dateMenu1 = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="2" class="py-0">
              <v-menu v-model="dateMenu2" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y max-width="290px" min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="date2" hide-details label="结束日期" persistent-hint
                    append-icon="mdi-calendar-range" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="date2" locale="zh-cn" no-title @input="dateMenu2 = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="2" class="text-center py-0" align-self="center">
              <v-select :items="supplyItems" v-model="supplyId" label="供应商" item-text="supply" item-value="supplyid"
                append-icon="mdi-chevron-down" required hide-details no-data-text="无数据" ></v-select>
            </v-col>
            <v-col cols="2" class="text-center py-0" align-self="center">
              <v-text-field outline hide-details label="发票号码" v-model="no" ></v-text-field>
            </v-col>
            <v-col align-self="center" class="py-0">
              <v-btn depressed color="primary" class="mx-2" @click="doSearch">
                <v-icon medium>mdi-magnify</v-icon> 查询
              </v-btn>
              <v-btn depressed color="green" class="white--text" @click="excel()">
                <v-icon medium>mdi-file-excel</v-icon> 导出Excel
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="pa-2" outlined tile>
      <v-tabs v-model="active" light slider-color="info">
        <v-tab>{{ label }}</v-tab>
        <v-tab>{{ label2 }}</v-tab>
        <v-tab>{{ label3 }}</v-tab>
        <v-tab>{{ label4 }}</v-tab>
        <v-tab-item>
          <v-card>
            <v-row  class="ma-0">
              <v-col cols="2" class="pt-1">
                <v-text-field hide-details label="物品名称" v-model="textBox1"></v-text-field>
              </v-col>
              <v-col cols="2" class="pt-1">
                <v-text-field hide-details label="备注" v-model="textBox2"></v-text-field>
              </v-col>
              <v-col cols="2" class="pt-7 pr-0">
                <span>已勾选金额：{{lbJe}}元</span>
              </v-col>
              <v-col cols="2" class="pt-1">
                <v-text-field hide-details label="打印金额" v-model="printJe"></v-text-field>
              </v-col>
              <v-col cols="2" class="pt-1">
                <v-text-field hide-details label="编号日期" v-model="tbno5"></v-text-field>
              </v-col>
              <v-col align-self="center">
                <v-btn depressed color="teal" class="white--text mr-2" @click="save">
                <v-icon medium>mdi-content-save-all-outline</v-icon> 生成付款单
              </v-btn>
              </v-col>
            </v-row>

            <el-table id="outTable" :data="tables" :height="tableHeight +'px'" style="width: 100%;" stripe border
              @cell-dblclick="doSearch2" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40" ></el-table-column>
              <el-table-column fixed label="序号" width="60" align="center">
                <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pagesize + 1}}
                  </span></template>
              </el-table-column>
              <template v-for="(col ,index) in gridColumns">
                <el-table-column :label="col.text" :key="index" :prop="col.value" :width="col.width" :formatter="formatOne">
                </el-table-column>
              </template>
            </el-table>
            <v-card-actions align-end justify-end row fill-height class="py-0">
                  <v-layout pa-2 align-end justify-end row fill-height>
                    <el-pagination @size-change="handleSizeChange"
                      @current-change="handleCurrentChange" :current-page="currentPage"
                      :page-sizes="[5, 10, 20, 50, 100, 200, 500]" :page-size="pagesize"
                      layout="total, sizes, prev, pager, next" :total="items.length">
                    </el-pagination>
                  </v-layout>
                </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <!-- <el-table :data="items2.slice((carCurrentPage2 - 1) * carPagesize2, carCurrentPage2 * carPagesize2)"   -->
            <el-table id="outTable2" :data="items2" :height="tableHeight2 +'px'" style="width: 100%" stripe border>
              <el-table-column fixed label="序号" width="60" align="center">
                <template slot-scope="scope"><span>{{scope.$index+(currentPage2 - 1) * pagesize2 + 1}}
                  </span></template>
              </el-table-column>
              <template v-for="(col ,index) in gridColumns2">
                <el-table-column :label="col.text" :key="index" :prop="col.value" :width="col.width" :formatter="formatTwo">
                </el-table-column>
              </template>
            </el-table>
            <!-- <v-card-actions>
                    <v-layout pa-2 align-end justify-end row fill-height>
                      <el-pagination @size-change="carHandleSizeChange2"
                        @current-change="carHandleCurrentChange2" :current-page="carCurrentPage2"
                        :page-sizes="[5, 10, 20, 50, 100, 200, 500]" :page-size="carPagesize2"
                        layout="total, sizes, prev, pager, next" :total="items2.length">
                      </el-pagination>
                    </v-layout>
                  </v-card-actions> -->
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-row  class="ma-0">
              <v-col cols="2" class="pt-1">
                <v-text-field hide-details label="发票张数" v-model="textBox1"></v-text-field>
              </v-col>
              <v-col cols="2" class="pt-1">
                <v-text-field hide-details label="发票金额" v-model="textBox2"></v-text-field>
              </v-col>
              <v-col cols="2" class="pt-1">
                <v-text-field hide-details label="编号日期" v-model="tbno5"></v-text-field>
              </v-col>
              <v-col align-self="center">
                <v-btn depressed color="primary" class="mx-2" @click="doSearch4">
                  <v-icon medium>mdi-magnify</v-icon> 付款单查询
                </v-btn>
              </v-col>
            </v-row>

            <el-table id="outTable3" :data="tables2" :height="tableHeight +'px'" style="width: 100%;" stripe border
              @cell-dblclick="doSearch4">
              <el-table-column fixed label="序号" width="60" align="center">
                <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pagesize + 1}}
                  </span></template>
              </el-table-column>
              <template v-for="(col ,index) in gridColumns3">
                <el-table-column :label="col.text" :key="index" :prop="col.value" :width="col.width" :formatter="formatThree">
                </el-table-column>
              </template>
            </el-table>
            <v-card-actions align-end justify-end row fill-height class="py-0">
                  <v-layout pa-2 align-end justify-end row fill-height>
                    <el-pagination @size-change="handleSizeChange2"
                      @current-change="handleCurrentChange2" :current-page="currentPage2"
                      :page-sizes="[5, 10, 20, 50, 100, 200, 500]" :page-size="pagesize2"
                      layout="total, sizes, prev, pager, next" :total="items3.length">
                    </el-pagination>
                  </v-layout>
                </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <!-- <el-table :data="items2.slice((carCurrentPage2 - 1) * carPagesize2, carCurrentPage2 * carPagesize2)"   -->
            <el-table id="outTable4" :data="items4" :height="tableHeight2 +'px'" style="width: 100%" stripe border>
              <el-table-column fixed label="序号" width="60" align="center">
                <template slot-scope="scope"><span>{{scope.$index+(currentPage2 - 1) * pagesize2 + 1}}
                  </span></template>
              </el-table-column>
              <template v-for="(col ,index) in gridColumns4">
                <el-table-column :label="col.text" :key="index" :prop="col.value" :width="col.width" :formatter="formatFour">
                </el-table-column>
              </template>
            </el-table>
            <!-- <v-card-actions>
                    <v-layout pa-2 align-end justify-end row fill-height>
                      <el-pagination @size-change="carHandleSizeChange2"
                        @current-change="carHandleCurrentChange2" :current-page="carCurrentPage2"
                        :page-sizes="[5, 10, 20, 50, 100, 200, 500]" :page-size="carPagesize2"
                        layout="total, sizes, prev, pager, next" :total="items2.length">
                      </el-pagination>
                    </v-layout>
                  </v-card-actions> -->
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>
<script>
  /**
   * 生成付款通知单
   */
  var debounce = require("lodash/debounce"); //使用lodash的深度复制对象方法

  export default {
    name: "PaymentBillList",
    data() {
      return {
        userInfo: this.$authenticationService.getCurrentUser().userInfo,
        menuInfo: {},

        items: [], //结果集
        items2: [],
        items3: [],
        items4: [],

        label: "生成付款单",
        label2: "付款单明细",
        label3: "付款单查询",
        label4: "付款单明细",

        gridColumns: [], //显示列
        gridColumns2: [],
        gridColumns3: [],
        gridColumns4: [],
        supplyItems: [],
        supplyId: "",
        no: "",

        textBox1: "",
        textBox2: "",
        lbJe: 0,
        printJe: "",
        tbno5: "",

        fpzs: "",
        bdJe: "",
        tbno51: "",

        multipleSelection: [], //用于存储选中行数据的集合

        date1: this.$utilsService.dateFormat(new Date(this.$utilsService.getBeforeDate(7)), "yyyy-MM-dd"),
        date2: this.$utilsService.dateFormat(new Date(), "yyyy-MM-dd"),
        dateMenu1: false,
        dateMenu2: false,

        pagesize: 10, //每页总数
        currentPage: 1, //页码
        pagesize2: 10,
        currentPage2: 1,

        active: 0, //绑定的tab标签页下标
        //表格的高度(这里默认给浏览器可视区高度 - 表格以上部分的高度)
        tableHeight: document.documentElement.clientHeight - 364, //第一个表格的高度
        tableHeight2: document.documentElement.clientHeight - 252, //第二个表格的高度

        filterSearch: '', //快速过滤搜索
        search: "",      //快速过滤搜索
        filterSearch2: '', 
        search2: "",      
        isFilterTableShow: false, //是否显示快速过滤

      }
    },
    computed: {
      //快速过滤对应的表格数据
      tables() {
        let { currentPage, pagesize, items } = this;
        let search=this.filterSearch;
        if(search){
          return items.filter((dataNews)=>{
            return Object.keys(dataNews).some((key)=>{
              return String(dataNews[key]).indexOf(search) > -1
              //return String(dataNews[key]).toLowerCase().indexOf(search) > -1 //如果有字母统一按小写来过滤
            })
          })
        }else{
          return this.items.slice(
            (currentPage - 1) * pagesize,
            currentPage * pagesize
          );
        }
      },
      tables2() {
        let { currentPage2, pagesize2, items3 } = this;
        let search = this.filterSearch2;
        if(search){
          return items3.filter((dataNews)=>{
            return Object.keys(dataNews).some((key)=>{
              return String(dataNews[key]).indexOf(search) > -1
              //return String(dataNews[key]).toLowerCase().indexOf(search) > -1 //如果有字母统一按小写来过滤
            })
          })
        }else{
          return this.items3.slice(
            (currentPage2 - 1) * pagesize2,
            currentPage2 * pagesize2
          );
        }
      },
      
    },
    created() {
      this.$watch(
        "search",
        debounce(key => {
          // newQuery为输入的值
          this.filterSearch = key;
        }, 2000)
      );
      this.init();
    },
    filters:{
      number (value, point){
        let num = Number(value);
        if(!isNaN(num)){
          return num.toFixed(point)
        }else{
          return ""
        }
      }
    },
    methods: {
      //初始方法
      init(){
        this.menuInfo = this.$route.meta.menuInfo;
        /* this.gridColumns = this.$utilsService.initVuetifyColumnConfig(//默认菜单
          this.menuInfo.columns_config
        ); */ 
        //从菜单中获取显示列
        this.gridColumns = this.$utilsService.initVuetifyColumnConfig(
          this.menuInfo.columns_config.split('^`')[0]  //按 ^` 这两个符号劈开
        );
        if(this.menuInfo.columns_config.split('^`')[1]){
          this.gridColumns2 = this.$utilsService.initVuetifyColumnConfig(
            this.menuInfo.columns_config.split('^`')[1]
          );
        }
        if(this.menuInfo.columns_config.split('^`')[2]){
          this.gridColumns3 = this.$utilsService.initVuetifyColumnConfig(
            this.menuInfo.columns_config.split('^`')[2]
          );
        }
        if(this.menuInfo.columns_config.split('^`')[3]){
          this.gridColumns4 = this.$utilsService.initVuetifyColumnConfig(
            this.menuInfo.columns_config.split('^`')[3]
          );
        }

        this.getSupply();

      },

      //获取供应商下拉列表
      async getSupply() {
        this.param = {
          code1: this.userInfo.user_code,
          conditions: "''",
          appVersion: "hmis_gg_01",
          appProject:"dtc",
          appVersion:"hmis_gg_01"
        };
        
        var resultData = await this.$commonService.executeService("dtcService", "getSupply", this.param, true)
        
        if (!resultData || resultData.resultKey == '-1') {
          this.$mvc.MDialog.show({
            title: "失败",
            titleIcon: "error",
            message: resultData ? resultData.resultMessage : "未知错误！",
            showCancel: false
          });
        } else {
          let list = resultData.dataList;
          //list.unshift({supplyid:"",supply:"全部"});//数组前面加入一个对象
          this.supplyItems = list;
          this.supplyId = this.supplyItems[0].supplyid;
        }
      },

      //查询
      async doSearch() {
        let time1 = new Date(this.date1);
        let time2 = new Date(this.date2);
        if(time1>time2){
          this.$mvc.MDialog.show({
            title: "错误",
            titleIcon: "error",
            message: "查询日期有误：开始日期不允许大于结束日期。",
            showCancel: false
          });
        }
        this.items = [];//清空第一个列表
        this.items2 = [];//清空第二个列表
        this.active = 0;//查询默认在第一个Tab标签页
        
        let sqlstr = "";
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.sqlStr)) {
          sqlstr = this.menuInfo.params.sqlStr;
        }
        if(this.no.trim().length > 0){
          sqlstr += " and no4 like '%" + this.no.trim() + "%'";
        }
        let param = {
          cxrq: this.$utilsService.dateFormat(this.date1,"MM-dd-yyyy"),
          cxrq1: this.$utilsService.dateFormat(this.date2,"MM-dd-yyyy"),
          ztsp: "01",
          ztkh: "",
          mark1: "fprq",
          comp: this.supplyId.trim(),
          ptj: sqlstr,
          cxbz: "3",
          appProject:"erp",
          appVersion:"hmis_gg_01"
        };//传入参数

        //显示加载框
        this.$mvc.MDialog.show({
          message: "数据处理中...",
          titleIcon: "mdi-info",
          title: "提示",
          type: "loading"
        });
        var resultData = await this.$commonService.executeService("spdService", "getYwfpgl", param, true)
        this.$mvc.MDialog.hide(); //隐藏加载框
        if (!resultData || resultData.resultKey == "-1") {
          this.$mvc.MDialog.show({
            title: "失败",
            titleIcon: "error",
            message: resultData ? resultData.resultMessage : "未知错误！",
            showCancel: false
          });
        } else {
          this.items = resultData.dataList;//得到结果集
        }
      },

      //明细查询
      async doSearch2(row, column) {
        let no4 = row.no4.trim();
        let sqlStr = "";
        if (no4.length > 0){
          sqlStr = " and res_field4 in (select no1  from hl_new where no4='"+ no4 +"')";
        }else{
          return;
        }

        this.active = 1;//跳转到第二个tab标签页面
        this.items2 = [];//清空第二个列表

        let param = {
          work: "",
          custId: "",
          itemId: "",
          supplyCode: "",
          billNo: "",
          sqlStr: sqlStr,
          appProject:"dtc",
          appVersion:"hmis_gg_01"
        };//传入参数
        //显示加载框
        this.$mvc.MDialog.show({
          message: "数据处理中...",
          titleIcon: "mdi-info",
          title: "提示",
          type: "loading"
        });
        var resultData = await this.$commonService.executeService("dtcService", "getBillSyDetail", param, false)//参数有中文用post请求
        this.$mvc.MDialog.hide(); //隐藏加载框
        if (!resultData || resultData.resultKey == "-1") {
          this.$mvc.MDialog.show({
            title: "失败",
            titleIcon: "error",
            message: resultData ? resultData.resultMessage : "未知错误！",
            showCancel: false
          });
        } else {
          this.items2 = resultData.dataList;//得到结果集
          //console.log("items2",this.items2);
        }
      },
      
      //付款单查询
      async doSearch3() {
        let time1 = new Date(this.date1);
        let time2 = new Date(this.date2);
        if(time1>time2){
          this.$mvc.MDialog.show({
            title: "错误",
            titleIcon: "error",
            message: "查询日期有误：开始日期不允许大于结束日期。",
            showCancel: false
          });
        }
        this.items3 = [];//清空第一个列表
        this.items4 = [];//清空第二个列表
        this.active = 2;//查询默认在第一个Tab标签页
        
        let sqlstr = "";
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.sqlStr1)) {
          sqlstr = this.menuInfo.params.sqlStr1;
        }
        if(this.no.trim().length > 0){
          sqlstr += " and c.no3 like '%" + this.no.trim() + "%'";
        }
        let param = {
          cxrq: this.$utilsService.dateFormat(this.date1,"MM-dd-yyyy"),
          cxrq1: this.$utilsService.dateFormat(this.date2,"MM-dd-yyyy"),
          ztsp: "01",
          ztkh: "",
          mark1: "fprq",
          comp: this.supplyId.trim(),
          ptj: sqlstr,
          cxbz: "4",
          appProject:"erp",
          appVersion:"hmis_gg_01"
        };//传入参数

        //显示加载框
        this.$mvc.MDialog.show({
          message: "数据处理中...",
          titleIcon: "mdi-info",
          title: "提示",
          type: "loading"
        });
        var resultData = await this.$commonService.executeService("spdService", "getYwfpgl", param, true)
        this.$mvc.MDialog.hide(); //隐藏加载框
        if (!resultData || resultData.resultKey == "-1") {
          this.$mvc.MDialog.show({
            title: "失败",
            titleIcon: "error",
            message: resultData ? resultData.resultMessage : "未知错误！",
            showCancel: false
          });
        } else {
          this.items3 = resultData.dataList;//得到结果集
        }
      },

      //明细查询
      async doSearch4(row, column) {
        let no4 = row.no4.trim();
        let sqlStr = "";
        if (no4.length > 0){
          sqlStr = " and res_field4 in (select no1  from hl_new where no4='"+ no4 +"')";
        }else{
          return;
        }

        this.active = 4;//跳转到第二个tab标签页面
        this.items4 = [];//清空第二个列表

        let param = {
          work: "",
          custId: "",
          itemId: "",
          supplyCode: "",
          billNo: "",
          sqlStr: sqlStr,
          appProject:"dtc",
          appVersion:"hmis_gg_01"
        };//传入参数
        //显示加载框
        this.$mvc.MDialog.show({
          message: "数据处理中...",
          titleIcon: "mdi-info",
          title: "提示",
          type: "loading"
        });
        var resultData = await this.$commonService.executeService("dtcService", "getBillSyDetail", param, false)//参数有中文用post请求
        this.$mvc.MDialog.hide(); //隐藏加载框
        if (!resultData || resultData.resultKey == "-1") {
          this.$mvc.MDialog.show({
            title: "失败",
            titleIcon: "error",
            message: resultData ? resultData.resultMessage : "未知错误！",
            showCancel: false
          });
        } else {
          this.items4 = resultData.dataList;//得到结果集
          //console.log("items2",this.items2);
        }
      },

      //生成付款单
      save(){
        if(this.multipleSelection.length > 0){
          let fkNo = "";
          let fpNos = "";//发票号码
          let rowID = "";
          let count = 0;//发票张数
          let total = 0, total1 = 0;
          this.multipleSelection.map((item,index)=>{
            total += Number(this.$options.filters['number'](item.total1, 2));
            rowID += index + ",";
            let no4 = item.no4.trim();
            if (!(fpNos.indexOf(no4) > -1)){//处理一个发票号有两列的
              fpNos += "'" + no4 + "',";
              count++;
            }
          });
          if (fpNos.length > 0){
            fpNos= (fpNos.substring(fpNos.length-1)==',')?fpNos.substring(0,fpNos.length-1):fpNos;//去掉尾部逗号 ","
          }
          if(total > 0){

            let that = this;
            this.$mvc.MDialog.show({
              title: "提示",
              titleIcon: "mdi-information-outline",
              message: "确定要生成付款单吗？",
              onCancel() {},
              onConfirm: async function() {
                let param = {
                  code: "f",
                  code1: "f",
                  no2: "",//附件号（主键）
                  custno: this.supplyId.trim(),
                  date1: this.$utilsService.dateFormat(new Date(), "MM-dd-yyyy"),
                  no: fpNos,
                  total1: total,//总金额
                  rmbm: this.userInfo.user_code,
                  psdcode1: this.userInfo.user_code,
                  dept:this.userInfo.dept,
                  comp: "01",
                  total: total,//总金额
                  tcomp: "01",
                  gcode: this.textBox1.trim(),
                  bank: "",
                  date2: this.$utilsService.dateFormat(new Date(), "MM-dd-yyyy"),//发票日期
                  note: this.textBox2.trim(),
                  total4: total,//总金额
                  total2: "",

                  appProject:"erp",
                  appVersion:"hmis_gg_01"
                }
                //显示加载框
                this.$mvc.MDialog.show({
                  message: "数据处理中...",
                  type: "loading"
                });
                var resultData = await this.$commonService.executeService("erpService", "doYwhlgl90i1", param, false)
                this.$mvc.MDialog.hide(); //隐藏加载框
                if (!resultData || resultData.resultKey == "-1") {
                  this.$mvc.MDialog.show({
                    title: "失败",
                    titleIcon: "error",
                    message: resultData ? "数据操作失败！" + resultData.resultMessage : "未知错误！",
                    showCancel: false
                  });
                } else {
                  fkNo = resultData.dataList[0].exp1;
                  if (fkNo.length > 0){
                    if (fkNo.substr(0, 2) == "-a")
                    {
                      this.$mvc.MDialog.show({
                        title: "失败",
                        titleIcon: "error",
                        message: resultData ? "数据处理失败。" + fkNo.substr(2, fkNo.length-2) : "未知错误！",
                        showCancel: false
                      });
                    }
                    else
                    {
                      let that = this;
                      this.$mvc.MDialog.show({
                        title: "提示",
                        titleIcon: "mdi-information-outline",
                        message: "操作成功！",
                        onConfirm: function() {
                          this.doSearch();
                        }.bind(that)
                      })
                    
                    }
                  }
                  
                }

              }.bind(that)
            })


          }
        }
      },

      handleSizeChange(size) {
        this.pagesize = size;
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
      },
      handleSizeChange2(size2) {
        this.pagesize2 = size2;
      },
      handleCurrentChange2(currentPage2) {
        this.currentPage2 = currentPage2;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        let total = 0;
        //console.log(this.multipleSelection)
        if(this.multipleSelection.length > 0){
          this.multipleSelection.map((item,index)=>{
            total += Number(this.$options.filters['number'](item.total1, 2));
          });
        this.lbJe = total;
        this.printJe = total;
        }else{
          this.lbJe = 0;
          this.printJe = "";
        }
      },

      //导出Excle
      excel() {
        let menuName = this.menuInfo.menu_name;//菜单名称
        if(this.active == 0){//在第一个tab标签页时导出第一个tab标签页的表格
          let currentPage = this.currentPage;
          let pagesize = this.pagesize;

          this.currentPage = 1;
          this.pagesize = this.items.length; //显示完所有数据

          this.$nextTick(()=>{
            this.$exportExcel('outTable', menuName + this.label);//outTable 为表格的id
            this.currentPage = currentPage;
            this.pagesize = pagesize; //再恢复回每页10条数据
          })
        }else if(this.active == 1){
          this.$nextTick(()=>{
            this.$exportExcel('outTable2', menuName + this.label2);
          })
        }else if(this.active == 2){
          let currentPage2 = this.currentPage2;
          let pagesize2 = this.pagesize2;

          this.currentPage2 = 1;
          this.pagesize2 = this.items3.length; //显示完所有数据

          this.$nextTick(()=>{
            this.$exportExcel('outTable3', menuName + this.label3);//outTable 为表格的id
            this.currentPage2 = currentPage2;
            this.pagesize2 = pagesize2; //再恢复回每页10条数据
          })
        }else if(this.active == 3){
          this.$nextTick(()=>{
            this.$exportExcel('outTable4', menuName + this.label4);
          })
        }

      },

      formatOne(row, column) {
        let meunCol = this.gridColumns.filter((item)=>{
          return item.value == column.property;
        });
        return  this.$utilsService.formatterExpression(row, column, meunCol);
      },
      formatTwo(row, column) {
        let meunCol = this.gridColumns2.filter((item)=>{
          return item.value == column.property;
        });
        return  this.$utilsService.formatterExpression(row, column, meunCol);
      },
      formatThree(row, column) {
        let meunCol = this.gridColumns3.filter((item)=>{
          return item.value == column.property;
        });
        return  this.$utilsService.formatterExpression(row, column, meunCol);
      },
      formatFour(row, column) {
        let meunCol = this.gridColumns4.filter((item)=>{
          return item.value == column.property;
        });
        return  this.$utilsService.formatterExpression(row, column, meunCol);
      },

    }
  };
</script>