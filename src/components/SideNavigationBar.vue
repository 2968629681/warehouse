<template>
    <div>
        <el-col :span="12" class="wai">
            <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            router>
            <!--<el-menu-item v-for="item in lists" :key="item" :index="item.path">
                <span slot="title">{{item.title}}</span>
            </el-menu-item>-->
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
            <el-menu-item  index="/homepage/user">
                <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item  index="/homepage/role">
                <span slot="title">角色管理</span>
            </el-menu-item>
            <el-menu-item  index="/homepage/dept">
                <span slot="title">用户组管理</span>
            </el-menu-item>
            <el-menu-item  index="/homepage/sys">
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
      user:'',
      lists:[]
    }
  },
  created(){
    this.user = localStorage.user;
            // this.$axios.get(
            //     "/api/menurole",{
            //     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
            // }
            // ).then(res => {
            //     console.log(res,123);
            //     this.lists=res.data.data[0].children
            // });
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