<template>
    <div>
        <headbar></headbar>
        <sidebar style="position:absolute"></sidebar>
        <main>
            <div style="margin-left:140px">
            <el-button size="mini" @click="addDept('/0/')">新建</el-button>
                <el-table :data="data" style="width: 100%;margin-bottom: 20px;" row-key="deptId" border default-expand-all>
                    <el-table-column prop="deptName" label="用户组名称" sortable width="180">
                    </el-table-column>
                    <el-table-column prop="leader" label="负责人" sortable width="130">
                    </el-table-column>
                    <el-table-column prop="phone" label="电话" sortable width="130">
                    </el-table-column>
                    <el-table-column prop="createdAt" label="创建时间" sortable width="180">
                    </el-table-column>
                    <el-table-column label="操作" sortable width="230">
                        <template slot-scope="scope">
                            <!--<el-button size="mini" @click="editDept(scope.$index, scope.row)">修改</el-button>-->
                            <el-button size="mini" @click="addDept(scope.$index, scope.row)">新增</el-button>
                            <el-button size="mini" type="danger" @click="delDept(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            
        </main>
    </div>
</template>

<script>
import headbar from "../../components/HeadBar.vue"
import sidebar from "../../components/SideNavigationBar.vue"
import Swal from 'sweetalert2'

console.log(Swal);
export default {
    components: {
        headbar,
        sidebar
    },
    created() {
        this.info()
    },
    data() {
        return {
            data: [],
            options:[],
            value:[]
        }
    },
    methods: {
       info(){
        this.$axios.get(
            "/api/dept/get", {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }
          }
          ).then(res => { 
            this.data = res.data.data;
            console.log(this.data);
          })
       },
        load(tree, treeNode, resolve) {
            setTimeout(() => {
                resolve([
                    {
                        id: 31,
                        date: '2016-05-01',
                        name: 'wangxiaohu'
                    }, {
                        id: 32,
                        date: '2016-05-01',
                        name: 'wangxiaohu'
                    }
                ])
            }, 1000)
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
        editDept(a,b){
          Swal.fire({
            title: '输入信息',
            html:
                '用户组名称<input id="deptname" class="swal2-input"><br>' +
                '负责人<input id="leader" class="swal2-input"><br>' +
                '电话<input id="phone" class="swal2-input"><br>' +
                '<br>',
            focusConfirm: false,
            preConfirm: () => {
              const json={
                "deptName":document.querySelector('#deptname').value,
                "deptPath":document.querySelector('#deptpath').value,
                "leader":document.querySelector('#leader').value,
                "parentId":parseInt(document.querySelector('#deptpath').value.split("/")[2]),
                "phone":document.querySelector('#phone').value,
                "status":2,
              }
              alert(json.parentId);
              this.$axios.put('/api/dept/update/'+b.deptId,json,{
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }}
              )
            }
          }).then((result) => {
            if (result.value) {
              console.log(result.value)
            }
            this.info()
          });
        },
        addDept(a,b){
          console.log(a,b);
            let deptPath;
            if (typeof a==="string") deptPath=a;
            else {
                deptPath=b.deptPath;
            }
          let arr=deptPath.split("/");
          let last = arr[arr.length-2]
          console.log(deptPath);
          console.log(last);
          console.log(deptPath.split("/")[3]);
          Swal.fire({
            title: '输入信息',
            html:
                '用户组名称<input id="deptname" class="swal2-input"><br>' +
                '负责人<input id="leader" class="swal2-input"><br>' +
                '电话<input id="phone" class="swal2-input"><br>' +
                '<br>',
            focusConfirm: false,
            preConfirm: () => {
              const json={
                "deptName":document.querySelector('#deptname').value,
                "deptPath":deptPath,
                "leader":document.querySelector('#leader').value,
                "parentId":parseInt(last),
                "phone":document.querySelector('#phone').value,
                "status":2,
              }
              this.$axios.post('/api/dept/create',json,{
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') }}
              )
            }
          }).then((result) => {
            this.info()
            if (result.value) {
              this.info()
              console.log(result.value)
            }
          });
        },
        delDept(a, b) {
                  this.$axios.delete(
                    "/api/dept/delete",
                      {headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth') },data:{ids:[b.deptId]}}

                  ).then(res => {
                    Swal.fire(
                        res.data.msg,
                        '',
                        'success'
                    )
                    this.info()
                  }).catch(() => {
                  })
        }
    },
}
</script>