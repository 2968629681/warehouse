<template>
  <div>
    <headbar></headbar>
    <sidebar style="position:absolute"></sidebar>
    <div>
      <div>
        <div>
          <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="timestamp" style="margin-left: 600px;">
          </el-date-picker>
          <el-button type="primary" @click="sear">点击查询</el-button>
        </div>
      </div>
      <div>
        <el-descriptions style="display:inline-block;margin-left: 600px" border :column="4">
          <el-descriptions-item>
            <template slot="label">
              入库次数
            </template>
            {{all_in}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              总入库数量
            </template>
            {{all_innumber}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              出库次数
            </template>
            {{all_out}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              总出库数量
            </template>
            {{all_outnumber}}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!-- 表格数据及操作 -->
      <div style="display:inline-block;width: 1650px">
        <div style="display:inline-block;width: 700px;margin-left: 140px;">
          <div style="margin-left: 40px;display:inline-block;">入库明细 Inbound</div>
          <el-table :data="tableData==null?tableData:tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
            style="width: 800px;display:inline-block;" max-height="660">
            <el-table-column prop="timestamp" label="日期" />
            <el-table-column prop="item_id" label="物料编号" />
            <el-table-column prop="item_name" label="物料名称" />
            <el-table-column prop="number" label="数量" />
          </el-table>
          <el-pagination :page-sizes="[20,50,100]" :page-size="pagesize" :total="tableData==null?0:tableData.length"
            center background layout="prev, pager, next, sizes, total, jumper" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" />
        </div>
        <div style="display:inline-block;width: 700px;margin-left: 50px;vertical-align: top">
          <div style="margin-left: 40px;display:inline-block;">出库明细 Outbound</div>
          <el-table :data="tableData1==null?tableData1:tableData1.slice((currpage - 1) * pagesize, currpage * pagesize)"
            style="width:800px;display:inline-block;" max-height="660">
            <el-table-column prop="timestamp" label="日期" />
            <el-table-column prop="item_id" label="物料编号" />
            <el-table-column prop="item_name" label="物料名称" />
            <el-table-column prop="number" label="数量" />
          </el-table>
          <el-pagination :page-sizes="[20,50,100]" :page-size="pagesize1" :total="tableData1==null?0:tableData1.length"
            center background layout="prev, pager, next, sizes, total, jumper" @current-change="handleCurrentChange1"
            @size-change="handleSizeChange1" />
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
        value1: '',
        all_outnumber:0,
        all_innumber:0,
        all_in:0,
        all_out:0
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
      },
      tableData1() {
        const searchTableInfo = this.searchTableInfo
        if (searchTableInfo) {
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
      // 时间戳转换
      timestampToTime(timestamp) {
        timestamp = parseInt(timestamp)
        var date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M =
          (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-'
        var D = date.getDate()
        return Y + M + D
      },
      info() { // 获取信息
        var that = this
        this.$axios({
          method: 'get',
          url:"/api/inbound/get",
          headers: { 'Authorization': 'Bearer '+localStorage.getItem('auth') }

        }).then(res =>{
          that.getSearchInfo = res.data.details
          for (let item of that.getSearchInfo) {
            item.timestamp = this.timestampToTime(item.timestamp)
          }
          that.all_in=res.data.details.length
          var put=0
          for (let index = 0; index < that.getSearchInfo.length; index++) {
            put = put + parseInt(that.getSearchInfo[index].number)
          } 
          that.all_innumber=put
        }).catch(() =>{
        })
        // 出库
        this.$axios({
          method: 'get',
          url:"/api/outbound/get",
          headers: { 'Authorization': 'Bearer '+localStorage.getItem('auth') }

          }).then(res =>{
            that.getSearchInfo1 = res.data.details
            for (let item of that.getSearchInfo1) {
              item.timestamp = this.timestampToTime(item.timestamp)
            }
            that.all_out=res.data.details.length
            var out=0
            for (let index = 0; index < that.getSearchInfo1.length; index++) {
              out = out + parseInt(that.getSearchInfo1[index].number)
            }
            that.all_outnumber=out
          }).catch(() =>{
        })
      },
      sear(){
        var st=''
        var ed=''
        st = this.value1[0] +''
        ed = this.value1[1] +''
        var that = this
        this.$axios({
          method: 'post',
          url:"/api/query_by_timestamp",
          headers: { 'Authorization': 'Bearer '+localStorage.getItem('auth') },
          params:{
            start:st,
            end:ed
          }
          }).then(res =>{
            if(res.data.inbound == null){
              that.getSearchInfo = []
              that.all_innumber= 0
              that.all_in=0
            }
            else{
              that.getSearchInfo = res.data.inbound
              that.all_in = that.getSearchInfo.length
              var put=0
              for (let index = 0; index < that.getSearchInfo.length; index++) {
                put = put + parseInt(that.getSearchInfo[index].number)
              }
              for (let item of that.getSearchInfo) {
                item.timestamp = this.timestampToTime(item.timestamp)
              }
              that.all_innumber=put
            }
            if(res.data.outbound == null){
              that.getSearchInfo1=[]
              that.all_out=0
              that.all_outnumber=0
            }
            else{
              that.getSearchInfo1 = res.data.outbound
              that.all_out= that.getSearchInfo1.length
              var out=0
              for (let index = 0; index < that.getSearchInfo1.length; index++) {
                out = out + parseInt(that.getSearchInfo1[index].number)
              }
              for (let item of that.getSearchInfo1) {
                item.timestamp = this.timestampToTime(item.timestamp)
              }
              that.all_outnumber=out
            }
            
          }).catch(() =>{
        })
      }
    }
  }
  </script>
  
  