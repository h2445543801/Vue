<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb
      separator="/"
      class="el-breadcrumb"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button
      type="success"
      plain
       @click='addRoles'
    >添加角色</el-button>
    <!-- 表格 -->
    <template>
      <el-table
        :data="rolesList"
        border
        style="width: 100%;margin-top:15px;"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="first in scope.row.children"
              style='padding-top:15px;'
              :key="first.id"
            >
              <el-col :span="4">
                <div class="grid-content bg-purple">
                  <el-tag
                    closable
                    type="success"
                    @close='deleteroleright(scope.row,first.id)'
                  >
                    {{first.authName}}
                  </el-tag>
                </div>
              </el-col>

              <el-col :span="20">
                <div class="grid-content bg-purple-light">

                  <el-row
                    v-for="second in first.children"
                    :key="second.id"
                    style='margin-top:8px'
                  >
                    <el-col :span="6">
                      <div class="grid-content bg-purple">
                        <el-tag
                          closable
                          type="warning"
                          @close='deleteroleright(scope.row,second.id)'
                        >
                          {{second.authName}}
                        </el-tag>
                      </div>
                    </el-col>

                    <el-col :span="18">
                      <div class="grid-content bg-purple-light">
                        <el-tag
                          v-for="third in second.children"
                          :key="third.id"
                          closable
                          type="danger"
                          style='margin-right:5px;margin-top:5px'
                          @close='deleteroleright(scope.row,third.id)'
                        >
                          {{third.authName}}
                        </el-tag>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
            <span v-show="scope.row.children.length === 0">暂无权限，请联系管理员</span>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          width="50"
        >
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        >
        </el-table-column>
        <el-table-column
          label="描述"
          prop="roleDesc"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              content="编辑"
              placement="top"
            >
              <el-button
                type='primary'
                icon="el-icon-edit"
                size="mini"
                plain
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="删除"
              placement="top"
            >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                plain
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="角色授权"
              placement="top"
            >
              <el-button
                size="mini"
                type="info"
                icon="el-icon-share"
                plain
                @click="showGrantDialog(scope.row) "
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 角色授权 -->
    <el-dialog
      title="角色授权"
      :visible.sync="grantdialogFormVisible"
    >
      <div class="box">
        <el-tree
          ref="tree"
          :data="rightList"
          show-checkbox
          node-key="id"
          :default-expand-all='true'
          :default-checked-keys="selectedNode"
          :props="defaultProps"
        >
        </el-tree>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="grantSubmit"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="adddialogFormVisible">
        <el-form :model="addform" label-width="80px">
            <el-form-item label="角色名称">
            <el-input v-model="addform.roleName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" >
            <el-input v-model="addform.roleDesc" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="adddialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRoleSubmit">确 定</el-button>
        </div>
    </el-dialog>
  </div>

</template>
<script>
import {
  getRolesList,
  getAllRights,
  grantroleroles,
  deleteroleright,
  addRole
} from '@/api'
export default {
  data () {
    return {
      addform: {
        roleName: '',
        roleDesc: ''
      },
      rolesList: [],
      rightList: [],
      selectedNode: [],
      roleId: '',
      adddialogFormVisible: false,
      grantdialogFormVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  methods: {
    // 添加角色
    addRoles () {
      this.adddialogFormVisible = true
    },
    addRoleSubmit () {
      addRole(this.addform).then(res => {
        console.log(res, '1111')
        if (res.meta.status === 201) {
          this.$message({type: 'success', message: '添加角色成功'})
          this.init()
          this.adddialogFormVisible = false
        } else {
          this.$message({type: 'warning', message: '失败'})
        }
      })
    },
    // 实现去除授权单标签
    deleteroleright (row, rightid) {
      deleteroleright(row.id, rightid).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.$message.success('取消权限成功')

          row.children = res.data
        } else {
          this.$message({
            type: 'warning',
            message: res.meta.msg
          })
        }
      })
    },
    // 实现角色授权的提交
    grantSubmit () {
      // 1.获取当前所有被选中的节点对象
      var selectednodes = this.$refs.tree.getCheckedNodes()
      // console.log(selectednodes, '1')
      // 2.遍历数组，获取我们需要的每个对象中的id 和pid
      var arr = selectednodes.map(item => {
        // console.log(item, '2')
        return item.id + ',' + item.pid
      })
      // console.log(arr, '3')// ['105,104,101','116,104,101']
      // 3.将获取到的数据拼接成一个整体的字符串--含有重复值
      var str = arr.join(',')
      // console.log(str, '--4')// 105,104,101,116,104,101 4
      // 4.使用new set去除重复值
      var myset = new Set(str.split(','))
      // console.log(myset, '--5去重复值')// 变成set对象
      // 5.使用Array.from从set对象返回数组
      var finalArr = Array.from(myset)
      // console.log(finalArr.join(','), '--6最终获取到的数组')
      var finalRid = finalArr.join(',')
      // console.log(finalRid, '--66最终')
      grantroleroles(this.roleId, finalRid).then(res => {
        console.log(res, '1111111')
        if (res.meta.status === 200) {
          this.$message.success('更新权限成功')
          this.grantdialogFormVisible = false
          this.init()
        }
      })
    },
    // 弹出角色授权对话框
    showGrantDialog (row) {
      this.grantdialogFormVisible = true
      this.roleId = row.id
      getAllRights('tree').then(res => {
        console.log(res, '2222')
        this.rightList = res.data
        console.log(this.rightList, '123')
      })
      this.selectedNode.length = 0
      //  获取当前角色的授权ID
      row.children.forEach((first, index) => {
        if (first.children && first.children.length > 0) {
          first.children.forEach((second, index) => {
            if (second.children && first.children.length > 0) {
              second.children.forEach((third, index) => {
                this.selectedNode.push(third.id)
              })
            }
          })
        }
      })
    },
    init () {
      getRolesList().then(res => {
        this.rolesList = res.data
      })
    }
  },
  mounted () {
    this.init()
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.box {
  height: 400px;
  overflow: auto;
}
</style>
