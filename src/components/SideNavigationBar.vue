<template>
    <div>
        <el-col :span="12" class="wai">
            <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            router>
            <el-menu-item index="/home">
                <span slot="title">首页菜单</span>
            </el-menu-item>
            <el-menu-item index="/homepage/put">
                <span slot="title">入库明细</span>
            </el-menu-item>
            <el-menu-item index="/homepage/out">
                <span slot="title">出库明细</span>
            </el-menu-item>
            <el-menu-item index="/homepage/mate">
                <span slot="title">物料信息</span>
            </el-menu-item>
            <el-menu-item index="/homepage/one">
                <span slot="title">单品查询</span>
            </el-menu-item>
            <el-menu-item index="/homepage/time">
                <span slot="title">时间查询</span>
            </el-menu-item>
            <el-menu-item v-if="user == 'true'"  index="/homepage/sys">
                <span slot="title">系统设置</span>
            </el-menu-item>
            </el-menu>
        </el-col>
    </div>
</template>

<script>
  export default {
    data(){
    return{
      user:''
    }
  },
  created(){
    this.user = localStorage.user
  },
    methods: {
    }
  }
</script>

<style>
.wai{
  width: 140px;
  height: 90%;
  z-index:5;
}
</style>