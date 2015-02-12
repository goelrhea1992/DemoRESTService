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
 * GET languages.
 */
router.get('/', function(req, res) {
    var db = req.db;
    db.query('SELECT * FROM language', function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'languages': rows });
    });
});


/*
 * GET languages/id.
 */
router.get('/:id', function(req, res) {
    var db = req.db;
    db.query('SELECT * FROM language WHERE language_id = ?', [req.params.id], function(err, rows, fields) {
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
    var db = req.db;
    query = 'UPDATE language SET name=? WHERE language_id = ?';
    params = [req.body.name, req.params.id]
    db.query(query, params, function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'success': 1 });
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