const { daj, dajb } = require("./index.js");

class Aniamals extends dajb {
  constructor(nombre, tipo, edad) {
    super();
    this.nombre = nombre;
    this.tipo = tipo;
    this.edad = edad;
  }
}

class Person extends dajb {
  constructor(nombre, edad, altura) {
    super();
    this.nombre = nombre;
    this.edad = edad;
    this.altura = altura;
  }
}
/*
const perro = new Aniamals("puchi", "iguana", 5);
const jose = new Person("pepe luis", "meriñon", 3.1);
const _res = daj.postAsync(jose);

if (!_res?.error) {
  console.log("data: " + JSON.stringify(_res?.data));
} else {
  console.log("error: " + _res?.error);
}*/

//daj.get((e) => console.log("get: " + JSON.stringify(e)), new Person());

const res = daj.getAsync(new Person());

if (!res?.error) {
  console.log("data: " + JSON.stringify(res?.data));
} else {
  console.log("error: " + res?.error);
}

//maria.key = '715f451d-71ae-45fb-b8ce-39c4e417f132';
//gate.get((e) => console.log("get: " + JSON.stringify(e)), maria);
