var url = require('url');

module.exports = {
    get_where: function (req, fields) {
        
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
    },
    throw_err: function(err, res) {
        res.json({ 'error': {
          message: err.message,
          error: err
        }});
        throw err;
    }
};
