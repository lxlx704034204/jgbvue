new Vue({
	el: '#app',
	data: {
		tableData: null,
		selectedRows: [],
		markAllow: true
	},
	mounted() {
		axios.get('/messageInSite/data_get_all').then((data)=> {
			let jdata = JSON.parse(data.data.message);
			if(data.data.status) {
				this.tableData = jdata;
			}
		}).catch((err)=> {
			console.log('err', err);
		})
	},
	methods: {
		all() {
			axios.get('/messageInSite/data_get_all').then((data)=> {
				let jdata = JSON.parse(data.data.message);
				if(data.data.status) {
					this.tableData = jdata;
				}
			}).catch((err)=> {
				console.log('err', err);
			})
		},
		read() {
			axios.get('/messageInSite/data_get_read').then((data)=> {
				let jdata = JSON.parse(data.data.message);
				if(data.data.status) {
					this.tableData = jdata;
				}
			}).catch((err)=> {
				console.log('err', err);
			})
		},
		unread() {
			axios.get('/messageInSite/data_get_unread').then((data)=> {
				let jdata = JSON.parse(data.data.message);
				if(data.data.status) {
					this.tableData = jdata;
				}
			}).catch((err)=> {
				console.log('err', err);
			})
		},
		makeItRead() {
			axios.post('/messageInSite//data_red', this.selectedRows).then((data)=> {
				if(data.data.status) {
					this.$message({
						type: 'success',
						message: data.data.message
					})
				}
			}).catch((err)=> {
				console.log('err', err);
			});
		},
		remove() {
			let _self = this;
			this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				beforeClose: function(action, instance, done) {
					done(action);
				}
			}).then((action) => {
				if(action == 'confirm') {
					axios.post('/messageInSite/data_delete', _self.selectedRows).then(function(req) {
						if(req.data.status) {
							//替换selectedRows的数据
							_self.$message({
								type: 'success',
								message: req.data.message
							});
						};
					}).catch(function(err) {
						console.log(err);
					})
				}else if(action == 'cancel'){
					this.$message({
						type: 'info',
						message: '已取消'
					});
				}
			}).catch((err) => {
			   this.$message({
			   		type: 'error',
			   		message: err
			   }) 
			});
		},
		tableRowClassName({row, rowIndex}) {
			if(!row.status) {
				return 'info';
			}
		},
		rowClick(row) {
			var _self = this;
			this.$refs.msTable.toggleRowSelection(row);
			if(_self.selectedRows.indexOf(row) == -1) {
				_self.selectedRows.push(row)
			}else{
				_self.selectedRows.splice(_self.selectedRows.indexOf(row), 1);
			}
		},
		selectAll(selection) {
			let _self = this;
			if(selection.length == 0) {
				_self.selectedRows.splice(0, _self.selectedRows.length);
			}else{
				_self.selectedRows.splice(0, _self.selectedRows.length);
				selection.forEach((item)=> {
					_self.selectedRows.push(item);
				})
			}
		},
		handleSizeChange(size) {
			//page size change
			console.log('size', size);
		},
		handleCurrentChange() {
			//current page change
		}
	},
	filters: {
		statusFilter(val) {
			if(val) {
				return '已读';
			}else{
				return '未读';
			}
		}
	},
	watch: {
		selectedRows(arr) {
			let _self = this;
			if(arr.length == 0) {
				_self.markAllow = true;
				return;
			}
			for(let i =0; i < arr.length; i++) {
				if(arr[i].status) {
					_self.markAllow = true;
					return false;
				}
			}
			_self.markAllow = false;
		}
	}
})