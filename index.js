const fs = require("fs");
const { Guid } = require("js-guid");
const db_name = "./daj.json";

class daj {}

class Class {
   constructor(name) {
      this.class_data_name = name;
      this.key = Guid.newGuid().StringGuid;
   }
}

function createFileDb(ob) {
   if (!fs.existsSync(db_name)) {
      console.log(`The data file does create`);

      fs.appendFile(db_name, "", (err) => {
         if (err) throw err;

         fs.chmod(db_name, 0o400, (err) => {
            if (err) throw err;
            fs.chmod(db_name, 0o200, (err) => {
               if (err) throw err;
            });
         });
      });

      ob.json(undefined);
   } else {
      getAll(ob);
   }
}

const error = (res, obj, key) => {
   if (typeof res === "function") {
      console.log("getter: firts 'res'(callback) paranme is quired.");
   }

   if (typeof obj === "string") {
      console.log("getter: second 'obj'(string) paranme is quired.");
   }

   if (typeof key === "string") {
      console.log("getter: trees 'key'(string) paranme is quired.");
   }
};

const lock = (rw) => {
   //reid
   if (rw) {
      fs.chmodSync(db_name, 0o400, (err) => {
         if (err) throw err;
      });
   } else {
      //wraid
      fs.chmodSync(db_name, 0o200, (err) => {
         if (err) throw err;
      });
   }
};

const unlock = (rw) => {
   //reid
   if (rw) {
      fs.chmodSync(db_name, 0o4, (err) => {
         if (err) throw err;
      });
   } else {
      //wraid
      fs.chmodSync(db_name, 0o2, (err) => {
         if (err) throw err;
      });
   }
};

function set(res, obj) {
   unlock(false);

   error(res, obj, "  ");

   const ob = {};

   function json(allvalue) {
      let exe = true;

      let objProperty = JSON.parse(
         JSON.stringify(obj).replace(
            `"class_data_name":"${obj.class_data_name}",`,
            " "
         )
      );

      if (allvalue !== undefined) {
         let specifyObj = Reflect.get(allvalue, obj.class_data_name);

         if (specifyObj !== undefined) {
            const isArray = Array.isArray(specifyObj);

            if (isArray) {
               specifyObj.push(objProperty);
            } else {
               const aux = specifyObj;
               specifyObj = [];
               specifyObj.push(aux);
               specifyObj.push(objProperty);
               console.log("n2: " + JSON.stringify(specifyObj));
            }

            exe = Reflect.set(allvalue, obj.class_data_name, specifyObj);
         } else {
            exe = Reflect.set(allvalue, obj.class_data_name, objProperty);
         }
      } else {
         allvalue = {};
         exe = Reflect.set(allvalue, obj.class_data_name, objProperty);
      }

      if (exe) {
         if (allvalue !== undefined) {
            fs.writeFile(db_name, JSON.stringify(allvalue), (err) => {
               value = "success";
               if (err) {
                  console.log(err);
                  value = err;
               }
               res.json(value);
            });
         } else {
            res.json("not data error.");
         }
      } else {
         res.json("not add data error.");
      }
   }

   ob.json = json;

   createFileDb(ob);

   lock(false);
}

function setKey(res, obj, key) {
   unlock(false);

   error(res, obj, key);

   const ob = {};

   function json(allvalue) {
      let exe = true;

      let objProperty = JSON.parse(
         JSON.stringify(obj).replace(
            `"class_data_name":"${obj.class_data_name}",`,
            " "
         )
      );

      if (allvalue !== undefined) {
         let specifyObj = Reflect.get(allvalue, obj.class_data_name);

         if (specifyObj !== undefined) {
            const isArray = Array.isArray(specifyObj);

            if (isArray) {
               specifyObj.push(objProperty);
            } else {
               const aux = specifyObj;
               specifyObj = [];
               specifyObj.push(aux);
               specifyObj.push(objProperty);
               console.log("n2: " + JSON.stringify(specifyObj));
            }

            exe = Reflect.set(allvalue, obj.class_data_name, specifyObj);
         } else {
            exe = Reflect.set(allvalue, obj.class_data_name, objProperty);
         }
      } else {
         allvalue = {};
         exe = Reflect.set(allvalue, obj.class_data_name, objProperty);
      }

      if (exe) {
         if (allvalue !== undefined) {
            fs.writeFile(db_name, JSON.stringify(allvalue), (err) => {
               value = "success";
               if (err) {
                  console.log(err);
                  value = err;
               }
               res.json(value);
            });
         } else {
            res.json("not data error.");
         }
      } else {
         res.json("not add data error.");
      }
   }

   ob.json = json;

   createFileDb(ob);

   lock(false);
}

function getAll(res) {
   unlock(true);

   error(res, new String(" "), new String(" "));

   fs.readFile(db_name, (err, data) => {
      if (err) {
         console.log(err);
      } else {
         res.json(JSON.parse(data));
      }
   });

   lock(true);
}

function get(res, obj) {
   unlock(true);

   error(res, obj, " ");

   fs.readFile(db_name, (err, data) => {
      if (err) {
         console.log(err);
      } else {
         res.json(Reflect.get(JSON.parse(data), obj));
      }
   });

   lock(true);
}

function getKey(res, obj, key) {
   unlock(true);

   error(res, obj, key);

   fs.readFile(db_name, (err, data) => {
      if (err) {
         console.log(err);
      } else {
         const value = Reflect.get(JSON.parse(data), obj);

         if (key !== undefined) {
            for (var arr in value) {
               if (value[arr].key === key) {
                  res.json(value[arr]);
                  break;
               }
            }
         }
      }
   });

   lock(true);
}

daj.Class = Class;
daj.get = get;
daj.getAll = getAll;
daj.getKey = getKey;
daj.set = set;

module.exports = daj;
