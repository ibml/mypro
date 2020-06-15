<template>
  <div>
    <v-container
      grid-list-xl
      fluid
    >
      <v-layout
        d-flex
        column
      >
        <v-card>
          <v-card-title>
            <v-container pa-0>
              <v-layout
                row
                wrap
                style="align-items:center;"
              >
                <!-- <v-flex lg4 xs12 sm6>
                                    <v-text-field hint="For example, flowers or used cars" outline label="申领科室"
                                        append-icon="search">
                                    </v-text-field>
                                </v-flex > -->
                <v-flex
                  lg4
                  xs12
                  sm6
                >
                  <v-text-field
                    v-model="searchCode"
                    hint="请输入商品编码或数字编码，比如：ycx/0001"
                    outline
                    label="目标品种"
                  >
                  </v-text-field>
                </v-flex>

                <v-flex
                  d-flex
                  lg4
                  xs12
                  sm6
                >
                  <v-btn
                    depressed
                    color="primary"
                    @click="searchByCode"
                  >
                     查询目标品种
                  </v-btn>
                  <v-btn @click="dialog=!dialog">
                    <v-badge
                      color="red"
                      overlap
                    >
                      <span slot="badge">{{applyCartLength}}</span>
                      <v-icon medium>mdi-cart-outline</v-icon>
                    </v-badge>
                    <div class="ml-3">我的申领</div>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-layout
                row
                wrap
              >
                <v-flex
                  d-flex
                  lg3
                  xs12
                  sm6
                  md4
                  v-for="(item,index) in filterList"
                  :key="index"
                >
                  <v-card>
                    <!--src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"--->
                    <v-img
                      height="120px"
                      :src="'http://172.16.51.192:18088/goods/'+'WCK1009-2'+
                      '.jpg'"
                    >
                    </v-img>

                    <v-divider></v-divider>

                    <v-list dense>
                      <template v-for="(col,i) in cols">
                        <v-list-item :key="i">
                          <v-list-item-content>{{col.text}}</v-list-item-content>
                          <v-list-item-content class="align-end">{{item[col['value']]}}
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-list>
                    <v-card-actions>
                      <v-layout>
                        <v-flex xs6>
                          <v-layout
                            px-2
                            row
                            wrap
                          >
                            <v-flex xs4>
                              <v-btn
                                icon
                                @click="miniNum(item)"
                              >
                                <v-icon>mdi-minus</v-icon>
                              </v-btn>
                            </v-flex>
                            <v-flex xs4>
                              <!--<v-btn color="green">{{item.qty}}</v-btn>-->
                              <input v-model.number="item.qty" type="number" style="width: 50px;text-align: center;padding-top: 5px;color: aqua">
                            </v-flex>
                            <v-flex xs4>
                              <v-btn
                                @click="addNum(item)"
                                icon
                              >
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex
                          xs6
                          align-center
                          justify-end
                        >
                          <v-btn
                            @click="add2cart(item)"
                            color="indigo"
                          >
                            加入申领单
                          </v-btn>
                        </v-flex>
                      </v-layout>

                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-layout
              pa-2
              align-end
              justify-end
              row
              fill-height
            >
              <el-pagination
                @size-change="cardHandleSizeChange"
                @current-change="cardHandleCurrentChange"
                :current-page="cardCurrentPage"
                :page-sizes="[4, 8, 16, 32]"
                :page-size="cardPagesize"
                layout="total, sizes, prev, pager, next"
                :total="applyList.length"
              >
              </el-pagination>
            </v-layout>
          </v-card-actions>
        </v-card>
        <v-dialog
          v-model="dialog"
          width="900px"
        >
          <v-card>
            <v-card>
              <v-card-title>
                <div class="subheading">我的申领</div>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="searchKey"
                  label="请输入任何你想要的"
                  single-line
                  hide-details
                >
                </v-text-field>
                <v-btn
                  icon
                  @click="dialog=!dialog"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <el-table
                :data="applyedList"
                @selection-change="changeSelected"
                style="width: 100%"
                height="250"
              >
                <el-table-column
                  type="selection"
                  width="55"
                >
                </el-table-column>
                <template v-for="(col ,index) in cols">
                  <el-table-column
                    :label="col.text"
                    :key="index"
                    :prop="col.value"
                  >
                  </el-table-column>
                </template>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="120"
                >
                  <template slot-scope="scope">
                    <v-layout
                      px-2
                      row
                      wrap
                    >
                      <v-flex
                        xs4
                        justify-center
                        align-center
                      >
                        <v-btn
                          icon
                          @click="REDUCE_CART({gcode:scope.row.gcode})"
                        >
                          <v-icon small>mdi-minus</v-icon>
                        </v-btn>
                      </v-flex>
                      <v-flex
                        xs4
                        justify-center
                        align-center
                        py-1
                      >
                       <!--<v-btn
                          color="green"
                          icon
                        >{{scope.row.qty}}</v-btn>-->
                        <!-- <div style="text-align:center" class=" justify-center align-center" >{{scope.row.productNum}}</div> -->
                       <input v-model.number="scope.row.qty" type="number" style="width: 50px;text-align: center;padding-top: 5px;color: aqua">
                      </v-flex>
                      <v-flex
                        xs4
                        justify-center
                        align-center
                      >
                        <v-btn
                          @click="PLUS_CART({gcode:scope.row.gcode})"
                          icon
                        >
                          <v-icon small>mdi-plus</v-icon>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </template>
                </el-table-column>
              </el-table>
              <v-card-actions>
                <v-btn
                  color="red"
                  @click="spliceFromcart"
                >
                  移除选中{{multipleSelectArry.length>0?multipleSelectArry.length+"项":""}}
                </v-btn>
                <v-btn
                  color="green"
                  @click="doApply"
                >
                  提交
                </v-btn>
                <v-layout
                  pa-2
                  align-end
                  justify-end
                  row
                  fill-height
                >
                  <el-pagination
                    @size-change="carHandleSizeChange"
                    @current-change="carHandleCurrentChange"
                    :current-page="carCurrentPage"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="carPagesize"
                    layout="total, sizes, prev, pager, next"
                    :total="applyCartLength"
                  >
                  </el-pagination>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </div>
</template>
<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
</style>
<script>
import UtilsService from "@/services/UtilsService";
import AuthenticationService from "@/services/AuthenticationService";
import sysConfig from "@/config";

import { mapMutations, mapState, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState({
      applyedList: state => state.supplies.cartList
    }),
    ...mapGetters({
      applyCartLength: "supplies/cartListCount"
    }),
    filterList() {
      let { cardCurrentPage, cardPagesize, searchCode } = this;
      return this.cardList.slice(
        (cardCurrentPage - 1) * cardPagesize,
        cardCurrentPage * cardPagesize
      );
    }
  },
  created() {
    //初始化菜单
    this.init();

    this.INIT_APPLYCART();
    // var list = this.applyList.map((item) => {
    //     return {
    //         ...item,
    //         productNum: 1
    //     }
    // });
    // this.applyList = Object.assign({}, this.applyList, list)
  },
  data() {
    return {
      dialog: false,
      menuInfo: {},

      searchCode: "",
      applyList: [], //后台返回的数据数组
      cardList: [], //中间数组
      cols: [],
      cardPagesize:8,
      cardCurrentPage: 1,

      searchKey: "",
      carPagesize: 10,
      carCurrentPage: 1,
      multipleSelectArry: [] //选中的数组
    };
  },
  methods: {
    ...mapMutations({
      INIT_APPLYCART: "supplies/INIT_APPLYCART",
      ADD_CART: "supplies/ADD_CART",
      PLUS_CART: "supplies/PLUS_CART",
      REDUCE_CART: "supplies/REDUCE_CART",
      SPLICE_CART: "supplies/SPLICE_CART"
    }),
    searchByCode() {
      const { searchCode } = this;

      if (searchCode) {
        var filterList = this.applyList.filter(function(dataNews) {
          return Object.keys(dataNews).some(function(key) {
            return (
              String(dataNews[key])
                .toLowerCase()
                .indexOf(searchCode) > -1
            );
          });
        });
        this.cardList = filterList;
      } else {
        this.cardList = this.applyList;
      }
    },
    async init() {
      //初始化显示列
      this.menuInfo = this.$route.meta.menuInfo;
      this.cols = UtilsService.initVuetifyColumnConfig(
        this.menuInfo.columns_config
      );
      console.log("this.columns", this.cols);
      //查询数据
      // var param = {
      //     gcode: '',
      //     sqlstr: "and status='1'",
      // };
      var param = {
        mark: "2",
        sdept: AuthenticationService.getCurrentUser().userInfo.user_code,
        ddept: AuthenticationService.getCurrentUser().userInfo.user_code,
        gcode: "",
        sqlstr: ""
      };
      var resultData = await this.getApplylList(param);
      console.log("----resultData------",resultData);
      var { dataList, resultKey, resultMessage } = resultData;
      if (resultKey == "1" && dataList) {
        for (let [i, v] of dataList.entries()) {
          v.qty = 1;
        }
        this.cardList = this.applyList = dataList;
      }
      // console.log(66, this.applyList)
    },
    addNum(item) {
      //item.qty += 1;
      item.qty=parseInt(item.qty)+1;
    },
    miniNum(item) {
      item.qty > 0 ? (item.qty -= 1) : null;
    },
    add2cart(item) {
      this.ADD_CART(item);
      //提示成功
      let sb = {
        show: true,
        color: "green",
        y: "top",
        x: "right",
        mode: "",
        timeout: 3000,
        text: "添加申领成功"
      };
      this.$mvc.MSnackbar.show(sb)

    },
    spliceFromcart() {
      var { SPLICE_CART, multipleSelectArry } = this;
      for (let item of multipleSelectArry) {
        SPLICE_CART({
          gcode: item.gcode
        });

        // this.multipleSelectArry.forEach((i, index) => {
        //     if (item.productId === i.productId) {
        //         this.multipleSelectArry.splice(index, 1)
        //     }
        // })
      }
    },
    //外面卡片分页
    cardHandleSizeChange(size) {
      this.cardPagesize = size;
    },
    cardHandleCurrentChange(pageNum) {
      this.cardCurrentPage = pageNum;
    },

    //购物车分页
    carHandleSizeChange(size) {
      this.carPagesize = size;
    },
    carHandleCurrentChange(currentPage) {
      this.carCurrentPage = currentPage;
    },
    changeSelected(val) {
      this.multipleSelectArry = val; // 返回的是选中的列的数组集合
      console.log(val);
    },
    getApplylList: function(param) {
      var jsonData = {
        appName: sysConfig.appInfo.app_elite,
        appProject: sysConfig.appInfo.app_project_dtc, //app_project_wms  app_project_dtc
        appVersion: "hmis_gg_01", //sysConfig.appInfo.app_version,
        serviceName: "dtcService", //wmsQureyService spdService hisService
        methodName: "getHisGoodsListSQL" //getCtnInfo  getAcctoneD2  getAcctoneH  getGoodsList  getHisGoodsListSQL
      };

      Object.assign(jsonData, param);
      return UtilsService.eliteHttpGet(jsonData, {
        cache: true
      });
    },
    doApplylList: function(param) {
      var jsonData = {
        appName: sysConfig.appInfo.app_elite,
        appProject: sysConfig.appInfo.app_project_dtc, //app_project_wms  app_project_dtc
        appVersion: "hmis_gg_01", //sysConfig.appInfo.app_version,
        serviceName: "hisService", //wmsQureyService spdService
        methodName: "addOrderOut" //getCtnInfo  getAcctoneD2  getAcctoneH
      };

      Object.assign(jsonData, param);
      return UtilsService.eliteHttpPost(jsonData, {
        cache: true
      });
    },
    //把我的申领里面选择了的做申领后减去
    async doApply() {
      var { SPLICE_CART, multipleSelectArry } = this;
      if (this.multipleSelectArry.length > 0) {
        var paramItemArry = [];
        for (let [i, v] of this.multipleSelectArry.entries()) {
          paramItemArry.push(this.generateApplyItem(v, i + 1));
        }
        // console.log('提交参数', paramItemArry)
        let requestArry = paramItemArry.map(param =>
          this.doApplylList(param).catch(err => err)
        );
        await Promise.all(requestArry).then(res => {
          var successItem = 0;
          // console.log('返回结果', res)
          res.forEach((item, index) => {
            //提交审领成功的需要在我的申领里面减去
            if (item.resultKey != "-1") {
              successItem++;
              SPLICE_CART({
                gcode: this.multipleSelectArry[index].gcode
              });
            }
          });
          //提示成功除了多少条记录
          //提示成功
          let sb = {
            show: true,
            color: "green",
            y: "top",
            x: "right",
            mode: "",
            timeout: 3000,
            text:
              this.multipleSelectArry.length > 0 && successItem > 0
                ? "成功提交" + successItem + "条记录"
                : "成功提交0条记录"
          };
          this.$mvc.MSnackbar.show(sb)
        });
      } else {
        //提示成功
        let sb = {
          show: true,
          color: "green",
          y: "top",
          x: "right",
          mode: "",
          timeout: 3000,
          text: "请选择提交的记录"
        };
       this.$mvc.MSnackbar.show(sb)
      }
    },
    generateApplyItem(item, index) {
      var applyItem = {
        oper: AuthenticationService.getCurrentUser().userInfo.user_code,
        custno: AuthenticationService.getCurrentUser().userInfo.user_code,
        custname: AuthenticationService.getCurrentUser().userInfo.user_code,
        code: "c",
        no1:
          AuthenticationService.getCurrentUser().userInfo.user_code +
          UtilsService.dateFormat(new Date(), "yyyyMMddhhmmss"),
        date1: UtilsService.dateFormat(new Date(), "MM-dd-yyyy"),
        name1: AuthenticationService.getCurrentUser().userInfo.user_name,
        no:
          AuthenticationService.getCurrentUser().userInfo.user_code +
          UtilsService.dateFormat(new Date(), "yyyyMMddhhmmss") +
          index,
        contno: "",
        seqno: index,
        stockqty: "",
        bno: "",
        produrcedate: "",
        expirationdate: "",
        whplc: "",
        note: "",
        note1: "",
        note2: "",
        note3: "",
        note4: "",
        comp: "03",
        dept: ""
      };
      var item = Object.assign({}, applyItem, item);
      console.log("-------item--------",item);
      return item;
    }
  }
};
</script>