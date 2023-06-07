const { daj, get, set } = require("./index.js");

class Producto extends daj {
   constructor(nombre, precio) {
      super();
      this.nombre = nombre;
      this.precio = precio;
   }

   getData() {
      return `${nombre} ${precio}`;
   }
}

class PersonaX extends daj {
   constructor(nombre, edad, altura) {
      super();
      this.nombre = nombre;
      this.edad = edad;
      this.altura = altura;
   }
}

const embutido = new Producto("salami induveca", 250.99);
let maria = new PersonaX("maria", "riberas", 5.4);

//console.log(embutido.constructor.name);
//set((r) => console.log("set: " + r), maria);

get((e) => {
   console.log("get: " + JSON.stringify(e));
}, maria);

// usersApi.js
/*
export async function getUsers(): Promise<Array<Object>> {
  const response = await fetch('https://example.com/api/users');
  const data = await response.json();
  return data;
}*/
