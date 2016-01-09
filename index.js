var express = require('express'); // Get the module
var http = require('http');
var path = require('path');
var disk = require('diskusage');

var router = express();
var server = http.createServer(router);

router.set('views', __dirname + '/views');
router.set('view engine', 'jade');
router.use(express.static(path.join(__dirname, 'public')));

server.listen(80, function(){
    var addr = server.address();
    console.log("Chat server listening at", addr.address + ":" + addr.port);
});

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(0)+' '+units[u];
}

var jsonData = {
    machine: [],
    human: []
};

router.get('/', function(req, res) {


    disk.check('/', function(err, info) {

        jsonData.machine.push({
            "available" : info.available,
            "free" : info.free,
            "total" : info.total
        });

        jsonData.human.push({
            "available" : humanFileSize(info.available, true),
            "free" : humanFileSize(info.free, true),
            "total" : humanFileSize(info.total, true)
        });


        //res.send(jsonData);

        var used = info.total - info.free;
        var humanUsed = "zbývá " + humanFileSize(info.free, true) + " z " + humanFileSize(info.total, true);


        res.render('index', {
            title: 'Disk Usage',
            used: used,
            free: info.free,
            total: info.total,
            humanUsed: humanUsed
        });


     });
});