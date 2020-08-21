<template>
  <el-card class="box-card">

    <el-row :gutter="24">
      <el-col :span="3">
        <el-container>
          <el-aside width="100%" class="el-aside">
            <el-menu default-active="1">
              <el-menu-item index="1" @click="menuClick(1)">
                <i class="el-icon-upload2"></i>
                <span>模板导入</span>
              </el-menu-item>
              <el-menu-item index="2" @click="menuClick(2)">
                <i class="el-icon-edit"></i>
                <span>手工录入</span>
              </el-menu-item>
              <el-menu-item index="3" @click="menuClick(3)">
                <i class="el-icon-link"></i>
                <span>API接入</span>
              </el-menu-item>
            </el-menu>
    
          </el-aside>
        
        </el-container>
      </el-col>
      <el-col :span="21">
        <el-container>
          <el-main class="el-main">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-col>
    </el-row>

  </el-card>
</template>

<script>
import Base from '@js/base'

export default {
  name: 'quoteImport',
  extends: Base,
  data () {
    return {

    }
  },

  //加载页面之后 - 默认到当前激活的 Tab 地址
  mounted() {
    let _self = this;
    _self.$router.push({
        name: 'templateImport',
      })
  },

  methods: {
    menuClick(index) {
      let _self = this;
      if(index == 1){
        _self.$router.push({
          name: 'templateImport',
        })
      }else if(index == 2){
        _self.$router.push({
          name: 'manualEntry',
        })
      }else{
        _self.$router.push({
          name: 'apiAccess',
        })
      }

    },
  }
}
</script>

<style scoped lang="scss">
  .box-card{
    margin-top: 10px;
  }
  .el-aside{
    background-color: rgb(238, 241, 246);
    border-right: 1px solid #f3f3f3;
  }
  .el-main{
    padding: 0px;
    margin-top: 0px;
  }
</style>