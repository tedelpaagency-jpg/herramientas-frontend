# API REST — Módulo Consultations

**Base URL:** `{base_url}/api/consultations`  
**Autenticación:** `Authorization: Bearer {token}` (JWT)  
**Formato:** `application/json`

---

## Índice de endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/consultations` | Listar consultas |
| POST | `/api/consultations` | Crear consulta |
| GET | `/api/consultations/{id}` | Ver detalle |
| PUT | `/api/consultations/{id}` | Actualizar |
| DELETE | `/api/consultations/{id}` | Soft-delete |
| GET | `/api/consultations/patient/{id}` | Historia clínica del paciente |
| GET | `/api/consultations/doctor/{id}` | Consultas por doctor |
| GET | `/api/consultations/search?q=` | Buscar |
| GET | `/api/consultations/recent` | Recientes |
| GET | `/api/consultations/by-date` | Por rango de fechas |
| GET | `/api/consultations/{id}/media` | Listar adjuntos |
| POST | `/api/consultations/{id}/upload-media` | Subir adjunto |
| DELETE | `/api/consultations/media/{media_id}` | Eliminar adjunto |

---

## GET /api/consultations

Lista consultas activas (`status = 1`) de la agencia. Soporta búsqueda y filtro por fechas.

**Query params opcionales:**

| Parámetro | Descripción |
|-----------|-------------|
| `search` | Busca en nombre del paciente, motivo, diagnóstico y tratamiento |
| `date_from` + `date_to` | Filtra por rango de fechas (Y-m-d). Si se envía `search`, tiene prioridad. |

**Modelo reutilizado:** `get_consultations()` / `search_medical_consultations()` / `get_by_date_range()`

**Respuesta `200`:**
```json
{ "status": "success", "total": 12, "data": [...] }
```

---

## POST /api/consultations

Crea una nueva consulta. Acepta JSON body o form-data.

**Body:**

| Campo | Tipo | Req | Descripción |
|-------|------|-----|-------------|
| `patient_id` | int | ✅ | Debe pertenecer a la agencia (`rol_id = 8`) |
| `chief_complaint` | string | — | Motivo de consulta |
| `history_present_illness` | string | — | Historia de la enfermedad |
| `physical_examination` | string | — | Exploración física |
| `diagnosis` | string | — | Diagnóstico |
| `treatment` | string | — | Tratamiento |
| `notes` | string | — | Notas |
| `follow_up_date` | date | — | Fecha de seguimiento |
| `status` | int | — | `1` activa (default), `0` draft |

> `doctor_id` y `agency_id` se asignan automáticamente desde el token.

**Modelo reutilizado:** `save_consultation()`

**Respuesta `201`:**
```json
{ "status": "success", "message": "Consulta creada correctamente.", "consultation_id": 46 }
```

---

## GET /api/consultations/{id}

Detalle completo: consulta + media adjunta + receta vinculada.

**Modelo reutilizado:** `get_consultation()`

**Respuesta `200`:**
```json
{
  "status": "success",
  "data": {
    "consultation": {
      "id": 45, "patient_name": "Ana García", "doctor_name": "Dr. Ramírez",
      "diagnosis": "Migraña", "treatment": "Ibuprofeno 400mg", ...
    },
    "media": [
      { "id": 5, "file_name": "media_abc.jpg", "url": "https://example.com/uploads/consultations/media_abc.jpg", "note": "Rx cráneo" }
    ],
    "prescription": { "id": 20, "comment": "Tomar con alimentos", ... },
    "prescription_details": [
      { "type": "med", "name": "Ibuprofeno", "dose": "400mg c/8h" }
    ]
  }
}
```

---

## PUT /api/consultations/{id}

Actualiza campos clínicos y, opcionalmente, parámetros EAV.

**Body (JSON):**

| Campo | Tipo | Req | Descripción |
|-------|------|-----|-------------|
| `patient_id` | int | ✅ | — |
| `chief_complaint` … `follow_up_date` | string | — | Campos clínicos |
| `values` | object | — | Parámetros EAV: `{"param_id": "valor"}` (ej. `{"1": "120/80", "2": "70"}`) |

**Modelos reutilizados:** `exists()`, `update_consultation()`, `update_clincal_parameters()`

**Respuesta `200`:**
```json
{
  "status": "success",
  "message": "Consulta actualizada correctamente.",
  "patient": { "user_id": 10, "name": "Ana", "last_name": "García", "phone": "555..." },
  "clinical_parameters": "Parámetros clínicos guardados correctamente"
}
```

> `clinical_parameters` aparece solo si se envió el campo `values`.

---

## DELETE /api/consultations/{id}

**Soft-delete:** `status = 0`. El registro no se elimina físicamente.

**Modelos reutilizados:** `exists()`, `delete_consultation()`

**Respuesta `200`:**
```json
{ "status": "success", "message": "Consulta eliminada correctamente." }
```

---

## GET /api/consultations/patient/{patient_id}

Historia clínica de un paciente: todas sus consultas, ordenadas por fecha DESC.

**Modelo reutilizado:** `get_patient_medical_consultations()`

**Respuesta `200`:**
```json
{
  "status": "success",
  "patient": { "user_id": 10, "name": "Ana", "last_name": "García", ... },
  "total": 5,
  "consultations": [...]
}
```

---

## GET /api/consultations/doctor/{doctor_id}

Consultas atendidas por un doctor específico.

**Modelo reutilizado:** `get_by_doctor()`

**Respuesta `200`:**
```json
{ "status": "success", "total": 8, "data": [...] }
```

---

## GET /api/consultations/search?q={keyword}

Búsqueda en nombre del paciente, motivo, diagnóstico y tratamiento.

| Param | Req | Descripción |
|-------|-----|-------------|
| `q` | ✅ | Mínimo 2 caracteres |

**Modelo reutilizado:** `search_medical_consultations()`

**Respuesta `200`:**
```json
{ "status": "success", "keyword": "migraña", "total": 3, "data": [...] }
```

---

## GET /api/consultations/recent?limit={n}

Últimas N consultas de la agencia.

| Param | Default | Descripción |
|-------|---------|-------------|
| `limit` | 10 | Cantidad de resultados |

**Modelo reutilizado:** `get_recent_medical_consultations()`

**Respuesta `200`:**
```json
{ "status": "success", "limit": 10, "total": 10, "data": [...] }
```

---

## GET /api/consultations/by-date?date_from=Y-m-d&date_to=Y-m-d

Consultas dentro de un rango de fechas.

| Param | Req | Descripción |
|-------|-----|-------------|
| `date_from` | ✅ | Formato `Y-m-d` |
| `date_to` | ✅ | Formato `Y-m-d`. Debe ser >= `date_from` |

**Modelo reutilizado:** `get_by_date_range()`

**Respuesta `200`:**
```json
{ "status": "success", "date_from": "2026-07-01", "date_to": "2026-07-14", "total": 6, "data": [...] }
```

---

## GET /api/consultations/{id}/media

Lista los archivos adjuntos de la consulta. Incluye `url` pública de cada archivo.

**Respuesta `200`:**
```json
{
  "status": "success",
  "total": 2,
  "data": [
    {
      "id": 5, "consultation_id": 45, "file_name": "media_abc.jpg",
      "original_name": "rx_craneo.jpg", "mime_type": "image/jpeg",
      "file_size": 204800, "note": "Rx de cráneo",
      "url": "https://example.com/uploads/consultations/media_abc.jpg"
    }
  ]
}
```

---

## POST /api/consultations/{id}/upload-media

Sube un archivo adjunto. **Requiere `multipart/form-data`.**

| Campo | Tipo | Req | Descripción |
|-------|------|-----|-------------|
| `file` | file | ✅ | Archivo a subir |
| `patient_id` | int | ✅ | ID del paciente |
| `note` | string | — | Descripción del archivo |

**Respuesta `201`:**
```json
{
  "status": "success",
  "message": "Archivo subido correctamente.",
  "id": 6,
  "file_name": "media_xyz.jpg",
  "url": "https://example.com/uploads/consultations/media_xyz.jpg",
  "note": "Rx lateral"
}
```

---

## DELETE /api/consultations/media/{media_id}

Elimina archivo físico del servidor y su registro en BD.

Verifica multitenancy: el archivo debe pertenecer a una consulta de la misma agencia.

**Respuesta `200`:**
```json
{ "status": "success", "message": "Archivo eliminado correctamente." }
```

**Error `403`:** si el archivo pertenece a otra agencia.

---

## Códigos de error

| Código | Causa |
|--------|-------|
| `400` | Parámetros faltantes o inválidos |
| `401` | Token ausente o expirado |
| `403` | Sin permiso (multitenancy) |
| `404` | Recurso no encontrado |
| `405` | Método HTTP no permitido |
| `500` | Error interno del servidor |

```json
{ "status": "error", "message": "Descripción del error." }
```

---

## Notas técnicas

| Tema | Comportamiento |
|------|---------------|
| **Soft-delete** | `DELETE` cambia `status = 0`, nunca elimina el registro |
| **Multitenancy** | `agency_id` proviene exclusivamente del JWT; no se acepta como parámetro |
| **doctor_id** | Se asigna desde `user_id` del token en `POST` |
| **Parámetros EAV** | `values` en `PUT` es un objeto `{"param_id": "valor"}` — transacción atómica |
| **Paciente anónimo** | No soportado en la API; el paciente debe existir antes (`POST /api/patients/save`) |
| **CORS** | Habilitado para todos los orígenes (`Access-Control-Allow-Origin: *`) |
