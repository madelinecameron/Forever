/**
 * Created by Madeline on 5/10/2015.
 */

var conf = require('../conf.json');

router.get('/', function(req, res, next) {
    res.render('prices', { title: 'Forever', data_price: 0.035 });
});
