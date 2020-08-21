<template>
  <div>
    <el-table :data="tableData"
              border
              row-key="id"
              align="left"
              highlight-current-row
    >
      <el-table-column v-for="(item, index) in col"
                       :key="`col_${index}`"
                       :prop="dropCol[index].prop"
                       :label="item.label">
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagebox">
            <span class="btn_left">
              <i title="刷新" class="el-icon-refresh" style="color:#2B579A" @click="refresh"></i>
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
  </div>
</template>
<script>
import Sortable from 'sortablejs'
export default {
  props: {
    // 表格
    dropCol: Array,
    col: Array,
    tableData: Array,
    // 分页
    total: Number
  },
  data () {
    return {
      // 分页
      currentPage: 1,
      pageTotal: [1, 2, 3, 4],
      pageSize: 1
    }
  },
  mounted () {
    // 阻止默认行为 拖拽
    document.body.ondrop = function (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    this.columnDrop()
    this.rowDrop()
  },
  methods: {
    refresh: function () {
      this.$emit('reFresh')
    },
    // 行拖拽
    rowDrop () {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(newIndex, 0, currRow)
        }
      })
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
