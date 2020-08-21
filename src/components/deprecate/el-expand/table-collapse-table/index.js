import TableCollapseTable from './ElTableCollapseTable'
// 这里是重点
const ElTableCollapseTable = {
  install: function (Vue) {
    Vue.component('ElTableCollapseTable', TableCollapseTable)
  }
}

// 导出组件
export default ElTableCollapseTable
