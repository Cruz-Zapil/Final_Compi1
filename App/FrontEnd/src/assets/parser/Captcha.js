class Captcha {

    constructor(idTrivia, nombre, head, body) {
        this.idTrivia = idTrivia || ""; // Identificador del captcha
        this.nombre = nombre || "Sin nombre"; // Nombre del captcha
        this.head = head || "";  // Contenido del head
        this.body = body || "";  // Contenido del body
    }

    // Representación en cadena
    toString() {
        return `Captcha: ${this.idTrivia}, Nombre: ${this.nombre}, Head: ${this.head}, Body: ${this.body}`;
    }

    // Genera la estructura HTML completa
    generarHTML() {
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${this.nombre}</title>
                ${this.head || "<!-- Head vacío -->"}
            </head>
            <body>
                ${this.body || "<!-- Body vacío -->"}
            </body>
            </html>
        `;
    }
}


module.exports = Captcha;


