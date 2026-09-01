(function () {
  "use strict";
  window.__BRAND__ = {
    name: "QR3D Print",
    tagline: "Crea tu código QR y descárgalo listo para imprimir en 3D",

    styles: {
      clasico:    { label: "Clásico",    dots: "square",         corners: "square",        cornerDot: "square" },
      redondeado: { label: "Redondeado", dots: "rounded",        corners: "extra-rounded", cornerDot: "dot"    },
      puntos:     { label: "Puntos",     dots: "dots",           corners: "dot",            cornerDot: "dot"    },
      elegante:   { label: "Elegante",   dots: "classy-rounded", corners: "extra-rounded",  cornerDot: "square" }
    },

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
      { icon: "🛍️", title: "Tiendas y ferias", text: "Un soporte de mesa en el mostrador con el QR a tu catálogo o tienda online." }
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
      }
    ],

    contact: { email: "hola@qr3dprint.com" }
  };
})();
