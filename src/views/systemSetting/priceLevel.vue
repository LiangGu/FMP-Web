<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>高级搜索</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="SearchPriceLevel"><i class="el-icon-search"></i> 查询</el-button>
      </div>
  
      <el-row :gutter="24" class="search-el-row">
        <el-form :model="searchInfo">
          <el-col :span="6" class="el-col">
            <el-form-item label="价格等级名称">
              <el-input placeholder="请输入价格等级名称" size="small" v-model="searchInfo.priceLevelName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="el-col">
            <el-form-item label="百分比">
              <el-input placeholder="请输入百分比" size="small" v-model="searchInfo.percentage"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="el-col">
            <el-form-item label="绝对值">
              <el-input placeholder="请输入绝对值" size="small" v-model="searchInfo.absolute"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>

    <el-card style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <el-button type="primary" size="small" icon="el-icon-circle-plus" @click="AddPriceLevel">添加价格等级</el-button>
      </div>
      <el-table
        :data="tableData"
        :border="true"
        style="width: 100%">
        <el-table-column
          label="价格等级名称"
          width="110px"
          align="center"
          prop="priceLevelName">
        </el-table-column>
        <el-table-column
          label="百分比"
          align="center"
          width="400px">

          <el-table-column
            prop="percentage.FCL"
            label="FCL"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="percentage.LCL"
            label="LCL"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="percentage.Air"
            label="Air"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="percentage.Rail"
            label="Rail"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="percentage.Truck"
            label="Truck"
            align="center"
            width="80">
          </el-table-column>

        </el-table-column>
        <el-table-column
          label="绝对值"
          align="center"
          width="400px">

          <el-table-column
            prop="absolute.FCL"
            label="FCL"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="absolute.LCL"
            label="LCL"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="absolute.Air"
            label="Air"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="absolute.Rail"
            label="Rail"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column
            prop="absolute.Truck"
            label="Truck"
            align="center"
            width="60">
          </el-table-column>

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
              @click="handleDeleteItem(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 修改价格等级弹框 -->
    <el-dialog
      title="修改价格等级"
      :visible.sync="EditPriceLevelVisible"
      width="1000px"
      :before-close="handleDialogClose"
    >
      <el-row :gutter="24" class="el-dialog-el-row">

        <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="运输模式"
          prop="chargeType">
        </el-table-column>
        <el-table-column
          label="百分比"
          prop="chargeName">
        </el-table-column>
        <el-table-column
          label="绝对值"
          prop="tradeType">
        </el-table-column>
      </el-table>


      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import Base from '@js/base'

export default {
  name: 'priceLevel',
  extends: Base,
  data () {
    return {
      // 搜索条件 Obj
      searchInfo: {
        priceLevelName: "",
        percentage: "",
        absolute: "",
      },
      tableData: [
        {
          id:1,
          priceLevelName: "1级",
          percentage: {FCL:"5%",LCL:"10%",Air:"10%",Rail:"10%",Truck:"10%",},
          absolute: {FCL:"10",LCL:"5",Air:"20",Rail:"30",Truck:"40",},
        }, 
        {
          id:2,
          priceLevelName: "2级",
          percentage: {FCL:"5%",LCL:"5%",Air:"10%",Rail:"5%",Truck:"10%",},
          absolute: {FCL:"1",LCL:"2",Air:"3",Rail:"4",Truck:"5",},
        }
      ],

      EditPriceLevelVisible: false,
      CurPriceLevel: {},
    }
  },
  methods: {

    // 搜索价格等级
    SearchPriceLevel(){
      let _self = this;
      console.log(_self.searchInfo)
    },
    // 添加价格等级
    AddPriceLevel(){
      let _self = this;
      _self.EditPriceLevelVisible = true;
      _self.CurPriceLevel = {

      };
    },
    // 编辑价格等级
    handleEditItem(file, fileList){
      console.log(file, fileList)
      let _self = this;
      _self.EditPriceLevelVisible = true;
      _self.CurPriceLevel = fileList;
    },
    // 关闭弹框
    handleDialogClose(){
      let _self = this;
      // 清空用户选择
      _self.CurPriceLevel = {};
      _self.EditPriceLevelVisible = false;
    },
    // 删除价格等级
    handleDeleteItem(file, fileList){
      console.log(file, fileList)
    },




  }
}
</script>

<style scoped lang="scss">
.search-el-row .el-col{
  height: 80px;
}

</style>