let datosFlujo=[];
function cargarDatosFlujo(){
fetch("datos/flujo.json")
.then(res=>res.json())
.then(data=>{
datosFlujo=data;
actualizarUtilidadTecniagrex();
})
.catch(error=>{
console.error("Error cargando flujo.json:",error);
});
}
function actualizarUtilidadTecniagrex(){
const empresa="TECNIAGREX S.A.";
let total=datosFlujo
.filter(item=>item.EMPRESA===empresa)
.reduce((suma,item)=>{
return suma+(Number(item.TOTAL)||0);
},0);
const elemento=document.querySelector(".utilidad-tecniagrex");
if(elemento){
elemento.textContent="Utilidad (acumulada): $"+total.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
}
}
function abrirEmpresa(nombre){
const hero=document.querySelector(".hero");
const titulo=document.querySelector(".empresa-header");
titulo.textContent=nombre;
hero.classList.add("detalle");
}
function cerrarEmpresa(){
const hero=document.querySelector(".hero");
hero.classList.remove("detalle");
}
function abrirFlujo(){
const flujo=document.querySelector(".flujo-page");
const app=document.querySelector(".app");
flujo.classList.add("show");
app.classList.add("hide");
}
function cerrarFlujo(){
const flujo=document.querySelector(".flujo-page");
const app=document.querySelector(".app");
flujo.classList.remove("show");
app.classList.remove("hide");
}
window.addEventListener("message",function(e){
if(e.data&&e.data.accion==="cerrarFlujo"){
cerrarFlujo();
}
});
cargarDatosFlujo();
