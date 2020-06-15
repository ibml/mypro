<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-0 pb-2">
        <v-card class="pa-2" outlined tile>
          <v-row align-content="center" justify="center">
            <v-col cols="3" class="text-center py-0" align-self="center">
              <v-select :items="supplyItems" v-model="supplyId" label="供应商" item-text="supply" item-value="supplyid"
                append-icon="mdi-chevron-down" required hide-details no-data-text="无数据" ></v-select>
            </v-col>
            <v-col align-self="center" class="py-0">
              <v-btn depressed color="primary" class="mx-2" @click="tabsChange">
                <v-icon medium>mdi-file-account</v-icon> 查询
              </v-btn>
              <v-btn depressed color="teal" class="white--text mr-2" @click="save()">
                <v-icon medium>mdi-file-account</v-icon> 审核
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
        <v-tab>{{ label5 }}</v-tab>
        <v-tab>{{ label6 }}</v-tab>
        <v-tab>{{ label7 }}</v-tab>
        <v-tab-item>
          <v-card>
            <el-table id="outTable" :data="items.slice((currentPage - 1) * pagesize, currentPage * pagesize)" :height="tableHeight +'px'" style="width: 100%;" stripe border
              @cell-dblclick="shwoPic">
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
            <el-table id="outTable2" :data="items2.slice((currentPage2 - 1) * pagesize2, currentPage2 * pagesize2)" :height="tableHeight +'px'" style="width: 100%;" stripe border
              @cell-dblclick="shwoPic" @selection-change="handleSelectionChange2">
              <el-table-column type="selection" width="40" ></el-table-column>
              <el-table-column fixed label="序号" width="60" align="center">
                <template slot-scope="scope"><span>{{scope.$index+(currentPage2 - 1) * pagesize2 + 1}}
                  </span></template>
              </el-table-column>
              <template v-for="(col ,index) in gridColumns2">
                <el-table-column :label="col.text" :key="index" :prop="col.value" :width="col.width" :formatter="formatTwo">
                </el-table-column>
              </template>
            </el-table>
            <v-card-actions align-end justify-end row fill-height class="py-0">
              <v-layout pa-2 align-end justify-end row fill-height>
                <el-pagination @size-change="handleSizeChange2"
                  @current-change="handleCurrentChange2" :current-page="currentPage2"
                  :page-sizes="[5, 10, 20, 50, 100, 200, 500]" :page-size="pagesize2"
                  layout="total, sizes, prev, pager, next" :total="items2.length">
                </el-pagination>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <el-table id="outTable3" :data="items3.slice((currentPage3 - 1) * pagesize3, currentPage3 * pagesize3)" :height="tableHeight +'px'" style="width: 100%;" stripe border
              @cell-dblclick="shwoPic" @selection-change="handleSelectionChange3">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column fixed label="序号" width="60" align="center">
                <template slot-scope="scope"><span>{{scope.$index+(currentPage3 - 1) * pagesize3 + 1}}
                  </span></template>
              </el-table-column>
              <template v-for="(col ,index) in gridColumns3">
                <el-table-column :label="col.text" :key="index" :prop="col.value" :width="col.width" :formatter="formatThree">
                </el-table-column>
              </template>
            </el-table>
            <v-card-actions align-end justify-end row fill-height class="py-0">
              <v-layout pa-2 align-end justify-end row fill-height>
                <el-pagination @size-change="handleSizeChange3"
                  @current-change="handleCurrentChange3" :current-page="currentPage3"
                  :page-sizes="[5, 10, 20, 50, 100, 200, 500]" :page-size="pagesize3"
                  layout="total, sizes, prev, pager, next" :total="items3.length">
                </el-pagination>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <el-table id="outTable4" :data="items4.slice((currentPage4 - 1) * pagesize4, currentPage4 * pagesize4)" :height="tableHeight +'px'" style="width: 100%;" stripe border
              @cell-dblclick="shwoPic" @selection-change="handleSelectionChange4">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column fixed label="序号" width="60" align="center">
                <template slot-scope="scope"><span>{{scope.$index+(currentPage4 - 1) * pagesize4 + 1}}
                  </span></template>
              </el-table-column>
              <template v-for="(col ,index) in gridColumns4">
                <el-table-column :label="col.text" :key="index" :prop="col.value" :width="col.width" :formatter="formatFour">
                </el-table-column>
              </template>
            </el-table>
            <v-card-actions align-end justify-end row fill-height class="py-0">
              <v-layout pa-2 align-end justify-end row fill-height>
                <el-pagination @size-change="handleSizeChange4"
                  @current-change="handleCurrentChange4" :current-page="currentPage4"
                  :page-sizes="[5, 10, 20, 50, 100, 200, 500]" :page-size="pagesize4"
                  layout="total, sizes, prev, pager, next" :total="items4.length">
                </el-pagination>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <el-table id="outTable5" :data="items5.slice((currentPage5 - 1) * pagesize5, currentPage5 * pagesize5)" :height="tableHeight +'px'" style="width: 100%;" stripe border
              @cell-dblclick="shwoPic" @selection-change="handleSelectionChange5">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column fixed label="序号" width="60" align="center">
                <template slot-scope="scope"><span>{{scope.$index+(currentPage5 - 1) * pagesize5 + 1}}
                  </span></template>
              </el-table-column>
              <template v-for="(col ,index) in gridColumns5">
                <el-table-column :label="col.text" :key="index" :prop="col.value" :width="col.width" :formatter="formatFive">
                </el-table-column>
              </template>
            </el-table>
            <v-card-actions align-end justify-end row fill-height class="py-0">
              <v-layout pa-2 align-end justify-end row fill-height>
                <el-pagination @size-change="handleSizeChange5"
                  @current-change="handleCurrentChange5" :current-page="currentPage5"
                  :page-sizes="[5, 10, 20, 50, 100, 200, 500]" :page-size="pagesize5"
                  layout="total, sizes, prev, pager, next" :total="items5.length">
                </el-pagination>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <el-table id="outTable6" :data="items6.slice((currentPage6 - 1) * pagesize6, currentPage6 * pagesize6)" :height="tableHeight +'px'" style="width: 100%;" stripe border
              @cell-dblclick="shwoPic" @selection-change="handleSelectionChange6">
              <el-table-column type="selection" width="40" ></el-table-column>
              <el-table-column fixed label="序号" width="60" align="center">
                <template slot-scope="scope"><span>{{scope.$index+(currentPage6 - 1) * pagesize6 + 1}}
                  </span></template>
              </el-table-column>
              <template v-for="(col ,index) in gridColumns6">
                <el-table-column :label="col.text" :key="index" :prop="col.value" :width="col.width" :formatter="formatSix">
                </el-table-column>
              </template>
            </el-table>
            <v-card-actions align-end justify-end row fill-height class="py-0">
              <v-layout pa-2 align-end justify-end row fill-height>
                <el-pagination @size-change="handleSizeChange6"
                  @current-change="handleCurrentChange6" :current-page="currentPage6"
                  :page-sizes="[5, 10, 20, 50, 100, 200, 500]" :page-size="pagesize6"
                  layout="total, sizes, prev, pager, next" :total="items6.length">
                </el-pagination>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <el-table id="outTable7" :data="items7.slice((currentPage7 - 1) * pagesize7, currentPage7 * pagesize7)" :height="tableHeight +'px'" style="width: 100%;" stripe border
              @cell-dblclick="shwoPic" @selection-change="handleSelectionChange7">
              <el-table-column type="selection" width="40" ></el-table-column>
              <el-table-column fixed label="序号" width="60" align="center">
                <template slot-scope="scope"><span>{{scope.$index+(currentPage7 - 1) * pagesize7 + 1}}
                  </span></template>
              </el-table-column>
              <template v-for="(col ,index) in gridColumns7">
                <el-table-column :label="col.text" :key="index" :prop="col.value" :width="col.width" :formatter="formatSeven">
                </el-table-column>
              </template>
            </el-table>
            <v-card-actions align-end justify-end row fill-height class="py-0">
              <v-layout pa-2 align-end justify-end row fill-height>
                <el-pagination @size-change="handleSizeChange7"
                  @current-change="handleCurrentChange7" :current-page="currentPage7"
                  :page-sizes="[5, 10, 20, 50, 100, 200, 500]" :page-size="pagesize7"
                  layout="total, sizes, prev, pager, next" :total="items7.length">
                </el-pagination>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        
      </v-tabs>
    </v-card>

    <v-dialog v-model="showDialog" persistent scrollable max-width="800">
      <v-card>
        <v-card-title class="pa-0">
          <v-toolbar>
            <v-toolbar-title><span>查看证件照</span> </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showDialog = false">
              <v-icon color="red" >mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card-title>
        <v-card-text class="scroll-y pa-2" style="max-height: 600px;text-align: center;">
          <template v-for="(item ,index) in imagePaths">
            <v-divider class="mt-2"></v-divider>
            <img :key="index" v-bind:src="fileUrl +item.file_path" style="width: 100%; border: 1px solid rgb(123, 172, 236);">
          </template>
        </v-card-text>
        
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  /**
   * 证件信息管理
   */
  var debounce = require("lodash/debounce"); //使用lodash的深度复制对象方法

  export default {
    name: "CertificateManager",
    data() {
      return {
        userInfo: this.$authenticationService.getCurrentUser().userInfo,
        menuInfo: {},

        items: [], //结果集
        items2: [],
        items3: [],
        items4: [],
        items5: [],
        items6: [],
        items7: [],

        label: "证件过期提醒",
        label2: "注册证信息",
        label3: "生产/经营营业证",
        label4: "生产/经营许可证",
        label5: "经销授权书",
        label6: "法人委托书",
        label7: "承诺书",


        gridColumns: [], //显示列
        gridColumns2: [],
        gridColumns3: [],
        gridColumns4: [],
        gridColumns5: [],
        gridColumns6: [],
        gridColumns7: [],
        supplyItems: [],
        supplyId: "",

        multipleSelection: [], //用于存储选中行数据的集合
        multipleSelection2: [],
        multipleSelection3: [],
        multipleSelection4: [],
        multipleSelection5: [],
        multipleSelection6: [],
        multipleSelection7: [],

        pagesize: 10, //每页总数
        currentPage: 1, //页码
        pagesize2: 10,
        currentPage2: 1,
        pagesize3: 10,
        currentPage3: 1,
        pagesize4: 10,
        currentPage4: 1,
        pagesize5: 10,
        currentPage5: 1,
        pagesize6: 10,
        currentPage6: 1,
        pagesize7: 10,
        currentPage7: 1,

        active: 0, //绑定的tab标签页下标
        //表格的高度(这里默认给浏览器可视区高度 - 表格以上部分的高度)
        tableHeight: document.documentElement.clientHeight - 300, //第一个表格的高度
        tableHeight2: document.documentElement.clientHeight - 280, //第二个表格的高度

        imagePaths: [],
        showDialog: false,
        fileUrl: "",

      }
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
    created() {
      this.init();
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
        if(this.menuInfo.columns_config.split('^`')[4]){
          this.gridColumns5 = this.$utilsService.initVuetifyColumnConfig(
            this.menuInfo.columns_config.split('^`')[4]
          );
        }
        if(this.menuInfo.columns_config.split('^`')[5]){
          this.gridColumns6 = this.$utilsService.initVuetifyColumnConfig(
            this.menuInfo.columns_config.split('^`')[5]
          );
        }
        if(this.menuInfo.columns_config.split('^`')[6]){
          this.gridColumns7 = this.$utilsService.initVuetifyColumnConfig(
            this.menuInfo.columns_config.split('^`')[6]
          );
        }
        //从菜单中获取URL
        if (!this.$utilsService.isUndefined(this.menuInfo.params)&&!this.$utilsService.isUndefined(this.menuInfo.params.fileUrl)) {
          this.fileUrl = this.menuInfo.params.fileUrl;//菜单传入dept参数
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

      tabsChange(){
        if(this.active == 0){
          this.doSearch();
        }else {
          this.doSearch2();
        }
      },

      //查询
      async doSearch() {
        this.items = [];//清空第一个列表
        this.active = 0;//查询默认在第一个Tab标签页
        
        let sqlstr = "";
        if(this.supplyId.trim().length > 0){
          sqlstr += " and customer_id2 = '" + this.supplyId.trim() + "'";
        }
        let param = {
          tj: sqlstr,
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
        var resultData = await this.$commonService.executeService("datacenterService", "getAfterCertificateList", param, true)
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

      async doSearch2() {
        
        let sqlstr = "";
        if(this.supplyId.trim().length > 0){
          sqlstr += " and customer_id2 = '" + this.supplyId.trim() + "'";
        }
        let param = {
          tj: sqlstr,
          appProject:"erp",
          appVersion:"hmis_gg_01"
        };

        if(this.active == 1){
          param.certificateType1 = 4;
          param.certificateType2 = ""
          this.items2 = [];
        }else if(this.active == 2){
          param.certificateType1 = 1;
          this.items3 = [];
        }else if(this.active == 3){
          param.certificateType1 = 2;
          this.items4 = [];
        }else if(this.active == 4){
          param.certificateType1 = 5;
          this.items5 = [];
        }else if(this.active == 5){
          param.certificateType1 = 6;
          this.items6 = [];
        }else if(this.active == 6){
          param.certificateType1 = 7;
          this.items7 = [];
        }

        //显示加载框
        this.$mvc.MDialog.show({
          message: "数据处理中...",
          titleIcon: "mdi-info",
          title: "提示",
          type: "loading"
        });
        var resultData = await this.$commonService.executeService("datacenterService", "getCertificateList", param, true)
        this.$mvc.MDialog.hide(); //隐藏加载框
        if (!resultData || resultData.resultKey == "-1") {
          this.$mvc.MDialog.show({
            title: "失败",
            titleIcon: "error",
            message: resultData ? resultData.resultMessage : "未知错误！",
            showCancel: false
          });
        } else {
          let list = resultData.dataList;//得到结果集

          if(this.active == 1){
            this.items2 = list;
          }else if(this.active == 2){
            this.items3 = list;
          }else if(this.active == 3){
            this.items4 = list;
          }else if(this.active == 4){
            this.items5 = list;
          }else if(this.active == 5){
            this.items6 = list;
          }else if(this.active == 6){
            this.items7 = list;
          }

        }

      },

      async shwoPic(row){
        this.imagePaths = [];
        let certificateID = row.certificate_id.trim();
        let param = {
          certificateId: certificateID,
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
        var resultData = await this.$commonService.executeService("datacenterService", "getFilesList", param, true)
        this.$mvc.MDialog.hide(); //隐藏加载框
        if (!resultData || resultData.resultKey == "-1") {
          this.$mvc.MDialog.show({
            title: "失败",
            titleIcon: "error",
            message: resultData ? resultData.resultMessage : "未知错误！",
            showCancel: false
          });
        } else {
          this.imagePaths = resultData.dataList;//得到结果集
          this.showDialog = true;
        }
      },

      //审核
      save(){
        let that = this;
        this.$mvc.MDialog.show({
          title: "提示",
          titleIcon: "mdi-information-outline",
          message: "是否执行审核？",
          onCancel() {},
          onConfirm: async function() {

            let list = [];
            let list2 = [];
            if(this.active == 1){
              list = this.multipleSelection2;
            }else if(this.active == 2){
              list = this.multipleSelection3;
            }else if(this.active == 3){
              list = this.multipleSelection4;
            }else if(this.active == 4){
              list = this.multipleSelection5;
            }else if(this.active == 5){
              list = this.multipleSelection6;
            }else if(this.active == 6){
              list = this.multipleSelection7;
            }

            if(list.length > 0){
              for(let [i, v] of list.entries()) {
                let a = v.check_statu?v.check_statu.trim():"";
                if(a == "1"){//已审核过的不再审核
                  continue;
                }
                list2.push(v.certificate_id.trim())
              }
            }
            if(list2.length > 0){
              let b = true;
              let a = 0;
              for(let [i, v] of list2.entries()) {
                let param = {
                  certificateId: v,
                  check: 1,
                  checker: this.userInfo.user_code,
                  checkTime: this.$utilsService.dateFormat(new Date(), "MM-dd-yyyy"),

                  appProject:"erp",
                  appVersion:"hmis_gg_01"
                }
                //显示加载框
                this.$mvc.MDialog.show({
                  message: "数据处理中...",
                  type: "loading"
                });
                var resultData = await this.$commonService.executeService("datacenterService", "saveOrUpdateCertificate", param, false)
                this.$mvc.MDialog.hide(); //隐藏加载框
                if (!resultData || resultData.resultKey == "-1") {
                  b = false;
                  a++;
                }
              }
              let msg = "";
              if (b){
                msg = "审核完成！";
              }else{
                msg = "审核成功：" + (list2.length - a)+"笔，失败："+a+"笔。";
              }

              let that = this;
              this.$mvc.MDialog.show({
                title: "提示",
                titleIcon: "mdi-information-outline",
                message: msg,
                onConfirm: function() {
                  this.doSearch2();
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
      handleSizeChange2(size2) {
        this.pagesize2 = size2;
      },
      handleCurrentChange2(currentPage2) {
        this.currentPage2 = currentPage2;
      },
      handleSizeChange3(size3) {
        this.pagesize3 = size3;
      },
      handleCurrentChange3(currentPage3) {
        this.currentPage3 = currentPage3;
      },
      handleSizeChange4(size4) {
        this.pagesize4 = size4;
      },
      handleCurrentChange4(currentPage4) {
        this.currentPage4 = currentPage4;
      },
      handleSizeChange5(size5) {
        this.pagesize5 = size5;
      },
      handleCurrentChange5(currentPage5) {
        this.currentPage5 = currentPage5;
      },
      handleSizeChange6(size6) {
        this.pagesize6 = size6;
      },
      handleCurrentChange6(currentPage6) {
        this.currentPage6 = currentPage6;
      },
      handleSizeChange7(size7) {
        this.pagesize7 = size7;
      },
      handleCurrentChange7(currentPage7) {
        this.currentPage7 = currentPage7;
      },

      /* handleSelectionChange(val) {
        this.multipleSelection = val;
      }, */
      handleSelectionChange2(val2) {
        this.multipleSelection2 = val2;
      },
      handleSelectionChange3(val3) {
        this.multipleSelection3 = val3;
      },
      handleSelectionChange4(val4) {
        this.multipleSelection4 = val4;
      },
      handleSelectionChange5(val5) {
        this.multipleSelection5 = val5;
      },
      handleSelectionChange6(val6) {
        this.multipleSelection6 = val6;
      },
      handleSelectionChange7(val7) {
        this.multipleSelection7 = val7;
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
          let currentPage2 = this.currentPage2;
          let pagesize2 = this.pagesize2;

          this.currentPage2 = 1;
          this.pagesize2 = this.items2.length; //显示完所有数据

          this.$nextTick(()=>{
            this.$exportExcel('outTable2', menuName + this.label2);//outTable 为表格的id
            this.currentPage2 = currentPage2;
            this.pagesize2 = pagesize2; //再恢复回每页10条数据
          })
        }else if(this.active == 2){
          let currentPage3 = this.currentPage3;
          let pagesize3 = this.pagesize3;

          this.currentPage3 = 1;
          this.pagesize3 = this.items3.length; //显示完所有数据

          this.$nextTick(()=>{
            this.$exportExcel('outTable3', menuName + this.label3);//outTable 为表格的id
            this.currentPage3 = currentPage3;
            this.pagesize3 = pagesize3; //再恢复回每页10条数据
          })
        }else if(this.active == 3){
          let currentPage4 = this.currentPage4;
          let pagesize4 = this.pagesize4;

          this.currentPage4 = 1;
          this.pagesize4 = this.items4.length; //显示完所有数据

          this.$nextTick(()=>{
            this.$exportExcel('outTable4', menuName + this.label4);//outTable 为表格的id
            this.currentPage4 = currentPage4;
            this.pagesize4 = pagesize4; //再恢复回每页10条数据
          })
        }else if(this.active == 4){
          let currentPage5 = this.currentPage5;
          let pagesize5 = this.pagesize5;

          this.currentPage5 = 1;
          this.pagesize5 = this.items5.length; //显示完所有数据

          this.$nextTick(()=>{
            this.$exportExcel('outTable5', menuName + this.label5);//outTable 为表格的id
            this.currentPage5 = currentPage5;
            this.pagesize5 = pagesize5; //再恢复回每页10条数据
          })
        }else if(this.active == 5){
          let currentPage6 = this.currentPage6;
          let pagesize6 = this.pagesize6;

          this.currentPage6 = 1;
          this.pagesize6 = this.items6.length; //显示完所有数据

          this.$nextTick(()=>{
            this.$exportExcel('outTable6', menuName + this.label6);//outTable 为表格的id
            this.currentPage6 = currentPage6;
            this.pagesize6 = pagesize6; //再恢复回每页10条数据
          })
        }else if(this.active == 6){
          let currentPage7 = this.currentPage7;
          let pagesize7 = this.pagesize7;

          this.currentPage7 = 1;
          this.pagesize7 = this.items7.length; //显示完所有数据

          this.$nextTick(()=>{
            this.$exportExcel('outTable7', menuName + this.label7);//outTable 为表格的id
            this.currentPage7 = currentPage7;
            this.pagesize7 = pagesize7; //再恢复回每页10条数据
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
      formatFive(row, column) {
        let meunCol = this.gridColumns5.filter((item)=>{
          return item.value == column.property;
        });
        return  this.$utilsService.formatterExpression(row, column, meunCol);
      },
      formatSix(row, column) {
        let meunCol = this.gridColumns6.filter((item)=>{
          return item.value == column.property;
        });
        return  this.$utilsService.formatterExpression(row, column, meunCol);
      },
      formatSeven(row, column) {
        let meunCol = this.gridColumns7.filter((item)=>{
          return item.value == column.property;
        });
        return  this.$utilsService.formatterExpression(row, column, meunCol);
      },

    }
  };
</script>