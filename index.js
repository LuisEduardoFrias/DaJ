const fs = require("fs");
const { Guid } = require("js-guid");
const db_name = "./daj.json";

const l = (e) => console.log(e);
//Data Archive Json
class daj {
   constructor() {
      this.key = Guid.newGuid().StringGuid;
   }

   json() {
      Reflect.set(this, "constructor", {
         name: this.constructor.name,
      });
      return JSON.stringify(this);
   }
}

const errors = {
   notAdd: "DaJ; Error: not data add",
   notData: "DaJ; Error: not data found",
   callBack: "DaJ; Error: A 'callback' is require.",
   key: "DaJ; Error: 'key' value is require.",
   objectRequite: "DaJ; Error: 'obj' value is require.",
   notDataAccess: "DaJ; Error: not may accesss to the data.",
   isNotObject: "DaJ; Error: 'obj' is not an object",
   arrayNot: "Array not soport in PUT",
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

         callback(null);
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

      let constructor_name;
      constructor_name = obj.constructor.name;
      Reflect.deleteProperty(obj, "constructor");

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
               callback(null, Reflect.get(newObj, constructor_name));
            }
         }
      });

      lock(true);
   }
   getAsync(obj) {
      argumentsCheck({ obj: obj });

      let constructor_name;
      constructor_name = obj.constructor.name;
      Reflect.deleteProperty(obj, "constructor");

      const dataReturn = fs.readFileSync(db_name);

      let newObj = {};
      let isError = false;

      try {
         newObj = JSON.parse(dataReturn);
      } catch {
         isError = true;
         return errors.notData;
      }

      if (!isError) {
         return Reflect.get(newObj, constructor_name);
      }

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
   getAllAsync() {
      fs.readFile(db_name, (err, data) => {
         if (err) {
            // console.log(err);
            return errors.notDataAccess;
         }
         let newObj = {};

         try {
            newObj = JSON.parse(data);
         } catch {
            return errors.notData;
         }

         return newObj;
      });

      lock(true);
   }
   getKey(callback, obj, key) {
      argumentsCheck({ callback: callback, obj: obj, key, key });

      let constructor_name;
      constructor_name = obj.constructor.name;
      Reflect.deleteProperty(obj, "constructor");

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
               const value = Reflect.get(newObj, constructor_name);

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
   getKeyAsync(obj, key) {
      argumentsCheck({ obj: obj, key, key });

      let constructor_name;
      constructor_name = obj.constructor.name;
      Reflect.deleteProperty(obj, "constructor");

      fs.readFile(db_name, (err, data) => {
         if (err) {
            // console.log(err);
            return errors.notDataAccess;
         }
         let newObj = {};

         try {
            newObj = JSON.parse(data);
         } catch {
            return errors.notData;
         }

         const value = Reflect.get(newObj, constructor_name);

         if (value !== undefined && value !== null) {
            for (var arr in value) {
               if (value[arr].key === key) {
                  return value[arr];
               }
            }
         }
         return errors.notdata;
      });

      lock(true);
   }
   post(callback, obj) {
      argumentsCheck({ callback: callback, obj: obj });

      let constructor_name;
      let objIsArray = false;
      constructor_name = obj.constructor.name;
      Reflect.deleteProperty(obj, "constructor");

      if (constructor_name === "Array") {
         for (const i in obj) {
            if (Reflect.ownKeys(obj[i])[0] === "constructor") {
               constructor_name = obj[i]["constructor"].name;
               obj.pop(i);
               objIsArray = true;
               break;
            }
         }
      }

      createFileDb((e, allData) => {
         function isSetAllData(objData, newProtype) {
            if (newProtype) {
               allData = {};
            }

            if (!Reflect.set(allData, constructor_name, objData)) {
               callback(errors.notAdd);
               return true;
            }
         }
         let isError = false;
         if (allData !== errors.notData && allData !== null) {
            let specificObj = Reflect.get(allData, constructor_name);

            if (specificObj !== undefined) {
               if (Array.isArray(specificObj)) {
                  if (objIsArray) {
                     specificObj = [...specificObj, ...obj];
                  } else {
                     specificObj.push(obj);
                  }
               } else {
                  const aux = specificObj;
                  specificObj = [];
                  specificObj.push(aux);

                  if (objIsArray) {
                     specificObj = [...specificObj, ...obj];
                  } else {
                     specificObj.push(obj);
                  }
               }

               isError = isSetAllData(specificObj);
            } else {
               isError = isSetAllData(obj);
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
   postAsync(obj) {
      argumentsCheck({ obj: obj });

      let constructor_name;
      let objIsArray = false;
      constructor_name = obj.constructor.name;
      Reflect.deleteProperty(obj, "constructor");

      if (constructor_name === "Array") {
         for (const i in obj) {
            if (Reflect.ownKeys(obj[i])[0] === "constructor") {
               constructor_name = obj[i]["constructor"].name;
               obj.pop(i);
               objIsArray = true;
               break;
            }
         }
      }

      createFileDb((e, allData) => {
         function isSetAllData(objData, newProtype) {
            if (newProtype) {
               allData = {};
            }

            if (!Reflect.set(allData, constructor_name, objData)) {
               return errors.notAdd;
            }
         }

         if (allData !== errors.notData && allData !== null) {
            let specificObj = Reflect.get(allData, constructor_name);

            if (specificObj !== undefined) {
               if (Array.isArray(specificObj)) {
                  if (objIsArray) {
                     specificObj = [...specificObj, ...obj];
                  } else {
                     specificObj.push(obj);
                  }
               } else {
                  const aux = specificObj;
                  specificObj = [];
                  specificObj.push(aux);

                  if (objIsArray) {
                     specificObj = [...specificObj, ...obj];
                  } else {
                     specificObj.push(obj);
                  }
               }

               isSetAllData(specificObj);
            } else {
               isSetAllData(obj);
            }
         } else {
            isSetAllData(obj, true);
         }

         if (allData === undefined) {
            return errors.notData;
         }

         fs.writeFile(db_name, JSON.stringify(allData), (err) => {
            if (err) {
               return errors.notDataAccess;
            }
            callback(null);
         });
      });

      lock(false);
   }
   put(callback, obj) {
      argumentsCheck({ callback: callback, obj: obj });

      let constructor_name;
      constructor_name = obj.constructor.name;

      if (constructor_name === "Array") {
         callback(errors.arrayNot);
      } else {
         Reflect.deleteProperty(obj, "constructor");

         function replaceEleOfArray(objToReplace) {
            for (const e in objToReplace) {
               if (objToReplace[e].key == obj.key) {
                  objToReplace[e] = obj;
                  break;
               }
            }
         }

         this.getAll((e, allData) => {
            function isSetAllData(objData) {
               if (!Reflect.set(allData, constructor_name, objData)) {
                  callback(errors.notAdd);
                  return true;
               }
            }

            let isError = false;

            if (allData !== null && allData !== errors.notData) {
               let specificObj = Reflect.get(allData, constructor_name);

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
                  callback(errors.notData);
               }
            } else {
               callback(errors.notData);
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
      }
      lock(false);
   }
   putAsync(obj) {
      argumentsCheck({ obj: obj });

      let constructor_name;
      constructor_name = obj.constructor.name;

      if (constructor_name === "Array") {
         return errors.arrayNot;
      }

      Reflect.deleteProperty(obj, "constructor");

      function replaceEleOfArray(objToReplace) {
         for (const e in objToReplace) {
            if (objToReplace[e].key == obj.key) {
               objToReplace[e] = obj;
               break;
            }
         }
      }

      this.getAll((e, allData) => {
         function isSetAllData(objData) {
            if (!Reflect.set(allData, constructor_name, objData)) {
               return errors.notAdd;
            }
         }

         if (allData !== null && allData !== errors.notData) {
            let specificObj = Reflect.get(allData, constructor_name);

            if (specificObj !== undefined) {
               if (Array.isArray(specificObj)) {
                  replaceEleOfArray(specificObj);
               } else {
                  const aux = specificObj;
                  specificObj = [];
                  specificObj.push(aux);
                  replaceEleOfArray(specificObj);
               }

               isSetAllData(specificObj);
            } else {
               return errors.notData;
            }
         } else {
            return errors.notData;
         }

         if (allData === undefined) {
            return errors.notData;
         }

         fs.writeFile(db_name, JSON.stringify(allData), (err) => {
            if (err) {
               // console.log(err);
               return errors.notDataAccess;
            }

            return null;
         });
      });

      lock(false);
   }
   delete(callback, obj) {
      argumentsCheck({ callback: callback, obj: obj });

      let constructor_name;
      constructor_name = obj.constructor.name;
      Reflect.deleteProperty(obj, "constructor");

      this.getAll((e, allData) => {
         function isSetAllData(objData) {
            if (!Reflect.set(allData, constructor_name, objData)) {
               callback(errors.notAdd);
               return true;
            }
         }
         let isError = false;
         if (allData !== null && allData !== errors.notData) {
            let specificObj = Reflect.get(allData, constructor_name);

            if (specificObj !== undefined) {
               if (Array.isArray(specificObj)) {
                  const index = specificObj.findIndex((e) => e.key === obj.key);

                  if (index > -1) {
                     specificObj.splice(index, 1);
                  }

                  isError = isSetAllData(specificObj);
               } else {
                  Reflect.deleteProperty(allData, constructor_name);
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
   deleteAsync(obj) {
      argumentsCheck({ obj: obj });

      let constructor_name;
      constructor_name = obj.constructor.name;
      Reflect.deleteProperty(obj, "constructor");

      this.getAll((e, allData) => {
         function isSetAllData(objData) {
            if (!Reflect.set(allData, constructor_name, objData)) {
               return errors.notAdd;
            }
         }

         if (allData !== null && allData !== errors.notData) {
            let specificObj = Reflect.get(allData, constructor_name);

            if (specificObj !== undefined) {
               if (Array.isArray(specificObj)) {
                  const index = specificObj.findIndex((e) => e.key === obj.key);

                  if (index > -1) {
                     specificObj.splice(index, 1);
                  }

                  isSetAllData(specificObj);
               } else {
                  Reflect.deleteProperty(allData, constructor_name);
               }
            } else {
               return errors.notData;
            }

            fs.writeFile(db_name, JSON.stringify(allData), (err) => {
               if (err) {
                  return errors.notDataAccess;
               }
               return null;
            });
         } else {
            return errors.notData;
         }
      });
   }
}

module.exports.gate = new gate();
module.exports.daj = daj;
