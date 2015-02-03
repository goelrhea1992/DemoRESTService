var express = require('express');
var router = express.Router();

/*
 * GET actors.
 */
router.get('/', function(req, res) {
    // var db = req.db;
    // db.collection('userlist').find().toArray(function (err, items) {
    //     res.json(items);
    // });
    res.json({ 'Get all actors': 1 });
});

/*
 * POST actors.
 */
router.post('/', function(req, res) {
    // var db = req.db;
    // db.collection('userlist').insert(req.body, function(err, result){
    //     res.send(
    //         (err === null) ? { msg: '' } : { msg: err }
    //     );
    // });
    res.json({ 'Add an actor': 1 });
});

/*
 * GET actor/id.
 */
router.delete('/:id', function(req, res) {
    res.json({ 'Get this actor': 1 });
});

/*
 * PUT actor/id.
 */
router.put('/:id', function(req, res) {
    res.json({ 'Update an actor': 1 });
});

/*
 * DELETE actor/id.
 */
router.delete('/:id', function(req, res) {
    // var db = req.db;
    // var userToDelete = req.params.id;
    // db.collection('userlist').removeById(userToDelete, function(err, result) {
    //     res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    // });
    res.json({ 'Delete this actor': 1 });
});

module.exports = router;
