# Plan y Lista de Tareas para Verificación Manual de Endpoints API REST

Este documento contiene la **lista completa de tareas de prueba y verificación manual** para evaluar exhaustivamente todos los endpoints de la API REST del sistema ERP (Recetar Fácil / Recomendación Fácil). Está diseñado para ser utilizado por ingenieros de QA, desarrolladores o evaluadores del sistema mediante herramientas como **Postman**, **Insomnia**, **Thunder Client** o **cURL**.

---

## 1. Guía de Ejecución y Prerequisitos

### Requisitos Previos
1. **Base URL de Pruebas**: `http://localhost/recetar_facil` (o el dominio asignado en el entorno de staging/prueba).
2. **Cliente HTTP**: Postman / Insomnia / cURL.
3. **Base de Datos Poblar**: Tener al menos un usuario registrado con rol de Doctor (`rol_id = 7` o `2`), un usuario con rol de Paciente (`rol_id = 8`), y un `agency_id` válido.

### Cabeceras HTTP Estándar
- `Content-Type: application/json`
- `Accept: application/json`
- `Authorization: Bearer <JWT_TOKEN>` *(Requerido para todos los endpoints que exigen autenticación)*.

---

## 2. Resumen General de Módulos y Tareas

| Código Módulo | Nombre del Módulo | Total Endpoints / Tareas | Estado de Verificación |
| :--- | :--- | :---: | :---: |
| **AUTH** | Autenticación y Gestión de Usuarios | 14 | `[ ] 0/14 Verificados` |
| **PAT** | Pacientes y Antecedentes | 8 | `[ ] 0/8 Verificados` |
| **APP** | Citas y Agendamiento Médico | 10 | `[ ] 0/10 Verificados` |
| **RX** | Recetas Médicas y Catálogo | 11 | `[ ] 0/11 Verificados` |
| **CON** | Consultas Médicas e Historia Clínica | 16 | `[ ] 0/16 Verificados` |
| **SRV** | Catálogo de Servicios Médicos | 5 | `[ ] 0/5 Verificados` |
| **TRT** | Planes de Tratamiento y Sesiones | 16 | `[ ] 0/16 Verificados` |
| **REW** | Recompensas y Ruleta de Puntos | 4 | `[ ] 0/4 Verificados` |
| **DSH** | Dashboard Estadístico | 1 | `[ ] 0/1 Verificado` |
| **TOTAL** | **Sistema Completo** | **85** | `[ ] 0/85 Verificados` |

---

## 2.1 Listado Simplificado de Actividades (Para Copiar a Word)

### Módulo 1: Autenticación y Perfil
1. Iniciar Sesión (Login) y Generación de Token
2. Consultar Perfil del Usuario Autenticado
3. Renovar Sesión de Usuario (Refresh Token)
4. Cerrar Sesión (Logout)
5. Registro de Nuevo Médico / Usuario
6. Verificación de Correo Electrónico mediante Código
7. Solicitar Código de Recuperación de Contraseña
8. Validar Código de Restablecimiento de Contraseña
9. Restablecer Contraseña con Código de Verificación
10. Actualizar Datos Personales de Perfil
11. Subir / Actualizar Foto de Perfil
12. Cambiar Contraseña del Usuario Autenticado
13. Consultar Información de la Clínica / Sucursal
14. Actualizar Datos de la Clínica / Sucursal

### Módulo 2: Gestión de Pacientes
1. Listar Pacientes Registrados
2. Ver Detalle e Información de un Paciente
3. Registrar Nuevo Paciente
4. Actualizar Información de Paciente Existente
5. Consultar Antecedentes Médicos del Paciente
6. Registrar / Editar Antecedentes Médicos del Paciente
7. Consultar Historial de Consultas del Paciente
8. Búsqueda Rápida de Pacientes

### Módulo 3: Citas y Agendamiento Médico
1. Listar Citas Médicas
2. Consultar Citas Agendadas para Hoy
3. Consultar Próximas Citas Médicas
4. Consultar Citas Médicas por Doctor
5. Consultar Citas Médicas por Paciente
6. Ver Detalle de Cita Médica
7. Crear / Agendar Nueva Cita Médica
8. Reagendar / Editar Cita Médica
9. Cancelar Cita Médica con Motivo
10. Eliminar Cita Médica

### Módulo 4: Recetas y Prescripciones Médicas
1. Listar Recetas Médicas
2. Consultar Recetas por Paciente
3. Consultar Recetas Emitidas por Doctor
4. Ver Detalle de Receta Médica
5. Crear Nueva Receta Médica
6. Modificar / Editar Receta Médica
7. Eliminar Receta Médica
8. Generar y Descargar PDF de Receta
9. Compartir Receta Médica por WhatsApp o Correo
10. Buscar Medicamentos en el Catálogo
11. Consultar Dosis Sugeridas de Medicamentos

### Módulo 5: Consultas Médicas e Historia Clínica
1. Listar Consultas Médicas
2. Crear Consulta Médica Completa
3. Crear Consulta Médica en Blanco (Borrador)
4. Ver Detalle Completo de Consulta Médica
5. Modificar / Editar Consulta Médica
6. Eliminar Consulta Médica
7. Búsqueda de Consultas por Motivo o Diagnóstico
8. Consultar Consultas Médicas Recientes
9. Filtrar Consultas por Rango de Fechas
10. Consultar Parámetros Clínicos y Signos Vitales
11. Consultar Expediente de Consultas por Paciente
12. Consultar Consultas Realizadas por Doctor
13. Consultar Archivos Multimedia Adjuntos a la Consulta
14. Subir Archivo o Fotografía a la Consulta Médica
15. Eliminar Archivo Adjunto de la Consulta Médica

### Módulo 6: Catálogo de Servicios Médicos
1. Listar Servicios Médicos Disponibles
2. Ver Detalle de Servicio Médico
3. Crear Nuevo Servicio Médico
4. Actualizar Datos o Precio de Servicio Médico
5. Eliminar Servicio Médico

### Módulo 7: Planes de Tratamiento y Sesiones de Pacientes
1. Listar Plantillas de Planes de Tratamiento
2. Crear Plantilla de Plan de Tratamiento
3. Ver Detalle de Plantilla de Tratamiento
4. Actualizar Plantilla de Tratamiento
5. Eliminar Plantilla de Tratamiento
6. Listar Tratamientos Asignados a Pacientes
7. Asignar Tratamiento a un Paciente
8. Ver Detalle y Avance del Tratamiento de un Paciente
9. Actualizar Estado de Tratamiento de Paciente
10. Eliminar Tratamiento Asignado a Paciente
11. Consultar Sesiones de Tratamiento del Paciente
12. Registrar Nueva Sesión de Tratamiento
13. Eliminar Sesión de Tratamiento
14. Listar Servicios Extras en Tratamiento
15. Agregar Servicio Extra a Tratamiento de Paciente
16. Eliminar Servicio Extra del Tratamiento

### Módulo 8: Sistema de Recompensas y Puntos
1. Listar Catálogo de Premios Disponibles
2. Consultar Puntos Acumulados del Paciente
3. Consultar Historial de Puntos y Canjes
4. Girar Ruleta de Recompensas y Otorgar Premio

### Módulo 9: Dashboard Estadístico
1. Consultar Totales y Métricas Generales (Pacientes, Citas, Consultas, Ingresos)

---

## 3. Módulo 1: Autenticación y Perfil (`/api/auth`)

---

### `TASK-AUTH-001`: Iniciar Sesión (Login) y Generar Token JWT
- **Endpoint**: `POST /api/auth/login`
- **Autenticación**: No requerida.
- **Descripción**: Autentica credenciales de usuario (username/email y password) y devuelve un token JWT con vigencia de 2 horas.
- **Request Body**:
```json
{
  "username": "doctor_test",
  "password": "Password123!"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con `"status": "success"`, el string `"token"` y `"expires_in": 7200`.
  - `[ ]` **Credenciales Inválidas**: Retorna HTTP `401 Unauthorized` con mensaje de error si la clave o usuario son incorrectos.
  - `[ ]` **Parámetros Faltantes**: Retorna HTTP `400 Bad Request` si falta `username` o `password`.

---

### `TASK-AUTH-002`: Obtener Perfil del Usuario Autenticado
- **Endpoint**: `GET /api/auth/me`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Descripción**: Obtiene los datos del usuario asociado al token activo (`user_id`, `name`, `email`, `rol_id`, `agency_id`).
- **Request Body**: N/A
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con la información del usuario autenticado en `data`.
  - `[ ]` **Token Inválido/Ausente**: Retorna HTTP `401 Unauthorized`.

---

### `TASK-AUTH-003`: Renovar Token JWT (Refresh)
- **Endpoint**: `POST /api/auth/refresh`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Descripción**: Emite un nuevo token JWT renovado manteniendo los datos de sesión.
- **Request Body**: `{}`
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con un nuevo `"token"` válido.
  - `[ ]` **Token Inválido**: Retorna HTTP `401 Unauthorized`.

---

### `TASK-AUTH-004`: Cerrar Sesión (Logout)
- **Endpoint**: `POST /api/auth/logout`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Descripción**: Confirma el cierre de sesión en el cliente.
- **Request Body**: `{}`
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` indicando descarte del token.

---

### `TASK-AUTH-005`: Registro de Doctor / Usuario
- **Endpoint**: `POST /api/auth/register`
- **Autenticación**: No requerida.
- **Descripción**: Registra una nueva cuenta de médico y envía correo de verificación.
- **Request Body**:
```json
{
  "name": "Carlos",
  "last_name": "Mendoza",
  "email": "dr.mendoza@example.com",
  "username": "drmendoza",
  "password": "Password123!",
  "phone": "+50255551234",
  "agency_id": 1
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` / `201 Created` con mensaje de verificación enviada.
  - `[ ]` **Email Duplicado**: Retorna HTTP `400` / `409` si el correo ya existe.

---

### `TASK-AUTH-006`: Verificar Correo Electrónico
- **Endpoint**: `POST /api/auth/verify-email`
- **Autenticación**: No requerida.
- **Descripción**: Valida el código de confirmación recibido por email para activar la cuenta.
- **Request Body**:
```json
{
  "code": "123456"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` notificando activación exitosa.
  - `[ ]` **Código Erróneo**: Retorna HTTP `400 Bad Request`.

---

### `TASK-AUTH-007`: Solicitar Recuperación de Contraseña
- **Endpoint**: `POST /api/auth/forgot-password`
- **Autenticación**: No requerida.
- **Descripción**: Genera un código OTP para restablecimiento de contraseña enviado al correo.
- **Request Body**:
```json
{
  "email": "dr.mendoza@example.com"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK`.

---

### `TASK-AUTH-008`: Validar Código de Restablecimiento
- **Endpoint**: `POST /api/auth/verify-reset-code`
- **Autenticación**: No requerida.
- **Descripción**: Verifica que el código OTP ingresado por el usuario sea válido y no haya expirado.
- **Request Body**:
```json
{
  "code": "123456"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` indicando que el código es válido.

---

### `TASK-AUTH-009`: Restablecer Contraseña
- **Endpoint**: `POST /api/auth/reset-password`
- **Autenticación**: No requerida.
- **Descripción**: Establece una nueva contraseña validando el OTP.
- **Request Body**:
```json
{
  "code": "123456",
  "new_password": "NewSecurePassword123!",
  "confirm_password": "NewSecurePassword123!"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK`.
  - `[ ]` **Contraseñas No Coinciden**: Retorna HTTP `400 Bad Request`.

---

### `TASK-AUTH-010`: Actualizar Perfil de Usuario
- **Endpoint**: `POST /api/auth/profile`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Descripción**: Actualiza datos personales del usuario en sesión (`name`, `last_name`, `phone`).
- **Request Body**:
```json
{
  "name": "Carlos Alberto",
  "last_name": "Mendoza Ruiz",
  "phone": "+50255554321"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con datos actualizados.

---

### `TASK-AUTH-011`: Actualizar Foto de Perfil
- **Endpoint**: `POST /api/auth/profile/photo`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Descripción**: Sube y actualiza la imagen de perfil del usuario.
- **Form Data**: File upload (`photo`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con la URL de la imagen subida.

---

### `TASK-AUTH-012`: Cambiar Contraseña del Usuario Autenticado
- **Endpoint**: `POST /api/auth/profile/password`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Descripción**: Cambia la contraseña actual por una nueva validando la clave anterior.
- **Request Body**:
```json
{
  "current_password": "Password123!",
  "new_password": "NewPassword456!",
  "confirm_password": "NewPassword456!"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK`.
  - `[ ]` **Clave Actual Incorrecta**: Retorna HTTP `400 Bad Request`.

---

### `TASK-AUTH-013`: Obtener Datos de la Clínica / Sucursal (Tenant)
- **Endpoint**: `GET /api/auth/clinic`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Descripción**: Devuelve la información del tenant activo (`agency_id`) como nombre, dirección, logo y teléfono.
- **Request Body**: N/A
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con el objeto de la agencia/clínica.

---

### `TASK-AUTH-014`: Actualizar Datos de la Clínica / Sucursal
- **Endpoint**: `POST /api/auth/clinic/update`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Descripción**: Actualiza los datos de la clínica o agencia del usuario.
- **Request Body**:
```json
{
  "name": "Clínica Médica Central",
  "address": "Av. Reforma 10-00 Zona 10",
  "phone": "+50222223333"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK`.

---

## 4. Módulo 2: Gestión de Pacientes (`/api/patients`)

---

### `TASK-PAT-001`: Listar Pacientes (Con Paginación y Filtros)
- **Endpoint**: `GET /api/patients`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Query Params**: `page` (default 1), `limit` (default 10), `search` (opcional).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con listado de pacientes filtrados por `agency_id` y metadatos de paginación (`total_results`, `total_pages`).
  - `[ ]` **Aislamiento Tenant**: Verificar que solo devuelva pacientes pertenecientes al `agency_id` del token.

---

### `TASK-PAT-002`: Obtener Detalle de un Paciente
- **Endpoint**: `GET /api/patients/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con datos completos del paciente.
  - `[ ]` **Paciente Inexistente / Otro Tenant**: Retorna HTTP `404 Not Found`.

---

### `TASK-PAT-003`: Crear un Nuevo Paciente
- **Endpoint**: `POST /api/patients/save`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "name": "Juan",
  "last_name": "Pérez",
  "email": "juan.perez@example.com",
  "phone": "+50255558888",
  "birthday": "1988-04-12",
  "gender": "M",
  "address": "Ciudad de Guatemala"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` / `201 Created` con el ID del nuevo paciente.
  - `[ ]` **Campos Obligatorios**: Valida que `name` no esté vacío.

---

### `TASK-PAT-004`: Actualizar Información de Paciente Existente
- **Endpoint**: `POST /api/patients/save/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "name": "Juan Carlos",
  "last_name": "Pérez Gómez",
  "phone": "+50255559999"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con los datos actualizados.

---

### `TASK-PAT-005`: Obtener Antecedentes Médicos del Paciente
- **Endpoint**: `GET /api/patients/{id}/backgrounds`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con antecedentes patológicos, no patológicos, quirúrgicos y hereditarios.

---

### `TASK-PAT-006`: Guardar / Actualizar Antecedentes Médicos
- **Endpoint**: `POST /api/patients/{id}/save-backgrounds`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "pathological": "Hipertensión arterial",
  "non_pathological": "No fuma",
  "surgical": "Apendicectomía en 2015",
  "family_history": "Diabetes mellitus materna",
  "allergies": "Penicilina"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK`.

---

### `TASK-PAT-007`: Obtener Historial de Consultas del Paciente
- **Endpoint**: `GET /api/patients/{id}/consultations`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna array de consultas históricas asociadas al paciente.

---

### `TASK-PAT-008`: Buscar Pacientes (Búsqueda Rápida)
- **Endpoint**: `GET /api/patients/search?q={query}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Coincidencias por nombre, apellido, teléfono o DPI.

---

## 5. Módulo 3: Citas y Agendamiento Médico (`/api/appointments`)

---

### `TASK-APP-001`: Listar Todas las Citas Médicas
- **Endpoint**: `GET /api/appointments`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Query Params**: `status` (opcional), `start_date`, `end_date`.
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con listado de citas filtradas por el tenant activo.

---

### `TASK-APP-002`: Obtener Citas Agendadas para Hoy
- **Endpoint**: `GET /api/appointments/today`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna únicamente citas del día actual.

---

### `TASK-APP-003`: Obtener Próximas Citas Médicas
- **Endpoint**: `GET /api/appointments/upcoming`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna citas futuras con fecha >= hoy.

---

### `TASK-APP-004`: Obtener Citas de un Doctor Específico
- **Endpoint**: `GET /api/appointments/doctor/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna citas asignadas a dicho médico.

---

### `TASK-APP-005`: Obtener Citas de un Paciente Específico
- **Endpoint**: `GET /api/appointments/patient/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna citas pertenecientes al paciente indicado.

---

### `TASK-APP-006`: Obtener Detalle de una Cita Médica
- **Endpoint**: `GET /api/appointments/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna datos detallados de la cita (paciente, fecha, hora, motivo, estado).
  - `[ ]` **Inexistente**: Retorna HTTP `404 Not Found`.

---

### `TASK-APP-007`: Crear una Nueva Cita Médica
- **Endpoint**: `POST /api/appointments`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "patient_id": 10,
  "doctor_id": 2,
  "appointment_date": "2026-08-15",
  "start_time": "10:00:00",
  "end_time": "10:30:00",
  "reason": "Consulta de seguimiento general",
  "status": "pending"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` / `201 Created` con el ID generado.
  - `[ ]` **Validación Horarios**: Retorna error si hay solapamiento de horario.

---

### `TASK-APP-008`: Actualizar Cita Médica
- **Endpoint**: `PUT /api/appointments/{id}` (o `POST /api/appointments/{id}`)
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "appointment_date": "2026-08-16",
  "start_time": "11:00:00",
  "reason": "Reagendado por solicitud del paciente"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con datos actualizados.

---

### `TASK-APP-009`: Cancelar Cita Médica
- **Endpoint**: `POST /api/appointments/{id}/cancel`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "cancellation_reason": "Emergencia personal del paciente"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Actualiza el estado a `cancelled`.

---

### `TASK-APP-010`: Eliminar Cita Médica
- **Endpoint**: `DELETE /api/appointments/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Elimina o archiva la cita retornando HTTP `200 OK`.

---

## 6. Módulo 4: Recetas y Prescripciones Médicas (`/api/prescriptions`)

---

### `TASK-RX-001`: Listar Recetas Médicas
- **Endpoint**: `GET /api/prescriptions`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Query Params**: `page`, `limit`, `search`.
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Listado de recetas del tenant activo.

---

### `TASK-RX-002`: Listar Recetas de un Paciente
- **Endpoint**: `GET /api/prescriptions/patient/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Filtra recetas emitidas para el `patient_id`.

---

### `TASK-RX-003`: Listar Recetas Emitidas por un Doctor
- **Endpoint**: `GET /api/prescriptions/doctor/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Filtra recetas creadas por el `doctor_id`.

---

### `TASK-RX-004`: Obtener Detalle de Receta Médica
- **Endpoint**: `GET /api/prescriptions/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna cabecera de la receta y lista de medicamentos prescritos.

---

### `TASK-RX-005`: Crear una Nueva Receta Médica
- **Endpoint**: `POST /api/prescriptions`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "patient_id": 10,
  "diagnosis": "Faringitis aguda",
  "notes": "Tomar abundante agua y guardar reposo",
  "medicines": [
    {
      "medicine_name": "Amoxicilina 500mg",
      "dose": "1 cápsula",
      "frequency": "Cada 8 horas",
      "duration": "7 días",
      "instructions": "Tomar después de los alimentos"
    }
  ]
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` / `201 Created` con el ID de receta.

---

### `TASK-RX-006`: Actualizar Receta Médica
- **Endpoint**: `PUT /api/prescriptions/{id}` (o `POST /api/prescriptions/{id}`)
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Modifica el diagnóstico o la lista de medicamentos.

---

### `TASK-RX-007`: Eliminar Receta Médica
- **Endpoint**: `DELETE /api/prescriptions/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Elimina la receta especificada.

---

### `TASK-RX-008`: Generar / Descargar PDF de Receta
- **Endpoint**: `GET /api/prescriptions/{id}/pdf`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna respuesta con PDF o la URL directa de descarga temporal del documento.

---

### `TASK-RX-009`: Compartir Receta vía WhatsApp / Email
- **Endpoint**: `POST /api/prescriptions/{id}/share`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "channel": "whatsapp",
  "phone": "+50255551234"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Invoca `Whatsapp_model` / `Email_model` y retorna HTTP `200 OK` confirmando el envío.

---

### `TASK-RX-010`: Buscar Medicamentos en Catálogo
- **Endpoint**: `GET /api/medicines/search?q={query}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna lista de coincidencias de fármacos disponibles.

---

### `TASK-RX-011`: Obtener Sugerencias de Dosis
- **Endpoint**: `GET /api/medicines/dose-suggestions?medicine_id={id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna frecuencias y dosis recomendadas del medicamento.

---

## 7. Módulo 5: Consultas Médicas e Historia Clínica (`/api/consultations`)

---

### `TASK-CON-001`: Listar Consultas Médicas
- **Endpoint**: `GET /api/consultations`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Query Params**: `search`, `date_from`, `date_to`, `patient_id`, `doctor_id`, `page`, `limit`.
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna lista paginada de consultas médicas del tenant activo.

---

### `TASK-CON-002`: Crear Consulta Médica Completa
- **Endpoint**: `POST /api/consultations`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "patient_id": 10,
  "chief_complaint": "Cefalea intensa y fiebre",
  "history_present_illness": "Inició hace 48 horas con pico febril de 38.5°C",
  "physical_examination": "Orofaringe hiperémica, no rigidez de nuca",
  "diagnosis": "Infección respiratoria superior",
  "treatment": "Paracetamol 500mg c/6h + Hidratación",
  "notes": "Regresar si persiste la fiebre por más de 72 horas",
  "follow_up_date": "2026-08-10",
  "status": 1
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` con `consultation_id`.

---

### `TASK-CON-003`: Crear Consulta Médica en Blanco (Borrador)
- **Endpoint**: `POST /api/consultations/blank`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "patient_id": 10
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Crea un registro en blanco y devuelve el `consultation_id` asignado.

---

### `TASK-CON-004`: Obtener Detalle Completo de Consulta
- **Endpoint**: `GET /api/consultations/details/{id}` (o `GET /api/consultations/{id}`)
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna datos del paciente, doctor, consulta y array de archivos adjuntos (`media`).

---

### `TASK-CON-005`: Actualizar Consulta Médica
- **Endpoint**: `PUT /api/consultations/{id}` (o `POST /api/consultations/{id}`)
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "diagnosis": "Infección respiratoria superior resuelta",
  "status": 1
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Actualización correcta del expediente de consulta.

---

### `TASK-CON-006`: Eliminar Consulta Médica
- **Endpoint**: `DELETE /api/consultations/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK`.

---

### `TASK-CON-007`: Buscar Consultas Médicas
- **Endpoint**: `GET /api/consultations/search?q={query}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Busca coincidencias en motivo, diagnóstico y paciente.

---

### `TASK-CON-008`: Obtener Consultas Recientes
- **Endpoint**: `GET /api/consultations/recent`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna las últimas consultas registradas en la sucursal.

---

### `TASK-CON-009`: Obtener Consultas por Rango de Fechas
- **Endpoint**: `GET /api/consultations/by-date?date_from=2026-07-01&date_to=2026-07-31`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Filtra estrictamente las consultas dentro del rango dado.

---

### `TASK-CON-010`: Obtener Parámetros Clínicos (Signos Vitales)
- **Endpoint**: `GET /api/consultations/clinical-parameters?patient_id=10`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna historial de signos vitales (presión arterial, peso, IMC, glucosa).

---

### `TASK-CON-011`: Consultas de un Paciente
- **Endpoint**: `GET /api/consultations/patient/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna las consultas del paciente.

---

### `TASK-CON-012`: Consultas de un Doctor
- **Endpoint**: `GET /api/consultations/doctor/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna las consultas atendidas por el doctor.

---

### `TASK-CON-013`: Obtener Archivos Multimedia de una Consulta
- **Endpoint**: `GET /api/consultations/{id}/media`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Devuelve array con metadatos de imágenes/archivos adjuntos.

---

### `TASK-CON-014`: Subir Archivo Multimedia a Consulta
- **Endpoint**: `POST /api/consultations/{id}/upload-media`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Form Data**: File (`file`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Almacena el archivo en `/uploads/consultations/` y guarda el registro en la BD.

---

### `TASK-CON-015`: Eliminar Archivo Multimedia de Consulta
- **Endpoint**: `DELETE /api/consultations/media/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Elimina el archivo físico y el registro de la BD.

---

## 8. Módulo 6: Catálogo de Servicios Médicos (`/api/services`)

---

### `TASK-SRV-001`: Listar Servicios Médicos
- **Endpoint**: `GET /api/services`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna lista de servicios habilitados en la clínica (precio, duración, categoría).

---

### `TASK-SRV-002`: Obtener Detalle de un Servicio
- **Endpoint**: `GET /api/services/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna el objeto del servicio médico.

---

### `TASK-SRV-003`: Crear Nuevo Servicio Médico
- **Endpoint**: `POST /api/services/create`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "name": "Limpieza Dental Ultrasónica",
  "description": "Profilaxis completa con ultrasonido",
  "price": 350.00,
  "duration_minutes": 45,
  "category": "Odontología"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna HTTP `200 OK` / `201 Created`.

---

### `TASK-SRV-004`: Actualizar Servicio Médico
- **Endpoint**: `POST /api/services/update/{id}` (o `PUT /api/services/update/{id}`)
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "price": 400.00
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Modifica el precio o datos del servicio.

---

### `TASK-SRV-005`: Eliminar Servicio Médico
- **Endpoint**: `DELETE /api/services/delete/{id}` (o `DELETE /api/services/{id}/delete`)
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Elimina el servicio especificado.

---

## 9. Módulo 7: Planes de Tratamiento y Sesiones (`/api/treatment-plans` & `/api/patient-treatments`)

---

### `TASK-TRT-001`: Listar Plantillas de Planes de Tratamiento
- **Endpoint**: `GET /api/treatment-plans`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna catálogo de planes predefinidos.

---

### `TASK-TRT-002`: Crear Plantilla de Plan de Tratamiento
- **Endpoint**: `POST /api/treatment-plans`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "name": "Paquete Ortodoncia Básica",
  "description": "Incluye colocación de brackets y 6 controles",
  "total_sessions": 6,
  "total_price": 2500.00
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Crea la plantilla del plan.

---

### `TASK-TRT-003`: Obtener Detalle de Plantilla de Tratamiento
- **Endpoint**: `GET /api/treatment-plans/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna metadatos del plan.

---

### `TASK-TRT-004`: Actualizar Plantilla de Tratamiento
- **Endpoint**: `PUT /api/treatment-plans/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Actualiza precio o número de sesiones.

---

### `TASK-TRT-005`: Eliminar Plantilla de Tratamiento
- **Endpoint**: `DELETE /api/treatment-plans/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Elimina el plan.

---

### `TASK-TRT-006`: Listar Tratamientos Asignados a Pacientes
- **Endpoint**: `GET /api/patient-treatments`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Muestra la lista de tratamientos activos/completados de los pacientes.

---

### `TASK-TRT-007`: Asignar Tratamiento a un Paciente
- **Endpoint**: `POST /api/patient-treatments`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "patient_id": 10,
  "treatment_plan_id": 2,
  "start_date": "2026-08-01",
  "notes": "Pago inicial realizado"
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Crea la instancia de tratamiento del paciente.

---

### `TASK-TRT-008`: Obtener Detalle de Tratamiento de Paciente
- **Endpoint**: `GET /api/patient-treatments/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna avance de sesiones, saldo y detalle.

---

### `TASK-TRT-009`: Actualizar Tratamiento de Paciente
- **Endpoint**: `PUT /api/patient-treatments/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Modifica estado o fechas.

---

### `TASK-TRT-010`: Eliminar Tratamiento de Paciente
- **Endpoint**: `DELETE /api/patient-treatments/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Elimina el registro del tratamiento asignado.

---

### `TASK-TRT-011`: Listar Sesiones de Tratamiento de Paciente
- **Endpoint**: `GET /api/patient-treatments/{id}/sessions`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna las sesiones realizadas y agendadas.

---

### `TASK-TRT-012`: Registrar Nueva Sesión de Tratamiento
- **Endpoint**: `POST /api/patient-treatments/{id}/sessions`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "session_number": 1,
  "session_date": "2026-08-01 11:00:00",
  "notes": "Cambio de ligas y ajuste general",
  "doctor_id": 2
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Registra la sesión y actualiza contador de avance.

---

### `TASK-TRT-013`: Eliminar Sesión de Tratamiento
- **Endpoint**: `DELETE /api/patient-treatments/sessions/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Reinvierte contador y elimina la sesión.

---

### `TASK-TRT-014`: Listar y Agregar Servicios Extras en Tratamiento
- **Endpoints**:
  - `GET /api/patient-treatments/{id}/extras`
  - `POST /api/patient-treatments/{id}/extras`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body (POST)**:
```json
{
  "service_name": "Radiografía Panorámica Adicional",
  "cost": 150.00
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Registra el cargo extra al tratamiento del paciente.

---

### `TASK-TRT-015`: Eliminar Servicio Extra de Tratamiento
- **Endpoint**: `DELETE /api/patient-treatments/extras/{id}`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Remueve el extra del tratamiento.

---

## 10. Módulo 8: Sistema de Recompensas y Ruleta (`/api/rewards`)

---

### `TASK-REW-001`: Listar Catálogo de Premios
- **Endpoint**: `GET /api/rewards`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Muestra los premios canjeables y su costo en puntos.

---

### `TASK-REW-002`: Obtener Puntos del Paciente
- **Endpoint**: `GET /api/rewards/points?patient_id=10`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Muestra el total de puntos acumulados.

---

### `TASK-REW-003`: Obtener Historial de Recompensas
- **Endpoint**: `GET /api/rewards/history?patient_id=10`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Muestra transacciones de puntos ganados y canjeados.

---

### `TASK-REW-004`: Girar Ruleta de Recompensas
- **Endpoint**: `POST /api/rewards/roulette`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Request Body**:
```json
{
  "patient_id": 10
}
```
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Ejecuta el giro, acredita el premio/puntos y retorna el resultado.

---

## 11. Módulo 9: Dashboard Estadístico (`/api/dashboard`)

---

### `TASK-DSH-001`: Obtener Totales y Métricas Generales
- **Endpoint**: `GET /api/dashboard/totals`
- **Autenticación**: Sí (`Bearer <JWT>`).
- **Criterios de Aceptación**:
  - `[ ]` **Happy Path**: Retorna conteo total de pacientes, citas del día, consultas realizadas e ingresos del periodo filtrados por `agency_id`.

---

## 12. Plantilla de Registro de Resultado de Prueba Manual

Al ejecutar las pruebas manuales, puede utilizar el siguiente formato para documentar hallazgos:

```text
Fecha de Prueba: YYYY-MM-DD
Ejecutado por: Nombre del Tester
Entorno: Local / Staging

[ ] TASK-AUTH-001: PASÓ / FALLÓ - Notas: ...
[ ] TASK-PAT-001:  PASÓ / FALLÓ - Notas: ...
```
