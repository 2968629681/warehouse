<template>
    <div class="al">
        <el-header style="height: 100px;">
            <div class="im"><img src="../assets/logo.png" alt="" style="height:100px"></div>
            <div class="han">仓库出入库管理系统</div>
            <p class="yin">Warehouse management system</p>
        </el-header>
    </div>
</template>

<script>
  export default {
    methods: {
        use(){
            this.$router.push({
            path:'/homepage/use'
            })
        }
    }
  }
</script>

<style>
.al{
    width: 1650px;
    height: 100px;
    display:inline-block;
    background-color: #33ffff;
}
.im{
    height: 100px;
    display:inline-block;
}
.han{
    margin-left: 400px;
    vertical-align: top;
    line-height: 100px;
    font-size: 30px;
    display:inline-block;
}
.yin{
    margin-left: 30px;
    vertical-align: top;
    line-height: 100px;
    font-size: 15px;
    display:inline-block;
}
</style>