# app_calendario


# Nombre del proyecto
Es una aplicación desarrollada en PHP y Angular 19, utiliza una base de datos MYSQL, utiliza el SSO para login y una validación extra en la base de datos en la tabla de usuarios. Esta aplicación se encarga de gestionar los calendarios académicos, financieros y de grados, también nos permite gestionar los usuarios los roles y ver los logs del sistema.


## Enlaces de documentación del proyecto
 - [Documentación](https://uniminuto0.sharepoint.com/:f:/s/G-PROYECTOSTI/IgCKXotcjXphS4yD8Nl5VRpWAa7xg9NfygMHJ4x9K7vFDI4?e=GgO5iH)

## Referencias de API (si se necesita)
#### Ítems
Descripción si se necesita
```http
  GET (verbo) /api/items (ruta)
```
| Parámetro | Tipo     | Descripción                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |


## Autores

- jeyson Triana


## Ambiente de pruebas
Descripción y link del ambiente

Link: [Pruebas Front](https://testcalendarios.uniminuto.edu)

Link: [Pruebas Back](https://testcalendarios.uniminuto.edu/api)


## Deployment

Descripción del deployment

```bash
  Para levantar el front en local se debe ejeucutar el comando `ng serve -o`
  
  Para crear el compilado se debe ejecutar el comando `ng build`
```


## Environment Variables
Descripción y listado de los Environment

`apiUrl`  URL base del backend de la aplicación

`baseUrl` URL de redirección del frontend (app Angular)

`clientId` Id del cliente de autenticación de Azure para el SSO

`authority` Url de autorizacion para realizar el login de SSO

`redirectUri` Url de redirección cuando el usuario se haya logeado exitosamente

## Tech Stack

**Client:** PHP (Backend), Angular V19 (Front)

**Server:** Linux, Contenedor de docker con apache


