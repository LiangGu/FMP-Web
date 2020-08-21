<template>
    <div>
        <!--表格-->
        <el-table :data="clonetableData"
                  :height="height"
                  :width="width"
                  border
                  row-key="id"
                  sortable
                  align="left"
                  @cell-click="cellClick"
                  @cell-dblclick="cellDbclick"
                  @row-click="rowClick"
                  @row-dblclick="rowDbclick"
                  @selection-change="handleSelectionChange"
                  highlight-current-row
                  id="multipleTable"
                  ref="multipleTable"
                  style="width:100%">
            <!--自定义添加多选列-->
            <slot name="footer"></slot>
            <el-table-column v-for="(item, index) in tableHead"
                             :prop="item.prop"
                             :key="index"
                             :sortable="item.sortable"
                             :fixed="item.fixed"
                             :width="item.width"
                             :formatter="statusFormatter"
                             :label="item.label">
                <template slot="header" slot-scope="{ column }">
                    <span>{{ column.label }}</span>
                    <el-popover
                            placement="bottom-start"
                            width="400"
                            trigger="manual"
                            :ref="item.prop">
                        <!--search-data是筛选出来的过滤条件，search-data是过滤条件对应的key-->
                        <FrosSortHeader :search-data="item.filterData" :prop-data="item.prop"
                                        v-on:childByValue="submitData"
                                        v-on:pClose="pClose">
                        </FrosSortHeader>
                        <i slot="reference" @click="popover($event,item.prop)" v-show="item.filterShow" class="iconfont fros-icon-shaixuanguolv"></i>
                    </el-popover>
                </template>
            </el-table-column>
            <!--自定义添加操作列-->
            <slot name="header"></slot>
        </el-table>
        <!--分页-->
        <div class="pagebox">
            <span class="btn_left">
                <i v-show="cutShow" title="剪切列" class="el-icon-menu"
                   style="color:#2B579A;font-size: 16px"
                   @click="show()"></i>
                <i v-show="itemShow" title="分组" class="el-icon-star-on" style="color:#2B579A" @click="showItem()"></i>
                <i v-show="freshShow" title="刷新" class="el-icon-refresh" style="color:#2B579A" @click="refresh"></i>
            </span>
            <div class="pagelist" v-show="pageShow">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :layout="layout"
                        :small="smallSize"
                        :background="background"
                        :disabled="disabled"
                        :hide-on-single-page="hideSingle"
                        :popper-class="popperClass"
                        :prev-text="prevText"
                        :next-text="nextText"
                        :current-page="currentPage"
                        :page-sizes="pageSizes"
                        :page-size="pageSize"
                        :total="total"
                >
                </el-pagination>
            </div>
        </div>
        <!--弹框 剪切列-->
        <el-dialog title="剪切列" :visible.sync="dialogVisible" width="550px">
            <div v-show="fixedColumn" style="display: inline-block;margin-right: 20px;margin-bottom: 20px">
                固定列数：
                <div style="width:60px" class="el-input">
                    <el-input v-model="num" clearable></el-input>
                </div>
                <!-- <el-button size="small" type="primary"@click="combinNum">确定</el-button>-->
            </div>
            <div id="fros_transfer">
                <el-transfer
                        :titles="['未显示列', '已显示列']"
                        v-model="value2"
                        :data="data2"
                        filterable
                        target-order="push"
                        @right-check-change="rightChange">
                    <ul id="frosTransfer" class="transfer-footer"
                        slot="right-footer" style="position: static;height:20px">
                        <li @click="stickTop"><i class="el-icon-upload2"></i></li>
                        <li @click="stickBottom"><i class="el-icon-download"></i></li>
                        <li @click="upLevel"><i class="el-icon-caret-top"></i></li>
                        <li @click="downLevel"><i class="el-icon-caret-bottom"></i></li>
                    </ul>
                </el-transfer>
                <!-- <div><el-button @click="transferSumit"type="primary" size="mini">确定</el-button></div>-->
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogVisible =false">取 消</el-button>
                <el-button size="mini" type="primary" @click="transferSumit" >确 定</el-button>
            </span>
        </el-dialog>
        <!--弹框 分组-->
        <el-dialog
                title="分组"
                :visible.sync="itemVisible"
                width="40%" style="">
            <el-transfer
                    :titles="['未分組', '已分組']"
                    v-model="value3"
                    :data="data3"
                    filterable
                    @change="handleChangeitem">
            </el-transfer>
        </el-dialog>
    </div>
</template>
<script>
    import FrosSortHeader from '@/components/fros-table/FrosSortHeader'
    import Sortable from 'sortablejs'
    let time = null
    export default {
        components: {
            FrosSortHeader
        },
        name:'pgconfig',
        props: {
            // 表格
            width: Number,
            height: Number,
            cutShow: Boolean,
            itemShow: Boolean,
            fixedColumn: Boolean,
            freshShow: Boolean,
            pageShow: Boolean,
            dropCol: Array,
            tableData: Array,
            // 分页
            pgconfig: null
        },

        watch: {
            tableData (val, oldVal) {
                if (val !== oldVal) {
                    this.clonetableData = val
                    this.elasticList()
                }
            },
            dropCol (val, oldVal) {
                if (val !== oldVal) {
                    this.tableHead = val
                }
            }
        },
        data () {
            return {
                time: null, // 单双击事件
                clonetableData: [],
                // 剪切列弹框
                num: '',
                data2: [],
                value2: [],
                tableHead: [],
                dialogVisible: false,
                sortData: [], // 剪切排序
                // 分组弹框
                itemVisible: false,
                data3: [],
                value3: [],
                // 分页
                // total:0,
                // currentPage: 1,
                // pageSize: 1,
                layout:'',
                smallSize:true,
                background:true,
                disabled:false,
                hideSingle:true,
                popperClass:'',
                prevText:'',
                nextText:'',
                total: 0,
                pageSizes: [],
                // pagerCount: '',
                currentPage: 0,
                pageSize: 0,
                searchInfo: {}, // 表头搜索提交数据
            }
        },
        mounted () {
            this.init()
            this.headTable()
            this.initData()
            this.elasticList()
            //阻止拖拽默认行为
            document.body.ondrop = function (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            // this.rowDrop()

            // 拖动更改复选框状态
            var ckbSelf = this
            document.getElementById("multipleTable").querySelector('.el-table__body-wrapper tbody').onmousedown = function(ev){
                var ev = ev || event
                const oTable = document.getElementById("multipleTable")
                const asideWidth = document.getElementsByTagName("aside")[0].offsetWidth
                const tHeadHeight = oTable.querySelector('.el-table__header-wrapper thead').rows[0].offsetHeight
                const headerHeight = document.getElementsByTagName("header")[0].offsetHeight
                const checkboxWidth = oTable.querySelector('.el-table__body-wrapper tbody').rows[0].cells[0].offsetWidth
                let disX = ev.clientX - oTable.offsetLeft- asideWidth;
                let disY = ev.clientY - oTable.offsetTop - headerHeight - tHeadHeight;
                if(disX <= checkboxWidth){
                    localStorage.setItem("startY", disY);
                }
                document.onmouseup = function(ev){
                    disX = ev.clientX - oTable.offsetLeft- asideWidth;
                    disY = ev.clientY - oTable.offsetTop - headerHeight - tHeadHeight;
                    if(disX <= checkboxWidth){
                        const scrollT = oTable.querySelector('.el-table__body-wrapper').scrollTop
                        const rowLength = oTable.querySelector('.el-table__body-wrapper tbody').rows
                        let rowsHeight = 0
                        let start = 0
                        let end = 0
                        let boolStart = true
                        let boolEnd = true
                        for(let i=0; i<rowLength.length; i++){
                            rowsHeight += rowLength[i].offsetHeight
                            if((rowsHeight - scrollT) > localStorage.getItem("startY")  && boolStart === true) {
                                start = i
                                boolStart = false
                            }
                            if((rowsHeight - scrollT) > disY && boolEnd === true) {
                                end = i
                                let rows = []
                                if(start !== end){
                                    for(let i=start;i<end+1;i++){
                                        rows.push(ckbSelf.clonetableData[i])
                                    }
                                    ckbSelf.toggleSelection(rows)
                                }
                                boolEnd = false
                            }
                        }
                    }
                }
            }
        },
        methods: {
            init(){
                this.layout=this.pgconfig.layout
                this.total=this.pgconfig.total
                this.smallSize=this.pgconfig.smallSize
                this.background=this.pgconfig.background
                this.disabled=this.pgconfig.disabled
                this.hideSingle=this.pgconfig.hideSingle
                this.popperClass=this.pgconfig.popperClass
                this.prevText=this.pgconfig.prevText
                this.nextText=this.pgconfig.nextText
                this.pageSizes=this.pgconfig.pageSizes
                this.currentPage=this.pgconfig.currentPage
                this.pageSize=this.pgconfig.pageTotal
            },
            // 手动触发popover弹框
            popover(ev,prop) {
                for(let i=0; i<this.tableHead.length; i++){
                    if(this.tableHead[i].filterShow === true){
                        if (this.tableHead[i].prop != prop) {
                            this.$refs[this.tableHead[i].prop][0].doClose()
                        }
                    }
                }
                this.$refs[prop][0].doToggle()
                ev.stopPropagation()
            },
            // 关闭表头筛选框
            pClose(prop) {
                this.$refs[prop][0].doClose()
            },
            // 拖拽时复选框选中与取消选中
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                }
            },
            // 表头数据筛选
            doFilter(array, filters) {
                const filterKeys = Object.keys(filters)
                return array.filter((item) => {
                    return filterKeys.every(key => {
                        if(!filters[key].length) return true
                        return !!~filters[key].indexOf(item[key])
                    })
                })
            },
            // 过滤筛选列表数据
            unique(_this, arr, strArr) {
                strArr.map(function(str){ // 筛选对象名称
                    let getArr = []
                    let dataArr = []
                    _this[arr[0]][str] = []
                    _this[arr[1]].map(function (item) { // 从arr对象中筛选对象
                        dataArr.push(item[str])
                    })
                    dataArr = Array.from(new Set(dataArr)) // 去重
                    dataArr.map(function (item, index) {
                        getArr.push({'name':item,'value':index})
                    })
                    _this[str] = getArr
                })
            },
            // 获取表头搜索数据和列表数据
            elasticList: function () {
                let self = this
                let arr = []
                for(let i=0; i<self.tableHead.length; i++){
                    arr.push(self.tableHead[i].prop)
                }
                // 用于筛选列表，1、对象，2、[搜索条件，搜索原始列表]，3、[每个搜索条件](与数据库对应属性名称一致)
                self.unique(self, ['searchInfo', 'tableData'],
                    arr)
                for(let i=0; i<arr.length; i++){
                    self.tableHead[i]['filterData'] = this[arr[i]]
                }
            },
            // 提交表头筛选数据
            submitData (data) {
                let self = this
                if (data !== null) {
                    let name = Object.keys(data)
                    self.searchInfo[name] = data[name]
                    self.clonetableData = self.doFilter(self.tableData, self.searchInfo)
                }
            },
            // 改变状态
            statusFormatter(row, column){
                let tableHead = this.tableHead
                for(let i=0; i<tableHead.length; i++){
                    let item = tableHead[i]
                    if(column.property == item.prop){
                        if(item.formatterType == undefined){
                            return row[column.property]
                        }else{
                            let list = item.formatterType
                            for(let j=0; j<list.length; j++){
                                if(row[column.property] == list[j].value){
                                    return list[j].key
                                }
                            }
                        }
                    }
                }
            },
            //行拖拽
            rowDrop() {
                const tbody = document.querySelector('.el-table__body-wrapper tbody')
                const _this = this
                Sortable.create(tbody, {
                    onEnd({ newIndex, oldIndex }) {
                        const currRow = _this.tableData.splice(oldIndex, 1)[0]
                        _this.tableData.splice(newIndex, 0, currRow)
                    }
                })
            },
            // 数据初始化
            initData () {
                localStorage.setItem("orData",JSON.stringify(this.tableData))
                this.clonedropCol = this.dropCol
                this.clonetableData = this.tableData
            },
            // 单击事件
            singleClick (row, column, event, cell) {
                clearTimeout (time)
                time = setTimeout(() => {
                    console.log('单击' + column.id)
                }, 100)
            },
            // 双击事件
            doubleClick (row, column, event, cell) {
                clearTimeout (time)
                console.log('双击' + column.id)
            },
            // 筛选
            filterTag (value, row, column) {
                const property = column['property']
                return row[property] === value || row[property].value === value
            },
            // 全选
            handleSelectionChange (val) {
                console.log(val)
                this.$emit('handleSelectionChange', val)
            },
            // 调用父页面方法（表格刷新）
            refresh: function () {
                this.$emit('reFresh')
            },
            // 调用父页面方法（cell-单击）
            cellClick: function (row, column, cell, event) {
                this.$emit('cellClick',row, column, cell, event)
            },
            // 调用父页面方法（cell-双击）
            cellDbclick: function (row, column, cell, event) {
                this.$emit('cellDbclick',row, column, cell, event)
            },
            // 调用父页面方法（row-单击）
            rowClick: function (row, event, column) {
                this.$emit('rowClick',row, event, column)
            },
            // 调用父页面方法（row-双击）
            rowDbclick: function (row, event, column) {
                this.$emit('rowDbclick',row, event, column)
            },


            // 弹框初始化
            headTable () {
                for (let i = 0; i < this.dropCol.length; i++) {
                    this.data2.push(this.dropCol[i])
                    this.value2.push(this.dropCol[i].prop)
                }
                for (let i = 0; i < this.value2.length; i++) {
                    for (let j = 0; j < this.dropCol.length; j++)
                    {
                        if (this.value2[i] === this.dropCol[j].prop) {
                            this.tableHead.push(this.dropCol[j])
                        }
                    }
                }
                // 初始化num值
                let numItem = []
                for (let i = 0; i < this.dropCol.length; i++) {
                    if (this.dropCol[i].fixed === true) {
                        numItem.push(this.dropCol[i].fixed)
                    }
                }
                this.num = numItem.length
            },
            // 显示剪切列弹框
            show () {
                this.dialogVisible = true
                let cities = this.dropCol
                this.data2 = []
                cities.forEach((city) => {
                    this.data2.push({
                        label: city.label,
                        prop: city.prop,
                        filter: city.filter,
                        key: city.prop
                    })
                })
            },
            // 获取排序的选项
            rightChange(key) {
                this.sortData=key
            },
            // 排序置顶
            stickTop() {
                // 改变剪切列顺序
                if(this.sortData.length == 1){
                    for(let i=0; i<this.value2.length; i++){
                        for(let j=0; j<this.sortData.length; j++){
                            if(this.value2[i] == this.sortData[j]){
                                let item = this.value2[i]
                                this.value2.splice(i,1)
                                this.value2.unshift(item)
                            }
                        }
                    }
                }else if(this.sortData.length==0){
                    this.$message.error('请选择一条数据')
                }else{
                    this.$message.error('只能选择一条数据去排序')
                }

                // 改变表头数据
                // this.sortThead()
            },
            // 排序置底
            stickBottom() {
                // 改变剪切列顺序
                if(this.sortData.length == 1){
                    for(let i=0; i<this.value2.length; i++){
                        for(let j=0; j<this.sortData.length; j++){
                            if(this.value2[i] == this.sortData[j]){
                                let item = this.value2[i]
                                this.value2.splice(i,1)
                                this.value2.push(item)
                            }
                        }
                    }
                }else if(this.sortData.length==0){
                    this.$message.error('请选择一条数据')
                }else{
                    this.$message.error('只能选择一条数据去排序')
                }
            },
            // 上一级
            upLevel() {
                // 改变剪切列顺序
                if(this.sortData.length == 1){
                    for(let i=0; i<this.value2.length; i++){
                        for(let j=0; j<this.sortData.length; j++){
                            if(this.value2[i] == this.sortData[j]){
                                let item = this.value2[i]
                                this.value2.splice(i,1)
                                if(i-1 <= 0){
                                    this.value2.splice(0,0,item)
                                }else{
                                    this.value2.splice(i-1,0,item)
                                }
                            }
                        }
                    }
                }else if(this.sortData.length==0){
                    this.$message.error('请选择一条数据')
                }else{
                    this.$message.error('只能选择一条数据去排序')
                }
            },
            // 下一级
            downLevel() {
                // 改变剪切列顺序
                if(this.sortData.length == 1){
                    let tempList = JSON.parse(JSON.stringify(this.value2))
                    for(let i=0; i<this.value2.length; i++){
                        let val = this.value2[i]
                        for(let j=0; j<this.sortData.length; j++){
                            let sor = this.sortData[j]
                            if(val == sor){
                                let item = tempList[i]
                                tempList.splice(i,1)
                                if(Number(i)+1 >= Number(tempList.length)){
                                    tempList.splice(Number(tempList.length),0,item)
                                }else{
                                    tempList.splice(Number(i)+1,0,item)
                                }
                            }
                        }
                    }
                    this.value2 = tempList // 数据置换
                }else if(this.sortData.length==0){
                    this.$message.error('请选择一条数据')
                }else{
                    this.$message.error('只能选择一条数据去排序')
                }
            },
            // 表头排序
            sortThead() {
                this.tableHead = []
                for (let i = 0; i < this.value2.length; i++) {
                    for (let j = 0; j < this.dropCol.length; j++)
                    {
                        if (this.value2[i] === this.dropCol[j].prop) {
                            this.tableHead.push(this.dropCol[j])
                        }
                    }
                }
            },
            // 固定列
            combinNum () {
                for (let i = 0; i < this.tableHead.length; i++) {
                    if (this.tableHead[i].fixed != 'right') {
                        this.tableHead[i].fixed = false
                        if (i < this.num) {
                            this.tableHead[i].fixed = true
                        }
                    }
                }
            },
            // 剪切确定按钮
            transferSumit() {
                // 修改列排序
                this.sortThead()
                // 固定列
                this.combinNum()
                this.dialogVisible = false
            },
            // 分組彈框
            showItem () {
                this.itemVisible = true
                let items = this.tableHead
                this.data3 = []
                items.forEach((item, index) => {
                    this.data3.push({
                        label: item.label,
                        // prop: item.prop,
                        // filter:item.filter,
                        key: item.prop
                    })
                })
            },
            // 分组按钮点击
            handleChangeitem (value, direction, movedKeys) {
                let dropColItem = this.dropCol
                for (let i = 0; i < this.value3.length; i++) {
                    for (let j = 0 ;j < dropColItem.length; j++) {
                        if (this.value3[i] == dropColItem[j].prop)
                        {

                        }
                    }
                }
                // console.log(value, direction, movedKeys);
            },
            // 分页
            handleSizeChange (val) {
                this.$emit("getPagesize", val)
                // console.log(`每页 ${val} 条`)
            },
            handleCurrentChange (val) {
                this.$emit("getCurrentpage",val)
                // console.log(`当前页: ${val}`)
            }
        }
    }
</script>
<style>
    #fros_transfer .el-transfer-panel{padding-bottom: 40px;}
    #frosTransfer li{display: inline-block;padding: 8px
    5px;margin: 0 3px}
    .pagebox{
        margin-top: 20px;
        clear: both;
    }
    .pagelist{
        display: inline-block;
        float:right
    }

    .btn_left i{
        font-size: 18px;
        margin-right: 10px
    }
</style>
