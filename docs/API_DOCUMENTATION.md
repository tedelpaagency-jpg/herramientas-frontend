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


