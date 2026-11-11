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

/* Validacion del celular (Colombia: 10 digitos que empiezan por 3) */
var MSG_TEL='Revisa tu celular: debe tener 10 n\u00fameros y empezar por 3 (ej. 3001234567). As\u00ed podemos confirmar tu pedido.';
function campoTel(){
var c=document.getElementById('oktopus-checkout');if(!c)return null;
var ins=c.querySelectorAll('input');
for(var i=0;i<ins.length;i++){var x=ins[i];
var h=((x.type||'')+' '+(x.name||'')+' '+(x.id||'')+' '+(x.placeholder||'')+' '+(x.getAttribute('autocomplete')||'')+' '+(x.getAttribute('aria-label')||'')).toLowerCase();
if(x.type==='tel'||/tel|phone|celular|whatsapp|m[o\u00f3]vil/.test(h))return x;}
return null;}
function telValido(v){var d=(v||'').replace(/\D/g,'');
if(d.length===12&&d.indexOf('57')===0)d=d.slice(2);
return d.length===10&&(d.charAt(0)==='3'||d.indexOf('60')===0);}
function avisoTel(inp,mostrar){
var id='dsg-aviso-tel';var a=document.getElementById(id);
if(mostrar){
if(!a){a=document.createElement('div');a.id=id;a.setAttribute('role','alert');
a.style.cssText='color:#B00020;background:#FDECEA;border:1px solid #F5C2C0;border-radius:8px;padding:8px 10px;margin:6px 0 10px;font-size:14px;line-height:1.35;font-weight:600';
inp.insertAdjacentElement('afterend',a);}
a.textContent=MSG_TEL;inp.style.borderColor='#B00020';inp.style.boxShadow='0 0 0 2px rgba(176,0,32,.18)';
}else{if(a)a.remove();inp.style.borderColor='';inp.style.boxShadow='';}}
function bloquearSiTelMalo(e){
var inp=campoTel();if(!inp)return;
if(!telValido(inp.value)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();
avisoTel(inp,true);try{inp.scrollIntoView({block:'center',behavior:'smooth'});inp.focus({preventScroll:true});}catch(_){}}}
document.addEventListener('click',function(e){
var b=e.target.closest&&e.target.closest('#oktopus-checkout button, #oktopus-checkout input[type="submit"]');
if(!b)return;
var t=((b.textContent||b.value||'')+'').toLowerCase();
if(b.type==='submit'||/pedi|pedido|comprar|confirmar|finalizar|pagar|realizar|enviar/.test(t))bloquearSiTelMalo(e);
},true);
document.addEventListener('submit',function(e){
if(e.target.closest&&e.target.closest('#oktopus-checkout'))bloquearSiTelMalo(e);
},true);
document.addEventListener('input',function(e){
var inp=campoTel();if(inp&&e.target===inp&&document.getElementById('dsg-aviso-tel')&&telValido(inp.value))avisoTel(inp,false);
},true);
document.addEventListener('blur',function(e){
var inp=campoTel();if(inp&&e.target===inp&&inp.value.replace(/\D/g,'').length>0)avisoTel(inp,!telValido(inp.value));
},true);
})();
