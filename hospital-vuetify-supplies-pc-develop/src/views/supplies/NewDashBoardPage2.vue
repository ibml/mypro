<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-bind:style="bgClass">
        <v-container fluid grid-list-md class="pa-1">
            <v-layout row wrap id="drag-container">
                <!-- 入库及使用金额 -->
                <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-widget id="tag3" :enableHeader="false" content-bg="#0a1042" flat custClass="elevation-0" dark
                        :custStyle="{backgroundColor: 'inherit'}" style="width:539px ;height: 294px">
                        <div slot="widget-content" id="chart3" :style="{width: '100%', height: '260px'}"></div>
                    </v-widget>
                </v-flex>

                <!-- 一周缺货-->
                <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-card id="tag5" flat class="elevation-0 pa-0" dark :style="{backgroundColor: 'inherit'}">
                        <v-card-title class="pa-0">
                            <v-layout align-center justify-center><span class="body-2">{{mark57Title}}</span>
                            </v-layout>
                            <!-- <v-data-table hide-actions :headers="LackOfHeader" :items="LackOf" class="elevation-0"
                                :style="{backgroundColor: 'inherit'}">
                                <template v-slot:no-data style="display:none">
                                    <span style="display:none"></span>
                                </template>
                            </v-data-table> -->
                        </v-card-title>
                        <v-layout>
                            <v-flex d-flex xs12 class="pa-0">
                                <v-card flat class="elevation-0" max-height="260px"
                                    :style="{backgroundColor: 'inherit'}" style="overflow-y:auto;overflow-x:hidden">
                                    <v-card-text class="px-1 pt-0" style="overflow-y:auto">
                                        <v-data-table hide-default-footer :headers="LackOfHeader" :items="LackOf"
                                            class="elevation-0 my-table" :style="{backgroundColor: 'inherit'}">
                                            <template v-slot:items="props">
                                                <td class="text-xs-left text-truncate">
                                                    {{ props.item.code  }}</td>
                                                <td class="text-xs-left text-truncate">{{ props.item.name  }}</td>
                                                <!-- <td class="text-xs-left text-truncate">{{ props.item.tj  }}</td> -->

                                                <td class="text-xs-left text-truncate">{{ props.item.total }}</td>
                                                <td class="text-xs-left text-truncate">{{ props.item.mcount }}</td>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>

                <!-- 手术台数与金额 -->
                <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-widget id="tag1" :enableHeader="false" content-bg="#0a1042" :flat="true" custClass="elevation-0"
                        dark :custStyle="{backgroundColor: 'inherit'}" style="width:539px ;height: 294px">
                        <div slot="widget-content" id="page2-chart1" :style="{width: '100%', height: '260px'}"></div>
                    </v-widget>
                </v-flex>

                <!-- 中标品种比重 -->
                <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-widget id="tag2" :enableHeader="false" content-bg="#0a1042" :flat="true" custClass="elevation-0"
                        dark :custStyle="{backgroundColor: 'inherit'}" style="width:539px ;height: 294px">
                        <div slot="widget-content" id="page2-chart2" :style="{width: '100%', height: '260px'}"></div>
                    </v-widget>
                </v-flex>

                <!-- 库存预警-->
                <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-card id="tag6" flat class="elevation-0 pa-0" dark :style="{backgroundColor: 'inherit'}">
                        <v-card-title class="pa-0">
                            <v-layout align-center justify-center><span class="body-2">{{mark55Title}}</span>
                            </v-layout>
                        </v-card-title>
                        <v-layout>
                            <v-flex d-flex xs12 class="pa-0">
                                <v-card flat class="elevation-0" :style="{backgroundColor: 'inherit'}"
                                    max-height="260px" style="overflow-y:auto;overflow-x:hidden">
                                    <v-card-text class="px-1">
                                        <v-data-table hide-default-footer :headers="inventoryWarnHeader" :items="inventoryWarn"
                                            class="elevation-0 my-table" :style="{backgroundColor: 'inherit'}">
                                            <!-- <template slot="headers" slot-scope="props">
                                                <tr class="mid-headercell">
                                                    <template v-for="header in props.headers">
                                                        <th class="midh-text px-0" :style="{width:header.width}">
                                                            <div>{{header.text}}</div>
                                                        </th>
                                                    </template>
                                                </tr>
                                            </template> -->
                                            <template v-slot:items="props">
                                                <td class="text-xs-left text-truncate">
                                                    {{ props.item.code  }}</td>
                                                <td class="text-xs-left text-truncate">{{ props.item.name  }}</td>
                                                <!-- <td class="text-xs-left text-truncate">{{ props.item.tj  }}</td> -->

                                                <td class="text-xs-left text-truncate">{{ props.item.total }}</td>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>

                <!-- 近效期预警-->
                <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-widget id="tag3" :enableHeader="false" content-bg="#0a1042" :flat="true" custClass="elevation-0"
                        dark :custStyle="{backgroundColor: 'inherit'}" style="width:539px ;height: 294px">
                        <div slot="widget-content" id="page2-chart3" :style="{width: '100%', height: '260px'}"></div>
                    </v-widget>
                </v-flex>

                <!-- 到货数据展示-->
                <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-widget id="tag7" :enableHeader="false" content-bg="#0a1042" :flat="true" custClass="elevation-0"
                        dark :custStyle="{backgroundColor: 'inherit'}" style="width:539px ;">
                        <div slot="widget-content" id="page2-chart4" :style="{width: '100%', height: '260px'}"></div>
                    </v-widget>
                </v-flex>

                <!-- 商品消耗top10 -->
                <v-flex d-flex xl4 sm6 md4 xs12 style="overflow:hidden;">
                    <v-card id="tag8" flat class="elevation-0 pa-0" dark :style="{backgroundColor: 'inherit'}">
                        <v-layout>
                            <v-flex d-flex xs6 class="pa-0">
                                <v-card flat class="elevation-0" :style="{backgroundColor: 'inherit'}">
                                    <v-card-title class="pa-0">
                                        <v-layout align-center justify-center><span class="body-2">当月商品消耗金额Top10</span>
                                        </v-layout>
                                    </v-card-title>
                                    <v-card-text class="px-1 pb-0">
                                        <v-data-table hide-default-footer :headers="goodsHeaders" :items="goodsMoney"
                                            class="elevation-0" :style="{backgroundColor: 'inherit'}">
                                            <template slot="headerCell" slot-scope="props">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <span class="text-xs-left" v-on="on">
                                                            {{ props.header.text }}
                                                        </span>
                                                    </template>
                                                    <span class="text-xs-left">
                                                        {{ props.header.text }}
                                                    </span>
                                                </v-tooltip>
                                            </template>
                                            <template v-slot:items="props">
                                                <td style="padding-left:8px;" class="text-xs-left text-no-wrap">
                                                    {{ props.item.name }}</td>
                                                <td class="text-xs-left">{{ props.item.total }}</td>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                            <v-flex d-flex xs6 class="pa-0">
                                <v-card flat class="elevation-0" :style="{backgroundColor: 'inherit'}">
                                    <v-card-title class="pa-0">
                                        <v-layout align-center justify-center><span class="body-2">当月商品消耗数量Top10</span>
                                        </v-layout>
                                    </v-card-title>
                                    <v-card-text class="px-1 pb-0">
                                        <v-data-table hide-default-footer :headers="goodsNumHeaders" :items="goodsNum"
                                            class="elevation-0" dark :style="{backgroundColor: 'inherit'}">
                                            <template slot="headerCell" slot-scope="props" id="header">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <span class="text-xs-left" v-on="on">
                                                            {{ props.header.text }}
                                                        </span>
                                                    </template>
                                                    <span class="text-xs-left">
                                                        {{ props.header.text }}
                                                    </span>
                                                </v-tooltip>
                                            </template>
                                            <template v-slot:items="props">
                                                <td class="text-xs-left text-no-wrap">{{ props.item.name }}</td>
                                                <td class="text-xs-left">{{ props.item.mcount }}</td>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>

                <!-- 品种监管 -->
                <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-card id="tag4" flat class="elevation-0 pa-0" dark :style="{backgroundColor: 'inherit'}">
                        <v-card-title class="pa-0">
                            <v-layout align-center justify-center><span class="body-2">{{mark56Title}}</span>
                            </v-layout>
                        </v-card-title>
                        <v-layout>
                            <v-flex d-flex xs12 class="pa-0">
                                <v-card flat class="elevation-0 tableContainer" max-height="260px"
                                    :style="{backgroundColor: 'inherit'}" style="overflow-y:auto;overflow-x:hidden">
                                    <v-card-text class="px-1">
                                        <v-data-table hide-default-footer :headers="specialSeriesHeader" :items="specialSeries"
                                            class="elevation-0" :style="{backgroundColor: 'inherit'}">
                                            <template v-slot:items="props">
                                                <td class="text-xs-left text-truncate">
                                                    {{ props.item.code  }}</td>
                                                <td class="text-xs-left text-truncate">{{ props.item.name  }}</td>
                                                <td class="text-xs-left text-truncate">{{ props.item.mcount }}</td>
                                                <td class="text-xs-left text-truncate">{{ props.item.total }}</td>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>

            </v-layout>
        </v-container>
    </div>
</template>
<script>
    import dragula from 'dragula'
    import VWidget from '@/components/VWidget/VWidget';
    //import halloween from '@/assets/supplies/echart_theme';
    //拖拽样式
    import 'dragula/dist/dragula.css';

    import UtilsService from "@/services/UtilsService";
    import AuthenticationService from "@/services/AuthenticationService";
    import sysConfig from "@/config";
    import {
        basicPieOpt,
        basicBarOpt,
        basicLineOpt
    } from "@/assets/js/chartdata.js"
    var cloneDeep = require('lodash/cloneDeep'); //使用lodash的深度复制对象方法
    var option = {

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接访问', '邮件营销', '联盟广告']
        },
        series: [{
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [{
                    value: 335,
                    name: '直接访问'
                },
                {
                    value: 310,
                    name: '邮件营销'
                },
                {
                    value: 234,
                    name: '联盟广告'
                },

            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    var barOption = {
        legend: {},
        tooltip: {},
        dataset: {
            source: [
                ['product', '2015', '2016'],
                ['Matcha Latte', 43.3, 85.8],
                ['Milk Tea', 83.1, 73.4],
                ['Cheese Cocoa', 86.4, 65.2],
                ['Walnut Brownie', 72.4, 53.9]
            ]
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{
                type: 'bar'
            },
            {
                type: 'bar'
            },

        ]
    };
    var lineOption = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
        }]
    };
    export default {
        components: {
            VWidget
        },
        props: {
            gridColumns: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                goodsHeaders: [{
                    text: '商品',
                    align: 'center',
                    sortable: false,
                    value: 'name'
                }, {
                    text: '金额',
                    align: 'center',
                    sortable: false,
                    value: 'total'
                }],
                goodsNumHeaders: [{
                    text: '商品',
                    align: 'center',
                    sortable: false,
                    value: 'name'
                }, {
                    text: '数量',
                    align: 'center',
                    sortable: false,
                    value: 'mcount'
                }],
                goodsNum: [],
                goodsMoney: [],
                chartArray: [],
                interval: null, //定时器相关
                timer: 1000, //3000三十分钟来一次
                counter: 0,
                specialSeries: [],
                LackOf: [],
                inventoryWarn: [],
                mark56Title: "bi_56查询出错",
                mark57Title: "bi_57查询出错",
                mark55Title: "",

            }
        },
        mounted() {
            this.initPage();
            this.refreshTimer();

            // var drake = dragula({
            //     copy: true,
            //     copySortSource: true
            // });
            // drake.containers.push(document.getElementById('drag-container'));
            dragula([document.querySelector('#drag-container')], {
                // copy: true,
                // copySortSource: true,
                direction: 'vertical', // Y axis is considered when determining where an element would be dropped
                // removeOnSpill: true,
                revertOnSpill: true, // spilling will put the element back where it was dragged from, if this is true
            });
        },
        computed: {
            bgClass() {
                return {
                    backgroundImage: "url(" + require("@/assets/supplies/img/bg_bigdata.png") + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%",
                }
            },
            specialSeriesHeader() {
                /*if (this.gridColumns.length && this.gridColumns[0]) {
                    let columns = this.gridColumns[0]
                    columns.map((v) => {
                        v.text = v.columnTitle;
                        v.value = v.columnName;
                        v.sortable = false;

                    })
                    return columns;
                } else {
                    return []
                }*/
                return [{
                    text:"商品名称",
                    value:"code",
                    sortable:false
                },{
                    text:"规格",
                    value:"name",
                    sortable:false
                },{
                    text:"厂家",
                    value:"tj",
                    sortable:false
                },,{
                    text:"单位",
                    value:"mcount",
                    sortable:false
                },{
                    text:"数量",
                    value:"total",
                    sortable:false
                }];
            },
            LackOfHeader() {
                /*if (this.gridColumns.length && this.gridColumns[1]) {
                    let columns = this.gridColumns[1]
                    columns.map((v) => {
                        v.text = v.columnTitle;
                        v.value = v.columnName;
                        v.sortable = false;

                    })
                    return columns;
                } else {
                    return []
                }*/
                return [{
                    text:"商品名称",
                    value:"code",
                    sortable:false
                },{
                    text:"规格",
                    value:"name",
                    sortable:false
                },{
                    text:"数量",
                    value:"total",
                    sortable:false
                },{
                    text:"单位",
                    value:"mcount",
                    sortable:false
                }];
            },
            inventoryWarnHeader() {
               /* if (this.gridColumns.length && this.gridColumns[2]) {
                    let columns = this.gridColumns[2]
                    console.log(columns)
                    columns.map((v) => {
                        v.text = v.columnTitle;
                        v.value = v.columnName;
                        v.sortable = false;
                    })
                    return columns;
                } else {
                    return []
                }*/
                return [{
                    text:"商品名称",
                    value:"code",
                    sortable:false
                },{
                    text:"规格",
                    value:"name",
                    sortable:false
                },{
                    text:"数量",
                    value:"total",
                    sortable:false
                }];
            }
        },
        beforeDestroy() {
            if (this.interval) {
                window.clearInterval(this.interval);
            }
        },
        methods: {
            //初始化页面数据的请求
            initPage() {
                this.drawTable1();
                this.drawTable2();
                this.drawTable3();
                this.drawTable4();
                this.drawPage2Chart1();
                this.drawPage2Chart2();
                this.drawPage2Chart3();
                this.drawPage2Chart4();
                this.drawChart3();
                this.drawGoodsNumTop10();
                this.drawGoodsMoneyTop10();
                this.resizeChart();

            },
            refreshTimer() {
                if (this.interval) {
                    window.clearInterval(this.interval);
                }
                if (this.timer) {
                    this.counter = 0;
                    this.interval = window.setInterval(() => {
                        if ((this.counter++) > this.timer) {
                            this.counter = 0;
                            // this.reload()出现重复请求问题
                            this.initPage();
                        }
                    }, 1000);
                }
            },
            //生成图表
            initChart(id, option) {
                var chartDom = document.getElementById(id);
                let chartInstance = null
                if (chartDom) {
                    chartInstance = this.$echarts.init(chartDom,
                        'walden'); //初始化图表对象，使用'dark :custStyle="{backgroundColor: 'inherit'}"'主题
                    chartInstance.setOption(option);
                    setTimeout(() => {
                        chartInstance.resize();
                    }, 1000);
                    this.chartArray.push(chartInstance)
                }
            },
            resizeOldChart() {
                for (let [i, v] of this.chartArray.entries()) {
                    setTimeout(() => {
                        if (v && v.resize) {
                            v.resize();
                        }
                    }, 500);
                }
            },
            resizeChart() {
                window.addEventListener('optimizedResize', (e) => {
                    for (let [i, v] of this.chartArray.entries()) {
                        setTimeout(() => {
                            if (v && v.resize) {
                                v.resize();
                            }
                        }, 800);
                    }
                });
                window.addEventListener('resize', (e) => {
                    for (let [i, v] of this.chartArray.entries()) {
                        setTimeout(() => {
                            if (i && v.resize) {
                                v.resize();
                            }
                        }, 800);
                    }
                });
            },
            //特殊品种监管
            async drawTable1() {
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(30), "MM/dd/yyyy")
                var param1 = {
                    mark: "bi_56", //标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code, //当前科室
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log("特殊品种监管", param1, data)
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    if (list1.length === 0) {
                        this.mark56Title = '没有更多数据';
                    } else
                        this.mark56Title = list1[0].title;

                    // this.supplierMoney = []
                    // for (let [i, v] of list1.entries()) {
                    //     v.total = parseFloat(v.total.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                    //     v.mcount = parseFloat(v.mcount.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                    // }
                    this.specialSeries = list1

                }
            },
            //一周缺货情况
            async drawTable2() {
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(7), "MM/dd/yyyy")
                var param1 = {
                    mark: "bi_57", //标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code, //当前科室
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log("一周缺货情况", param1, data);
                console.log(data.resultKey);
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    console.log(JSON.stringify(list1));
                    this.mark57Title = list1[0].title;

                    // if (list1.length > 10) {
                    //     list1 = list1.slice(0, 10)
                    // }
                    // this.supplierMoney = []
                    // for (let [i, v] of list1.entries()) {
                    //     v.total = parseFloat(v.total.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                    //     v.mcount = parseFloat(v.mcount.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                    //     this.supplierMoney.push(v)
                    // }
                    this.LackOf = list1;
                }
            },
            //库存预警
            async drawTable3() {
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(30), "MM/dd/yyyy")
                var param1 = {
                    mark: "bi_55", //标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code, //当前科室
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log("库存预警", param1, data)
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    this.mark55Title = list1[0].title||"";

                    // if (list1.length > 10) {
                    //     list1 = list1.slice(0, 10)
                    // }
                    // this.supplierMoney = []
                    // for (let [i, v] of list1.entries()) {
                    //     v.total = parseFloat(v.total.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                    //     v.mcount = parseFloat(v.mcount.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                    //     this.supplierMoney.push(v)
                    // }
                    this.inventoryWarn = list1;
                }
            },
            //调价品种
            async drawTable4() {
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(365), "MM/dd/yyyy")
                var param1 = {
                    mark: "bi_58", //标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code, //当前科室
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log("11调价品种", param1, data)
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    if (list1.length > 10) {
                        list1 = list1.slice(0, 10)
                    }
                    // this.supplierMoney = []
                    // for (let [i, v] of list1.entries()) {
                    //     v.total = parseFloat(v.total.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                    //     v.mcount = parseFloat(v.mcount.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                    //     this.supplierMoney.push(v)
                    // }

                }
            },
            //手术金额比例(柱型图)
            async drawPage2Chart1() {
                var option = cloneDeep(basicBarOpt);
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(7), "MM/dd/yyyy")

                var param1 = {
                    mark: "bi_50", //申领标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code, //当前科室
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log("page2-chart1", param1, data)
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    option["legend"]["data"] = [list1[0]["key_name"] + '(万元)', list1[0]["key_name2"]]
                    var xAxisData = [];
                    let series = []
                    var totalSerie = {
                        name: list1[0]["key_name"] + '(万元)',
                        type: 'bar',
                        stack: list1[0]["key_name"] + '(万元)',
                        itemStyle: {
                            normal: {
                                color: '#72b201'
                            }
                        },
                        data: []
                    }
                    var mcountSerie = {
                        name: list1[0]["key_name2"],
                        type: 'bar',
                        stack: list1[0]["key_name2"],
                        itemStyle: {
                            normal: {
                                color: 'brown'
                            }
                        },
                        data: []
                    }
                    for (let i = 0; i < list1.length; i++) {
                        // list1[i].total = parseFloat(list1[i].total.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g,
                        //     '$&,');
                        list1[i].total = (parseFloat(list1[i].total.trim()) / 10000).toFixed(2).replace(
                            /\d(?=(?:\d{3})+\b)/g,
                            '$&,');
                        list1[i].mcount = parseFloat(list1[i].mcount.trim()).toFixed(2).replace(
                            /\d(?=(?:\d{3})+\b)/g, '$&,')
                        totalSerie.data.push(list1[i].total);
                        mcountSerie.data.push(list1[i].mcount);
                        //x轴不需要转化
                        // let dateIndex = list1[i].code.lastIndexOf('/');
                        // xAxisData.push(list1[i].code.substring(0, dateIndex));
                        xAxisData.push(list1[i].code);
                    }
                    series.push(totalSerie);
                    series.push(mcountSerie);
                    option.xAxis[0].data = xAxisData;
                    option["series"] = series;
                    option.title.text = data.dataList[0].title
                    this.initChart("page2-chart1", option);
                }
            },
            //中标比重
            async drawPage2Chart2() {
                var option = cloneDeep(basicPieOpt);
                let {
                    getDataList
                } = this;

                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy");
                var param1 = {
                    mark: "bi_51",
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code, //当前科室
                    dept: "", //发货仓库
                    date1: currentDay,
                    date2: currentDay, //到期日期
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log("page2-chart2", param1, data)
                if (data.resultKey != "-1") {
                    for (let [i, v] of data.dataList.entries()) {
                        option.legend.data.push(v.name);
                        var item = {
                            value: v.total,
                            name: v.name
                        }
                        option.series[0].data.push(item);
                    }
                    option.title.text = data.dataList[0].title
                }
                this.initChart("page2-chart2", option);
            },
            //  近效期预警
            async drawPage2Chart3() {
                var option = cloneDeep(basicPieOpt);
                let {
                    getDataList
                } = this;

                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy");
                var param1 = {
                    mark: "bi_54",
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code, //当前科室
                    dept: "", //发货仓库
                    date1: currentDay,
                    date2: currentDay, //到期日期
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log("page2-chart3", param1, data)
                if (data.resultKey != "-1") {
                    for (let [i, v] of data.dataList.entries()) {
                        option.legend.data.push(v.name);
                        var item = {
                            value: v.total,
                            name: v.name
                        }
                        option.series[0].data.push(item);
                    }
                    option.title.text = data.dataList[0].title
                }
                this.initChart("page2-chart3", option);
            },
            //  近效期预警
            async drawPage2Chart4() {
                var option = cloneDeep(basicPieOpt);
                let {
                    getDataList
                } = this;

                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy");
                var param1 = {
                    mark: "bi_53",
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code, //当前科室
                    dept: "", //发货仓库
                    date1: currentDay,
                    date2: currentDay, //到期日期
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log("page2-chart4", param1, data)
                if (data.resultKey != "-1") {
                    for (let [i, v] of data.dataList.entries()) {
                        option.legend.data.push(v.name);
                        var item = {
                            value: v.total,
                            name: v.name
                        }
                        option.series[0].data.push(item);
                    }
                    option.title.text = data.dataList[0].title
                }
                this.initChart("page2-chart4", option);
            },
            async drawGoodsNumTop10() {
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(30), "MM/dd/yyyy")
                var param1 = {
                    mark: "bi_52", //申领标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code, //"100", //当前科室
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log("数量top10", param1, data)
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    if (list1.length > 10) {
                        list1 = list1.slice(0, 10)
                    }
                    this.goodsNum = []
                    for (let [i, v] of list1.entries()) {
                        v.mcount = parseFloat(v.mcount.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                        this.goodsNum.push(v)
                    }

                }
            },
            async drawGoodsMoneyTop10() {
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(30), "MM/dd/yyyy")

                var param1 = {
                    mark: "bi_47", //申领标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code, //"100", //当前科室
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log("金额top10", param1, data)
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    if (list1.length > 10) {
                        list1 = list1.splice(0, 10)
                    }
                    this.goodsMoney = []
                    for (let [i, v] of list1.entries()) {
                        v.total = parseFloat(v.total).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                        this.goodsMoney.push(v)
                    }
                }
            },
            //(柱型图)
            async drawChart3() {
                var option = cloneDeep(basicBarOpt);
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(180), "MM/dd/yyyy")

                var param1 = {
                    mark: "bi_44", //申领标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code, //"100", //当前科室
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log(333, param1, data)
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    option.legend.data = ['入库', '使用']
                    var seriesData1 = [],
                        seriesData2 = [];
                    for (let [i, v] of data.dataList.entries()) {
                        option.xAxis[0].data.push(v.name);
                        seriesData1.push(parseFloat(v.total).toFixed(2))
                        seriesData2.push(parseFloat(v.mcount).toFixed(2))
                    }
                    var item1 = {
                        name: '入库',
                        type: 'bar',
                        data: seriesData1
                    }
                    var item2 = {
                        name: '使用',
                        type: 'bar',
                        data: seriesData2
                    }
                    option.series = [item1, item2]
                    option.title.text = data.dataList[0].title
                    this.initChart("chart3", option);
                }
            },
            loginUser() {
                return AuthenticationService.getCurrentUser()
            },
            getDataList: function (param) {
                var jsonData = {
                    appName: sysConfig.appInfo.app_elite,
                    appProject: sysConfig.appInfo.app_project_dtc, //app_project_wms  app_project_dtc
                    appVersion: "hmis_gg_01", //sysConfig.appInfo.app_version,
                    serviceName: "spdService",
                    methodName: "getBitx",
                };
                Object.assign(jsonData, param);
                return UtilsService.eliteHttpGet(
                    jsonData, {
                        cache: true
                    }
                );
            }

        }
    }
</script>
<style>
    #drag-container .theme--dark.v-table {
        background-color: inherit !important;
        color: #fff;
    }

    #drag-container tr {
        height: 15px !important;
    }

    #drag-container .v-datatable__progress {
        height: 0px !important;
    }

    #drag-container table.v-table tbody td {
        height: 15px !important;
        padding: 0px;
    }

    [id^=tag] {
        background: linear-gradient(to left, rgb(88, 68, 68), gray) left top no-repeat,
            linear-gradient(to bottom, gray, gray) left top no-repeat,
            linear-gradient(to left, gray, gray) right top no-repeat,
            linear-gradient(to bottom, gray, gray) right top no-repeat,
            linear-gradient(to left, gray, gray) left bottom no-repeat,
            linear-gradient(to bottom, gray, gray) left bottom no-repeat,
            linear-gradient(to left, gray, gray) right bottom no-repeat,
            linear-gradient(to left, gray, gray) right bottom no-repeat;
        background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
        border: 1px solid gray;
    }

    /* 使用伪类选择器 ::-webkit-scrollbar ,兼容chrome和safari浏览器 */
    .v-card::-webkit-scrollbar {
        width: 0 !important;
        /* remove scrollbar space */
        background: transparent;
        /* optional: just make scrollbar invisible */
    }

    .my-table {
        table-layout: fixed;
    }
    .v-data-table td {
        font-size: 14px;
        height: 25px;
    }
</style>