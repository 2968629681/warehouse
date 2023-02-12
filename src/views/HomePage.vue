<template>
  <div>
    <el-container>
      <el-aside width="200px">
        <img src="../assets/图片8.png" alt="" class="aside">
      </el-aside>
      <el-main>
        <el-descriptions class="margin-top" title="" border>
          <el-descriptions-item>
            <template slot="label">
              <div v-html="str1"></div>
            </template>
            <div v-html="str2"></div>
          </el-descriptions-item>
        </el-descriptions>
        <div>
          <img src="../assets/入库.png" class="tiao" @click="put">
          <img src="../assets/入库.png" class="tiao" @click="out">
        </div>
        <div>
          <img src="../assets/入库.png" class="tiao" @click="mate">
          <img src="../assets/入库.png" class="tiao" @click="queryone">
        </div>
        <div>
          <img src="../assets/入库.png" class="tiao" @click="querytime">
          <img src="../assets/入库.png" v-if="user == 'true'"  class="tiao" @click="sys">
        </div>
        <div></div>
      </el-main>
    </el-container>
    <router-view></router-view>
  </div> 
</template>

<script>
export default {
  data(){
    return{
      str1:'出入明细<br>物料统计<br>智能查询',
      str2:'详细记录入库，出库明细，做到有据可查<br>一份物料信息表，统计所有物料，期初库存，入库，出库，库存结存，以及物料预警<br>可根据单号，名称进行单品查询；可根据时间进行范围查询',
      user:''
    }
  },
  created(){
    this.info()
  },
  methods:{
    put(){
      this.$router.push({
        path:'/homepage/put'
      })
    },
    out(){
      this.$router.push({
        path:'/homepage/out'
      })
    },
    mate(){
      this.$router.push({
        path:'/homepage/mate'
      })
    },
    queryone(){
      this.$router.push({
        path:'/homepage/one'
      })
    },
    querytime(){
      this.$router.push({
        path:'/homepage/time'
      })
    },
    sys(){
      this.$router.push({
        path:'/homepage/sys'
      })
    },
    info() { // 获取信息
      {
        this.user = localStorage.user
        if(localStorage.getItem('auth') == null){
          this.$router.replace({
          name:'login'
          })
        }
      }  
    },
  },
  
}
</script>

<style>
.aside{
  width: 100%;
  height: 95vh;
  border-radius: 15px;
}
.tiao{
  margin: 20px;
}
</style>
