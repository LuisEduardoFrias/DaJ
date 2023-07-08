# DaJ
Una librería para NodeJs que te permite manejar datos en tu aplicación, estos datos se guardan en el sistema como archivos un codificados a binario.

# Uso

const { daj, dajb } = require("./index.js");

class Animals extends dajb {
  constructor(nombre, tipo, edad) {
    super();
    this.nombre = nombre;
    this.tipo = tipo;
    this.edad = edad;
  }
}

const perro = new Animals("puchi", "iguana", 5);

const _res = daj.postAsync(jose);

if (!_res?.error) {
  console.log("data: " + JSON.stringify(_res?.data));
} else {
  console.log("error: " + _res?.error);
}*/

const res = daj.getAsync(new Animals());

if (!res?.error) {
  console.log("data: " + JSON.stringify(res?.data));
} else {
  console.log("error: " + res?.error);
}
