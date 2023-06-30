"use strict";

const errors = require('./errors')

function argumentsCheck(arg) {
  //  const propertys = Reflect.ownKeys(arg);
  Reflect.ownKeys(arg).forEach((e) => {
    switch (e) {
      case "callback": {
        if (typeof Reflect.get(arg, e) !== "function")
          throw new TypeError(errors.callBack);
        break;
      }
      case "key": {
        if (!e === "") {
          if (!Guid.isValid(e)) throw new TypeError(errors.keys);
        }
        break;
      }
      case "obj": {
        if (typeof Reflect.get(arg, e) !== "object")
          throw new TypeError(errors.isNotObject);
      }
    }
  });
}

module.exports = argumentsCheck;
