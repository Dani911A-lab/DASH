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