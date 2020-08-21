<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
        <span>录入运价清单</span>
        <div style="float: right; padding: 3px 0">
          <el-input placeholder="请输入搜索内容" v-model="searchInfo" size="small" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="QuoSearch">搜索运价</el-button>
          </el-input>
        </div>
        <div style="float: right; padding: 3px">

          <el-button icon="el-icon-circle-plus" size="small" @click="QuoAdd">添加运价</el-button>
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

  <!-- 手动录入运价弹框 -->
  <el-dialog
    title="运价信息"
    :visible.sync="ManualEntryVisible"
    class="ManualEntry"
    width="700px"
    :before-close="handleDialogClose"
  >
  <el-row :gutter="24" class="el-row">
    <el-col :span="8">
      <span><i class="el-icon-tickets"></i></span>
      <span class="row-label">运价类别</span>
    </el-col>
    <el-col :span="16">
      <el-select placeholder="请选择" size="small" v-model="FreightType">
        <el-option label="海运整柜(OceanFCL)" value="1"></el-option>
        <el-option label="海运拼箱(OceanLCL)" value="2"></el-option>
        <el-option label="铁路(Rail)" value="3"></el-option>
        <el-option label="空运(Air)" value="4"></el-option>
        <el-option label="卡车运费" value="5"></el-option>
        <el-option label="拖车运费" value="6"></el-option>
      </el-select>
    </el-col>
  </el-row>

  <el-row :gutter="24" class="el-row">
    <el-col :span="8">
      <span><i class="el-icon-place"></i></span>
      <span class="row-label">起始地址</span>
    </el-col>
    <el-col :span="16">
    </el-col>
  </el-row>

  <el-row :gutter="24" class="el-row">
    <el-col :span="8">
      <span><i class="el-icon-s-data"></i></span>
      <span class="row-label">发布对象及价格等级</span>
    </el-col>
    <el-col :span="16">
      <div v-if="PublishObjAndPublishObjList.length > 0">
        <div v-for="item in PublishObjAndPublishObjList" v-bind:key="item.ID">
          <el-row :gutter="24" style="padding-top: 0;">
            <el-col :span="12">
              <el-select placeholder="请选择发布对象" size="small" :disabled="true" v-model="item.PublishObj">
                <el-option label="中国外运华南有限公司" value="1"></el-option>
                <el-option label="中国外运华东有限公司" value="2"></el-option>
                <el-option label="中国外运华西有限公司" value="3"></el-option>
                <el-option label="中国外运华北有限公司" value="4"></el-option>
                <el-option label="本人" value="5"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select placeholder="请选择价格等级" size="small" :disabled="true" v-model="item.Pricelevel">
                <el-option label="等级A" value="1"></el-option>
                <el-option label="等级B" value="2"></el-option>
                <el-option label="等级C" value="3"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4" align="right">
              <el-button @click="handDeleteGrade(item.ID)" size="mini" circle><i class="el-icon-remove" style="font-size: 16px;"></i></el-button>
            </el-col>
          </el-row>
        </div>
      </div>

      <div>
        <el-row :gutter="24" style="padding: 0;">
          <el-col :span="12">
            <el-select placeholder="请选择发布对象" size="small" v-model="PublishObj">
              <el-option label="中国外运华南有限公司" value="1"></el-option>
              <el-option label="中国外运华东有限公司" value="2"></el-option>
              <el-option label="中国外运华西有限公司" value="3"></el-option>
              <el-option label="中国外运华北有限公司" value="4"></el-option>
              <el-option label="本人" value="5"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select placeholder="请选择价格等级" size="small" v-model="Pricelevel">
              <el-option label="等级A" value="1"></el-option>
              <el-option label="等级B" value="2"></el-option>
              <el-option label="等级C" value="3"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" align="right">
            <el-button @click="handAddGrade" size="mini" circle><i class="el-icon-circle-plus" style="font-size: 16px;"></i></el-button>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>

  <el-row :gutter="24" class="el-row">
    <el-col :span="8">
      <span><i class="el-icon-refresh"></i></span>
      <span class="row-label">更新方式</span>
    </el-col>
    <el-col :span="16">
      <el-row :gutter="24" style="padding: 0;">
        <el-col :span="24">
          <el-radio label="1" v-model="radioUpdate">清除原有运价,并用本次导入运价完全代替</el-radio>
        </el-col>
        <el-col :span="24" style="margin-top: 10px;">
          <el-radio label="2" v-model="radioUpdate">保留原有运价,本次导入运价为增量补充</el-radio>
        </el-col>
      </el-row>
    </el-col>
  </el-row>

  <el-row :gutter="24" class="el-row">
    <el-col :span="8">
      <span><i class="el-icon-message-solid"></i></span>
      <span class="row-label">过期提醒</span>
    </el-col>
    <el-col :span="16">
      <el-row :gutter="24" style="padding: 0;">
        <el-col :span="24">
          <el-radio label="1" v-model="radioRemind">运价到期前请发邮件或短信通知我</el-radio>
        </el-col>
        <el-col :span="24" style="margin-top: 10px;">
          <el-radio label="2" v-model="radioRemind">不需要提醒</el-radio>
        </el-col>
      </el-row>
    </el-col>
  </el-row>

  <!-- 运价类别 海运整柜(OceanFCL) -->
  <el-row :gutter="24" class="el-row" v-if="FreightType === '1'">
    <el-col :span="8">
      <span><i class="el-icon-files"></i></span>
      <span class="row-label">运价信息</span>
    </el-col>
    <el-col :span="16">
      <el-row :gutter="24">
        <el-col :span="8">
          1
        </el-col>
        <el-col :span="8">
          2
        </el-col>
        <el-col :span="8">
          3
        </el-col>
      </el-row>
      <el-row :gutter="24">
        
      </el-row>
    </el-col>
  </el-row>

  <!-- 运价类别 海运拼箱(OceanLCL)  -->
  <el-row :gutter="24" class="el-row" v-if="FreightType === '2'">
    <el-col :span="8">
      <span><i class="el-icon-files"></i></span>
      <span class="row-label">运价信息</span>
    </el-col>
    <el-col :span="16">
      海运拼箱(OceanLCL)
    </el-col>
  </el-row>

  <!-- 运价类别 铁路(Rail) -->
  <el-row :gutter="24" class="el-row" v-if="FreightType === '3'">
    <el-col :span="8">
      <span><i class="el-icon-files"></i></span>
      <span class="row-label">运价信息</span>
    </el-col>
    <el-col :span="16">
      铁路(Rail)
    </el-col>
  </el-row>

  <!-- 运价类别 空运(Air) -->
  <el-row :gutter="24" class="el-row" v-if="FreightType === '4'">
    <el-col :span="8">
      <span><i class="el-icon-files"></i></span>
      <span class="row-label">运价信息</span>
    </el-col>
    <el-col :span="16">
      空运(Air)
    </el-col>
  </el-row>

  <!-- 运价类别 卡车运费 -->
  <el-row :gutter="24" class="el-row" v-if="FreightType === '5'">
    <el-col :span="8">
      <span><i class="el-icon-files"></i></span>
      <span class="row-label">运价信息</span>
    </el-col>
    <el-col :span="16">
      卡车运费
    </el-col>
  </el-row>

  <!-- 运价类别 拖车运费 -->
  <el-row :gutter="24" class="el-row" v-if="FreightType === '6'">
    <el-col :span="8">
      <span><i class="el-icon-files"></i></span>
      <span class="row-label">运价信息</span>
    </el-col>
    <el-col :span="16">
      拖车运费
    </el-col>
  </el-row>

  </el-dialog>

  </el-card>
</template>

<script>
import Base from '@js/base'

export default {
  name: 'manualEntry',
  extends: Base,
  data () {
    return {
      QuoType: null,
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

      ManualEntryVisible: false,

      // 运价对象
      FreightType: null,
      PublishObjAndPublishObjList: [],
      PublishObj: null,
      Pricelevel: null,
      radioUpdate: '2',
      radioRemind: '2',
    }
  },
  //加载页面之后 - 默认到当前激活的 Tab 地址
  mounted() {
    let _self = this;

  },

  methods: {
    // 添加运价
    QuoAdd(){
      let _self = this;
      _self.ManualEntryVisible = true;
    },

    // 关闭弹框
    handleDialogClose(){
      let _self = this;
      // 清空用户选择

      _self.ManualEntryVisible = false;
    },

    // 添加发布对象及价格等级
    handAddGrade(){
      let _self = this;
      if(_self.PublishObj && _self.Pricelevel){
        _self.PublishObjAndPublishObjList.push({
          ID: `NEW_ITEM_ID_${new Date().getTime()}`,
          PublishObj: _self.PublishObj,
          Pricelevel: _self.Pricelevel,
        });
        // 清空
        _self.PublishObj = null;
        _self.Pricelevel = null;
      }else{
        _self.$message.error('请先选择发布对象和价格等级！')
      }
    },
    // 删除已经添加的发布对象及价格等级
    handDeleteGrade(ID){
      let _self = this;
      _self.PublishObjAndPublishObjList = _self.PublishObjAndPublishObjList.filter(item => item.ID !== ID);
    },





    // 运价搜索
    QuoSearch(){
      let _self = this;
      console.log(_self.searchInfo)
    },
    // Tab 切换
    handleClick(e){
      console.log(this.activeName)
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

  /*手动添加运价样式*/
  .ManualEntry .el-row{
    padding: 10px 0;
    border-bottom: 1px solid #f3f3f3;
  }
  .ManualEntry .el-row .row-label{
    margin-left: 10px;
  }
  .ManualEntry .el-row:last-child{
    padding-top: 10px;
    border-bottom: unset;
  }
</style>