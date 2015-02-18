var express = require('express');
var router = express.Router();

function throw_err(err, res) {
    res.json({ 'error': {
        message: err.message,
        error: err
    }});
    throw err;
}

/*
 * GET categories.
 */
router.get('/', function(req, res) {
    var table='category';
    var url_table='categories';
    var db = req.db;
    var offset =req.query.offset;
    var limit =req.query.limit;
    if(limit!=null)
        limit =parseInt(limit);
    if(limit ==null || limit >10)
        limit=10;
    if(offset!=null){
        query='SELECT * FROM '+table+' limit ?,?';
        offset = parseInt(offset);
        var prev_num= offset-limit;
        var next_num=offset+limit;
        var prev_url=url_table+'?offset='+prev_num+'&limit='+limit;
        if(prev_num<0)
            prev_url='';
        params=[]
        var last_num =1000;
        query_getLastNum = 'SELECT count(*) as num FROM '+table;
        db.query(query_getLastNum,params, function(err, rows, fields) {
            if (err) throw_err(err, res);
            last_num=rows[0].num;
        //sql.query(
       //     'SELECT count(*) FROM ' + 'category'
     //   ).then(function(query_res) {
   // last_num = query_res[0].p_key;
 // });
    });
        var next_url=url_table+'?offset='+next_num+'&limit='+limit;
        if(next_num > last_num)
           next_url='';
       var self_url = url_table+'?offset='+offset+'&limit='+limit;
        params=  [offset,limit]
        db.query(query,params, function(err, rows, fields) {
           if (err) throw_err(err, res);
          res.json({
            'data': rows,
            'links': [
                {
                    'rel':  'self',
                    'href': self_url
                },
                {
                    'rel':  'prev',
                    'href': prev_url
                },
                {
                    'rel':  'next',
                    'href': next_url
                }
            ]
        });
          res.json({ 'categories': rows });
     });
    }
});

/*
 * POST categories.
 */
router.post('/', function(req, res) {
    var db = req.db;
    query = 'INSERT INTO category (name) VALUES (?)';
    params = [req.body.name]
    db.query(query, params, function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'success': 1 });
    });
});

/*
 * GET categories/id.
 */
router.get('/:id', function(req, res) {
    var db = req.db;
    db.query('SELECT * FROM category WHERE category_id = ?', [req.params.id], function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json(rows[0]);
    });
});

/*
 * PUT categories/id.
 */
router.put('/:id', function(req, res) {
    var db = req.db;
    query = 'UPDATE category SET name=? WHERE category_id = ?';
    params = [req.body.name, req.params.id]
    db.query(query, params, function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'success': 1 });
    });
});

/*
 * DELETE categories/id.
 */
router.delete('/:id', function(req, res) {    
    var db = req.db;
    query = 'DELETE FROM category WHERE category_id = ?';
    params = [req.params.id]
    db.query(query, params, function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'success': 1 });
    });
});

module.exports = router;
