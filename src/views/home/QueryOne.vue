<template>
    <div>
        <headbar></headbar>
        <sidebar style="position:absolute"></sidebar>
        <div>
            <div>
                <el-input v-model="searchTableInfo" prefix-icon="el-icon-search" placeholder="请输入搜索内容"
                        style="width:240px;display:inline-block;margin-left: 700px;"/>
            </div>
            <div>
                <el-descriptions style="display:inline-block;margin-left: 550px;" border :column="4">
                    <el-descriptions-item>
                        <template slot="label">
                            期初库存
                        </template>
                        {{all_number}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            入库数量
                        </template>
                        {{all_in}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            出库数量
                        </template>
                        {{all_out}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            结存数量
                        </template>
                        {{all}}
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            <!-- 表格数据及操作 -->
            <div style="display:inline-block;width: 1650px">
                <div style="display:inline-block;width: 700px;margin-left: 140px;">
                    <div style="margin-left: 40px;display:inline-block;">入库明细 Inbound</div>
                    <el-table
                        :data="tableData==null?tableData:tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
                        style="width: 800px;display:inline-block;"
                        max-height="660">
                        <el-table-column prop="timestamp" label="日期"/>
                        <el-table-column prop="item_id" label="物料编号"/>
                        <el-table-column prop="item_name" label="物料名称"/>
                        <el-table-column prop="number" label="入库数量"/>
                    </el-table>
                    <el-pagination
                    :page-sizes="[20,50,100]"
                    :page-size="pagesize"
                    :total="tableData==null?0:tableData.length"
                    center
                    background
                    layout="prev, pager, next, sizes, total, jumper"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"/>
                </div>
                <div style="display:inline-block;width: 700px;margin-left: 100px;vertical-align: top;">
                        <div style="margin-left: 40px;display:inline-block;">出库明细 Outbound</div>
                        <el-table
                            :data="tableData1==null?tableData1:tableData1.slice((currpage - 1) * pagesize, currpage * pagesize)"
                            style="width: 800px;display:inline-block;"
                            max-height="660">
                            <el-table-column prop="timestamp" label="日期"/>
                            <el-table-column prop="item_id" label="物料编号"/>
                            <el-table-column prop="item_name" label="物料名称"/>
                            <el-table-column prop="number" label="出库数量"/>
                        </el-table>
                        <el-pagination
                        :page-sizes="[20,50,100]"
                        :page-size="pagesize1"
                        :total="tableData1==null?0:tableData1.length"
                        center
                        background
                        layout="prev, pager, next, sizes, total, jumper"
                        @current-change="handleCurrentChange1"
                        @size-change="handleSizeChange1"/>
                    </div>
            </div>
            
            
            <!-- 设置layout，表示需要显示的内容，用逗号分隔，布局元素会依次显示
                    prev表示上一页，pager表示页码列表，next为下一页，
                    size用于设置每页显示的页码数量,total表示总条目数，jumper表示跳页元素
                    page-sizes每页显示个数选择器的选项设置,page-size每页显示条目个数
                -->
            
        </div>
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
        getSearchInfo1:[],
        pagesize1: 20, // 默认当前页面显示条目数
        currpage1: 1, // 默认当前页面
        all:0,
        all_number:0,
        all_in:0,
        all_out:0,
        wu_name:[], //记录入库和出库的物料名称
        wu:[], //储存物料信息
      }
    },
    computed: { // 根据计算属性模糊搜索
      tableData() {
        const searchTableInfo = this.searchTableInfo
        if (searchTableInfo && this.getSearchInfo) {
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
      },
      tableData1() {
        const searchTableInfo = this.searchTableInfo
        if (searchTableInfo && this.getSearchInfo1) {
          // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
          // 不会对空数组进行检测,不会改变原始数组。
          return this.getSearchInfo1.filter(data => {
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
        return this.getSearchInfo1
      }
    },
    created() {
      this.info()
    },
    watch: {
      tableData(newvalue){
        if (newvalue) {
          var sum=0
          for (let index = 0; index < newvalue.length; index++) {
            sum = sum+parseInt(newvalue[index].number)
            this.wu_name.push(newvalue[index].item_name)
          }

          this.all_in=sum

        }
      },
      tableData1(newvalue) {
        if (newvalue){
          var out=0
          for (let index = 0; index < newvalue.length; index++) {
            out = out+parseInt(newvalue[index].number)
            this.wu_name.push(newvalue[index].item_name)
          }

          this.all_out=out
          this.all_number=0
          this.all=0

          for(var i=0;i<this.wu_name.length;i++){
              for(var j=i+1;j<this.wu_name.length;j++){
                if(this.wu_name[i] == this.wu_name[j]){
                  this.wu_name.splice(j,1);
                  j--;
                }
              }
            }//wu_name去重
          for (let j = 0; j < this.wu_name.length; j++){
              for (let index = 1; index < this.wu.length; index++) {
                if (this.wu_name[j] ==  this.wu[index].item_name) {
                  this.all_number = this.all_number+parseInt(this.wu[index].open_number)
                }
              }
              this.all=this.all_in+this.all_number-this.all_out
              this.wu_name=[] //重置wu_name
            }
        }
      }
    },
    methods: {
      handleCurrentChange(cpage) {
        this.currpage = cpage
      },
      handleSizeChange(psize) {
        this.pagesize = psize
      }, 
      handleCurrentChange1(cpage) {
        this.currpage1 = cpage
      },
      handleSizeChange1(psize) {
        this.pagesize1 = psize
      },
      info() { // 获取信息
        var that = this
        // 入库
        this.$axios({
          method: 'get',
          url:"/api/inbound/get",
          headers: { 'Authorization': localStorage.getItem('auth') }

        }).then(res =>{
          that.getSearchInfo = res.data.details
          if (res.data.details) {
            for (let index = 0; index < res.data.details.length; index++) {
                that.all_in = that.all_in+parseInt(res.data.details[index].number)
                that.wu_name.push(res.data.details[index].item_name)
              }
          }
        }).catch(() =>{
        })
        // 出库
        this.$axios({
          method: 'get',
          url:"/api/outbound/get",
          headers: { 'Authorization': localStorage.getItem('auth') }

        }).then(res =>{
          that.getSearchInfo1 = res.data.details
          if (res.data.details) {
            for (let index = 0; index < res.data.details.length; index++) {
                that.all_out = that.all_out+parseInt(res.data.details[index].number)
                that.wu_name.push(res.data.details[index].item_name)
              }
          }
        }).catch(() =>{
        })
        // 从物料处计算
        this.$axios({
          method: 'get',
          url:"/api/item/get",
          headers: { 'Authorization': localStorage.getItem('auth') }

        }).then(res =>{
          this.wu=res.data.items
          if(res.data.items)
          {
            for(var i=0;i<this.wu_name.length;i++){
              for(var j=i+1;j<this.wu_name.length;j++){
                if(this.wu_name[i] == this.wu_name[j]){
                  this.wu_name.splice(j,1);
                  j--;
                }
              }
            }//wu_name去重
            for (let j = 0; j < this.wu_name.length; j++){
              for (let index = 1; index < res.data.items.length; index++) {
                if (this.wu_name[j] ==  res.data.items[index].item_name) {
                  that.all_number = that.all_number+parseInt(res.data.items[index].open_number)
                }
              }
              that.all=that.all_in+that.all_number-that.all_out
            }
          }
          else{
            that.all=0
            that.all_in=0
            that.all_number=0
            that.all_out=0
          }
          this.wu_name=[]; //this.wu_name重置 方便下一次计算
        }).catch()
      }
    }
  }
  </script>
  
  