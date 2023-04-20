<template>
   <div>
        <headbar></headbar>
        <sidebar style="position:absolute"></sidebar>
        <div style="display:inline-block;width: 1650px">
                <div style="display:inline-block;width: 370px;margin-left: 140px;">
                    <el-button type="primary" @click="dialogFormVisible = true;index=0" style="margin-left: 140px;">新增入库申请人</el-button>
                    <el-table
                        :data="getSearchInfo"
                        max-height="800"
                        stripe>
                        <el-table-column prop=name label="入库申请人"/>
                        <el-table-column
                          fixed="right"
                          width="120">
                          <template slot-scope="scope">
                            <el-button
                                  @click.native.prevent="index=0;deleteRow(scope.$index, getSearchInfo);"
                                  type="text"
                                  size="small">
                                  删除
                                </el-button>
                              </template>
                            </el-table-column>
                    </el-table>   
                </div>

                <div style="display:inline-block;width: 370px;vertical-align: top;margin-left: 5px;">
                    <el-button type="primary" @click="dialogFormVisible = true;index=1" style="margin-left: 140px;">新增出库申请人</el-button>
                        <el-table
                            :data="getSearchInfo1"
                            max-height="800"
                            stripe>
                            <el-table-column prop="name" label="出库申请人"/>
                            <el-table-column
                          fixed="right"
                          width="120">
                          <template slot-scope="scope">
                            <el-button
                                  @click.native.prevent="index=1;deleteRow(scope.$index, getSearchInfo1)"
                                  type="text"
                                  size="small">
                                  删除
                                </el-button>
                              </template>
                            </el-table-column>
                        </el-table>
                </div>
                <div style="display:inline-block;width: 370px;vertical-align: top;margin-left: 5px;">
                    <el-button type="primary" @click="dialogFormVisible = true;index=2" style="margin-left: 140px;">新增计量单位</el-button>
                    <el-table
                        :data="getSearchInfo2"
                        max-height="800"                  
                        stripe>
                        <el-table-column prop="name" label="计量单位"/>
                        <el-table-column
                          fixed="right"
                          width="120">
                          <template slot-scope="scope">
                            <el-button
                              @click.native.prevent="index=2;deleteRow(scope.$index, getSearchInfo2)"
                              type="text"
                              size="small">
                              删除
                            </el-button>
                          </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="display:inline-block;width: 370px;vertical-align: top;margin-left: 5px;">
                    <el-button type="primary" @click="dialogFormVisible = true;index=3" style="margin-left: 140px;">新增库位</el-button>
                        <el-table
                            :data="getSearchInfo3"
                            max-height="800"                     
                            stripe>
                            <el-table-column prop="name" label="库位"/>
                            <el-table-column
                              fixed="right"
                              width="120">
                              <template slot-scope="scope">
                                <el-button
                                  @click.native.prevent="index=3;deleteRow(scope.$index, getSearchInfo3)"
                                  type="text"
                                  size="small">
                                  删除
                                </el-button>
                              </template>
                            </el-table-column>
                        </el-table>
                    </div>
        </div>
        <el-dialog :title="na[index]" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
          <el-form :model="form">
            <el-form-item :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="quxiao">取 消</el-button>
            <el-button type="primary" @click="queding">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import headbar from "../../components/HeadBar.vue"
import sidebar from "../../components/SideNavigationBar.vue"

export default{
    components: {
        headbar,
        sidebar
  },
  data() {
      return {
        getSearchInfo:[],
        getSearchInfo1:[],
        getSearchInfo2:[],
        getSearchInfo3:[],
        index:0,
        na:["新增入库申请人","新增出库申请人","新增计量单位","新增库位"],
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form: {
          name: '',
          type: [],
        },
    }},
  created() {
      this.info()
    },
    methods: {
      info() { // 获取信息
        if( !this.$store.state.user){
          this.notifyId = this.$notify({
            message: "权限不足,无法进入",
            duration: 2000
          })
          this.$router.replace({
          name:'home'
          })
        }
        var that = this
        this.$axios({
          method: 'get',
          url:"/api/config/get",
          headers: { 'Authorization': 'Bearer ' +localStorage.getItem('auth') }
          }).then(res =>{
            that.getSearchInfo = res.data.data.inbound_persons
            that.getSearchInfo1 = res.data.data.outbound_persons
            that.getSearchInfo2 = res.data.data.units
            that.getSearchInfo3 = res.data.data.strong_locations
          }).catch(() =>{
        })
      },
      quxiao(){
        this.dialogFormVisible = false
        this.form.name=''
      },
      queding(){
        var that=this
        this.dialogFormVisible = false
        if(this.index==0){
            this.$axios({
              method: 'post',
              url:"/api/config/add",
              headers: { 'Authorization': 'Bearer ' +localStorage.getItem('auth') },
              params:{ inbound_persons:that.form.name}
            }).then((res) =>{
              this.getSearchInfo=res.data.data.inbound_persons
              that.$message({
                type: 'success',
                message: '新增成功!'
              });
            }).catch(() => {
              this.$message({
              message: '新增失败,请检查网络',
              type: 'error'
            });        
            });
          }else if(this.index ==1) {
            this.$axios({
              method: 'post',
              url:"/api/config/add",
              headers: { 'Authorization': 'Bearer ' +localStorage.getItem('auth') },
              params:{ outbound_persons:that.form.name }
            }).then((res) =>{
              this.getSearchInfo1=res.data.data.outbound_persons
              that.$message({
                type: 'success',
                message: '新增成功!'
              });
            }).catch(() => {
              this.$message({
              message: '新增失败,请检查网络',
              type: 'error'
            });        
            });
          }
          else if(this.index ==2)  {
            this.$axios({
              method: 'post',
              url:"/api/config/add",
              headers: { 'Authorization': 'Bearer ' +localStorage.getItem('auth') },
              params:{ units:that.form.name }
            }).then((res) =>{
              this.getSearchInfo2=res.data.data.units
              that.$message({
                type: 'success',
                message: '新增成功!'
              });
            }).catch(() => {
              this.$message({
              message: '新增失败,请检查网络',
              type: 'error'
            });        
            });
          }
          else {
            this.$axios({
              method: 'post',
              url:"/api/config/add",
              headers: { 'Authorization': 'Bearer ' +localStorage.getItem('auth') },
              params:{ storage_location:that.form.name }
             }).then((res) =>{
              this.getSearchInfo3=res.data.data.strong_locations
                that.$message({
                  type: 'success',
                  message: '新增成功!'
                });
              }).catch(() => {
                this.$message({
                message: '新增失败,请检查网络',
                type: 'error'
                });        
              });
            }
            this.form.name=''
      },
      open(index1, rows) {
        var that=this
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.index==0){
            this.$axios({
              method: 'post',
              url:"/api/config/delete",
              headers: { 'Authorization': 'Bearer ' +localStorage.getItem('auth') },
              params:{ inbound_persons:rows[index1].name }
            }).then(() =>{
              rows.splice(index1, 1)
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
            }).catch(() => {
              this.$message({
              message: '删除失败,请检查网络',
              type: 'error'
            });        
            });
          }else if(this.index ==1) {
            this.$axios({
              method: 'post',
              url:"/api/config/delete",
              headers: { 'Authorization': 'Bearer ' +localStorage.getItem('auth') },
              params:{ outbound_persons:rows[index1].name }
            }).then(() =>{
              rows.splice(index1, 1)
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
            }).catch(() => {
              this.$message({
              message: '删除失败,请检查网络',
              type: 'error'
            });        
            });
          }
          else if(this.index ==2)  {
            this.$axios({
              method: 'post',
              url:"/api/config/delete",
              headers: { 'Authorization': 'Bearer ' +localStorage.getItem('auth') },
              params:{ units:rows[index1].name }
            }).then(() =>{
              rows.splice(index1, 1)
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
            }).catch(() => {
              this.$message({
              message: '删除失败,请检查网络',
              type: 'error'
            });        
            });
          }
          else {
            this.$axios({
              method: 'post',
              url:"/api/config/delete",
              headers: { 'Authorization': 'Bearer ' +localStorage.getItem('auth') },
              params:{ strong_locations:rows[index1].name }
             }).then(() =>{
                rows.splice(index1, 1);
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }).catch(() => {
                this.$message({
                message: '删除失败,请检查网络',
                type: 'error'
                });        
              });
            }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      deleteRow(index1, rows) {
        this.open(index1, rows)
      }
    },
}
</script>
