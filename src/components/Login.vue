<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <el-form label-width="80px" class="login_form" :model="loginFormdata" :rules="rules" ref="loginFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginFormdata.username" ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginFormdata.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login()">立即创建</el-button>
          <el-button type="info" @click="resetLoginForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loginFormdata: {
          username: 'admin',
          password: '123456'
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      resetLoginForm(){
        const self = this;
        // 调用表单引用重置表单
        self.$refs.loginFormRef.resetFields();
      },
      login(){
        this.$refs.loginFormRef.validate(async valid=>{
         if (valid){
            const {data:result} = await this.$http.post('login',this.loginFormdata);
            if (result.meta.status == 200){
              this.$message.success('登录成功');
              window.sessionStorage.setItem('token',result.data.token);
              this.$router.push('/home');

            }else {
              return this.$message.error('登录失败');
            }
         }else {
           return;
         }
        })
      }
    }
  }
</script>

<style scoped>
.login_container{
  height: 100%;
  background-color: #2b4b6b;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
}
.avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius:50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
}
img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
