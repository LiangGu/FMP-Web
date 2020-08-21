<template>
  <el-card>

    <el-table
      :data="tableData"
      :border="true"
      style="width: 100%">
      <el-table-column
        label="主运输模式"
        width="150px"
        prop="mainTransType">
      </el-table-column>
      <el-table-column
        label="偏好公司"
        width="500px"
        prop="companyName">
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

    <!-- 添加个人偏好弹框 -->
    <el-dialog
      title="添加个人偏好"
      :visible.sync="EditPersonalPreferencesVisible"
      width="500px"
      :before-close="handleDialogClose"
    >
      <el-row :gutter="24" class="el-dialog-el-row">
        <el-form ref="CurPersonalPreferencesForm" :model="CurPersonalPreferences" label-width="100px">
          <el-col :span="24" class="el-col">
            <el-form-item label="主运输模式">
              <el-select placeholder="请选择" size="small" v-model="CurPersonalPreferences.mainTransType">
                <el-option label="不限" value="1"></el-option>
                <el-option label="海运" value="2"></el-option>
                <el-option label="空运" value="3"></el-option>
                <el-option label="铁路" value="4"></el-option>
                <el-option label="公路" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="el-col">
            <el-form-item label="偏好公司">
              <el-autocomplete
                v-model="CurPersonalPreferences.companyName"
                size="small"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer">
        <el-row :gutter="24" style="margin: 0;">
          <el-button @click="SavePersonalPreferences" size="small">保存</el-button>
        </el-row>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
import Base from '@js/base'

export default {
  name: 'personalPreferences',
  extends: Base,
  data () {
    return {
      tableData: [
        {
          id:1,
          mainTransType:"1",
          companyName:"中国外运华南有限公司",
        },
        {
          id:2,
          mainTransType:"2",
          companyName:"香港船务代理有限公司",
        },
      ],
      EditPersonalPreferencesVisible: false,
      // 边打边搜
      restaurants: [],
      CurPersonalPreferences: '',
      timeout:  null
    }
  },
  // 取全部边打边搜数据
  mounted() {
    let _self = this;
    _self.restaurants = _self.loadAll();
  },
  methods: {
    // ---------- 边打边搜方法
    loadAll() {
      return [
        { "value": "香港船务代理有限公司", "key": 1 },
        { "value": "中国外运华南有限公司", "key": 2 },
        { "value": "中国外运华东有限公司", "key": 2 },
      ];
    },
    querySearchAsync(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (CurPersonalPreferences) => {
        return (CurPersonalPreferences.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    // ---------- 边打边搜方法

    // 编辑个人偏好
    handleEditItem(file, fileList){
      console.log(file, fileList)
      let _self = this;
      _self.EditPersonalPreferencesVisible = true;
      _self.CurPersonalPreferences = fileList;
    },
    // 关闭弹框
    handleDialogClose(){
      let _self = this;
      // 清空用户选择
      _self.CurPersonalPreferences = {};
      _self.EditPersonalPreferencesVisible = false;
    },
    // 删除个人偏好
    handleDeleteItem(file, fileList){
      console.log(file, fileList)
    },
    // 保存个人偏好
    SavePersonalPreferences(){

    },
  }
}
</script>

<style lang="scss">
.el-dialog__body{
  padding: 10px 20px;
}
</style>