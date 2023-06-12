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
   notDataAccess: "not may accesss to the data.",
   isNotObject: "'obj' is not an object",
};

// TODO crear un log file de errores
//TODO verificar y activar permisos de escritura y lectira de archico
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

//TODO validar error al crear el archivo.
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
            // console.log(err);
            callback(errors.notDataAccess, null);
         } else {
            let newObj = {};
            let isError = false;

            try {
               newObj = JSON.parse(data);
            } catch {
               isError = true;
               callback(errors.notData, null);
            }

            if (!isError) {
               callback(null, Reflect.get(newObj, obj.constructor.name));
            }
         }
      });

      lock(true);
   }

   getAll(callback) {
      argumentsCheck({ callback: callback });

      fs.readFile(db_name, (err, data) => {
         if (err) {
            // console.log(err);
            callback(errors.notDataAccess, null);
         } else {
            let newObj = {};
            let isError = false;

            try {
               newObj = JSON.parse(data);
            } catch {
               isError = true;
               callback(errors.notData, null);
            }

            if (!isError) {
               callback(null, newObj);
            }
         }
      });

      lock(true);
   }

   getKey(callback, obj, key) {
      argumentsCheck({ callback: callback, obj: obj, key, key });

      fs.readFile(db_name, (err, data) => {
         if (err) {
            // console.log(err);
            callback(errors.notDataAccess, null);
         } else {
            let newObj = {};
            let isError = false;

            try {
               newObj = JSON.parse(data);
            } catch {
               isError = true;
               callback(errors.notData, null);
            }

            if (!isError) {
               const value = Reflect.get(newObj, obj.constructor.name);

               if (value !== undefined && value !== null) {
                  for (var arr in value) {
                     if (value[arr].key === key) {
                        callback(null, value[arr]);
                     }
                  }
               } else {
                  callback(errors.notdata, null);
               }
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
               callback(errors.notAdd);
               return true;
            }
         }
         let isError = false;
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

               isError = isSetAllData(getObjAllData);
            } else {
               isError = isSetAllData(obj, true);
            }
         } else {
            isError = isSetAllData(obj, true);
         }

         if (!isError) {
            if (allData === undefined) {
               callback(errors.notData);
               isArray = true;
            }

            if (!isError) {
               fs.writeFile(db_name, JSON.stringify(allData), (err) => {
                  if (err) {
                     //  console.log(err);
                     callback(errors.notDataAccess);
                     isError = true;
                  }
                  if (!isError) callback(null);
               });
            }
         }
      });

      lock(false);
   }

   setUp(callback, obj) {
      argumentsCheck({ callback: callback, obj: obj });

      function replaceEleOfArray(objToReplace) {
         for (const e in objToReplace) {
            if (objToReplace[e].key == obj.key) {
               objToReplace[e] = obj;
               break;
            }
         }
      }

      this.getAll((allData) => {
         function isSetAllData(objData, newProtype) {
            if (newProtype) allData = {};

            if (!Reflect.set(allData, obj.constructor.name, objData)) {
               callback(errors.notAdd);
               return true;
            }
         }

         let isError = false;

         if (allData !== undefined && allData !== errors.notData) {
            let specificObj = Reflect.get(allData, obj.constructor.name);

            if (specificObj !== undefined) {
               if (Array.isArray(specificObj)) {
                  replaceEleOfArray(specificObj);
               } else {
                  const aux = specificObj;
                  specificObj = [];
                  specificObj.push(aux);
                  replaceEleOfArray(specificObj);
               }

               isError = isSetAllData(specificObj);
            } else {
               isError = isSetAllData(obj, true);
            }
         } else {
            isError = isSetAllData(obj, true);
         }
         if (!isError) {
            if (allData === undefined) {
               callback(errors.notData);
               isError = true;
            }

            if (!isError) {
               fs.writeFile(db_name, JSON.stringify(allData), (err) => {
                  if (err) {
                     // console.log(err);
                     isError = true;
                     callback(errors.notDataAccess);
                  }

                  if (!isError) callback(null);
               });
            }
         }
      });

      lock(false);
   }

   delete(callback, obj) {
      argumentsCheck({ callback: callback, obj: obj });

      this.getAll((allData) => {
         function isSetAllData(objData) {
            if (!Reflect.set(allData, obj.constructor.name, objData)) {
               callback(errors.notAdd);
               return true;
            }
         }
         let isError = false;
         if (allData !== undefined && allData !== errors.notData) {
            let specificObj = Reflect.get(allData, obj.constructor.name);

            if (specificObj !== undefined) {
               if (Array.isArray(specificObj)) {
                  const index = specificObj.findIndex((e) => e.key === obj.key);

                  if (index > -1) {
                     specificObj.splice(index, 1);
                  }

                  isError = isSetAllData(specificObj);
               } else {
                  Reflect.deleteProperty(allData, obj.constructor.name);
               }
            } else {
               callback(errors.notData);
               isError = true;
            }
            if (!isError) {
               fs.writeFile(db_name, JSON.stringify(allData), (err) => {
                  if (err) {
                     console.log(err);
                     callback(errors.notDataAccess, null);
                     isError = true;
                  }
                  if (!isError) callback(null);
               });
            }
         } else {
            callback(errors.notData);
         }
      });
   }
}

module.exports.gate = new gate();
module.exports.daj = daj;
