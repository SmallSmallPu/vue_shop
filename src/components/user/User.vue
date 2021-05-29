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
              <el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable @input="getUserList">
               <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="userList"
            style="width: 100%"
            border
            stripe

          >
            <el-table-column
              type="index"
            >
            </el-table-column>
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
              label="状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  @change="userStateChanged(scope.row)"
                 >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="200px"
            >
              <template slot-scope="scope" >
                <!--修改按钮-->
                <el-tooltip :enterable="false" effect="dark" content="修改用户" placement="top">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showUpdate(scope.row.id)"></el-button>
                </el-tooltip>
                <!--删除按钮-->
                <el-tooltip :enterable="false"  effect="dark" content="删除用户" placement="top">
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </el-tooltip>
                <!--分配角色按钮-->
                <el-tooltip :enterable="false"  effect="dark" content="分配角色" placement="top">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>

          </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addDialogClosed()"
        >
        <!--内容主题区-->
          <el-form label-width="70px" :model="addForm" :rules="addFormRoles" ref="addFormRef">
            <el-form-item label="用户名" prop="username" >
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" >
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" >
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile" >
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" >取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
          </span>
      </el-dialog>

      <el-dialog
        title="修改用户"
        :visible.sync="updateVisible"
        width="50%"
        @close="updateDialogClosed()"
      >
        <!--内容主题区-->
        <el-form label-width="70px" :model="updateForm" :rules="addFormRoles" ref="updateFormRef">
          <el-form-item label="用户名" prop="username" >
            <el-input v-model="updateForm.username"  :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" >
            <el-input v-model="updateForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile" >
            <el-input v-model="updateForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="updateVisible = false" >取 消</el-button>
            <el-button type="primary" @click="updateUser()">修 改</el-button>
          </span>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'User',
    data(){
      //验证邮箱的规则
      const checkEmail = (rule, value, callback) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)){
          return callback();
        }
        return  callback(new Error('请输入合法的邮箱'))
      };
      //验证手机号的规则
      const checkMobile = (rule, value, callback) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)){
          return callback();
        }
       return  callback(new Error('请输入合法的手机号'))
      };
      return{

        // 添加用户表单
        addForm:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        //修改用户表单
        updateForm:{
          id:'',
          username:'',
          email:'',
          mobile:''
        },
        // 添加用户数据校验
        addFormRoles: {
          username:[
            {required:true,message:'请输入用户名',trigger:'blur'},
            {min:3,max:10,message:'用户名的长度在3-10个字符之间',trigger:'blur'}
          ],
          password:[
            {required:true,message:'请输入密码',trigger:'blur'},
            {min:6,max:10,message:'密码的长度在6-10个字符之间',trigger:'blur'}
          ],
          email:[
            {required:true,message:'请输入邮箱',trigger:'blur'},
            {validator:checkEmail,trigger: "blur"}
          ],
          mobile:[
            {required:true,message:'请输入手机号',trigger:'blur'},
            {validator:checkMobile,trigger: "blur"}
          ],
        },
        // 控制添加用户对话框的显示与隐藏
        dialogVisible: false,
        updateVisible: false,
        //获取用户列表的参数对象,
        queryInfo:{
          query:'',
          //当前的页数
          pagenum:1,
          // 当前每页显示多少数据
          pagesize:2,
        },
        userList:[],
        //页面总数
        total:0
      }
    },
    created () {
      this.getUserList()
    },
    methods:{

      updateDialogClosed(){
        this.$refs.updateFormRef.resetFields();

      },
      //展示修改菜单栏，并且调用接口根据ID查询信息
      async showUpdate(id){
        this.updateVisible = true;
        const {data:result} = await this.$http.get("users/"+id)
        this.updateForm = result.data;
      },
      //修改用户信息
       updateUser(){
        this.$refs.updateFormRef.validate(async valid => {
          if (!valid) return;
          const {data:result} = await this.$http.put('users/'+this.updateForm.id,this.updateForm)
          if (result.meta.status!==200){
            return this.$message.error("用户修改失败");
          }
          this.$message.success("用户修改成功");
        })
      },

      // 点击按钮添加新用户
       addUser(){
         this.$refs.addFormRef.validate(async valid => {
           if(!valid) return;
           //对添加用户表单进行校验，如果填写信息不符合校验模式，则不触发数据接口。
           const {data: result} = await this.$http.post('users', this.addForm);

           if (result.meta.status == 201) {
             this.$message.success(result.meta.msg)
             this.dialogVisible = false;
             await this.getUserList();
           } else {
             this.$message.error(result.meta.msg)
           }
         })
      },

      // 监听对话框的关闭事件
      addDialogClosed(){
        this.$refs.addFormRef.resetFields();
      },


      async  getUserList(){
        const {data:result} = await this.$http.get('users',{params:this.queryInfo})
        if (result.meta.status!=200) {
          return this.$message.error('获取用户失败')
        }
        this.userList = result.data.users;
        this.total = result.data.total;
      },

      // 设置页面数据大小
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize;
        this.getUserList();

      },

      // 进行分页
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        this.getUserList();
      },

      // 更新用户状态
      async userStateChanged(row){
        console.log(row)
        const {data:result} = await this.$http.put('users/'+row.id+'/state/'+row.mg_state)
        if (result.meta.status!==200){
          row.mg_state = !row.mg_state;
          return this.$message.error("用户状态更新失败");
        }
        this.$message.success("用户状态更新成功");
      },

      handleClose(done) {
        this.$confirm('确认关闭？')
        done();
      }
    }
  }
</script>

<style scoped>

</style>
