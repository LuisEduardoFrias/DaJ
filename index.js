const fs = require("fs");
const { Guid } = require("js-guid");
const db_name = "./daj.json";

//Data Archive Json
class daj {
   constructor() {
      this.key = Guid.newGuid().StringGuid;
   }
}

const errors = {
   notAdd: "not data add",
   notData: "not data found",
   callBack: "A 'callback' is require.",
   key: "'key' value is require.",
   objectRequite: "'obj' value is require.",
   isNotObject: "'obj' is not an object",
};

function createFileDb(callback) {
   if (!fs.existsSync(db_name)) {
      console.log(`The data file does create.`);

      fs.appendFile(db_name, "", (err) => {
         if (err) throw err;

         /* fs.chmod(db_name, 0o400, (err) => {
            if (err) throw err;
            fs.chmod(db_name, 0o200, (err) => {
               if (err) throw err;
               callback(undefined);
            });
         });*/

         callback(undefined);
      });
   } else {
      getAll(callback);
   }
}

function argumentsCheck(arg) {
   const propertys = Reflect.ownKeys(arg);
   propertys.forEach((e) => {
      switch (e) {
         case "callback": {
            if (typeof Reflect.get(arg, e) !== "function")
               console.log(errors.callBack);
            break;
         }
         case "key": {
            if (!e.isEmpty()) if (!Guid.isValid(e)) console.log(errors.keys);
            break;
         }
         case "obj": {
            if (typeof Reflect.get(arg, e) !== "object")
               console.log(errors.isNotObject);
         }
      }
   });
}

const lock = (rw) => {
   //reid
   if (rw) {
      /*fs.chmodSync(db_name, 0o400);*/
   } else {
      //wraid
      /*fs.chmodSync(db_name, 0o200);*/
   }
};

const unlock = (rw) => {
   //reid
   if (rw) {
      // fs.chmodSync(db_name, 0o4);
   } else {
      //wraid
      //fs.chmodSync(db_name, 0o2);
   }
   /*   console.log("usuario asignar");
   fs.chownSync(db_name, 1541, 999);

   fs.chmodSync(db_name, 0o4);
   console.log("usuario 0o4");
   fs.chmodSync(db_name, 0o2);
   console.log("usuario 0o2");
   fs.chmodSync(db_name, 0o1);
   console.log("usuario 0o1");
*/
};

function set(callback, obj) {
   unlock(false);

   argumentsCheck({ callback: callback, obj: obj });

   createFileDb((allData) => {
      function isSetAllData(getObjAllData) {
         if (Reflect.set(allData, obj.constructor.name, getObjAllData)) {
            throw errors.notAdd;
         }
      }

      if (allData !== undefined) {
         let getObjAllData = Reflect.get(allData, obj.constructor.name);

         if (getObjAllData !== undefined) {
            if (Array.isArray(getObjAllData)) {
               getObjAllData.push(obj);
            } else {
               const aux = getObjAllData;
               getObjAllData = [];
               getObjAllData.push(aux);
               getObjAllData.push(obj);
            }

            isSetAllData(getObjAllData);
         } else {
            isSetAllData(objgetObjAllData);
         }
      } else {
         isSetAllData(getObjAllData);
      }

      if (allData === undefined) {
         throw errors.notData;
      }

      fs.writeFile(db_name, JSON.stringify(allData), (err) => {
         if (err) throw err;
      });
   });

   lock(false);
}

function setUp(callback, obj) {
   unlock(false);

   argumentsCheck({ callback: callback, obj: obj });

   function replaceEleOfArray() {
      for (const e in getObjAllData) {
         if (getObjAllData[e].key == obj.key) {
            getObjAllData[e] = obj;
            break;
         }
      }
   }

   getAll((allData) => {
      function isSetAllData(getObjAllData) {
         if (Reflect.set(allData, obj.constructor.name, getObjAllData)) {
            throw errors.notAdd;
         }
      }

      if (allData !== undefined) {
         let getObjAllData = Reflect.get(allData, obj.constructor.name);

         if (getObjAllData !== undefined) {
            if (Array.isArray(getObjAllData)) {
               replaceEleOfArray(getObjAllData);
            } else {
               const aux = getObjAllData;
               getObjAllData = [];
               getObjAllData.push(aux);
               replaceEleOfArray(obj);
            }

            isSetAllData(getObjAllData);
         } else {
            isSetAllData(getObjAllData);
         }
      } else {
         isSetAllData(getObjAllData);
      }

      if (allData !== undefined) {
         throw errors.notData;
      }

      fs.writeFile(db_name, JSON.stringify(allData), (err) => {
         if (err) callback(err);
      });
   });

   lock(false);
}

function getAll(callback) {
   unlock(true);

   argumentsCheck({ callback: callback });

   fs.readFile(db_name, (err, data) => {
      if (err) {
         throw err;
      }

      callback(JSON.parse(data));
   });

   lock(true);
}

function get(callback, obj) {
   unlock(true);

   argumentsCheck({ callback: callback, obj: obj });

   fs.readFile(db_name, (err, data) => {
      if (err) {
         throw err;
      }

      callback(Reflect.get(JSON.parse(data), obj.constructor.name));
   });

   lock(true);
}

function getKey(callback, obj, key) {
   unlock(true);

   argumentsCheck({ callback: callback, obj: obj, key, key });

   fs.readFile(db_name, (err, data) => {
      if (err) {
         throw err;
      }
      const value = Reflect.get(JSON.parse(data), obj.constructor.name);

      for (var arr in value) {
         if (value[arr].key === key) {
            callback(value[arr]);
            break;
         }
      }
   });

   lock(true);
}

module.exports.get = get;
module.exports.getAll = getAll;
module.exports.getKey = getKey;
module.exports.set = set;
module.exports.setUp = setUp;
module.exports.daj = daj;
