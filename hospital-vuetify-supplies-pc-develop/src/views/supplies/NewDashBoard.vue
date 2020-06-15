<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div v-bind:style="bgClass">
        <v-container fluid grid-list-md class="pa-1">
            <v-layout row wrap id="drag-container">
                <!-- 供应商品种占比 -->
                <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-widget id="tag1" :enableHeader="false" content-bg="#0a1042" :flat="true" custClass="elevation-0"
                        dark :custStyle="{backgroundColor: 'inherit'}" style="width:539px ;height: 294px">
                        <div slot="widget-content" id="chart1" :style="{width: '100%', height: '260px'}"></div>
                    </v-widget>
                </v-flex>

                <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-card flat class="elevation-0" dark style="background-color: inherit;">
                        <v-card-title>
                            <v-layout align-center justify-center column><span class="display-1 d-flex">SPD运营监控中心</span>
                                <v-subheader class="d-flex">{{SPDSubHeader}}</v-subheader>
                            </v-layout>
                        </v-card-title>
                        <v-card-text class="py-0">
                            <v-layout row>
                                <v-flex xs4 class="text-xs-center">
                                    <p class="title">收货笔数：</p>
                                    <p class="subheading">{{receivedGoodCount}}</p>
                                    <p class="title">金额：</p>
                                    <p class="subheading">{{receivedGoodMoney}}</p>
                                </v-flex>
                                <v-flex xs4 class="text-xs-center">
                                    <p class="title">科室申领计划笔数：</p>
                                    <p class="subheading">{{depPlanCount}}</p>
                                    <p class="title">金额：</p>
                                    <p class="subheading">{{depPlanMoney}}</p>
                                </v-flex>
                                <v-flex xs4 class="text-xs-center">
                                    <p class="title">出库笔数：</p>
                                    <p class="subheading">{{deliveryCount}}</p>
                                    <p class="title">金额：</p>
                                    <p class="subheading">{{deliveryMoney}}</p>
                                </v-flex>

                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <!-- 消耗成分比例 -->
                <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-widget id="tag2" :enableHeader="false" content-bg="#0a1042" :flat="true" custClass="elevation-0"
                        dark :custStyle="{backgroundColor: 'inherit'}" style="width: 539px;height:294px ">
                        <div slot="widget-content" id="chart2" :style="{width: '100%', height: '260px'}"></div>
                    </v-widget>
                </v-flex>
                <!-- 入库及使用金额 -->
                <!-- <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-widget id="tag3" :enableHeader="false" content-bg="#0a1042" flat custClass="elevation-0" dark
                        :custStyle="{backgroundColor: 'inherit'}">
                        <div slot="widget-content" id="chart3" :style="{width: '100%', height: '260px'}"></div>
                    </v-widget>
                </v-flex> -->

                <!-- 近效期商品 -->
                <!-- <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-widget id="tag4" :enableHeader="false" content-bg="#0a1042" flat custClass="elevation-0" dark
                        :custStyle="{backgroundColor: 'inherit'}">
                        <div slot="widget-content" id="chart4" :style="{width: '100%', height: '260px'}"></div>
                    </v-widget>
                </v-flex> -->
                <!-- 上游供应商top10 -->
                <v-flex d-flex xl4 sm6 md4 xs12>
                    <v-layout>
                        <v-flex d-flex xs12 class="pa-0">

                            <v-card id="tag4" flat class="elevation-0 pa-0" dark :style="{backgroundColor: 'inherit'}">
                                <v-card flat class="elevation-0" :style="{backgroundColor: 'inherit'}">
                                    <v-card-title class="pa-0">
                                        <v-layout align-center justify-center><span class="body-2">上游供应商使用金额Top10</span>
                                        </v-layout>
                                    </v-card-title>
                                    <v-card-text class="px-1">
                                        <v-data-table hide-default-footer :headers="supplierMoneyHearder"
                                            :items="supplierMoney" class="elevation-0" dark
                                            :style="{backgroundColor: 'inherit'}">
                                            <template slot="headers" slot-scope="props">
                                                <tr class="mid-headercell">
                                                    <template v-for="header in props.headers">
                                                        <th class="midh-text px-0" :style="{width:header.width}">
                                                            <div>{{header.text}}</div>
                                                        </th>
                                                    </template>
                                                </tr>
                                            </template>
                                            <template slot="headerCell" slot-scope="props" id="header">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <span class="text-xs-left text-truncate" v-on="on">
                                                            {{ props.header.text }}
                                                        </span>
                                                    </template>
                                                    <span class="text-xs-right">
                                                        {{ props.header.text }}
                                                    </span>
                                                </v-tooltip>
                                            </template>
                                            <template v-slot:items="props">
                                                <td class="text-xs-left text-no-wrap " style="width:80px;">
                                                    {{ props.item.name }}
                                                </td>
                                                <td class="text-xs-right text-truncate" style="width:80px;">
                                                    {{ props.item.total }}</td>
                                                <td class="text-xs-right text-truncate" style="width:80px;">
                                                    {{ props.item.mcount }}</td>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>

                <!-- 上游供应商top10 -->
                <v-flex d-flex xl4 sm6 md4 xs12 style="overflow:hidden;">
                    <v-card id="tag4" flat class="elevation-0 pa-0" dark :style="{backgroundColor: 'inherit'}">
                        <v-layout>
                            <!-- <v-flex d-flex xs6 class="pa-0">
                                <v-card flat class="elevation-0" :style="{backgroundColor: 'inherit'}">
                                    <v-card-title class="pa-0">
                                        <v-layout align-center justify-center><span class="body-2">上游供应商使用金额Top10</span>
                                        </v-layout>
                                    </v-card-title>
                                    <v-card-text class="px-1">
                                        <v-data-table hide-actions :headers="supplierMoneyHearder"
                                            :items="supplierMoney" class="elevation-0" dark
                                            :style="{backgroundColor: 'inherit'}">
                                            <template slot="headers" slot-scope="props">
                                                <tr class="mid-headercell">
                                                    <template v-for="header in props.headers">
                                                        <th class="midh-text px-0" :style="{width:header.width}">
                                                            <div>{{header.text}}</div>
                                                        </th>
                                                    </template>
                                                </tr>
                                            </template>
                                            <template slot="headerCell" slot-scope="props" id="header">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <span class="text-xs-left text-truncate" v-on="on">
                                                            {{ props.header.text }}
                                                        </span>
                                                    </template>
                                                    <span class="text-xs-right">
                                                        {{ props.header.text }}
                                                    </span>
                                                </v-tooltip>
                                            </template>
                                            <template v-slot:items="props">
                                                <td class="text-xs-left text-no-wrap " style="width:80px;">
                                                    {{ props.item.name }}</td>
                                                <td class="text-xs-right text-truncate" style="width:80px;">
                                                    {{ props.item.total }}</td>
                                                <td class="text-xs-right text-truncate" style="width:80px;">
                                                    {{ props.item.mcount }}</td>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-flex> -->
                            <v-flex d-flex xs12 class="pa-0">
                                <v-card flat class="elevation-0" :style="{backgroundColor: 'inherit'}">
                                    <v-card-title class="pa-0">
                                        <v-layout align-center justify-center><span class="body-2">上游供应商使用数量Top10</span>
                                        </v-layout>
                                    </v-card-title>
                                    <v-card-text class="px-1">
                                        <v-data-table hide-default-footer :headers="supplierMoneyHearder" :items="supplierNum"
                                            class="elevation-0" :style="{backgroundColor: 'inherit'}">
                                            <template slot="headers" slot-scope="props">
                                                <tr class="mid-headercell">
                                                    <template v-for="header in props.headers">
                                                        <th class="midh-text px-0" :style="{width:header.width}">
                                                            <div>{{header.text}}</div>
                                                        </th>
                                                    </template>
                                                </tr>
                                            </template>
                                            <template slot="headerCell" slot-scope="props">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <span class="text-xs-left" v-on="on">
                                                            {{ props.header.text }}
                                                        </span>
                                                    </template>
                                                    <span class="text-xs-right">
                                                        {{ props.header.text }}
                                                    </span>
                                                </v-tooltip>
                                            </template>
                                            <template v-slot:items="props">
                                                <td class=" text-truncate">{{ props.item.name }}</td>
                                                <td class=" text-truncate">{{ props.item.total }}</td>
                                                <td class=" text-truncate">{{ props.item.mcount }}</td>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
                <!-- 科室消耗top10 -->
                <v-flex d-flex xl4 sm6 md4 xs12 style="overflow:hidden;">
                    <v-card id="tag4" flat class="elevation-0 pa-0" dark :style="{backgroundColor: 'inherit'}">
                        <v-layout>
                            <v-flex d-flex xs4 class="pa-0">
                                <v-card flat class="elevation-0" :style="{backgroundColor: 'inherit'}">
                                    <v-card-title class="pa-0">
                                        <v-layout align-center justify-center><span class="body-2">当月科室消耗金额Top10</span>
                                        </v-layout>
                                    </v-card-title>
                                    <v-card-text class="px-1">
                                        <v-data-table hide-default-footer :headers="depHeaders" :items="depMoney"
                                            class="elevation-0" dark :style="{backgroundColor: 'inherit'}">
                                            <template slot="headerCell" slot-scope="props" id="header">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <span class="text-xs-left" v-on="on">
                                                            {{ props.header.text }}
                                                        </span>
                                                    </template>
                                                    <span class="text-xs-right">
                                                        {{ props.header.text }}
                                                    </span>
                                                </v-tooltip>
                                            </template>
                                            <template v-slot:items="props">
                                                <td class="text-xs-left text-no-wrap">{{ props.item.name }}</td>
                                                <td class="text-xs-right">{{ props.item.total }}</td>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                            <v-flex d-flex xs8 class="pa-0">
                                <v-card flat class="elevation-0" :style="{backgroundColor: 'inherit'}">
                                    <v-card-title class="pa-0">
                                        <v-layout align-center justify-center><span class="body-2">当月商品消耗金额Top10</span>
                                        </v-layout>
                                    </v-card-title>
                                    <v-card-text class="px-1">
                                        <v-data-table hide-default-footer :headers="goodsHeaders" :items="goodsMoney"
                                            class="elevation-0" :style="{backgroundColor: 'inherit'}">
                                            <template slot="headerCell" slot-scope="props">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <span class="text-xs-left" v-on="on">
                                                            {{ props.header.text }}
                                                        </span>
                                                    </template>
                                                    <span class="text-xs-right">
                                                        {{ props.header.text }}
                                                    </span>
                                                </v-tooltip>
                                            </template>
                                            <template v-slot:items="props">
                                                <td style="padding-left:8px;" class="text-xs-left text-no-wrap">
                                                    {{ props.item.name }}</td>
                                                <td class="text-xs-right">{{ props.item.total }}</td>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
                <!-- 手术耗材使用分析 -->
                <v-flex d-flex xl4 sm6 md4>
                    <v-widget id="tag5" :enableHeader="false" content-bg="#0a1042" flat custClass="elevation-0" dark
                        :custStyle="{backgroundColor: 'inherit'}" style="width:539px ;height: 294px">
                        <div slot="widget-content" id="chart5" :style="{width: '100%', height: '260px'}"></div>
                    </v-widget>
                </v-flex>
                <!-- 月份消耗 -->
                <v-flex d-flex xl4 sm6 md4>
                    <v-widget id="tag6" :enableHeader="false" content-bg="#0a1042" flat custClass="elevation-0" dark
                        :custStyle="{backgroundColor: 'inherit'}" style="width:539px ;height: 294px">
                        <div slot="widget-content" id="chart6" :style="{width: '100%', height: '260px'}"></div>
                    </v-widget>
                </v-flex>
                <!-- 整体使用情况分析 -->
                <v-flex d-flex xl4 sm6 md4>
                    <v-widget id="tag7" :enableHeader="false" content-bg="#0a1042" flat custClass="elevation-0" dark
                        :custStyle="{backgroundColor: 'inherit'}" style="width:539px ;height: 294px">
                        <div slot="widget-content" id="chart7" :style="{width: '100%', height: '260px'}"></div>
                    </v-widget>
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
        data() {
            return {
                receivedGoodCount: '-',
                receivedGoodMoney: '-',
                depPlanCount: '-',
                depPlanMoney: '-',
                deliveryCount: '-',
                deliveryMoney: '-',
                SPDSubHeader: '-',
                chartArray: [],
                depMoney: [],
                depHeaders: [{
                    text: '科室',
                    align: 'center',
                    sortable: false,
                    value: 'name'
                }, {
                    text: '金额(元)',
                    align: 'center',
                    sortable: false,
                    value: 'total'
                }],
                goodsHeaders: [{
                    text: '商品',
                    align: 'center',
                    sortable: false,
                    value: 'name'
                }, {
                    text: '金额(元)',
                    align: 'center',
                    sortable: false,
                    value: 'total'
                }],
                goodsMoney: [],
                interval: null, //定时器相关
                timer: 3000, //三十分钟来一次
                counter: 0,
                supplierMoneyHearder: [{
                        text: '供应商',
                        align: 'center',
                        sortable: false,
                        value: 'name'
                    },
                    {
                        text: '金额(元)',
                        align: 'center',
                        sortable: false,
                        value: 'total'
                    }, {
                        text: '数量',
                        align: 'center',
                        sortable: false,
                        value: 'mcount'
                    }
                ],
                supplierMoney: [],
                supplierNum: [],

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
            }
        },
        beforeDestroy() {
            if (this.interval) {
                window.clearInterval(this.interval);
            }
        },
        methods: {
            initPage() {
                this.drawCard();
                this.drawChart1();
                this.drawChart2();
                // this.drawChart3();//移动到第二页
                // this.drawChart4();
                this.drawTop101();
                this.drawTop102();
                this.drawChart5();
                this.drawChart6();
                this.drawChart7();

                this.drawSupplierMoneyTop10();
                this.drawSupplierNumTop10();
                // this.initChart("chart6", lineOption);
                // this.initChart("chart7", option);

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
                    }, 800);
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
            async drawCard() {
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(-180), "MM/dd/yyyy")

                var param1 = {
                    mark: "bi_42", //申领标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
                    dept: "", //发货仓库
                    date1: currentDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log('000', param1, data)
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    this.$nextTick(() => {
                        this.SPDSubHeader = list1[0].title;
                        this.receivedGoodCount = list1[0].mcount
                        this.receivedGoodMoney = isNaN(Number(list1[0].total)) ? '-' : list1[0]
                            .total.trim().replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                        this.depPlanCount = list1[1].mcount
                        this.depPlanMoney = isNaN(Number(list1[1].total)) ? '-' : list1[1].total.trim()
                            .replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                        this.deliveryCount = list1[2].mcount
                        this.deliveryMoney = isNaN(Number(list1[2].total)) ? '-' : list1[2].total.trim()
                            .replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                    })
                }
            },
            async drawChart1() {
                var option = cloneDeep(basicPieOpt);
                let {
                    getDataList
                } = this;
                //console.log("------custno------"+this.loginUser().userErpAuth.code1);
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy");
                var param1 = {
                    mark: "bi_41",
                    //custno: this.loginUser().userErpAuth.code1, //当前科室
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
                    dept: "", //发货仓库
                    date1: currentDay,
                    date2: currentDay, //到期日期
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log(111, param1, data)
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
                this.initChart("chart1", option);
            },
            async drawChart2() {
                var option = cloneDeep(basicPieOpt);
                let {
                    getDataList
                } = this;

                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy");

                var now = new Date(); //当前日期 
                var nowMonth = now.getMonth(); //当前月 
                var nowYear = now.getFullYear(); //当前年 
                //本月的开始时间
                var monthStartDate = UtilsService.dateFormat(new Date(nowYear, nowMonth, 1), "MM/dd/yyyy");

                var param1 = {
                    mark: "bi_43",
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
                    dept: "", //发货仓库
                    date1: monthStartDate,
                    date2: currentDay, //到期日期
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log(222, param1, data)
                if (data.resultKey != "-1") {
                    for (let [i, v] of data.dataList.entries()) {
                        option.legend.data.push(v.name.trim());
                        var item = {
                            value: v.mcount,
                            name: v.name.trim()
                        }
                        option.series[0].data.push(item);
                    }
                    option.title.text = data.dataList[0].title
                }
                this.initChart("chart2", option);
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
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
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
            async drawChart4() {
                var option = cloneDeep(basicPieOpt);
                let {
                    getDataList
                } = this;

                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy");
                var param1 = {
                    mark: "bi_45",
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
                    dept: "", //发货仓库
                    date1: currentDay,
                    date2: currentDay, //到期日期
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log(444, param1, data)
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
                this.initChart("chart4", option);
            },
            async drawTop101() {
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(30), "MM/dd/yyyy")
                var param1 = {
                    mark: "bi_46", //申领标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log(555, param1, data)
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    if (list1.length > 10) {
                        list1 = list1.splice(0, 10)
                    }
                    this.depMoney = []
                    for (let [i, v] of list1.entries()) {
                        v.total = parseFloat(v.total.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                        this.depMoney.push(v)
                    }

                }
            },
            async drawTop102() {
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(30), "MM/dd/yyyy")

                var param1 = {
                    mark: "bi_47", //申领标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log(666, param1, data)
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
            async drawChart5() {
                var option = cloneDeep(basicPieOpt);
                let {
                    getDataList
                } = this;

                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy");

                var now = new Date(); //当前日期 
                var nowMonth = now.getMonth(); //当前月 
                var nowYear = now.getFullYear(); //当前年 
                //本月的开始时间
                var monthStartDate = UtilsService.dateFormat(new Date(nowYear, nowMonth, 1), "MM/dd/yyyy");

                var param1 = {
                    mark: "bi_48",
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
                    dept: "", //发货仓库
                    date1: monthStartDate,
                    date2: currentDay, //到期日期
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log('chart5', param1, data)
                if (data.resultKey != "-1") {
                    for (let [i, v] of data.dataList.entries()) {
                        option.legend.data.push(v.name.trim());
                        var item = {
                            value: Number(v.total).toFixed(2),
                            name: v.name.trim()
                        }
                        option.series[0].data.push(item);
                    }
                    option.title.text = data.dataList[0].title
                }
                this.initChart("chart5", option);
            },
            //(柱型图)
            async drawChart6() {
                var option = cloneDeep(basicBarOpt);
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(7), "MM/dd/yyyy")

                var param1 = {
                    mark: "bi_40", //申领标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log("chart6", param1, data)
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    option.legend.data = ['使用']
                    var seriesData2 = [];
                    for (let [i, v] of data.dataList.entries()) {
                        option.xAxis[0].data.push(v.name);
                        seriesData2.push(parseFloat(v.total).toFixed(2))
                    }

                    var item2 = {
                        name: '使用',
                        type: 'bar',
                        data: seriesData2
                    }
                    option.series = [item2]
                    option.title.text = data.dataList[0].title
                    this.initChart("chart6", option);
                }
            },
            async drawChart7() {
                var option = cloneDeep(basicLineOpt);
                console.log("---option----",option);
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(7), "MM/dd/yyyy")

                var param1 = {
                    mark: "bi_49", //申领标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                console.log("chart7", param1, data)
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    console.log("----data.dataList------",data.dataList);
                    option.title.text = data.dataList[0].title;
                    var key_name = data.dataList[0].key_name,
                        key_name2 = data.dataList[0].key_name2,
                        line1 = {
                            name: key_name,
                            type: 'line',
                            stack: data.dataList[0].title,
                            data: []
                        },
                        line2 = {
                            name: key_name2,
                            type: 'line',
                            stack: data.dataList[0].title,
                            data: []
                        };
                    option.legend.data.push(key_name) //
                    option.legend.data.push(key_name2) //

                    for (let [i, v] of list1.entries()) {
                        option.xAxis.data.push(v.code) //横坐标(日期)
                        line1.data.push(v.total) //jin年才有数据
                        line2.data.push(v.mcount)
                    }
                    option.series = [line2, line1]
                    this.initChart("chart7", option);


                }
            },
            async drawSupplierMoneyTop10() {
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(30), "MM/dd/yyyy")
                var param1 = {
                    mark: "bi_59", //标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    if (list1.length > 10) {
                        list1 = list1.slice(0, 10)
                    }
                    console.log("供应商金额tpo10", param1, data)
                    this.supplierMoney = []
                    for (let [i, v] of list1.entries()) {
                        v.total = parseFloat(v.total.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                        v.mcount = parseFloat(v.mcount.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                        this.supplierMoney.push(v)
                    }

                }
            },
            async drawSupplierNumTop10() {
                let {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy")
                var targetDay = UtilsService.dateFormat(UtilsService.getBeforeDate(30), "MM/dd/yyyy")
                var param1 = {
                    mark: "bi_60", //标志
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
                    dept: "", //发货仓库
                    date1: targetDay,
                    date2: currentDay,
                    tj: ""
                }
                let data = await getDataList(param1);
                if (data.resultKey != "-1") {
                    let list1 = data.dataList;
                    if (list1.length > 10) {
                        list1 = list1.slice(0, 10)
                    }
                    console.log("供应商数量tpo10", param1, data)
                    this.supplierNum = []
                    for (let [i, v] of list1.entries()) {
                        v.total = parseFloat(v.total.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                        v.mcount = parseFloat(v.mcount.trim()).toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,')
                        this.supplierNum.push(v)
                    }

                }
            },
            generateAllParam() {
                var {
                    getDataList
                } = this;
                //获取今天的日期 MM/dd/yyyy
                var currentDay = UtilsService.dateFormat(new Date(), "MM/dd/yyyy");
                var param1 = {
                    mark: "bi_41",
                    custno:AuthenticationService.getCurrentUser().userInfo.user_code,
                    dept: "", //发货仓库
                    date1: currentDay,
                    date2: currentDay, //到期日期
                    tj: ""
                }
                var params = [param1].map(param => getDataList(param).catch(err => err));
                return params;
            },
            async doHttp() {
                var params = this.generateAllParam();
                let resp = await Promise.all(params);

            },
            custormChart(chartInstance, option) {
                chartInstance.clear();
                chartInstance.setOption(option);
            },
            async generateChartByParam(param, optfuc, chartInstance) {
                var {
                    getDataList
                } = this;
                var err = false;
                try {
                    var resulData = await getDataList(param);
                    var {
                        dataList,
                        resultKey,
                        resultMessage
                    } = resultData

                } catch (error) {
                    if (error) {
                        err = true
                    }
                }
            },
            loginUser() {
                return AuthenticationService.getCurrentUser();

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
        height: 25px !important;
    }

    #drag-container .v-datatable__progress {
        height: 0px !important;
    }

    #drag-container table.v-table tbody td {
        height: 20px !important;
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
</style>