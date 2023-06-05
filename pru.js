const daj = require("./index.js");

const ob = {};

function json(value) {
   console.log(value);
}

ob.json = json;

daj.getAll(ob);

const persona = new daj.Class("animales");
persona.nombre = "princesa";
persona.rasa = "perro";

//daj.set(ob, persona);
