<template>
  <div>

    <el-card>
      <div slot="header" class="clearfix">
          <span>高级搜索</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="SearchCharge"><i class="el-icon-search"></i> 查询</el-button>
      </div>

      <el-row :gutter="24" class="search-el-row">
        <el-form :model="searchInfo">
          <el-col :span="6" class="el-col">
            <el-form-item label="所属月份">
              <el-date-picker
                size="small"
                v-model="searchInfo.month"
                type="month"
                value-format="yyyy-MM-dd"
                placeholder="请选择所属月份">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="el-col">
            <el-form-item label="源币种">
              <el-select placeholder="请选择源币种" size="small" v-model="searchInfo.sourceCurrency">
                <el-option label="USD" value="1"></el-option>
                <el-option label="HKD" value="2"></el-option>
                <el-option label="CNY" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

    </el-card>

    <el-card style="margin-top: 20px;">
      <el-table
        :data="tableData"
        :border="true"
        style="width: 100%">
        <el-table-column
          label="所属月份"
          width="150px"
          prop="month">
        </el-table-column>
        <el-table-column
          label="发布时间"
          width="150px"
          prop="publishDate">
        </el-table-column>
        <el-table-column
          label="状态"
          width="150px"
          prop="state">
        </el-table-column>
        <el-table-column
          label="源币种"
          width="150px"
          prop="sourceCurrency">
        </el-table-column>
        <el-table-column
          label="目标币种"
          width="150px"
          prop="targetCurrency">
        </el-table-column>
        <el-table-column
          label="汇率(基于100)"
          prop="exRate">
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
import Base from '@js/base'

export default {
  name: 'exchangeRate',
  extends: Base,
  data () {
    return {
      // 搜索条件 Obj
      searchInfo: {
        month:"",
        sourceCurrency:"",
      },
      tableData: [
        {
          id:1,
          month:"2020.06",
          publishDate:"2020.06.01",
          state:"使用中",
          sourceCurrency:"USD",
          targetCurrency:"CNY",
          exRate:"699.89",
        }, 
        {
          id:2,
          month:"2020.07",
          publishDate:"2020.07.01",
          state:"已过期",
          sourceCurrency:"HKD",
          targetCurrency:"CNY",
          exRate:"90.30",
        }
      ],

    }
  },
  methods: {

    // 搜索收费条目
    SearchCharge(){
      let _self = this;
      console.log(_self.searchInfo)
    },

  }
}
</script>

<!-- 样式设置 scoped 属性,Table 行底色不显示-->
<!-- <style scoped lang="scss"> -->
<style lang="scss">
.search-el-row .el-col{
  height: 80px;
}

</style>