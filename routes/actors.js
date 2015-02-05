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
 * GET actors.
 */
router.get('/', function(req, res) {
    var db = req.db;
    db.query('SELECT * FROM actor', function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'actors': rows });
    });
});

/*
 * POST actors.
 */
router.post('/', function(req, res) {
    var db = req.db;
    query = 'INSERT INTO actor (first_name,last_name) VALUES (?,?,?)';
    params = [req.body.first_name, req.body.last_name]
    db.query(query, params, function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'success': 1 });
    });
});

/*
 * GET actors/id.
 */
router.get('/:id', function(req, res) {
    var db = req.db;
    db.query('SELECT * FROM actor WHERE actor_id = ?', [req.params.id], function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json(rows[0]);
    });
});

/*
 * PUT actor/id.
 */
router.put('/:id', function(req, res) {
    var db = req.db;
    query = 'UPDATE actor SET first_name=?, last_name=? WHERE actor_id = ?';
    params = [req.body.first_name, req.body.last_name, req.params.id]
    db.query(query, params, function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'success': 1 });
    });
});

/*
 * DELETE actor/id.
 */
router.delete('/:id', function(req, res) {    
    var db = req.db;
    query = 'DELETE FROM actor WHERE actor_id = ?';
    params = [req.params.id]
    db.query(query, params, function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'success': 1 });
    });
});

module.exports = router;
