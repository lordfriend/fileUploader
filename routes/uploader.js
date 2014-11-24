/**
 * Upload file using formidable
 */

var uuid = require('node-uuid'),
  path = require('path'),
  fs = require('fs'),
  formidable= require('formidable'),
  express = require('express'),
  router = express.Router(),
  logger = require('tracer').colorConsole({
    level: process.env.NODE_ENV === "production" ? 3 : 0  // Logging level:  'log':0, 'trace':1, 'debug':2, 'info':3, 'warn':4, 'error':5
  });


var domain = 'point.moe';

function FormUploader() {
  if(!(this instanceof FormUploader)) {
    return new FormUploader();
  }
  this.tmpDir = path.resolve(__dirname, '../tmp');
  console.log(this.tmpDir);
  try {
    fs.statSync(this.tmpDir);
  } catch(e) {
    fs.mkdirSync(this.tmpDir);
  }
}

FormUploader.prototype = {
  constructor: FormUploader,

  middleware: function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    console.log(typeof this.tmpDir, this.tmpDir);
    form.uploadDir = this.tmpDir;
    form.keepExtensions = true;
    form.parse(req);
//      form.on('progress', function(bytesRecieved, bytesExpected) {
//        logger.debug('event "progress"', bytesRecieved + ' / ' + bytesExpected);
//      });

    form.on('field', function(name, value) {
      logger.debug('event "field"', name + ': ' + value);
      req.body = req.body || {};
      req.body[name] = value;
    });

    form.on('fileBegin', function(name, file) {
      logger.debug('event "fileBegin"', name + ': ' + file);
    });
    form.on('file', function(name, file) {
      logger.debug('event "file"', name);
      req.file = file;
    });
    form.on('error', function(err) {
      logger.warn(err);
      res.send(err.printStackTrace());
    });
    form.on('abort', function() {
      next();
    });
    form.on('end', function() {
      logger.warn('upload end');
      next();
    })
  },

  uploadHandler: function(req, res) {
    var file = req.file;
    if(file) {
      var fileName = path.basename(file.path);
      res.json({
        url: 'http://' + domain + '/files/'+ fileName
      });
    } else {
      res.json(400, {
        msg: 'no file parsed'
      });
    }

  },

  simpleUploader: function(req, res) {
    var fileName = uuid.v1();
    var filePath = path.join(this.tmpDir, fileName);
    var out = fs.createWriteStream(filePath);

    out.on('finish', function() {
      res.json({
        url: 'http://' + domain + '/files/'+ fileName
      });
    });
    req.pipe(out);
  },
  list: function(req, res) {
    fs.readdir(this.tmpDir, function(err, files) {
      files = files.map(function(filename) {
        return 'http://' + domain + '/file/' + filename;
      });
      res.render('list', {files: files});
    });
  },
  getFile: function(req, res) {
    var filename = req.params.filename;
    logger.log(filename);
    res.sendFile(path.join(this.tmpDir, filename));
  },
  deleteFile: function(req, res) {
    var filename = req.params.filename;
    logger.info(filename + ' deleted!');
    var filePath = path.join(this.tmpDir, filename);
    fs.unlink(filePath, function(err) {
      if(err) {
        res.json(500, {
          msg: 'fail to delete file, due to' + err.message
        });
      } else {
        res.json({
          msg: 'ok'
        });
      }
    })
  }
};

var formUploader = new FormUploader();

router.post('/upload', formUploader.middleware.bind(formUploader), formUploader.uploadHandler.bind(formUploader));
router.put('/simple/upload', formUploader.simpleUploader.bind(formUploader));
router.get('/list', formUploader.list.bind(formUploader));
router.get('/file/:filename', formUploader.getFile.bind(formUploader));
router.delete('/file/:filename', formUploader.deleteFile.bind(formUploader));

module.exports = router;