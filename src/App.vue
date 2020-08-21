<template>
  <div class="main-ctx">
    <!-- <manage v-if="isManage" /> -->
    
    <keep-alive v-if='$route.meta.keepAlive'>
      <router-view></router-view>
    </keep-alive>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import Root from '@js/root'
import utils from '@js/utils'
import "./assets/font/addicon/iconfont.js"
import "./assets/font/frosicon/iconfont.js"
import Manage from './views/Manage'
import Login from './views/safety/Login'

export default {
  name: 'App',
  extends: Root,
  components: { Manage, Login},
  data() {return {}},
  created: async function () {
    await this.rootReady
    // this.isManage = true
    window.Logline = utils.Logline
  }
}
</script>
<style lang="css">
  @import "./assets/font/addicon/iconfont.css";
  @import "./assets/font/frosicon/iconfont.css";
</style>

<style lang="scss">
  @import "./assets/scss/common";
</style>
