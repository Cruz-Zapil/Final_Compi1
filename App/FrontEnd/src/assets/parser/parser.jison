%{

const Captcha = require('./Captcha');

    let captchas = [];

    // Variables globales
    let head = "";
    let body = "";
    let etiqueta = "";
    let parametro = "";
    let contenido = "";
    let arrayListEtiqueta = [];

    // Función auxiliar para construir etiquetas HTML
    function construirEtiqueta(etiqueta, parametro, contenido) {
        let resultado = "";
        if (etiqueta) {
            resultado = "<" + etiqueta;
            resultado += parametro ? " " + parametro : "";
            resultado += ">";
        }
        if (contenido) {
            resultado += contenido;
        }
        if (etiqueta) {
            resultado += "</" + etiqueta + ">";
        }
        return resultado;
    }



%}



%lex
%%
// Definir los tokens de léxico

\s+                                /* Ignorar espacios en blanco */
"captcha1."                        return 'CAPTCHA1'
"["                                return 'CORCHETE_IZQ'
"]"                                return 'CORCHETE_DER'
"{"                                return 'LLAVE_IZQ'
"}"                                return 'LLAVE_DER'
"\""                               return 'COMILLAS'
","                                return 'COMA'
":"                                return 'DOS_PUNTO'
";"                                return 'PUNTO_COMA'
"."                                return 'PUNTO'
"="                                return 'IGUAL'
" "                                return 'ESPACIO'
"?"                                return 'INTERRO'
"¿"                                return 'INTERRO_INV'
"\//"                              return 'DIAGONAL'


"ID_CAPTCHA"                       return 'ID_CAPTCHA'
"NOMBRE"                           return 'NOMBRE'
"HEAD"                             return 'HEAD'
"BODY"                             return 'BODY'
"ETIQUETA"                         return 'ETIQUETA'
"ETIQUETAS"                        return 'ETIQUETAS'
"PARAMETRO"                        return 'PARAMETRO'
"CONTENIDO"                        return 'CONTENIDO'
"BACKGROUND"                       return 'BACKGROUND'

"#"([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})  return 'COLOR'

[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\?\¿\+\-\*\(\)\.,;: \t_]+             return 'IDENTIFICADOR'

([a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\?\¿\+\-\*\(\)\.,;:\= \t_]+[^]+)+                return 'PARAMET'


[^]                                return 'SIMBOLO'
<<EOF>>                            return 'EOF'



/lex

%%


start: json EOF { return $1; }
    ;

json: CAPTCHA1 CORCHETE_IZQ captcha CORCHETE_DER{ $$ = captchas; }
    ;

captcha: LLAVE_IZQ listaCapt LLAVE_DER
    ;

listaCapt: capt
    | listaCapt COMA capt
    ;

capt: idCapt COMA nombCapt COMA headCapt COMA bodyCapt
    {  tmpCaptcha = new Captcha($1, $2.nombre, head, body);

        captchas.push(tmpCaptcha);

        
     }
    ;

idCapt: COMILLAS ID_CAPTCHA COMILLAS DOS_PUNTO COMILLAS IDENTIFICADOR COMILLAS
    { /* Acción semántica para idCapt */ }
    ;

nombCapt : COMILLAS NOMBRE COMILLAS DOS_PUNTO COMILLAS IDENTIFICADOR COMILLAS
    { /* Acción semántica para nombCapt */ }
    ;

headCapt : COMILLAS HEAD COMILLAS DOS_PUNTO CORCHETE_IZQ listaElementos CORCHETE_DER
    ;

listaElementos : LLAVE_IZQ  elemento LLAVE_DER
    | listaElementos COMA LLAVE_IZQ elemento LLAVE_DER
    ;

elemento :  claveVal  {
        let tiquetaHTML = construirEtiqueta(etiqueta, parametro, contenido);
        head += tiquetaHTML;
        
        etiqueta = parametro = contenido = "";
    }
    | elemento COMA claveVal {

        let tiquetaHTML = construirEtiqueta(etiqueta, parametro, contenido);
        head += tiquetaHTML;

        etiqueta = parametro = contenido = "";
    }
    ;

claveVal : COMILLAS ETIQUETA COMILLAS DOS_PUNTO COMILLAS IDENTIFICADOR COMILLAS { etiqueta = $6; }
    | COMILLAS PARAMETRO COMILLAS DOS_PUNTO COMILLAS textos COMILLAS { parametro = $6; }
    | COMILLAS CONTENIDO COMILLAS DOS_PUNTO COMILLAS IDENTIFICADOR COMILLAS { contenido = $6; }
    ;

bodyCapt : COMILLAS BODY COMILLAS DOS_PUNTO LLAVE_IZQ listaBody LLAVE_DER
    ;

listaBody : bodyElemento
    | listaBody COMA bodyElemento
    ;

bodyElemento : COMILLAS BACKGROUND COMILLAS DOS_PUNTO COMILLAS textos COMILLAS { /* Acción semántica para el fondo */ }
    | COMILLAS ETIQUETAS COMILLAS DOS_PUNTO CORCHETE_IZQ listaEtiquetas CORCHETE_DER { /* Acción semántica para etiquetas */ }
    ;

listaEtiquetas : LLAVE_IZQ etiBody LLAVE_DER {
        let etiquetaHTML = construirEtiqueta(etiqueta, parametro, contenido);
        body += etiquetaHTML;
        etiqueta = parametro = contenido = "";
    }
    | listaEtiquetas COMA LLAVE_IZQ etiBody LLAVE_DER {
        let etiquetaHTML = construirEtiqueta(etiqueta, parametro, contenido);
        body += etiquetaHTML;
        etiqueta = parametro = contenido = "";
    }
    ;

etiBody : etiquetaBody { $$ = $1; }
    | etiBody COMA etiquetaBody {  $$ = $1 + $3; };



etiquetaBody : COMILLAS ETIQUETA COMILLAS DOS_PUNTO COMILLAS IDENTIFICADOR COMILLAS { etiqueta = $6; }
    | COMILLAS PARAMETRO COMILLAS DOS_PUNTO COMILLAS textos COMILLAS { parametro = $6; }
    | COMILLAS CONTENIDO COMILLAS DOS_PUNTO COMILLAS IDENTIFICADOR COMILLAS { contenido = $6; }
    | COMILLAS ETIQUETAS COMILLAS DOS_PUNTO CORCHETE_IZQ listaEtiquetas CORCHETE_DER { /* Acción para etiquetas anidadas */ }
    ;


textos : txts { $$ = $1; }
    | textos  txts { $$ = $1 + $2; }
    ;

txts : IDENTIFICADOR { $$ = $1; }
    |  PARAMET { $$ = $1; }
    | IGUAL { $$ = $1; }
    | COMILLAS { $$ = $1; }
    | ESPACIO { $$ = $1; }
    | INTERRO { $$ = $1; }
    | INTERRO_INV { $$ = $1; }
    | DIAGONAL { $$ = $1; }
    | SIMBOLO { $$ = $1; }
    | COLOR { $$ = $1; }
    ;

%%
