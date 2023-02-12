<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
export default{
    created(){
        if(localStorage.getItem('auth') == null){
          this.$router.replace({
          name:'login'
          })
        }
    }
}
</script>