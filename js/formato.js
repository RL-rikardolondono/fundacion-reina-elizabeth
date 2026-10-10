/* Generador único del sitio de la Fundación Reina Elizabeth ONG.
   Lo usan el panel /admin y el armado inicial: convierte los datos (datos/*.json) en todas las páginas.
   Modelo replicado de ricardolondono.com (directiva general de webs de SkyNet Genesis). */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.Formato = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  var SITIO = 'https://fundacionreinaelizabeth.com';
  var VERSION = '3';
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  // Direcciones que no pueden usar los proyectos (ya son secciones fijas o redirecciones antiguas)
  var RESERVADAS = ['admin', 'css', 'js', 'img', 'datos', 'noticias', 'publicaciones', 'donar', 'contacto', '404', 'index', 'sitemap', 'robots', 'cname',
    'blog', 'prohibidoolvidar', 'lecciones-del-silencio', 'rostros-del-arte-sin-limites', 'rostros-del-arte-sin-limites-santa-marta',
    'rostros-del-arte-sin-limites-cienaga', 'propuesta-dialogos-generacionales'];

  var ICO = {
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zM20.5 3.5C18.2 1.2 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.4z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s-8-6.5-8-12a8 8 0 0 1 16 0c0 5.5-8 12-8 12z"/><circle cx="12" cy="10" r="3"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    skynet: '<svg viewBox="0 0 200 200" aria-hidden="true"><g stroke="#FFFFFF" stroke-linecap="round"><polygon points="100,42 150.2,71 150.2,129 100,158 49.8,129 49.8,71" fill="none" stroke-opacity=".35" stroke-width="6"/><path d="M100 100L100 42M100 100L150.2 71M100 100L150.2 129M100 100L100 158M100 100L49.8 129M100 100L49.8 71" stroke-width="8"/></g><g fill="#FFFFFF"><circle cx="150.2" cy="71" r="12"/><circle cx="150.2" cy="129" r="12"/><circle cx="100" cy="158" r="12"/><circle cx="49.8" cy="129" r="12"/><circle cx="49.8" cy="71" r="12"/></g><circle cx="100" cy="42" r="15" fill="#E0A21A"/><circle cx="100" cy="100" r="22" fill="#E0A21A"/></svg>'
  };

  /* ---------- Utilidades ---------- */
  function esc(t) {
    return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function enlazar(t) {
    t = esc(t);
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g, function (u) {
      var externo = u.indexOf(SITIO) !== 0;
      return '<a href="' + u + '"' + (externo ? ' target="_blank" rel="noopener"' : '') + '>' + u + '</a>';
    });
    return t;
  }
  // Texto del autor -> HTML: línea en blanco = párrafo; "## " = subtítulo; "- " = viñeta; **negrita**; enlaces automáticos.
  function textoAHtml(texto) {
    return String(texto || '').replace(/\r/g, '').split(/\n\s*\n/).map(function (b) {
      b = b.trim(); if (!b) return '';
      var lineas = b.split('\n');
      if (lineas.every(function (l) { return /^\s*[-•]\s+/.test(l); }))
        return '<ul>' + lineas.map(function (l) { return '<li>' + enlazar(l.replace(/^\s*[-•]\s+/, '')) + '</li>'; }).join('') + '</ul>';
      if (/^##\s+/.test(b) && lineas.length === 1) return '<h2>' + enlazar(b.replace(/^##\s+/, '')) + '</h2>';
      return '<p>' + lineas.map(enlazar).join('<br>') + '</p>';
    }).join('\n');
  }
  function textoPlano(texto, max) {
    var t = String(texto || '').replace(/^##\s+/gm, '').replace(/^\s*[-•]\s+/gm, '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
    if (max && t.length > max) t = t.slice(0, max).replace(/\s+\S*$/, '') + '…';
    return t;
  }
  function fechaLarga(iso) {
    if (!iso) return '';
    var p = String(iso).slice(0, 10).split('-'); if (p.length < 3) return '';
    return parseInt(p[2], 10) + ' de ' + MESES[parseInt(p[1], 10) - 1] + ' de ' + p[0];
  }
  function slugify(t) {
    return String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '');
  }
  function idYoutube(url) {
    var m = String(url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
    return m ? m[1] : '';
  }
  // Cada foto de galería tiene su miniatura en la subcarpeta /mini/ de la misma carpeta.
  function mini(ruta) { return String(ruta).replace(/\/([^\/]+)$/, '/mini/$1'); }
  function numWa(n) { return String(n || '').replace(/\D/g, '').replace(/^57(?=\d{10}$)/, ''); }
  function wa(sitio, msg) { return 'https://wa.me/57' + numWa((sitio.contacto || {}).whatsapp) + '?text=' + encodeURIComponent(msg); }
  function ordenarProyectos(lista) { return lista.slice().sort(function (a, b) { return (a.orden || 99) - (b.orden || 99); }); }
  function ordenarNoticias(lista) { return lista.slice().sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); }); }

  /* ---------- Armazón ---------- */
  function cabecera(sitio, datos, activo) {
    var items = [['inicio', '/', 'Inicio']];
    ordenarProyectos(datos.proyectos).forEach(function (p) { if (p.enMenu) items.push([p.slug, '/' + p.slug + '/', p.tituloCorto || p.titulo]); });
    if (datos.noticias.length) items.push(['noticias', '/noticias/', 'Noticias']);
    items.push(['publicaciones', '/publicaciones/', 'Publicaciones'], ['contacto', '/contacto/', 'Contacto']);
    var lis = items.map(function (m) {
      return '<li><a href="' + m[1] + '"' + (m[0] === activo ? ' class="activo" aria-current="page"' : '') + '>' + esc(m[2]) + '</a></li>';
    }).join('');
    return '<a class="salto" href="#contenido">Saltar al contenido</a>\n<header class="barra"><div class="wrap">' +
      '<a class="marca" href="/"><img src="/img/logo/logo-fundacion.png" alt="" width="44" height="44">' +
      '<span><b>' + esc(sitio.nombreCorto || sitio.nombre) + '</b><small>' + esc(sitio.lema) + '</small></span></a>' +
      '<button class="hamb" aria-label="Abrir menú" aria-expanded="false">&#9776;</button>' +
      '<ul class="menu">' + lis + '<li><a class="btn-donar' + (activo === 'donar' ? ' activo' : '') + '" href="/donar/">Donar</a></li></ul>' +
      '</div></header>';
  }

  function pie(sitio, datos, anio) {
    var c = sitio.contacto || {};
    var proyectos = ordenarProyectos(datos.proyectos).map(function (p) { return '<li><a href="/' + esc(p.slug) + '/">' + esc(p.titulo) + '</a></li>'; }).join('');
    return '<footer class="pie"><div class="wrap"><div class="cols">' +
      '<div><h4>' + esc(sitio.nombre) + '</h4><p>' + esc(sitio.descripcionPie) + '</p>' +
      (sitio.revista && sitio.revista.sitioWeb ? '<p>Entidad editora de la <a href="' + esc(sitio.revista.sitioWeb) + '" target="_blank" rel="noopener">' + esc(sitio.revista.titulo) + '</a>.</p>' : '') +
      (sitio.nit ? '<p>NIT ' + esc(sitio.nit) + '</p>' : '') + '</div>' +
      '<div><h4>Contacto</h4><ul>' +
      (c.direccion ? '<li>' + esc(c.direccion) + '</li>' : '') +
      (c.correo ? '<li><a href="mailto:' + esc(c.correo) + '">' + esc(c.correo) + '</a></li>' : '') +
      (c.whatsapp ? '<li><a href="' + wa(sitio, 'Hola, escribo desde la página de la Fundación Reina Elizabeth.') + '" target="_blank" rel="noopener">WhatsApp ' + esc(c.whatsapp) + '</a></li>' : '') +
      (c.instagram ? '<li><a href="' + esc(c.instagram) + '" target="_blank" rel="noopener">Instagram</a></li>' : '') +
      '</ul></div>' +
      '<div><h4>La Fundación</h4><ul>' + proyectos +
      (datos.noticias.length ? '<li><a href="/noticias/">Noticias</a></li>' : '') +
      '<li><a href="/publicaciones/">Publicaciones</a></li><li><a href="/donar/">Donar</a></li></ul></div>' +
      '</div><div class="legal"><span>© ' + anio + ' ' + esc(sitio.nombre) + ' · Santa Marta, Colombia · <a href="/admin/" rel="nofollow">Ingresar (equipo)</a></span>' +
      '<a class="skynet" href="https://skynetgenesis.com" target="_blank" rel="noopener">' + ICO.skynet +
      '<span>Sitio desarrollado por <span class="sn"><b>SKYNET</b> <i>GENESIS</i></span> · contacto@skynetgenesis.com · WhatsApp 304 437 5758</span></a>' +
      '</div></div></footer>' +
      (c.whatsapp ? '<a class="wa-flot" href="' + wa(sitio, 'Hola, escribo desde la página de la Fundación Reina Elizabeth.') + '" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">' + ICO.wa + '</a>' : '');
  }

  function documento(sitio, datos, op) {
    var anio = op.anio || new Date().getFullYear();
    var titulo = op.titulo ? op.titulo + ' – ' + sitio.nombre : sitio.nombre + ' – ' + sitio.lema;
    var imagen = SITIO + (op.imagen || '/img/logo/logo-fundacion.png');
    return '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '<title>' + esc(titulo) + '</title>\n<meta name="description" content="' + esc(op.descripcion) + '">\n' +
      (op.noindex ? '<meta name="robots" content="noindex">\n' : '') +
      '<link rel="canonical" href="' + SITIO + op.ruta + '">\n' +
      '<meta property="og:type" content="' + (op.tipo || 'website') + '">\n<meta property="og:site_name" content="' + esc(sitio.nombre) + '">\n' +
      '<meta property="og:title" content="' + esc(op.titulo || sitio.nombre) + '">\n<meta property="og:description" content="' + esc(op.descripcion) + '">\n' +
      '<meta property="og:url" content="' + SITIO + op.ruta + '">\n<meta property="og:image" content="' + esc(imagen) + '">\n<meta property="og:locale" content="es_CO">\n' +
      '<meta name="theme-color" content="#0B4F8A">\n<link rel="icon" href="/img/logo/logo-fundacion.png">\n' +
      '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      '<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Public+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">\n' +
      '<link rel="stylesheet" href="/css/style.css?v=' + VERSION + '">\n' + (op.extraHead || '') +
      '</head>\n<body>\n' + cabecera(sitio, datos, op.activo) + '\n<main id="contenido">\n' + op.cuerpo + '\n</main>\n' + pie(sitio, datos, anio) +
      '\n<script src="/js/main.js?v=' + VERSION + '"></script>\n</body>\n</html>\n';
  }

  function cab(eyebrow, titulo, texto, miga) {
    return '<section class="cab-pag"><div class="wrap">' +
      '<div class="miga"><a href="/">Inicio</a> › ' + miga + '</div>' +
      (eyebrow ? '<span class="eyebrow">' + esc(eyebrow) + '</span>' : '') +
      '<h1>' + esc(titulo) + '</h1>' + (texto ? '<p>' + esc(texto) + '</p>' : '') + '</div></section>';
  }

  // Recuadro «Apoye este proyecto» con la llave Bre-B
  function apoyo(sitio, proyecto) {
    if (!sitio.llave) return '';
    return '<div class="franja-donar mt"><div>' +
      '<span class="eyebrow">Apoye este proyecto</span><h2>Su aporte hace posible «' + esc(proyecto) + '»</h2>' +
      '<p>Puede donar desde la app de su banco o billetera con nuestra llave Bre-B. Después, envíenos el comprobante para agradecerle y contarle cómo se usó su aporte.</p>' +
      '<div class="botones"><a class="btn btn-wa" href="' + wa(sitio, 'Hola, hice (o quiero hacer) un aporte para el proyecto «' + proyecto + '» de la Fundación Reina Elizabeth.') + '" target="_blank" rel="noopener">' + ICO.wa + ' Enviar comprobante</a>' +
      '<a class="btn btn-borde" href="/donar/">Cómo donar</a></div></div>' +
      '<div class="mini-llave"><span>Llave Bre-B</span><b>' + esc(sitio.llave) + '</b>' +
      '<button class="btn btn-accion" data-copiar="' + esc(sitio.llave) + '" type="button">Copiar llave</button></div></div>';
  }

  function galeria(fotos, titulo) {
    if (!fotos || !fotos.length) return '';
    return '<div class="galeria">' + fotos.map(function (f, i) {
      return '<button type="button" data-full="' + esc(f) + '"><img src="' + esc(mini(f)) + '" alt="' + esc(titulo) + ', foto ' + (i + 1) + '" loading="lazy"></button>';
    }).join('') + '</div>';
  }

  function tarjetaProyecto(p) {
    return '<a class="tarjeta" href="/' + esc(p.slug) + '/">' +
      '<div class="img" style="background-image:url(\'' + esc(p.portada || '/img/logo/logo-fundacion.png') + '\')"></div>' +
      '<div class="cuerpo"><span class="etiqueta">' + esc(p.etiqueta || 'Proyecto') + '</span><h3>' + esc(p.titulo) + '</h3>' +
      '<p>' + esc(p.resumen || textoPlano(p.contenido, 150)) + '</p><span class="enlace">Conocer más →</span></div></a>';
  }

  function tarjetaNoticia(n) {
    return '<a class="tarjeta" href="/noticias/' + esc(n.slug) + '/">' +
      (n.portada ? '<div class="img" style="background-image:url(\'' + esc(n.portada) + '\')"></div>' : '') +
      '<div class="cuerpo"><span class="etiqueta">' + esc(n.categoria || 'Noticia') + '</span>' +
      (n.fecha ? '<div class="fecha">' + esc(fechaLarga(n.fecha)) + '</div>' : '') +
      '<h3>' + esc(n.titulo) + '</h3><p>' + esc(textoPlano(n.contenido, 140)) + '</p><span class="enlace">Leer →</span></div></a>';
  }

  /* ---------- Páginas ---------- */
  function paginaInicio(sitio, datos, anio) {
    var proyectos = ordenarProyectos(datos.proyectos).filter(function (p) { return p.enInicio !== false; });
    var noticias = ordenarNoticias(datos.noticias).slice(0, 3);
    var ind = (sitio.indicadores || []).filter(function (x) { return x.valor; });
    var cuerpo =
      '<section class="hero" style="background-image:url(\'' + esc(sitio.heroFoto) + '\')"><div class="wrap">' +
      '<span class="eyebrow">' + esc(sitio.nombre) + ' · Santa Marta</span><h1>' + esc(sitio.heroTitulo || sitio.lema) + '</h1>' +
      '<p class="lead">' + esc(sitio.heroTexto) + '</p>' +
      '<div class="botones"><a class="btn btn-accion" href="/donar/">Haga una donación</a><a class="btn btn-borde" href="#programas">Conozca nuestros programas</a></div>' +
      '</div></section>' +
      (ind.length ? '<section class="indicadores bloque" aria-label="Nuestros indicadores"><div class="wrap rejilla">' +
        ind.map(function (x) { return '<div><div class="num">' + esc(x.valor) + '</div><div class="lbl">' + esc(x.texto) + '</div></div>'; }).join('') + '</div></section>' : '') +
      '<section class="bloque blanco" id="nosotros"><div class="wrap duo"><div class="texto">' +
      '<span class="eyebrow">Nuestra fundación</span><h2>' + esc(sitio.nosotrosTitulo) + '</h2>' + textoAHtml(sitio.nosotrosTexto) + '</div>' +
      (sitio.nosotrosFoto ? '<img src="' + esc(sitio.nosotrosFoto) + '" alt="Actividades de la Fundación Reina Elizabeth" loading="lazy">' : '') +
      '</div></section>' +
      '<section class="bloque" id="programas"><div class="wrap"><div class="intro"><span class="eyebrow">Programas y proyectos</span><h2>Lo que hacemos</h2>' +
      '<p>Cada programa nace de una necesidad concreta de nuestra región y se sostiene gracias a aliados, voluntarios y donantes.</p></div>' +
      '<div class="rejilla ' + (proyectos.length === 2 ? 'r2' : 'r3') + '">' + proyectos.map(tarjetaProyecto).join('') + '</div></div></section>' +
      (noticias.length ? '<section class="bloque blanco"><div class="wrap"><div class="intro"><span class="eyebrow">Noticias</span><h2>Lo más reciente</h2></div>' +
        '<div class="rejilla r3">' + noticias.map(tarjetaNoticia).join('') + '</div>' +
        '<p class="mt"><a class="btn btn-borde-osc" href="/noticias/">Ver todas las noticias</a></p></div></section>' : '') +
      ((sitio.testimonios || []).length ? '<section class="bloque' + (noticias.length ? '' : ' blanco') + '"><div class="wrap"><div class="intro"><span class="eyebrow">Testimonios</span><h2>No somos un número, somos parte de una familia</h2></div>' +
        '<div class="rejilla r2">' + sitio.testimonios.map(function (t) { return '<blockquote class="cita"><p>«' + esc(t.texto) + '»</p><cite>— ' + esc(t.autor) + '</cite></blockquote>'; }).join('') + '</div></div></section>' : '') +
      '<section class="bloque' + (noticias.length ? ' blanco' : '') + '"><div class="wrap"><div class="intro"><span class="eyebrow">¿Quiere hacer parte del futuro?</span><h2>¿Cómo puedo ayudar?</h2></div>' +
      '<div class="rejilla r3">' +
      '<div class="tarjeta"><div class="cuerpo"><h3>Haga una donación</h3><p>¡Su generosidad contribuirá a cambiar vidas! Done en segundos con nuestra llave Bre-B <b>' + esc(sitio.llave) + '</b>.</p>' +
      '<div class="botones"><a class="btn btn-accion" href="/donar/">Donar aquí</a><button class="btn btn-borde-osc" type="button" data-copiar="' + esc(sitio.llave) + '">Copiar llave</button></div></div></div>' +
      '<div class="tarjeta"><div class="cuerpo"><h3>Apoyamos su proyecto</h3><p>¿Tiene un proyecto institucional relacionado con la neurodivergencia? ¡Podemos ayudarle!</p>' +
      '<div class="botones"><a class="btn btn-wa" href="' + wa(sitio, 'Hola, tengo un proyecto institucional relacionado con neurodivergencia y quisiera el apoyo de la Fundación Reina Elizabeth.') + '" target="_blank" rel="noopener">' + ICO.wa + ' Cuéntenos su proyecto</a></div></div></div>' +
      '<div class="tarjeta"><div class="cuerpo"><h3>Escríbanos</h3><p>Para voluntariado, alianzas o vincular a su institución, estamos a un mensaje de distancia.</p>' +
      '<div class="botones"><a class="btn btn-primario" href="/contacto/">Contacto</a></div></div></div>' +
      '</div></div></section>' +
      (sitio.revista && sitio.revista.titulo ? '<section class="bloque"><div class="wrap duo"><div><span class="eyebrow">Publicaciones</span><h2>' + esc(sitio.revista.titulo) + '</h2>' +
        '<p>La ' + esc(sitio.nombre) + ' es la entidad editora de la ' + esc(sitio.revista.titulo) + ', publicación científica de acceso abierto editada en Santa Marta.</p>' +
        '<a class="btn btn-borde-osc" href="/publicaciones/">Ver ficha de la revista</a></div>' +
        '<div class="cita"><p style="font-style:normal"><b>ISSN ' + esc(sitio.revista.issn) + '</b><br>' + esc(sitio.revista.periodicidad) + ' · ' + esc(sitio.revista.acceso) + '</p></div></div></section>' : '');
    return documento(sitio, datos, { ruta: '/', activo: 'inicio', descripcion: sitio.descripcion, cuerpo: cuerpo, anio: anio, imagen: sitio.heroFoto });
  }

  function paginaProyecto(sitio, datos, p, anio) {
    var yt = idYoutube(p.video);
    var cuerpo = cab(p.etiqueta, p.titulo, p.resumen, esc(p.titulo)) +
      '<section class="bloque blanco"><div class="wrap ' + (p.portada ? 'duo' : 'estrecho') + '">' +
      '<div class="texto">' + textoAHtml(p.contenido) +
      (p.enlace ? '<div class="botones mt"><a class="btn btn-primario" href="' + esc(p.enlace) + '" target="_blank" rel="noopener">' + esc(p.textoEnlace || 'Más información') + '</a></div>' : '') +
      '<div class="botones mt"><a class="btn btn-wa" href="' + wa(sitio, 'Hola, quiero información sobre «' + p.titulo + '» de la Fundación Reina Elizabeth.') + '" target="_blank" rel="noopener">' + ICO.wa + ' Pedir información</a></div>' +
      '</div>' +
      (p.portada ? '<div><img src="' + esc(p.portada) + '" alt="' + esc(p.titulo) + '" loading="lazy">' +
        (p.aliado ? '<img src="' + esc(p.aliado) + '" alt="Aliado del proyecto" style="max-width:200px;margin:20px auto 0;box-shadow:none" loading="lazy">' : '') + '</div>' : '') +
      '</div></section>' +
      ((p.fotos || []).length || yt || p.apoyo ? '<section class="bloque" id="galeria"><div class="wrap">' +
        (yt ? '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + yt + '" title="Video: ' + esc(p.titulo) + '" allowfullscreen loading="lazy"></iframe></div>' : '') +
        ((p.fotos || []).length ? '<div class="intro"><span class="eyebrow">Galería</span><h2>' + esc(p.tituloGaleria || 'Fotos del proyecto') + '</h2>' +
          (p.notaGaleria ? '<p>' + esc(p.notaGaleria) + '</p>' : '') + '</div>' + galeria(p.fotos, p.titulo) : '') +
        (p.apoyo ? apoyo(sitio, p.titulo) : '') + '</div></section>' : '');
    return documento(sitio, datos, { ruta: '/' + p.slug + '/', activo: p.slug, titulo: p.titulo, descripcion: p.resumen || textoPlano(p.contenido, 160), cuerpo: cuerpo, anio: anio, imagen: p.portada });
  }

  function paginaNoticias(sitio, datos, anio) {
    var lista = ordenarNoticias(datos.noticias);
    var cuerpo = cab('Noticias', 'Noticias de la Fundación', 'Actividades, eventos y novedades de la ' + sitio.nombre + '.', 'Noticias') +
      '<section class="bloque"><div class="wrap">' + (lista.length ? '<div class="rejilla r3">' + lista.map(tarjetaNoticia).join('') + '</div>' : '<p class="vacio">Pronto habrá noticias.</p>') + '</div></section>';
    return documento(sitio, datos, { ruta: '/noticias/', activo: 'noticias', titulo: 'Noticias', descripcion: 'Noticias y actividades de la ' + sitio.nombre + '.', cuerpo: cuerpo, anio: anio });
  }

  function paginaNoticia(sitio, datos, n, anio) {
    var yt = idYoutube(n.video);
    var url = SITIO + '/noticias/' + n.slug + '/';
    var cuerpo = '<section class="cab-pag"><div class="wrap"><div class="miga"><a href="/">Inicio</a> › <a href="/noticias/">Noticias</a></div>' +
      '<span class="eyebrow">' + esc(n.categoria || 'Noticia') + (n.fecha ? ' · ' + esc(fechaLarga(n.fecha)) : '') + '</span><h1>' + esc(n.titulo) + '</h1></div></section>' +
      '<section class="bloque blanco"><div class="wrap estrecho">' +
      (n.portada ? '<img src="' + esc(n.portada) + '" alt="' + esc(n.titulo) + '" style="border-radius:14px;margin-bottom:28px">' : '') +
      '<div class="texto">' + textoAHtml(n.contenido) + '</div>' +
      (yt ? '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + yt + '" title="Video: ' + esc(n.titulo) + '" allowfullscreen loading="lazy"></iframe></div>' : '') +
      (n.enlace ? '<div class="botones mt"><a class="btn btn-primario" href="' + esc(n.enlace) + '" target="_blank" rel="noopener">' + esc(n.textoEnlace || 'Más información') + '</a></div>' : '') +
      ((n.fotos || []).length ? '<h2 class="mt">Fotos</h2>' + galeria(n.fotos, n.titulo) : '') +
      '<div class="botones mt"><a class="btn btn-wa" href="https://wa.me/?text=' + encodeURIComponent(n.titulo + ' ' + url) + '" target="_blank" rel="noopener">' + ICO.wa + ' Compartir</a>' +
      '<a class="btn btn-borde-osc" href="/noticias/">← Todas las noticias</a></div>' +
      '</div></section>';
    return documento(sitio, datos, { ruta: '/noticias/' + n.slug + '/', activo: 'noticias', titulo: n.titulo, tipo: 'article', descripcion: textoPlano(n.contenido, 160) || n.titulo, cuerpo: cuerpo, anio: anio, imagen: n.portada });
  }

  // OBLIGATORIA: declara a la Fundación como entidad editora de la revista (usada ante Latindex). No cambiar la dirección /publicaciones/.
  function paginaPublicaciones(sitio, datos, anio) {
    var r = sitio.revista || {};
    var filas = [['Título', r.titulo], ['ISSN', r.issn], ['Entidad editora', sitio.nombre], ['Editor', r.editor], ['Periodicidad', r.periodicidad], ['Acceso', r.acceso],
      ['Sitio web', r.sitioWeb ? '<a href="' + esc(r.sitioWeb) + '" target="_blank" rel="noopener">' + esc(r.sitioWeb) + '</a>' : ''],
      ['Contacto de la revista', r.correo ? '<a href="mailto:' + esc(r.correo) + '">' + esc(r.correo) + '</a>' : ''], ['Lugar de edición', r.lugar]];
    var c = sitio.contacto || {};
    var cuerpo = cab('Entidad editora', 'Publicaciones', 'La ' + sitio.nombre + ' es la entidad editora de la ' + (r.titulo || '') + ', publicación científica de acceso abierto editada en Santa Marta (Magdalena), Colombia.', 'Publicaciones') +
      '<section class="bloque"><div class="wrap estrecho"><h2>' + esc(r.titulo) + '</h2><div class="ficha"><dl>' +
      filas.filter(function (f) { return f[1]; }).map(function (f) { return '<dt>' + f[0] + '</dt><dd>' + (/^</.test(f[1]) ? f[1] : esc(f[1])) + '</dd>'; }).join('') +
      '</dl></div><p class="mt">' + esc(sitio.nombre) + ' · ' + esc(c.direccion) + ' · <a href="mailto:' + esc(c.correo) + '">' + esc(c.correo) + '</a></p>' +
      (r.sitioWeb ? '<a class="btn btn-primario" href="' + esc(r.sitioWeb) + '" target="_blank" rel="noopener">Ir a la revista</a>' : '') + '</div></section>';
    return documento(sitio, datos, { ruta: '/publicaciones/', activo: 'publicaciones', titulo: 'Publicaciones', descripcion: 'La ' + sitio.nombre + ' es la entidad editora de la ' + r.titulo + ' (ISSN ' + r.issn + ').', cuerpo: cuerpo, anio: anio });
  }

  function paginaDonar(sitio, datos, anio) {
    var c = sitio.contacto || {};
    var msg = 'Hola, acabo de hacer una donación a la Fundación Reina Elizabeth. Les envío el comprobante.';
    var proyectos = ordenarProyectos(datos.proyectos).filter(function (p) { return p.apoyo; });
    var cuerpo = cab('Donaciones', 'Su generosidad cambia vidas', 'Done de forma rápida y segura desde la app de su banco o billetera con nuestra llave Bre-B.', 'Donar') +
      '<section class="bloque"><div class="wrap duo"><div class="llave"><div class="tit">Llave Bre-B de la Fundación</div><div class="valor">' + esc(sitio.llave) + '</div>' +
      '<div class="botones" style="justify-content:center"><button class="btn btn-accion" type="button" data-copiar="' + esc(sitio.llave) + '">Copiar llave</button>' +
      '<a class="btn btn-wa" href="' + wa(sitio, msg) + '" target="_blank" rel="noopener">' + ICO.wa + ' Enviar comprobante</a></div>' +
      '<p class="nota">Antes de confirmar el envío, verifique que el destinatario que muestra su banco sea la Fundación Reina Elizabeth.</p></div>' +
      '<div><h2>Cómo donar en 4 pasos</h2><ol class="pasos">' +
      '<li>Abra la app de su banco o billetera y elija <b>enviar con llave</b> (Bre-B).</li>' +
      '<li>Escriba o pegue la llave <b>' + esc(sitio.llave) + '</b>.</li>' +
      '<li>Revise que el destinatario sea la <b>Fundación Reina Elizabeth</b>, escriba el valor y confirme.</li>' +
      '<li>Envíenos el comprobante por <a href="' + wa(sitio, msg) + '" target="_blank" rel="noopener">WhatsApp</a> o a <a href="mailto:' + esc(c.correo) + '?subject=' + encodeURIComponent('Comprobante de donación') + '">' + esc(c.correo) + '</a>. Si quiere que su aporte vaya a un proyecto en particular, díganos cuál.</li>' +
      '</ol></div></div></section>' +
      (proyectos.length ? '<section class="bloque blanco"><div class="wrap"><div class="intro"><h2>¿A qué proyecto quiere apoyar?</h2><p>Puede donar a la Fundación en general o a uno de nuestros proyectos. Solo indíquelo al enviar el comprobante.</p></div>' +
        '<div class="rejilla ' + (proyectos.length === 2 ? 'r2' : 'r3') + '">' + proyectos.map(tarjetaProyecto).join('') + '</div></div></section>' : '');
    return documento(sitio, datos, { ruta: '/donar/', activo: 'donar', titulo: 'Donar', descripcion: 'Done a la ' + sitio.nombre + ' con la llave Bre-B ' + sitio.llave + '.', cuerpo: cuerpo, anio: anio });
  }

  function paginaContacto(sitio, datos, anio) {
    var c = sitio.contacto || {};
    var cuerpo = cab('Contacto', 'Hablemos', 'Escríbanos para donar, proponer un proyecto, ser voluntario o vincular a su institución.', 'Contacto') +
      '<section class="bloque blanco"><div class="wrap duo"><div>' +
      (c.direccion ? '<div class="contacto-item"><span class="ico">' + ICO.pin + '</span><div><b>Dirección</b>' + esc(c.direccion) + '<br><a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.direccion) + '" target="_blank" rel="noopener">Ver en el mapa</a></div></div>' : '') +
      (c.correo ? '<div class="contacto-item"><span class="ico">' + ICO.mail + '</span><div><b>Correo</b><a href="mailto:' + esc(c.correo) + '">' + esc(c.correo) + '</a></div></div>' : '') +
      (c.whatsapp ? '<div class="contacto-item"><span class="ico" style="color:#fff;background:var(--wa)">' + ICO.wa + '</span><div><b>WhatsApp</b><a href="' + wa(sitio, 'Hola, escribo desde la página de la Fundación Reina Elizabeth.') + '" target="_blank" rel="noopener">' + esc(c.whatsapp) + '</a></div></div>' : '') +
      (c.instagram ? '<div class="contacto-item"><span class="ico">' + ICO.ig + '</span><div><b>Instagram</b><a href="' + esc(c.instagram) + '" target="_blank" rel="noopener">' + esc(c.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, '')) + '</a></div></div>' : '') +
      '</div><div class="llave"><div class="tit">Para donaciones · llave Bre-B</div><div class="valor">' + esc(sitio.llave) + '</div>' +
      '<div class="botones" style="justify-content:center"><button class="btn btn-accion" type="button" data-copiar="' + esc(sitio.llave) + '">Copiar llave</button><a class="btn btn-primario" href="/donar/">Cómo donar</a></div></div>' +
      '</div></section>';
    return documento(sitio, datos, { ruta: '/contacto/', activo: 'contacto', titulo: 'Contacto', descripcion: 'Contacto de la ' + sitio.nombre + ': ' + (c.direccion || '') + '.', cuerpo: cuerpo, anio: anio });
  }

  function pagina404(sitio, datos, anio) {
    var cuerpo = cab('Error 404', 'No encontramos esta página', 'Puede que la dirección haya cambiado con la nueva versión del sitio.', '404') +
      '<section class="bloque"><div class="wrap centro"><a class="btn btn-primario" href="/">Volver al inicio</a></div></section>';
    return documento(sitio, datos, { ruta: '/404.html', titulo: 'Página no encontrada', descripcion: 'Página no encontrada', cuerpo: cuerpo, anio: anio, noindex: true });
  }

  // Direcciones de la web vieja (WordPress) que llevan a las páginas nuevas
  var REDIRECCIONES = {
    'blog': '/', 'prohibidoolvidar': '/', 'lecciones-del-silencio': '/',
    'rostros-del-arte-sin-limites': '/rostros-del-arte/', 'rostros-del-arte-sin-limites-santa-marta': '/rostros-del-arte/#galeria',
    'rostros-del-arte-sin-limites-cienaga': '/rostros-del-arte/', 'propuesta-dialogos-generacionales': '/dialogos-generacionales/'
  };
  function redireccion(destino) {
    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Redirigiendo…</title><link rel="canonical" href="' + SITIO + destino.split('#')[0] + '">' +
      '<meta http-equiv="refresh" content="0; url=' + destino + '"><meta name="robots" content="noindex"></head><body style="font-family:sans-serif;padding:40px">' +
      'Esta página se trasladó. <a href="' + destino + '">Continúe aquí</a>.</body></html>\n';
  }

  function mapaDelSitio(datos) {
    var urls = ['/', '/publicaciones/', '/donar/', '/contacto/'];
    datos.proyectos.forEach(function (p) { urls.push('/' + p.slug + '/'); });
    if (datos.noticias.length) { urls.push('/noticias/'); datos.noticias.forEach(function (n) { urls.push('/noticias/' + n.slug + '/'); }); }
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map(function (u) { return '  <url><loc>' + SITIO + u + '</loc></url>'; }).join('\n') + '\n</urlset>\n';
  }

  // Devuelve {ruta: contenido} con TODAS las páginas del sitio.
  function generarTodo(sitio, proyectosDatos, noticiasDatos, anio) {
    var datos = { proyectos: proyectosDatos.proyectos || [], noticias: noticiasDatos.noticias || [] };
    var out = {};
    out['index.html'] = paginaInicio(sitio, datos, anio);
    out['publicaciones/index.html'] = paginaPublicaciones(sitio, datos, anio);
    out['donar/index.html'] = paginaDonar(sitio, datos, anio);
    out['contacto/index.html'] = paginaContacto(sitio, datos, anio);
    out['noticias/index.html'] = paginaNoticias(sitio, datos, anio);
    out['404.html'] = pagina404(sitio, datos, anio);
    datos.proyectos.forEach(function (p) { out[p.slug + '/index.html'] = paginaProyecto(sitio, datos, p, anio); });
    datos.noticias.forEach(function (n) { out['noticias/' + n.slug + '/index.html'] = paginaNoticia(sitio, datos, n, anio); });
    Object.keys(REDIRECCIONES).forEach(function (k) { out[k + '/index.html'] = redireccion(REDIRECCIONES[k]); });
    out['sitemap.xml'] = mapaDelSitio(datos);
    out['robots.txt'] = 'User-agent: *\nDisallow: /admin/\nAllow: /\n\nSitemap: ' + SITIO + '/sitemap.xml\n';
    return out;
  }

  return {
    esc: esc, textoAHtml: textoAHtml, textoPlano: textoPlano, fechaLarga: fechaLarga, slugify: slugify, idYoutube: idYoutube, mini: mini,
    ordenarProyectos: ordenarProyectos, ordenarNoticias: ordenarNoticias,
    paginaProyecto: paginaProyecto, paginaNoticia: paginaNoticia, generarTodo: generarTodo,
    RESERVADAS: RESERVADAS, SITIO: SITIO, VERSION: VERSION
  };
});
