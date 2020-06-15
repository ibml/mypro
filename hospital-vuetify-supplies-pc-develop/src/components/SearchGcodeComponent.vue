<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card
        class="pa-2"
        outlined
        tile
      >
        <v-card-title>
          <v-text-field
            outline
            label="商品编码"
            append-icon="mdi-file-document-box-search"
            v-model="gcode"
          ></v-text-field>
          <v-btn
            depressed
            color="primary"
            class="mx-2"
          >
            <v-icon medium>mdi-file-document-box-search</v-icon> 查询
          </v-btn>

          <v-btn
            depressed
            color="primary"
          >
            <v-icon medium>mdi-file-document-box-search</v-icon> 全清
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="dialog=!dialog"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <el-table
            border
            :data="filterList"
            style="width: 100%;"
            height="800"
          >
            <template v-for="(col ,index) in columns">
              <el-table-column
                :prop="col.columnName"
                :label="col.text"
                :key="index"
              >
              </el-table-column>
            </template>

          </el-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
/**
 * 查询商品编码
 */
export default {
  data() {
    return {
      columns: [
        {
          text: "商品编码",
          columnName: ""
        },
        {
          text: "商品名称",
          columnName: ""
        },
        {
          text: "商品规格",
          columnName: ""
        },
        {
          text: "生产厂家",
          columnName: ""
        },
        {
          text: "单位",
          columnName: ""
        },
        {
          text: "剂型",
          columnName: ""
        }
      ],
      resultList: [],
      cacheSearch: ""
    };
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    gcode: {
      type: String,
      default: ""
    }
  },
  computed: {
    filterList() {
      if (search) {
        return resultList.filter(function(dataNews) {
          return Object.keys(dataNews).some(function(key) {
            return (
              String(dataNews[key])
                .toLowerCase()
                .indexOf(search) > -1
            );
          });
        });
      }
    }
  },
  created() {
    this.$watch(
      "gcode",
      debounce(key => {
        // newQuery为输入的值
        this.cacheSearch = key;
      }, 1200)
    );
  },
  methods: {
    async getGcodeByKeyWord() {
      let param = {
        itemid: itemid,
        dept,
        mark: "1",
        sqlstr,
        pkgtype,
        whsid: "hmis_gg_01",
        appProject: "dtc",
        appVersion: "hmis_gg_01"
      };

      var resultData = await this.$commonService.executeService(
        "dtcService",
        "getInvenstrategyInfoList",
        param,
        true
      );

      if (!resultData || resultData.resultKey == "-1") {
      } else {
        console.log(resultData);
        let list = resultData.dataList;
        this.resultList = list;
      }
    }
  }
};
</script>