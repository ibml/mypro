//饼图
export var pieOpt = {
  title: {
    text: '某站点用户访问来源',
    subtext: '纯属虚构',
    x: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
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
      {
        value: 135,
        name: '视频广告'
      },
      {
        value: 1548,
        name: '搜索引擎'
      }
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

export var pieOpt2 = {
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: []
  },
  series: [{
    name: '',
    type: 'pie',
    radius: '55%',
    center: ['50%', '60%'],
    data: [],
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      },
      normal: {
        label: { //文字也显示百分比
          show: true,
          formatter: '{a}:{b}:{c}({d}%)'
        },
        color: function (params) {
          //自定义颜色
          var colorList = [
            '#B5C334', '#FCCE10', '#E87C25', '#27727B',
            '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
          ];
          return colorList[params.dataIndex]
        }
      }
    }
  }]
};

export var pieOpt3 = {
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: []
  },
  series: [{
    name: '',
    type: 'pie',
    radius: '55%',
    center: ['50%', '60%'],
    data: [],
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      },
      normal: {
        label: { //文字也显示百分比
          show: true,
          formatter: '{a}:{b}:{c}({d}%)'
        },
        color: function (params) {
          //自定义颜色
          var colorList = [
            '#B5C334', '#FCCE10', '#E87C25', '#27727B',
            '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
          ];
          return colorList[params.dataIndex]
        }
      }
    }
  }]
};

export var pieOpt4 = {
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: []
  },
  series: [{
    name: '申领情况',
    type: 'pie',
    radius: '55%',
    center: ['50%', '60%'],
    data: [],
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
};
export var pieOpt5 = {
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: []
  },
  series: [{
    name: '申领情况',
    type: 'pie',
    radius: '55%',
    center: ['50%', '60%'],
    data: [],
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
};

//堆叠柱状图
export var stackBarOpt = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    data: ['总数', '申领数量']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    data: []
  }],
  yAxis: [{
    type: 'value'
  }],
  series: []
};
//曲线图
export var stackLineOpt = {

  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: []
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [

  ]
};

export var basicPieOpt = {
  title: {
    text: '',
    subtext: '',
    x: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: []
  },
  series: [{
    name: '',
    type: 'pie',
    radius: '55%',
    center: ['50%', '60%'],
    data: [],
    itemStyle: {
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    },
  }]
};

export var basicBarOpt = {
  title: {
    text: '',
    subtext: '',
    x: 'center'
  },
  grid: {
    containLabel: true
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    orient: 'vertical',
    data: [],
    left: '2%'
  },
  xAxis: [{
    type: 'category',
    data: []
  }],
  yAxis: [{
    type: 'value'
  }],
  series: []
};
// {
//   name: '蒸发量',
//   type: 'bar',
//   data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],

// },
// {
//   name: '降水量',
//   type: 'bar',
//   data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],

// }
export var basicLineOpt = {
  title: {
    text: '',
    x: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    orient: 'vertical',
    data: [],//'邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'
    left: '2%'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },

  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []//'周一', '周二', '周三', '周四', '周五', '周六', '周日'
  },
  yAxis: {
    type: 'value'
  },
  series: [
    // {
    //   name: '邮件营销',
    //   type: 'line',
    //   stack: '总量',
    //   data: [120, 132, 101, 134, 90, 230, 210]
    // },
    // {
    //   name: '联盟广告',
    //   type: 'line',
    //   stack: '总量',
    //   data: [220, 182, 191, 234, 290, 330, 310]
    // },
    // {
    //   name: '视频广告',
    //   type: 'line',
    //   stack: '总量',
    //   data: [150, 232, 201, 154, 190, 330, 410]
    // },
    // {
    //   name: '直接访问',
    //   type: 'line',
    //   stack: '总量',
    //   data: [320, 332, 301, 334, 390, 330, 320]
    // },
    // {
    //   name: '搜索引擎',
    //   type: 'line',
    //   stack: '总量',
    //   data: [820, 932, 901, 934, 1290, 1330, 1320]
    // }
  ]
};