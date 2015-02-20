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

function row_to_obj(row) {
    var film = {
        film_id: row.film_id,
        title: row.title,
        description: row.description,
        release_year: row.release_year,
        language: {
            data: {
                id: row.language_id
            },
            link: {
                rel: 'languages',
                href: '/languages/'+row.language_id
            }
            },

        original_language_id: row.original_language_id,
        rental_duration: row.rental_duration,
        rental_rate: row.rental_rate,
        length: row.length,
        replacement_cost: row.replacement_cost,
        rating: row.rating,
        special_features: row.special_features,
        last_update: row.last_update

    }
    return film;
}

/*
 * GET films.
 */
router.get('/', function(req, res) {
    var db = req.db;
    var table='film';
    var url_table='films';
    var projectionFields;
    if(req.query.projectionFields)
        projectionFields = req.query.projectionFields;
    else
        projectionFields = '*';

    return tools.pagination(req, res, table, url_table,projectionFields);
});


/*
 * GET films/id.
 */
router.get('/:id', function(req, res) {
    var db = req.db;
    var projectionFields;
    if(req.query.projectionFields)
        projectionFields = req.query.projectionFields;
    else
        projectionFields = '*';

    db.query('SELECT '+projectionFields+' FROM film WHERE film_id = ?', [req.params.id], function(err, rows, fields) {
        if (err) throw_err(err, res);
        //res.json(rows[0]);
        res.json(row_to_obj(rows[0]));

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
