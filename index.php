<?php
    //Carga datos del archivo JSON
    $archivo = "data.json";
    $datos = file_get_contents($archivo);

    //--------- Punto1: Trae todos las propiedades:             ----------------------------------
    if($_POST["_peticion"] == "mostrarTodo")
    {
        echo $datos;
    }

    // --------- Punto 2: Carga los filtros con opciones:           ------------------------------
    if($_POST["_peticion"] == "filtros")
    {
        $data = array(
            "ciudades" => array ("New York", "Orlando", "Los Angeles", "Houston", "Washington", "Miami"),
            "tipo"=> array ("Casa", "Casa de Campo", "Apartamento"),
        );

        echo json_encode($data);
    }

    // -------------Punto 3: Carga anuncios por rango de precios:        ----------------------------
    
    if($_POST["_peticion"] == "filtrosActivados")
    {
        $data = json_decode($datos,true);
        $precioMin = $_POST["_precioMinimo"];
        $precioMax = $_POST["_precioMaximo"];
        $seleccionaCiudad = $_POST["_filtroCiudad"];
        $seleccionaTipo = $_POST["_filtroTipo"];

        //---------------------     Filtro por Precio
        $filtroPrecios = array();                                                   // Se creo un arreglo que se alimentará con el siguiente foreach
        
        foreach($data as $posicion)
        { 
            $precio = $posicion["Precio"];
            $_precio = str_replace(array('$',','),"",$precio);                       //Como el precio en el archivo JSON está son signos $ y comas toca quitarlos para que dectecte como un número. El método str_replace lo permite. Dentro de este se creó un array para colocar los caracteres que se desean eliminar, si fuera solo un caracter, no seria necesario colocar un array dentro. El segundo parametro es con que reemplazara, aca es vacìo, y el tercer parametro es donde
        
            if($_precio >= $precioMin && $_precio <= $precioMax)
            {
                array_push($filtroPrecios,$posicion);                                //Si cumple la condición de precio arregla el registro de la posición al arreglo filtroPrecios
            }
        }
        // $resultado3 = json_encode($filtroPrecios);                                //Sirve para ver como quedó alimentado el primer array de filtroPrecios
        // echo $resultado3;
        // echo "</br></br></br></br>";

        // -------------------    Filtro por ciudad:
        $filtroCiudad = array();
        
        foreach($filtroPrecios as $posicion)
        {
            $jsonCiudad = $posicion["Ciudad"];

            if($seleccionaCiudad != null)                                           //Esto se coloca para que el metodo "strpos" utilizado abajo para buscar una palabra no se reviente si va vacío.
            {
                if(strpos($jsonCiudad,$seleccionaCiudad) !== false)                 //Acá le estoy diciendo que si el objeto del archivo json contiene la ciudad que se filtro, si no es falso, entonces que agrege el registro al array. strpos es un método para buscar si una cadena contiene una palabra o algo
                {
                    array_push($filtroCiudad,$posicion);
                }
            }
            else
            {   
                $filtroCiudad = $filtroPrecios;
                break;                                                                 //Este rompre el ciclo foreach porque el filtro Ciudad esta vacio y simplemente el arreglo seria el mismo de arriba de Precios
            }
        }
        
        // $resultado2 = json_encode($filtroCiudad);                                 //Sirve para hacerle seguimiento al segundo array después de filto de ciudad partiendo del arreglo de filtroPrecios 
        // echo $resultado2;
        // echo "</br></br></br></br>";
        
        // ------------------   Filtro por Tipo:
        $filtroTipo = array();
        
        foreach($filtroCiudad as $posicion)
        {
            $jsonTipo = $posicion["Tipo"];
        
            if($seleccionaTipo != null)
            {
                if(strpos($jsonTipo,$seleccionaTipo) !== false)
                {
                    array_push($filtroTipo,$posicion);
                }
            }
            else
            {
                $filtroTipo = $filtroCiudad;  
                break;                                                                               //Este rompre el ciclo foreach porque el filtro Tipo esta vacio y simplemente el arreglo seria el mismo de Ciudad        
            }
        }
        
        $resultado = json_encode($filtroTipo);                                                       //Codifica el último arreglo ya pasado los 3 filtros para pasarlo a index.js
        echo $resultado;                                                                            //Envía respuesta con los datos filtrados a index.js       
        //echo "{'result': 'success', 'message': 'Proceso exitoso', 'data': $resultado}";                 
        //fclose($archivo);
    }

?>