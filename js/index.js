$(document).ready(function() 
{
  inicializarSlider();
  cargaFiltros();
});

//  Creación de una función personalizada para jQuery que detecta cuando se detiene el scroll en la página
$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};


//------------  Punto 1: Trae los datos de PHP
$("#mostrarTodos").click(function()
{
  const peticion ="mostrarTodo";

  $.ajax(
  {
    type: "POST",
    url: "./index.php",
    data: {"_peticion": peticion},
    success: function(data)
    {
      let datos = JSON.parse(data);      
      let agregar = document.querySelector(".colContenido");
      agregar.innerHTML = "";

      for(let campo of datos)                       //Trae los datos del JSON pero cada objeto por separado
      {
        agregar.innerHTML += `
          <div class="card itemMostrado">
            <img src="img/home.jpg">
            <div class="card-stacked">
              <div class="card-content">
                <p><strong>Dirección: </strong>${campo.Direccion}</p>
                <p><strong>Ciudad: </strong>${campo.Ciudad}</p>
                <p><strong>Télefono: </strong>${campo.Telefono}</p>
                <p><strong>Código postal: </strong>${campo.Codigo_Postal}</p>
                <p><strong>Tipo: </strong>${campo.Tipo}</p>
                <strong>Precio: </strong><strong class="precioTexto">${campo.Precio}</strong>
              </div>
              <div class="card-action">
                <a href="#">Ver más</a>
              </div>
            </div>
          </div>  
        `
      }
    },
    error: function(data)
    {
      alert("paila no sirve  ",data);
    }
  });
})

// ----------------- Punto 2 : Carga filtros    ---------------------

  function cargaFiltros()
  {
    const peticion ="filtros";

    $.ajax(
      {
        type: "POST",
        url: "./index.php",
        data: {"_peticion": peticion},
        success: function(data)
        {
          let datos = JSON.parse(data); 
          let ciudades = datos["ciudades"];
          let tipo = datos["tipo"];

          for (i=0; i<ciudades.length; i++)
          {
            $("#selectCiudad").append("<option value='" + ciudades[i] + "'>" + ciudades[i]);
          }

          for (i=0; i<tipo.length; i++)
          {
            $("#selectTipo").append("<option value='" + tipo[i] + "'>" + tipo[i]);
          }
          $('select').formSelect();         //Sirve para inizializar las listas desplegables select del formulario en el HTML. Esto es código de materialize que dicen que hay que colocar para que funcione una vez cargadas todas las opciones

        },
        error: function()
        {
          alert("paila no sirve  ");
        }
      });
  }

//SIRVIÓ COMO AYUDA PARA SACAR LOS FILTROS
// function cargaFiltros2()
// {
//   const peticion ="filtros";

//   $.ajax(
//     {
//       type: "POST",
//       url: "./index.php",
//       data: {"_peticion": peticion},
//       success: function(data)
//       {
//         let datos = JSON.parse(data); 
//         console.log(datos);
//         console.log(datos["ciudades"]);
//         console.log(datos["tipo"]);
//       },
//       error: function(data)
//       {
//         alert("paila no sirve  ",data);
//       }
//     });
// }


// -----------------------        PUNTO 3: Filtro por rango de precios        --------------------------------------

//  Función que inicializa el elemento Slider: Rango de precios del formulario
function inicializarSlider()
{
  $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 200,
    to: 100000,
    prefix: "$"
  });
}

//Funcion al dar click en BUSCAR:
$("#submitButton").click(function(valor1,valor2)
{
  const peticion ="filtrosActivados";  
  const slider = $("#rangoPrecio").data("ionRangeSlider");
  const precioMinimo = slider.result.from;
  const precioMaximo = slider.result.to;
  const filtroCiudad = $("#selectCiudad").val();
  const filtroTipo = $("#selectTipo").val();

    $.ajax(
      {
        type: "POST",
        url: "./index.php",
        data: {"_peticion": peticion,"_precioMinimo": precioMinimo,"_precioMaximo":precioMaximo,"_filtroCiudad": filtroCiudad,"_filtroTipo": filtroTipo},
        success: function(data)
        {
          //console.log(data);    //Sirve para comprobar la información recibida del index.php

          let datos = JSON.parse(data); 
          let agregar = document.querySelector(".colContenido");
          agregar.innerHTML = "";
    
          for(let campo of datos)                       //Trae los datos del JSON pero cada objeto por separado
          {
            agregar.innerHTML += `
              <div class="card itemMostrado">
                <img src="img/home.jpg">
                <div class="card-stacked">
                  <div class="card-content">
                    <p><strong>Dirección: </strong>${campo.Direccion}</p>
                    <p><strong>Ciudad: </strong>${campo.Ciudad}</p>
                    <p><strong>Télefono: </strong>${campo.Telefono}</p>
                    <p><strong>Código postal: </strong>${campo.Codigo_Postal}</p>
                    <p><strong>Tipo: </strong>${campo.Tipo}</p>
                    <strong>Precio: </strong><strong class="precioTexto">${campo.Precio}</strong>
                  </div>
                  <div class="card-action">
                    <a href="#">Ver más</a>
                  </div>
                </div>
              </div>  
            `
          }
        },
      });

})