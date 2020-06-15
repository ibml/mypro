import Vue from 'vue';
import FileSaver from 'file-saver';
import {utils, write} from 'xlsx/dist/xlsx.mini.min.js';

/*导出Excel公共方法：(表格的id, 导出Excel文件的名称)
  使用该方法须知：需要引入 导出Excel的两个依赖
  ① 安装相关依赖  npm install --save xlsx file-saver
  ② 组件里头引入  import FileSaver from 'file-saver'; 
                  import{ utils, write} from 'xlsx/dist/xlsx.mini.min.js'; //xlsx迷你版
*/
function exportExcel(id, title) {
  /* el-table的fixed属性来让某一列固定，但elementui的实现方式是：创建了两个tabledom，
    通过一个隐藏一个显示来实现交互效果。当导出整个el-table 就会将两个div内的table都导出，
    导致导出表格时会出现导出两次的问题，这里删除掉
    判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去。
  */
  let table = document.querySelector('#' + id);
  let fix = document.getElementById(id).querySelector(".el-table__fixed"); //哪个表格下面的类
  let wb = utils.table_to_book(table);
  if (fix) {
    wb = utils.table_to_book(table.removeChild(fix));
    table.appendChild(fix);
  }
  let wbout = write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  });
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let date = d.getDate();
  month = month < 10 ? "0" + month : month;
  date = date < 10 ? "0" + date : date;

  try {
    FileSaver.saveAs(new Blob([wbout], {
        type: 'application/octet-stream'
      }),
      title + `(${year}${month}${date}).xlsx`)
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout);
  }
  return wbout;
}
Vue.prototype.$exportExcel = exportExcel