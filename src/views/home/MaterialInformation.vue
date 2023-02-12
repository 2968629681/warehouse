<template>
    <div>
        <headbar></headbar>
        <sidebar style="position:absolute"></sidebar>
        <div>
          <div style="display:inline-block;margin-left: 140px;">
              <el-input v-model="searchTableInfo" prefix-icon="el-icon-search" placeholder="请输入搜索内容"
                      style="width:240px;display:inline-block"/>
              <el-button type="primary" @click="dialogFormVisible = true" style="margin-left:920px;display:inline-block">新增物料信息</el-button>
              <el-table
                :data="tableData==null?tableData:tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
                style="width: 1500px;display:inline-block;"
                max-height="740"
                :row-class-name="tableRowClassName">
                <el-table-column prop="item_id" label="物料编号"/>
                <el-table-column prop="item_name" label="物料名称"/>
                <el-table-column prop="specification" label="规格型号"/>
                <el-table-column prop="unit" label="计量单位"/>
                <el-table-column prop="storage_location" label="库位"/>
                <el-table-column prop="open_number" label="期初库存"/>
                <el-table-column prop="in_number" label="入库"/>
                <el-table-column prop="out_number" label="出库"/>
                <el-table-column prop="number" label="库存结余"/>
                <el-table-column prop="warn_number" label="预警值"/>
                <el-table-column
                fixed="right"
                label="操作"
                width="240">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="change(scope.$index, tableData)"
                    size="mini">
                    修改
                  </el-button>
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData)"
                    type="danger"
                    size="mini">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
            <!-- 设置layout，表示需要显示的内容，用逗号分隔，布局元素会依次显示
                    prev表示上一页，pager表示页码列表，next为下一页，
                    size用于设置每页显示的页码数量,total表示总条目数，jumper表示跳页元素
                    page-sizes每页显示个数选择器的选项设置,page-size每页显示条目个数
                -->
            <el-pagination
                style="text-align:center"
                :page-sizes="[20,50,100]"
                :page-size="pagesize"
                :total="tableData==null?0:tableData.length"
                center
                background
                layout="prev, pager, next, sizes, total, jumper"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"/>
        </div>

        <el-dialog :title="wu" :visible.sync="dialogFormVisible" :modal-append-to-body="false" @close="quxiao">
          <el-form :model="form">
            <el-form-item label="物料编号" :label-width="formLabelWidth">
              <el-input v-model="form.item_ids" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="物料名称" :label-width="formLabelWidth">
              <el-input v-model="form.item_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="规格型号" :label-width="formLabelWidth">
              <el-input v-model="form.specification" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="计量单位" :label-width="formLabelWidth">
              <el-select filterable default-first-option placeholder="请选择" v-model="value1" value-key="ID">
                <el-option
                  v-for="item in unit"
                  :key="item.ID"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>    
            </el-form-item>
            <el-form-item label="库位" :label-width="formLabelWidth">
              <el-select filterable default-first-option placeholder="请选择" v-model="value2" value-key="ID">
                <el-option
                  v-for="item in strong_locations"
                  :key="item.ID"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>    
            </el-form-item>
            <el-form-item label="期初库存" :label-width="formLabelWidth">
              <el-input v-model="form.open_number" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="预警值" :label-width="formLabelWidth">
              <el-input v-model="form.warn_number" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="quxiao">取 消</el-button>
            <el-button type="primary" @click="queren">确 定</el-button>
          </div>
        </el-dialog>
    </div>
    
  </template>
  
  <script>
    import headbar from "../../components/HeadBar.vue"
    import sidebar from "../../components/SideNavigationBar.vue"

  export default {
    components: {
        headbar,
        sidebar
  },
    data() {
      return {
        searchTableInfo: '', // 搜索框中内容默认为空
        pagesize: 20, // 默认当前页面显示条目数
        currpage: 1, // 默认当前页面
        getSearchInfo: [],
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form: {
          item_ids:'',
          item_name:'',
          specification:'',
          open_number:'',
          warn_number:''
        },
        unit:[],
        strong_locations:[],
        value1:'',
        value2:'',
        wu:'新增物料信息',
        in_number:0,
        out_number:''
      }
    },
    computed: { // 根据计算属性模糊搜索
      tableData() {
        const searchTableInfo = this.searchTableInfo
        if (searchTableInfo) {
          // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
          // 不会对空数组进行检测,不会改变原始数组。
          return this.getSearchInfo.filter(data => {
            // some() 方法用于检测数组中的元素是否满足指定条件;
            // some() 方法会依次执行数组的每个元素：
            // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
            // 如果没有满足条件的元素，则返回false。
            return Object.keys(data).some(key => {
              // return String(data[key]).toLowerCase().indexOf(searchTableInfo) > -1
              return String(data[key]).indexOf(searchTableInfo) > -1
            })
          })
        }
        return this.getSearchInfo
      }
    },
    created() {
      this.info()
    },
    methods: {
      tableRowClassName({row}) {
        if (row.warn_number>row.number) {
          return 'warning-row';
        }
        return '';
      },
      handleCurrentChange(cpage) {
        this.currpage = cpage
      },
      handleSizeChange(psize) {
        this.pagesize = psize
      },
      info() { // 获取信息 
        var that = this
        this.$axios({
          method: 'get',
          url:"/api/config/get",
          headers: { 'Authorization': localStorage.getItem('auth') }
          }).then(res =>{
            this.unit = res.data.config.units
            this.strong_locations = res.data.config.strong_locations
          }).catch(() =>{
        })
        this.$axios({
          method: 'get',
          url:"/api/item/get",
          headers: { 'Authorization': localStorage.getItem('auth') }
        }).then(res =>{
          that.getSearchInfo = res.data.items
        }).catch({
        })
      },
      quxiao(){
        this.dialogFormVisible = false
        this.value1=''
        this.value2=''
        this.form={}
        this.wu='新增物料信息'
      },
      queren(){
        var that=this
        if(this.wu == '修改物料信息')
        {
          var number = this.in_number -this.out_number+''
          this.$axios({
                method: 'put',
                url:"/api/item/update",
                headers: { 'Authorization': localStorage.getItem('auth'),
                'Content-Type': 'application/json;charset=UTF-8' },
                data:{ 
                  item_id:this.form.item_ids,
                  item_name:this.form.item_name,
                  specification:this.form.specification,
                  unit:this.value1.name,
                  storage_location:this.value2.name,
                  open_number:this.form.open_number,
                  warn_number:this.form.warn_number,
                  in_number:this.in_number,
                  out_number:this.out_number,
                  number:number
                }
              }).then(() =>{
                this.info()
                this.dialogFormVisible = false
                this.value1=''
                this.value2=''
                this.form={}
                this.wu='新增物料信息'
                this.$message({
                  type: 'success',
                  message: '修改物料信息成功!'
                  });
                  }).catch(() => {
                    this.$message({
                    message: '修改物料信息失败,请检查网络',
                    type: 'error'
                  }); 
                })
        }
        else{
          var flag = false
        if (this.getSearchInfo != null) {
          for (let index = 0; index < this.getSearchInfo.length; index++) {
            if (this.form.item_ids == this.getSearchInfo[index].item_id) {
              flag = true
              break
            }
          }
        }  
        if(flag){
          this.notifyId = this.$notify({
            message: "物料编号重复，请更换",
            duration: 2000
          })
        }
        else{
            this.$axios({
              method: 'post',
              url:"/api/item/create",
              headers: { 'Authorization': localStorage.getItem('auth') },
              data:{ 
                item_id:that.form.item_ids,
                item_name:that.form.item_name,
                specification:that.form.specification,
                unit:that.value1.name,
                storage_location:that.value2.name,
                open_number:that.form.open_number,
                warn_number:that.form.warn_number,
                in_number:"0",
                out_number:"0",
                number:that.form.open_number
              }
            }).then(() =>{
              this.info()
              that.$message({
                type: 'success',
                message: '新增物料信息成功!'
              });
            }).catch((err) => {
              console.log(err);
              this.$message({
              message: '新增物料信息失败,请检查网络',
              type: 'error'
            }); 
          })
          this.dialogFormVisible = false
          this.value1=''
          this.value2=''
          this.form={}
          this.wu='新增物料信息'
        }
        }   
      },
      change(index, rows) {
        this.wu='修改物料信息'
        this.dialogFormVisible=true;
        this.form.item_ids=rows[index].item_id
        this.form.item_name=rows[index].item_name
        this.form.specification=rows[index].specification
        this.form.open_number=rows[index].open_number
        this.form.warn_number=rows[index].warn_number
        this.value1=rows[index].unit
        this.value2=rows[index].storage_location
        this.in_number=rows[index].in_number
        this.out_number=rows[index].out_number
      },
      deleteRow(index,rows){
        var index1=rows[index].ID
        console.log(index1);
        console.log(typeof index1);
        this.$confirm('是否确认删除该条出库信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
          method: 'delete',
          url:"/api/item/delete",
          headers: { 'Authorization': localStorage.getItem('auth')},
          params:{id:index1}}).then((res) =>{
            console.log(res);
            rows.splice(index, 1);
            this.$message({
                type: 'success',
                message: '删除成功!'
              });
          }).catch((err) =>{
            console.log(err);
            this.$message({
                type: 'error',
                message: '删除失败!'
              });
          })
        }).catch(() =>{
          this.$message({
                message: '已取消删除!'
              });
        })
      },
    }
  }
  </script>
  
  <style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

  