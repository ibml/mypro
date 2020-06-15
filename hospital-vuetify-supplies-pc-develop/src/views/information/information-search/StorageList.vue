<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-0 pb-2">
        <v-card class="pa-2" outlined tile>
          <v-row align-content="center" justify="center">
            <v-col cols="2" class="py-1">
              <v-text-field outline hide-details label="货位号"  v-model="whplc" ></v-text-field>
            </v-col>
            <v-col cols="2" class="py-1">
              <v-text-field outline hide-details label="商品编码"  v-model="gcode" ></v-text-field>
            </v-col>
            <v-col cols="2" class="py-1">
              <v-text-field outline hide-details label="卡号"  v-model="invno" ></v-text-field>
            </v-col>
            <v-col cols="2" class="py-1">
              <v-text-field outline hide-details label="批号"  v-model="batchnum" ></v-text-field>
            </v-col>
            <v-col align-self="center" class="py-1">
              <v-btn depressed color="primary" class="mx-2" @click="doSearch">
                <v-icon medium>mdi-magnify</v-icon> 查询
              </v-btn>
              <v-btn depressed color="green" class="white--text" @click="excel()">
                <v-icon medium>mdi-file-excel</v-icon> 导出Excel
              </v-btn>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="3" class="py-1">
              <v-select :items="deptItems" v-model="deptId" label="库存地点" item-text="deptname" item-value="treecode"
                append-icon="mdi-chevron-down" required hide-details no-data-text="无数据" ></v-select>
            </v-col>
            <v-col cols="3" class="py-1">
              <v-select :items="supplyItems" v-model="supplyId" label="供应商" item-text="supply" item-value="supplyid"
                append-icon="mdi-chevron-down" required hide-details no-data-text="无数据" ></v-select>
            </v-col>
            <v-col cols="3" class="text-center py-1" align-self="center">
              <v-select :items="typeItems" v-model="typeId" label="类型" item-text="text" item-value="id"
                append-icon="mdi-chevron-down" required hide-details no-data-text="无数据"></v-select>
            </v-col>
          </v-row>
          <!-- <v-row>
            <v-col clos="2" class="py-1">
              <v-checkbox v-model="checkbox1" hide-details label="按匹配关系显示所有商品" required ></v-checkbox>
            </v-col>
          </v-row> -->
          <v-row  justify="start" align="start">
            <v-col cols="3" class="py-1">
              <v-checkbox v-model="checkbox1" hide-details label="按匹配关系显示所有商品" required ></v-checkbox>
            </v-col>
            <v-col cols="3" class="py-0 mt-1">
              <v-row no-gutters justify="start" align="start">
                <v-col cols="1" class="mr-2">
                  <v-checkbox v-model="checkbox2" hide-details label="" required ></v-checkbox>
                </v-col>
                <v-col cols="2">
                  <v-select class="ma-0" :items="twelve" v-model="checkboxId2" 
                append-icon="mdi-chevron-down" required hide-details ></v-select>
                </v-col>
                <v-col align-self="center" justify-self="center" class="pt-4">
                  <span>个月内过期</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="3" class="py-0 mt-1">
              <v-row no-gutters justify="start" align="start">
                <v-col cols="4">
                  <v-checkbox v-model="checkbox3" hide-details label="已滞销" required ></v-checkbox>
                </v-col>
                <v-col cols="2">
                  <v-select class="ma-0" :items="twelve2" v-model="checkboxId3" 
                append-icon="mdi-chevron-down" required hide-details  ></v-select>
                </v-col>
                <v-col align-self="center" justify-self="center" class="pt-4">
                  <span>个月</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-card outlined tile>
      <v-row class="ma-0">
        <v-col cols="3" class="pt-1">
          <v-text-field hide-details label="快速过滤" append-icon="mdi-magnify" v-model="search"></v-text-field>
        </v-col>
      </v-row>

      <el-table id="outTable" :data="tables" :height="tableHeight +'px'" style="width: 100%;" stripe border
        >
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
  </div>
</template>
<script>
  /**
   * 仓库库存查询
   */
  var debounce = require("lodash/debounce"); //使用lodash的深度复制对象方法

  export default {
    name: "StorageList",
    data() {
      return {
        userInfo: this.$authenticationService.getCurrentUser().userInfo,
        menuInfo: {},

        items: [], //结果集
        items2: [],

        whplc: "",
        gcode: "",
        invno: "",
        batchnum: "",

        checkbox1: false,
        checkbox2: false,
        checkbox3: false,

        twelve: [1,2,3,4,5,6,7,8,9,10,11,12],
        twelve2: [1,2,3,4,5,6,7,8,9,10,11,12],
        checkboxId2: 3,
        checkboxId3: 3,

        gridColumns: [], //显示列
        deptItems: [], 
        deptId: "",
        supplyItems: [],
        supplyId: "",
        typeItems: [{id:"0012",text:"全部"},{id:"006",text:"冻结"},{id:"005",text:"库存单价不唯一"},{id:"007",text:"单价与来货不一致"}],
        typeId: "",

        pagesize: 10, //每页总数
        currentPage: 1, //页码

        tableHeight: document.documentElement.clientHeight - 328-52-36, //第一个表格的高度

        filterSearch: '', //快速过滤搜索
        search: "",      //快速过滤搜索

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
        this.gridColumns = this.$utilsService.initVuetifyColumnConfig(//默认菜单
          this.menuInfo.columns_config
        ); 

        /* 从菜单中拿到isSpd参数 */
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.isSpd)) {
          let isSpd = this.menuInfo.params.isSpd;
          if(isSpd == "true"){
            this.getDept();
            this.typeId = "0012";
          }
        }
        this.getSupply();
      },

      //获取库存地点下拉列表
      async getDept() {
        let tj = " and no1  in ('a','b','c') ";
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.select_tj)) {
          tj = this.menuInfo.params.select_tj;//菜单传入tj参数
        }
        this.param = {
          mark: "1",
          tj: tj,
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
          list.unshift({treecode:"",deptname:"全部"});//数组前面加入一个对象
          this.deptItems = list;
        }
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

      //查询
      async doSearch() {
        this.items = [];//清空第一个列表
        
        let sqlstr = "";
        if(this.invno.trim().length > 0){
          sqlstr += " and t2.attribute1='" + this.invno.trim() + "'";      
        }
        if(this.gcode.trim().length > 0){
          if(checkbox1)
            sqlstr += " and t2.itemid in(select gcode from e_goods where gcode_h in(select gcode_h from e_goods where  length(gcode_h)>0 and gcode='" + this.gcode.trim() + "'))";
          else
            sqlstr += " and t2.itemid='" + this.gcode.trim() + "'";
        }
        if(this.batchnum.trim().length > 0){
          sqlstr += " and t4.batchnum='" + this.batchnum.trim() + "'";     
        }
        if(this.deptId.trim().length > 0){
          sqlstr += " and t2.treecode like '" + this.deptId.trim() + "%' ";
        }
        if(this.supplyId.trim().length > 0){
          sqlstr += " and t5.custno= '" + this.supplyId.trim() + "'";
        }
        if(this.checkbox2){
          let date3 =  this.$utilsService.dateFormat(this.$utilsService.getBeforeDate(-this.checkboxId2*30),"MM-dd-yyyy")
          sqlstr += " and t5.date3 <= '" + date3 + "' ";
        }
        if(this.checkbox3){
          let days =  this.checkboxId3*30;
          sqlstr += " and t5.no not in(select distinct invno from acct where date1>=today-" + days + " and code='c') and t5.date1<=today- " + days;
        }

        let param = {
          mark: this.typeId,
          querySql: sqlstr,
          comp: "01",
          dept: "",    
          kh: "",
          sp: "01",
          whplc: "",
          wms_whsid: "hmis_gg_01",
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
        var resultData = await this.$commonService.executeService("wmsQureyService", "getCtnInfo", param, true)
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
        this.pagesize = this.items.length; //显示完所有数据

        this.$nextTick(() => {
          this.$exportExcel("outTable", menuName); //outTable 为表格的id
          this.currentPage = currentPage;
          this.pagesize = pagesize; //再恢复回每页10条数据
        });
      },

      formatOne(row, column) {
        let meunCol = this.gridColumns.filter((item)=>{
          return item.value == column.property;
        });
        return  this.$utilsService.formatterExpression(row, column, meunCol);
      },

    }
  };
</script>