<template>
  <el-card>
    
    <div slot="header" class="clearfix">
        <span>港站</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="SearchPort">测试查询Smart部门接口</el-button>
    </div>







  </el-card>
</template>

<script>
import Base from '@js/base'
import utils from '@js/utils'

export default {
  name: 'port',
  extends: Base,
  data () {
    return {

    }
  },
  methods: {
    SearchPort:function(){
      let _self = this;
      // utils.sendReq({
      //     queryUrl: 'api/MCommon/GetDivisionByType',
      //     req: {
      //         method: 'get',
      //         req: {
      //           ctxType: 'file',
      //         },
      //         data: {
      //           key: '',
      //           UserID: 1,
      //           Type: 3,
      //         },
      //         success: function (res) {
      //           console.log(res)
      //           _self.$message({
      //               type: 'success',
      //               message: '查询港口数据成功!'
      //           })
      //         },
      //         error: function (res) {
      //           console.log(res)
      //           _self.$message.error('访问接口失败.请联系管理员!')
      //         }
      //     }
      // });

    },
  }
}
</script>

<style scoped lang="scss">

</style>