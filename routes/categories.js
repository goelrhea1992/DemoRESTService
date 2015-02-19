var express = require('express');
var router = express.Router();
var tools = require('./tools');

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
    var projectionFields;
    
    if(req.query.projectionFields)
        projectionFields = req.query.projectionFields;
    else
        projectionFields = '*';

    return pagination(req, res, table, url_table,projectionFields);
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
