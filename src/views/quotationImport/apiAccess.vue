<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
        <span>API接入记录</span>
        <div style="float: right; padding: 3px 0">
          <el-input placeholder="请输入搜索内容" v-model="searchInfo" size="small" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="QuoSearch"></el-button>
          </el-input>
        </div>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="上传成功" name="first">
        <el-table
          :data="tableData1"
          style="width: 100%">
          <el-table-column
            label="文档名称"
            width="200px"
            prop="docName">
          </el-table-column>
          <el-table-column
            label="导入批次"
            width="100px"
            prop="importNum">
          </el-table-column>
          <el-table-column
            label="是否公开"
            width="100px"
            prop="isOpen">
          </el-table-column>
          <el-table-column
            label="上传日期"
            width="100px"
            prop="upDate">
          </el-table-column>
          <el-table-column
            label="所属公司"
            prop="branch">
          </el-table-column>
          <el-table-column
            label="上传人"
            width="100px"
            prop="upUser">
          </el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleViewItem(scope.$index, scope.row)">查看</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleImportInfo(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="已下架" name="second">
        <el-table
          :data="tableData2"
          style="width: 100%">
          <el-table-column
            label="文档名称"
            width="200px"
            prop="docName">
          </el-table-column>
          <el-table-column
            label="是否公开"
            width="100px"
            prop="isOpen">
          </el-table-column>
          <el-table-column
            label="上传日期"
            width="100px"
            prop="upDate">
          </el-table-column>
          <el-table-column
            label="所属公司"
            prop="branch">
          </el-table-column>
          <el-table-column
            label="上传人"
            width="100px"
            prop="upUser">
          </el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleViewItem(scope.$index, scope.row)">查看</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleImportInfo(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
  </el-tabs>

  </el-card>
</template>

<script>
import Base from '@js/base'

export default {
  name: 'apiAccess',
  extends: Base,
  data () {
    return {
      searchInfo: "",
      activeName: "first",
      tableData1: [
        {
          docName:"文件",
          importNum:"45645",
          isOpen:"是",
          upDate:"2016-05-02",
          branch:"香港船务",
          upUser: 'Iverson',
        }, {
          docName:"文件",
          importNum:"45645",
          isOpen:"是",
          upDate:"2016-05-02",
          branch:"香港船务",
          upUser: 'Tian',
        }
      ],
      tableData2: [
        {
          docName:"文件",
          isOpen:"是",
          upDate:"2016-05-02",
          branch:"上海伟运",
          upUser: 'Iverson',
        }, {
          docName:"文件",
          isOpen:"是",
          upDate:"2016-05-02",
          branch:"上海伟运",
          upUser: 'Tian',
        }
      ],


    }
  },
  //加载页面之后 - 默认到当前激活的 Tab 地址
  mounted() {
    let _self = this;

  },

  methods: {
    // 运价搜索
    QuoSearch(){
      let _self = this;
      console.log(_self.searchInfo)
    },
    // Tab 切换
    handleClick(e){
      // console.log(this.activeName)
    },
    // 操作列按钮方法
    handleViewItem(scope,el) {
      console.log(scope,el)
    },
    handleImportInfo(scope,el) {
      console.log(scope,el)
    },

  }
}
</script>

<style scoped lang="scss">
  /* @import "../../../assets/scss/home/home.scss"; */
  .box-card{
    margin-top: 10px;
    font-size: 16px;
  }
</style>