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

### 15. Save Patient (Create / Update)
URL: `/portal/patients/save`  
Método: `POST`  
Autenticación: Sí (Sesión de Portal)  

Headers:
- Content-Type: application/x-www-form-urlencoded

Request Body (POST Parameters):
- `patient_id` (opcional, ID del paciente para actualizar. Si no se envía, se crea uno nuevo)
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
