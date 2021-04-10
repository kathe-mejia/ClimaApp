const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

let HoraMundial;

window.addEventListener('load', () => {
    formulario.addEventListener('submit', searchWeather);
    
} )

//CREAR UN BOTON PARA REINICIAR BUSQUEDA ¡¡¡¡NO FUNCIONA!!! CON MOUSE ENTER SI MUESTRA POR CONSOLA
/*const buscar=document.querySelector('#btnCapture')
buscar.addEventListener('onlick', e =>{
   const btNew=document.createElement('input');
    btNew.type = 'button'; 
    btNew.id= 'acutalizar'
    btNew.value = 'Nueva busqueda'; 
    console.log("crear boton");

   
});*/


//ACCIONES AL PASAR EL CURSOR POR BOTONES
const colorBtn=document.querySelector('#btnCapture');
colorBtn.addEventListener('mouseenter', e => {
    colorBtn.style.background = '#597FEE';

  });

colorBtn.addEventListener('mouseleave', e => {
    colorBtn.style.background = 'black';

  });   

  const colorBtn2=document.querySelector('#actualizar');
  colorBtn2.addEventListener('mouseenter', e => {
      colorBtn2.style.background = '#597FEE';
  
    });
  
  colorBtn2.addEventListener('mouseleave', e => {
      colorBtn2.style.background = 'black';
  
    });   
//Me sorprende lo bien que entendiste los Eventos y como los aplicas
//al igual que los arrow functions...Diego B.



//Función busqueda de datos

function searchWeather(e) {
    e.preventDefault();

    //Validar hay uno que tiene id ciudad y otro pais, el value es para saber que escribio el user
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === ''){
        //Hubo un error
        mostrarError('Diligencia ambos campos');
        return; //con este detenemos nuestro codigo.

    }

    //Consultar la API si pasa la validacion
    consultarAPI2(ciudad, pais);//API de geolocation
    consultarAPI(ciudad, pais);
}

//SE CORRIGE ESTA FUNCIÓN
function mostrarError(mensaje){
    const alerta = document.querySelector('.bg-red-100')//la uso porque se que no esta en ningun otro lado
    if(!alerta){
            //CREEMOS UNA ALERTA CON SCRIPTING
    const alerta = document.createElement('div');
    //clases de tailwind
    alerta.classList.add('bg-black','border-solid', 'text-white', 'px-4',
     'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center','font-mono','text-3xl' );
    
     alerta.innerHTML = `
        <strong>No se realizó la consulta</strong>
        <span class="block">${mensaje}</span>
     `;
     //AQUI SE CORRIGE SE MUESTRA ALERTA EN CAMPO RESULTADO
     resultado.appendChild(alerta);
        //ELIMINEMOS LA ALERTA
        setTimeout(()=>{
            alerta.remove();
        }, 4000)

    }
}

//consulta de API de la hora local
function consultarAPI2(ciudad, pais) {
    const apiKey = 'f2ab6701285b45d3b43086b4d94517e7';//la api key con mi cuenta
    const url2 = `https://api.ipgeolocation.io/timezone?apiKey=${apiKey}&location=${ciudad},%20${pais}`;


    fetch(url2) //ya sabemos que es json....la mayoria es asi...excepto los de pago XML
        .then( answer => answer.json() )
        .then( data => {
            if(data.cod === "404") {
                mostrarError('Ciudad no encontrada.')
                return;
            }
            //Imprimir la respuesta en el html
            guardarHora(data);
           
        })
}


//Función para obtener y guardar la hora local
function guardarHora(data){
    const {date_time_txt} = data;
    const HoraRemota = date_time_txt;
    const HoraLocal2 = document.createElement('div');
    HoraLocal2.innerHTML = `Hora Local: ${HoraRemota}`;
    HoraLocal2.classList.add('text-2xl', 'col-start-5', 'col-span-4');
    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-black', 'grid', 'grid-cols-12', 'gap-4', 'mt-5','font-bold');
    resultadoDiv.appendChild(HoraLocal2);
    resultado.appendChild(resultadoDiv);
    console.log(HoraRemota);
    console.log(HoraLocal2)
    console.log(resultadoDiv)
 }

//Funcion consultar clima con API open
function consultarAPI(ciudad, pais) {
    const appID = '47f3586bf5961638beb5900079181fee';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

    Spinner();

    fetch(url) //ya sabemos que es json....la mayoria es asi...excepto los de pago XML
        .then( respuesta => respuesta.json() )
        .then( datos => {
            limpiarHTML();
            if(datos.cod === "404") {
                mostrarError('Ciudad no encontrada')
                return;
            }
            //Imprimir la respuesta en el html
            showWeather(datos);
        })
}


function showWeather(datos){
    const {name, main: { temp, temp_max, temp_min, feels_like}, weather:{0:{icon}}, dt} = datos;
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);
    const sensacion = kelvinACentigrados(feels_like);
    const icono = icon;


    const horario = unixToHuman(dt);
    let imgsrc;
    let palabra;

    

    //Creación de audios
    const solSound=document.createElement('audio')
    solSound.src="/sounds/soleado.mp3"

    const despSound=document.createElement('audio')
    despSound.src="/sounds/despejado.mp3"

    const parSound=document.createElement('audio')
    parSound.src="/sounds/parcial.mp3"

    const parSound1=document.createElement('audio')
    parSound1.src="/sounds/parcial.mp3"

    const sonido=document.createElement('audio')
    sonido.src="/sounds/nublado.mp3"

    const lluviaSound=document.createElement('audio')
    lluviaSound.src="/sounds/lluvia.mp3"

    const tormSound=document.createElement('audio')
    tormSound.src="/sounds/tormenta.mp3"

    const nieveSound=document.createElement('audio')
    nieveSound.src="/sounds/nieve.mp3"

    const nebliSound=document.createElement('audio')
    nebliSound.src="/sounds/neblina.mp3"
//LOS SONIDOS SE SOLAPAN CUANDO HAGO UNA NUEVA BUSQUEDA
//EN CADA CASE APARECE UNA IMAGEN, CAMBIA EL FONDO Y SE REPRODUCE UN SONIDO
    switch (true) {
        case (icono==='01d'):


            palabra = "Soleado"
            imgsrc = "img/soleado.png"
          /*  const solSound=document.createElement('audio')
            solSound.src="sounds/soleado.mp3"*/
            const sol=document.querySelector("#fondo");
            sol.style.backgroundImage = "url('/img/soleadito.gif')";
            solSound.play();
        break;
    
        case (icono==='01n'):
   

            palabra = "Despejado"
            imgsrc = "img/luna.png"
          /*  const despSound=document.createElement('audio')
            despSound.src="sounds/despejado.mp3"*/
            const desp=document.querySelector("#fondo");
            desp.style.backgroundImage = "url('/img/despejado.gif')";
            despSound.play();
        break;
    
        case (icono==='02d'):

            palabra = " Parcialmente Nublado"
            imgsrc = "img/parciald.png"
          /*  const parSound=document.createElement('audio')
            parSound.src="sounds/parcial.mp3"*/
            const parcialm=document.querySelector("#fondo");
            parcialm.style.backgroundImage = "url('/img/parcialm.gif')";
            parSound.play();
        break;
    
        case (icono==='02n'):
 
            palabra = " Parcialmente Nublado"
            imgsrc = "img/parcialn.png"
           /* const parSound1=document.createElement('audio')
            parSound1.src="sounds/parcial.mp3"*/
            const parcialm1=document.querySelector("#fondo");
            parcialm1.style.backgroundImage = "url('/img/parcialm.gif')";
            parSound1.play();
        break;

        case ((icono==='03d') || (icono==='03n') || (icono==='04d') || (icono==='04n')):
        
            palabra = "Nublado"
            imgsrc = "img/totalmentn.png"
          /*  const sonido=document.createElement('audio')
            sonido.src="sounds/nublado.mp3"*/
            const nublado=document.querySelector("#fondo");
            nublado.style.backgroundImage = "url('/img/nublado.gif')";
            console.log("esta lloviending");
            sonido.play();
  

           // console.log("Nubladito")

        break;

        case ((icono==='09d') || (icono==='09n') || (icono==='10d') || (icono==='10n')):
            
            palabra = " Lluvia"
            imgsrc = "img/lluvia.png"
           /* const lluviaSound=document.createElement('audio')
            lluviaSound.src="sounds/lluvia.mp3"*/
            lluviaSound.play();
            const llueve=document.querySelector("#fondo");
            llueve.style.backgroundImage = "url('/img/lloviendo2.gif')";
            console.log("esta lloviending");
  
            
        break;
    
        case ((icono==='11d') || (icono==='11n')):

            palabra = "Tormenta Electrica"
            imgsrc = "img/tormenta.png"
         /*   const tormSound=document.createElement('audio')
            tormSound.src="sounds/tormenta.mp3"*/
            const torm=document.querySelector("#fondo");
            torm.style.backgroundImage = "url('/img/tormenta2.gif')";
            tormSound.play();
        break;

        case ((icono==='13d') || (icono==='13n')):

            palabra = "Nieve"
            imgsrc = "img/snowf.png"
           /* const nieveSound=document.createElement('audio')
            nieveSound.src="sounds/nieve.mp3"*/
            const snow=document.querySelector("#fondo");
            snow.style.backgroundImage = "url('/img/snow.gif')";
            nieveSound.play();
        break;

        case ((icono==='50d') || (icono==='50n')):
  
            palabra = "Neblina"
            imgsrc = "img/mist.png"
          /*  const nebliSound=document.createElement('audio')
           nebliSound.src="sounds/neblina.mp3"*/
           const neblina=document.querySelector("#fondo");
           neblina.style.backgroundImage = "url('/img/neblina.gif')";
            nebliSound.play();
        break;
        
    }

    //KATHE LO MAS PROBABLE ES QUE LOS SONIDOS SE TE SOLAPEN POR QUE EN EL SWITCH
    //ESTAS HACIENDO LOS LLAMADOS A PLAY DEL SONIDO
    //MEJOR LO QUE HACES ARRIBA ES ASIGNAR EL SOURCE
    //Y AQUI ABAJO EL LLAMADO AL PLAY (RECUERDA QUE COMO LA FUNCION AL CORRER NUEVAMENTE LIMPIA EL HTML
    //ES PROBABLE QUE TE LO BORRE.
    //TAMBIEN PUEDES INTENTAR USAR LA FUNCION LIMPIAR HTML ADENTRO DE LOS CASE(AUNQUE NO ME LLAMA LA ATENCION)
    //Y BORRAR EL AUDIO ANTERIOR CADA QUE QLLAMES UNO NUEVO
    const nombreCiudad = document.createElement('div');
    nombreCiudad.innerHTML = `El Clima en ${name}, es:`;
    nombreCiudad.classList.add('text-4xl', 'mt-5', 'font-bold', 'col-start-5', 'col-span-4' )
   
    const actual = document.createElement('div');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl', 'text-center', 'col-start-5', 'col-span-2');

    const divImagen = document.createElement('div');
    const imagenC = document.createElement('img');
    imagenC.src = imgsrc;
    divImagen.classList.add('col-start-7', 'col-span-2');
    imagenC.classList.add('mx-auto');
    divImagen.appendChild(imagenC);

    const minMax = document.createElement('div');
    minMax.innerHTML = `Min/Max   ${min}&#8451;/${max}&#8451;`
    minMax.classList.add('font-bold','text-center', 'col-start-5', 'col-span-2');

    const tempSensa = document.createElement('div');
    tempSensa.innerHTML = `Sensación Termica: ${sensacion} &#8451;`;
    tempSensa.classList.add('font-bold', 'text-center', 'col-start-5', 'col-span-2');

    const cielo = document.createElement('div');
    cielo.innerHTML = `Cielo: ${palabra}`;
    cielo.classList.add('font-bold', 'col-start-7', 'col-span-2', 'text-center');


    //Todo el resultado 
    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-black', 'grid', 'grid-cols-12', 'gap-4');
    resultadoDiv.appendChild(nombreCiudad);
    /* resultadoDiv.appendChild(HoraLocal); */
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(divImagen);
    resultadoDiv.appendChild(minMax);
    resultadoDiv.appendChild(tempSensa);
    resultadoDiv.appendChild(cielo);
    resultado.appendChild(resultadoDiv);
  
} 
//FUNCION QUE CONVIERTE A CENTIGRADOS
function kelvinACentigrados(grados){
    return parseInt(grados - 273.15);
}



//A ESTA FUNCION LE AÑADO DESHABILITAR BOTON 
function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
        //Inhabilito el boton despues de la primer busqueda
        document.getElementById("btnCapture").disabled=true;
    }
}

//esta funcione es estandar de JS
function unixToHuman(time) {
    const milliseconds = time*1000;
    dateObject = new Date(milliseconds);
    const humanDateFormat = dateObject.toLocaleString("es-CO", {timeZoneName: "short"});
    return humanDateFormat;
}


//Esta funcion no es propia la baje de:
// https://tobiasahlin.com/spinkit/
//hay que añadir 3 cosas el JS, el CSS y el HTML
function Spinner (){
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');
    divSpinner.innerHTML = `
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
    `;

    resultado.appendChild(divSpinner);
}

//este es el texto animado y tambien lo saque de:
// https://tobiasahlin.com/moving-letters/
//y hay que hacer similar a spinkit
// Wrap every letter in a span
var textWrapper = document.querySelector('.ml3');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml3 .letter',
    opacity: [0,1],
    easing: "easeInOutQuad",
    duration: 2250,
    delay: (el, i) => 150 * (i+1)
  }).add({
    targets: '.ml3',
    opacity: 0,
    duration: 500,
    easing: "easeOutExpo",
    delay: 500
  });





