# API REST — Módulo Consultations

### 35. List Consultations
URL: `/api/consultations`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Query Params (opcionales):
- `search` — Busca en nombre y apellido del paciente, motivo de consulta, diagnóstico y tratamiento
- `date_from` — Filtra consultas a partir de esta fecha de consulta (Y-m-d)
- `date_to` — Filtra consultas hasta esta fecha de consulta (Y-m-d)
- `patient_id` — Filtra consultas por un paciente en específico
- `doctor_id` — Filtra consultas por un doctor en específico
- `page` — Número de página para paginación (default: 1)
- `limit` — Cantidad de resultados por página (default: 10)

Request Body:
```json
{}
```

Response Body (Success):
```json
{
  "status": "success",
  "data": [
    {
      "id": 45,
      "agency_id": 1,
      "patient_id": 10,
      "doctor_id": 3,
      "consultation_date": "2026-07-10 09:00:00",
      "chief_complaint": "Dolor de cabeza",
      "history_present_illness": "Inicio hace 3 días",
      "physical_examination": "Sin alteraciones",
      "diagnosis": "Migraña",
      "treatment": "Ibuprofeno 400mg",
      "notes": "Reposo relativo",
      "follow_up_date": "2026-07-24",
      "status": 1,
      "patient_name": "Ana García",
      "doctor_name": "Dr. Ramírez",
      "patient": {
        "user_id": 10,
        "name": "Ana",
        "last_name": "García",
        "email": "ana@example.com",
        "phone": "5551234567",
        "birthday": "1990-01-01",
        "status": 1
      }
    }
  ],
  "pagination": {
    "total_results": 1,
    "per_page": 10,
    "current_page": 1,
    "total_pages": 1
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Token inválido o expirado."
}
```

---

### 36. Create Consultation
URL: `/api/consultations`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "patient_id": 10,
  "chief_complaint": "Dolor de cabeza",
  "history_present_illness": "Inicio hace 3 días, intensidad 7/10",
  "physical_examination": "Sin alteraciones neurológicas",
  "diagnosis": "Migraña",
  "treatment": "Ibuprofeno 400mg cada 8 horas",
  "notes": "Reposo relativo, evitar pantallas",
  "follow_up_date": "2026-07-24",
  "status": 1
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Consulta creada correctamente.",
  "consultation_id": 46
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Paciente no encontrado o pertenece a otra sucursal."
}
```

---

### 37. Get Consultation Detail
URL: `/api/consultations/{id}`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{}
```

Response Body (Success):
```json
{
  "status": "success",
  "data": {
    "consultation": {
      "id": 45,
      "agency_id": 1,
      "patient_id": 10,
      "patient_name": "Ana García",
      "patient_email": "ana@example.com",
      "patient_phone": "5551234567",
      "doctor_id": 3,
      "doctor_name": "Dr. Ramírez",
      "consultation_date": "2026-07-10 09:00:00",
      "chief_complaint": "Dolor de cabeza",
      "history_present_illness": "Inicio hace 3 días",
      "physical_examination": "Sin alteraciones",
      "diagnosis": "Migraña",
      "treatment": "Ibuprofeno 400mg",
      "notes": "Reposo relativo",
      "follow_up_date": "2026-07-24",
      "status": 1
    },
    "media": [
      {
        "id": 5,
        "consultation_id": 45,
        "patient_id": 10,
        "file_name": "media_abc123.jpg",
        "original_name": "radiografia.jpg",
        "mime_type": "image/jpeg",
        "file_size": 204800,
        "note": "Radiografía de cráneo",
        "created_at": "2026-07-10 09:15:00",
        "url": "https://example.com/uploads/consultations/media_abc123.jpg"
      }
    ],
    "prescription": {
      "id": 20,
      "consultation_id": 45,
      "patient_id": 10,
      "comment": "Tomar con alimentos",
      "next_appointment": "2026-07-24",
      "created_at": "2026-07-10 09:20:00"
    },
    "prescription_details": [
      {
        "id": 50,
        "prescription_id": 20,
        "type": "med",
        "name": "Ibuprofeno",
        "dose": "400mg cada 8h por 5 días"
      }
    ],
    "clinical_records": {
      "has_record": true,
      "record_id": 12,
      "consultation_id": 45,
      "patient_id": 10,
      "date_record": "2026-07-10",
      "data": [
        {
          "parameter_id": 1,
          "name": "Presión Arterial",
          "icon": "heart",
          "unit": "mmHg",
          "value": "120/80"
        }
      ]
    }
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Consulta no encontrada."
}
```

---

### 38. Update Consultation
URL: `/api/consultations/{id}`  
Método: `PUT`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "patient_id": 10,
  "chief_complaint": "Dolor de cabeza severo",
  "history_present_illness": "Inicio hace 3 días, intensidad 8/10",
  "physical_examination": "Sin alteraciones neurológicas",
  "diagnosis": "Migraña con aura",
  "treatment": "Ibuprofeno 600mg cada 8 horas",
  "notes": "Reposo absoluto",
  "follow_up_date": "2026-07-24",
  "values": {
    "1": "120/80",
    "2": "70",
    "3": "36.5"
  }
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Consulta actualizada correctamente.",
  "patient": {
    "user_id": 10,
    "name": "Ana",
    "last_name": "García",
    "phone": "5551234567"
  },
  "clinical_parameters": "Parámetros clínicos guardados correctamente"
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Consulta no encontrada."
}
```

---

### 39. Delete Consultation
URL: `/api/consultations/{id}`  
Método: `DELETE`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Consulta eliminada correctamente."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Consulta no encontrada."
}
```

---

### 40. Get Patient Medical History
URL: `/api/consultations/patient/{patient_id}`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{}
```

Response Body (Success):
```json
{
  "status": "success",
  "patient": {
    "user_id": 10,
    "name": "Ana",
    "last_name": "García",
    "email": "ana@example.com",
    "phone": "5551234567"
  },
  "total": 3,
  "consultations": [
    {
      "id": 45,
      "consultation_date": "2026-07-10 09:00:00",
      "diagnosis": "Migraña",
      "treatment": "Ibuprofeno 400mg",
      "doctor_name": "Dr. Ramírez"
    }
  ]
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Paciente no encontrado."
}
```

---

### 41. Get Doctor Consultations
URL: `/api/consultations/doctor/{doctor_id}`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{}
```

Response Body (Success):
```json
{
  "status": "success",
  "total": 5,
  "data": [
    {
      "id": 45,
      "consultation_date": "2026-07-10 09:00:00",
      "patient_name": "Ana García",
      "diagnosis": "Migraña",
      "status": 1
    }
  ]
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Token inválido o expirado."
}
```

---

### 42. Search Consultations
URL: `/api/consultations/search`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Query Params:
- `q` (requerido) — Término de búsqueda, mínimo 2 caracteres. Busca en nombre del paciente, motivo de consulta, diagnóstico y tratamiento.

Request Body:
```json
{}
```

Response Body (Success):
```json
{
  "status": "success",
  "keyword": "migraña",
  "total": 2,
  "data": [
    {
      "id": 45,
      "consultation_date": "2026-07-10 09:00:00",
      "patient_name": "Ana García",
      "chief_complaint": "Dolor de cabeza",
      "diagnosis": "Migraña",
      "doctor_name": "Dr. Ramírez"
    }
  ]
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "El parámetro q debe tener al menos 2 caracteres."
}
```

---

### 43. Get Recent Consultations
URL: `/api/consultations/recent`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Query Params:
- `limit` (opcional, default: 10) — Cantidad de resultados a retornar

Request Body:
```json
{}
```

Response Body (Success):
```json
{
  "status": "success",
  "limit": 5,
  "total": 5,
  "data": [
    {
      "id": 50,
      "consultation_date": "2026-07-14 10:00:00",
      "patient_name": "Carlos López",
      "diagnosis": "Hipertensión",
      "status": 1
    }
  ]
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Token inválido o expirado."
}
```

---

### 44. Get Consultations by Date Range
URL: `/api/consultations/by-date`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Query Params:
- `date_from` (requerido) — Fecha de inicio en formato `Y-m-d`
- `date_to` (requerido) — Fecha de fin en formato `Y-m-d`. Debe ser mayor o igual a `date_from`.

Request Body:
```json
{}
```

Response Body (Success):
```json
{
  "status": "success",
  "date_from": "2026-07-01",
  "date_to": "2026-07-14",
  "total": 6,
  "data": [
    {
      "id": 45,
      "consultation_date": "2026-07-10 09:00:00",
      "patient_name": "Ana García",
      "diagnosis": "Migraña",
      "status": 1
    }
  ]
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Los parámetros date_from y date_to son obligatorios (formato Y-m-d)."
}
```

---

### 45. Get Consultation Media
URL: `/api/consultations/{id}/media`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{}
```

Response Body (Success):
```json
{
  "status": "success",
  "total": 2,
  "data": [
    {
      "id": 5,
      "consultation_id": 45,
      "patient_id": 10,
      "file_name": "media_abc123.jpg",
      "original_name": "radiografia.jpg",
      "mime_type": "image/jpeg",
      "file_size": 204800,
      "note": "Radiografía de cráneo",
      "created_at": "2026-07-10 09:15:00",
      "url": "https://example.com/uploads/consultations/media_abc123.jpg"
    }
  ]
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Consulta no encontrada."
}
```

---

### 46. Upload Consultation Media
URL: `/api/consultations/{id}/upload-media`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: multipart/form-data
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```
file      = [archivo binario]  (requerido)
patient_id = 10               (requerido)
note       = "Radiografía lateral de cráneo"
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Archivo subido correctamente.",
  "id": 6,
  "file_name": "media_xyz789abc.jpg",
  "url": "https://example.com/uploads/consultations/media_xyz789abc.jpg",
  "note": "Radiografía lateral de cráneo"
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "No se recibió el archivo."
}
```

---

### 47. Delete Consultation Media
URL: `/api/consultations/media/{media_id}`  
Método: `DELETE`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Archivo eliminado correctamente."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "No tiene permiso para eliminar este archivo."
}
```

---
