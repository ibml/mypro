<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-0 pb-2">
        <v-card class="pa-2" outlined tile>
          <v-row align-content="center" justify="center">
            <v-col cols="2" class="py-0">
              <v-text-field outline hide-details label="商品编码" v-model="gcode" ></v-text-field>
            </v-col>
            <v-col cols="2" class="py-0">
              <v-select :items="typeItems" v-model="typeId" label="类型" item-text="text" item-value="code"
                append-icon="mdi-chevron-down" required hide-details no-data-text="无数据"></v-select>
            </v-col>
            <v-col align-self="center" class="py-0">
              <v-btn depressed color="primary" class="mx-2" @click="doSearch">
                <v-icon medium>mdi-magnify</v-icon> 查询
              </v-btn>
              <v-btn depressed color="teal" class="white--text mr-2" @click="add()">
                <v-icon medium>mdi-plus</v-icon> 新增
              </v-btn>
              <v-btn depressed color="cyan" class="white--text mr-2" @click="edit()">
                <v-icon medium>mdi-pencil</v-icon> 编辑
              </v-btn>
              <v-btn depressed color="green" class="white--text" @click="excel()">
                <v-icon medium>mdi-file-excel</v-icon> 导出Excel
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-card outlined tile >
      <v-row class="ma-0">
        <v-col cols="3" class="pt-1">
          <v-text-field hide-details label="快速过滤" append-icon="mdi-magnify" v-model="search"></v-text-field>
        </v-col>
      </v-row>

      <el-table id="outTable" :data="tables" :height="tableHeight +'px'" style="width: 100%;" stripe border
        highlight-current-row @current-change="handleCurrentChange2">
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

    <v-dialog v-model="showDialog" persistent scrollable max-width="900" >
      <v-card >
        <!-- <v-card-tilte>
          <span>商品信息维护</span>
        </v-card-tilte> -->
        <v-card-title class="pa-0">
          <v-toolbar>
            <v-toolbar-title><span>商品信息维护  - {{this.saveType === "edit"?"编辑":"新增"}}</span> </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showDialog = false">
              <v-icon color="red" >mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-form ref="form2" lazy-validation>
          <v-row >
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">商品编码：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.gcode" :rules="[	v => !!v || '商品编码 不能为空。']" :disabled="isDisabled"></v-text-field>
            </v-col>
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">商品名称：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.gname" :rules="[	v => !!v || '商品名称 不能为空。']" :disabled="isDisabled"></v-text-field>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="2" class="pa-0">
              <div style="float:right">
                <v-subheader class="pt-3">商品ID：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.seri" :disabled="isDisabled"></v-text-field>
            </v-col>
            <v-col cols="2" class="pa-0">
              <div style="float:right">
                <v-subheader class="pt-3">通用名：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.gname1" :disabled="isDisabled"></v-text-field>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">厂商编码：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.produrceid" :rules="[	v => !!v || '厂商编码 不能为空。']" :disabled="isDisabled"></v-text-field>
            </v-col>
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">厂商名称：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.produrce" :rules="[	v => !!v || '厂商名称 不能为空。']" :disabled="isDisabled"></v-text-field>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">转换系数：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.pack" :rules="[	v => !!v || '转换系数 不能为空。']" :disabled="isDisabled"></v-text-field>
            </v-col>
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">剂型：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.type" :disabled="isDisabled"></v-text-field>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">最小单位：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.unit" :rules="[	v => !!v || '最小单位 不能为空。']" :disabled="isDisabled"></v-text-field>
            </v-col>
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">规格：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.spn" :rules="[	v => !!v || '规格 不能为空。']" :disabled="isDisabled"></v-text-field>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">包装单位：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.caseunit" :rules="[	v => !!v || '包装单位 不能为空。']" :disabled="isDisabled"></v-text-field>
            </v-col>
            <v-col cols="2" class="pa-0">
              <div style="float:right">
                <v-subheader class="pt-3">配送商名称：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-select :items="supplyItems" v-model="supplyId" item-text="supply" item-value="supplyid"
                append-icon="mdi-chevron-down" required hide-details no-data-text="无数据" @change="supplyChange"></v-select>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">零售单价：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.price1" :disabled="isDisabled"></v-text-field>
            </v-col>
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">购进单价：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.price" :disabled="isDisabled"></v-text-field>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="2" class="pa-0">
              <div style="float:right">
                <v-subheader class="pt-3">批准文号：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.lice" :disabled="isDisabled"></v-text-field>
            </v-col>
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">使用状态：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-select :items="typeItems2" v-model="typeId2" item-text="text" item-value="code"
                append-icon="mdi-chevron-down" required no-data-text="无数据" 
                :rules="[	v => !!v || '使用状态 不能为空。']"></v-select>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="2" class="pa-0">
              <div style="float:right">
                <v-subheader class="pt-3">助记码：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.zjm" :disabled="isDisabled"></v-text-field>
            </v-col>
            <v-col cols="2" class="pa-0">
              <div style="float:right">
              <v-subheader class="pt-3">中标号：</v-subheader>
              </div>
            </v-col>
            <v-col cols="4" class="pa-0">
              <v-text-field v-model="goodsInfo.zbh" ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed color="light-blue accent-3" class="white--text" @click="save">
            <v-icon medium>mdi-content-save</v-icon>保 存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </div>
</template>
<script>
  /**
   * 医院商品编码维护
   */
  var debounce = require("lodash/debounce"); //使用lodash的深度复制对象方法

  export default {
    name: "HospitalGoodsList",
    data() {
      return {
        userInfo: this.$authenticationService.getCurrentUser().userInfo,
        menuInfo: {},

        items: [], //结果集
        currentRow: [], //选中行集合

        gridColumns: [], //显示列
        typeItems: [],
        typeId: "",
        typeItems2: [],
        typeId2: "",
        gcode: "",
        showDialog: false,
        goodsInfo:{
          barcode: "",
          caseunit: "",
          flag: "",
          gcode: "",
          gname: "",
          gname1: "",
          hzname: "",
          hzno: "",
          lice: "",
          pack: "",
          price: "",
          price1: "",
          produrce: "",
          produrceid: "",
          putdate: "",
          putname: "",
          seri: "",
          spn: "",
          status: "",
          type: "",
          unit: "",
          zbh: "",
          zjm: "",
        },
        
        saveType:"",
        supplyItems: [],
        supplyId: "",
        supply: "",
        isDisabled: false,

        pagesize: 10, //每页总数
        currentPage: 1, //页码

        tableHeight: document.documentElement.clientHeight - 300, //第一个表格的高度

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

        /* 从菜单获取statusSelect */
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.statusSelect)) {
          let statusSelect = this.menuInfo.params.statusSelect;
          let a = statusSelect.trim().split('|');
          let item = []
          for (let i = 0; i < a.length; i++){
            let b = a[i].split('-');
            let c = {}
            c["code"] = b[0];
            c["text"] = b[1];
            item.push(c);
          }
          this.typeItems2 = item;
          this.typeItems = JSON.parse(JSON.stringify(item))
          this.typeItems.unshift({code:"",text:"全部"});
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
        }
      },

      //汇总查询
      async doSearch() {
        this.items = [];//清空第一个列表
        
        let param = {
          wms_whsid: "hmis_gg_01",
          gcode: this.gcode.trim()?this.gcode.trim():"",
          sqlstr: this.typeId.trim()?` and status = '${this.typeId.trim()}'`:"",
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
        var resultData = await this.$commonService.executeService("hisService", "getGoodsList", param, false)
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

      add() {
        this.showDialog = true;
        this.$nextTick(()=>{
          this.$refs.form2.reset();//禁止校验清空数据
          this.saveType = "add";
          this.isDisabled = false;
        })
      },

      edit() {
        if(this.currentRow.length == 0){
          return;
        }
        this.showDialog = true;
        this.$nextTick(()=>{
          this.saveType = "edit";
          this.isDisabled = true;
          this.$refs.form2.reset();
        })
        
        this.doSearch2(this.currentRow.seri);
      },

      async doSearch2(seri) {
        let sqlstr = "";

        let param = {
          gcode: "",
          sqlstr: " and seri = '" + seri + "'",
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
        var resultData = await this.$commonService.executeService("hisService", "getGoodsList", param, true)
        this.$mvc.MDialog.hide(); //隐藏加载框
        if (!resultData || resultData.resultKey == "-1") {
          this.$mvc.MDialog.show({
            title: "失败",
            titleIcon: "error",
            message: resultData ? resultData.resultMessage : "未知错误！",
            showCancel: false
          });
        } else {
          this.$nextTick(() => {
            this.goodsInfo = JSON.parse(JSON.stringify(resultData.dataList[0]));
            this.typeId2 = this.goodsInfo.status.trim();
            this.supplyId = this.goodsInfo.hzno.trim();
            this.supplyChange();
          })
          
        }
      },

      //当下拉框改变时
      supplyChange(){
        const newArr = this.supplyItems.filter((item)=> {//过滤获取到当前选中的数组
          return item.supplyid.trim() == this.supplyId.trim();
        })
        this.supply = newArr[0].supply.trim();
      },

      save(){
        //表单验证
        if (!this.$refs.form2.validate()) {
          //验证未通过
          return;
        }
        let that = this;
        this.$mvc.MDialog.show({
					title: "提示",
					titleIcon: "mdi-information-outline",
					message: "确定保存数据吗？",
					onCancel() {},
					onConfirm: async function() {
            let param = {
              oper: this.userInfo.user_code,
              gcode: this.goodsInfo.gcode?this.goodsInfo.gcode.trim():"",
              gname: this.goodsInfo.gname?this.goodsInfo.gname.trim():"",
              gname1: this.goodsInfo.gname1?this.goodsInfo.gname1.trim():"",
              spn: this.goodsInfo.spn?this.goodsInfo.spn.trim():"",
              type: this.goodsInfo.type?this.goodsInfo.type.trim():"",
              produrceid: this.goodsInfo.produrceid?this.goodsInfo.produrceid.trim():"",
              produrce: this.goodsInfo.produrce?this.goodsInfo.produrce.trim():"",
              lice: this.goodsInfo.lice?this.goodsInfo.lice.trim():"",
              unit: this.goodsInfo.unit?this.goodsInfo.unit.trim():"",
              caseunit: this.goodsInfo.caseunit?this.goodsInfo.caseunit.trim():"",
              pack: this.goodsInfo.pack?this.goodsInfo.pack.trim():"",
              zjm: this.goodsInfo.zjm?this.goodsInfo.zjm.trim():"",
              barcode: this.goodsInfo.barcode?this.goodsInfo.barcode.trim():"",//药品类型
              status: this.typeId2.trim(),//使用状态
              wms_whsid: "hmis_gg_01",
              price: this.goodsInfo.price?this.goodsInfo.price.trim():"",
              price1: this.goodsInfo.price1?this.goodsInfo.price1.trim():"",
              zbh: this.goodsInfo.zbh?this.goodsInfo.zbh.trim():"",
              hzno: this.supplyId.trim(),//货主编码
              hzname: this.supply.trim(),//货主名称

              appProject:"dtc",
              appVersion:"hmis_gg_01"
            }
            //显示加载框
            this.$mvc.MDialog.show({
              message: "数据处理中...",
              type: "loading"
            });
            var resultData = await this.$commonService.executeService("spdService", "addHisGoods", param, false)
            this.$mvc.MDialog.hide(); //隐藏加载框
            if (!resultData || resultData.resultKey == "-1") {
              this.$mvc.MDialog.show({
                title: "失败",
                titleIcon: "error",
                message: resultData ? resultData.resultMessage : "未知错误！",
                showCancel: false
              });
            } else {
              let that = this;
              this.$mvc.MDialog.show({
                title: "提示",
                titleIcon: "mdi-information-outline",
                message: "操作成功！",
                onConfirm: function() {
                  this.doSearch();
                  this.showDialog = false;
                }.bind(that)
              })
            }

          }.bind(that)
        })

      },

      handleSizeChange(size) {
        this.pagesize = size;
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage;
      },
      handleCurrentChange2(val) {
        this.currentRow = val;
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