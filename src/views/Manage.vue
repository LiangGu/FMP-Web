<template>
  <div class="manage-ctx">
    <!--主tab标签-->
    
    <el-container class="manage-wrp is-vertical">
      <!-- header -->
      <el-header height="100px" class="login-banner">
        <span class="icon icon-logo"></span>
        
      </el-header>
      <!-- 页面主体 -->
      
      <el-container class="manage-body">
        <!-- 内容主体 -->
        <el-main v-loading="loadingShow" :class="['fros-manage', objConfig.hasBread ? 'has-bread' : '', ]">
          <div class="bar-wrp">
            <div :class="['browser-tag-bar', 'clear', ]">
              <ul>
                <li v-for="(item, index) in curTabList" :cp-name="item.component" :nav-index="item.navIndex" :data-index="index" :key="index" :class="[index === curTabIndex ? 'cur' : '']" @click="changeCp(item)">
                  <span>{{ item.title }}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- 页面内容展示区 -->
          <div class="frame-common-page">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@js/utils'
import Bus from '@js/bus'

// 懒加载组件
const ComHeader = () => import('../components/common/Header')
// const ComAside = () => import('../components/common/Aside')
// const NotRoot = () => import('../components/common/NotRoot')
// const WebView = () => import('../components/common/WebView')

export default {
  name: 'Manage',
  data () {
    return {
      curTabList: [
        {
          title: '运费条件',
          navIndex: 1,
          path: 'quoteSearch'
        },
        {
          title: '价格导入',
          navIndex: 2,
          path: 'quoteImport',
        },
        {
          title: '我的收藏',
          navIndex: 3,
          path: 'favourites',
        },
        {
          title: '系统设置',
          navIndex: 4,
          path: 'setting',
        },
        {
          title: '数据分析',
          navIndex: 5,
          path: 'dataAnalysis',
        },
      ],  
      curTabIndex: 0,       //当前Tab的索引
      curTabCp: 'quoteSearch', 
    }
  },
  components: {
    ComHeader,
  },
  created: function () {
    let self = this
    // utils.sendReq({
    //     queryUrl: '/api/sellerserver/GetTrackingUploadList',
    //     req: {
    //         method: 'get',
    //         data: {
    //             Status: null,
    //             IsOK: null,
    //             CreateDateStart: "",
    //             CreateDateEnd: "",
    //         },
    //         success: function (res) {
    //         },
    //         fail: function (res) {
    //         }
    //     }
    // })
  },
  mounted: function () {
    let self = this;
    // 默认跳转
    this.$router.push({
      name: self.curTabCp,
    })
  },
  asyncComputed: {
    
  },
  computed: {
    ...mapGetters([
      'cachePage',
      'loadingShow',
      'userInfo',
      'defaultIndex',
      'menuInfo',
      'objConfig',
      'isMobile',
      'rightPathList'
    ])
  },

  updated: function () {},
  methods: {
    /**
     * 当组件发生变化时
     */
    changeCp: function(cpInfo) {
      this.$store.dispatch("increment");
      this.curTabIndex = cpInfo.navIndex-1;
      this.curTabCp = cpInfo.path;
      if (!cpInfo.path) {
        return false
      }
      this.$router.push({
        name: cpInfo.path
      })
      return;
    },
  }
}
</script>
<style scoped>
  
</style>
<style lang="scss">
  @import "../assets/scss/manage/manage.scss";

</style>