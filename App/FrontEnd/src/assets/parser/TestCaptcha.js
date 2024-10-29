

// Importa el parser y la clase Captcha (asegúrate de tenerlos exportados si están en otros archivos)
const  parser = require('./Parser'); // Importa el parser generado
const Captcha = require('./Captcha'); // Importa la clase Captcha
const fs = require('fs'); // Módulo para guardar en archivo

class TestCaptcha {

    constructor(entrada) {


        this.captchas = [];        
        this.entrada = entrada;
        this.parser = parser; // Asigna el parser directamente sin `new`
    }

    ejecutar() {


        try {
            // Ejecuta el parser y obtiene la lista de captchas
            let captchaGenerado = this.parser.parse(this.entrada);

            // Verifica si captchaGenerado es un array
            if (Array.isArray(captchaGenerado)) {
                console.log("Lista de captchas generada correctamente:");

                // Itera sobre cada captcha en la lista y procesa los datos
                captchaGenerado.forEach((captcha, index) => {
                    console.log(captcha.generarHTML()); // Muestra el HTML de cada captcha

                    // Aquí puedes acceder a los atributos de cada captcha y realizar cualquier acción
                    // Ejemplo: console.log(captcha.someAttribute);
                });
            } else {
                console.log("Error: El resultado del parser no es una lista de captchas.");
            }
        } catch (error) {
            console.error("Error al parsear la entrada:", error);
        }

    }

    crearCaptcha(idTrivia, nombre, head, body) {

        const nuevoCaptcha = new Captcha(idTrivia, nombre, head, body); // Crear instancia de Captcha


        this.captchas.push(nuevoCaptcha); // Guardarlo en la lista
        return nuevoCaptcha; // Retornar el objeto creado si deseas usarlo inmediatamente
    }

    mostrarTodosLosCaptchasHTML() {
        this.captchas.forEach(captcha => {
            console.log(captcha.generarHTML()); // Llama a generarHTML de cada Captcha
        });
    }


    guardarEnArchivo(contenido, nombreArchivo) {
        fs.writeFile(nombreArchivo, contenido, (err) => {
            if (err) {
                console.error("Error al guardar el archivo:", err);
            } else {
                console.log(`El archivo ${nombreArchivo} ha sido guardado con éxito.`);
            }
        });
    }
}

// Ejemplo de uso
const entrada = `

captcha1.[ 
 {
    "ID_CAPTCHA": "captcha_matematico_1",
    "NOMBRE": "Captcha Matemático 1",
    "HEAD": [
      {
        "ETIQUETA": "link",
        "PARAMETRO": " href = \"https://www.mclibre.org/consultar/htmlcss/html/html-etiquetas.html\""
      },
      {
        "ETIQUETA": "title",
        "CONTENIDO": " Mi primer Captcha Matemático"
      }
    ],
    "BODY": {
      "BACKGROUND": " background-color:  #e5e6ea   ;",
      "ETIQUETAS": [
        {
          "ETIQUETA": "h1",
          "PARAMETRO": " style= \"  text-align:  center;   color: #7eff33  ;  \"",
          "CONTENIDO": " Mi primer Captcha Matemático"
        },
        {
          "ETIQUETA": "br"
        },
        {
          "ETIQUETA": "spam",
          "PARAMETRO": "id = \"hola_12\"  style= \"  color:  fuchsia  ;   font-family: ARIAL, ;   \"",
          "CONTENIDO": " HOLA MUNDO"
        },
        {
          "ETIQUETA": "button",
          "PARAMETRO": "style= \"  background-color: green  ;  \"",
          "CONTENIDO": " Procesar..."
        },
        {
          "ETIQUETA": "div",
          "CONTENIDO": " Procesar... ",
          "ETIQUETAS": [
            {
              "ETIQUETA": "spam",
              "PARAMETRO": "id = \"primer_div\"  class  = \"row \" id = \"hola_12\"  style= \"  color:  purple  ;  color:  fuchsia  ;   font-family: ARIAL, ;   \"",
              "CONTENIDO": " HOLA MUNDO"
            }
          ]
        }
      ]
    }
  }

]
`;

// Crear una instancia de TestCaptcha y ejecutar la prueba
const test = new TestCaptcha(entrada);
test.ejecutar();


