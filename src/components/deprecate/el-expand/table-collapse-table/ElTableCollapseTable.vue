<template>
  <div class="el-table-collapse-table-wrp">
    <div class="el-table-collapse-table" @scroll="scrollChangeStatus" @resize="fixedLogic">
      <div class="el-table-collapse-table-header" :style="'min-width: ' + allWidth + 'px'">
        <el-row class="el-table-collapse-table-row">
          <template v-if="dataTableList.needSel">
            <el-col style="width: 42px" :span="1">
              <el-checkbox :indeterminate="!isAllPick" v-model="dataTableList.isAllPick" @change="pickAll" @click.native.stop="cleanEvent"></el-checkbox>
            </el-col>
          </template>
          <el-col v-for="(item, index) in dataColumn" :key="index" :style="'width: ' + (item.width ? item.width + 'px' : 'auto')" :span="item.span ? item.span : 3">
            <strong>{{ item.label }}</strong>
          </el-col>
          <el-col style="width: 80px" :span="2">
            <strong>展开详情</strong>
          </el-col>
        </el-row>
      </div>
      <div class="el-table-collapse-table-body" :style="'min-width: ' + allWidth + 'px'">
        <template v-if="dataTableList.dataList.length">
          <el-row v-for="(item, index) in dataTableList.dataList" :key="index">
            <el-row class="el-table-collapse-table-row" @click.native="showCollapse(index, $event)">
              <el-col style="width: 42px" :span="1" v-if="dataTableList.needSel">
                <el-checkbox v-model="item.isPicked" @change="changePick" @click.native.stop="cleanEvent"></el-checkbox>
              </el-col>
              <el-col v-for="(item2, index2) in dataColumn" :style="'width: ' + (item2.width ? item2.width + 'px' : 'auto')" :key="index2" :span="item2.span ? item2.span : 3">
                <template v-if="item2.prop">
                  <el-tooltip placement="top" effect="dark" :open-delay="300">
                    <template v-if="item2.format">
                      <div slot="content">
                        {{ item.dataDetail[0][item2.prop] ? item2.format(item.dataDetail[0][item2.prop]) : '暂无' + item2.label }}
                      </div>
                      <div class="table-text">
                        {{ item.dataDetail[0][item2.prop] ? item2.format(item.dataDetail[0][item2.prop]) : '暂无' + item2.label }}
                      </div>
                    </template>
                    <template v-else>
                      <div slot="content">
                        {{ item.dataDetail[0][item2.prop] ? item.dataDetail[0][item2.prop] : '暂无' + item2.label }}
                      </div>
                      <div class="table-text">
                        {{ item.dataDetail[0][item2.prop] ? item.dataDetail[0][item2.prop] : '暂无' + item2.label }}
                      </div>
                    </template>
                  </el-tooltip>
                </template>
                <template v-else>
                  <template v-if="!dataTableList.isJSX">
                    <slot :name="'col-slot-' + (index + 1) + '-' + (index2 + 1)"></slot>
                  </template>
                  <template v-else>
                    <slot-cell
                      :render="item2.render"
                      :index="index2"
                      :row="item.dataDetail[0]"
                      :column="item2"
                    ></slot-cell>
                  </template>
                </template>
              </el-col>
              <el-col style="width: 80px" :span="2">
                <el-switch
                  active-color="#1a5a97"
                  v-model="item.collapseShow"
                  :disabled="!item.hasCollapse"
                  @click.native.stop="switchEvent(index)"
                >
                </el-switch>
              </el-col>
            </el-row>
            <el-row v-loading="item.loadingStatus">
              <div class="collapse-ctx" @click="cleanData">
                <template v-if="item.hasCollapse && item.collapseShow">
                  <slot :name="'collapse-' + index"></slot>
                </template>
              </div>
            </el-row>
          </el-row>
        </template>
        <template v-else>
          <div class="no-data" :style="'width: ' + allWidth + 'px'">暂无数据</div>
        </template>
      </div>
    </div>
    <div v-if="leftShow" :class="['el-table-collapse-table', 'fixed', scrollStatus !== 'left' ? 'left-shadow' : '']" :style="'width: ' + allFixedLeftWidth + 'px; height: ' + tableHeight + 'px'">
      <div class="el-table-collapse-fixed-wrp">
        <div class="el-table-collapse-table-header" :style="'width: ' + allWidth + 'px'">
          <el-row class="el-table-collapse-table-row">
            <template v-if="dataTableList.needSel">
              <el-col style="width: 42px" :span="1">
                <el-checkbox :indeterminate="!isAllPick" v-model="dataTableList.isAllPick" @change="pickAll" @click.native.stop="cleanEvent"></el-checkbox>
              </el-col>
            </template>
            <el-col v-for="(item, index) in dataColumn" :key="index" :style="'width: ' + (item.width ? item.width + 'px' : 'auto')" :span="item.span ? item.span : 3">
              <strong>{{ item.label }}</strong>
            </el-col>
            <el-col style="width: 80px" :span="2">
              <strong>展开详情</strong>
            </el-col>
          </el-row>
        </div>
        <div class="el-table-collapse-table-body" :style="'width: ' + allWidth + 'px'">
          <template v-if="dataTableList.dataList.length">
            <el-row v-for="(item, index) in dataTableList.dataList" :key="index">
              <el-row class="el-table-collapse-table-row" @click.native="showCollapse(index, $event)">
                <el-col style="width: 42px" :span="1" v-if="dataTableList.needSel">
                  <el-checkbox v-model="item.isPicked" @change="changePick" @click.native.stop="cleanEvent"></el-checkbox>
                </el-col>
                <el-col v-for="(item2, index2) in dataColumn" :style="'width: ' + (item2.width ? item2.width + 'px' : 'auto')" :key="index2" :span="item2.span ? item2.span : 3">
                  <template v-if="item2.prop">
                    <el-tooltip placement="top" effect="dark" :open-delay="300">
                      <template v-if="item2.format">
                        <div slot="content">
                          {{ item.dataDetail[0][item2.prop] ? item2.format(item.dataDetail[0][item2.prop]) : '暂无' + item2.label }}
                        </div>
                        <div class="table-text">
                          {{ item.dataDetail[0][item2.prop] ? item2.format(item.dataDetail[0][item2.prop]) : '暂无' + item2.label }}
                        </div>
                      </template>
                      <template v-else>
                        <div slot="content">
                          {{ item.dataDetail[0][item2.prop] ? item.dataDetail[0][item2.prop] : '暂无' + item2.label }}
                        </div>
                        <div class="table-text">
                          {{ item.dataDetail[0][item2.prop] ? item.dataDetail[0][item2.prop] : '暂无' + item2.label }}
                        </div>
                      </template>
                    </el-tooltip>
                  </template>
                  <template v-else>
                    <template v-if="!dataTableList.isJSX">
                      <slot :name="'col-slot-' + (index + 1) + '-' + (index2 + 1)"></slot>
                    </template>
                    <template v-else>
                      <slot-cell
                        :render="item2.render"
                        :index="index2"
                        :row="item.dataDetail[0]"
                        :column="item2"
                      ></slot-cell>
                    </template>
                  </template>
                </el-col>
                <el-col style="width: 80px" :span="2">
                  <el-switch
                    active-color="#1a5a97"
                    v-model="item.collapseShow"
                    :disabled="!item.hasCollapse"
                    @click.native.stop="switchEvent(index)"
                  >
                  </el-switch>
                </el-col>
              </el-row>
              <el-row class="op-bg">
                <template v-if="item.hasCollapse && item.collapseShow">
                  <div class="collapse-ctx-placeholder op-bg" :style="'height: ' + (item.collapseHeight ? item.collapseHeight : '0') + 'px'"></div>
                </template>
              </el-row>
            </el-row>
          </template>
          <template v-else>
            <div class="no-data" :style="'width: ' + allWidth + 'px'">暂无数据</div>
          </template>
        </div>
      </div>
    </div>
    <div v-if="rightShow" :class="['el-table-collapse-table', 'fixed-right', scrollStatus !== 'right' ? 'right-shadow' : '']" :style="'width: ' + allFixedRightWidth + 'px; height: ' + tableHeight + 'px'">
      <div class="el-table-collapse-fixed-wrp">
        <div class="el-table-collapse-table-header" :style="'width: ' + allWidth + 'px'">
          <el-row class="el-table-collapse-table-row">
            <template v-if="dataTableList.needSel">
              <el-col style="width: 42px" :span="1">
                <el-checkbox :indeterminate="!isAllPick" v-model="dataTableList.isAllPick" @change="pickAll" @click.native.stop="cleanEvent"></el-checkbox>
              </el-col>
            </template>
            <el-col v-for="(item, index) in dataColumn" :key="index" :style="'width: ' + (item.width ? item.width + 'px' : 'auto')" :span="item.span ? item.span : 3">
              <strong>{{ item.label }}</strong>
            </el-col>
            <el-col style="width: 80px" :span="2">
              <strong>展开详情</strong>
            </el-col>
          </el-row>
        </div>
        <div class="el-table-collapse-table-body" :style="'width: ' + allWidth + 'px'">
          <template v-if="dataTableList.dataList.length">
            <el-row v-for="(item, index) in dataTableList.dataList" :key="index">
              <el-row class="el-table-collapse-table-row" @click.native="showCollapse(index, $event)">
                <el-col style="width: 42px" :span="1" v-if="dataTableList.needSel">
                  <el-checkbox v-model="item.isPicked" @change="changePick" @click.native.stop="cleanEvent"></el-checkbox>
                </el-col>
                <el-col v-for="(item2, index2) in dataColumn" :style="'width: ' + (item2.width ? item2.width + 'px' : 'auto')" :key="index2" :span="item2.span ? item2.span : 3">
                  <template v-if="item2.prop">
                    <el-tooltip placement="top" effect="dark" :open-delay="300">
                      <template v-if="item2.format">
                        <div slot="content">
                          {{ item.dataDetail[0][item2.prop] ? item2.format(item.dataDetail[0][item2.prop]) : '暂无' + item2.label }}
                        </div>
                        <div class="table-text">
                          {{ item.dataDetail[0][item2.prop] ? item2.format(item.dataDetail[0][item2.prop]) : '暂无' + item2.label }}
                        </div>
                      </template>
                      <template v-else>
                        <div slot="content">
                          {{ item.dataDetail[0][item2.prop] ? item.dataDetail[0][item2.prop] : '暂无' + item2.label }}
                        </div>
                        <div class="table-text">
                          {{ item.dataDetail[0][item2.prop] ? item.dataDetail[0][item2.prop] : '暂无' + item2.label }}
                        </div>
                      </template>
                    </el-tooltip>
                  </template>
                  <template v-else>
                    <template v-if="!dataTableList.isJSX">
                      <slot :name="'col-slot-' + (index + 1) + '-' + (index2 + 1)"></slot>
                    </template>
                    <template v-else>
                      <slot-cell
                        :render="item2.render"
                        :index="index2"
                        :row="item.dataDetail[0]"
                        :column="item2"
                      ></slot-cell>
                    </template>
                  </template>
                </el-col>
                <el-col style="width: 80px" :span="2">
                  <el-switch
                    active-color="#1a5a97"
                    v-model="item.collapseShow"
                    :disabled="!item.hasCollapse"
                    @click.native.stop="switchEvent(index)"
                  >
                  </el-switch>
                </el-col>
              </el-row>
              <el-row class="op-bg">
                <template v-if="item.hasCollapse && item.collapseShow">
                  <div class="collapse-ctx-placeholder" :style="'height: ' + (item.collapseHeight ? item.collapseHeight : '0') + 'px'"></div>
                </template>
              </el-row>
            </el-row>
          </template>
          <template v-else>
            <div class="no-data" :style="'width: ' + allWidth + 'px'">暂无数据</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SlotCell from './expand'
import { Popover } from 'element-ui'
import Bus from '../../../../../../assets/js/bus'

export default {
  name: 'ElTableCollapseTable',
  components: {
    SlotCell,
    ElPopover: Popover
  },
  props: {
    dataTableList: {
      type: Object
    },
    dataColumn: {
      type: Array
    },
    collapseShowTrigger: {
      type: Function,
      default: function (index) {
        console.log('当前展开的数据索引是：' + index)
      }
    },
    updateFlag: {
      type: Boolean
    }
  },
  data () {
    return {
      tableHeight: '',
      leftShow: false,
      rightShow: false,
      scrollStatus: 'left'
    }
  },
  mounted: function () {
    let self = this
    self.setTableHeight()
    self.cleanData()
    self.fixedLogic()
    // 监听窗口resize事件
    Bus.$on('windowResize', function () {
      self.fixedLogic()
    })
  },
  updated: function () {
    let self = this
    self.setTableHeight()
    self.cleanData()
  },
  methods: {
    pickAll: function () {
      let self = this
      let isAllPick = self.dataTableList.isAllPick
      self.dataTableList.dataList.forEach(function (item, index) {
        if (isAllPick) {
          item.isPicked = true
        } else {
          item.isPicked = false
        }
      })
    },
    changePick: function () {
      let self = this
      let pickNum = 0
      self.dataTableList.dataList.forEach(function (item, index) {
        if (item.isPicked) {
          pickNum++
        }
      })
      if (pickNum === self.dataTableList.dataList.length && pickNum !== 0) {
        self.dataTableList.isAllPick = true
      } else {
        self.dataTableList.isAllPick = false
      }
    },
    showCollapse: function (index, e) {
      let self = this
      if (self.dataTableList.dataList[index].hasCollapse) {
        // 判断是不是点击行
        self.dataTableList.dataList[index].collapseShow = !self.dataTableList.dataList[index].collapseShow
        if (self.dataTableList.dataList[index].hasCollapse) {
          if (self.dataTableList.dataList[index].collapseShow) {
            self.collapseShowTrigger(index)
            self.$nextTick(function () {
              let collapseHeight = self.$el.querySelectorAll('.el-table-collapse-table')[0].querySelectorAll('.collapse-ctx')[index].clientHeight
              self.dataTableList.dataList[index].collapseHeight = collapseHeight
            })
          }
        }
      }
    },
    switchEvent: function (index) {
      let self = this
      if (self.dataTableList.dataList[index].hasCollapse) {
        if (self.dataTableList.dataList[index].collapseShow) {
          self.collapseShowTrigger(index)
          self.$nextTick(function () {
            let collapseHeight = self.$el.querySelectorAll('.el-table-collapse-table')[0].querySelectorAll('.collapse-ctx')[index].clientHeight
            self.dataTableList.dataList[index].collapseHeight = collapseHeight
          })
        }
      }
    },
    setTableHeight: function () {
      let self = this
      self.$nextTick(function () {
        if (self.leftShow && self.rightShow) {
          let curHeight = self.$el.querySelectorAll('.el-table-collapse-fixed-wrp')[0].clientHeight
          if (curHeight !== self.tableHeight) {
            self.tableHeight = curHeight
          }
        }
      })
    },
    cleanData: function () {
      let self = this
      self.$nextTick(function () {
        self.dataTableList.dataList.forEach(function (item, index) {
          let collapseHeight = self.$el.querySelectorAll('.el-table-collapse-table')[0].querySelectorAll('.collapse-ctx')[index].clientHeight
          self.dataTableList.dataList[index].collapseHeight = collapseHeight
        })
      })
    },
    fixedLogic: function () {
      // 判断是否出现滚动条
      let self = this
      let outTableWidth = self.$el.clientWidth
      let inTableWidth = self.$el.querySelectorAll('.el-table-collapse-table .el-table-collapse-table-header')[0].clientWidth
      if (outTableWidth < inTableWidth) {
        self.leftShow = true
        self.rightShow = true
      } else {
        self.leftShow = false
        self.rightShow = false
      }
    },
    scrollChangeStatus: function () {
      let self = this
      // 判断滚动条的位置
      let scrollLeft = self.$el.querySelector('.el-table-collapse-table').scrollLeft
      let scrollWidth = self.$el.querySelector('.el-table-collapse-table').scrollWidth
      if (scrollLeft === 0) {
        self.scrollStatus = 'left'
      } else if (self.$el.clientWidth + scrollLeft === scrollWidth) {
        self.scrollStatus = 'right'
      } else {
        self.scrollStatus = 'middle'
      }
    },
    cleanEvent: function () {
      // 清除事件冒泡
    }
  },
  computed: {
    allWidth: function () {
      let self = this
      let result = self.dataColumn.reduce(function (sum, iv) {
        if (sum.width) {
          sum = sum.width
        }
        if (iv.width) {
          return sum + iv.width
        } else {
          return sum
        }
      })
      if (self.dataTableList.needSel) {
        return result + 122
      } else {
        return result + 80
      }
    },
    allFixedLeftWidth: function () {
      let self = this
      let result = self.dataColumn.reduce(function (sum, iv) {
        if (sum.width) {
          if (sum.fixed === 'left' || sum.fixed === true) {
            sum = sum.width
          } else {
            sum = 0
          }
        } else {
          sum = 0
        }
        if (iv.fixed === 'left' || iv.fixed === true) {
          if (iv.width) {
            return sum + iv.width
          } else {
            return sum
          }
        } else {
          return sum
        }
      })
      if (typeof result === 'object') {
        result = 0
      }
      if (self.dataTableList.needSel) {
        return result + 42
      } else {
        return result
      }
    },
    allFixedRightWidth: function () {
      let self = this
      let result = self.dataColumn.reduce(function (sum, iv) {
        if (sum.width) {
          if (sum.fixed === 'right') {
            sum = sum.width
          } else {
            sum = 0
          }
        } else {
          sum = 0
        }
        if (iv.fixed === 'right') {
          if (iv.width) {
            return sum + iv.width
          } else {
            return sum
          }
        } else {
          return sum
        }
      })
      if (typeof result === 'object') {
        result = 0
      }
      return result + 81
    },
    isAllPick: function () {
      let self = this
      let pickNum = 0
      self.dataTableList.dataList.forEach(function (item, index) {
        if (item.isPicked) {
          pickNum++
        }
      })
      return (pickNum === self.dataTableList.dataList.length || pickNum === 0)
    }
  },
  watch: {
    updateFlag: function () {
      let self = this
      self.cleanData()
    }
  }
}
</script>

<style lang="scss">
  @import "../../../../../../assets/scss/component/element-expand/eltablecollapsetable";
</style>
