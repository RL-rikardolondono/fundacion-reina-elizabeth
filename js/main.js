// Menú móvil
(function(){
  var b=document.querySelector('.hamb'), m=document.querySelector('.menu');
  if(b&&m){b.addEventListener('click',function(){var a=m.classList.toggle('abierto');b.setAttribute('aria-expanded',a);});}
})();

// Copiar llave Bre-B
function aviso(t){
  var el=document.querySelector('.toast');
  if(!el){el=document.createElement('div');el.className='toast';document.body.appendChild(el);}
  el.textContent=t;el.classList.add('ver');
  clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('ver');},2200);
}
document.querySelectorAll('[data-copiar]').forEach(function(btn){
  btn.addEventListener('click',function(){
    var v=btn.getAttribute('data-copiar');
    var ok=function(){aviso('Llave '+v+' copiada');};
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(v).then(ok,function(){fallback(v);ok();});}
    else{fallback(v);ok();}
  });
});
function fallback(v){var t=document.createElement('textarea');t.value=v;document.body.appendChild(t);t.select();try{document.execCommand('copy');}catch(e){}t.remove();}

// Galería con visor
(function(){
  var gal=document.querySelector('.galeria'); if(!gal) return;
  var fotos=[].slice.call(gal.querySelectorAll('button'));
  var v=document.createElement('div'); v.className='visor';
  v.innerHTML='<button class="cerrar" aria-label="Cerrar">&times;</button><button class="ant" aria-label="Anterior">&#8249;</button><img alt=""><button class="sig" aria-label="Siguiente">&#8250;</button>';
  document.body.appendChild(v);
  var img=v.querySelector('img'), i=0;
  function ver(n){i=(n+fotos.length)%fotos.length;var f=fotos[i].querySelector('img');img.src=fotos[i].getAttribute('data-full')||f.getAttribute('src');img.alt=f.alt;v.classList.add('abierto');}
  fotos.forEach(function(f,n){f.addEventListener('click',function(){ver(n);});});
  v.querySelector('.cerrar').onclick=function(){v.classList.remove('abierto');};
  v.querySelector('.ant').onclick=function(e){e.stopPropagation();ver(i-1);};
  v.querySelector('.sig').onclick=function(e){e.stopPropagation();ver(i+1);};
  v.addEventListener('click',function(e){if(e.target===v)v.classList.remove('abierto');});
  document.addEventListener('keydown',function(e){if(!v.classList.contains('abierto'))return;if(e.key==='Escape')v.classList.remove('abierto');if(e.key==='ArrowLeft')ver(i-1);if(e.key==='ArrowRight')ver(i+1);});
})();

// Año en el pie
document.querySelectorAll('[data-anio]').forEach(function(e){e.textContent=new Date().getFullYear();});
