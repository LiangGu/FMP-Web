<template>
	<div>
		<!-- <el-button @click="editRow">编辑行</el-button> -->
		<!-- <el-button @click="saveTable" :disabled="!edited">提交验证...</el-button> -->
		<!--表格-->
		<el-table highlight-current-row :data="showData" :height="height" :width="width" border row-key="id" align="left"
		 @cell-click="singleClick" @selection-change="handleSelectionChange" :default-sort="{prop: 'date', order: 'descending'}"
		 style="width:100%">
			<!--自定义添加多选列-->
			<slot name="footer"></slot>
			<!-- <draggable element="ul" v-model="showData"> -->
			<el-table-column v-for="(item, index) in tableHead" :key="index" :fixed="item.fixed" :width="(columnAuto?colWidth[item.prop]:item.width)"
			 :prop="tableHead[index].prop" :label="item.label" :filters="item.filter" :filter-method="item.filter && filterTag"
			 filter-placement="bottom-end" tabindex="3">
				<template slot-scope="scope">
					<div class="showTable" style="min-height: 20px;" @click="btnClick(scope,item,$event)">
						<span v-html="frosFormat(item.editType.selectOption,scope.row[item.prop],item.editType.multiple)" class='selSpan'
						 v-if="selSpanShow(scope.$index,item.prop,item.editType.label)"></span>
						<span class='hideSpan' v-if="!getVisible(scope.$index,item.prop,item.editType.label)">{{scope.row[item.prop]}}</span>

						<el-form autocomplete="off" v-if="getVisible(scope.$index,item.prop)" :model="scope['row']" :rules="rules" ref="ruleForm2"
						 class="demo-ruleForm" :validate-on-rule-change="false" onsubmit="return false;" @validate="aaa">

							<div v-if="item.editType.label == 'input'">
								<el-form-item :prop="item.prop">
									<el-input ref='inputVal' v-show="getVisible(scope.$index,item.prop)" v-model="scope['row'][item.prop]"
									 placeholder="请输入内容" @keydown.tab.native="toggleCell(scope,item.prop,item)" @focus="validateFocus" @blur="validateBlur"
									 @keydown.enter.native="closeCell(scope.$index,item.prop)" @change="changeData" :type='item.editType["type"]'></el-input>
								</el-form-item>

							</div>
							<div v-if="item.editType.label == 'date'">
								<el-form-item :prop="item.prop">
									<el-date-picker v-show="getVisible(scope.$index,item.prop)" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
									 v-model="scope['row'][item.prop]" type="date" placeholder="选择日期" @keydown.tab.native="toggleCell(scope,item.prop,item)"
									 @keydown.enter.native="closeCell(scope.$index,item.prop)">
									</el-date-picker>
								</el-form-item>
							</div>
							<div v-if="item.editType.label == 'SmartInput'">
						<el-form-item :prop="item.prop">
								<FrosAutoComplete  @keydown.tab.native="toggleCell(scope,item.prop,item)" v-show="getVisible(scope.$index,item.prop,item)"
								 id="service" placeholder="" v-model="scope['row'][item.prop]" @sync="syncService" :props="serviceList[item.editType.config]" ref="inputValue"
								 @rowData='rowData' @keydown.enter.native="closeCell(scope.$index,item.prop)"></FrosAutoComplete>

								</el-form-item>
							</div>
							<div v-if="item.editType.label == 'select'">
								<div v-if='item.editType.multiple'>
									<!--select多选-->
									<el-form-item :prop="item.prop">
										<el-select v-show="getVisible(scope.$index,item.prop)" @keydown.tab.native="toggleCell(scope,item.prop,item)"
										 class="item-choose" multiple v-model="scope['row'][item.prop]" size="small">
											<el-option v-for="(item,index) in item.editType['selectOption']" :key="index" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
								</div>
								<div v-else>
									<!--select单选-->
									<el-form-item :prop="item.prop">
										<el-select v-show="getVisible(scope.$index,item.prop)" @keydown.tab.native="toggleCell(scope,item.prop,item)"
										 class="item-choose" v-model="scope['row'][item.prop]" size="small">
											<el-option v-for="(item,index) in item.editType['selectOption']" :key="index" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
								</div>

							</div>
							<div v-if="item.editType.label == ''">
								<span class='abc' v-show="getVisible(scope.$index,item.prop)">{{scope.row[item.prop]}}</span>
							</div>
						</el-form>

					</div>
					<div v-if="!getVisible(scope.$index,item.prop) && scope.row._error" class='table_form_error'>{{scope.row._error[item.prop]}}</div>
				</template>

			</el-table-column>
			<!-- </draggable> -->
			<!--自定义添加操作列-->
			<slot name="header"></slot>
		</el-table>

		<!--分页-->
		<div class="pagebox">
			<span class="btn_left">
				<i v-show="cutShow" title="剪切列" class="el-icon-menu" style="color:#2B579A;font-size: 16px" @click="show()"></i>
				<i v-show="itemShow" title="分组" class="el-icon-star-on" style="color:#2B579A" @click="showItem()"></i>
				<i v-show="freshShow" title="刷新" class="el-icon-refresh" style="color:#2B579A" @click="refresh"></i>
				<!--<img title="剪切列" src="../../../../../static/image/demo/cut.png"/>-->
			</span>
			<div class="pagelist" v-show="pageShow">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
				 :page-sizes="pageTotal" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<!--弹框 剪切列-->
		<el-dialog title="剪切列" :visible.sync="dialogVisible" width="40%" style="">
			<div v-show="fixedColumn" style="display: inline-block;margin-right: 20px;margin-bottom: 20px">
				固定列数：
				<div style="width:60px" class="el-input">
					<el-input v-model="num" clearable>
					</el-input>
				</div>
				<el-button size="small" type="primary" @click="combinNum">确定</el-button>
			</div>
			<el-transfer :titles="['未显示列', '已显示列']" v-model="value2" :data="data2" filterable @change="handleChange">
			</el-transfer>
		</el-dialog>
		<!--弹框 分组-->
		<el-dialog title="分组" :visible.sync="itemVisible" width="40%" style="">
			<el-transfer :titles="['未分組', '已分組']" v-model="value3" :data="data3" filterable @change="handleChangeitem">
			</el-transfer>
		</el-dialog>
		<span ref="dddd" id="dddd" style='visibility: hidden; position: absolute; top: 0; left: 0; white-space: nowrap;'>{{tempText}}</span>
	</div>
</template>
<script>
	import Base from '@/assets/js/base'
	import FrosAutoComplete from '@/components/fros-autocomplete/frosAutoComplete'
	import Sortable from 'sortablejs'

	/* import draggable from 'vuedraggable' */
	let time = null
	export default {
		components: {
			'FrosAutoComplete': FrosAutoComplete
			/* ,
						 "draggable": draggable */
		},
		props: {
			// 表格
			width: Number,
			height: Number,
			cutShow: Boolean,
			itemShow: Boolean,
			fixedColumn: Boolean,
			dropCol: Array,
			tableData: Array,
			// 分页
			total: Number,
			columnAuto: Boolean,
			serviceList: null,
			pageShow: Boolean,
			freshShow: Boolean,
			rules: null
		},
		data() {
			return {

				selectData: null,
				selvalList: [], // 下拉多选val

				propRowdata: {},
				tempText: "",
				colWidth: null,
				edited: false,
				row: null,
				col: null,
				cellrowIndex: null, // 下拉框行号
				/* dragging: false, */
				//校验规则
				ruleForm2: {
					pass: 'ddd'
				},
				num: 0,
				data2: [],
				value2: [],
				tableHead: [],
				dialogVisible: false,
				// 分组弹框
				itemVisible: false,
				data3: [],
				value3: [],
				// 分页
				currentPage: 1,
				pageTotal: [1, 2, 3, 4],
				pageSize: 1,
				visible: '',
				selectVisible: '',
				//checkbox选中的行数据
				SelectCurrentData: []

			}
		},
		mounted() {
			this.headTable();
			this.updateColWidth();
			// 阻止默认行为 拖拽
			document.body.ondrop = function(event) {
				event.preventDefault()
				event.stopPropagation()
			}

			this.rowDrop()
		},
		computed: {
			showData: function() {
				return this.tableData.map(function(n) {
					n._error = {}
					n._changedata = false
					return n
				});
			}
		},

		methods: {
			// select数据字典
			frosFormat(sel, value, multiple) {
				let frosList = sel
				let val = value
				if (multiple) {
					let lab = ''
					for (let i = 0; i < sel.length; i++) {
						for (let j = 0; j < val.length; j++) {
							if (sel[i].value == val[j]) {
								lab = lab + ' ' + sel[i].label
							}
						}

					}
					return lab
				} else {
					for (let i = 0; i < sel.length; i++) {
						if (sel[i].value == val) {
							return sel[i].label
						}
					}
				}
			},
			//判断select的span显示隐藏
			selSpanShow(index, key, label) {
				//console.log(index,key,label)
				if (this.selectVisible) {
					let _key = this.selectVisible.split('_')[1]
					let _name = this.selectVisible.split('_')[0]
					let _label = this.selectVisible.split('_')[2]

					if (_key == key && index == _name && _label == label) {

						return false
					}

				}
				if (label == "select") {
					return true
				}
			},



			// 行拖拽
			rowDrop() {
				const tbody = document.querySelector('.el-table__body-wrapper tbody')
				const _this = this
				Sortable.create(tbody, {
					onEnd({
						newIndex,
						oldIndex
					}) {
						const currRow = _this.showData.splice(oldIndex, 1)[0]
						_this.showData.splice(newIndex, 0, currRow)
					}
				})
			},
			dataPickerBlur() {
				//日期控件失去焦点事件
				var picker = document.querySelectorAll('.el-picker-panel')
				//document.querySelector('.el-date-picker').style.display="none";
				for (let i = 0; i < picker.length; i++) {
					picker[i].style.display = "none"
				}
			},
			changeData() {
				//console.log(arguments);
				if (this.row) {
					this.row._changedata = true

				}
			},
			aaa(a, b, c) {
				if (this.row) {
					if (!b) this.row._error[a] = c
					else delete this.row._error[a]
				}
			},
			validateFocus() {
				let form = this.$refs['ruleForm2'][0]
				if (form) form.validate(new Function());
			},
			validateBlur() {
				//this.visible = ''
				this.updateColWidth()
			},
			updateColWidth() {
				let that = this
				let _W = {}
				this.showData.forEach(function(n) {
					that.dropCol.forEach(function(nn) {
						let val = _W[nn.prop] || "auto"
						that.tempText = n[nn.prop]
						//that.$nextTick(function() {
						that.$refs.dddd.textContent = n[nn.prop]
						that.$set(_W, nn.prop, Math.max(that.$refs.dddd.offsetWidth + 40, val == "auto" ? 0 : val))
						//})
					});
				})
				//alert(JSON.stringify(_W))
				this.colWidth = _W;
				//	alert(JSON.stringify(this.colWidth))
				/* that.colWidth = {}
				this.showData.forEach(function(n){
					that.dropCol.forEach(function(nn){
						let val = that.colWidth[nn.prop] || "auto"
						that.tempText = n[nn.prop]
						that.$nextTick(function() {
							that.$refs.dddd.textContent = n[nn.prop]
							that.$set(that.colWidth, nn.prop, Math.max(that.$refs.dddd.offsetWidth+40, val=="auto"?0:val))
						})
					});
				}) */


			},
			getValidatorStatus() {
				let wrong = this.showData.some(function(n) {
					return Object.keys(n._error).length > 0;
				})
				if (wrong) {
					window.console.log('--------> 未通过');
					return false
				} else {
					window.console.log('--------> 通过')
				return true
				}
			},
			//编辑行
			editRow() {
				console.log("1234");
			},
			//联想控件接受子组件传递的选中的一行的数据
			rowData(val) {
				console.log(this.col)
				this.$set(this.propRowdata, this.cellrowIndex + this.col, val)
				let columnLinkData = {
					prop:this.col,
					RowData:val
				}
				this.$emit("getRowData", columnLinkData);
			},
			//联想控件接受子组件传递的值
			syncService(data) {
				console.log(data
				)
				//	this.service = data;
			},
			//判断编辑框显示隐藏的函数
			getVisible(index, key, label) {
				// 判断显示隐藏
				// console.log(key + ':' + label)
				if (label == 'select') {
					return true
				}
				if (this.visible) {
					let _key = this.visible.split('_')[1]
					let _name = this.visible.split('_')[0]
					if (_key == key && index == _name || label == 'select') {
						return true
					}
				}
				return false
			},
			//点击单元格可编辑事件
			btnClick(scope, key, event) {


				// this.selvalList
				let index = scope.$index
				let el = event.currentTarget;
				this.edited = true
				this.row = scope.row
				this.col = key.prop
				this.cellrowIndex = scope.$index;
				if (el.querySelector(".selSpan")) {
					el.querySelector(".selSpan").style.display = 'none';
				}
				//
				if (key.editType.linkage) {
					let getLinkData = {
						prop: key.editType.config,
						linkLabel: this.propRowdata[this.cellrowIndex + key.editType.linkage]
					}
					this.$emit("getLinkData", getLinkData);
				}
				//   设置visible
				this.visible = index + '_' + key.prop
				this.selectVisible = index + '_' + key.prop + '_' + key.editType.label

				this.$nextTick(function() {
					//点击当前元素查找input获取焦点
					if (el.querySelector(".smartInput")) {
						let serviceListId = this.serviceList[this.col].id
						el.querySelector("#"+serviceListId).value = scope.row[key.prop];
					}

					if (el.querySelector(".el-input__inner")) {
							//el.querySelector(".el-input__inner").readOnly= false
						el.querySelector(".el-input__inner").focus();

					}
					this.$refs['ruleForm2'][0].validate()
					/* 	this.$refs.inputValue.getInputValue(scope.row[key.prop]) */
					/* 	this.$refs.inputVal[index].$refs.input */
				})
			/* 	this.$refs.inputValue.getInputValue(scope.row[key.prop]) */
			},
			//监听按键tab事件
			toggleCell(scope, key, item) {
				var arr = [];
				let colIndex = 0;
				let rowIndex = scope.$index;
				for (let i in scope.row) {
					console.log(i)
					if (i.indexOf("_") == -1) {
						arr.push(i)
					}
				}
				for (let i = 0; i < arr.length; i++) {
					if (key === arr[i]) {
						colIndex = i + 1;
						if (i + 1 === arr.length) {
							colIndex = 0;
							rowIndex = rowIndex + 1;
						}
					}
				}
				this.visible = rowIndex + '_' + arr[colIndex];

				let selLabel = ''
				for (let i = 0; i < this.tableHead.length; i++) {
					if (arr[colIndex] == this.tableHead[i].prop) {
						selLabel = this.tableHead[i].editType.label
					}
				}
				this.selectVisible = rowIndex + '_' + arr[colIndex] + '_' + selLabel
			},
			//监听按键enter事件
			closeCell(index, key) {
				this.visible = '';
			},
			// 单击事件
			singleClick(row, column, event, cell) {
				this.$emit('singleClick', row)
				clearTimeout(time)
				time = setTimeout(() => {
					//console.log('单击' + column.id)
				}, 300)
			},
			// 双击事件
			doubleClick(row, column, event, cell) {
				clearTimeout(time)

			},
			// 筛选
			filterTag(value, row, column) {
				const property = column['property']
				return row[property] === value || row[property].value === value
			},
			// 全选
			handleSelectionChange(val) {

				this.SelectCurrentData = val
				this.$emit('handleSelectionChange', val)
			},
			// 调用父页面方法（表格刷新）
			refresh: function() {
				this.$emit('reFresh')
			},

			// 弹框初始化
			headTable() {
				for (let i = 0; i < this.dropCol.length; i++) {
					this.data2.push(this.dropCol[i])
					this.value2.push(this.dropCol[i].prop)
				}
				for (let i = 0; i < this.value2.length; i++) {
					for (let j = 0; j < this.dropCol.length; j++) {
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
			show() {
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
			// 剪切列按钮点击事件
			handleChange(value, direction, movedKeys) {
				this.tableHead = []
				for (let i = 0; i < this.value2.length; i++) {
					for (let j = 0; j < this.dropCol.length; j++) {
						if (this.value2[i] == this.dropCol[j].prop) {
							this.tableHead.push(this.dropCol[j])
						}
					}
				}
			},
			// 固定列
			combinNum() {
				for (let i = 0; i < this.tableHead.length; i++) {
					if (this.tableHead[i].fixed != 'right') {
						this.tableHead[i].fixed = false
						if (i < this.num) {
							this.tableHead[i].fixed = true
						}
					}
				}
			},
			// 分組彈框
			showItem() {
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
			handleChangeitem(value, direction, movedKeys) {
				let dropColItem = this.dropCol
				for (let i = 0; i < this.value3.length; i++) {
					for (let j = 0; j < dropColItem.length; j++) {
						if (this.value3[i] == dropColItem[j].prop) {

						}
					}
				}
			},
			// 分页
			handleSizeChange(val) {
				this.$emit("getPagesize", val)
				// console.log(`每页 ${val} 条`)
			},
			handleCurrentChange(val) {
				this.$emit("getCurrentpage", val)
				// console.log(`当前页: ${val}`)
			}
		}
	}
</script>
<style scoped>

	.table_form_error{
		color: #F56C6C;
		font-size: 12px;
		line-height: 1em;
	}
	.hiddenInput>>>.el-input__inner {
		height: 0;
		line-height: 0;
		padding: 0;
		border: indianred;
		display: none;
	}

	.hiddenItem {
		height: 0;
		line-height: 0;
	}

	.hiddenInput>>>.el-input {
		height: 0;
		line-height: 0;
	}

	.hiddenItem>>>.el-form-item__content {
		height: 0;
		line-height: 0;
	}

	.pagebox {
		margin-top: 20px;
		clear: both;
	}

	.pagelist {
		display: inline-block;
		float: right
	}

	.el-checkbox+.el-checkbox {
		margin-left: 0px;
	}

	.btn_left i {
		font-size: 18px;
		margin-right: 10px
	}

	.friendSearchContainer {
		position: static;
	}
</style>
