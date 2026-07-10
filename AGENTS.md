# Proyecto
Sistema ERP en CodeIgniter 3.2

## Stack
- PHP 8.2
- CodeIgniter 3.2
- MySQL
- Bootstrap 5
- jQuery

## Estructura
/application
    controllers
    models
    views
/assets
/uploads

## Convenciones
- No usar Query Builder fuera de Models.
- Toda respuesta AJAX en JSON.
- Mantener compatibilidad con CI 3.2.
- No instalar librerías nuevas sin autorización.
- Reutilizar helpers existentes.

## Base de datos
- agency_id es el identificador del tenant.
- Los pacientes son usuarios con rol_id = 8.

## Nunca hacer
- No modificar rutas existentes.
- No cambiar nombres de tablas.
- No eliminar funciones sin autorización.

Antes de implementar cualquier envío de correo, analiza:

application/models/Email_model.php

Comprende cómo funciona `send_mail_request()` y reutilízalo en todos los nuevos endpoints.

No modifiques `Email_model` salvo que sea estrictamente necesario y expliques por qué.