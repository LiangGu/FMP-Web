<template>
  <div>

    <el-card>
      <div slot="header" class="clearfix">
          <span>高级搜索</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="SearchCharge"><i class="el-icon-search"></i> 查询</el-button>
      </div>

      <el-row :gutter="24" class="search-el-row">
        <el-form :model="searchInfo">
          <el-col :span="5" class="el-col">
            <el-form-item label="费用类型">
              <el-select placeholder="请选择" size="small" v-model="searchInfo.chargeType">
                <el-option label="运费" value="1"></el-option>
                <el-option label="起运港费" value="2"></el-option>
                <el-option label="目的港费" value="3"></el-option>
                <el-option label="关务" value="4"></el-option>
                <el-option label="仓库" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" class="el-col">
            <el-form-item label="费用名称">
              <el-input placeholder="请输入内容" size="small" v-model="searchInfo.chargeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="el-col">
            <el-form-item label="贸易条款">
              <el-select placeholder="请选择" size="small" v-model="searchInfo.tradeType">
                <el-option label="ALL" value="1"></el-option>
                <el-option label="FOB" value="2"></el-option>
                <el-option label="FCA" value="3"></el-option>
                <el-option label="EXW" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="el-col">
            <el-form-item label="运输模式">
              <el-select placeholder="请选择" size="small" v-model="searchInfo.transType">
                <el-option label="FCL" value="1"></el-option>
                <el-option label="LCL" value="2"></el-option>
                <el-option label="Air" value="3"></el-option>
                <el-option label="Rail" value="4"></el-option>
                <el-option label="Drayage" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="el-col">
            <el-form-item label="基本费用/额外费用">
              <el-select placeholder="请选择" size="small" v-model="searchInfo.type">
                <el-option label="全部" value="1"></el-option>
                <el-option label="基本费用" value="2"></el-option>
                <el-option label="额外费用" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

    </el-card>

    <el-card style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <el-button type="primary" size="small" icon="el-icon-circle-plus" @click="AddCharge">添加收费条目</el-button>
      </div>
      <el-table
        :data="tableData"
        :border="true"
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column
          label="费用类型"
          width="100px"
          prop="chargeType">
        </el-table-column>
        <el-table-column
          label="费用名称"
          width="200px"
          prop="chargeName">
        </el-table-column>
        <el-table-column
          label="贸易条款"
          width="100px"
          prop="tradeType">
        </el-table-column>
        <el-table-column
          label="运输模式"
          width="100px"
          prop="transType">
        </el-table-column>
        <el-table-column
          label="基本费用 / 额外费用"
          prop="type">
        </el-table-column>
        <el-table-column align="right" style="padding-right: unset;">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEditItem(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              style="margin-left: 10px;"
              @click="handleFrozenItem(scope.$index, scope.row)">冻结
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 收费条目编辑弹框 -->
    <el-dialog
      title="修改收费条目"
      :visible.sync="EditChargeVisible"
      width="1000px"
      :before-close="handleDialogClose"
    >
      <el-row :gutter="24" class="el-dialog-el-row">
        <el-form :model="CurCharge">
          <el-col :span="5" class="el-col">
            <el-form-item label="费用类型">
              <el-select placeholder="请选择" size="small" v-model="CurCharge.chargeType">
                <el-option label="运费" value="1"></el-option>
                <el-option label="起运港费" value="2"></el-option>
                <el-option label="目的港费" value="3"></el-option>
                <el-option label="关务" value="4"></el-option>
                <el-option label="仓库" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" class="el-col">
            <el-form-item label="费用名称">
              <el-input placeholder="请输入内容" size="small" v-model="CurCharge.chargeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="el-col">
            <el-form-item label="贸易条款">
              <el-select placeholder="请选择" size="small" v-model="CurCharge.tradeType">
                <el-option label="ALL" value="1"></el-option>
                <el-option label="FOB" value="2"></el-option>
                <el-option label="FCA" value="3"></el-option>
                <el-option label="EXW" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="el-col">
            <el-form-item label="运输模式">
              <el-select placeholder="请选择" size="small" v-model="CurCharge.transType">
                <el-option label="FCL" value="1"></el-option>
                <el-option label="LCL" value="2"></el-option>
                <el-option label="Air" value="3"></el-option>
                <el-option label="Rail" value="4"></el-option>
                <el-option label="Drayage" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="el-col">
            <el-form-item label="基本费用/额外费用">
              <el-select placeholder="请选择" size="small" v-model="CurCharge.type">
                <el-option label="全部" value="1"></el-option>
                <el-option label="基本费用" value="2"></el-option>
                <el-option label="额外费用" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer">
        <el-row :gutter="24" style="margin: 0;">
          <el-button @click="SaveCharge" size="small">保存</el-button>
        </el-row>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Base from '@js/base'

export default {
  name: 'charge',
  extends: Base,
  data () {
    return {
      // 搜索条件 Obj
      searchInfo: {
        chargeType: null,
        chargeName: "",
        tradeType: null,
        transType: null,
        type: null,
      },
      tableData: [
        {
          id:1,
          chargeType:"1",
          chargeName:"费目01",
          tradeType:"1",
          transType:"1",
          type:"1",
          frozen:true,
        }, 
        {
          id:2,
          chargeType:"2",
          chargeName:"费目01",
          tradeType:"2",
          transType:"2",
          type:"2",
          frozen:false,
        }
      ],
      EditChargeVisible: false,
      CurCharge: {},
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.frozen) {
        return 'warning-row';
      } 
      return '';
    },

    // 搜索收费条目
    SearchCharge(){
      let _self = this;
      console.log(_self.searchInfo)
    },
    // 添加收费条目
    AddCharge(){
      let _self = this;
      _self.EditChargeVisible = true;
      _self.CurCharge = {
        id:`NEW_ITEM_ID_${new Date().getTime()}`,
        chargeType:null,
        chargeName:"",
        tradeType:null,
        transType:null,
        type:null,
        frozen:false,
      };
    },
    // 编辑费目
    handleEditItem(file, fileList){
      console.log(file, fileList)
      let _self = this;
      _self.EditChargeVisible = true;
      _self.CurCharge = fileList;
    },
    // 关闭弹框
    handleDialogClose(){
      let _self = this;
      // 清空用户选择
      _self.CurCharge = {};
      _self.EditChargeVisible = false;
    },
    // 冻结费目
    handleFrozenItem(file, fileList){
      console.log(file, fileList)
    },
    // 保存收费条目
    SaveCharge(){
      let _self = this;
      console.log(_self.CurCharge)
    }
  }
}
</script>

<!-- 样式设置 scoped 属性,Table 行底色不显示-->
<!-- <style scoped lang="scss"> -->
<style lang="scss">
.search-el-row .el-col{
  height: 80px;
}
.el-table .warning-row {
  background:#f3f3f3;
}
.el-dialog__body{
  padding: 10px 20px;
}

</style>