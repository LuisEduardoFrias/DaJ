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

const lock = () => {
   //reid
   /*fs.chmodSync(db_name, 0o400);*/
   //wraid
   /*fs.chmodSync(db_name, 0o200);*/
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
      new gate().getAll(callback);
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

class gate {
   get(callback, obj) {
      argumentsCheck({ callback: callback, obj: obj });

      fs.readFile(db_name, (err, data) => {
         if (err) {
            throw err;
         }

         let newObj = {};

         try {
            newObj = JSON.parse(data);
         } catch {
            callback(errors.notData);
         }

         callback(Reflect.get(newObj, obj.constructor.name));
      });

      lock(true);
   }

   getAll(callback) {
      argumentsCheck({ callback: callback });

      fs.readFile(db_name, (err, data) => {
         if (err) {
            throw err;
         }

         let newObj = {};
         let isError = false;

         try {
            newObj = JSON.parse(data);
         } catch {
            isError = true;
            callback(errors.notData);
         }

         if (!isError) callback(newObj);
      });

      lock(true);
   }

   getKey(callback, obj, key) {
      argumentsCheck({ callback: callback, obj: obj, key, key });

      fs.readFile(db_name, (err, data) => {
         if (err) {
            throw err;
         }

         let newObj = {};

         try {
            newObj = JSON.parse(data);
         } catch {
            callback(errors.notData);
         }

         const value = Reflect.get(newObj, obj.constructor.name);

         for (var arr in value) {
            if (value[arr].key === key) {
               callback(value[arr]);
            }
         }
      });

      lock(true);
   }

   set(callback, obj) {
      argumentsCheck({ callback: callback, obj: obj });

      createFileDb((allData) => {
         function isSetAllData(objData, newProtype) {
            if (newProtype) allData = {};

            if (!Reflect.set(allData, obj.constructor.name, objData)) {
               throw errors.notAdd;
            }
         }

         if (allData !== undefined && allData !== errors.notData) {
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
               isSetAllData(obj, true);
            }
         } else {
            isSetAllData(obj, true);
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

   setUp(callback, obj) {
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
         function isSetAllData(objData, newProtype) {
            if (newProtype) allData = {};

            if (!Reflect.set(allData, obj.constructor.name, objData)) {
               throw errors.notAdd;
            }
         }

         if (allData !== undefined && allData !== errors.notData) {
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
               isSetAllData(obj, true);
            }
         } else {
            isSetAllData(obj, true);
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
}

module.exports.gate = new gate();
module.exports.daj = daj;
