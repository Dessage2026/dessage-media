(function(){
var FOTOS=window.DSG_FOTOS||{};
  var main=document.getElementById('imgPrincipal');
var btns=document.querySelectorAll('#miniaturas button');
btns.forEach(function(b){b.addEventListener('click',function(){
main.src=b.getAttribute('data-src');
btns.forEach(function(x){x.classList.remove('activa')});b.classList.add('activa');
});});
/* Botones del formulario de Oktopus */
function botonesForm(){return Array.prototype.slice.call(document.querySelectorAll('#oktopus-checkout button[type="button"]'));}
function ocultarAgotados(){
botonesForm().forEach(function(b){
var t=(b.textContent||'').trim().toUpperCase();
if(t==='AZUL'||b.style.textDecoration.indexOf('line-through')>-1){b.style.display='none';}
});
}
var colorElegido='ROSADO';
function marcarColorForm(c,intentos){
var hecho=false;
botonesForm().forEach(function(b){
if((b.textContent||'').trim().toUpperCase()===c){hecho=true;if(!/rgb\(237, 233, 254\)|activo/.test(b.getAttribute('style')||'')||true){b.click();}}
});
if(!hecho&&(intentos||0)<60){setTimeout(function(){marcarColorForm(c,(intentos||0)+1);},150);}
}
var chips=document.querySelectorAll('#chips .chip');
var nombre=document.getElementById('colorNombre');
chips.forEach(function(ch){ch.addEventListener('click',function(){
chips.forEach(function(x){x.classList.remove('activa')});ch.classList.add('activa');
colorElegido=ch.getAttribute('data-color');nombre.textContent=ch.getAttribute('data-nombre');
if(FOTOS[colorElegido]){main.src=FOTOS[colorElegido];btns.forEach(function(x){x.classList.toggle('activa',x.getAttribute('data-src')===FOTOS[colorElegido]);});}
marcarColorForm(colorElegido,0);
});});
/* Si eligen el color en el formulario, se refleja arriba */
document.addEventListener('click',function(e){
var b=e.target.closest&&e.target.closest('#oktopus-checkout button[type="button"]');
if(!b)return;var t=(b.textContent||'').trim().toUpperCase();
chips.forEach(function(ch){if(ch.getAttribute('data-color')===t){chips.forEach(function(x){x.classList.remove('activa')});ch.classList.add('activa');nombre.textContent=ch.getAttribute('data-nombre');colorElegido=t;if(FOTOS[t]){main.src=FOTOS[t];btns.forEach(function(x){x.classList.toggle('activa',x.getAttribute('data-src')===FOTOS[t]);});}}});
});
var mo=new MutationObserver(ocultarAgotados);
var cont=document.getElementById('oktopus-checkout');
if(cont){mo.observe(cont,{childList:true,subtree:true});}
marcarColorForm('ROSADO',0);
function elegirPack(v){
var n=0;
(function intentar(){
var r=document.querySelector('#oktopus-checkout input[name="okto_pack"][value="'+v+'"]');
if(r){ if(!r.checked){ r.click(); } }
else if(n++<60){ setTimeout(intentar,150); }
})();
}
elegirPack('0');
document.querySelectorAll('[data-pack]').forEach(function(a){
a.addEventListener('click',function(){ elegirPack(a.getAttribute('data-pack')); });
});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('si');io.unobserve(e.target);}});},{threshold:.12});
document.querySelectorAll('.aparece').forEach(function(el){io.observe(el);});
var sticky=document.getElementById('sticky');var wa=document.getElementById('waFloat');var compra=document.getElementById('comprar');
function check(){
var r=compra.getBoundingClientRect();
var enForm=r.top<window.innerHeight*0.85&&r.bottom>0;
sticky.classList.toggle('ver',!enForm);
wa.classList.toggle('bajo',enForm);
}
window.addEventListener('scroll',check,{passive:true});check();
})();
