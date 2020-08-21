<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
          <span>委托信息</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="SearchQuo">查询报价</el-button>
      </div>

      <el-row :gutter="24" class="searchInfo">
        <!-- 委托信息 -->
        <el-col :span="10">
          <el-row :gutter="24">
            <el-col :span="4" class="border-right">
              <img src="../assets/image/fmp/FreightInquiry/entrust.svg">
              <p>委托信息</p>
            </el-col>
            <el-col :span="20">
              <el-row :gutter="24" class="searchInfoTop">
                <el-col :span="14" class="topItem">
                  <span>始发地 </span>
                  <span>
                    <el-radio class="radioMargin" v-model="provenanceRadio" label="1">门点</el-radio>
                    <el-radio class="radioMargin" v-model="provenanceRadio" label="2">港口</el-radio>
                  </span>
                </el-col>
                <el-col :span="10">
                  <fros-base-input
                    ref="provenanceinput"
                    placeholder="请输入"
                    type="text"
                    v-model="valueprovenanceInput">
                  </fros-base-input>
                </el-col>
              </el-row>
              <el-row :gutter="24" class="searchInfoBottom">
                <el-col :span="14" class="bottomItem">
                  <span>目的地 </span>
                  <span>
                    <el-radio class="radioMargin" v-model="destinationRadio" label="1">门点</el-radio>
                    <el-radio class="radioMargin" v-model="destinationRadio" label="2">港口</el-radio>
                  </span>
                </el-col>
                <el-col :span="10">
                  <fros-base-input
                    ref="destinationinput"
                    placeholder="请输入"
                    type="text"
                    v-model="valuedestinatonInput">
                  </fros-base-input>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
        <!-- 中转 -->
        <el-col :span="4">
          <el-col :span="10" class="border-right">
            <img src="../assets/image/fmp/FreightInquiry/entrust.svg">
            <p>中转</p>
          </el-col>
          <el-col :span="14">
            <el-row :gutter="24" class="transitItem">
              <el-radio v-model="transitRadio" label="1">可接受中转</el-radio>
            </el-row>
            <el-row :gutter="24" class="transitItem">
              <el-radio v-model="transitRadio" label="2">不接受中转</el-radio>
            </el-row>
          </el-col>
        </el-col>
        <!-- 主运输方式 -->
        <el-col :span="5">
          <el-col :span="8" class="border-right">
            <img src="../assets/image/fmp/FreightInquiry/entrust.svg">
            <p>主运输方式</p>
          </el-col>
          <el-col :span="16">
            <el-row :gutter="24" class="transportItem"></el-row>
            <el-row :gutter="24" class="transportItem">
              <el-select v-model="transportValue" placeholder="请选择主运输方式" size="small">
                <el-option
                  v-for="item in transportList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-row>
          </el-col>
        </el-col>
        <!-- 货物备妥日期 -->
        <el-col :span="5" class="cargoDoneDate">
          <el-row :gutter="24" class="cargoDoneDateItem">
            <span>货物备妥日期</span>
            <span><a @click="cargoDoneDateVisible = true">暂不确定日期?</a></span>
          </el-row>
          <el-row :gutter="24" class="cargoDoneDateItem">
            <el-col :span="23" style="padding: 0px;">
              <fros-date-picker
                v-model="cargoDoneDate"
                type="date"
                placeholder="普通时间框"
                value-format="yyyy/MM/dd">
              </fros-date-picker>
            </el-col>

          </el-row>
        </el-col>
      </el-row>

      <!-- 货物备妥提示录入日期弹框 -->
      <el-dialog
        title="温馨提示"
        :visible.sync="cargoDoneDateVisible"
        width="400px"
        center
      >
        <span>在不清楚日期的情况下，请选择未来任意日期，以确保可以查询对预估的运价</span>
        <span slot="footer" class="dialog-footer">
          <el-button
            class="wrap_btn defual_btn_square"
            size="medium"
            @click="cargoDoneDateVisible = false">确定
          </el-button>
        </span>
      </el-dialog>

    </el-card>

     <!-- 包装类型 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
          <span>货物包装信息</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="AddCargo(packageTypeValue)">添加货物
          </el-button>
      </div>
      <el-row :gutter="24" class="cargoInfo">
        <el-col :span="10">
          <el-row :gutter="24">
            <el-col :span="5" class="cargoInfoItem">
              <p>包装类型</p>
            </el-col>
            <el-col :span="12" class="cargoInfoItem">
              <el-select v-model="packageTypeValue" placeholder="请选择包装类型" size="small" @change="packageTypeChange">
                <el-option
                  v-for="item in packageTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7" class="cargoInfoItem">
              <el-checkbox v-model="dangerousGoods">危险品</el-checkbox>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <!-- 点击添加货物出现如下信息 -->
      <el-row :gutter="24" class="cargoInfo">

        <div v-if="cargoDetilIndex === 1 && cargoDetilList.length > 0" class="cargoDetils">
          <div v-for="item in cargoDetilList" v-bind:key="item.ID" class="cargoDetailRow">
            <!-- 包装类型为 Boxes -->
            <el-row :gutter="24">
              <el-col :span="6">
                <el-row :gutter="24">
                  <el-col :span="6" class="labelName">
                    <span>件数</span>
                  </el-col>
                  <el-col :span="18">
                    <el-input-number
                      style="width: 100%;"
                      v-model="item.packages"
                      @change="handleChange"
                      :min="1"
                      :max="10"
                      size="small"
                      label="描述文字">
                    </el-input-number>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row :gutter="24">
                  <el-col :span="6" class="labelName">
                    <span>重量</span>
                  </el-col>
                  <el-col :span="18">
                    <el-input placeholder="请输入内容" v-model="item.weight" size="small" style="width: 100%;">
                      <el-select v-model="item.weightUnit" slot="append" placeholder="请选择" style="width: 100px;">
                        <el-option label="KG" value="1"></el-option>
                        <el-option label="TON" value="2"></el-option>
                      </el-select>
                    </el-input>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="10">
                <el-row :gutter="24">
                  <el-col :span="4" class="labelName">
                    <span>体积</span>
                  </el-col>
                  <el-col :span="20">
                    <el-input placeholder="L" v-model="item.long" size="small" style="width: 25%;"></el-input>
                    <el-input placeholder="W" v-model="item.wide" size="small" style="width: 25%;"></el-input>
                    <el-input placeholder="H" v-model="item.high" size="small" style="width: 50%;">
                      <el-select v-model="item.measureUnit" slot="append" placeholder="请选择" style="width: 86px;border-radius: 0px;">
                        <el-option label="CM" value="1"></el-option>
                        <el-option label="M" value="2"></el-option>
                      </el-select>
                    </el-input>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="2">
                <el-button size="small" icon="el-icon-delete" @click="DeleteCargoDetail(1,item.ID)">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </div>

        <div v-if="cargoDetilIndex === 2 && cargoDetilList.length > 0" class="cargoDetils">
          <div v-for="item in cargoDetilList" v-bind:key="item.ID" class="cargoDetailRow">
            <!-- 包装类型为 Pallets -->
            <el-row :gutter="24">
              <el-col :span="6">
                <el-row :gutter="24">
                  <el-col :span="6" class="labelName">
                    <span>件数</span>
                  </el-col>
                  <el-col :span="18">
                    <el-input-number
                      style="width: 100%;"
                      v-model="item.packages"
                      @change="handleChange"
                      :min="1"
                      :max="10"
                      size="small"
                      label="描述文字">
                    </el-input-number>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row :gutter="24">
                  <el-col :span="6" class="labelName">
                    <span>重量</span>
                  </el-col>
                  <el-col :span="18">
                    <el-input placeholder="请输入内容" v-model="item.weight" size="small" style="width: 100%;">
                      <el-select v-model="item.weightUnit" slot="append" placeholder="请选择" style="width: 100px;">
                        <el-option label="KG" value="1"></el-option>
                        <el-option label="TON" value="2"></el-option>
                      </el-select>
                    </el-input>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="10">
                <el-row :gutter="24">
                  <el-col :span="6" class="labelName">
                    <span>型号</span>
                  </el-col>
                  <el-col :span="18">
                    <el-input placeholder="请输入内容" v-model="item.type" size="small" style="width: 100%;">
                      <el-select v-model="item.typeUnit" slot="append" placeholder="请选择" style="width: 100px;">
                        <el-option label="20GP" value="1"></el-option>
                        <el-option label="40GP" value="2"></el-option>
                      </el-select>
                    </el-input>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="2">
                <el-button size="small" icon="el-icon-delete" @click="DeleteCargoDetail(2,item.ID)">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </div>

        <div v-if="cargoDetilIndex === 3 && cargoDetilList.length > 0" class="cargoDetils">
          <div v-for="item in cargoDetilList" v-bind:key="item.ID" class="cargoDetailRow">
            <!-- 包装类型为 Breakbulk -->
            <el-row :gutter="24">
              <el-col :span="6">
                <el-row :gutter="24">
                  <el-col :span="6" class="labelName">
                    <span>件数</span>
                  </el-col>
                  <el-col :span="18">
                    <el-input-number
                      style="width: 100%;"
                      v-model="item.packages"
                      @change="handleChange"
                      :min="1"
                      :max="10"
                      size="small"
                      label="描述文字">
                    </el-input-number>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row :gutter="24">
                  <el-col :span="6" class="labelName">
                    <span>重量</span>
                  </el-col>
                  <el-col :span="18">
                    <el-input placeholder="请输入内容" v-model="item.weight" size="small" style="width: 100%;">
                      <el-select v-model="item.weightUnit" slot="append" placeholder="请选择" style="width: 100px;">
                        <el-option label="KG" value="1"></el-option>
                        <el-option label="TON" value="2"></el-option>
                      </el-select>
                    </el-input>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="10">
                <el-row :gutter="24">
                  <el-col :span="6" class="labelName">
                    <span>体积</span>
                  </el-col>
                  <el-col :span="18">
                    <el-input placeholder="请输入内容" v-model="item.measure" size="small" style="width: 80%;">
                      <el-select v-model="item.measureUnit" slot="append" placeholder="请选择" style="width: 100px;">
                        <el-option label="CM" value="1"></el-option>
                        <el-option label="M" value="2"></el-option>
                      </el-select>
                    </el-input>
                    <el-checkbox v-model="item.isOverSize" style="width: 20%;">超限</el-checkbox>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="2">
                <el-button size="small" icon="el-icon-delete" @click="DeleteCargoDetail(3,item.ID)">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </div>

        <div v-if="cargoDetilIndex === 4 && cargoDetilList.length > 0" class="cargoDetils">
          <div v-for="item in cargoDetilList" v-bind:key="item.ID" class="cargoDetailRow">
            <!-- 包装类型为 Containers -->
            <el-row :gutter="24">
              <el-col :span="6">
                <el-row :gutter="24">
                  <el-col :span="6" class="labelName">
                    <span>件数</span>
                  </el-col>
                  <el-col :span="18">
                    <el-input-number
                      style="width: 100%;"
                      v-model="item.packages"
                      @change="handleChange"
                      :min="1"
                      :max="10"
                      size="small"
                      label="描述文字">
                    </el-input-number>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="10">
                <el-row :gutter="24">
                  <el-col :span="6" class="labelName">
                    <span>型号</span>
                  </el-col>
                  <el-col :span="18">
                    <el-input placeholder="请输入内容" v-model="item.type" size="small" style="width: 100%;">
                      <el-select v-model="item.typeUnit" slot="append" placeholder="请选择" style="width: 100px;">
                        <el-option label="20GP" value="1"></el-option>
                        <el-option label="40GP" value="2"></el-option>
                      </el-select>
                    </el-input>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="2" style="float: right;">
                <el-button size="small" icon="el-icon-delete" @click="DeleteCargoDetail(4,item.ID)">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </div>

      </el-row>

    </el-card>

    <!-- 其它选项 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
          <span>其它选项</span>
      </div>
      <el-row :gutter="24" class="OtherInfo">
        <el-row :gutter="24" class="OtherInfoItem">
          <el-col :span="2" class="border-right">
            <img src="../assets/image/fmp/FreightInquiry/entrust.svg">
            <p>清关</p>
          </el-col>
          <el-col :span="22">
            <el-row :gutter="24" class="searchInfoTop">
              <el-col :span="14" class="topItem">
                <el-row :gutter="24">
                  <el-col :span="6">
                    <el-radio class="radioMargin" v-model="needCustomsClearance" label="1">需要清关,共记</el-radio>
                  </el-col>
                  <el-col :span="4">
                    <el-input placeholder="请输入" v-model="customsClearanceNum" size="small"></el-input>
                  </el-col>
                  <el-col :span="6">个品名</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="24" class="searchInfoBottom">
              <el-col :span="14" class="bottomItem">
                  <el-radio class="radioMargin" v-model="needCustomsClearance" label="2">不需要清关服务</el-radio>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="OtherInfoItem">
          <el-col :span="2" class="border-right">
            <img src="../assets/image/fmp/FreightInquiry/entrust.svg">
            <p>仓库服务</p>
          </el-col>
          <el-col :span="22">

          </el-col>
        </el-row>

        <el-row :gutter="24" class="OtherInfoItem">
          <el-col :span="2" class="border-right">
            <img src="../assets/image/fmp/FreightInquiry/entrust.svg">
            <p>贸易条款</p>
          </el-col>
          <el-col :span="22">

          </el-col>
        </el-row>

      </el-row>
    </el-card>

  </div>
</template>

<script>
import Base from '@js/base'

export default {
  name: 'HomePage',
  extends: Base,
  data () {
    return {
      // 搜索条件
      valueprovenanceInput: '',     //始发地Input
      valuedestinatonInput: '',     //目的地Input
      provenanceRadio: '1',         //始发地Radio
      destinationRadio: '2',        //目的地Radio
      transitRadio: '1',            //中转Radio

      transportValue: '',           //主运输方式下拉
      transportList: [
        {
            value: 'A',
            label: '不限',
        },
        {
            value: 'B',
            label: '限制',
        }
      ],
      cargoDoneDateVisible: false,
      cargoDoneDate: null,
      // 包装类型
      packageTypeValue: '',         //包装类型
      packageTypeList: [
        {
          value: 1,
          label: 'Boxes',
        },
        {
          value: 2,
          label: 'Pallets',
        },
        {
          value: 3,
          label: 'Breakbulk',
        },
        {
          value: 4,
          label: 'Containers',
        }
      ],
      dangerousGoods: false,
      cargoDetilIndex: null,
      cargoDetilList : [],

      // 其它选项
      needCustomsClearance : 1,
      customsClearanceNum: null,




      num: 1,
    }
  },

  // 方法
  methods: {
    // 搜索报价
    SearchQuo:function(){
      let _self = this;
      console.log(_self.cargoDoneDate)
    },

    // 包装类型修改
    packageTypeChange(value){
      //  用户选择包装类型则清空 cargoDetilList 和 cargoDetilIndex
      let _self = this;
      _self.cargoDetilList = [];
      _self.cargoDetilIndex = null;
    },

    // 添加货物
    AddCargo(packageTypeValue){
      let _self = this;
      console.log(packageTypeValue)
      if(!packageTypeValue){
        _self.$message.error('请先选择包装类型！')
      }else{
        switch(packageTypeValue){
        case 1:
          _self.cargoDetilList.push({
            ID: `NEW_ITEM_ID_${new Date().getTime()}`,
            packages: null,
            weight: null,
            weightUnit: null,
            long: null,
            wide: null,
            high: null,
            measureUnit: null,
          });
        break;
        case 2:
          _self.cargoDetilList.push({
            ID: `NEW_ITEM_ID_${new Date().getTime()}`,
            packages: null,
            weight: null,
            weightUnit: null,
            type: null,
            typeUnit: null,
          });
        break;
        case 3:
          _self.cargoDetilList.push({
            ID: `NEW_ITEM_ID_${new Date().getTime()}`,
            packages: null,
            weight: null,
            weightUnit: null,
            measure: null,
            measureUnit: null,
            isOverSize: null,
          });
        break;
        case 4:
          _self.cargoDetilList.push({
            ID: `NEW_ITEM_ID_${new Date().getTime()}`,
            packages: null,
            type: null,
            typeUnit: null,
          });
        break;
        default:break;

      }
      _self.cargoDetilIndex = packageTypeValue;   // 让显示货物录入信息
      }
      // 动态计算总货量---先不写,后面再加
      

    },

    // 删除货物信息
    DeleteCargoDetail(packageType,ID){
      console.log(packageType,ID)
      let _self = this;
      _self.cargoDetilList = _self.cargoDetilList.filter(item => item.ID !== ID);
    },

    // 修改货物信息
    handleChange(){
      console.log(1)
    }


  }


}
</script>

<style scoped lang="scss">
  .box-card{
    margin-top: 10px;
  }
  .border-right{
    border-right: 1px solid #f3f3f3;
  }
  .radioMargin{
    margin: 0 10px;
  }
  /* 条件搜索 */
  .searchInfoTop{
    height: 36px;
  }
  .searchInfoTop .topItem{
    height: 30px;
    line-height: 30px;
  }
  .searchInfoBottom{
    height: 36px;
  }
  .searchInfoBottom .bottomItem{
    height: 30px;
    line-height: 30px;
  }
  /* 中转 */
  .transitItem{
    height: 36px;
    line-height: 36px;
    padding-left: 12px;
  }
  /* 主运输方式 */
  .transportItem{
    height: 36px;
    line-height: 36px;
    padding-left: 12px;
  }
  /* 货物备妥日期 */
  .cargoDoneDateItem{
    height: 36px;
    line-height: 36px;
  }
  .cargoDoneDate span a{
    color: #0083ff;
  }
  /* 包装类型 */
  .cargoInfo .cargoInfoItem{
    height: 30px;
    line-height: 30px;
  }
  .cargoInfo .cargoDetils{
    border: 1px solid #f3f3f3;
    background-color: #f1f1f1;
    margin-top: 10px;
    padding: 12px;
  }
  /*货物行*/
  .cargoInfo .cargoDetils .cargoDetailRow{
    margin-bottom: 10px;
  }
  .cargoInfo .cargoDetils .cargoDetailRow .labelName{
    height: 30px;
    line-height: 30px;
  }
  .cargoInfo .cargoDetils .cargoDetailRow:last-child{
    margin-bottom: 0px;
  }

  /*货物信息 件、重、尺*/
  .cargoInfo .cargoDetils .el-col span:nth-child(1){
    margin-right: 20px;
  }

  /*其它选项*/
  .OtherInfo .OtherInfoItem{
    margin-bottom: 10px;
  }

</style>