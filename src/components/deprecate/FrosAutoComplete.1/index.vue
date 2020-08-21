<template>
	<div class="friendSearchContainer">
		<!-- <el-input v-model="input" placeholder="" @click="init" @keydown="search" @blur="blur" :id='id'></el-input> -->
	
		<input  v-popover:popover v-model="input" class="form-control smartInput" placeholder="" @click="init" @keydown="search" @blur="blur"
		 :id='id' />
		 <el-popover
    ref="popover"
		width="300"
    trigger="click"
		v-model="popoverShow">
  
		<div v-show="searching" class="friendSearchList">
			<div class="dataLength">
				<div class="fl">
					找到 <span>{{filtered.length}}</span> 条记录
				</div>
				<ul class="fr fbtn clearfix" id="fbtn">
					<li @click="prevlist()">&lt;&lt;&nbsp;</li>
					<li @click="nextlist()">&gt;&gt;</li>
				</ul>
			</div>
			<el-table :data="yemiandata" @cell-click="clickOne" :cell-class-name="tableRowClassName" :row-style="selectedHighlight">
				<el-table-column v-for="(item, index) in dropCol" v-bind:key="index" :prop="item.prop" :label="item.label">
				</el-table-column>
			</el-table>
		</div>
		<div v-show="searching" class="friendSearchModal"  @click="searching=false;popoverShow=false"></div>
	</el-popover>
	</div>
</template>

<script>
	import Base from '@/assets/js/base'
	import Bus from '@js/bus'
	import utils from '@js/utils'
	export default {
		name: "FrosAutoComplete",
		extends: Base,
		props: ['props'],
		model: {
			prop: "input",
			event: 'sync'
		},
		data() {
			return {
				dropCol: [],
				id: "",
				popoverShow:'',
				//显示检索框
				searching: false,
				timer: null,
				//获取后台的数据
				filtered: {},
				input: '',
				focusIndex: 0,
				invalidData: '',
				getIndex: 0,
				showColumn: {},
				// 页面需要展现的数据
				yemiandata: [],
				// 页面展现条数
				datanum: 10,
				// 开始页数
				startnum: 0,
				// 结束页数
				endnum: 1,
				// 一共多少页
				btnnum: 0
				/* ,
							listnum:[] */
			};
		},
		computed: {
			listLength() {
				return this.filtered.length;
			},
			key() {
				return /(?:.*,)*(.*)$/.exec(this.input)[1];
			}
		},
		mounted() {
			// 支持初始化参数值

			this.input = this.props.value || '';
			this.id = this.props.id || '';
			
		
		},
		methods: {
			// 调整联想搜索面板的大小和位置
			init() {
				this.searching = true;
				this.filtered = this.props.list;
				this.dropCol = this.props.showColumn;
				this.fenye();
				this.showColumn = this.props.showColumn;
				
				/* this.$emit("changeMyData", this.props);
				console.log(this.props) */
			},
			/* 分页函数 */
			fenye() {
				this.yemiandata = this.filtered.slice(this.startnum * this.datanum, this.endnum * this.datanum);

				this.btnnum = Math.ceil(this.filtered.length / this.datanum);

			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				//把每一行的索引放进row
				row.index = rowIndex;
			},
			selectedHighlight({
				row,
				rowIndex
			}) {
				if ((this.getIndex) === rowIndex) {
					return {
						"background-color": "#CAE1FF"
					};
				}
			},
			// 下一页函数
			nextlist() {
				clearTimeout(this.timer);

				if (this.endnum >= this.btnnum) {
					/* alert('最后一页了'); */
					return false;
				}
				this.focusIndex = 0;
				this.endnum++;
				this.startnum++;
				this.yemiandata = this.filtered.slice(this.startnum * this.datanum, this.endnum * this.datanum);
				let el = window.event.currentTarget
				this.scrollViewport();
				this.searching = true;

			},
			// 上一页函数
			prevlist() {
				clearTimeout(this.timer);
				if (this.startnum <= 0) {
					/* alert('第一页了'); */
					return false;
				}
				this.focusIndex = 0;
				this.endnum--;
				this.startnum--;
				this.yemiandata = this.filtered.slice(this.startnum * this.datanum, this.endnum * this.datanum);
				this.scrollViewport();
				this.searching = true;

			},
			// 失去焦点时关闭面板，主要是按下tab键切换时的作用，随之带来的是所有相关的事件都要清除该定时器
			blur() {
				this.timer = setTimeout(() => {
					//this.searching = false;
				}, 200);
			},
			// 在上下键索引后调整视口
			scrollViewport() {
				this.getIndex = this.focusIndex;
				let value = this.yemiandata[this.focusIndex][this.props.inputKey];
				this.input = value;

			},
			// 联想搜索的主体功能函数，这里使用keydown是为了保证持续性的上下键能够保证执行
			search(e) {
				console.log(e)
				let preSearching = this.searching;
				// 非搜索状态进行点击，则呼出面板
				if (!this.searching) {
					this.searching = true;
				}
				e = e || window.event;
				// 通过上下键和回车选择
				if (e.keyCode === 38) {
					this.focusIndex = (this.focusIndex - 1 + this.listLength) % this.listLength;
					this.scrollViewport();

				} else if (e.keyCode === 40) {
					this.focusIndex = (this.focusIndex + 1 + this.listLength) % this.listLength;
					this.scrollViewport();

				} else if (e.keyCode === 37) {

					this.prevlist();


				} else if (e.keyCode === 39) {
					this.nextlist();


				} else if (e.keyCode === 13) {
					//console.log(this.focusIndex < this.listLength);
					if (preSearching && this.focusIndex < this.listLength) {
						this.selectOne();
					} else if (this.props.StrongCheck) {
						//强校验模式清空
						this.input = '';
					}
					this.searching = false;
				} else {
					// 延时搜索，降低卡顿
					clearTimeout(this.timer);
					this.timer = setTimeout(() => {

						//请求后台接口进行可选项过滤
						//console.log();
						//console.log(this.props.fuzzyQuery);
					/* 	let queryFields = [];
						for (let i = 0; i < this.props.fuzzyQuery.length; i++) {
								queryFields.push({
									"fieldName": this.props.fuzzyQuery[i],
									"fieldType": "String",
									"operator": "EQ",
									"junction": "and"
								})
						}
						console.log(queryFields)
						let data = {
									"queryType": "T_1720",
									"keyword": this.input,
									"pagingInfo": {
										"pageSize": "500",
										"currentPage": "1"
									},
									"queryFields": queryFields
								}
						utils.sendReq({
							queryUrl: 'frosapis/mdmSearch/query',
							req: {
								method: 'post',
								data: data,
								success: res => {
									console.log(res)
									this.filtered = res.data.data.dataList;
									this.fenye();
									this.focusIndex = 0;
									console.log(res)
								}
							}
						}) */


						// 前台进行可选项过滤
						this.filtered = this.props.list.filter(item => {
							console.log(this.props.fuzzyQuery);
							let key = this.props.fuzzyQuery
							let aaa = '';
							for (var i = 0; i < key.length; i++) {

								if (aaa == '') {
									aaa = item[key[i]['fieldName']].toLowerCase().includes(this.key.toLowerCase());
								} else {
									aaa = aaa || item[key[i]['fieldName']].toLowerCase().includes(this.key.toLowerCase());
								}
							}
						return aaa;
							
						// return (item[key[0]].toLowerCase().includes(this.key.toLowerCase())||item[key[1]].toLowerCase().includes(this.key.toLowerCase()));
					});
				
							this.fenye();
							this.focusIndex = 0;
					}, 800);

				}
			},
			clickOne(row) {

				this.getIndex = row.index
				clearTimeout(this.timer);
				//根据用户设置input框显示字段
				let value = row[this.props.inputKey];
				this.input = value;
				let val = row[this.props.chuanKey]
				this.$emit('val', val);
				this.focusIndex = row.index;

				this.search();
				this.searching = false;
				this.popoverShow = false;
			},
			// 选择一个参数
			selectOne() {
				clearTimeout(this.timer);
				// let target = $(this.$el).find('ul li').eq(this.focusIndex);

				let value = this.yemiandata[this.focusIndex][this.props.inputKey];
				this.input = value;
				let val = this.yemiandata[this.focusIndex][this.props.chuanKey];
				this.$emit('val', val);
				this.searching = false;
			}
		},
		watch: {
			input(val) {
				//console.log(this.input);

				// 触发标签内声明的sync函数，用于传递数据给父组件
				this.$emit('sync', this.input);
			}
		}
	}
</script>

<style>
	.el-popover{
  max-height: 320px; /* (高度自行选择) */
  /* overflow: auto; */
	padding: 0;
}
	.fl {
		float: left;
	}

	.fr {
		float: right;
	}

	.fbtn li {
		float: left;
	}

	.smartInput {
		padding: 10px;
		height: 30px;
		line-height: 30px;
		border-radius: 4px;
		border: 1px solid #DCDFE6;
		width: 100%;
	}

	.friendSearchContainer {
		position: relative;
	}

	.friendSearchList {
		width: 300px;
		max-height: 315px;
		background: #fff;
		z-index: 10;
		box-shadow: 0 10px 10px rgba(0, 0, 0, .2);
		border: 1px solid #ccc;
		position: absolute;
	}

	.dataLength {
		color: #000;
	}

	.friendSearchList tr {
		padding: 3px 12px;
	}

	.friendSearchList table.gridtable tbody tr:hover {
		background-color: #36bc7f;
		color: #fff;
	}

	.friendSearchList table.gridtable tbody tr.active {
		background: #337ab7;
		color: #fff;
	}

	.friendSearchList table.gridtable tbody tr.hover {
		background-color: #36bc7f;
		color: #fff;
	}

	.friendSearchList table.gridtable tbody tr.active:hover {
		background-color: #36bc7f;
	}

	.friendSearchModal {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 1;
	}

	.el-table th,
	.el-table td {
		padding: 2px 0;
	}
</style>
