# Contexto del Proyecto - Sistema ERP (Recetar Fácil / Recomendación Fácil)

Este documento proporciona una visión general técnica detallada de la arquitectura actual, stack de tecnologías, estructura de carpetas, convenciones, problemas detectados y recomendaciones para el desarrollo continuo del sistema ERP.

---

## 1. Arquitectura del Proyecto

El sistema está diseñado bajo un enfoque híbrido que combina la arquitectura clásica MVC basada en servidor con un backend de servicios API RESTful (Stateless):

- **Arquitectura Base**: **MVC (Model-View-Controller)** implementado sobre el framework **CodeIgniter 3.2**.
- **Acceso a Datos**: Los controladores no ejecutan consultas SQL directas; delegan la persistencia e interacción de datos en los **Models** correspondientes utilizando el **Query Builder (Active Record)** de CodeIgniter.
- **Multitenancy (Multi-inquilino)**: La plataforma está segmentada por agencias/sucursales utilizando la columna `agency_id` (y en algunos casos `company_id`) en la tabla `user` y demás tablas transaccionales. Todas las consultas y operaciones filtran la información en base al tenant activo.
- **Tipos de Interfaz**:
  - **Portal Web Integrado**: Controladores tradicionales como `application/controllers/Portal.php` cargan vistas directas PHP (`.php`) que devuelven HTML al navegador.
  - **REST API**: Controladores ubicados en `application/controllers/api/` que funcionan sin estado (Stateless), procesando peticiones HTTP (GET, POST, PUT, DELETE, OPTIONS) y respondiendo estrictamente en formato JSON.

---

## 2. Tecnologías y Dependencias

El stack tecnológico identificado en el backend es el siguiente:

- **Lenguaje**: PHP 8.2 (compatible con el entorno actual).
- **Framework**: CodeIgniter 3.2.x (fork mantenido activamente para soporte de PHP 8.x).
- **Base de Datos**: MySQL (manejada mediante el controlador de conexión `mysqli` en PHP).
- **Estilos y Componentes de Interfaz**: Bootstrap 5 y jQuery para la interactividad clásica en el portal.
- **Dependencias y Librerías Externas**:
  - **Dotenv**: `vlucas/phpdotenv` (cargado en `application/config/dotenv.php` a través del cargador de composer).
  - **PHPMailer**: Para envío de correos, aunque existe un modelo `Email_model` que gestiona notificaciones por SMTP.
  - **Evolution API**: Utilizado en `Whatsapp_model` para despachar mensajes a través de endpoints de WhatsApp REST API externos.

---

## 3. Estructura de Carpetas

La distribución física del proyecto se organiza de la siguiente manera:

```text
/recetar_facil (Raíz del proyecto backend)
│
├── application/                     # Código fuente principal de CodeIgniter
│   ├── config/                      # Configuración de base de datos, rutas, autoload y entorno
│   ├── controllers/                 # Controladores del portal web tradicional
│   │   └── api/                     # Controladores exclusivos de la API RESTful (Auth, Patients, etc.)
│   ├── core/                        # Clases Core del sistema (vacío en este momento)
│   ├── helpers/                     # Helpers de ayuda en el desarrollo
│   ├── hooks/                       # Ganchos de ejecución personalizada
│   ├── language/                    # Diccionarios de internacionalización
│   ├── libraries/                   # Librerías y componentes personalizados
│   ├── models/                      # Modelos de interacción con la BD (Crud_model, Patients_model, etc.)
│   └── views/                       # Vistas de servidor (HTML/PHP)
│       └── backend/                 # Vistas organizadas por perfiles de usuario (admin, user, emails, etc.)
│
├── docs/                            # Documentación técnica y especificaciones de las APIs
│   ├── API_DOCUMENTATION.md         # Documentación de APIs de Autenticación, Pacientes y Recetas
│   └── API_DOCUMENTATION_CONSULTATIONS.md # Documentación del módulo Consultations
│
├── public/                          # Archivos estáticos accesibles públicamente
│   ├── assets/                      # Hojas de estilo CSS, JS, fuentes, imágenes y dependencias (vendor)
│   ├── comprobantes/                # Almacenamiento temporal de facturas/comprobantes
│   └── uploads/                     # Subidas temporales públicas
│
├── uploads/                         # Directorio raíz para almacenamiento privado de archivos subidos
│   ├── consultations/               # Archivos adjuntos y multimedia de las consultas médicas
│   └── temp/                        # Archivos PDF o temporales generados
│
└── composer.json                    # Definición de dependencias de PHP
```

---

## 4. Sistema de Autenticación

El sistema implementa dos mecanismos de autenticación independientes dependiendo del punto de entrada:

### A. Autenticación del Portal Web (Session-based)
- Se maneja a través de sesiones nativas (`CI_Session`).
- Al iniciar sesión en `Login.php`, las credenciales se validan contra la base de datos comparando el hash `sha1($password)`.
- Si las credenciales son válidas, se guardan en sesión las siguientes variables de estado:
  - `user_login` (indicador booleano)
  - `rol_id` (identificación del rol de usuario, ej. `8` para Paciente, `2` o `7` para Doctores/Especialistas)
  - `login_user_id` (ID numérico del usuario en la tabla `user`)
  - `login_type` / `login_name` (descripción del rol)
  - `current_agency` (el tenant activo `agency_id` del usuario)
- La protección de accesos se realiza en los controladores del portal validando si `$this->session->userdata('login_user_id')` está vacío.

### B. Autenticación de la API REST (Token-based - JWT)
- Es una arquitectura completamente **Stateless** (sin estado en el servidor).
- El endpoint `/api/auth/login` recibe `username` y `password`, los valida con `sha1` y genera un **JSON Web Token (JWT)**.
- El JWT se firma usando el algoritmo HMAC con SHA-256 (`HS256`) y está compuesto por:
  - **Header**: Especifica el tipo y algoritmo.
  - **Payload**: Datos esenciales del usuario como `user_id`, `email`, `rol_id`, `agency_id` y `exp` (duración establecida en 2 horas).
  - **Signature**: Firma criptográfica del token usando una clave secreta (`jwt_secret`).
- El cliente (por ejemplo, la SPA en el frontend) debe enviar el token en la cabecera `Authorization: Bearer <JWT_TOKEN>` en cada petición.
- Para verificarlo, los controladores API ejecutan `$this->validate_request()`, que extrae la cabecera, verifica la firma del JWT y comprueba que el token no haya expirado.

---

## 5. Consumo de API

- **Formato**: Comunicación exclusiva en formato JSON.
- **Estructura de Respuesta Uniforme**:
  - Peticiones Exitosas: Retornan código HTTP 200/201 con la estructura:
    ```json
    {
      "status": "success",
      "data": { ... } // Objeto o array con los recursos
    }
    ```
  - Errores: Retornan códigos HTTP de la serie 4xx/5xx con la estructura:
    ```json
    {
      "status": "error",
      "message": "Descripción detallada del error"
    }
    ```
- **Paginación**: Endpoints que retornan listas (como `/api/patients`) reciben los parámetros de consulta `page` y `limit` para segmentar los datos de manera eficiente.
- **CORS pre-flight**: Los controladores API responden a las peticiones HTTP `OPTIONS` con un estado `200 OK` limpio y las cabeceras CORS correspondientes para permitir solicitudes cruzadas desde clientes web SPA de otros dominios.

---

## 6. Rutas

Las rutas del sistema están definidas en `application/config/routes.php` y se dividen en dos grupos principales:

1. **Rutas del Portal (Portal UI)**:
   - Apuntan a vistas web tradicionales cargadas desde PHP.
   - Ejemplo: `portal/prescriptions`, `portal/consultations`, `portal/patients`, `portal/appointments`.
2. **Rutas de la API REST (`api/`)**:
   - Mapeadas a los controladores dentro de `controllers/api/`.
   - Ejemplo: `/api/auth/login`, `/api/patients`, `/api/appointments`, `/api/prescriptions`, `/api/consultations`.
3. **Priorización de Segmentos**:
   - En las rutas del módulo de Consultas, las rutas con segmentos fijos (por ejemplo, `/api/consultations/recent` o `/api/consultations/blank`) se colocan estrictamente **antes** de la ruta genérica parametrizada `/api/consultations/(:num)`. Esto evita que las palabras clave sean interpretadas como identificadores numéricos.

---

## 7. Manejo de Estado

- **En el Backend (Portal)**: El estado del usuario autenticado se persiste a través del driver de sesión configurado en CodeIgniter (`sess_driver = 'files'`).
- **En el Backend (API)**: El backend no mantiene estado en memoria ni disco. Toda la información necesaria para procesar la petición (como el ID del usuario y el `agency_id` del tenant) se extrae directamente del Payload del JWT decodificado en cada request.
- **En el Frontend**: La aplicación cliente (por ejemplo, el proyecto SPA `recomendar_facil` que se observa corriendo de forma local con `npm run dev`) es la responsable exclusiva de almacenar el token de forma persistente (en `localStorage` o cookies) y mantener el estado local de la sesión en su interfaz gráfica.

---

## 8. Componentes Reutilizables

- **`Crud_model.php`**: Es el modelo principal e histórico de la aplicación. Centraliza funciones comunes de cálculo (como `calcularEdad()`), guardado en bitácora (`log_binnacle`), traducciones del portal (`get_phrase`), y administración de entidades generales.
- **`Email_model.php`**: Contiene la función centralizada `send_mail_request($to, $subject, $message, $files)`. Se encarga de enviar correos electrónicos formateados en HTML utilizando la configuración SMTP de Hostinger. Debe ser reutilizado por cualquier nuevo endpoint que requiera emitir notificaciones por correo.
- **`Whatsapp_model.php`**: Centraliza el envío de notificaciones y archivos multimedia a través de la integración de Evolution API (`sendWhatsapp` y `sendWhatsappFile`).
- **Partials y Layouts**: Las vistas del portal web tradicional utilizan fragmentos comunes como barras de navegación, menús laterales y cabeceras dentro de la carpeta `views/backend/partials`.

---

## 9. Convenciones de Código

Las siguientes reglas y lineamientos rigen el desarrollo en el proyecto:

- **Restricción del Query Builder**: El uso de Query Builder (`$this->db->get()`, `$this->db->where()`, etc.) está estrictamente restringido a los archivos ubicados en `application/models/`. Los controladores no deben hacer operaciones de base de datos directas.
- **AJAX / JSON**: Toda respuesta dirigida a un cliente API o petición asíncrona debe retornar una cabecera `Content-Type: application/json` y datos en JSON.
- **Compatibilidad**: Se debe garantizar la compatibilidad con **PHP 8.2** y las convenciones clásicas de **CodeIgniter 3.2**.
- **Tenant Isolation**: Toda consulta y guardado de información debe asociarse con `agency_id` para garantizar que un cliente de un tenant no pueda acceder ni modificar información de otro tenant.
- **Estabilidad de Rutas y Base de Datos**: Está prohibido cambiar nombres de tablas existentes, eliminar funciones del core sin autorización previa, o cambiar rutas establecidas para evitar romper el acoplamiento con sistemas de terceros o el cliente frontend.

---

## 10. Variables de Entorno

El framework está configurado para cargar variables de entorno usando `phpdotenv` a través de `application/config/dotenv.php`. Sin embargo, en el estado actual de la base de código, la mayoría de los componentes sensibles omiten el uso de variables de entorno y tienen valores quemados ("hardcoded"):

- **Base de Datos**: Las credenciales de base de datos (puerto `3307`, usuario, contraseña y base de datos) están quemadas en `application/config/database.php`.
- **Secretos de JWT**: La clave secreta para la firma de tokens por defecto (`super-secret-key-change-in-production-1234567890!`) está declarada directamente en las propiedades de cada controlador de la API.
- **Credenciales SMTP**: La configuración de host, usuario y clave para el envío de notificaciones por email está escrita directamente en `application/models/Email_model.php`.
- **Credenciales de WhatsApp**: Los tokens y endpoints de Evolution API están estáticos en `application/models/Whatsapp_model.php`.

---

## 11. Problemas Detectados

Durante el análisis del proyecto se identificaron los siguientes puntos débiles, fallos de seguridad y oportunidades de mejora:

1. **Hashing de Contraseñas Obsoleto**: El sistema utiliza la función `sha1()` para cifrar y verificar las contraseñas de los usuarios. SHA-1 no es un algoritmo seguro para contraseñas hoy en día debido a la facilidad de descifrado mediante tablas de búsqueda y ataques de fuerza bruta.
2. **Duplicación de Código de JWT**: Las funciones de manejo, codificación, decodificación y validación de tokens JWT (`validate_request()`, `validate_jwt()`, `get_bearer_token()`, `base64UrlEncode()`, `base64UrlDecode()`) están duplicadas textualmente en cada uno de los controladores de la API. Esto hace que el código sea difícil de mantener y propenso a errores.
3. **Credenciales Sensibles Quemadas en Código**: La presencia de contraseñas de bases de datos, llaves de API externas (Evolution API y JWT) y contraseñas de correos electrónicos directamente en el código fuente representa un alto riesgo de seguridad si el repositorio se expone.
4. **Vulnerabilidad potencial en Geolocalización (`Login->ip_details`)**: Se utiliza `unserialize(file_get_contents(...))` apuntando a un servicio externo no seguro (`http://www.geoplugin.net/php.gp?ip=$user_ip`). Esto introduce un riesgo de **Inyección de Objetos PHP** si el servicio de terceros llegara a ser comprometido, además de poder congelar el login de los usuarios si la petición HTTP externa experimenta latencia o caídas.
5. **Driver de Sesiones Incompleto**: La directiva `$config['sess_save_path']` está configurada como `NULL` mientras se usa el driver de `files`. En algunos sistemas operativos o servidores web con configuraciones estrictas, esto puede provocar errores de escritura o advertencias de PHP al no tener una ruta de almacenamiento de archivos explícita y writable configurada para las sesiones de CodeIgniter.
6. **Dependencias y librerías importadas de forma obsoleta**: En la función `Login->newpassword()`, se hace un include manual de un archivo local `require("class.phpmailer.php")` en lugar de hacer uso de autoloading o delegar el envío de correos en `Email_model->send_mail_request()`.

---

## 12. Recomendaciones

Para solucionar los problemas identificados y mejorar la calidad del software, se proponen las siguientes acciones:

- [ ] **Abstraer la lógica de JWT**: Crear una librería centralizada de CodeIgniter (ej. `application/libraries/Jwt_auth.php`) o implementar un controlador base común en `application/core/MY_Controller.php` (ej. `API_Controller`) para centralizar la validación de tokens JWT, de manera que todos los controladores API hereden de él y se elimine la redundancia de código.
- [ ] **Migrar Hashing a `password_hash()`**: Cambiar la validación de contraseñas del uso de `sha1($password)` a las funciones nativas seguras de PHP `password_hash($password, PASSWORD_BCRYPT)` y `password_verify()`.
- [ ] **Migrar Configuraciones Sensibles al archivo `.env`**: Externalizar todas las credenciales de bases de datos, tokens de WhatsApp, credenciales SMTP y el secreto de firmas JWT hacia el archivo de variables de entorno `.env` en la raíz del proyecto, consumiéndolas mediante la función nativa `getenv()` o el superglobal `$_ENV`.
- [ ] **Reemplazar `unserialize` en Geolocalización**: Modificar la obtención de la geolocalización en `Login->ip_details` para que consuma la respuesta en formato JSON (`json_decode()`), eliminando el riesgo de inyección de objetos y añadiendo un tiempo de espera controlado (timeout) para la petición cURL.
- [ ] **Establecer una ruta válida para `sess_save_path`**: Definir una ruta explícita y escribible dentro del servidor para el almacenamiento de archivos de sesión en `application/config/config.php` para evitar errores y fallos intermitentes de sesión.
- [ ] **Reutilizar `Email_model` en todos los flujos de correo**: Reemplazar cualquier llamada manual a clases obsoletas de PHPMailer (como en `Login->newpassword()`) por llamadas unificadas a `Email_model->send_mail_request()`, asegurando que las notificaciones salgan consistentemente por un único canal SMTP configurado centralmente.
