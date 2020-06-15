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
            <v-col cols="2" class="text-center py-0" align-self="center" v-show="isDeptShow">
              <v-select :items="deptItems" v-model="deptId" label="科室" item-text="deptname" item-value="dept"
                append-icon="mdi-chevron-down" required hide-details no-data-text="无数据" @change="deptChange"></v-select>
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
        <v-tab v-show="isTabShow">{{ "单项明细" }}</v-tab>
        <v-tab-item>
          <v-card>
            <v-row v-show="isFilterTableShow" class="ma-0">
              <v-col cols="3" class="pt-1">
                <v-text-field hide-details label="快速过滤" append-icon="mdi-magnify" v-model="search"></v-text-field>
              </v-col>
            </v-row>

            <el-table id="outTable" :data="tables" :height="tableHeight +'px'" style="width: 100%;" stripe border
              @row-dblclick="doSearch2" >
              <el-table-column fixed label="序号" width="60" align="center">
                <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pagesize + 1}}
                  </span></template>
              </el-table-column>
              <template v-for="(col ,index) in gridColumns">
                <el-table-column :label="col.text" :key="index" :prop="col.value" :width="col.width" :formatter="formatOne" >
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
                <template slot-scope="scope"><span>{{scope.$index+(currentPage - 1) * pagesize + 1}}
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
   * 耗材使用科室排名
   */
  import AuthenticationService from '@/services/AuthenticationService';
  var debounce = require("lodash/debounce"); //使用lodash的深度复制对象方法

  export default {
    name: "SPDGeneralReport",
    data() {
      return {
        userInfo: AuthenticationService.getCurrentUser().userInfo,
        menuInfo: {},

        items: [], //结果集
        items2: [],

        gridColumns: [], //显示列
        gridColumns2: [],
        deptItems: [], //科室下拉列表
        deptId: "all", //科室下拉列表绑定的值
        date1: this.$utilsService.dateFormat(new Date(), "yyyy-MM-dd"),
        date2: this.$utilsService.dateFormat(new Date(), "yyyy-MM-dd"),
        dateMenu1: false,
        dateMenu2: false,

        mark: "",
        mark2: "",
        interfacename: "", //菜单传入接口名称
        treecode: "A00000000000A",
        dept: "A00000000000A",
        custno: "A00000000000A",
        no1: "a",

        pagesize: 10, //每页总数
        currentPage: 1, //页码
        pagesize2: 10,
        currentPage2: 1,

        active: 0, //绑定的tab标签页下标
        isTabShow: false, //是否显示第二个标签页
        isDeptShow: false, //是否显示科室列表
        //表格的高度(这里默认给浏览器可视区高度 - 表格以上部分的高度)
        tableHeight: document.documentElement.clientHeight - 304, //第一个表格的高度
        tableHeight2: document.documentElement.clientHeight - 252, //第二个表格的高度

        filterSearch: '', //快速过滤搜索
        search: "",      //快速过滤搜索
        isFilterTableShow: true, //是否显示快速过滤

        multipleSelection: [] //用于存储选中行数据的集合

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
        }, 1200)
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
        if(this.menuInfo.params.mark){
          this.mark = this.menuInfo.params.mark; //菜单中获取mark赋值
        }
        if(this.menuInfo.params.mark2){
          this.mark2 = this.menuInfo.params.mark2;
        }
        if(this.menuInfo.params.interfacename){
          this.interfacename = this.menuInfo.params.interfacename;
        }
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

        /* 判断 科室列表是否显示 dept=true */
        let menuDept = "";
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.dept)) {
          menuDept = this.menuInfo.params.dept;//菜单传入dept参数
        }
        if (menuDept == "true"){
          this.isDeptShow = true;//显示科室列表
          this.getSelect();
        }else{
          this.isDeptShow = false;//隐藏科室列表
        }

        /* 判断第二个tab标签页面是否显示 */
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.tabPages)) {
          let tabPages = this.menuInfo.params.tabPages;
          if(tabPages != "2"){
            this.isTabShow = false;
          }else{
            this.isTabShow = true;
          }
        }

        /* 判断 快速过滤 是否显示*/
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.panel1)) {
          let panel1 = this.menuInfo.params.panel1;
          if(panel1 == "true"){
            this.isFilterTableShow = true;
            this.tableHeight = this.tableHeight - 60;//减去'快速过滤'输入框高度
          }else{
            this.isFilterTableShow = false;
          }
        }
      },

      //获取科室下拉列表
      async getSelect() {
        let deptSqltj = "";
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.deptSqltj)) {
          deptSqltj = this.menuInfo.params.deptSqltj;//菜单传入tj参数
        }
        this.param = {
          mark: "1",
          tj: deptSqltj,
          whsid: "hmis_gg_01",
          appProject:"dtc",
          appVersion:"hmis_gg_01"
        };
        
        var resultData = await this.$commonService.executeService("dtcService", "getDept", this.param, true)
        
        if (!resultData || resultData.resultKey == '-1') {
          this.$mvc.MDialog.show({
            title: "失败",
            titleIcon: "error",
            message: resultData ? resultData.resultMessage : "未知错误！",
            showCancel: false
          });
        } else {
          let list = resultData.dataList;
          list.unshift({dept:"all",deptname:"全部"});//数组前面加入一个对象
          this.deptItems = list;
        }
        
        //获取菜单传入limitDept参数
        let limitDept = "";
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.limitDept)) {
          limitDept = this.menuInfo.params.limitDept;
          if(limitDept == "true"){
            this.deptId = this.userInfo.dept_id;
          }
        }
      },

      //当下拉框改变时
      deptChange(){
        const newArr = this.deptItems.filter((item)=> {//过滤获取到当前选中的数组
          return item.dept.trim() == this.deptId.trim();
        })
        if(newArr.length){
          this.treecode = newArr[0]["treecode"]?newArr[0]["treecode"].trim():"";
          this.dept = newArr[0]["dept"]?newArr[0]["dept"].trim():"";
          this.custno = newArr[0]["custno"]?newArr[0]["custno"].trim():"";
          this.no1 = newArr[0]["no1"]?newArr[0]["no1"].trim():"";
        }
        else
        {
          this.treecode = "";
          this.dept = "";
          this.custno = "";
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
        let menuDept = "";
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.sqltj)) {
          sqlstr = this.menuInfo.params.sqltj;//菜单传入sqltj参数
        }
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.dept)) {
          menuDept = this.menuInfo.params.dept;//菜单传入dept参数
        }

        if (menuDept == "true")
        {
          if (this.deptId == "all")
          {
            sqlstr = "";
          }
          else
          {
            sqlstr = sqlstr.replace("AAAA", this.dept);
          }
        }

        let param = {
          pkgtype: "",
          no: "",
          code: "",
          mark: this.mark,
          date1: this.$utilsService.dateFormat(this.date1,"MM-dd-yyyy"),
          date2: this.$utilsService.dateFormat(this.date2,"MM-dd-yyyy"),
          tj: sqlstr,
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
        var resultData = await this.$commonService.executeService("dtcService", this.interfacename, param, true)
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

      //单据明细查询， 其中item是双击选中行的值
      async doSearch2(item) {
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

        if(!this.isTabShow){//如果不显示第二个标签页则返回
          return;
        }

        this.active = 1;//跳转到第二个tab标签页面
        this.items2 = [];//清空第二个列表
        let r_name0_0 = "";
        let sqlstr = "";
        let sqlstr2 = "";
        let sqlstr3 = "";
        let menuDept = "";
        if(item.name0_0){
          r_name0_0 = item.name0_0.trim();
        }        
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.sqltj2)) {
          sqlstr2 = this.menuInfo.params.sqltj2;//菜单传入sqltj2参数
        }
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.sqltj3)) {
          sqlstr3 = this.menuInfo.params.sqltj3;//菜单传入sqltj3参数
        }
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.dept)) {
          menuDept = this.menuInfo.params.dept;//菜单传入dept参数
        }
        if (menuDept == "true")
        {
          if(this.deptId == "all")
          {
            sqlstr3 = "";
          }
          else
          {
            sqlstr3 = sqlstr3.replace("AAAA", this.dept);
          }
        }
        sqlstr2 = sqlstr2.replace("BBBB", r_name0_0);
        sqlstr = sqlstr3 + sqlstr2;

        let param = {
          pkgtype: "",
          no: "",
          code: "",
          mark: this.mark2,
          date1: this.$utilsService.dateFormat(this.date1,"MM-dd-yyyy"),
          date2: this.$utilsService.dateFormat(this.date2,"MM-dd-yyyy"),
          tj: sqlstr,
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
        var resultData = await this.$commonService.executeService("dtcService", this.interfacename, param, true)
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
            this.$exportExcel('outTable2', menuName + '单项明细');
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