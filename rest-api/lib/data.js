/**
 * Library to store and edit data
 */

const fs = require('fs');
const path = require('path');

const create = (dir, file, data, callback) => {
  fs.open(resolvePath(dir, file), 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      fs.writeFile(fileDescriptor, stringData, err => {
        if (err) return callback(err);

        fs.close(fileDescriptor, err => {
          if (err) return callback(err);
          callback(false);
        })
      });
    } else {
      callback(err)
    }
  });
};

const read = (dir, file, callback) => {
  fs.readFile(resolvePath(dir, file), 'utf8', (err, data) => {
    if (err) return callback(err);
    callback(undefined, JSON.parse(data));
  });
};

const update = (dir, file, data, callback) => {
  fs.open(resolvePath(dir, file), 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      // fs.truncate(fileDescriptor, err => {
        // if (err) return callback(err);

        // In the tutorial, `fs.truncate` was called before writing to the file with `fs.writeFile`.
        // I however noticed that `fs.truncate` is not needed. The default flag for `fs.writeFile` is `w`
        // and what it does is creates the file (if it does not exist) or truncates it (if it exists).
        // Check https://nodejs.org/api/fs.html#fs_file_system_flags for more information
        fs.writeFile(fileDescriptor, stringData, err => {
          if (err) return callback(err);

          fs.close(fileDescriptor, err => {
            if (err) return callback(err);
            callback();
          })
        });
      // })
    } else {
      callback(err)
    }
  });
};

const deleteFile = (dir, file, callback) => {
  fs.unlink(resolvePath(dir, file), err => {
    if (err) return callback(err);
    callback();
  });
}

const resolvePath = (dir, file) => `${path.join(__dirname, '../.data')}/${dir}/${file}.json`;

module.exports = { create, read, update, deleteFile };
