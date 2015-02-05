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
 * GET films.
 */
router.get('/', function(req, res) {
    var db = req.db;
    db.query('SELECT * FROM film', function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'films': rows });
    });
});

/*
 * POST films.
 */
router.post('/', function(req, res) {
    var db = req.db;
    query = 'INSERT INTO film (title,language_id, rental_duration, rental_rate, replacement_cost) VALUES (?,?,?,?,?,?)';
    params = [req.body.title, req.body.language_id, req.body.rental_duration, req.body.rental_rate, req.body.replacement_cost]
    db.query(query, params, function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'success': 1 });
    });
});

/*
 * GET films/id.
 */
router.get('/:id', function(req, res) {
    var db = req.db;
    db.query('SELECT * FROM film WHERE film_id = ?', [req.params.id], function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json(rows[0]);
    });
});

/*
 * PUT film/id.
 */
router.put('/:id', function(req, res) {
    var db = req.db;
    query = 'UPDATE film SET title=?,language_id=?, rental_duration=?, rental_rate=?, replacement_cost=? WHERE film_id = ?';
    params = [req.body.title, req.body.language_id, req.body.rental_duration, req.body.rental_rate, req.body.replacement_cost, req.params.id]
    db.query(query, params, function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'success': 1 });
    });
});

/*
 * DELETE film/id.
 */
router.delete('/:id', function(req, res) {    
    var db = req.db;
    query = 'DELETE FROM film WHERE film_id = ?';
    params = [req.params.id]
    db.query(query, params, function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json({ 'success': 1 });
    });
});

module.exports = router;
