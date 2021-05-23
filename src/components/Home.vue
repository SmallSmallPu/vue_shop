<template>
  <el-container class="home-container">
    <!--头部栏-->
    <el-header>
      <div>
        <img src="../assets/logo.png" style="width: 50px;height: 50px;">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout()">退出登录</el-button></el-header>
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--导航栏-->
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#409eff"
                 :collapse-transition="false"
                 :collapse="isCollapse"
                 unique-opened
                 router
                 :default-active="activePath"
        >
          <!--一级菜单-->
          <el-submenu v-for="(item,index) in menusList" :key="item.id" :index="index+1 + ''">
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
              <!--<el-menu-item v-for="(itemTwo,indexTwo) in item.children" :key="itemTwo.id" :index="(index+1)+'-'+(indexTwo+1)">-->
              <el-menu-item
                v-for="itemTwo in item.children"
                :key="itemTwo.id"
                :index="'/'+itemTwo.path"
                @click="saveNavState('/'+itemTwo.path)"
              >
               <template slot="title">
                 <i class="el-icon-menu"></i>
                 <span>{{itemTwo.authName}}</span>
               </template>
              </el-menu-item>
          </el-submenu>
        </el-menu >
      </el-aside>
      <el-main>
        <router-view>

        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'Home',
    data(){
      return{
        menusList:[],
        isCollapse:false,
        activePath:'',
        iconsObj:{
          '125':'el-icon-user',
          '103':'el-icon-edit',
          '101':'el-icon-goods',
          '102':'el-icon-s-order',
          '145':'el-icon-s-data'
        }
      }
    },
    created(){
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods:{
      logout(){
        window.sessionStorage.clear();
        this.$router.push('/login');
      },
      //从数据库获取所有的菜单
     async getMenuList(){
        const {data:result} = await this.$http.get('menus');
        if (result.meta.status!=200) return this.message.error(result.meta.msg)
        this.menusList = result.data;
      },
      //点击按钮，切换菜单的折叠与展开
      toggleCollapse(){
        this.isCollapse = !this.isCollapse;
      },
      saveNavState(activePath){
        this.activePath = activePath;
        window.sessionStorage.setItem("activePath",activePath)
      }
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #373d41;
    color: #fff;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    font-size: 20px;
  }
  .el-header div{
    display: flex;
    align-items: center;
  }
  .el-header div span{
    margin-left: 15px;
  }
  .el-aside {
    background-color: #333744;
    color: #fff;
    /*text-align: center;*/
    line-height: 200px;
  }
  .el-aside .el-menu{
    border-right: none;
  }

  .el-main {
    background-color: #eaedf1;
    color: #fff;
  }
  .home-container{
    height: 100%;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2rem;
    cursor: pointer;
  }


</style>
