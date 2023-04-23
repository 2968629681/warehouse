<template>
    <div>
        <headbar></headbar>
        <sidebar style="position:absolute"></sidebar>
        <main>
            <el-button @click="dialogFormVisible = true" type="primary">添加新角色</el-button>
        <el-table :data="roles"
            style="width: 100%;display:inline-block;" max-height="740">
            <el-table-column prop="roleId" label="角色编号" width="150"/>
            <el-table-column prop="roleName" label="角色名称" width="150"/>
            <el-table-column prop="roleKey" label="权限字符" width="150"/>
            <el-table-column prop="roleSort" label="显示顺序" width="150"/>        
            <el-table-column label="是否启用" width="150">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        active-color="#02538C"
                        inactive-color="#B9B9B9"
                        disabled/>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="200" />
            <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
                <el-button @click.native.prevent="editRole(scope.$index, roles)" size="mini">
                编辑
                </el-button>
                <el-button size="mini" @click="limits(scope.$index, roles)" type="primary">
                控制权限
                </el-button>
                <el-button type="danger" size="mini" @click="delRole(scope.$index, roles)">
                删除
                </el-button>
            </template>
            </el-table-column>
        </el-table>
            <!-- <table border="1" cellspacing="0" style="border-color:#ededed;" v-if="roles">
                <tr>
                    <th>角色编号</th>
                    <th>角色名称</th>
                    <th>权限字符</th>
                    <th>显示顺序</th>
                    <th>状态</th>
                    <th>权限</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
                <tr v-for="(role, index) in roles" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ role.roleName }}</td>
                    <td>{{ role.roleKey }}</td>
                    <td>{{ role.roleSort }}</td>
                    <td><el-switch :value="role.status == '2'" @change="updateStatus(role, $event)" active-color="#13ce66"
                            inactive-color="#ccc">
                        </el-switch>
                    </td>
                    <td><el-tree ref="tree" :props="props" node-key="menuId" :data="menu" :default-checked-keys="role.menuIds" show-checkbox @check-change="editPermission(index)">
                        </el-tree>
                        <span>数据范围:</span>
                        <select @change="changecope(index, $event.srcElement.selectedIndex)">
                            <option v-for="a in datascope" :key="a" :label="a">{{ a }}</option>
                        </select>
                    </td>
                    <td>{{ formatDate(role.createdAt) }}</td>
                    <td><button @click="editName(index)">修改</button>
                        <button @click="delRole(index)">删除角色</button>
                        <button @click="editPermission(index)">修改权限</button>-->
                    <!-- </td>
                </tr>
            </table> -->
        </main>
        <el-dialog title="编辑角色" :visible.sync="dialogFormVisible1" :modal-append-to-body="false">
        <el-form :model="form">
            <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="form.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="权限字符" :label-width="formLabelWidth">
            <el-input v-model="form.roleKey" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="queren">确 定</el-button>
        </div>
        </el-dialog>

        <el-dialog title="添加新角色" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
        <el-form :model="form1">
            <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="form1.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="权限字符" :label-width="formLabelWidth">
            <el-input v-model="form1.roleKey" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" :label-width="formLabelWidth">
                <el-radio v-model="form1.radio" label="1">禁用</el-radio>
                <el-radio v-model="form1.radio" label="2">启用</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="queren1">确 定</el-button>
        </div>
        </el-dialog>

        <el-dialog title="修改权限" :visible.sync="dialogFormVisible2" :modal-append-to-body="false">
            <el-tree ref="tree" :props="props" node-key="menuId" :data="menu" :default-checked-keys="roles.menuIds" show-checkbox @check-change="editPermission">
            </el-tree>
            <span>数据范围:</span>
            <select @change="changecope(index, $event.srcElement.selectedIndex)">
                <option v-for="a in datascope" :key="a" :label="a">{{ a }}</option>
            </select>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogFormVisible2 = false">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import headbar from "../../components/HeadBar.vue"
import sidebar from "../../components/SideNavigationBar.vue"
import Swal from 'sweetalert2'

export default {
    components: {
        headbar,
        sidebar
    },
    data() {
        return {
            dialogFormVisible: false,
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            formLabelWidth:'120px',
            roles: [],
            menu: [],
            form:{},
            form1:{},
            props: { label: "title" },
            value: false,
            datascope: ["全部", " 本部门", " 本部门及以下", " 仅本人"],
            index:'',
            index1:'',
        }
    },
    created() {
        this.info();
    },
    methods: {
        limits(index,roles){
            this.dialogFormVisible2 = true
            console.log(index,roles);
            this.index1=index
        },
        queren1(){
            console.log(this.form1);
            this.form1.status = this.form1.radio.radio
            this.form1.admin =this.$store.state.user
            this.$axios.post('/api/role/create', this.form1, {
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
                    }).then(res=>{
                        console.log(res);
                        this.info()
                        this.form1={}
                        this.dialogFormVisible=false
                        Swal.fire(
                        '新增成功',
                        '',
                        'success'
                        )
                    }).catch(err=>{
                        console.log(err);
                        Swal.fire(
                        '新增失败',
                        '',
                        'warning'
                        )
                    })
        },
        queren(){
            console.log(this.form);
            this.$axios.put(
                `/api/role/update/${this.index}`, this.form, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
            }
            ).then(res => {
                console.log(res);
                Swal.fire(res.data.msg, '', 'success')
                this.dialogFormVisible=false
                this.info()
            }
                );
        },
        editRole(index,roles) {
            console.log(index,roles);
            this.index=roles[index].roleId
            this.dialogFormVisible1=true
        },
        updateStatus(role, value) {
            if (value) {
                role.status = "2";
            } else {
                role.status = "1";
            }
            const json = role;
            this.$axios.put(
                "/api/role/update/", json, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
            }
            ).then(res => Swal.fire(res.data.msg, '', 'success'));
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
                url: "/api/menu/get",
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
            }).then(res => {
                this.menu = res.data.data;
                console.log(this.menu);
            }).catch(() => {
            })
            this.$axios({
                method: 'get',
                url: "/api/role/get",
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
            }).then(res => {
                this.roles = res.data.data.list;
                for (var i = 0; i < this.roles.length; i++) {
                    this.roles[i].createdAt=this.formatDate(this.roles[i].createdAt)
                    if(this.roles[i].status == 2){
                        this.roles[i].status = true
                    }else{
                        this.roles[i].status = false
                    }
                }
                console.log(res)
            }).catch(() => {
            })
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
        handleCheckChange(data) {
            console.log(data);
        },
        padZero(num) {
            return num.toString().padStart(2, '0');
        },
        delRole(index,role) {
            var roles = [role[index].roleId]
            Swal.fire({
                title: '是否确定删除该角色?',
                text: "",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                cancelButtonText: '取消',
                confirmButtonText: '确认删除'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$axios.delete(
                        "/api/role/delete",
                        { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }, data: { ids: roles } }

                    ).then(res => {
                        console.log(res);
                    }).catch(() => {
                    })
                    this.roles.splice(index, 1);
                    Swal.fire(
                        '删除成功',
                        '',
                        'success'
                    )
                }
            });
        },
        editPermission() {
            console.log(this.index1)
            let json=this.roles[this.index1];
            json.roleId=this.roles[this.index1].roleId,
            json.menuIds=this.$refs.tree.getCheckedKeys()
            if (json.status) {
                json.status='2'
            }else{
                json.status='1'
            }
            console.log(json,123)
            this.$axios.put(`/api/role/update/${json.roleId}`,json, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
            }).then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err);
            })
        },
        changecope(index,tab) {
            const rule=['1','3','4','5']
            const json={
                "dataScope":rule[tab],
                "roleId":this.roles[this.index1].roleId
            }
            console.log(tab,json);
            this.$axios.put('/api/roledatascope',json, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
            }).then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err);
            })
        }
    },
}
</script>


<style scoped>
table{
    border: 1px solid #ebeef5;
    border-collapse: collapse;
}
main {
    margin-left: 140px;
}

ul li {
    padding: 1rem;
    border-bottom: 1px solid #ccc;
}

/* button {
    margin: 0 .4rem;
    box-shadow: inset 0px 1px 0px 0px #ffffff;
    background: linear-gradient(to bottom, #ededed 5%, #dfdfdf 100%);
    background-color: #ededed;
    border-radius: 6px;
    border: 1px solid #dcdcdc;
    display: inline-block;
    color: #777777;
    font-family: Arial;
    font-size: 15px;
    font-weight: bold;
    padding: 6px 24px;
    text-decoration: none;
    text-shadow: 0px 1px 0px #ffffff;
}

button:hover {
    background: linear-gradient(to bottom, #dfdfdf 5%, #ededed 100%);
    background-color: #dfdfdf;
}

button:active {
    position: relative;
    top: 1px;
} */

td {
    padding: 9px;
}

th {
    padding: 9px;
}
</style>