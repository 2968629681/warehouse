<template>
    <div>
        <headbar></headbar>
        <sidebar style="position:absolute"></sidebar>
        <main>
            <el-button @click="dialogFormVisible = true" type="primary">添加新用户</el-button>
           <br> <span>用户组编号表:</span>
    <el-table :data="users"
        style="width: 100%;display:inline-block;" max-height="740">
        <el-table-column prop="username" label="用户账号" width="150"/>
        <el-table-column prop="nickName" label="用户昵称" width="150"/>
        <el-table-column prop="deptName" label="用户组" width="150"/>
        <el-table-column prop="roleName" label="用户角色" width="150"/>
        <el-table-column prop="phone" label="手机号码" width="150"/>
        <el-table-column prop="createdAt" label="创建时间" width="200" />
        <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
            <el-button @click.native.prevent="editUser(scope.$index, users)" size="mini">
            编辑
            </el-button>
            <el-button @click.native.prevent="chagePassword(scope.$index, users)" type="primary" size="mini">
            修改密码
            </el-button>
            <el-button @click.native.prevent="delUser(scope.$index, users)" type="danger" size="mini">
            删除
            </el-button>
        </template>
        </el-table-column>
    </el-table>
        </main>
        <el-dialog title="新增用户" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
        <el-form :model="form">
            <el-form-item label="用户账号" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" :label-width="formLabelWidth">
            <el-input v-model="form.nickname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机密码" :label-width="formLabelWidth">
                <el-input v-model="form.phone" autocomplete="off"></el-input>
            </el-form-item>
            <!-- // select框绑定的值是selectVal，也就是depts里的value -->
            <el-form-item :label-width="formLabelWidth" label="权限范围">
                <el-select
                v-model="form.deptId"
                placeholder="请选择..."
                clearable
                ref="select"
                >
                <!-- // 设置一个input框用作模糊搜索选项功能 -->
                <el-input
                    class="input"
                    placeholder="此处键入'关键词'搜索查询"
                    prefix-icon="el-icon-search"
                    v-model="treeFilter"
                    size="mini"
                    clearable
                ></el-input>
                <!-- // 设置一个隐藏的下拉选项，选项显示的是汉字label，值是value
                // 如果不设置一个下拉选项，下面的树形组件将无法正常使用 -->
                <el-option hidden key="id" :value="selectVal" :label="selectName">
                </el-option>
                <!-- // 设置树形控件 -->
                <el-tree
                    :data="depts"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    :expand-on-click-node="false"
                    :check-on-click-node="true"
                    ref="tree"
                    node-key="id"
                    :default-expand-all="true"
                    :filter-node-method="filterNode"
                >
                <!-- // @node-click：树形控件选项点击事件
                // :expand-on-click-node：使树形控件只有点箭头图标的时候才会展开或者收缩节点，为false则点文字直接选中该项
                // :check-on-click-node：是否在点击节点的时候选中节点，当选项为复选框时有用，这个属性可以删除
                // :default-expand-all：默认展开所有节点
                // :filter-node-method：实现搜索功能的筛选方法 -->
                
                    <span slot-scope="{ data }">  
                    <!-- //选项用插槽来显示，匹配搜索功能，并方便增加tag标签需求 -->
                    <span>{{ data.label }}</span>
                    </span>
                </el-tree>
            </el-select>
            </el-form-item>
            
            <!-- <el-form-item label="用户组" :label-width="formLabelWidth">
                <el-select v-model="form.deptId" placeholder="请选择权限范围">
                    <el-option label="XX省" value='1'></el-option>
                    <el-option label="XX市" value='11'></el-option>
                    <el-option label="XX区" value='21'></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="用户等级" :label-width="formLabelWidth">
                <el-radio v-model="radio1" label="1">系统管理员</el-radio>
                <el-radio v-model="radio1" label="2">普通用户</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="queren">确 定</el-button>
        </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="编辑用户" :visible.sync="dialogFormVisible1" :modal-append-to-body="false">
        <el-form :model="form1">
            <el-form-item label="用户账号" :label-width="formLabelWidth">
            <el-input v-model="form1.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" :label-width="formLabelWidth">
            <el-input v-model="form1.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" :label-width="formLabelWidth">
            <el-input v-model="form1.nickName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机密码" :label-width="formLabelWidth">
                <el-input v-model="form1.phone" autocomplete="off"></el-input>
            </el-form-item>
        <!-- // select框绑定的值是selectVal，也就是depts里的value -->
        <el-form-item :label-width="formLabelWidth" label="权限范围">
                <el-select
                v-model="form.deptId"
                placeholder="请选择..."
                clearable
                ref="select"
                >
                <!-- // 设置一个input框用作模糊搜索选项功能 -->
                <el-input
                    class="input"
                    placeholder="此处键入'关键词'搜索查询"
                    prefix-icon="el-icon-search"
                    v-model="treeFilter"
                    size="mini"
                    clearable
                ></el-input>
                <!-- // 设置一个隐藏的下拉选项，选项显示的是汉字label，值是value
                // 如果不设置一个下拉选项，下面的树形组件将无法正常使用 -->
                <el-option hidden key="id" :value="selectVal" :label="selectName">
                </el-option>
                <!-- // 设置树形控件 -->
                <el-tree
                    :data="depts"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    :expand-on-click-node="false"
                    :check-on-click-node="true"
                    ref="tree"
                    node-key="id"
                    :default-expand-all="true"
                    :filter-node-method="filterNode"
                >
                <!-- // @node-click：树形控件选项点击事件
                // :expand-on-click-node：使树形控件只有点箭头图标的时候才会展开或者收缩节点，为false则点文字直接选中该项
                // :check-on-click-node：是否在点击节点的时候选中节点，当选项为复选框时有用，这个属性可以删除
                // :default-expand-all：默认展开所有节点
                // :filter-node-method：实现搜索功能的筛选方法 -->
                
                    <span slot-scope="{ data }">  
                    <!-- //选项用插槽来显示，匹配搜索功能，并方便增加tag标签需求 -->
                    <span>{{ data.label }}</span>
                    </span>
                </el-tree>
            </el-select>
            </el-form-item>
            
            <!-- <el-form-item label="用户组" :label-width="formLabelWidth">
                <el-select v-model="form1.deptId" placeholder="请选择权限范围">
                    <el-option label="XX省" value=1></el-option>
                    <el-option label="XX市" value=11></el-option>
                    <el-option label="XX区" value=21></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="用户等级" :label-width="formLabelWidth">
                <el-radio v-model="radio3" label="1">系统管理员</el-radio>
                <el-radio v-model="radio3" label="2">普通用户</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="queren1">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import headbar from "../../components/HeadBar.vue"
import sidebar from "../../components/SideNavigationBar.vue"
import Swal from 'sweetalert2';
export default {
    components: {
        headbar,
        sidebar
    },
    data() {
        return {
            dialogFormVisible: false,
            dialogFormVisible1: false,
            formLabelWidth: '120px',
            users: [],
            newuser: [],
            roles:[],
            depts:[],
            form:{},
            form1:{},
            value: '',
            value1: '',
            radio:'1',
            radio1:'1',
            radio2:'1',
            radio3:'1',
            selectVal: "", // select框的绑定值
            selectName: "", // select框显示的name
            treeFilter: "", // 搜索框绑定值，用作过滤
            // 树形控件数据
            treeData: [],
            defaultProps: {
                children: "children",
                label: "name",
            },
        }
    },
    watch: {
    // 搜索过滤，监听input搜索框绑定的treeFilter
    treeFilter(val) {
      this.$refs.tree.filter(val);
      // 当搜索框键入值改变时，将该值作为入参执行树形控件的过滤事件filterNode
    },
  },
    created() {
        this.info();
        this.getRoleMenu();
        this.getDeptMenu();
    },
    methods: {
        // 结构树点击事件
    handleNodeClick(data) {
      this.selectVal = data.value; // select绑定值为点击的选项的value
      this.selectName = data.label; // input中显示值为label
      console.log(this.selectVal,this.selectName,data);
      this.treeFilter = ""; // 点击后搜索框清空
      this.$refs.select.blur(); // 点击后关闭下拉框，因为点击树形控件后select不会自动折叠
    },
    // 模糊查询（搜索过滤），实质为筛选出树形控件中符合输入条件的选项，过滤掉其他选项
    filterNode(value, data) {
      if (!value) return true;
      let filterRes = data.label.indexOf(value) !== -1;
      return filterRes;
    },
        queren(){
            // this.form.userId = this.users.length + 2
            this.form.status = '2'
            this.form.deptId = parseInt(this.$refs.tree.data[0].id)
            this.form.roleId = parseInt(this.radio1)
            this.$axios.post('/api/sys-user/create', this.form, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
            }
            ).then(res=>{
                console.log(res,456);
                if(res.data.code ==500){
                    this.notifyId = this.$notify({
                    message: "新增失败，请全部输入后在提交",
                    duration: 2000
                    })
                }else{
                    this.info()
                    this.dialogFormVisible = false
                    this.form={},
                    this.value=''
                    this.selectVal= "", // select框的绑定值
                    this.selectName= "", // select框显示的name
                    this.treeFilter= "", // 搜索框绑定值，用作过滤
                    this.notifyId = this.$notify({
                        message: "新增成功",
                        duration: 2000
                    })
                }
                
            }).catch(err=>{
                console.log(err)
                this.notifyId = this.$notify({
                    message: "新增失败",
                    duration: 2000
                })
            })
        },
        queren1(){
            this.form1.status = '2'
            this.form1.deptId = parseInt(this.$refs.tree.data[0].id)
            this.form1.roleId = parseInt(this.radio3)
            this.$axios.put(
                        "/api/sys-user/update", this.form1, {
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
                    }
                    ).then(res => {
                        this.info()
                        this.dialogFormVisible1=false
                        console.log(res);
                        Swal.fire(res.data.msg, '', 'success')
                    });
        },
        info() { // 获取信息
            if (!this.$store.state.user) {
                this.notifyId = this.$notify({
                    message: "权限不足,无法进入",
                    duration: 2000
                })
                this.$router.replace({
                    name: 'home'
                })
            }
            this.$axios({
                method: 'get',
                url: "/api/sys-user/get",
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
            }).then(res => {
                console.log(res,222);
                this.users = res.data.data.list;
                console.log(this.users);
                for (var i = 0; i < this.users.length; i++) {
                    this.users[i].deptName=this.users[i].dept.deptName
                    this.users[i].createdAt=this.dayjs(this.users[i].createdAt).format("YYYY-MM-DD HH:mm:ss")
                    if(this.users[i].status == 2){
                        this.users[i].status = true
                    }
                    if(this.users[i].roleId == 1){
                        this.users[i].roleName = '系统管理员'
                    }
                    else{
                        this.users[i].roleName = '普通用户'
                    }
                }
                console.log(this.users)
            }).catch(() => {
            })
        },
        delUser(index) {
            Swal.fire({
                title: '是否确定删除该用户?',
                text: "",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                cancelButtonText: '取消',
                confirmButtonText: '确认删除'
            }).then((result) => {
                console.log(this.users[index].userId);
                if (result.isConfirmed) {
                    this.$axios.delete(
                        `/api/sys-user/delete/${this.users[index].userId}`,
                        { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') } }
                        //{headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') },data:{ids:[index+1]}}

                    ).then(res => {
                        console.log(res);
                    }).catch(() => {
                    })
                    this.users.splice(index, 1);
                    Swal.fire(
                        '删除成功',
                        '',
                        'success'
                    )
                }
            });
        },

        chagePassword(index) {
            Swal.fire({
                title: '请输入新的密码',
                input: 'password',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showLoaderOnConfirm: true,
                preConfirm: (password) => {
                    let json = {};
                    json.userId=this.users[index].userId;
                    json.password = password;
                    this.$axios.put(
                        "/api/user/pwd/reset", json, {
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
                    }
                    ).then(res => Swal.fire(res.data.msg, '', 'success'));
                }
            }).then((result) => {
                if (result.value) {
                    Swal.fire({
                        title: `${result.value}`,
                    })
                }
            });
        },
        editUser(index,table) {
            console.log(index,table)
            this.form1=table[index]
            this.form1.deptId=''
            this.dialogFormVisible1=true;
            console.log(this.form1)
        }, 
        formatDate(dateStr) {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = this.padZero(date.getMonth() + 1);
            const day = this.padZero(date.getDate());
            const hour = this.padZero(date.getHours());
            const minute = this.padZero(date.getMinutes());
            const second = this.padZero(date.getSeconds());

            return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        },

        padZero(num) {
            return num.toString().padStart(2, '0');
        },
        getDeptMenu(){
            this.$axios({
                method: 'get',
                url: "/api/deptTree",
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
            }).then(res => {
                this.depts = res.data.data;
            }).catch(() => {
            })
        },
        getRoleMenu(){
            this.$axios({
                method: 'get',
                url: "/api/role/get",
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
            }).then(res => {
                this.roles = res.data.data.list;
            }).catch(() => {
            })
        },
        
    },
}
</script>

<style scoped>
main {
    margin-left: 140px;
}
.input {
  width: 260px;
  margin: 10px;
}
</style>