import sysConfig from '@/config'
import Vue from "vue";
import {
    Pagination,
    Table,
    TableColumn
} from 'element-ui';
if (sysConfig.defualtApp.elementUI) {
    import('element-ui/lib/theme-chalk/index.css');
    Vue.use(Pagination);
    Vue.use(Table);
    Vue.use(TableColumn);
}