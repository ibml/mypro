<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-0 pb-2">
        <v-card class="pa-2" outlined tile>
          <v-row align-content="center" justify="center">
            <v-col cols="2" class="pt-0 pb-2">
              <v-menu v-model="dateMenu1" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y max-width="290px" min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="date1" hide-details label="开始日期" persistent-hint
                    append-icon="mdi-calendar-range" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="date1" locale="zh-cn" no-title @input="dateMenu1 = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="2" class="pt-0 pb-2">
              <v-menu v-model="dateMenu2" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y max-width="290px" min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="date2" hide-details label="结束日期" persistent-hint
                    append-icon="mdi-calendar-range" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="date2" locale="zh-cn" no-title @input="dateMenu2 = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="2" class="text-center pt-0 pb-2" align-self="center">
              <v-select :items="supplyItems" v-model="supplyId" label="供应商" item-text="supply" item-value="supplyid"
                append-icon="mdi-chevron-down" required hide-details no-data-text="无数据" ></v-select>
            </v-col>
            <v-col cols="3" class="text-center pt-0 pb-2" align-self="center">
              <v-row no-gutters justify="start" align="start">
                <v-col cols="4" class="mr-2">
                  <v-select :items="typeItems" v-model="typeId" label="类型" item-text="text" item-value="code"
                    append-icon="mdi-chevron-down" required hide-details no-data-text="无数据"></v-select>
                </v-col>
                <v-col align-self="center" justify-self="center">
                  <v-text-field outline hide-details v-model="no7" ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="pt-0 pb-2">
              <v-text-field outline hide-details label="结算单号" v-model="no1" ></v-text-field>
            </v-col>
            <!-- <v-col align-self="center">
              <v-btn depressed color="primary" class="mx-2" @click="doSearch">
                <v-icon medium>mdi-magnify</v-icon> 查询
              </v-btn>
              <v-btn depressed color="blue-grey" class="white--text" @click="excel()">
                <v-icon medium>mdi-file-excel</v-icon> 导出Excel
              </v-btn>
            </v-col> -->
          </v-row>
          <v-row align-content="center" justify="center">
            <v-col clos="2" align-self="center" class="py-0 pl-1">
              <v-btn depressed color="primary" class="mx-2" @click="doSearch()">
                <v-icon medium>mdi-magnify</v-icon> 查询
              </v-btn>
              <v-btn depressed color="teal" class="white--text mr-2" @click="checkSave()">
                <v-icon medium>mdi-file-excel</v-icon> 发票关联
              </v-btn>
              <v-btn depressed color="red lighten-3" class="white--text mr-2" @click="deleteAmno()">
                <v-icon medium>mdi-file-excel</v-icon> 删除选中附件
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
        <v-tab>{{ "汇总" }}</v-tab>
        <v-tab v-show="isTabShow">{{ label }}</v-tab>
        <v-tab-item>
          <v-card>
            <v-row v-show="isFilterTableShow" class="ma-0">
              <v-col cols="3" class="pt-1">
                <v-text-field hide-details label="快速过滤" append-icon="mdi-magnify" v-model="search"></v-text-field>
              </v-col>
            </v-row>

            <el-table id="outTable" :data="tables" :height="tableHeight +'px'" style="width: 100%;" stripe border
              @row-dblclick="doSearch2" highlight-current-row @current-change="handleSelectionChange">
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
      </v-tabs>
    </v-card>

    <v-dialog v-model="showDialog" persistent scrollable max-width="500" >
      <v-card >
        <v-card-title class="pa-0">
          <v-toolbar>
            <v-toolbar-title><span>关联发票信息</span> </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showDialog = false">
              <v-icon color="red" >mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-form ref="form2" lazy-validation>
          <v-row >
            <v-col cols="3" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">发票号码：</v-subheader>
              </div>
            </v-col>
            <v-col cols="8" class="pa-0">
              <v-text-field v-model="no" hide-details></v-text-field>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="3" class="pa-0">
              <div style="float:right">
                <v-subheader class="pt-3">发票金额：</v-subheader>
              </div>
            </v-col>
            <v-col cols="8" class="pa-0">
              <v-text-field v-model="price" type="number" hide-details ></v-text-field>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="3" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">发票税额：</v-subheader>
              </div>
            </v-col>
            <v-col cols="8" class="pa-0">
              <v-text-field v-model="total4" type="number"  hide-details ></v-text-field>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="3" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">发票日期：</v-subheader>
              </div>
            </v-col>
            <v-col cols="8" class="pa-0">
              <v-menu v-model="cxrqMenu" :close-on-content-click="false" :nudge-right="40"
                transition="scale-transition" offset-y max-width="290px" min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="cxrq" hide-details persistent-hint
                    append-icon="mdi-calendar-range" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="cxrq" locale="zh-cn" no-title @input="cxrqMenu = false"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="3" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">备注：</v-subheader>
              </div>
            </v-col>
            <v-col cols="8" class="pa-0">
             <!--  <v-text-field v-model="note"  hide-details ></v-text-field> -->
              <v-textarea outlined v-model="note" class="pt-3"></v-textarea>
            </v-col>
          </v-row>
        </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="light-blue accent-3" class="white--text" @click="save()">
            <v-icon medium>mdi-content-save</v-icon>保 存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  /**
   * 申领单据发票附件查询
   */
  var debounce = require("lodash/debounce"); //使用lodash的深度复制对象方法

  export default {
    name: "AmnoList",
    data() {
      return {
        userInfo: this.$authenticationService.getCurrentUser().userInfo,
        menuInfo: {},

        items: [], //结果集
        items2: [],
        label: "明细",

        gridColumns: [], //显示列
        gridColumns2: [],
        supplyItems: [],
        supplyId: "",
        typeItems: [],
        typeId: "",
        no7: "",
        no1: "",
        date1: this.$utilsService.dateFormat(new Date(), "yyyy-MM-dd"),
        date2: this.$utilsService.dateFormat(new Date(), "yyyy-MM-dd"),
        dateMenu1: false,
        dateMenu2: false,

        pagesize: 10, //每页总数
        currentPage: 1, //页码
        pagesize2: 10,
        currentPage2: 1,

        active: 0, //绑定的tab标签页下标
        isTabShow: true, //是否显示第二个标签页
        //表格的高度(这里默认给浏览器可视区高度 - 表格以上部分的高度)
        tableHeight: document.documentElement.clientHeight - 344, //第一个表格的高度
        tableHeight2: document.documentElement.clientHeight - 296, //第二个表格的高度

        filterSearch: '', //快速过滤搜索
        search: "",      //快速过滤搜索
        isFilterTableShow: false, //是否显示快速过滤

        multipleSelection: [],
        no3: "",

        showDialog: false,
        no: "",
        price: "",
        total4: "",
        cxrq: this.$utilsService.dateFormat(new Date(), "yyyy-MM-dd"),
        note: "",
        cxrqMenu: false,
        savetype: "amno",
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

      }
      
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

        /* 从菜单获取codeSelect */
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.checkType)) {
          let checkType = this.menuInfo.params.checkType;
          let a = checkType.trim().split('|');
          for (let i = 0; i < a.length; i++){
            let b = a[i].split('-');
            let c = {}
            c["code"] = b[0];
            c["text"] = b[1];
            this.typeItems.push(c);
          }
          this.typeId = this.typeItems[0].code.trim();
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

      //汇总查询
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
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.query)) {
          sqlstr = this.menuInfo.params.query;
          sqlstr = sqlstr.replace('userCode', this.supplyId.trim())
        }
        if(this.no7.trim().length > 0){
          if (this.typeId == "0")
            sqlstr += " and c.no4='"+this.no7.trim()+"'";//按发票号
          if (this.typeId == "1")
            sqlstr += " and c.no3='"+this.no7.trim()+"' ";//按附件号
        }
        if(this.no1.trim().length > 0){
          sqlstr += " and c.no1='"+ this.no1.trim() +"' ";//结算单号
        }
        let param = {
          cxrq: this.$utilsService.dateFormat(this.date1,"MM-dd-yyyy"),
          cxrq1: this.$utilsService.dateFormat(this.date2,"MM-dd-yyyy"),
          ztsp: "",
          ztkh: "",
          mark1: "fprq",
          comp: "01",
          ptj: sqlstr,
          cxbz: this.typeId.trim(),
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

      //单据明细查询
      async doSearch2(row, column) {
        let sqlstr = "";
        let pkgtype = "";
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.query2)) {
          sqlstr = this.menuInfo.params.query2;
          sqlstr = sqlstr.replace('userCode', this.supplyId.trim())
        }
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.pkgtype)) {
          pkgtype = this.menuInfo.params.pkgtype;
        }

        if(!this.isTabShow){//如果不显示第二个标签页则返回
          return;
        }

        this.active = 1;//跳转到第二个tab标签页面
        this.items2 = [];//清空第二个列表

        let param = {
          date1: "",
          date2: "",
          code: "inv_no2",
          no: row.no3,
          mark: "5",
          pkgtype: pkgtype,
          tj: sqlstr,
          whsid: "",
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
        var resultData = await this.$commonService.executeService("dtcService", "getOutinfo", param, true)
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
      handleSizeChange(size) {
        this.pagesize = size;
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
      },
      handleSelectionChange(val) {
        this.multipleSelection = [];
        this.multipleSelection.push(val);//单选是{}
        //console.log(this.multipleSelection)
      },

      //关联发票校验
      checkSave(){
        //保存前数据校验
        let count = 0;
        let voucher_num = "", voucher_num2 = "", custno = "";
        //console.log(this.multipleSelection)
        for(let [i, v] of this.multipleSelection.entries()) {
          count++;
          if (voucher_num.trim().length === 0){
            voucher_num = v.no1?v.no1.trim():"";
            voucher_num2 = voucher_num;
          }else{
            voucher_num2 += "," + v.no1?v.no1.trim():"";
            if (voucher_num !== v.no1?v.no1.trim():""){
              this.$mvc.MDialog.show({
                title: "错误",
                titleIcon: "error",
                message: "结算单号（" + voucher_num2 + "）不相同，不能同时关联！",
                showCancel: false
              });
              return;
            }
          }
          if(custno.trim().length === 0){
            custno = v.custno.trim();
          }else{
            if (custno !== v.custno.trim()){
              this.$mvc.MDialog.show({
                title: "错误",
                titleIcon: "error",
                message: "客户编码（" + v.custno.trim() + "）不相同，不能同时关联！",
                showCancel: false
              });
              return;
            }
          }
        }

        if(count > 0){
          this.showDialog = true;

          if (this.savetype === "amno"){
            for(let [i, v] of this.multipleSelection.entries()) {
              this.no = v.no4?v.no4.trim():"";
              this.price = Number(v.total1?v.total1.trim():"");
              this.total4 = Number(v.total4?v.total4.trim():"");
              this.note = v.note?v.note.trim():"";
              this.cxrq = this.$utilsService.dateFormat(new Date(v.date2.trim()), "yyyy-MM-dd");
            }
          }
        }else{
          this.$mvc.MDialog.show({
            title: "错误",
            titleIcon: "error",
            message: "未勾选任何数据！",
            showCancel: false
          });
          return;
        }
      },

      //关联发票
      save(){
        /* if (this.price.trim().length === 0){
          this.$mvc.MDialog.show({
            title: "错误",
            titleIcon: "error",
            message: "发票金额不能为空！",
            showCancel: false
          });
          return;
        } */

        let that = this;
        this.$mvc.MDialog.show({
					title: "提示",
					titleIcon: "mdi-information-outline",
					message: "确定执行该操作吗？",
					onCancel() {},
					onConfirm: async function() {

            let custno = "";
            let fjhao = "", no1s = "", nos = "";
            let dataList2 = [];

            for(let [i, v] of this.multipleSelection.entries()){
              if (custno === ""){
                if (this.savetype === "amno" || this.savetype === "no"){
                  custno = v.supplyid?v.supplyid.trim():"";
                }else if (this.savetype === "no1"){
                  custno = v.custno?v.custno.trim():"";
                  //custno=StringUtils.trim(map.get("supplyid")+"");//南宁妇幼医院要求用supplyId
                }
              }
              if(this.savetype === "amno"){
                if(fjhao === "")
                  fjhao = v.no3?v.no3.trim():"";
              }

              let no1 = v.no1?v.no1.trim():"";
              let no = v.no?v.no.trim():"";
              if(no1.length > 0)
                no1s += "!" + no1 + "!,";
              if(no.length > 0)
                nos += "\"" + no + "\",";
            }
            if (custno.trim().length === 0){
              this.$mvc.MDialog.show({
                title: "错误",
                titleIcon: "error",
                message: "custno不能为空！",
                showCancel: false
              });
              return;
            }

            let param = {}
            if (this.savetype === "amno"){
              if (fjhao.trim().length == 0){
                this.$mvc.MDialog.show({
                  title: "错误",
                  titleIcon: "error",
                  message: "附件号不能为空！",
                  showCancel: false
                });
                return;
              }
              
              param.gcode = "D";
              param.bank = "D";
              param.no2 = fjhao;//附件号
            }else{
              param.gcode = "";
              param.bank = "";
              param.no2 = "";

              let param2 = {}
              if(this.savetype === "no"){
                param2.code = nos.substr(0, nos.length - 1);
                param2.mark = "a.no";
              }else if(this.savetype === "no1"){
                param2.code = no1s.replace(new RegExp("!", 'g'), "\"").substr(0, no1s.length - 1);
                param2.mark = "a.no1";
              }

              param2.tj = "";
              param2.whsid = "hmis_gg_01";
              param2.appProject = "erp";
              param2.appVersion = "hmis_gg_01";
              this.$mvc.MDialog.show({
                message: "数据处理中...",
                type: "loading"
              });
              var resultData = await this.$commonService.executeService("spdService", "doInvCheck", param2, false)
              this.$mvc.MDialog.hide(); //隐藏加载框
              if(!resultData || resultData.resultKey == "-1") {
                this.$mvc.MDialog.show({
                  title: "失败",
                  titleIcon: "error",
                  message: resultData ? resultData.resultMessage : "未知错误！",
                  showCancel: false
                });
                return;
              }else{
                let list = resultData.dataList;//得到结果集
                if(list.length > 0){
                  let s1 = list[0];
                  let s = s1.message?s1.message.trim():"";
                  if (s.length > 0){
                    this.$mvc.MDialog.show({
                      title: "错误",
                      titleIcon: "error",
                      message: s,
                      showCancel: false
                    });
                    return;
                  }
                }
              }
            }
            
            param.code = "c";
            param.code1 = "c";
            param.custno = custno;
            param.no = this.no.trim();
            param.rmbm = this.userInfo.user_code;
            param.psdcode1 = this.userInfo.user_code;
            param.dept = this.userInfo.dept_id;
            param.comp = "01"//g_param.usr_mess.comp)
            param.total = "";
            param.total1 = this.price;
            param.tcomp = "01";//g_param.usr_mess.tcomp
            param.note = this.note.trim();
            param.total2 = "";
            param.total4 = this.total4;
            param.date1 ="";//制单日期
            param.date2 = this.$utilsService.dateFormat(this.cxrq,"MM-dd-yyyy");//发票日期
            param.appProject = "erp";
            param.appVersion = "hmis_gg_01";
            
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
                message: resultData ? resultData.resultMessage : "未知错误！",
                showCancel: false
              });
              return;
            } else {
              dataList2 = resultData.dataList;//得到结果集
            }

            if (this.savetype !== "amno"){
              if(dataList2.length > 0){
                let s1 = dataList2[0];
                fjhao = s1.exp1?s1.exp1.trim():"";
                if (fjhao.trim().length === 0 || fjhao ==="-100"){
                  this.$mvc.MDialog.show({
                    title: "错误",
                    titleIcon: "error",
                    message: "附件号生成失败！",
                    showCancel: false
                  });
                  return;
                }
              }
            }
            if (this.savetype === "no"){
              for(let [i, v] of this.multipleSelection.entries()){
                let qty = v.qty?v.qty.trim():"";
                let convertrate = v.convertrate?v.convertrate.trim():"";
                let price = v.price?v.price.trim():"";
                let param3 = {
                  code: "",
                  no2: fjhao,
                  no: "",
                  price: "",
                  qty: Number(qty) * Number(convertrate),
                  total: Number(qty) * Number(price),
                  seri: v.acctseri?v.acctseri.trim():"",

                  appProject: "erp",
                  appVersion: "hmis_gg_01",
                }

                this.$mvc.MDialog.show({
                  message: "数据处理中...",
                  type: "loading"
                });
                var resultData = await this.$commonService.executeService("erpService", "doYwhlgl90i", param3, false)
                this.$mvc.MDialog.hide(); //隐藏加载框
                if (!resultData || resultData.resultKey == "-1") {
                  this.$mvc.MDialog.show({
                    title: "失败",
                    titleIcon: "error",
                    message: resultData ? resultData.resultMessage : "未知错误！",
                    showCancel: false
                  });
                  return;
                } 

              }
            }else if(this.savetype === "no1"){
              no1s = no1s.substr(0, no1s.length - 1);//去掉最后一个逗号
              let param4 = {
                mark: "",
                no2: fjhao,
                cxtj: no1s,

                appProject: "erp",
                appVersion: "hmis_gg_01",
              }
              this.$mvc.MDialog.show({
                message: "数据处理中...",
                type: "loading"
              });
              var resultData = await this.$commonService.executeService("erpService", "doYwhlgl90i2", param4, false)
              this.$mvc.MDialog.hide(); //隐藏加载框
              if (!resultData || resultData.resultKey == "-1") {
                this.$mvc.MDialog.show({
                  title: "失败",
                  titleIcon: "error",
                  message: resultData ? resultData.resultMessage : "未知错误！",
                  showCancel: false
                });
                return;
              }
            }

            let that2 = this;
            this.$mvc.MDialog.show({
              title: "提示",
              titleIcon: "mdi-information-outline",
              message: "操作成功！",
              onConfirm: function() {
                this.doSearch();
                this.showDialog = false;
              }.bind(that2)
            })

          }.bind(that)
        })

      },

      //删除发票附件
      deleteAmno(){
        if(this.multipleSelection.length > 0){
          let count = 0;
          let no4 = "";
          let date3 = "";
          for(let [i, v] of this.multipleSelection.entries()) {
            count++;
            no4 = v.no4.trim(); 
            date3 = v.date3.trim();
            this.no3 = v.no3.trim();
          }
          if (count >1){
            this.$mvc.MDialog.show({
              title: "错误",
              titleIcon: "error",
              message: "操作失败，只能勾选一条数据！",
              showCancel: false
            });
            return;
          }
          //是否只能删除当天的附件
          let isdeltoday = "";
          if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.isdeltoday)) {
            isdeltoday = this.menuInfo.params.isdeltoday;
          }
          if (isdeltoday == "true"){
            if (date3 != this.$utilsService.dateFormat(new Date(), "MM/dd/yyyy")){
              this.$mvc.MDialog.show({
                title: "错误",
                titleIcon: "error",
                message: "操作失败，只能删除当天的附件！",
                showCancel: false
              });
              return;
            }
          }
          if (no4.trim().length > 0){
            this.$mvc.MDialog.show({
              title: "错误",
              titleIcon: "error",
              message: "操作失败，已经关联发票号码，不能删除！",
              showCancel: false
            });
            return;
          }

          let that = this;
          this.$mvc.MDialog.show({
            title: "提示",
            titleIcon: "mdi-information-outline",
            message: "确定执行该操作吗？",
            onCancel() {},
            onConfirm: async function() {
              let param = {
                no3: this.no3.tirm(),
                mark: "0",

                appProject:"dtc",
                appVersion:"hmis_gg_01"
              }
              //显示加载框
              this.$mvc.MDialog.show({
                message: "数据处理中...",
                type: "loading"
              });
              var resultData = await this.$commonService.executeService("spdService", "deleteAmList", param, false)
              this.$mvc.MDialog.hide(); //隐藏加载框
              if (!resultData || resultData.resultKey == "-1") {
                this.$mvc.MDialog.show({
                  title: "失败",
                  titleIcon: "error",
                  message: resultData ? "删除失败！" + resultData.resultMessage : "未知错误！",
                  showCancel: false
                });
              } else {
                let that = this;
                this.$mvc.MDialog.show({
                  title: "提示",
                  titleIcon: "mdi-information-outline",
                  message: "删除成功！",
                  onConfirm: function() {
                    this.doSearch();
                  }.bind(that)
                })
              }
            }.bind(that)
          })

        }else{
          this.$mvc.MDialog.show({
            title: "错误",
            titleIcon: "error",
            message: "操作失败，未勾选任何数据！",
            showCancel: false
          });
          return;
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
            this.$exportExcel('outTable', menuName + '汇总');//outTable 为表格的id
            this.currentPage = currentPage;
            this.pagesize = pagesize; //再恢复回每页10条数据
          })
        }else if(this.active == 1){//在第二个tab标签页时导出第二个tab标签页的表格
          this.$nextTick(()=>{
            this.$exportExcel('outTable2', menuName + this.label);
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

    }
  };
</script>
<style>
 .v-textarea.v-text-field--enclosed.v-text-field--outlined textarea {
   /* 使用id选择器不生效，没时间继续测试，暂时默认修改整个项目内textarea的margin-top: 0px 
      等以后其他页面使用到发现问题再回来修改重新测试*/
    margin-top: 4px !important; 
  }
</style>