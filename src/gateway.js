"use strict";

const fs = require("fs");

const errors = require("./errors");
const argumentsCheck = require("./argumentsCheck");
const { code, encode } = require("./locks");
const { createFileDb, createFileDbAsync, db_name } = require("./createFileDb");

const l = (e) => console.log(e);
const error = (e) => console.error(e);

class daj {
  //
  //method get
  //
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
          newObj = JSON.parse(encode(data));
        } catch (err) {
          isError = true;
          error(err);
          callback(errors.notData, null);
        }

        if (!isError) {
          callback(null, Reflect.get(newObj, constructor_name));
        }
      }
    });
  }
  //
  //method get async
  //
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
          data: Reflect.get(JSON.parse(encode(dataReturn)), constructor_name),
        };
      } catch (err) {
        error(err);
        return { error: errors.notData, data: null };
      }
    } catch (err) {
      error(err);
      return { error: errors.notDataAccess, data: null };
    }
  }
  //
  //method getAll
  //
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
          newObj = JSON.parse(encode(data));
        } catch (err) {
          isError = true;
          error(err);
          callback(errors.notData, null);
        }

        if (!isError) {
          callback(null, newObj);
        }
      }
    });
  }
  //
  //method getall async
  //
  getAllAsync() {
    try {
      const data = fs.readFileSync(db_name);
      try {
        return { error: null, data: JSON.parse(encode(data)) };
      } catch (err) {
        error(err);
        return { error: errors.notData, data: null };
      }
    } catch (err) {
      error(err);
      return { error: errors.notDataAccess, data: null };
    }
  }
  //
  //method getKey
  //
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
          newObj = JSON.parse(encode(data));
        } catch (err) {
          isError = true;
          error(err);
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
            error(error.notdata);
            callback(errors.notdata, null);
          }
        }
      }
    });
  }
  //
  //method getkey async
  //
  getKeyAsync(obj, key) {
    argumentsCheck({ obj: obj, key: key });

    let constructor_name;
    constructor_name = obj.constructor.name;
    Reflect.deleteProperty(obj, "constructor");

    try {
      const data = fs.readFileSync(db_name);

      try {
        const value = Reflect.get(JSON.parse(encode(data)), constructor_name);

        if (value !== undefined && value !== null) {
          for (var arr in value) {
            if (value[arr].key === key) {
              return { error: null, data: value[arr] };
            }
          }
          return { error: errors.notData, data: null };
        }
      } catch (err) {
        error(err);
        return { error: errors.notData, data: null };
      }
    } catch (err) {
      error(err);
      return { error: errors.notDataAccess, data: null };
    }
  }
  //
  //method post
  //
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
          fs.writeFile(db_name, code(JSON.stringify(allData)), (err) => {
            if (err) {
              error(err);
              callback(errors.notDataAccess);
              isError = true;
            }
            if (!isError) callback("Success");
          });
        }
      }
    }, this);
  }
  //
  //method post async
  //
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

    const response = createFileDbAsync(this);

    if (response.error !== null) return { error: response.error, data: null };

    let allData = response.data;

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
      fs.writeFileSync(db_name, code(JSON.stringify(allData)));
      return {
        error: null,
        data: "Success",
      };
    } catch (err) {
      error(err);
      return { error: errors.notData, data: null };
    }
  }
  //
  //method pur
  //
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
            fs.writeFile(db_name, code(JSON.stringify(allData)), (err) => {
              if (err) {
                error(err);
                isError = true;
                callback(errors.notDataAccess);
              }

              if (!isError) callback("Success");
            });
          }
        }
      });
    }
  }
  //
  //method put async
  //
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
        return { error: response.notAdd, data: null };
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
        return { error: response.notData, data: null };
      }
    } else {
      return { error: response.notData, data: null };
    }

    if (allData === undefined) {
      return { error: response.notData, data: null };
    }

    try {
      fs.writeFileSync(db_name, code(JSON.stringify(allData)));
      return { error: null, data: "Success" };
    } catch (err) {
      error(err);
      return { error: response.notDataAccess, data: null };
    }
  }
  //
  //method delete
  //
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
          fs.writeFile(db_name, code(JSON.stringify(allData)), (err) => {
            if (err) {
              error(err);
              callback(errors.notDataAccess, null);
              isError = true;
            }
            if (!isError) callback("Success");
          });
        }
      } else {
        callback(errors.notData);
      }
    });
  }
  //
  //method  delete async
  //
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
        fs.writeFileSync(db_name, code(JSON.stringify(allData)));
        return { error: null, data: "Success" };
      } catch (err) {
        error(err);
        return { error: errors.notDataAccess, data: null };
      }
    } else {
      return { error: errors.notData, data: null };
    }
  }
}

module.exports = new daj();
