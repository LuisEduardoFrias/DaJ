"use strict";

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

function code(str) {
  let _str = btoa(str);

  const output = [];
  for (let i = 0; i < _str.length; i++) {
    let bin = _str[i].charCodeAt().toString(2);
    output.push(Array(8 - bin.length + 1).join("0") + bin);
  }
  return output.join(" ");
}

function encode(str) {
  let _str = new String(str);
  let binString = "";

  _str
    .split(" ")
    .map((bin) => (binString += String.fromCharCode(parseInt(bin, 2))));

  return atob(binString);
}

module.exports.code = code;
module.exports.encode = encode;
