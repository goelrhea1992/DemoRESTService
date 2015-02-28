var express = require('express');
var url = require('url');
var router = express.Router();
var tools = require('./tools');

row_to_obj = function(row) {
    var actor = {
        id: row.actor_id,
        name: {
            first: row.first_name,
            last: row.last_name
        },
        link: {
            rel: 'self',
            href: '/actors/'+row.actor_id
        }
    }
    return actor;
};

/*
 * GET actors.
 */
router.get('/', function(req, res) {
    var table = 'actor';
    var url_table = 'actors';
    var tql_fields = {
        first: 'first_name',
        last: 'last_name'
    }

    return tools.pagination(req, res, table, url_table, tql_fields);
});

/*
 * POST actors.
 */
router.post('/', function(req, res) {
    var db = req.db;
    query = 'INSERT INTO actor (first_name,last_name) VALUES (?,?)';
    params = [req.body.first_name, req.body.last_name]
    db.query(query, params, function(err, rows, fields) {
        if (err) tools.throw_err(err, res);
        res.json({ 'success': 1 });
    });
});

/*
 * GET actors/id.
 */
router.get('/:id', function(req, res) {
    var db = req.db;
    var projectionFields;

    if(req.query.projectionFields)
        projectionFields = req.query.projectionFields;
    else
        projectionFields = '*';

    db.query('SELECT ' + projectionFields + ' FROM actor WHERE actor_id = ?', [req.params.id], function(err, rows, fields) {
        if (err) throw_err(err, res);
        res.json(row_to_obj(rows[0]));
    });
});

/*
 * PUT actor/id.
 */
router.put('/:id', function(req, res) {
    tools.update(req, res, {
        name: 'actor',
        id: 'actor_id',
        allowed: ['first_name', 'last_name']
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
        if (err) tools.throw_err(err, res);
        res.json({ 'success': 1 });
    });
});

module.exports = router;
