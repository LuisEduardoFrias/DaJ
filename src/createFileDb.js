"use strict";

const fs = require("fs");
const errors = require("./errors");

const db_name = "./datafile.daj";
//
// createFileDb
//
const createFileDb = (callback, daj) => {
  if (!fs.existsSync(db_name)) {
    console.log(`The data file does create.`);

    fs.appendFile(db_name, "", (err) => {
      if (err) {
        console.error(err);
        callback(errors.notDataAccess, null);
      } else {
        //Todo cifrado
        //Todo bloqueo del archivo db
        /* fs.chmod(db_name, 0o400, (err) => {
            if (err) throw err;
            fs.chmod(db_name, 0o200, (err) => {
               if (err) throw err;
               callback(undefined);
            });
         });*/

        callback(null, null);
      }
    });
  } else {
    daj.getAll(callback);
  }
};
//
//createFileDbAsync
//
const createFileDbAsync = (daj) => {
  if (!fs.existsSync(db_name)) {
    try {
      fs.appendFileSync(db_name, "");
      //Todo bloqueo del archivo db
      /* fs.chmod(db_name, 0o400, (err) => {
            if (err) throw err;
            fs.chmod(db_name, 0o200, (err) => {
               if (err) throw err;
               callback(undefined);
            });
         });*/
      console.log(`The data file does create.`);
      return { error: null, data: null };
    } catch (err) {
      console.error(err);
      throw new TypeError(errors.notDataAccess);
    }
  } else {
    return daj.getAllAsync();
  }
};

module.exports.db_name = db_name;
module.exports.createFileDb = createFileDb;
module.exports.createFileDbAsync = createFileDbAsync;
