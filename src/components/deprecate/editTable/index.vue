<template>
	<div>
		<el-table :data="tableData" :height="height" :width="width" border row-key="id" align="left" style="width:100%">

			<el-table-column v-for="(item, index) in dropCol" :key="index" :fixed="item.fixed" :width="item.width" :prop="item.prop"
			 :label="item.label" sortable  @click="chengenum(scope.$index)">
				<template scope="scope"  v-show="editable">
					
					
						<el-input v-model='scope.row.name'></el-input>
					
				<!-- 	<el-input v-model="scope.row.name"></el-input> -->
					
				</template>


			</el-table-column>

		</el-table>
	</div>
</template>

<script>
	import Base from '@/assets/js/base'
	export default {
		name: "EditTable",
		extends: Base,
		props: ['props'],
		data() {
			return {
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
				editable:false
			};
		},
		computed: {
			
		},
		mounted() {
			this.init();
			console.log(this.tableData)
		},
		methods: {
			init:function(){
				this.width = this.props.width;
				this.height = this.props.height;
				this.cutShow = this.props.cutShow;
				this.itemShow = this.props.itemShow;
				this.fixedColumn = this.props.fixedColumn;
				this.dropCol = this.props.dropCol;
				this.tableData = this.props.tableData;
				this.total = this.props.total;
			},
			  chengenum(row){ //我的方法
                console.log(row)
                this.editable = true;
            }
		}
	}
</script>

<style>

</style>
