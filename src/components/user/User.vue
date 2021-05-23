<template>
    <div>
      <!--面包屑导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card class="box-card">
        <!--搜索与添加区域-->
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input placeholder="请输入内容" >
               <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary">添加用户</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="userList"
            style="width: 100%"
            border
            stripe
          >
            <el-table-column
              prop="username"
              label="用户名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="role_name"
              label="角色名">
            </el-table-column>
            <el-table-column
              prop="mobile"
              label="电话">
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱">
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="mg_state"
              label="状态">
            </el-table-column>
            <el-table-column
              label="操作">
            </el-table-column>

          </el-table>

      </el-card>
    </div>
</template>

<script>
  export default {
    name: 'User',
    data(){
      return{
        //获取用户列表的参数对象,
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:2,
        },
        userList:[],
        tolal:0
      }
    },
    created () {
      this.getUserList()
    },
    methods:{
      async  getUserList(){
        const {data:result} = await this.$http.get('users',{params:this.queryInfo})
        console.log(result);
        if (result.meta.status!=200) {
          return this.$message.error('获取用户失败')
        }
        this.userList = result.data.users;
        this.total = result.data.total;
        console.log(this.userList);
      }
    }
  }
</script>

<style scoped>

</style>
