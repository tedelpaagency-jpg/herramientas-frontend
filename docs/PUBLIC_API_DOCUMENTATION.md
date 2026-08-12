# Documentación de API Pública - SANTUN / INMOSOFT (Laravel API)

Esta documentación describe los **Endpoints Públicos** expuestos para la integración con sitios web externos, catálogos públicos y plataformas clientes. 

> [!IMPORTANT]
> Todos los endpoints públicos son de libre acceso (sin token de autenticación) y aplican aislamiento estricto por **Dominio de Agencia**.

---

## 1. Información General

- **Base URL API**: `https://santun.tedelpa.com/api/v1`
- **Formato de Respuesta**: `application/json`
- **Mecanismos de Identificación de Agencia por Dominio**:
  - Header HTTP: `X-Domain: tu-agencia.com`
  - Parámetro Query: `?domain=tu-agencia.com`
  - Host de la petición HTTP (`Host: tu-agencia.com`)

---

## 2. Endpoints Públicos de Propiedades Inmobiliarias

### 2.1. Ciudades con Imagen y Total de Propiedades
`GET /api/v1/public/cities` (Alias: `/api/v1/public/estates/cities`)

Retorna el listado de ciudades/sectores agrupados de la agencia del dominio, incluyendo el conteo de inmuebles disponibles y la URL de una imagen representativa.

#### Parámetros de Consulta
| Parámetro | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `domain` | `string` | No | Dominio de la agencia. |

#### Ejemplo de Respuesta (`200 OK`)
```json
{
  "status": "success",
  "data": [
    {
      "name": "Manta",
      "province": "Manabí",
      "count": 42,
      "image": "https://santun.tedelpa.com/uploads/properties/1/1/696144.jpg"
    },
    {
      "name": "Guayaquil",
      "province": "Guayas",
      "count": 15,
      "image": "https://santun.tedelpa.com/uploads/properties/1/1/696150.jpg"
    }
  ]
}
```

---

### 2.2. Propiedades Destacadas
`GET /api/v1/public/estates/featured`

Retorna el listado de inmuebles destacados (`highlight = 1` o aprobados) para la página de inicio o sección de destacados del sitio web.

#### Parámetros de Consulta
| Parámetro | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `domain` | `string` | No | Dominio de la agencia. |
| `limit` | `integer` | No | Cantidad máxima de propiedades a retornar (Por defecto: `6`). |

#### Ejemplo de Respuesta (`200 OK`)
```json
{
  "status": "success",
  "data": [
    {
      "id": 7635,
      "title": "Hermosa Villa Frente al Mar",
      "slug": "hermosa-villa-frente-al-mar",
      "price": 250000.00,
      "currency": "USD",
      "highlight": 1,
      "status": 1,
      "verify": 1,
      "images": ["uploads/properties/1/1/696144.jpg"],
      "agency": {
        "id": 1,
        "name": "Inmobiliaria Demo",
        "domain": "inmobiliaria.inmosoft.pro"
      }
    }
  ]
}
```

---

### 2.3. Últimas 6 Propiedades Registradas
`GET /api/v1/public/estates/recent` (Alias: `/api/v1/public/estates/latest`)

Obtiene los últimos 6 inmuebles registrados disponibles y verificados ordenados en secuencia descendente de creación.

#### Parámetros de Consulta
| Parámetro | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `domain` | `string` | No | Dominio de la agencia. |
| `limit` | `integer` | No | Cantidad a retornar (Por defecto: `6`). |

#### Ejemplo de Respuesta (`200 OK`)
```json
{
  "status": "success",
  "data": [
    {
      "id": 7815,
      "title": "LOCAL COMERCIAL DE 35M2",
      "slug": "local-comercial-de-35m2",
      "price": 1200.00,
      "currency": "USD",
      "status": 1,
      "verify": 1,
      "images": ["uploads/properties/1/1/7815_img.jpg"]
    }
  ]
}
```

---

### 2.4. Catálogo General Público de Propiedades (Paginado)
`GET /api/v1/public/estates`

Retorna el catálogo público completo paginado de inmuebles verificados (`verify = 1`) y disponibles (`status = 1`).

---

### 2.5. Detalle Público de una Propiedad por Slug
`GET /api/v1/public/estates/{slug}`

Obtiene los detalles públicos de una propiedad por su slug o ID único.
