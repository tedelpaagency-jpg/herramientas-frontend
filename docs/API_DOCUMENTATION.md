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

## Especificaciones de Integración y Código


### Postman / REST Client Setup
Para probar en Postman, añade una variable global `{{JWT_TOKEN}}` obtenida tras autenticarte en `/api/auth/login`. Todas las peticiones al recurso `/api/appointments` deben incluir:
* **Header**: `Authorization` con valor `Bearer {{JWT_TOKEN}}`

### Cliente Flutter (Ejemplo)
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<void> createAppointment(String token) async {
  final url = Uri.parse('https://tu-api.com/api/appointments');
  final response = await http.post(
    url,
    headers: {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({
      'patient_id': 8,
      'doctor_id': 2,
      'appointment_date': '2026-07-15',
      'appointment_time': '10:00:00',
      'duration_minutes': 30,
      'reason': 'Consulta general',
      'notes': '',
      'status': 1
    }),
  );

  if (response.statusCode == 201) {
    print('Cita creada con éxito');
  } else {
    print('Error: ${response.body}');
  }
}
```

### Cliente React (Ejemplo)
```javascript
const saveAppointment = async (token, appointmentData) => {
  const response = await fetch('https://tu-api.com/api/appointments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointmentData)
  });
  
  const result = await response.json();
  if (response.status === 201) {
    return result.appointment_id;
  } else {
    throw new Error(result.message);
  }
};
```

---

## Reglas de Negocio y Validaciones
1. **Multi-tenancy obligatorio**: Todas las operaciones filtran implícitamente por el `agency_id` codificado en el JWT Token de la sesión.
2. **Conflictos de Agenda**: No se permite agendar citas si los rangos de tiempo (`[hora_inicio, hora_fin]`) se solapan para el mismo doctor o para el mismo paciente en una fecha determinada.
3. **Auditoría**: Cada creación, actualización o eliminación/cancelación escribe una entrada en el log de auditoría (`binnacle`) del sistema utilizando el ID del usuario del token.
4. **Tablas Utilizadas**: `appointments` y `user` (para doctores y pacientes).
5. **Modelos Reutilizados**: `Appointments_model` y `crud_model`.



