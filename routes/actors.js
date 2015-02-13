var express = require('express');
var url = require('url');
var router = express.Router();

function throw_err(err, res) {
    res.json({ 'error': {
        message: err.message,
        error: err
    }});
    throw err;
}

function get_where(req, fields) {
    var url_parts = url.parse(req.url, true)
    var query = url_parts.query;

    var where = {}
    where.array = []
    where.string = ''

    // Is a Template-Based Query Language being invoked?
    if (query.q == 'true') {

        // Cycle through each possible query field
        for (var prop in fields) {
            if (fields.hasOwnProperty(prop)) {
                if (prop in query) {
                    where.string = where.string + " AND " + fields[prop] + "=?";
                    where.array.push(query[prop]);
                }
            }
        }

        // Only create a where clause if anything was actualyl supplied
        if (where.string != '') {
            where.string = " WHERE" + where.string.substring(4, where.string.length);
        }
    }

    return where;
}

function row_to_obj(row) {
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
}

/*
 * GET actors.
 */
router.get('/', function(req, res) {
    var db = req.db;

    tql_fields = {
        first: 'first_name',
        last: 'last_name',
        id: 'actor_id'
    }
    where = get_where(req, tql_fields);

    var projectionFields;
    if(req.query.projectionFields)
        projectionFields = req.query.projectionFields;
    else
        projectionFields = '*';

    db.query('SELECT ' + projectionFields + ' FROM actor'+where.string, where.array, function(err, rows, fields) {
        actors = []
        for(i = 0; i < rows.length; i++) {
            actors.push(row_to_obj(rows[i]));
        }

        if (err) throw_err(err, res);
        res.json({
            'data': actors,
            'links': [
                {
                    'rel':  'self',
                    'href': 'actors'+req.url
                }
            ]
        });
    });
});

/*
 * POST actors.
 */
router.post('/', function(req, res) {
    var db = req.db;
    query = 'INSERT INTO actor (first_name,last_name) VALUES (?,?)';
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
