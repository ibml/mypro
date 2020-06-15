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
              <v-select :items="typeItems" v-model="typeId" label="类型" item-text="text" item-value="code"
                append-icon="mdi-chevron-down" required hide-details no-data-text="无数据"></v-select>
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
              @cell-dblclick="doSearch2">
              <!-- <el-table-column fixed label="序号" width="60" align="center">
                <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pagesize + 1}}
                  </span></template>
              </el-table-column> -->
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
  </div>
</template>
<script>
  /**
   * 物资汇总表查询
   */
  var debounce = require("lodash/debounce"); //使用lodash的深度复制对象方法

  export default {
    name: "DeviceInOutStockList",
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
        date1: this.$utilsService.dateFormat(new Date(), "yyyy-MM-dd"),
        date2: this.$utilsService.dateFormat(new Date(), "yyyy-MM-dd"),
        dateMenu1: false,
        dateMenu2: false,

        pagesize: 10, //每页总数
        currentPage: 1, //页码
        pagesize2: 10,
        currentPage2: 1,

        active: 0, //绑定的tab标签页下标
        isTabShow: false, //是否显示第二个标签页
        //表格的高度(这里默认给浏览器可视区高度 - 表格以上部分的高度)
        tableHeight: document.documentElement.clientHeight - 300, //第一个表格的高度
        tableHeight2: document.documentElement.clientHeight - 252, //第二个表格的高度

        filterSearch: '', //快速过滤搜索
        search: "",      //快速过滤搜索
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
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.codeSelect)) {
          let codeSelect = this.menuInfo.params.codeSelect;
          let a = codeSelect.trim().split('|');
          for (let i = 0; i < a.length; i++){
            let b = a[i].split('-');
            let c = {}
            c["code"] = b[0];
            c["text"] = b[1];
            this.typeItems.push(c);
          }
          this.typeId = this.typeItems[0].code.trim();
        }

        /* 判断第二个tab标签页面是否显示 */
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.show)) {
          let show = this.menuInfo.params.show;
          if(show == "true"){
            this.isTabShow = true;
          }else{
            this.isTabShow = false;
          }
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
          list.unshift({supplyid:"",supply:"全部"});//数组前面加入一个对象
          this.supplyItems = list;
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
        }
        if(this.supplyId.trim().length > 0){
          sqlstr += " and b.custno='" + this.supplyId.trim() + "'";
        }

        let param = {
          mark: this.typeId,
          rq1: this.$utilsService.dateFormat(this.date1,"MM-dd-yyyy"),
          rq2: this.$utilsService.dateFormat(this.date2,"MM-dd-yyyy"),
          tj: sqlstr,
          operid: this.userInfo.user_code,
          custno: "",
          dept: "",
          whsid: "hmis_gg_01",
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
        var resultData = await this.$commonService.executeService("dtcService", "getBiCrkhz", param, true)
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
        let subNum = column.property.substring(6);//获取 后面的数字  values7 ==> 7
        let names = "name" + subNum; //name7
        let code = row.code.trim();
        let codeName = row.name.trim();
        let headerText = column.label;

        let values = "";
        let strType = "";
        if (code.length > 0){//不属于[合计]行
          values = row[names];//获取当前双击列头为name7中的单元格的值（注意：显示列必须有该字段,比如显示列中有value42，那么显示列中必须得加上name42字段）
          if (this.typeId == "0")
              strType = " and a.ref_dept_code='" + code + "'";
          if (this.typeId == "1")
              strType = " and a.supply_code='" + code + "'";
        }else{
          values = row[names];
        }

        let sqlStr = " and a.settle_date>='" + this.$utilsService.dateFormat(this.date1,"yyyy-MM-dd") + "'" +
                    " and a.settle_date<='" + this.$utilsService.dateFormat(this.date2,"yyyy-MM-dd") + "'" +
                    " and nvl((select max(b.barcode) from e_hisgoods b where b.drug_code=a.item_id),'wfl') like '" + values + "%'" +
                    strType;

        let hospital = "";
        let query = "";
        let work = "";
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.hospital)) {
          hospital = this.menuInfo.params.hospital;
        }
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.query)) {
          query = this.menuInfo.params.query;
        }
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.work)) {
          work = this.menuInfo.params.work;
        }
        if(hospital == "172"){ //暂时只用在桂东医院172，   04/01/2019
          sqlStr += query;
          if(this.supplyId.trim().length > 0){
            sqlStr += " and b.custno='" + this.supplyId.trim() + "'";
          }
        }

        if(!this.isTabShow){//如果不显示第二个标签页则返回
          return;
        }

        this.active = 1;//跳转到第二个tab标签页面
        this.items2 = [];//清空第二个列表

        let param = {
          work: work,
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
          if(code.trim().length == 0)
            this.label = "[合 计]：" + headerText + "明细";//[合计]：一般医用材料明细
          else
            this.label = codeName.trim() + "：" + headerText + "明细";//保健科门诊：一般医用材料明细
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