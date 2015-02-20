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
    },
    pagination: function (req,res,table,url_table,projectionFields){
        var offset =req.query.offset;
        var limit =req.query.limit;
        if(limit!=null)
            limit =parseInt(limit);
        if(limit ==null || limit >10)
            limit=10;
        if(offset!=null){
            query='SELECT '+ projectionFields+' FROM '+table+' limit ?,?';
            offset = parseInt(offset);
            var prev_num= offset-limit;
            var next_num=offset+limit;
            var prev_url=url_table+'?offset='+prev_num+'&limit='+limit;
            if(prev_num<0)
                prev_url='';
            params=[]
            var last_num =1000;
            query_getLastNum = 'SELECT count(*) as num FROM '+table;
            db.query(query_getLastNum,params, function(err, rows, fields) {
                if (err) throw_err(err, res);
                last_num=rows[0].num;
            //sql.query(
           //     'SELECT count(*) FROM ' + 'category'
         //   ).then(function(query_res) {
       // last_num = query_res[0].p_key;
     // });
        });
            var next_url=url_table+'?offset='+next_num+'&limit='+limit;
            if(next_num > last_num)
               next_url='';
           var self_url = url_table+'?offset='+offset+'&limit='+limit;
            params=  [offset,limit]
            db.query(query,params, function(err, rows, fields) {
               if (err) throw_err(err, res);
           
                res.json({
                'data': rows,
                'links': [
                    {
                        'rel':  'self',
                        'href': self_url
                    },
                    {
                        'rel':  'prev',
                        'href': prev_url
                    },
                    {
                        'rel':  'next',
                        'href': next_url
                    }
                ]
            });
         });
        }
    }
};
