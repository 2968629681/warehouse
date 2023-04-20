<template>
  <div class="login-wrap bruce" v-loading="loading">
    <ul class="bubble-bgwall">
      <li>vue2</li>
      <li>vue2</li>
      <li>vue2</li>
      <li>vue2</li>
      <li>vue2</li>
      <li>vue2</li>
      <li>vue2</li>
      <li>vue2</li>
      <li>vue2</li>
      <li>vue2</li>
    </ul>
    <div class="ms-login" v-if="retrieve">
      <div class="title">登录</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
        <el-form-item prop="username">
          <el-input type="text" v-model="ruleForm.username" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input type="pwd" placeholder="密码" show-password v-model="ruleForm.pwd" @keyup.enter.native="en"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="en">登录</el-button>
      <!--<el-button type="text" @click="retrieve = false">注册账号</el-button>-->
    </div>
    <retrievePassword v-else v-on:isshow="retrieve = true"></retrievePassword>
  </div>
</template>
<script>
import retrievePassword from "../components/retrievePassword.vue"
export default {
  components: {
    retrievePassword
  },
  data: function () {
    return {
      loading: false,
      // 滑动验证显示控制变量
      Vcode_show: false,
      retrieve: true,
      // 输入的账号密码
      ruleForm: {
        username: "",
        pwd: ""
      },
      // 输入框数据验证方式
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    }
  },

  methods: {
    en(){
     
      const that = this
      // const data = this.ruleForm
      this.Vcode_show = false
      this.loading = true
      this.$data.Vcode_show = true
      //发送post请求
      this.$axios.post('/api/user/login',{
        username: that.ruleForm.username,
        password: that.ruleForm.pwd
      }).then(res=>{
        if(that.ruleForm.username == 'admin') 
        {
          this.$store.commit('isAdmin')
          //console.log(this.$store.state.user);
          //localStorage.user = true
        }
        //else  localStorage.user =''
        localStorage.auth=res.data.token;
        if (res.data.code==200){
          this.$router.replace({
            name:'home'
          })
        }else{

        this.loading = false
        this.notifyId = this.$notify({
        message: "密码错误，请重新登入或者请检查网络问题",
        duration: 2000
      })
        }
      })
      .catch(()=>{
     });     
    }
  },
}
</script>
<style scoped>
@import "../assets/style.css";
@import "../assets/style.scss";
.login-wrap {
  width: 100%;
  height: 100vh;
  z-index: 100 !important;
}

.title {
  font-size: 25px;
  text-align: center;
  color: rgb(73, 73, 77);
  margin-bottom: 10px;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: auto;
  padding: 30px;
  border-radius: 15px;
  background: rgba(250, 250, 250, 0.3);
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  -webkit-animation: fadenum 1.5s ease;
  -moz-animation: fadenum 1.5s ease;
  animation: fadenum 1.5s ease;
}
@-webkit-keyframes fadenum {
  /*设置内容由显示变为隐藏*/
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-moz-keyframes fadenum {
  /*设置内容由显示变为隐藏*/
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-o-keyframes fadenum {
  /*设置内容由显示变为隐藏*/
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadenum {
  /*设置内容由显示变为隐藏*/
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.el-form {
  margin: 20px 0;
}
.login-btn button {
  width: 100%;
  height: 36px;
}

.el-link {
  font-size: 10px !important;
  margin-top: 20px;
  text-align: center;
}

.links {
  position: fixed;
  bottom: 0px;
  width: 100%;
  background: rgba(250, 250, 250, 0.4);
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  color: #666;
  font-size: 12px;
}

a {
  color: #409eff;
  text-decoration: none;
}

a:visited {
  color: #409eff;
  text-decoration: none;
}
</style>
