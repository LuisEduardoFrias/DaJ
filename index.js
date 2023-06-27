const fs = require("fs");
const { Guid } = require("js-guid");
const db_name = "./daj.json";

const l = (e) => console.log(e);
const error = (e) => console.error(e);

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

   djson(json) {
      const obj = JSON.parse(json);
      this.mapper(obj);
   }

   mapper(obj) {
      const keys = Reflect.ownKeys(obj);
      keys.forEach((key) => {
         Reflect.set(this, key, obj[key]);
      });
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

function createFileDb(callback) {
   if (!fs.existsSync(db_name)) {
      console.log(`The data file does create.`);

      fs.appendFile(db_name, "", (err) => {
         if (err) {
            callback(errors.notDataAccess, null);
         } else {
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
      new gate().getAll(callback);
   }
}

function createFileDbAsync() {
   if (!fs.existsSync(db_name)) {
      try {
         const response = fs.appendFileAsync(db_name, "");

         /* fs.chmod(db_name, 0o400, (err) => {
            if (err) throw err;
            fs.chmod(db_name, 0o200, (err) => {
               if (err) throw err;
               callback(undefined);
            });
         });*/
         console.log(`The data file does create.`);
         return { error: null, data: null };
      } catch {
         return { error: errors.notDataAccess, data: null };
      }
   } else {
      return new gate().getAllAsync();
   }
}

function argumentsCheck(arg) {
   const propertys = Reflect.ownKeys(arg);
   propertys.forEach((e) => {
      switch (e) {
         case "callback": {
            if (typeof Reflect.get(arg, e) !== "function")
               throw new TypeError(errors.callBack);
            break;
         }
         case "key": {
            if (!e=== "") if (!Guid.isValid(e)) throw new TypeError(errors.keys);
            break;
         }
         case "obj": {
            if (typeof Reflect.get(arg, e) !== "object")
               throw new TypeError(errors.isNotObject);
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
            console.error(`DaJ: ${err}`);
            callback(errors.notDataAccess, null);
         } else {
            let newObj = {};
            let isError = false;

            try {
               newObj = JSON.parse(data);
            } catch {
               isError = true;
               error(errors.notData);
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

      try {
         let dataReturn = fs.readFileSync(db_name);

         try {
            return {
               error: null,
               data: Reflect.get(JSON.parse(dataReturn), constructor_name),
            };
         } catch {
            error(errors.notData);
            return { error: errors.notData, data: null };
         }
      } catch (err) {
         console.error(errors.notDataAccess);
         return { error: errors.notDataAccess, data: null };
      }

      lock(true);
   }
   getAll(callback) {
      argumentsCheck({ callback: callback });

      fs.readFile(db_name, (err, data) => {
         if (err) {
            error(err);
            callback(errors.notDataAccess, null);
         } else {
            let newObj = {};
            let isError = false;

            try {
               newObj = JSON.parse(data);
            } catch {
               isError = true;
               error(errors.notData);
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
      try {
         const data = fs.readFileSync(db_name);
         try {
            return { error: null, data: JSON.parse(data) };
         } catch {
            error(errors.notData);
            return { error: errors.notData, data: null };
         }
      } catch {
         console.error(errors.notDataAccess);
         return { error: errors.notDataAccess, data: null };
      }

      lock(true);
   }
   getKey(callback, obj, key) {
      argumentsCheck({ callback: callback, obj: obj, key: key });

      let constructor_name;
      constructor_name = obj.constructor.name;
      Reflect.deleteProperty(obj, "constructor");

      fs.readFile(db_name, (err, data) => {
         if (err) {
            error(errors.notDataAccess);
            callback(errors.notDataAccess, null);
         } else {
            let newObj = {};
            let isError = false;

            try {
               newObj = JSON.parse(data);
            } catch {
               isError = true;
               error(errors.notData);
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
                  error(errors.notdata);
                  callback(errors.notdata, null);
               }
            }
         }
      });

      lock(true);
   }
   getKeyAsync(obj, key) {
      argumentsCheck({ obj: obj, key: key });

      let constructor_name;
      constructor_name = obj.constructor.name;
      Reflect.deleteProperty(obj, "constructor");

      try {
         const data = fs.readFileSync(db_name);

         try {
            const value = Reflect.get(JSON.parse(data), constructor_name);

            if (value !== undefined && value !== null) {
               for (var arr in value) {
                  if (value[arr].key === key) {
                     return { error: null, data: value[arr] };
                  }
               }
               return {error:errors.notData ,data:null};
            }
         } catch {
            error(errors.notData);
            return { error: errors.notData, data: null };
         }
      } catch {
         console.error(errors.notDataAccess);
         return { error: errors.notDataAccess, data: null };
      }

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
                     error(err);
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

      const response = createFileDbAsync();

      if (response.error !== null) return { error: response.error, data: null };

      const allData = response.data;

      const isSetAllData = (objData, newProtype) => {
         if (newProtype) {
            allData = {};
         }

         if (!Reflect.set(allData, constructor_name, objData)) {
            error(errors.notAdd);
            //Todo este valor de retornl esta es tomado en cuenta
            return { error: errors.notAdd, data: null };
         }
      };

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
                  //Todo esto replasara un valor si es igual a otro no quiero  esto arreglar
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

      //Todo muy poco probablevq se devesta condicuon
      if (allData === undefined) {
         return { error: errors.notData, data: null };
      }

      try {
         return {
            error: null,
            data: fs.writeFileSync(db_name, JSON.stringify(allData)),
         };
      } catch {
         return { error: errors.notData, data: null };
      }

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

         const replaceEleOfArray = (objToReplace) => {
            for (const e in objToReplace) {
               if (objToReplace[e].key == obj.key) {
                  objToReplace[e] = obj;
                  break;
               }
            }
         };

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
                        error(err);
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
         return { error: errors.arrayNot, data: null };
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

      const response = this.getAllAsync();

      if (response.error !== null) return { error: response.error, data: null };

      const allData = response.data;

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

      return fs.writeFileSync(db_name, JSON.stringify(allData));

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
                     error(err);
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

      const response = this.getAllAsync();

      if (response.error !== null) return { error: response.error, data: null };

      const allData = response.data;

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
            return { error: errors.notData, data: null };
         }

         try {
            fs.writeFileSync(db_name, JSON.stringify(allData));
            return { error: null, data: "Success" };
         } catch {
            return { error: errors.notDataAccess, data: null };
         }
      } else {
         return { error: errors.notData, data: null };
      }
   }
}

module.exports.gate = new gate();
module.exports.daj = daj;
