<template>
    <div>
        <headbar></headbar>
        <sidebar style="position:absolute"></sidebar>
        <main>
            <button @click="addUser()">添加新用户</button>
           <br> <span>用户组编号表:</span>
            <div style="display:flex">
                
<el-tree :data="depts"  default-expand-all style="width:150px"></el-tree>
<el-tree :data="depts"  default-expand-all :props="{ label: 'id' }" style="width:150px"></el-tree>
</div>
            <table border="1px" cellspacing="0" style="border-color:#EBEEF5;" v-if="users">
                <tr>
                    <th>编号</th>
                    <th>用户账号</th>
                    <th>用户昵称</th>
                    <th>用户组</th>
                    <th>用户角色</th>
                    <th>手机号码</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
                <tr v-for="(user, index) in users" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.nickName }}</td>
                    <td>{{ user.deptName }}</td>
                    <td>{{ roles.filter(obj=>obj.roleId==user.roleId)[0].roleName }}</td>
                    <td>{{ user.phone }}</td>
                    <td><el-switch :value="user.status == '2'" @change="updateStatus(user, $event)" active-color="#13ce66"
                            inactive-color="#ccc">
                        </el-switch></td>
                    <td>{{ formatDate(user.createdAt) }}</td>
                    <td><button @click="editUser(index)">编辑</button><button @click="delUser(index)">删除</button><button
                            @click="chagePassword(index)">修改密码</button>
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
            users: [],
            newuser: [],
            roles:[],
            depts:[],
        }
    },
    created() {
        this.info();
        this.getRoleMenu();
        this.getDeptMenu();
    },
    methods: {
        updateStatus(role, value) {
            if (value) {
                role.status = "2";
            } else {
                role.status = "1";
            }
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
                this.users = res.data.data.list;
                for (var i = 0; i < this.users.length; i++) {
                    this.users[i].deptName=this.users[i].dept.deptName
                }
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
        addUser(index) {
            if (this.roleId==0) Swal.fire("请先选择用户角色！")
            else
            Swal.fire({
                title: '输入信息',
                html:
                    '用户账号<input id="username" class="swal2-input"><br>' +
                    '用户昵称<input id="nickname" class="swal2-input"><br>' +
                    '用户组&emsp;<input type="number" id="deptId" class="swal2-input"><br>' +
                    '手机号码<input type="text" id="phone" class="swal2-input"><br>' +
                    '用户密码<input type="password" id="password" class="swal2-input">' +
                    '<br>' +
                    '<label for="isEnable">启用</label>' +
                    '<input type="radio" id="swal-radio1" name="radio" default>' +
                    '<label for="isEnable">停用</label>' +
                    '<input type="radio" id="swal-radio2" name="radio">'+
                    '<br>' +
                    '<label for="isEnable">系统管理员</label>' +
                    '<input type="radio" id="swal-radio2" name="radio1" default>' +
                    '<label for="isEnable">普通用户</label>' +
                    '<input type="radio" id="swal-radio2" name="radio1">',
                    
                focusConfirm: false,
                preConfirm: () => {
                    const json = {
                        "userId": this.users.length + 2,
                        "username": document.querySelector('#username').value,
                        "nickname": document.querySelector('#nickname').value,
                        "deptId": parseInt(document.querySelector('#deptId').value, 10),
                        "roleId": parseInt(document.getElementById('swal-radio2').checked ? '2' : '1'),
                        "phone": document.querySelector('#phone').value,
                        "password": document.querySelector('#password').value,
                        "status": document.getElementById('swal-radio1').checked ? '2' : '1',
                    }
                    this.$axios.post('/api/sys-user/create', json, {
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
                    }
                    ).then(res=>{
                        console.log(res);
                        this.info()
                    })
                }
            }).then((result) => {
                if (result.value) {
                    console.log(result.value)
                }
            }); console.log(index);
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
        editUser(index) {

            Swal.fire({
                title: '输入信息',
                html:
                    '用户名称<input id="username" class="swal2-input"><br>' +
                    '用户昵称<input id="nickname" class="swal2-input"><br>' +
                    '部门<input type="number" id="deptId" class="swal2-input"><br>' +
                    '手机号码<input type="text" id="phone" class="swal2-input"><br>' +
                    '用户密码<input type="password" id="password" class="swal2-input">' +
                    '<br>' +
                    '<label for="isEnable">启用</label>' +
                    '<input type="radio" id="swal-radio1" name="radio" default>' +
                    '<label for="isEnable">停用</label>' +
                    '<input type="radio" id="swal-radio2" name="radio">',
                focusConfirm: false,
                preConfirm: () => {
                    const json = {
                        "userId": index,
                        "username": document.querySelector('#username').value,
                        "nickname": document.querySelector('#nickname').value,
                        "deptId": parseInt(document.querySelector('#deptId').value, 10),
                        "phone": document.querySelector('#phone').value,
                        "password": document.querySelector('#password').value,
                        "status": document.getElementById('swal-radio1').checked ? '2' : '1',
                    }
                    this.users[index].username = json.username;
                    this.users[index].nickname = json.nickname;
                    this.users[index].deptId = json.deptId;
                    this.users[index].phone = json.phone;
                    this.users[index].password = json.password;
                    this.users[index].status = json.status;
                    this.$axios.put(
                        "/api/sys-user/update", json, {
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
            // Swal.fire({
            //     title: '请输入用户名称',
            //     input: 'text',
            //     inputAttributes: {
            //         autocapitalize: 'off'
            //     },
            //     showCancelButton: true,
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     showLoaderOnConfirm: true,
            //     preConfirm: (name) => {
            //       this.users[index].username=name;
            //       const json=this.users[index];
            //       this.$axios.put(
            //           "/api/sys-user/update/2",json,{
            //             headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }}
            //       ).then(res=>Swal.fire(res.data.msg,'','success'));
            //     },
            //     allowOutsideClick: () => !Swal.isLoading()
            // }).then((result) => {
            //     if (result.isConfirmed) {
            //         Swal.fire({
            //             title: `${result.value.login}`,
            //         })
            //     }
            //})
        }, formatDate(dateStr) {
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
        }
    },
}
</script>

<style scoped>
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
table{
    border: 1px solid #ebeef5;
    border-collapse: collapse;
}
</style>