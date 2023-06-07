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
let maria = new Personas("maria", "riberas", 5.4);

gate.set((r) => console.log(r), maria);

gate.get((e) => console.log("get: " + JSON.stringify(e)), maria);
