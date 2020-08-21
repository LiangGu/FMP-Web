<template>
  <el-card class="box-card">

    <el-row :gutter="24">
      <el-col :span="3">
        <el-container>
          <el-aside width="100%" class="el-aside">
            <el-menu default-active="1">
              <el-menu-item index="1" @click="menuClick(1)">
                <i class="el-icon-place"></i>
                <span>门点</span>
              </el-menu-item>
              <el-menu-item index="2" @click="menuClick(2)">
                <i class="el-icon-aim"></i>
                <span>港站</span>
              </el-menu-item>
              <el-menu-item index="3" @click="menuClick(3)">
                <i class="el-icon-coin"></i>
                <span>门点路由</span>
              </el-menu-item>
              <el-menu-item index="4" @click="menuClick(4)">
                <i class="el-icon-coin"></i>
                <span>干线路由</span>
              </el-menu-item>
              <el-menu-item index="5" @click="menuClick(5)">
                <i class="el-icon-tickets"></i>
                <span>收费条目</span>
              </el-menu-item>
              <el-menu-item index="6" @click="menuClick(6)">
                <i class="el-icon-d-caret"></i>
                <span>价格等级</span>
              </el-menu-item>
              <el-menu-item index="7" @click="menuClick(7)">
                <i class="el-icon-star-off"></i>
                <span>公司偏好</span>
              </el-menu-item>
              <el-menu-item index="8" @click="menuClick(8)">
                <i class="el-icon-star-off"></i>
                <span>个人偏好</span>
              </el-menu-item>
              <!-- <el-menu-item index="9" @click="menuClick(9)">
                <i class="el-icon-setting"></i>
                <span>价管员权限</span>
              </el-menu-item> -->
              <el-menu-item index="10" @click="menuClick(10)">
                <i class="el-icon-collection"></i>
                <span>汇率</span>
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
  name: 'setting',
  extends: Base,
  data () {
    return {

    }
  },

  //加载页面之后 - 默认到当前激活的 Tab 地址
  mounted() {
    let _self = this;
    _self.$router.push({
        name: 'place',
      })
  },

  methods: {
    menuClick(index) {
      let _self = this;
      if(index == 1){
        _self.$router.push({
          name: 'place',
        })
      }else if(index == 2){
        _self.$router.push({
          name: 'port',
        })
      }else if(index == 3){
        _self.$router.push({
          name: 'placeRouter',
        })
      }else if(index == 4){
        _self.$router.push({
          name: 'trunkRouter',
        })
      }else if(index == 5){
        _self.$router.push({
          name: 'charge',
        })
      }else if(index == 6){
        _self.$router.push({
          name: 'priceLevel',
        })
      }else if(index == 7){
        _self.$router.push({
          name: 'companyPreferences',
        })
      }else if(index == 8){
        _self.$router.push({
          name: 'personalPreferences',
        })
      }else if(index == 10){
        _self.$router.push({
          name: 'exchangeRate',
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