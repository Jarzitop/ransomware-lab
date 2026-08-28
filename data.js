// ============================================================
// DATOS DEL REGALO — edita este archivo para actualizar contenido
// ============================================================

// Fecha en que empezó la relación (para el contador de "días juntos"
// y como coordenada de la Carta 0)
const FECHA_INICIO = "2026-02-27";

// Las 7 cartas. Cada una es un punto en la constelación.
// fecha: se usa para la etiqueta tipo coordenada y para ordenarlas.
// fotos: rutas dentro de assets/fotos/ — reemplaza por las tuyas.
// spotifyUrl: pega aquí el link de "compartir > copiar link" de Spotify
//             (se convierte automáticamente en reproductor embebido).
const CARTAS = [
  {
    id: 0,
    mes: "Mes 0",
    titulo: "El día que te elegí",
    fecha: "2026-02-27",
    texto: `El día que te pedí que fueras mi novia fue el día que más seguro he estado de una decisión en los últimos años. No fue solo pedirte algo, fue elegir vivir este capítulo de mi vida contigo. Y así como te elegí ese día, hoy, seis meses después, te sigo eligiendo igual.`,
    fotos: ["assets/fotos/mes0-1.jpg", "assets/fotos/mes0-2.jpg"],
    spotifyUrl: null
  },
  {
    id: 1,
    mes: "Mes 1",
    titulo: "París",
    fecha: "2026-03-27",
    texto: `Empezaste a decírmelo con cosas pequeñas, como que me contaras tu día sin que te preguntara, o la primera vez que te dije que amaba tu cabello y te dio pena. Pero fue en París donde lo confirmé del todo. Fue una semana dura, con el horario en contra y la distancia pesando, y hubo momentos feos entre los dos, pero esa semana dura fue justo lo que me hizo dar cuenta de que me estaba enamorando de ti, y de que había hecho la mejor decisión pidiéndote que fueras mi novia. Porque antes, en momentos así, yo ya habría empezado a soltar la relación por dentro, sin decir nada, solo alejándome poco a poco, y esta vez no quise, me quedé, y ahí entendí que lo que me dolía no eras tú, era yo cargando cosas de antes. Fuiste la primera persona por la que sentí que quería quedarme a pelear por algo que valía la pena.`,
    fotos: ["assets/fotos/mes1-1.jpg", "assets/fotos/mes1-2.jpg"],
    spotifyUrl: null
  },
  {
    id: 2,
    mes: "Mes 2",
    titulo: "Guerra de pulgares",
    fecha: "2026-04-27",
    texto: `Después de París peleamos mucho, casi por cualquier cosa. Pero hay un día que no se me olvida. Uno de esos en los que no querías hablar con nadie ni verme, ibas a faltar a clase. No te reclamé nada, solo quise subirte el ánimo. Jugamos guerra de pulgares y nos pusimos a leernos las manos con una inteligencia artificial, tonterías que terminaron recargándote la energía, y hasta fuiste a clase. Ese día entendí que prefería cuidarte a tener razón. Esa lección se hizo aún más clara cuando pasó lo de tus papás. Verte pasar por algo así, en medio de un mes que ya venía pesado entre nosotros, me hizo entender que muchas de nuestras peleas no valían la pena. Desde ahí quise estar para ti siempre, estuviéramos bien o mal, y cambié la forma de pelear contigo, para que ni en medio de una pelea dejáramos de cuidarnos.`,
    fotos: ["assets/fotos/mes2-1.jpg", "assets/fotos/mes2-2.jpg"],
    spotifyUrl: null
  },
  {
    id: 3,
    mes: "Mes 3",
    titulo: "Ratatouille",
    fecha: "2026-05-27",
    texto: `Fuimos a Sabores de Película a ver Ratatouille, y ahí confirmé lo increíble que es comer contigo, tanto que ahora cada vez que como algo rico deseo que estuvieras ahí comiendo conmigo, te amo. Te compré ese bolso que todavía usas tanto, y ese mes empecé a soñar contigo, para mí es una señal de que te deseo hasta en sueños, no solo cuando el sueño sube de tono, sino con otras cosas que a veces no te cuento porque me da pena, aunque la verdad me da más pena sonar cacorro que contarte que soñé que te hacía el amor. Pero lo que más recuerdo son las milhojas que le llevé a tus dos papás. Tu papá preguntó quién las había mandado, y dijiste que un amigo. Yo te dije que bueno, al menos sí somos amigos. Te reíste como solo tú te ríes, y nada más alejado de la realidad. A los pocos días te acompañé a conocerlos de verdad, y fue raro, chistoso e incómodo, todo junto, pero salió bien, y sentí que cruzamos una barrera los dos, que ya nada de esto era solo nuestro, sino algo real frente al mundo.`,
    fotos: ["assets/fotos/mes3-1.jpg", "assets/fotos/mes3-2.jpg"],
    spotifyUrl: null
  },
  {
    id: 4,
    mes: "Mes 4",
    titulo: "El día que se regaló solo",
    fecha: "2026-06-27",
    texto: `Ese día te vi de la nada, habías venido a acompañar a tu papá a hacer una vuelta, y antes tenías una cita médica aquí en mi ciudad, así que nos vimos casi sin planearlo, y para mí fue una locura buena, como si el día se hubiera regalado solo. Comimos en La Trattoria del Teatro, riquísimo, y después caminamos y caminamos sin parar, como si lleváramos meses queriendo un día así de simple. Me acompañaste a comprar ropa, y hoy, escribiendo esto, todavía tengo puesta la camisa que compré esa tarde. Pasamos por Juan Valdez, hablé con tu papá un microsegundo y me dio un poco de miedo jajaja, cuidamos nuestras mascotas virtuales, y hasta descubrimos que compartimos el mismo odio por Petro. Otro día, me desperté pensando en ti después de uno de esos sueños que me da pena contarte, y te di las flores más lindas que te he dado, solo porque no dejaba de pensar en ti, y también tuvimos nuestras propias discusiones sobre nosotros, sobre lo que somos, y ahí entendí algo: a pesar de los problemas y las vainas que hemos tenido, tú y yo siempre brillamos, siempre somos nosotros. Encuentras maneras de hacerme feliz y de ayudarme a crecer, y yo trato de sacarte una sonrisa y consentirte siempre, y es raro, porque en el momento me enfrascaba en lo malo, y hoy, mirando atrás, solo puedo pensar en lo bonito. Te amo.`,
    fotos: ["assets/fotos/mes4-1.jpg", "assets/fotos/mes4-2.jpg"],
    spotifyUrl: null
  },
  {
    id: 5,
    mes: "Mes 5",
    titulo: "Lo que seremos",
    fecha: "2026-07-27",
    texto: `Este mes empezaste a venir más seguido a mi casita, dormimos juntos, vimos series, comimos una empanada gigante, fuimos a Olivia con mis papás, y hasta descubrimos que a los dos nos apasiona la selección, la seguimos hasta donde pudimos y casi nos compramos camisetas que solo iban a durar una semana porque nos sacaron del mundial. Compramos ropa juntos, hicimos de todo, y en un solo mes hicimos exactamente lo que somos, lo que queremos: despilfarrar en ferias, comprar ropa, tomarnos unos coctelitos, comer comida italiana, y arruncharnos juntos. Literalmente así va a ser nuestra vida cuando nos casemos. Te amo.`,
    fotos: ["assets/fotos/mes5-1.jpg", "assets/fotos/mes5-2.jpg"],
    spotifyUrl: null
  },
  {
    id: 6,
    mes: "Mes 6",
    titulo: "Seis meses",
    fecha: "2026-08-27",
    texto: `Esto sigue, seguimos escribiendo nuestra historia, nuestra vida, lo que yo siento y lo que tú sientes, y no sé bien a dónde vamos a llegar, solo sé que elegí vivir este capítulo de mi vida contigo, y te sigo eligiendo cada día que me levanto, cada día que peleamos, cada día que nos besamos, cada vez que pasa cualquier cosa, elijo estar contigo, y estoy seguro de que quiero seguir haciéndolo, al menos otros seis meses. Te amo, Mari.`,
    fotos: ["assets/fotos/mes6-1.jpg", "assets/fotos/mes6-2.jpg"],
    spotifyUrl: null
  }
];

// El puzzle: leer cada carta desbloquea UNA pista sobre OTRA carta.
// "revelaEnCarta": la carta cuya lectura desbloquea esta pista.
// "letra": la letra que aporta a la respuesta final (en orden).
// La respuesta final normaliza mayúsculas/acentos/espacios al validar.
const RESPUESTA_FINAL = "TE ELIJO";

const PISTAS = [
  {
    orden: 1,
    letra: "T",
    revelaEnCarta: 0,
    dificultad: "fácil",
    texto: "Fácil para empezar: ve al mes en que caminamos sin parar después de comer pasta italiana. Busca el nombre del restaurante y toma su primera letra."
  },
  {
    orden: 2,
    letra: "E",
    revelaEnCarta: 1,
    dificultad: "media",
    texto: "Busca la carta en la que imaginamos cómo sería nuestra vida juntos. Entre series, compras y planes aparece algo gigante que comimos. Su primera letra es la que necesitas."
  },
  {
    orden: 3,
    letra: "E",
    revelaEnCarta: 4,
    dificultad: "media",
    texto: "Vuelve al mes en que una tontería con nuestras manos terminó cambiándote el ánimo. Busca qué fue lo que logramos recargarte y quédate con la primera letra de esa palabra."
  },
  {
    orden: 4,
    letra: "L",
    revelaEnCarta: 2,
    dificultad: "difícil",
    texto: "La siguiente letra está en el punto más lejano de la constelación. Allí repito una elección diaria y, justo antes de nombrarla, aparece una acción que ocurre al comenzar cada día. Encuentra esa palabra y toma su inicial."
  },
  {
    orden: 5,
    letra: "I",
    revelaEnCarta: 5,
    dificultad: "media",
    texto: "Busca la carta donde una película terminó hablando también de nosotros. Al comienzo describo cómo es comer contigo usando una sola palabra. Su inicial es la quinta letra."
  },
  {
    orden: 6,
    letra: "J",
    revelaEnCarta: 3,
    dificultad: "media",
    texto: "Ve al día que apareció casi sin planearlo. Después de caminar y comprar ropa, pasamos por un lugar de café donde hablé apenas un instante con tu papá. Usa la inicial del nombre de ese lugar."
  },
  {
    orden: 7,
    letra: "O",
    revelaEnCarta: 6,
    dificultad: "media",
    texto: "Para cerrar, busca el mes en que ya hacíamos planes que parecían una miniatura de nuestra vida futura. Allí fuimos a comer con mis papás. La inicial del restaurante completa la respuesta."
  }
];

// Texto de la portada (pantalla tipo libro, se avanza tocando/Enter)
const PORTADA = [
  "Hola, amor. ¿Cómo vas?",
  "Este es tu regalo de seis meses. Te amo mucho. Te lo manda tu novio, con mucho amor.",
  "Bienvenida a un pequeño resumen de nuestra historia, que todavía se está escribiendo. Espero te guste.",
  "No solo hay amor aquí. También hay un puzzle para ti. Espero que lo disfrutes, y que te demores resolviéndolo.",
  "Con amor, tu novio."
];

// BORRADOR de la carta final — escrito con el mismo tono de tus 7 cartas.
// Cámbialo por completo, es solo un punto de partida.
const CARTA_FINAL = `Llegaste hasta acá, y eso ya dice algo de ti: no te rindes fácil, ni siquiera con un rompecabezas que te dejé a propósito difícil.

Seis meses no es mucho tiempo si lo cuentas en calendario, pero si lo cuento en todo lo que ya vivimos, en las peleas de las que aprendimos, en Sabores de Película, en Juan Valdez, en las noches en mi casita, en las cosas pequeñas que ahora son nuestras, seis meses se sienten como una vida entera empezando.

No sé exactamente qué van a traer los próximos meses. No sé si van a ser fáciles o si vamos a volver a pelear por tonterías. Pero sí sé una cosa, y es la misma que escribí en la Carta 0: te elijo. Te elijo hoy, y quiero seguir eligiéndote, no porque sea perfecto o porque todo vaya a salir bien siempre, sino porque ya aprendí que contigo prefiero cuidar a tener razón.

Quiero que sigamos sumando meses a esta lista. Quiero más viajes, aunque nos toque pelear con el horario otra vez. Quiero más tardes despilfarrando en ferias, más comida italiana, más series en mi casita. Y sí, ya sé que lo decimos en broma, pero cada vez me suena menos a broma: quiero que un día, cuando nos casemos, esto sea exactamente lo que somos, multiplicado por todos los días que nos falten.

Feliz seis meses, Mari. Gracias por elegirme también a mí.

Te amo,
tu novio`;
