<template>
  <div class="user">
    <!-- 面包屑 -->
    <el-breadcrumb
      separator="/"
      class="el-breadcrumb"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model='serachkey'
        class="input-with-select search-input"
        @keydown.native.enter="searchUsers"
        style="width:300px;"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click='searchUsers'
        ></el-button>
      </el-input>
      <el-button
        type="success"
        plain
        @click='adddialogFormVisible = true'
      >添加用户</el-button>
    </div>
    <!-- 数据表格 -->
    <template>
      <el-table
        :data="userList"
        border
        style="width: 100% ;
        margin-top:15px;"
      >
        <el-table-column
          type="index"
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="名字"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
        >
        </el-table-column>
        <!-- 状态 -->
        <el-table-column
          label="状态"
          width="80"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                size="mini"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="定义身份"
              placement="top"
            >
              <el-button
                size="mini"
                type="info"
                icon="el-icon-share"
                @click="showGrant(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-pagination
      style="margin-top :15px ; "
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="4"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="adddialogFormVisible"
    >
      <el-form
        :model="addform"
        label-width="100px"
        :rules="rules"
        ref="addform"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="addform.username"
            auto-complete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="addform.password"
            auto-complete="off"
            type="password"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="addform.email"
            auto-complete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input
            v-model="addform.mobile"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser('addform')"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editdialogFormVisible"
    >
      <el-form
        :model="editform"
        label-width="100px"
        :rules="rules"
        ref="editform"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="editform.username"
            auto-complete="off"
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="editform.email"
            auto-complete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="手机号"
          prop="mobile"
        >
          <el-input
            v-model="editform.mobile"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUser('editform')"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 授权身份 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="grantdialogFormVisible"
    >
      <el-form
        :model="grantform"
        label-width="100px"
        :rules="rules"
        ref="grantform"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="grantform.username"
            auto-complete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <template>
            <el-select
              v-model="grantform.rid"
              placeholder="请选择"
              @change='getRid'
            >
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="grantUser ('grantform')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GetUserList, addUser, editUser, deleteUser, getRolesList, grantUserById, changeUserState } from '@/api'
export default {
  data () {
    return {
      // 控制添加新用户弹出框的隐藏
      adddialogFormVisible: false,
      editdialogFormVisible: false,
      grantdialogFormVisible: false,
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editform: {
        username: '',
        id: '',
        email: '',
        mobile: ''
      },
      grantform: {
        username: '',
        id: '',
        rid: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur,change'
          }
        ],
        mobile: [{ required: true, message: '电话不能为空' }]
      },
      total: 0,
      pagenum: 1,
      pagesize: 4,
      userList: [],
      serachkey: '',
      userState: '',
      rolesList: [],
      options: [],
      value: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 实现单个用户状态授权
    changeUserState (row) {
      console.log(row)
      changeUserState(row.id, row.mg_state).then(res => {
        console.log(res, 'changeUserState')
        if (res.meta.status === 200) {
          this.$message.info('修改状态成功')
        }
      })
    },
    // 删除本条数据
    handleDelete (id) {
      console.log(id)
      this.$confirm(`此操作将永久删除id号为${id}的数据,是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser(id).then(res => {
            console.log(res)
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.init()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'success',
            message: '已取消删除'
          })
        })
    },
    // 编辑用户
    // 实现用户数据的编辑
    editUser (formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          // 调用接口实现用户数据的编辑
          editUser(this.editform).then(res => {
            if (res.meta.status === 200) {
              this.$message.success('编辑成功')
              this.editdialogFormVisible = false
              // 实现数据的刷新
              this.init()
            }
          })
        } else {
          this.$message.error('用户数据输入不完整')
          return false
        }
      })
    },

    //   实现用户新增
    addUser (formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          addUser(this.addform).then(result => {
            if (result.meta.status === 201) {
              this.adddialogFormVisible = false
              this.$refs[formname].resetFields()
              this.$message({
                type: 'success',
                message: result.meta.msg
              })
              this.init()
            } else {
              this.$message({
                type: 'error',
                message: result.meta.msg
              })
            }
          })
        } else {
          this.$message.error('用户数据输入不完整')
          return false
        }
      })
    },
    //   实现用户数据搜索
    searchUsers () {
      GetUserList({ query: this.serachkey, pagenum: 1, pagesize: 10 }).then(
        result => {
          if (result.meta.status === 200) {
            this.userList = result.data.users
            this.total = result.data.total
          }
        }
      )
    },
    //   获取用户数据
    init () {
      GetUserList({
        query: this.serachkey,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(result => {
        if (result.meta.status === 200) {
          this.userList = result.data.users
          this.total = result.data.total
        }
      })
    },
    //   编辑本条数据
    handleEdit (row) {
      console.log(row)
      this.editdialogFormVisible = true
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
      this.editform.id = row.id
    },
    // 授权身份
    grantUser () {
      console.log(this.grantform.rid)
      if (this.grantform.rid) {
        grantUserById(this.grantform).then(res => {
          if (res.meta.status === 200) {
            this.grantdialogFormVisible = false
            this.$message.success('用户授权角色成功')
            this.init()
          }
        })
      } else {
        this.$message.error('用户数据输入不完整')
        return false
      }
    },
    getRid () {
      console.log(this.grantform, '2121')
    },
    showGrant (row) {
      // console.log(row, '111')
      // console.log(this.grantform, '000')
      this.grantdialogFormVisible = true
      this.grantform.id = row.id
      this.grantform.username = row.username
      // 将当前用户角色加载到选择框上
      this.grantform.rid = row.role_name
      // console.log(row, '名字')
      // 获取角色  加载
      getRolesList().then(res => {
        // console.log(res, '666')
        if (res.meta.status === 200) {
          this.rolesList = res.data
        }
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.init()
    }
  }
}
</script>
<style lang="css" scoped>
.el-breadcrumb {
  background-color: #f5f5f5;
  height: 45px;
  font-size: 15px;
  padding-left: 10px;
  line-height: 45px;
  margin-bottom: 15px;
}
</style>
