<template>
    <div>
        <headbar></headbar>
        <sidebar  style="position:absolute"></sidebar>
        <div>
          <div style="display:inline-block;margin-left: 280px;">
              <el-input v-model="searchTableInfo" prefix-icon="el-icon-search" placeholder="请输入搜索内容"
                      style="width:240px;display:inline-block;margin-left: -130px;"/>
              <el-button type="primary" @click="dialogFormVisible = true" style="margin-left:720px;display:inline-block">新增出库</el-button>
              <el-table
              :data="tableData==null?tableData:tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
              style="width: 1500px;display:inline-block;margin-left: -130px;"
              max-height="740">
              <el-table-column prop="timestamp" label="日期"/>
              <el-table-column prop="item_id" label="物料编号"/>
              <el-table-column prop="item_name" label="物料名称"/>
              <el-table-column prop="specification" label="规格型号"/>
              <el-table-column prop="unit" label="计量单位"/>
              <el-table-column prop="strong_location" label="库位"/>
              <el-table-column prop="number" label="数量"/>
              <el-table-column prop="person" label="入库申请人"/>
              <el-table-column prop="comment" label="备注"/>
              <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData)"
                    type="danger"
                    size="small">
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
        <el-dialog title="新增出库" :visible.sync="dialogFormVisible" :modal-append-to-body="false" @close="quxiao">
          <el-form :model="form">
            <el-form-item label="日期" :label-width="formLabelWidth">
              <div class="block">
                <el-date-picker
                  v-model="value_time"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="物料编号" :label-width="formLabelWidth">
              <el-select filterable default-first-option placeholder="请选择" v-model="value1" value-key="ID" @change="chan">
                <el-option
                  v-for="item in ids"
                  :key="item.ID"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>    
            </el-form-item>
            <el-form-item label="物料名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="规格型号" :label-width="formLabelWidth">
              <el-input v-model="form.specification" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="计量单位" :label-width="formLabelWidth">
              <el-input v-model="form.unit" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="库位" :label-width="formLabelWidth">
              <el-input v-model="form.strong_location" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="申请人" :label-width="formLabelWidth">
              <el-select filterable default-first-option placeholder="请选择" v-model="value2" value-key="ID">
                <el-option
                  v-for="item in persons"
                  :key="item.ID"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>    
            </el-form-item>
            <el-form-item label="数量" :label-width="formLabelWidth">
              <el-input v-model="form.number" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input v-model="form.comment" autocomplete="off"></el-input>
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
        name:'',
        unit:'',
        specification:'',
        number:'',
        comment:'',
        strong_location:'',
      },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        persons:[],
        ids:[],
        value_time:'',
        value1:'',
        value2:''
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
          url:"/api/outbound/get",
          headers: { 'Authorization': localStorage.getItem('auth') }

        }).then(res =>{
          that.getSearchInfo = res.data.details
          for (let item of that.getSearchInfo) {
            console.log(item);
            item.timestamp = this.timestampToTime(item.timestamp)
          }
        }).catch(() =>{
        })
        this.$axios({
          method: 'get',
          url:"/api/config/get",
          headers: { 'Authorization': localStorage.getItem('auth') }
          }).then(res =>{
            this.ids=res.data.config.item_ids
            this.persons=res.data.config.inbound_persons
          }).catch(() =>{
        })
        
      },
      quxiao(){
        this.value1=''
        this.value2=''
        this.value_time=''
        this.dialogFormVisible = false
        this.form.name=''
        this.form.unit=''
        this.form.specification=''
        this.form.number=''
        this.form.comment=''
        this.form.strong_location=''
      },
      queren(){
        this.$axios({
          url:'/api/outbound/create',
          method: 'post',
          headers: { 'Authorization': localStorage.getItem('auth') },
          data:{
            timestamp: this.value_time+'',
            item_id: this.value1.name,
            item_name:this.form.name,
            specification:this.form.specification,
            unit:this.form.unit,
            strong_location:this.form.strong_location,
            number:this.form.number,
            person:this.value2.name,
            comment:this.form.comment
          }
          
          }).then(()=>{
            this.info()
            this.$message({
              message: '出库成功',
              type: 'success'
            });
          })
          .catch(()=>{
            this.$message({
              message: '出库失败,请检查网络',
              type: 'error'
            });
        })
        this.value1=''
        this.value2=''
        this.dialogFormVisible = false
        this.value_time=''
        this.form.name=''
        this.form.unit=''
        this.form.specification=''
        this.form.number=''
        this.form.comment=''
        this.form.strong_location=''
      },
          // 时间戳转换
      timestampToTime(timestamp) {
        timestamp = parseInt(timestamp)
        var date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M =
          (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-'
        var D = date.getDate() + ' '
        return Y + M + D
      },
      chan(){
        var that=this
        this.$axios({
          method: 'get',
          url:"/api/item/get",
          headers: { 'Authorization': localStorage.getItem('auth') }
        }).then(res =>{
          for (let index = 0; index < res.data.items.length; index++) {
            if(res.data.items[index].item_id == that.value1.name){
              that.form.name = res.data.items[index].item_name
              that.form.specification = res.data.items[index].specification
              that.form.unit = res.data.items[index].unit
              that.form.strong_location = res.data.items[index].storage_location
              break
            }
          }
        }).catch({
        })
      },
      deleteRow(index, rows) {
        var index1
        index1=rows[index].id
      this.$confirm('是否确认删除该条入库信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
          method: 'delete',
          url:"/api/outbound/delete",
          headers: { 'Authorization': localStorage.getItem('auth')},
          params:{id:index1}}).then(() =>{
            rows.splice(index, 1);
            this.$message({
                type: 'success',
                message: '删除成功!'
              });
          }).catch(() =>{
            this.$message({
                type: 'error',
                message: '删除失败!'
              });
            })
          }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      
    }
  }
  </script>
  
  