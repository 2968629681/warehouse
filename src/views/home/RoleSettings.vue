<template>
    <div>
        <headbar></headbar>
        <sidebar style="position:absolute"></sidebar>
        <main>

            <button @click="addRole()">添加</button>
            <table border="1" cellspacing="0" style="border-color:#ededed;" v-if="roles">
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
                        <!--<button @click="editPermission(index)">修改权限</button>-->
                    </td>
                </tr>
            </table>
        </main>
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
            roles: [],
            menu: [],
            props: { label: "title" },
            value: false,
            datascope: ["全部", " 本部门", " 本部门及以下", " 仅本人"]
        }
    },
    created() {
        this.info();
    },
    methods: {
        updateStatus(role, value) {
            if (value) {
                role.status = "2";
            } else {
                role.status = "1";
            }
            const json = role;
            this.$axios.put(
                "/api/role/update/3", json, {
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
                console.log(res);
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
        delRole(index) {
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
                        { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }, data: { ids: [this.roles[index].roleId] } }

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
        addRole(index) {

            Swal.fire({
                title: '输入信息',
                html:
                    '角色名称<input id="rolename" class="swal2-input"><br>' +
                    '权限字符<input id="rolekey" class="swal2-input"><br>' +
                    '<br>' +
                    '<label for="isEnable">启用</label>' +
                    '<input type="radio" id="swal-radio1" name="radio" default>' +
                    '<label for="isEnable">停用</label>' +
                    '<input type="radio" id="swal-radio2" name="radio">',
                focusConfirm: false,
                preConfirm: () => {
                    const json = {
                        "admin": this.$store.state.user,
                        "roleName": document.querySelector('#rolename').value,
                        "roleKey": document.querySelector('#rolekey').value,
                        "status": document.getElementById('swal-radio1').checked ? '2' : '1',
                    }
                    this.$axios.post('/api/role/create', json, {
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
                    }
                    )
                }
            }).then((result) => {
                if (result.value) {
                    console.log(result.value)
                }
            }); console.log(index);
        },
        editName(index) {
            Swal.fire({
                title: '请输入角色名称',
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showLoaderOnConfirm: true,
                preConfirm: (name) => {
                    this.roles[index].roleName = name;
                    const json = this.roles[index];
                    this.$axios.put(
                        "/api/role/update/2", json, {
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
                    }
                    ).then(res => Swal.fire(res.data.msg, '', 'success'));
                },
                allowOutsideClick: () => !Swal.isLoading()
            })//.then((result) => {
            //if (result.isConfirmed) {
            //Swal.fire({
            //title: `${result.msg}`,
            //})
            // }
            //})
        },
        editPermission(index,role) {
console.log(role);
            let json=this.roles[index];
            json.roleId=this.roles[index].roleId,
            json.menuIds=this.$refs.tree[index].getCheckedKeys() 
            this.$axios.put('/api/role/update/'+this.roles[index].roleId,json, {
                       headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
                    })
        },
        changecope(index, tab) {
            const rule=['','3','4','5']
            const json={
                "dataScope":rule[tab],
                "roleId":this.roles[index].roleId 
            }
            this.$axios.put('/api/roledatascope',json, {
                       headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
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

button {
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
}

td {
    padding: 9px;
}

th {
    padding: 9px;
}
</style>