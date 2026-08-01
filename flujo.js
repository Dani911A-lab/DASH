let datosFlujo=[];
function volver(){
window.parent.postMessage({
accion:"cerrarFlujo"
},"*");
}
function cargarDatos(){
fetch("datos/flujo.json")
.then(res=>res.json())
.then(data=>{
datosFlujo=data;
generarHaciendas();
})
.catch(error=>{
console.error("Error cargando JSON:",error);
});
}
function generarHaciendas(){
const contenedor=document.getElementById("haciendas-container");
if(!contenedor)return;
contenedor.innerHTML="";
const registros=datosFlujo.filter(item=>
item.EMPRESA==="TECNIAGREX S.A."&&
(item.TIPO_MOV==="INGRESO"||item.TIPO_MOV==="GASTO")&&
Number(item.SEM)>=1&&
Number(item.SEM)<=26
);
const haciendas={};
registros.forEach(item=>{
const sucursal=item.SUCURSAL;
if(!sucursal)return;
if(!haciendas[sucursal]){
haciendas[sucursal]={};
}
const sem=Number(item.SEM);
if(!haciendas[sucursal][sem]){
haciendas[sucursal][sem]={
ingreso:0,
gasto:0
};
}
if(item.TIPO_MOV==="INGRESO"){
haciendas[sucursal][sem].ingreso+=convertirNumero(item.TOTAL);
}
if(item.TIPO_MOV==="GASTO"){
haciendas[sucursal][sem].gasto+=convertirNumero(item.TOTAL);
}
});
Object.keys(haciendas).forEach(sucursal=>{
Object.keys(haciendas[sucursal]).forEach(sem=>{
haciendas[sucursal][sem]=
haciendas[sucursal][sem].ingreso-
haciendas[sucursal][sem].gasto;
});
});
const orden=[
"PORVENIR",
"ESPERANZA",
"CISNE",
"VAQUERIA",
"ESTRELLITA",
"PRIMAVERA",
"MARIA",
"VILLA",
"ECHEVERRIA",
"AGRO&SOL"
];
orden.forEach(nombre=>{
if(haciendas[nombre]){
crearTarjetaHacienda(nombre,haciendas[nombre]);
}
});
Object.keys(haciendas).forEach(nombre=>{
if(!orden.includes(nombre)){
crearTarjetaHacienda(nombre,haciendas[nombre]);
}
});
}
function crearTarjetaHacienda(nombre,semanas){
const contenedor=document.getElementById("haciendas-container");
const tarjeta=document.createElement("div");
tarjeta.className="hacienda-card";
const datos=[];
for(let i=1;i<=26;i++){
datos.push({
sem:i,
valor:semanas[i]||0
});
}
const meses=[
"ENE",
"FEB",
"MAR",
"ABR",
"MAY",
"JUN",
"JUL"
];
const mensual={};
datos.forEach(item=>{
const mes=Math.ceil(item.sem/4);
if(!mensual[mes]){
mensual[mes]=0;
}
mensual[mes]+=item.valor;
});
const escalaMes=Math.max(
...Object.values(mensual).map(x=>Math.abs(x)),
1
);
let barrasMes="";
Object.keys(mensual).forEach(mes=>{
const valor=mensual[mes];
const altura=(Math.abs(valor)/escalaMes)*35;
const tipo=valor>=0?"positivo":"negativo";
const posicionMes=
valor>=0
?`bottom:${39+altura+15}px;`
:`top:${39+altura+6}px;`;

barrasMes+=`
<div class="barra-mes-item ${tipo}" data-mes="${mes}">
<div class="valor-mes" style="${posicionMes}">
$${formatearNumero(valor)}
</div>
<div class="barra-mes" style="height:${altura}px"></div>
<div class="mes">
${meses[mes-1]}
</div>
</div>
`;
});
const valores=datos.map(x=>x.valor);

const positivos=valores.filter(x=>x>0);
const negativos=valores.filter(x=>x<0);

const max=Math.max(...positivos,0);

const minPositivo=
positivos.length
?Math.min(...positivos)
:0;

const minNegativo=
negativos.length
?Math.min(...negativos)
:0;

const escalaSemana=Math.max(
Math.abs(max),
Math.abs(minNegativo),
1
);

let semanaMayor=0;
let semanaMenor=0;
let semanaNegativa=0;

let barras="";

datos.forEach(item=>{

if(item.valor===max&&item.valor>0){
semanaMayor=item.sem;
}

if(item.valor===minPositivo&&item.valor>0){
semanaMenor=item.sem;
}

if(item.valor===minNegativo&&item.valor<0){
semanaNegativa=item.sem;
}

const altura=
(Math.abs(item.valor)/escalaSemana)*55;

let clase="";

if(item.valor===max&&item.valor>0){
clase="mayor";
}

if(item.valor===minPositivo&&item.valor>0){
clase="menor";
}

if(item.valor<0){
clase="negativo";
}

const tipo=item.valor>=0
?"positivo"
:"negativo";

const mes=Math.ceil(item.sem/4);

const posicionValor=
item.valor>=0
?`bottom:${38+altura+15}px;`
:`top:${62+altura+6}px;`;

barras+=`
<div class="barra-item ${tipo}" data-mes="${mes}">
<div class="valor-barra" style="${posicionValor}">
$${formatearNumero(item.valor)}
</div>
<div class="barra ${clase}" style="height:${altura}px"></div>
<div class="semana">
${item.sem}
</div>
</div>
`;
});
tarjeta.innerHTML=`
<div class="hacienda-nombre">
${nombre}
</div>
<div class="hacienda-info">
Utilidad mensual
</div>
<div class="chart-mensual">
${barrasMes}
</div>
<div class="separator"></div>
<div class="hacienda-info">
Utilidad semanal
</div>
<div class="chart-wrapper">
<div class="chart">
${barras}
</div>
</div>
<div class="grafico-footer">
<div class="leyenda-item">
<span class="leyenda-punto azul"></span>
<span>Mayor</span>
</div>
<div class="leyenda-item">
<span class="leyenda-punto naranja"></span>
<span>Menor</span>
</div>
<div class="leyenda-item">
<span class="leyenda-punto rojo"></span>
<span>Negativo</span>
</div>
</div>
`;

contenedor.appendChild(tarjeta);

activarMeses(tarjeta);
activarSemanas(tarjeta);

const wrapper=tarjeta.querySelector(".chart-wrapper");

if(wrapper){
setTimeout(()=>{
wrapper.scrollLeft=wrapper.scrollWidth;
},100);
}
}

function activarMeses(tarjeta){

const meses=tarjeta.querySelectorAll(".barra-mes-item");
const semanas=tarjeta.querySelectorAll(".barra-item");

meses.forEach(mes=>{

mes.addEventListener("click",e=>{

e.stopPropagation();

const numero=mes.dataset.mes;

meses.forEach(x=>{
x.classList.add("apagado");
x.classList.remove("activo");
});

mes.classList.remove("apagado");
mes.classList.add("activo");


semanas.forEach(sem=>{

if(sem.dataset.mes===numero){

sem.classList.remove("apagado");

}else{

sem.classList.add("apagado");

}

});


const destino=tarjeta.querySelector(
`.barra-item[data-mes="${numero}"]`
);

const wrapper=tarjeta.querySelector(".chart-wrapper");


if(destino&&wrapper){

const ajusteScroll=-25;

const posicion=
destino.offsetLeft+
(destino.offsetWidth/2)-
(wrapper.clientWidth/2)+
ajusteScroll;


wrapper.scrollTo({
left:posicion,
behavior:"smooth"
});

}

});

});


function limpiarFiltro(){

meses.forEach(mes=>{

mes.classList.remove("apagado");
mes.classList.remove("activo");

});


semanas.forEach(sem=>{

sem.classList.remove("apagado");

});

}


tarjeta.addEventListener("click",e=>{

if(
e.target.closest(".barra-mes-item")||
e.target.closest(".barra-item")
){

return;

}

limpiarFiltro();

});

}


function activarSemanas(tarjeta){

tarjeta.querySelectorAll(".barra").forEach(barra=>{

barra.addEventListener("click",function(){

tarjeta.querySelectorAll(".valor-barra")
.forEach(valor=>{

valor.classList.remove("show");

});


this.parentElement
.querySelector(".valor-barra")
.classList.add("show");

});

});


tarjeta.querySelectorAll(".barra-mes").forEach(barra=>{

barra.addEventListener("click",function(){

tarjeta.querySelectorAll(".valor-mes")
.forEach(valor=>{

valor.style.opacity="0";

});


this.parentElement
.querySelector(".valor-mes")
.style.opacity="1";

});

});

}


function convertirNumero(valor){

if(valor===null||valor===""){

return 0;

}


if(typeof valor==="number"){

return valor;

}


return Number(
String(valor)
.replace(/\$/g,"")
.replace(/,/g,"")
.replace(/\s/g,"")
)||0;

}


function formatearNumero(valor){

return Number(valor).toLocaleString("en-US",{

minimumFractionDigits:0,

maximumFractionDigits:0

});

}


document.addEventListener("DOMContentLoaded",()=>{

cargarDatos();

});
