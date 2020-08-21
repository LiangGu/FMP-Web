<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
        <span>导入成功文件清单</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="QuoImport">导入文件</el-button>
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
                @click="handleDownloadDoc(scope.$index, scope.row)">下载</el-button>
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
                @click="handleDownloadDoc(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
  </el-tabs>

    <!-- 文档详情弹框 -->
    <el-dialog
      title="导入详情"
      :visible.sync="ImportDetailVisible"
      class="ImportDetail"
      width="500px"
      :before-close="handleDialogClose"
      
    >
      <el-row :gutter="24" class="el-row">
        <el-col :span="8" >
          <span>文档名称</span>
        </el-col>
        <el-col :span="16" >
          <span v-text="CurDocInfo.docName"></span>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="el-row">
        <el-col :span="8" >
          <span>上传日期</span>
        </el-col>
        <el-col :span="16" >
          <span v-text="CurDocInfo.upDate"></span>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="el-row">
        <el-col :span="8" >
          <span>状态</span>
        </el-col>
        <el-col :span="16" >
          <!-- <span v-text="CurDocInfo.upDate"></span> -->
        </el-col>
      </el-row>
      <el-row :gutter="24" class="el-row">
        <el-col :span="8" >
          <span>发布对象及价格等级</span>
        </el-col>
        <el-col :span="16" >
          <!-- <span v-text="CurDocInfo.upDate"></span> -->
        </el-col>
      </el-row>
      <el-row :gutter="24" class="el-row">
        <el-col :span="8" >
          <span>更新方式</span>
        </el-col>
        <el-col :span="16" >
          <!-- <span v-text="CurDocInfo.upDate"></span> -->
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 导入运价文件弹框 -->
    <el-dialog
      title="导入运价文件"
      :visible.sync="ImportDocVisible"
      class="ImportDoc"
      width="650px"
      :before-close="handleDialogClose"
    >
      <el-row :gutter="24" class="el-row">
        <el-col :span="8">
          <span><i class="el-icon-tickets"></i></span>
          <span class="row-label">所属模板</span>
        </el-col>
        <el-col :span="8">
          <el-select placeholder="请选择" size="small" v-model="ImportDocID">
            <el-option label="海运整箱港到港运费" value="1"></el-option>
            <el-option label="海运拼箱港到港运费" value="2"></el-option>
            <el-option label="空运港到港运费" value="3"></el-option>
            <el-option label="铁路站到站运费" value="4"></el-option>
            <el-option label="卡车运费" value="5"></el-option>
            <el-option label="拖车运费" value="6"></el-option>
            <el-option label="CMA 美加线" value="7"></el-option>
            <el-option label="NVO 美加线" value="8"></el-option>
            <el-option label="HPL 美加线" value="9"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8" align="right">
          <el-button size="small" @click="handleDownloadDocTemp" :disabled="ImportDocID == null">下载模板样本</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="el-row">
        <el-col :span="8">
          <span><i class="el-icon-folder"></i></span>
          <span class="row-label">运价文件</span>
        </el-col>
        <el-col :span="16">
          <el-upload
            ref="upload"
            action="#"
            accept=".xls, .xlsx"
            :auto-upload="false"
            :file-list="fileList"
            :on-change="editFile"
            :before-remove="handleRemove"
          >
          <el-button slot="trigger" size="small" :disabled="fileList.length > 0">浏览文件</el-button>
          </el-upload>
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
      <span slot="footer" class="dialog-footer">
        <el-row :gutter="24">
          <el-col :span="18">
            <el-progress :text-inside="true" :stroke-width="32" :percentage="30" status="success"></el-progress>
          </el-col>
          <el-col :span="6">
            <el-button @click="ImportQuoFiles" size="small"><i class="el-icon-upload"></i> 开始上传</el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>

  </el-card>

</template>

<script>
import Base from '@js/base'

export default {
  name: 'templateImport',
  extends: Base,
  data () {
    return {
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

      ImportDetailVisible: false,
      ImportDocVisible: false,
      CurDocInfo: {},

      ImportDocID: null,

      PublishObj: null,
      Pricelevel: null,
      PublishObjAndPublishObjList: [],
      fileList: [],
      radioUpdate: '2',
      radioRemind: '2',
    }
  },
  computed: {

  },

  //加载页面之后 - 默认到当前激活的 Tab 地址
  mounted() {
    let _self = this;

  },

  methods: {
    // 运价导入
    QuoImport(){
      let _self = this;
      _self.ImportDocVisible = true;
    },
    // Tab 切换
    handleClick(e){
      console.log(this.activeName)
    },

    // 关闭弹框
    handleDialogClose(){
      let _self = this;
      // 清空用户选择
      _self.ImportDocID = null;
      _self.fileList = [];
      _self.radioUpdate = '2';
      _self.radioRemind = '2';

      if(_self.ImportDetailVisible == true){
        _self.ImportDetailVisible = false;
      }else{
        _self.ImportDocVisible = false;
      }
    },
    // 操作列按钮方法
    handleViewItem(scope,el) {
      console.log(scope,el)
      let _self = this;
      // 先赋值再显示弹框
      _self.CurDocInfo = el;
      _self.ImportDetailVisible = true;
    },
    handleDownloadDoc(scope,el) {
      console.log(scope,el)
      let _self = this;
    },

    // 下载文件模板
    handleDownloadDocTemp(){
      let _self = this;
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

    // 修改文件
    editFile(file, fileList){
      let _self = this;
      _self.fileList = fileList;
    },
    // 删除选择的文件
    handleRemove(file, fileList) {
      let _self = this;
      _self.fileList = [];
    },
    // 开始上传
    ImportQuoFiles(){
      let _self = this;
      console.log(_self.radioUpdate,_self.radioRemind,_self.fileList,_self.PublishObjAndPublishObjList)
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
  /*导入详情样式*/
  .ImportDetail .el-row{
    padding: 10px 0;
    border-bottom: 1px solid #f3f3f3;
  }
  .ImportDetail .el-row:last-child{
    padding-top: 10px;
    border-bottom: unset;
  }
  /*导入运价文件样式*/
  .ImportDoc .el-row{
    padding: 10px 0;
    border-bottom: 1px solid #f3f3f3;
  }
  .ImportDoc .el-row .row-label{
    margin-left: 10px;
  }
  .ImportDoc .el-row:last-child{
    padding-top: 10px;
    border-bottom: unset;
  }
  
  
</style>