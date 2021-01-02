var fs = require('fs');
//var jDataView = require('jdataview');

function filelist(directory) {
    return fs.readdirSync(directory);
}
function trimNullChars(str) {
    return str.replace(/\0/g, '')
}
// function readID3(file) {

//     var text = fs.readFileSync(file, 'utf8');
//     //console.log(text)

//     var reader = new FileReader,
//         dv = new jDataView(text);

//     if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
//         var title = dv.getString(30, dv.tell()),
//             artist = dv.getString(30, dv.tell()),
//             album = dv.getString(30, dv.tell()),
//             year = dv.getString(4, dv.tell());
//     }

//     var metadata = {
//         artist: trimNullChars(artist),
//         album: trimNullChars(album),
//         year: trimNullChars(year),
//         title: trimNullChars(title)
//     }

//     return metadata

// }
function toTXT(filename, data) {

    if (!isStr(data)) {
        data = JSON.stringify(data);
    }

    // SAVE STRING
    fs.appendFile(filename, data + ',\n', function (error) { if (error) { console.log(error) } });
}
// function crawlFiles(path) {
//     var files = filelist(path);

//     var filepaths = [];

//     files.forEach((file) => {
//         var fullname = '' + path + '/' + file + '';
//         filepaths.push(fullname);
//     });

//     filepaths.forEach(fp => {
//         //var obj = readID3(fp);
//         //obj.filepath = fp;
//         //toTXT('./db2.js', obj);
//     });

// }
function crawlFiles(path) {
    var files = filelist(path);
    var filepaths = [];

    var cache = new Set();

    files.forEach((file) => {
        var fullname = '' + path + '/' + file + '';
        filepaths.push(fullname);
    });
    filepaths.forEach(fp => {
        console.log('fp', fp);
        const filecontent = fs.readFileSync(fp, 'utf8');
        //console.log('filecontent', filecontent);

        filecontent.toString().split(/\n/).forEach(item => { console.log('item', item); });
        //var obj = readID3(fp);
        //obj.filepath = fp;

        // var data = JSON.stringify(obj);
        // if (!cache.has(data)) {
        //     cache.add(data);
        //     toTXT('./db2.js', obj);
        // }

    });
}

crawlFiles('./spins');