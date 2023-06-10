const { daj, gate } = require("./index.js");

class Aniamales extends daj {
   constructor(nombre, tipo, edad) {
      super();
      this.nombre = nombre;
      this.tipo = tipo;
      this.edad = edad;
   }
}

class Personas extends daj {
   constructor(nombre, edad, altura) {
      super();
      this.nombre = nombre;
      this.edad = edad;
      this.altura = altura;
   }
}

const embutido = new Aniamales("puchi", "iguana", 5);
let maria = new Personas("prueba", "erase", 1.1);

gate.setUp((r) => console.log(r), maria);

gate.get((e) => console.log("get: " + JSON.stringify(e)), maria);

//maria.key = '715f451d-71ae-45fb-b8ce-39c4e417f132';
//gate.delete((e) => {}, maria);
//gate.get((e) => console.log("get: " + JSON.stringify(e)), maria);
