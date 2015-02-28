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
 * GET languages.
 */
router.get('/', function(req, res) {
    var table='language';
    var url_table='languages';
    var tql_fields = {
        name: 'name'
    }

    return tools.pagination(req, res, table, url_table, tql_fields);
});


/*
 * GET languages/id.
 */
router.get('/:id', function(req, res) {
    var db = req.db;

    var projectionFields;
    if(req.query.projectionFields)
        projectionFields = req.query.projectionFields;
    else
        projectionFields = '*';

    db.query('SELECT ' + projectionFields + ' FROM language WHERE language_id = ?', [req.params.id], function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json(rows[0]);
    });
});

/*
 * POST languages.
 */
router.post('/', function(req, res) {
    var db = req.db;
    query = 'INSERT INTO language (name) VALUES (?)';
    params = [req.body.name]
    db.query(query, params, function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'success': 1 });
    });
});


/*
 * PUT languages/id.
 */
router.put('/:id', function(req, res) {
    tools.update(req, res, {
        name: 'actor',
        id: 'language_id',
        allowed: ['name']
    });
});

/*
 * DELETE languages/id.
 */
router.delete('/:id', function(req, res) {    
    var db = req.db;
    query = 'DELETE FROM language WHERE language_id = ?';
    params = [req.params.id]
    db.query(query, params, function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'success': 1 });
    });
});

module.exports = router;