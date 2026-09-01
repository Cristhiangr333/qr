(function () {
  "use strict";
  window.__BRAND__ = {
    name: "QR3D Print",
    tagline: "Crea tu código QR y descárgalo listo para imprimir en 3D",

    styles: {
      clasico:    { label: "Clásico",    dots: "square",         corners: "square",        cornerDot: "square" },
      redondeado: { label: "Redondeado", dots: "rounded",        corners: "extra-rounded", cornerDot: "dot"    },
      puntos:     { label: "Puntos",     dots: "dots",           corners: "dot",            cornerDot: "dot"    },
      elegante:   { label: "Elegante",   dots: "classy-rounded", corners: "extra-rounded",  cornerDot: "square" },
      cristal:    { label: "Cristal",    dots: "classy",         corners: "dot",            cornerDot: "dot"    },
      bloques:    { label: "Bloques",    dots: "square",         corners: "extra-rounded",  cornerDot: "square" },
      suave:      { label: "Suave",      dots: "extra-rounded",  corners: "extra-rounded",  cornerDot: "dot"    },
      moderno:    { label: "Moderno",    dots: "classy-rounded", corners: "dot",            cornerDot: "square" },
      pixel:      { label: "Píxel",      dots: "square",         corners: "square",         cornerDot: "dot"    },
      burbujas:   { label: "Burbujas",   dots: "dots",           corners: "extra-rounded",  cornerDot: "dot"    },
      fluido:     { label: "Fluido",     dots: "classy",         corners: "extra-rounded",  cornerDot: "dot"    },
      angular:    { label: "Angular",    dots: "square",         corners: "dot",            cornerDot: "square" },
      organico:   { label: "Orgánico",   dots: "extra-rounded",  corners: "dot",            cornerDot: "dot"    },
      retro:      { label: "Retro",      dots: "classy",         corners: "square",         cornerDot: "square" },
      minimal:    { label: "Minimal",    dots: "rounded",        corners: "square",         cornerDot: "square" },
      futurista:  { label: "Futurista",  dots: "classy-rounded", corners: "square",         cornerDot: "dot"    }
    },

    backgroundShapes: [
      { key: "cuadrado",   label: "Cuadrado",   icon: "⬛" },
      { key: "redondeado", label: "Redondeado", icon: "▢" },
      { key: "circular",   label: "Circular",   icon: "⬤" },
      { key: "hexagonal",  label: "Hexagonal",  icon: "⬡" }
    ],

    backgroundPatterns: [
      { key: "ninguno", label: "Ninguno",  icon: "—" },
      { key: "puntos",  label: "Puntos",   icon: "⣿" },
      { key: "rayas",   label: "Rayas",    icon: "▤" },
      { key: "cuadros", label: "Cuadros",  icon: "▦" },
      { key: "olas",    label: "Olas",     icon: "〰" },
      { key: "confeti", label: "Confeti",  icon: "✦" }
    ],

    themePresets: [
      { key: "restaurante",  label: "Restaurante Clásico", style: "elegante",  base: "#F7F1E6", code: "#2B1B12", frame: "barra-abajo", frameText: "VER CARTA",           shape: "redondeado", pattern: "ninguno" },
      { key: "boda",         label: "Boda Romántica",      style: "fluido",    base: "#FFF6F6", code: "#8A3B4B", frame: "burbuja",     frameText: "CONFIRMA AQUÍ",        shape: "circular",   pattern: "ninguno" },
      { key: "cumple",       label: "Fiesta de Cumpleaños",style: "burbujas",  base: "#FFF7E8", code: "#E0562A", frame: "cinta-esquina", frameText: "¡CELEBRA!",         shape: "redondeado", pattern: "confeti" },
      { key: "neon",         label: "Neón Urbano",         style: "futurista", base: "#111017", code: "#39FF88", frame: "barra-arriba", frameText: "ESCANÉAME",         shape: "cuadrado",   pattern: "rayas" },
      { key: "navidad",      label: "Navidad",             style: "clasico",   base: "#FBF7F2", code: "#1F5C3F", frame: "cinta-esquina", frameText: "¡FELICES FIESTAS!", shape: "redondeado", pattern: "confeti" },
      { key: "halloween",    label: "Halloween",           style: "angular",   base: "#151014", code: "#F17A1D", frame: "burbuja",     frameText: "TRUCO O TRATO",       shape: "cuadrado",   pattern: "puntos" },
      { key: "byn",          label: "Blanco y Negro",      style: "minimal",   base: "#FFFFFF", code: "#0A0A0A", frame: "ninguno",     frameText: "ESCANÉAME",           shape: "cuadrado",   pattern: "ninguno" },
      { key: "cafe",         label: "Café de Barrio",      style: "retro",     base: "#F1E7D8", code: "#5B3A29", frame: "barra-abajo", frameText: "PIDE AQUÍ",           shape: "redondeado", pattern: "ninguno" },
      { key: "boutique",     label: "Boutique Rosa",       style: "suave",     base: "#FFF2F6", code: "#B23A6B", frame: "burbuja",     frameText: "SÍGUENOS",            shape: "circular",   pattern: "ninguno" },
      { key: "tech",         label: "Tech Azul",           style: "pixel",     base: "#0E1420", code: "#4EA1FF", frame: "barra-abajo", frameText: "MÁS INFO",            shape: "cuadrado",   pattern: "cuadros" },
      { key: "eco",          label: "Eco Verde",           style: "organico",  base: "#F2F7ED", code: "#2F6B3C", frame: "ninguno",     frameText: "ESCANÉAME",           shape: "hexagonal",  pattern: "ninguno" },
      { key: "vintage",      label: "Vintage Sepia",       style: "retro",     base: "#EFE3CC", code: "#6B4A2B", frame: "cinta-esquina", frameText: "DESCUBRE MÁS",      shape: "redondeado", pattern: "rayas" },
      { key: "lujo",         label: "Lujo Dorado",         style: "elegante",  base: "#141212", code: "#D4AF37", frame: "burbuja",     frameText: "RESERVA AQUÍ",        shape: "circular",   pattern: "ninguno" },
      { key: "deportivo",    label: "Deportivo Rojo",      style: "bloques",   base: "#FFFFFF", code: "#D01F2B", frame: "cinta-esquina", frameText: "¡ÚNETE!",           shape: "cuadrado",   pattern: "rayas" },
      { key: "panaderia",    label: "Panadería Artesanal", style: "moderno",   base: "#FBF3E7", code: "#8A5A2E", frame: "barra-abajo", frameText: "VER CARTA",           shape: "redondeado", pattern: "puntos" },
      { key: "barberia",     label: "Barbería Retro",      style: "angular",   base: "#161513", code: "#C79A4B", frame: "cinta-esquina", frameText: "RESERVA AQUÍ",      shape: "cuadrado",   pattern: "ninguno" },
      { key: "yoga",         label: "Yoga Zen",            style: "organico",  base: "#F4F1EA", code: "#6B7F6A", frame: "ninguno",     frameText: "ESCANÉAME",           shape: "circular",   pattern: "olas" },
      { key: "sanvalentin",  label: "San Valentín",        style: "burbujas",  base: "#FFEFF2", code: "#C6294A", frame: "burbuja",     frameText: "TE QUIERO",           shape: "circular",   pattern: "confeti" },
      { key: "playa",        label: "Playa de Verano",     style: "suave",     base: "#EAF6F6", code: "#0E7C86", frame: "barra-arriba", frameText: "RESERVA TU MESA",   shape: "redondeado", pattern: "olas" },
      { key: "otono",        label: "Otoño Cálido",        style: "fluido",    base: "#FBF0E4", code: "#B5541E", frame: "cinta-esquina", frameText: "VER MENÚ",         shape: "redondeado", pattern: "confeti" },
      { key: "clinica",      label: "Clínica y Salud",     style: "minimal",   base: "#F2F8F7", code: "#137A6F", frame: "ninguno",     frameText: "PIDE TU CITA",        shape: "cuadrado",   pattern: "ninguno" },
      { key: "coctel",       label: "Bar de Cócteles",     style: "cristal",   base: "#171018", code: "#C89B3C", frame: "burbuja",     frameText: "VER CARTA",           shape: "circular",   pattern: "ninguno" },
      { key: "floristeria",  label: "Floristería",         style: "puntos",    base: "#FBF3F6", code: "#7A4869", frame: "cinta-esquina", frameText: "PIDE A DOMICILIO", shape: "redondeado", pattern: "puntos" },
      { key: "startup",      label: "Startup Morado",      style: "futurista", base: "#F4F1FB", code: "#5B31D6", frame: "barra-abajo", frameText: "MÁS INFO",           shape: "cuadrado",   pattern: "cuadros" }
    ],

    framePresets: [
      { key: "ninguno",       label: "Sin marco",       icon: "—" },
      { key: "barra-arriba",  label: "Barra arriba",    icon: "⬒" },
      { key: "barra-abajo",   label: "Barra abajo",     icon: "⬓" },
      { key: "cinta-esquina", label: "Cinta esquina",   icon: "◹" },
      { key: "burbuja",       label: "Burbuja",         icon: "💬" }
    ],

    ctaPresets: [
      "ESCANÉAME", "PIDE AQUÍ", "VER CARTA", "RESERVA AQUÍ",
      "DÉJANOS TU RESEÑA", "CONÉCTATE AL WIFI", "SÍGUENOS", "MÁS INFO"
    ],

    colorPresets: [
      { base: "#F4F1EA", code: "#1B1B22", label: "Crema / Grafito" },
      { base: "#FFFFFF", code: "#0F172A", label: "Blanco / Azul noche" },
      { base: "#F2F2F2", code: "#B45309", label: "Gris claro / Terracota" },
      { base: "#EAF4EE", code: "#14532D", label: "Menta / Verde bosque" },
      { base: "#FDF2F8", code: "#9D174D", label: "Rosa claro / Granate" },
      { base: "#111111", code: "#F5C518", label: "Negro / Dorado" }
    ],

    howItWorks: [
      {
        title: "1. Pega tu enlace",
        text: "Pega la URL que quieras codificar: la carta de tu restaurante, tu perfil de Google, tu Instagram, tu WiFi o cualquier web. El QR se genera al instante."
      },
      {
        title: "2. Personaliza el diseño",
        text: "Elige el estilo de los puntos, dos colores y añade tu logo o un emoji en el centro. Todo se actualiza en vivo, en la vista 2D y en la vista 3D."
      },
      {
        title: "3. Descarga y listo",
        text: "Descárgalo como imagen (PNG/SVG) para tus redes o impresos, o como archivo 3MF listo para tu impresora 3D — con los dos colores ya guardados dentro."
      }
    ],

    useCases: [
      { icon: "🍽️", title: "Cartas de restaurante", text: "Un soporte de mesa con tu QR a la carta digital, en la mesa de cada cliente." },
      { icon: "⭐", title: "\"Déjanos una reseña\"", text: "Un soporte junto a la caja que lleva directo a tu ficha de Google para pedir reseñas." },
      { icon: "🔑", title: "Llaveros para eventos", text: "Llaveros con QR a la web de tu boda, evento o negocio — recuerdo y publicidad a la vez." },
      { icon: "📶", title: "WiFi para alojamientos", text: "Una placa de pared con el QR de la WiFi de tu alojamiento turístico, sin dar la contraseña en voz alta." },
      { icon: "🏋️", title: "Gimnasios y estudios", text: "Un QR al horario de clases o a la reserva de sesiones, en la entrada del local." },
      { icon: "🛍️", title: "Tiendas y ferias", text: "Un soporte de mesa en el mostrador con el QR a tu catálogo o tienda online." },
      { icon: "🧲", title: "Imanes de nevera", text: "Un imán con el QR de tu carta a domicilio o tu catálogo, para pegar en la nevera del cliente." },
      { icon: "🥤", title: "Posavasos personalizados", text: "Posavasos con QR a tu carta de bebidas, tu wifi o tus redes, para bares y cafeterías." }
    ],

    faqs: [
      {
        q: "¿Necesito instalar algún programa para imprimir el archivo 3MF?",
        a: "No. El archivo 3MF se abre directamente en el programa que ya usas con tu impresora (Bambu Studio, PrusaSlicer, OrcaSlicer o Cura). Los dos colores que elegiste en la web ya vienen guardados dentro del archivo."
      },
      {
        q: "¿Necesito una impresora 3D con dos extrusores o cambio de filamento?",
        a: "Sí, para que el color del QR contraste con la base necesitas una impresora que pueda imprimir con dos colores o filamentos (AMS, cambiador de filamento o pausa manual para cambiar de color). Si tu impresora solo tiene un color, puedes descargar la versión STL e imprimir solo el relieve, o pintar el código a mano después."
      },
      {
        q: "¿El QR impreso en 3D se puede escanear con el móvil?",
        a: "Sí, siempre que el contraste entre los dos colores sea suficiente (te avisamos en la web si el contraste es demasiado bajo) y el módulo del código no sea demasiado pequeño para tu impresora. Recomendamos siempre probar a escanear la vista previa antes de imprimir muchas unidades."
      },
      {
        q: "¿Qué formato elijo: soporte de mesa, llavero o placa de pared?",
        a: "El soporte de mesa es ideal para cartas de restaurante o para pedir reseñas junto a la caja. El llavero funciona bien como detalle para eventos o como llavero comercial con tu QR. La placa de pared es la mejor opción para WiFi de alojamientos o señalización fija."
      },
      {
        q: "¿Puedo poner el nombre de mi negocio en el objeto 3D?",
        a: "Sí, los tres formatos permiten añadir un texto corto (por ejemplo el nombre de tu negocio) que se imprime en relieve, en el mismo color que el código."
      },
      {
        q: "¿Qué pasa si mi impresora es antigua y no lee 3MF?",
        a: "Puedes descargar también la versión en STL, pensada para impresoras y programas más antiguos. En ese caso tendrás que asignar tú el color a cada pieza dentro del programa de tu impresora."
      },
      {
        q: "¿Mis datos o el enlace que pego se guardan en algún servidor?",
        a: "No. Todo el diseño, tanto el QR como el modelo 3D, se genera en tu propio navegador. El enlace que pegas nunca sale de tu dispositivo ni se envía a ningún servidor."
      },
      {
        q: "¿Cuánto tarda en imprimirse?",
        a: "Depende del tamaño y del formato elegido, pero un soporte de mesa o una placa pequeña suele tardar entre 45 minutos y 2 horas con ajustes estándar."
      },
      {
        q: "¿Puedo usar un color degradado en el QR?",
        a: "Sí, en la imagen (PNG/SVG) puedes elegir un degradado de dos colores para el código. En la descarga 3D esto no aplica: el modelo imprime con el color sólido principal que hayas elegido, porque cada pieza del 3MF solo admite un color de filamento."
      },
      {
        q: "¿Qué diferencia hay entre el imán, el posavasos y la placa redonda?",
        a: "El imán es una pieza fina y pequeña pensada para pegarle un disco magnético por detrás. El posavasos es un disco algo más grueso y ancho, pensado para apoyar una taza o vaso. La placa redonda es como la placa de pared pero circular, pensada para fijarse con cinta de montaje de doble cara en vez de agujeros."
      }
    ],

    contact: { email: "hola@qr3dprint.com" }
  };
})();
