# API Documentation and Test Spec

### 1. User Login
URL: `/api/auth/login`  
Método: `POST`  
Autenticación: No  

Headers:
- Content-Type: application/json

Request Body:
```json
{
  "username": "example_username",
  "password": "example_password"
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Authenticated successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImV4cCI6MTgwMDAwMDAwMH0...",
  "expires_in": 7200
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Invalid username or password"
}
```

---

### 2. Get User Profile
URL: `/api/auth/me`  
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
    "user_id": "1",
    "name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "phone": "+50212345678",
    "rol_id": "1",
    "agency_id": "5",
    "company_id": "2",
    "status": "1"
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Invalid or expired token."
}
```

---

### 3. Refresh Auth Token
URL: `/api/auth/refresh`  
Método: `POST`  
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImV4cCI6MTgwMDAwNzIwMH0...",
  "expires_in": 7200
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Invalid or expired token."
}
```

---

### 4. User Logout
URL: `/api/auth/logout`  
Método: `POST`  
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
  "message": "Logged out successfully. Please discard the token on the client."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Invalid or expired token."
}
```

---

### 5. Doctor Registration
URL: `/api/auth/register`  
Método: `POST`  
Autenticación: No  

Headers:
- Content-Type: application/json

Request Body:
```json
{
  "name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "username": "janesmith",
  "password": "securepassword123",
  "phone": "+50212345678",
  "agency_id": 1
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Doctor registrado con éxito. Por favor verifique su correo electrónico para activar la cuenta."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "El correo electrónico ya se encuentra registrado."
}
```

---

### 6. Verify Email
URL: `/api/auth/verify-email`  
Método: `POST`  
Autenticación: No  

Headers:
- Content-Type: application/json

Request Body:
```json
{
  "code": "123456"
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Cuenta activada correctamente."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Código inválido o expirado."
}
```

---

### 7. Forgot Password
URL: `/api/auth/forgot-password`  
Método: `POST`  
Autenticación: No  

Headers:
- Content-Type: application/json

Request Body:
```json
{
  "email": "jane.smith@example.com"
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Si el correo electrónico está registrado, se ha enviado un código de recuperación."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "El correo electrónico es obligatorio."
}
```

---

### 8. Verify Reset Code
URL: `/api/auth/verify-reset-code`  
Método: `POST`  
Autenticación: No  

Headers:
- Content-Type: application/json

Request Body:
```json
{
  "code": "123456"
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Código válido."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Código inválido o expirado."
}
```

---

### 9. Reset Password
URL: `/api/auth/reset-password`  
Método: `POST`  
Autenticación: No  

Headers:
- Content-Type: application/json

Request Body:
```json
{
  "code": "123456",
  "new_password": "newsecurepassword123",
  "confirm_password": "newsecurepassword123"
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Contraseña restablecida correctamente."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Las contraseñas no coinciden."
}
```

---

### 10. List Patients
URL: `/api/patients`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

QueryParams:
- `page` (opcional, por defecto 1)
- `search` (opcional, para filtrar por nombre o apellido)

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
      "user_id": "8",
      "name": "Pedro",
      "last_name": "Pérez",
      "email": "pedro.perez@example.com",
      "phone": "+50255554444",
      "birthday": "1990-05-15",
      "age": 36,
      "status": "1"
    }
  ],
  "pagination": {
    "total_results": 1,
    "per_page": 5,
    "current_page": 1,
    "total_pages": 1
  }
}
```

---

### 11. Get Patient Details
URL: `/api/patients/{id}`  
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
    "user_id": "8",
    "name": "Pedro",
    "last_name": "Pérez",
    "email": "pedro.perez@example.com",
    "phone": "+50255554444",
    "birthday": "1990-05-15",
    "age": 36,
    "status": "1"
  }
}
```

---

### 12. Get Patient Medical Backgrounds
URL: `/api/patients/{id}/backgrounds`  
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
  "data": [
    {
      "background_type_id": "1",
      "name": "Alergias",
      "value": "Polen, Penicilina"
    },
    {
      "background_type_id": "2",
      "name": "Enfermedades Crónicas",
      "value": "Diabetes Tipo 2"
    }
  ]
}
```

---

### 13. Save Patient Medical Backgrounds
URL: `/api/patients/{id}/save-backgrounds`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "background_1": "Polen, Penicilina, Nueces",
  "background_2": "Diabetes Tipo 2 y Asma"
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Antecedentes médicos guardados correctamente."
}
```

---

### 14. Get Patient Consultations
URL: `/api/patients/{id}/consultations`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

QueryParams:
- `page` (opcional, por defecto 1)

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
      "consultation_id": "5",
      "consultation_date": "2026-07-01 10:30:00",
      "doctor_id": "3",
      "doctor_name": "Jane Smith",
      "reason": "Control rutinario de glucosa",
      "status": "1"
    }
  ]
}
```

---

### 15. Save Patient API (Create / Update)
URL: `/api/patients/save` o `/api/patients/save/{id}`  
Método: `POST`  
Autenticación: Sí (JWT Token)  

Headers:
- Content-Type: application/json o application/x-www-form-urlencoded
- Authorization: Bearer <JWT_TOKEN>

Request Body / Parameters:
- `patient_id` (opcional, ID del paciente para actualizar. Si se pasa en la URL, se usará el de la URL)
- `name` (obligatorio, nombre)
- `last_name` (obligatorio, apellido)
- `email` (opcional, correo electrónico)
- `phone` (opcional, teléfono)
- `birthday` (opcional, fecha de nacimiento `YYYY-MM-DD`)
- `address` (opcional, dirección)

Response Body (Success - Create):
```json
{
  "status": "success",
  "message": "Paciente registrado correctamente.",
  "patient_id": 12
}
```

Response Body (Success - Update):
```json
{
  "status": "success",
  "message": "Paciente actualizado correctamente.",
  "patient_id": "12"
}
```

Response Body (Error - Missing Fields):
```json
{
  "status": "error",
  "message": "El nombre y apellido son obligatorios."
}
```

Response Body (Error - Email Already Exists):
```json
{
  "status": "error",
  "message": "El correo electrónico ya se encuentra registrado por otro usuario."
}
```

---

# Módulo de Citas Médicas (Appointments)

## Endpoints de Citas

### 16. List Appointments
URL: `/api/appointments`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

QueryParams:
- `page` (opcional, por defecto 1)
- `limit` (opcional, por defecto 15)
- `search` (opcional, busca por nombre/apellido del paciente)
- `doctor_id` (opcional, filtra por ID del doctor)
- `patient_id` (opcional, filtra por ID del paciente)
- `status` (opcional, filtra por estado: 1=Pendiente, 2=Confirmada, 3=Reprogramada, 4=Cancelada, 5=Atendida)
- `date` (opcional, `YYYY-MM-DD`)
- `date_from` (opcional, `YYYY-MM-DD`)
- `date_to` (opcional, `YYYY-MM-DD`)
- `order_by` (opcional, columnas: `id`, `patient_id`, `doctor_id`, `appointment_date`, `appointment_time`, `duration_minutes`, `status`)
- `order` (opcional, `ASC` o `DESC`)

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
      "id": "1",
      "patient_id": "8",
      "doctor_id": "2",
      "appointment_date": "2026-07-15",
      "appointment_time": "10:00:00",
      "duration_minutes": "30",
      "reason": "Control general de salud",
      "status": "1",
      "notes": "Llegar 10 minutos antes",
      "cancel_reason": null,
      "cancelled_by": null,
      "cancelled_at": null,
      "name": "Pedro",
      "last_name": "Pérez",
      "doctor_name": "Juan",
      "doctor_last_name": "Gómez"
    }
  ],
  "pagination": {
    "total_results": 1,
    "per_page": 15,
    "current_page": 1,
    "total_pages": 1
  }
}
```

---

### 17. Get Appointment Details
URL: `/api/appointments/{id}`  
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
    "id": "1",
    "agency_id": "5",
    "patient_id": "8",
    "doctor_id": "2",
    "appointment_date": "2026-07-15",
    "appointment_time": "10:00:00",
    "duration_minutes": "30",
    "reason": "Control general de salud",
    "notes": "Llegar 10 minutos antes",
    "status": "1",
    "created_by": "1",
    "created_at": "2026-07-10 18:20:00",
    "updated_at": null,
    "cancel_reason": null,
    "cancelled_by": null,
    "cancelled_at": null,
    "patient_name": "Pedro",
    "patient_last_name": "Pérez",
    "patient_email": "pedro.perez@example.com",
    "patient_phone": "+50255554444",
    "doctor_name": "Juan",
    "doctor_last_name": "Gómez",
    "doctor_email": "juan.gomez@example.com"
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Cita no encontrada."
}
```

---

### 18. Create Appointment
URL: `/api/appointments`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "patient_id": 8,
  "doctor_id": 2,
  "appointment_date": "2026-07-15",
  "appointment_time": "10:00:00",
  "duration_minutes": 30,
  "reason": "Chequeo médico de rutina",
  "notes": "Pacientes requiere silla de ruedas",
  "status": 1
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Cita médica creada correctamente.",
  "appointment_id": 15
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "El doctor tiene un conflicto de agenda en el horario seleccionado."
}
```

---

### 19. Update Appointment
URL: `/api/appointments/{id}`  
Método: `PUT`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "appointment_time": "10:30:00",
  "duration_minutes": 45,
  "reason": "Consulta de control ajustada"
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Cita médica actualizada correctamente.",
  "appointment_id": "1"
}
```

---

### 20. Cancel Appointment
URL: `/api/appointments/{id}/cancel`  
Método: `PATCH`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "cancel_reason": "El paciente llamó para posponer por motivos de trabajo."
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Cita médica cancelada correctamente.",
  "appointment_id": "1"
}
```

---

### 21. Delete Appointment
URL: `/api/appointments/{id}`  
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
  "message": "Cita médica eliminada correctamente."
}
```

---

### 22. Get Doctor's Agenda
URL: `/api/appointments/doctor/{doctor_id}`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

QueryParams:
- `date` (opcional, `YYYY-MM-DD`)
- `date_from` (opcional, `YYYY-MM-DD`)
- `date_to` (opcional, `YYYY-MM-DD`)

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
      "id": "1",
      "patient_id": "8",
      "doctor_id": "2",
      "appointment_date": "2026-07-15",
      "appointment_time": "10:00:00",
      "duration_minutes": "30",
      "reason": "Control general de salud",
      "status": "1",
      "name": "Pedro",
      "last_name": "Pérez"
    }
  ]
}
```

---

### 23. Get Patient's Agenda
URL: `/api/appointments/patient/{patient_id}`  
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
  "data": [
    {
      "id": "1",
      "patient_id": "8",
      "doctor_id": "2",
      "appointment_date": "2026-07-15",
      "appointment_time": "10:00:00",
      "duration_minutes": "30",
      "reason": "Control general de salud",
      "status": "1",
      "name": "Pedro",
      "last_name": "Pérez"
    }
  ]
}
```

---

### 24. Get Today's Appointments
URL: `/api/appointments/today`  
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
  "data": [
    {
      "id": "1",
      "patient_id": "8",
      "doctor_id": "2",
      "appointment_date": "2026-07-10",
      "appointment_time": "10:00:00",
      "duration_minutes": "30",
      "status": "1"
    }
  ]
}
```

---

### 25. Get Upcoming Appointments
URL: `/api/appointments/upcoming`  
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
  "data": [
    {
      "id": "2",
      "patient_id": "8",
      "doctor_id": "2",
      "appointment_date": "2026-07-15",
      "appointment_time": "11:00:00",
      "duration_minutes": "30",
      "status": "1"
    }
  ]
}
```

---

## Módulo de Recetas Médicas (Prescriptions)

### 26. List Prescriptions
URL: `/api/prescriptions`  
Método: `GET`  
Autenticación: Sí  

Filtros opcionales (Query Params):
- `page` (int, default: 1)
- `limit` (int, default: 10)
- `patient_id` (int)
- `doctor_id` (int)
- `search` (string)
- `date_from` (string, YYYY-MM-DD)
- `date_to` (string, YYYY-MM-DD)
- `order_by` (string: `id`, `created_at`, `patient_name`)
- `order` (string: `ASC` o `DESC`)

Response Body (Success):
```json
{
  "status": "success",
  "data": [
    {
      "id": "1",
      "agency_id": "1",
      "patient_id": "8",
      "consultation_id": "5",
      "comment": "Tratamiento por 7 días",
      "next_appointment": "2026-07-20",
      "created_at": "2026-07-11 10:00:00",
      "patient_name": "Juan",
      "patient_last_name": "Pérez",
      "patient_phone": "5551234",
      "doctor_name": "Dr. Carlos",
      "doctor_last_name": "Gómez",
      "meds": 2,
      "labs": 1
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

---

### 27. Get Prescription
URL: `/api/prescriptions/{id}`  
Método: `GET`  
Autenticación: Sí  

Response Body (Success):
```json
{
  "status": "success",
  "data": {
    "prescription": {
      "id": "1",
      "agency_id": "1",
      "patient_id": "8",
      "consultation_id": "5",
      "comment": "Tratamiento por 7 días",
      "next_appointment": "2026-07-20",
      "created_at": "2026-07-11 10:00:00"
    },
    "patient": {
      "user_id": "8",
      "name": "Juan",
      "last_name": "Pérez",
      "phone": "5551234",
      "birthday": "1990-05-15",
      "age": 36
    },
    "doctor": {
      "user_id": "2",
      "name": "Dr. Carlos",
      "last_name": "Gómez"
    },
    "meds": [
      {
        "id": "1",
        "prescription_id": "1",
        "type": "med",
        "product_id": "12",
        "name": "Paracetamol 500mg",
        "dose": "1 tableta cada 8 horas"
      }
    ],
    "labs": [
      {
        "id": "2",
        "prescription_id": "1",
        "type": "lab",
        "name": "Hemograma completo",
        "dose": "En ayunas"
      }
    ]
  }
}
```

---

### 28. Create Prescription
URL: `/api/prescriptions`  
Método: `POST`  
Autenticación: Sí  

Request Body:
```json
{
  "patient_id": 8,
  "consultation_id": 5,
  "comment": "Tratamiento por 7 días",
  "next_appointment": "2026-07-20",
  "medications": [
    {
      "id": 12,
      "n": "Paracetamol 500mg",
      "d": "1 tableta cada 8 horas"
    }
  ],
  "labs": [
    {
      "n": "Hemograma completo",
      "o": "En ayunas"
    }
  ]
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Receta médica creada correctamente.",
  "prescription_id": 1
}
```

---

### 29. Update Prescription
URL: `/api/prescriptions/{id}`  
Método: `PUT`  
Autenticación: Sí  

Request Body:
```json
{
  "comment": "Comentario actualizado",
  "next_appointment": "2026-07-22",
  "medications": [
    {
      "id": 12,
      "name": "Paracetamol 500mg",
      "dose": "1 tableta cada 12 horas"
    }
  ],
  "labs": []
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Receta médica actualizada correctamente.",
  "prescription_id": "1"
}
```

---

### 30. Delete Prescription
URL: `/api/prescriptions/{id}`  
Método: `DELETE`  
Autenticación: Sí  

Response Body (Success):
```json
{
  "status": "success",
  "message": "Receta médica eliminada correctamente."
}
```

---

### 31. Get Patient Prescriptions
URL: `/api/prescriptions/patient/{patient_id}`  
Método: `GET`  
Autenticación: Sí  

Response Body (Success):
```json
{
  "status": "success",
  "data": [
    {
      "id": "1",
      "comment": "Tratamiento por 7 días",
      "next_appointment": "2026-07-20",
      "created_at": "2026-07-11 10:00:00",
      "meds": 1,
      "labs": 1
    }
  ]
}
```

---

### 32. Get Doctor Prescriptions
URL: `/api/prescriptions/doctor/{doctor_id}`  
Método: `GET`  
Autenticación: Sí  

Response Body (Success):
```json
{
  "status": "success",
  "data": [
    {
      "id": "1",
      "comment": "Tratamiento por 7 días",
      "next_appointment": "2026-07-20",
      "created_at": "2026-07-11 10:00:00",
      "meds": 1,
      "labs": 1
    }
  ]
}
```

---

### 33. Download PDF
URL: `/api/prescriptions/{id}/pdf`  
Método: `GET`  
Autenticación: Sí  

Response: Archivo binario PDF (`receta_{id}.pdf`).

---

### 34. Share Prescription
URL: `/api/prescriptions/{id}/share`  
Método: `POST`  
Autenticación: Sí  

Response Body (Success):
```json
{
  "status": "success",
  "message": "Receta compartida exitosamente.",
  "pdf_url": "https://tu-api.com/uploads/temp/receta_1_1623456789.pdf"
}
```

---

### 35. Update User Profile
URL: `/api/auth/profile`  
Método: `PUT`  
Autenticación: Sí  

Headers:
- Content-Type: multipart/form-data
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```
name       = "Juan"             (opcional)
last_name  = "Pérez"            (opcional)
email      = "juan@example.com" (opcional)
username   = "juanp"            (opcional)
phone      = "5551234567"       (opcional)
password   = "nueva_contraseña" (opcional)
photo      = [archivo imagen]   (opcional, JPG/PNG/WEBP/GIF, máx. 2 MB)
```

> Todos los campos son opcionales. Solo se actualiza lo que se envíe.  
> `rol_id`, `agency_id`, `company_id` y `status` nunca se modifican.  
> Si no se envía foto, se puede usar `Content-Type: application/json` y omitir el campo `photo`.

Response Body (Success):
```json
{
  "status": "success",
  "message": "Perfil actualizado correctamente.",
  "data": {
    "user_id": 3,
    "name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "username": "juanp",
    "phone": "5551234567",
    "rol_id": 2,
    "agency_id": 1,
    "status": 1,
    "photo_url": "https://tu-api.com/public/assets/images/users/user_3_1720990000.jpg"
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "El correo electrónico ya está en uso."
}
```


---

### 36. Get Clinic Settings
URL: `/api/auth/clinic`  
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
    "id": 1,
    "name": "Clínica San Rafael",
    "description": "Especialistas en medicina general",
    "address": "Av. Principal 123, Col. Centro",
    "phone": "5559876543",
    "email": "clinica@example.com",
    "facebook": "https://facebook.com/clinica",
    "instagram": "https://instagram.com/clinica",
    "ticktock": null,
    "cost_sale_price": "0",
    "cost_delivery": "0",
    "cost_delivery_aditional": "0",
    "opening_time": "08:00",
    "closing_time": "18:00"
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Clínica no encontrada."
}
```

---

### 37. Update Clinic Settings
URL: `/api/auth/clinic/update`  
Método: `PUT`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "name": "Clínica San Rafael",
  "description": "Especialistas en medicina general y familiar",
  "address": "Av. Principal 123, Col. Centro",
  "phone": "5559876543",
  "email": "clinica@example.com",
  "facebook": "https://facebook.com/clinica",
  "instagram": "https://instagram.com/clinica",
  "ticktock": "",
  "cost_sale_price": "0",
  "cost_delivery": "0",
  "cost_delivery_aditional": "0",
  "opening_time": "08:00",
  "closing_time": "18:00"
}
```

> Todos los campos son opcionales. Solo se actualiza lo que se envíe.  
> Campos protegidos (nunca se modifican): `id`, `logo`, `favicon`.  
> `opening_time` y `closing_time` deben tener formato `HH:MM` (ej. `08:00`).

Response Body (Success):
```json
{
  "status": "success",
  "message": "Configuración de la clínica actualizada correctamente.",
  "data": {
    "id": 1,
    "name": "Clínica San Rafael",
    "description": "Especialistas en medicina general y familiar",
    "address": "Av. Principal 123, Col. Centro",
    "phone": "5559876543",
    "email": "clinica@example.com",
    "facebook": "https://facebook.com/clinica",
    "instagram": "https://instagram.com/clinica",
    "ticktock": "",
    "cost_sale_price": "0",
    "cost_delivery": "0",
    "cost_delivery_aditional": "0",
    "opening_time": "08:00",
    "closing_time": "18:00"
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "El campo opening_time debe tener el formato HH:MM (ej. 08:00)."
}
```

---

### 38. Update Profile Photo
URL: `/api/auth/profile/photo`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: multipart/form-data
- Authorization: Bearer <JWT_TOKEN>

Request Body:
- `photo` (File): Archivo de imagen (formatos permitidos: JPG, PNG, WEBP, GIF; máx. 2MB).

Response Body (Success):
```json
{
  "status": "success",
  "message": "Foto de perfil actualizada correctamente.",
  "photo_url": "https://tu-api.com/public/assets/images/users/user_123_178493021.jpg"
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Formato de imagen no permitido. Use JPG, PNG, WEBP o GIF."
}
```

---

### 39. Update Profile Password
URL: `/api/auth/profile/password`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "current_password": "contraseña_actual",
  "new_password": "nueva_contraseña_segura",
  "confirm_password": "nueva_contraseña_segura"
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Contraseña actualizada correctamente."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "La contraseña actual es incorrecta."
}
```

---

### 40. List Available Agency Rewards
URL: `/api/rewards`  
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
  "rewards": [
    {
      "agency_reward_id": 5,
      "reward_id": 1,
      "name": "Termo ZIIGO",
      "description": "Termo de acero inoxidable grabado",
      "points": 100.0,
      "status": 1,
      "photo_url": "https://tu-api.com/public/assets/images/rewards/e10adc3949ba59abbe56e057f20f883eTermo.jpg"
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

### 41. Get Agency Points Balance
URL: `/api/rewards/points`  
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
  "points": 150.0
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

### 42. Check Roulette Availability
URL: `/api/rewards/roulette`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{}
```

Response Body (Success - Roulette Available):
```json
{
  "status": "success",
  "has_roulette": true,
  "roulette": {
    "id": 4,
    "roulette_id": 1,
    "title": "Ruleta Navideña",
    "description": "Gira y gana premios al instante",
    "assigned_at": "2026-07-15 12:00:00"
  }
}
```

Response Body (Success - No Roulette Available):
```json
{
  "status": "success",
  "has_roulette": false,
  "roulette": null
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

### 43. Request Reward Redemption
URL: `/api/rewards/redeem`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "agency_reward_id": 5
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Solicitud de canje enviada con éxito."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Puntos insuficientes para realizar el canje."
}
```

---

### 44. Get Rewards and Points History
URL: `/api/rewards/history`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Query Params:
- `page` (opcional, por defecto 1) — Número de página
- `limit` (opcional, por defecto 5) — Cantidad de resultados por página

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
      "item_type": "reward",
      "item_id": 5,
      "amount": 100.0,
      "title": "Termo ZIIGO",
      "status": 3,
      "date": "2026-07-16 14:30:00",
      "reward_id": 1,
      "photo": "https://tu-api.com/public/assets/images/rewards/e10adc3949ba59abbe56e057f20f883eTermo.jpg"
    },
    {
      "item_type": "point",
      "item_id": 12,
      "amount": 250.0,
      "title": "Puntos cargados por administración",
      "status": 1,
      "date": "2026-07-15 09:00:00",
      "points_type": 1
    }
  ],
  "pagination": {
    "total_results": 2,
    "per_page": 5,
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

### 45. Get Dashboard Totals
URL: `/api/dashboard/totals`  
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
    "total_patients": 150,
    "total_today_appointments": 4,
    "next_appointment": "2026-07-18 14:30:00",
    "points_balance": 350.0,
    "newest_patients": [
      {
        "user_id": 124,
        "name": "Carlos",
        "last_name": "Gomez",
        "email": "carlos.gomez@example.com",
        "phone": "+50255554444",
        "date_register": "2026-07-18 10:15:00",
        "status": 1,
        "photo_url": "https://tu-api.com/public/assets/images/users/default.png"
      },
      {
        "user_id": 123,
        "name": "Maria",
        "last_name": "Lopez",
        "email": "maria.lopez@example.com",
        "phone": "+50255553333",
        "date_register": "2026-07-17 16:45:00",
        "status": 1,
        "photo_url": null
      },
      {
        "user_id": 122,
        "name": "Ana",
        "last_name": "Martinez",
        "email": "ana.martinez@example.com",
        "phone": "+50255552222",
        "date_register": "2026-07-17 11:20:00",
        "status": 1,
        "photo_url": null
      }
    ]
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

### 46. Get All Active Services
URL: `/api/services`  
Método: `GET`  
Autenticación: Sí  

Query Parameters (Opcional):
- `search`: Texto a buscar en los campos `name` y `description`.

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
  "data": [
    {
      "id": "1",
      "agency_id": "1",
      "name": "Consulta médica",
      "description": "Consulta médica general",
      "price": "150.00",
      "photo": "service_1721500000_1234.png",
      "photo_url": "https://tu-api.com/uploads/services/service_1721500000_1234.png",
      "status": "1",
      "created_at": "2026-07-20 10:00:00",
      "updated_at": "2026-07-20 10:00:00"
    }
  ]
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Token no proporcionado."
}
```

---

### 47. Get Service Details
URL: `/api/services/{id}`  
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
    "id": "1",
    "agency_id": "1",
    "name": "Consulta médica",
    "description": "Consulta médica general",
    "price": "150.00",
    "photo": "service_1721500000_1234.png",
    "photo_url": "https://tu-api.com/uploads/services/service_1721500000_1234.png",
    "status": "1",
    "created_at": "2026-07-20 10:00:00",
    "updated_at": "2026-07-20 10:00:00"
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Servicio no encontrado o no pertenece a la agencia."
}
```

---

### 48. Create Service
URL: `/api/services/create` (o `/api/services`)  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json (o `multipart/form-data` si envía archivo)
- Authorization: Bearer <JWT_TOKEN>

Request Body (Opcional `photo` como string o archivo multipart):
```json
{
  "name": "Consulta médica",
  "description": "Consulta médica general",
  "price": 150.00,
  "photo": "service_1721500000_1234.png"
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Servicio creado correctamente.",
  "data": {
    "id": "1",
    "agency_id": "1",
    "name": "Consulta médica",
    "description": "Consulta médica general",
    "price": "150.00",
    "photo": "service_1721500000_1234.png",
    "photo_url": "https://tu-api.com/uploads/services/service_1721500000_1234.png",
    "status": "1",
    "created_at": "2026-07-20 10:00:00",
    "updated_at": "2026-07-20 10:00:00"
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "El campo \"name\" es obligatorio."
}
```

---

### 49. Update Service
URL: `/api/services/update/{id}` (o `/api/services/{id}`)  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json (o `multipart/form-data` si envía archivo)
- Authorization: Bearer <JWT_TOKEN>

Request Body (Opcional `photo`):
```json
{
  "name": "Consulta médica especial",
  "description": "Consulta médica de especialidad",
  "price": 200.00,
  "photo": "service_new_1234.png",
  "status": 1
}
```

Response Body (Success):
```json
{
  "status": "success",
  "message": "Servicio actualizado correctamente.",
  "data": {
    "id": "1",
    "agency_id": "1",
    "name": "Consulta médica especial",
    "description": "Consulta médica de especialidad",
    "price": "200.00",
    "photo": "service_new_1234.png",
    "photo_url": "https://tu-api.com/uploads/services/service_new_1234.png",
    "status": "1",
    "created_at": "2026-07-20 10:00:00",
    "updated_at": "2026-07-20 10:05:00"
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Servicio no encontrado o no pertenece a la agencia."
}
```

---

### 50. Delete Service (Soft Delete)
URL: `/api/services/delete/{id}` (o `/api/services/{id}/delete`)  
Método: `POST`  
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
  "message": "Servicio eliminado correctamente."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Servicio no encontrado o ya ha sido eliminado."
}
```

---

# Módulo de Consultas Médicas (Consultations)

### 51. List Consultations
URL: `/api/consultations`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Query Params (opcionales):
- `page` (int, default: 1)
- `limit` (int, default: 10)
- `search` (string) — busca en nombre del paciente, motivo, diagnóstico y tratamiento
- `date_from` (YYYY-MM-DD)
- `date_to` (YYYY-MM-DD)
- `patient_id` (int)
- `doctor_id` (int)

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
      "consultation_id": "5",
      "patient_id": "8",
      "doctor_id": "2",
      "consultation_date": "2026-07-15 10:30:00",
      "chief_complaint": "Dolor de cabeza intenso",
      "history_present_illness": "Inicia hace 3 días...",
      "physical_examination": "PA 120/80, FC 72",
      "diagnosis": "Migraña",
      "treatment": "Ibuprofeno 400mg",
      "notes": "Reposo y mucha agua",
      "follow_up_date": "2026-07-22",
      "status": "1",
      "patient_name": "Pedro Pérez",
      "patient": {
        "user_id": "8",
        "name": "Pedro",
        "last_name": "Pérez",
        "email": "pedro@example.com",
        "phone": "+50255554444",
        "birthday": "1990-05-15",
        "status": 1
      },
      "doctor_name": "Dr. Juan Gómez"
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

---

### 52. Create Consultation
URL: `/api/consultations`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "patient_id": 8,
  "chief_complaint": "Dolor de cabeza intenso",
  "history_present_illness": "Inicia hace 3 días con fotofobia",
  "physical_examination": "PA 120/80, FC 72, Temp 36.5°C",
  "diagnosis": "Migraña sin aura",
  "treatment": "Ibuprofeno 400mg cada 8 horas por 5 días",
  "notes": "Reposo, mucha hidratación y evitar pantallas",
  "follow_up_date": "2026-07-22",
  "status": 1
}
```

> `patient_id` es obligatorio. Todos los demás campos son opcionales.  
> `doctor_id` se asigna automáticamente del token JWT.

Response Body (Success):
```json
{
  "status": "success",
  "message": "Consulta creada correctamente.",
  "consultation_id": 5
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "El campo patient_id es obligatorio."
}
```

---

### 53. Create Blank Consultation
URL: `/api/consultations/blank`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "patient_id": 8
}
```

> Crea una consulta vacía para ser completada posteriormente. Útil para flujos donde la consulta se inicia antes de registrar los datos clínicos.

Response Body (Success):
```json
{
  "status": "success",
  "message": "Consulta en blanco creada correctamente.",
  "consultation_id": 6
}
```

---

### 54. Get Consultation Detail
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
      "consultation_id": "5",
      "patient_id": "8",
      "doctor_id": "2",
      "consultation_date": "2026-07-15 10:30:00",
      "chief_complaint": "Dolor de cabeza intenso",
      "history_present_illness": "Inicia hace 3 días con fotofobia",
      "physical_examination": "PA 120/80, FC 72",
      "diagnosis": "Migraña sin aura",
      "treatment": "Ibuprofeno 400mg",
      "notes": "Reposo y mucha agua",
      "follow_up_date": "2026-07-22",
      "status": "1"
    },
    "media": [
      {
        "id": "1",
        "consultation_id": "5",
        "file_name": "media_abc123.jpg",
        "original_name": "radiografia.jpg",
        "mime_type": "image/jpeg",
        "file_size": "204800",
        "note": "Radiografía lateral",
        "created_at": "2026-07-15 11:00:00",
        "url": "https://tu-api.com/uploads/consultations/media_abc123.jpg"
      }
    ],
    "prescription": {
      "id": "1",
      "consultation_id": "5",
      "patient_id": "8",
      "comment": "Tomar con alimentos",
      "created_at": "2026-07-15 10:45:00"
    },
    "prescription_details": [
      {
        "id": "1",
        "prescription_id": "1",
        "type": "med",
        "name": "Ibuprofeno 400mg",
        "dose": "1 tableta cada 8 horas"
      }
    ],
    "clinical_records": []
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

### 55. Update Consultation
URL: `/api/consultations/{id}`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "patient_id": 8,
  "chief_complaint": "Cefalea actualizada",
  "diagnosis": "Migraña crónica",
  "treatment": "Sumatriptán 50mg",
  "follow_up_date": "2026-07-29",
  "values": {
    "1": "120/80",
    "2": "72",
    "3": "36.5"
  }
}
```

> `patient_id` es obligatorio.  
> `values` es opcional: objeto con `{ "param_id": "valor" }` para parámetros clínicos EAV.

Response Body (Success):
```json
{
  "status": "success",
  "message": "Consulta actualizada correctamente.",
  "patient": {
    "user_id": "8",
    "name": "Pedro",
    "last_name": "Pérez",
    "phone": "+50255554444"
  },
  "clinical_parameters": {
    "saved": 3,
    "errors": []
  }
}
```

---

### 56. Delete Consultation (Soft Delete)
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

---

### 57. Get Patient Medical History
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
    "user_id": "8",
    "name": "Pedro",
    "last_name": "Pérez",
    "email": "pedro@example.com",
    "phone": "+50255554444"
  },
  "total": 3,
  "consultations": [
    {
      "consultation_id": "5",
      "consultation_date": "2026-07-15 10:30:00",
      "chief_complaint": "Dolor de cabeza",
      "diagnosis": "Migraña",
      "doctor_name": "Dr. Juan Gómez",
      "status": "1"
    }
  ]
}
```

---

### 58. Get Doctor's Consultations
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
  "total": 10,
  "data": [
    {
      "consultation_id": "5",
      "patient_id": "8",
      "consultation_date": "2026-07-15 10:30:00",
      "diagnosis": "Migraña",
      "status": "1"
    }
  ]
}
```

---

### 59. Search Consultations
URL: `/api/consultations/search`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Query Params:
- `q` (string, **obligatorio**, mínimo 2 caracteres) — busca en nombre del paciente, motivo de consulta, diagnóstico y tratamiento

Response Body (Success):
```json
{
  "status": "success",
  "keyword": "migraña",
  "total": 2,
  "data": [
    {
      "consultation_id": "5",
      "patient_id": "8",
      "consultation_date": "2026-07-15 10:30:00",
      "chief_complaint": "Dolor de cabeza intenso",
      "diagnosis": "Migraña sin aura",
      "patient_name": "Pedro Pérez"
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

### 60. Get Recent Consultations
URL: `/api/consultations/recent`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Query Params:
- `limit` (int, opcional, default: 10) — cantidad de resultados a retornar

Response Body (Success):
```json
{
  "status": "success",
  "limit": 5,
  "total": 5,
  "data": [
    {
      "consultation_id": "5",
      "patient_id": "8",
      "consultation_date": "2026-07-15 10:30:00",
      "diagnosis": "Migraña",
      "patient_name": "Pedro Pérez"
    }
  ]
}
```

---

### 61. Get Consultations By Date Range
URL: `/api/consultations/by-date`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Query Params (**obligatorios**):
- `date_from` (YYYY-MM-DD)
- `date_to` (YYYY-MM-DD)

Response Body (Success):
```json
{
  "status": "success",
  "date_from": "2026-07-01",
  "date_to": "2026-07-15",
  "total": 3,
  "data": [
    {
      "consultation_id": "5",
      "consultation_date": "2026-07-15 10:30:00",
      "patient_name": "Pedro Pérez",
      "diagnosis": "Migraña"
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

### 62. Get Clinical Parameters
URL: `/api/consultations/clinical-parameters`  
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
      "id": "1",
      "name": "Presión Arterial",
      "unit": "mmHg",
      "type": "text",
      "status": "1"
    },
    {
      "id": "2",
      "name": "Frecuencia Cardíaca",
      "unit": "lpm",
      "type": "number",
      "status": "1"
    }
  ]
}
```

---

### 63. Get Consultation Media
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
      "id": "1",
      "consultation_id": "5",
      "file_name": "media_abc123.jpg",
      "original_name": "radiografia.jpg",
      "mime_type": "image/jpeg",
      "file_size": "204800",
      "note": "Radiografía lateral",
      "created_at": "2026-07-15 11:00:00",
      "url": "https://tu-api.com/uploads/consultations/media_abc123.jpg"
    }
  ]
}
```

---

### 64. Upload Consultation Media
URL: `/api/consultations/{id}/upload-media`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: multipart/form-data
- Authorization: Bearer <JWT_TOKEN>

Form Fields:
- `file` (File, **obligatorio**) — archivo a subir
- `patient_id` (int, obligatorio) — ID del paciente
- `note` (string, opcional) — descripción del archivo

Response Body (Success):
```json
{
  "status": "success",
  "message": "Archivo subido correctamente.",
  "id": 1,
  "file_name": "media_abc123.jpg",
  "url": "https://tu-api.com/uploads/consultations/media_abc123.jpg",
  "note": "Radiografía lateral"
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

### 65. Delete Consultation Media
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

# Módulo de Tratamientos y Paquetes (Treatments)

> Este módulo tiene dos sub-módulos:  
> **1. Plantillas de Tratamientos** (`/api/treatment-plans`) — catálogo reutilizable de planes.  
> **2. Tratamientos de Pacientes** (`/api/patient-treatments`) — asignaciones activas a pacientes, con control de sesiones y cargos extras.

---

## Plantillas de Tratamientos (Treatment Plans)

### 66. List Treatment Plans
URL: `/api/treatment-plans`  
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
  "data": [
    {
      "id": "1",
      "agency_id": "1",
      "name": "Paquete Limpieza Facial",
      "description": "Incluye 8 sesiones de limpieza facial profunda",
      "price": "800.00",
      "status": "1",
      "services": [
        {
          "service_id": "3",
          "service_name": "Limpieza Facial",
          "sessions_count": "8"
        }
      ]
    }
  ]
}
```

---

### 67. Create Treatment Plan
URL: `/api/treatment-plans`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "name": "Paquete Limpieza Facial",
  "description": "Incluye 8 sesiones de limpieza facial profunda",
  "price": 800.00,
  "services": [
    {
      "service_id": 3,
      "sessions_count": 8
    },
    {
      "service_id": 5,
      "sessions_count": 4
    }
  ]
}
```

> `name` es obligatorio. `price` debe ser ≥ 0. `services` es opcional.

Response Body (Success):
```json
{
  "status": "success",
  "message": "Plantilla de tratamiento creada correctamente.",
  "data": {
    "id": 1
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "El nombre es obligatorio y el precio no puede ser negativo."
}
```

---

### 68. Get Treatment Plan Detail
URL: `/api/treatment-plans/{id}`  
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
    "id": "1",
    "agency_id": "1",
    "name": "Paquete Limpieza Facial",
    "description": "Incluye 8 sesiones de limpieza facial profunda",
    "price": "800.00",
    "status": "1",
    "services": [
      {
        "service_id": "3",
        "service_name": "Limpieza Facial",
        "sessions_count": "8"
      }
    ]
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "La plantilla de tratamiento no existe o no tiene permisos sobre ella."
}
```

---

### 69. Update Treatment Plan
URL: `/api/treatment-plans/{id}`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "name": "Paquete Limpieza Facial Premium",
  "description": "Incluye 10 sesiones de limpieza facial profunda",
  "price": 950.00,
  "status": 1,
  "services": [
    {
      "service_id": 3,
      "sessions_count": 10
    }
  ]
}
```

> Todos los campos son opcionales. Solo se actualiza lo que se envíe.  
> Si se envía `services`, se reemplaza la lista completa de servicios de la plantilla.

Response Body (Success):
```json
{
  "status": "success",
  "message": "Plantilla de tratamiento actualizada correctamente."
}
```

---

### 70. Delete Treatment Plan (Soft Delete)
URL: `/api/treatment-plans/{id}`  
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
  "message": "Plantilla de tratamiento desactivada correctamente."
}
```

---

## Tratamientos de Pacientes (Patient Treatments)

### 71. List Patient Treatments
URL: `/api/patient-treatments`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Query Params (opcionales):
- `patient_id` (int) — filtra por paciente específico
- `status` (string) — filtra por estado: `active`, `completed`, `cancelled`

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
      "id": "1",
      "agency_id": "1",
      "patient_id": "8",
      "treatment_plan_id": "1",
      "name": "Paquete Limpieza Facial",
      "price": "800.00",
      "status": "active",
      "start_date": "2026-07-01",
      "end_date": "2026-09-01",
      "notes": "Paciente con piel sensible",
      "created_at": "2026-07-01 09:00:00",
      "patient_name": "Pedro Pérez",
      "sessions_consumed": 3,
      "sessions_total": 8
    }
  ]
}
```

---

### 72. Assign Treatment to Patient
URL: `/api/patient-treatments`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "patient_id": 8,
  "treatment_plan_id": 1,
  "name": "Paquete Limpieza Facial",
  "price": 800.00,
  "start_date": "2026-07-01",
  "end_date": "2026-09-01",
  "notes": "Paciente con piel sensible",
  "services": [
    {
      "service_id": 3,
      "quantity_ordered": 8
    }
  ]
}
```

> `patient_id` y `name` son **obligatorios**. `price` debe ser ≥ 0.  
> Si se omite `services` pero se envía `treatment_plan_id`, los servicios se copian automáticamente de la plantilla.  
> `start_date` toma la fecha actual por defecto si no se envía.

Response Body (Success):
```json
{
  "status": "success",
  "message": "Tratamiento asignado correctamente al paciente.",
  "data": {
    "id": 1
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "Los campos patient_id y name son obligatorios, y el precio no puede ser negativo."
}
```

---

### 73. Get Patient Treatment Detail
URL: `/api/patient-treatments/{id}`  
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
    "id": "1",
    "agency_id": "1",
    "patient_id": "8",
    "treatment_plan_id": "1",
    "name": "Paquete Limpieza Facial",
    "price": "800.00",
    "status": "active",
    "start_date": "2026-07-01",
    "end_date": "2026-09-01",
    "notes": "Paciente con piel sensible",
    "created_at": "2026-07-01 09:00:00",
    "updated_at": null,
    "patient_name": "Pedro Pérez",
    "services": [
      {
        "id": "1",
        "patient_treatment_id": "1",
        "service_id": "3",
        "service_name": "Limpieza Facial",
        "quantity_ordered": "8",
        "quantity_consumed": "3",
        "quantity_remaining": 5
      }
    ],
    "sessions": [
      {
        "id": "1",
        "patient_treatment_service_id": "1",
        "service_name": "Limpieza Facial",
        "session_date": "2026-07-05 10:00:00",
        "notes": "Sesión sin incidentes"
      }
    ],
    "extras": []
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "El tratamiento del paciente no existe o no tiene permisos sobre él."
}
```

---

### 74. Update Patient Treatment
URL: `/api/patient-treatments/{id}`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "status": "completed",
  "price": 850.00,
  "start_date": "2026-07-01",
  "end_date": "2026-08-15",
  "notes": "Tratamiento finalizado con éxito"
}
```

> Todos los campos son opcionales. Solo se actualiza lo que se envíe.  
> Valores de `status`: `active`, `completed`, `cancelled`.

Response Body (Success):
```json
{
  "status": "success",
  "message": "Tratamiento de paciente actualizado correctamente."
}
```

---

### 75. Cancel Patient Treatment
URL: `/api/patient-treatments/{id}`  
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
  "message": "Tratamiento cancelado correctamente."
}
```

---

## Control de Sesiones

### 76. Register Session
URL: `/api/patient-treatments/{id}/sessions`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "patient_treatment_service_id": 1,
  "session_date": "2026-07-10 10:00:00",
  "notes": "Sesión sin incidentes, piel reactiva"
}
```

> `patient_treatment_service_id` es **obligatorio** (ID del servicio dentro del tratamiento asignado).  
> `session_date` usa la fecha y hora actual si no se envía.  
> Si el servicio ya no tiene sesiones disponibles, la API retorna un error.

Response Body (Success):
```json
{
  "status": "success",
  "message": "Sesión registrada correctamente.",
  "data": {
    "session_id": 3,
    "quantity_consumed": 4,
    "quantity_remaining": 4
  }
}
```

Response Body (Error — Sin sesiones disponibles):
```json
{
  "status": "error",
  "message": "No hay sesiones disponibles para este servicio."
}
```

Response Body (Error — Campo obligatorio):
```json
{
  "status": "error",
  "message": "El campo patient_treatment_service_id es obligatorio."
}
```

---

### 77. Delete Session (Revertir)
URL: `/api/patient-treatments/sessions/{session_id}`  
Método: `DELETE`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{}
```

> Elimina la sesión y devuelve la sesión consumida al contador del servicio.

Response Body (Success):
```json
{
  "status": "success",
  "message": "Sesión eliminada correctamente."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "La sesión no existe o no tiene permisos para eliminarla."
}
```

---

## Cargos Extras

### 78. Add Extra Charge
URL: `/api/patient-treatments/{id}/extras`  
Método: `POST`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Request Body:
```json
{
  "name": "Mascarilla antioxidante",
  "price": 120.00,
  "quantity": 2,
  "notes": "Aplicada en la sesión 3 y 4"
}
```

> `name` es **obligatorio**. `price` debe ser ≥ 0. `quantity` tiene valor 1 por defecto si no se envía o es ≤ 0.

Response Body (Success):
```json
{
  "status": "success",
  "message": "Cargo extra agregado correctamente.",
  "data": {
    "id": 1
  }
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "El nombre del extra es obligatorio y el precio no puede ser negativo."
}
```

---

### 79. Delete Extra Charge
URL: `/api/patient-treatments/extras/{extra_id}`  
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
  "message": "Cargo extra eliminado correctamente."
}
```

Response Body (Error):
```json
{
  "status": "error",
  "message": "El cargo extra no existe o no tiene permisos para eliminarlo."
}
```

---

### 80. Search Medicines
URL: `/api/medicines/search?term={term}`  
Método: `GET`  
Autenticación: Sí  

Headers:
- Content-Type: application/json
- Authorization: Bearer <JWT_TOKEN>

Query Parameters:
- `term` (string, obligatorio, mín. 2 caracteres): Término de búsqueda para filtrar medicamentos por nombre.

Response Body (Success):
```json
{
  "status": "success",
  "data": [
    {
      "id": "13225",
      "name": "AMLOPRESS 10/16MG *30 TAB",
      "description": "Tratamiento de la hipertensión arterial y la angina de pecho.",
      "provider_price": "28.85",
      "sale_price": "34.50",
      "stock": "6",
      "photo": "http://localhost/recetar_facil/public/assets/images/no_image.webp",
      "photo_url": "http://localhost/recetar_facil/public/assets/images/no_image.webp"
    }
  ]
}
```

> Nota: Si el medicamento no cuenta con una foto cargada, los campos `photo` y `photo_url` devolverán por defecto la imagen de fallback `public/assets/images/no_image.webp`.

Response Body (Si term es menor a 2 caracteres):
```json
{
  "status": "success",
  "data": []
}
```

---

