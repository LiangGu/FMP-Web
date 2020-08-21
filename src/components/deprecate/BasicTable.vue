<template>
  <div>
    <!--表格-->
    <el-table :data="tableData"
              border
              row-key="id"
              align="left"
              :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column v-for="(item, index) in formThead"
                       :key="`col_${index}`"
                       :prop="dropCol[index].prop"
                       :label="item.label"
                       sortable
                       :filters="item.filter"
                       :filter-method="filterTag"
                       filter-placement="bottom-end">
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagebox">
            <span class="btn_left">
                <i title="剪切列" class="el-icon-menu"
                   style="color:#2B579A;font-size: 16px"
                   @click="colFilterDlgVisible = true"></i>
              <i title="刷新" class="el-icon-refresh" style="color:#2B579A" @click="refresh"></i>
                <!--<img title="剪切列" src="../../../../../static/image/demo/cut.png"/>-->
            </span>
      <div class="pagelist">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageTotal"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!--弹框 剪切列-->
    <el-dialog
      title="剪切列"
      :visible.sync="colFilterDlgVisible"
      width="30%">
      <div class="filter-container">
        <el-checkbox-group v-model="formThead">
          <el-checkbox v-for="(item,index) in dropCol" :label="item" :key="index" style="margin:0 30px 20px 0;">
            {{item.label}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
export default {
  props: {
    // 表格
    dropCol: Array,
    tableData: Array,
    // 分页
    total: Number
  },
  data () {
    return {
      formThead: [],
      currentPage: 1,
      pageTotal: [1, 2, 3, 4],
      pageSize: 1,
      colFilterDlgVisible: false
    }
  },
  mounted () {
    // 阻止默认行为
    document.body.ondrop = function (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    this.columnDrop()
    this.headTable()
  },
  methods: {
    // 调用父页面方法（表格刷新）
    refresh: function () {
      this.$emit('reFresh')
    },
    headTable () {
      this.formThead = this.dropCol
    },
    // 筛选
    filterTag (value, row, column) {
      const property = column['property']
      return row[property] === value || row[property].value === value
    },
    // 列拖拽
    columnDrop () {
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem = this.dropCol[evt.oldIndex]
          this.dropCol.splice(evt.oldIndex, 1)
          this.dropCol.splice(evt.newIndex, 0, oldItem)
        }
      })
    },
    // 分页
    handleSizeChange (val) {
      this.$emit("getPagesize", val)
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.$emit("getCurrentpage",val)
      // console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style scoped>
  .pagebox{
    margin-top: 20px;
    clear: both;
  }
  .pagelist{
    display: inline-block;
    float:right
  }
  .el-checkbox + .el-checkbox {
    margin-left:0px;
  }
 .btn_left i{
   font-size: 18px;
   margin-right: 10px
 }
</style>
