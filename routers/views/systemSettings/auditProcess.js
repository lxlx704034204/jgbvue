const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/data_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/systemSettings/auditProcess/auditProcess_data_get.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			});
			return;
		}
		jdata += data;
		res.send({
			status: true,
			message: jdata
		})
	});
});

router.post('/data_save', (req, res)=> {
	res.send({
		status: true,
		message: '保存成功'
	})
});

router.post('/data_edit_save', (req, res)=> {
	res.send({
		status: true,
		message: '编辑成功'
	})
});

router.post('/data_edit_get', (req, res)=> {
	let jdata = '';
	fs.readFile('api/views/systemSettings/auditProcess/auditProcess_data_edit.json', 'utf-8', (err, data)=> {
		if(err) {
			res.send({
				status: false,
				message: err
			})
		}
		jdata += data;
		res.send({
			status: true,
			message: jdata
		})
	})
});

router.post('/data_edit_save', (req, res)=> {
	res.send({
		status: true,
		message: '编辑成功'
	})
})

router.post('/data_delete', (req, res)=> {
	res.send({
		status: true,
		message: '删除成功'
	})
});

module.exports = router;