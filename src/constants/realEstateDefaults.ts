import { PublicAgencyConfig, PublicEstateCategory, PublicEstateItem } from '@/services/publicInmobiliariaService';

export interface FreeStockImage {
  id: string;
  name: string;
  category: 'hero' | 'about' | 'property';
  url: string;
  thumb: string;
  description: string;
}

export const FREE_STOCK_HERO_IMAGES: FreeStockImage[] = [
  {
    id: 'hero-villa-pool',
    name: 'Villa Moderna con Alberca',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85',
    thumb: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=75',
    description: 'Residencia de lujo iluminada con jardín y piscina de borde infinito.'
  },
  {
    id: 'hero-modern-house',
    name: 'Residencia Vanguardista',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85',
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=75',
    description: 'Arquitectura contemporánea con amplios ventanales y luz natural.'
  },
  {
    id: 'hero-penthouse-view',
    name: 'Penthouse con Vista Panorámica',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=85',
    thumb: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=75',
    description: 'Exclusiva propiedad frente a la bahía y palmeras tropicales.'
  },
  {
    id: 'hero-minimalist-facade',
    name: 'Fachada Minimalista Blanca',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=85',
    thumb: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=75',
    description: 'Diseño limpio y moderno ideal para desarrollos premium.'
  },
  {
    id: 'hero-luxury-condos',
    name: 'Torre de Departamentos de Alta Gama',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=85',
    thumb: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=75',
    description: 'Edificio residencial urbano con amenidades exclusivas.'
  },
  {
    id: 'hero-country-estate',
    name: 'Hacienda y Casa Campestre',
    category: 'hero',
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1920&q=85',
    thumb: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=75',
    description: 'Entorno campestre, áreas verdes y máxima privacidad.'
  }
];

export const FREE_STOCK_ABOUT_IMAGES: FreeStockImage[] = [
  {
    id: 'about-handshake-keys',
    name: 'Entrega de Llaves & Asesoría',
    category: 'about',
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=350&q=75',
    description: 'Cierre exitoso de compraventa y satisfacción del cliente.'
  },
  {
    id: 'about-agent-smile',
    name: 'Asesor Inmobiliario Profesional',
    category: 'about',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=350&q=75',
    description: 'Atención personalizada, calidez y profesionalismo ético.'
  },
  {
    id: 'about-luxury-living',
    name: 'Sala de Estar de Diseñador',
    category: 'about',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=350&q=75',
    description: 'Interiores de alta gama y confort residencial.'
  }
];

export const DEFAULT_FALLBACK_AGENCY: PublicAgencyConfig = {
  id: 1,
  name: '',
  commercial_name: '',
  description: 'Somos una agencia inmobiliaria especializada en la comercialización, compra, venta y arrendamiento de propiedades exclusivas.',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  city: '',
  province: '',
  postal_code: '',
  logo: null,
  banner_image: FREE_STOCK_HERO_IMAGES[0].url,
  hero_title: 'Encuentra la Propiedad de tus Sueños',
  hero_subtitle: 'Las mejores opciones en venta y renta con asesoría jurídica, notarial y crediticia garantizada.',
  about_title: 'Tu Aliado Inmobiliario de Confianza',
  about_text: 'Acompañamos a familias e inversionistas a tomar la mejor decisión patrimonial con total transparencia y seguridad.',
  cta_text: '¿Deseas vender o consignar tu inmueble? Lo comercializamos al mejor precio de mercado.',
  primary_color: '#00a884',
  secondary_color: '#161a1b',
  button_color: '#00a884',
  seo_title: 'Portal Inmobiliario — Venta y Renta de Inmuebles',
  seo_description: 'Explora casas, departamentos, terrenos y oficinas en venta y renta.',
  facebook: '',
  instagram: '',
  tiktok: '',
  frontend_enabled: true,
  currency: 'USD',
  properties_count: 0,
};

export const DEFAULT_REAL_ESTATE_CATEGORIES: PublicEstateCategory[] = [
  {
    id: 1,
    name: 'Casas & Residencias',
    slug: 'casas-residencias',
    count: 24,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Departamentos & Condos',
    slug: 'departamentos-condos',
    count: 32,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Terrenos & Lotes',
    slug: 'terrenos-lotes',
    count: 14,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Oficinas & Corporativos',
    slug: 'oficinas-corporativos',
    count: 18,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Villas & Casas de Campo',
    slug: 'villas-quintas',
    count: 11,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Penthouses de Lujo',
    slug: 'penthouses-lujo',
    count: 9,
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80',
  },
];

export const DEFAULT_REAL_ESTATE_PROPERTIES: PublicEstateItem[] = [
  {
    id: 101,
    agency_id: 1,
    title: 'Villa Moderna con Alberca Infinity',
    slug: 'villa-moderna-alberca-infinity',
    description: 'Extraordinaria residencia contemporánea con acabados de importación, cocina gourmet con isla, alberca climatizada y paneles solares.',
    address: 'Residencial Cumbres, Fracc. Privado',
    city: 'Cancún, Quintana Roo',
    price: 485000,
    property_type: 1,
    property_status: 1, // En Venta
    bedrooms: 4,
    bathrooms: 4.5,
    size: 380,
    garage: 3,
    featured: 1,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 102,
    agency_id: 1,
    title: 'Penthouse Panorámico Torre Titanium',
    slug: 'penthouse-panoramico-torre-titanium',
    description: 'Exclusivo penthouse de dos niveles con doble altura, terraza privada con jacuzzi y vistas de 360 grados a la ciudad.',
    address: 'Av. Ricardo Margáin, San Pedro',
    city: 'San Pedro Garza García, NL',
    price: 720000,
    property_type: 2,
    property_status: 1, // En Venta
    bedrooms: 3,
    bathrooms: 3.5,
    size: 290,
    garage: 3,
    featured: 1,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 103,
    agency_id: 1,
    title: 'Residencia Contemporánea Los Encinos',
    slug: 'residencia-contemporanea-los-encinos',
    description: 'Hermosa casa estilo mexicano contemporáneo rodeada de bosque, chimenea en sala y recámara principal, terraza con asador.',
    address: 'Club de Golf Los Encinos',
    city: 'Valle de Bravo, Edo. Méx.',
    price: 395000,
    property_type: 1,
    property_status: 1, // En Venta
    bedrooms: 3,
    bathrooms: 3,
    size: 260,
    garage: 2,
    featured: 1,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 104,
    agency_id: 1,
    title: 'Departamento de Lujo en Polanco',
    slug: 'departamento-lujo-polanco',
    description: 'Departamento remodelado a estrenar en piso alto. Iluminación inteligente, cuarto de servicio y seguridad privada 24/7.',
    address: 'Campos Elíseos, Polanco V Sección',
    city: 'Ciudad de México, CDMX',
    price: 3200, // En Alquiler mensual
    property_type: 2,
    property_status: 2, // En Alquiler
    bedrooms: 2,
    bathrooms: 2.5,
    size: 175,
    garage: 2,
    featured: 1,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 105,
    agency_id: 1,
    title: 'Casa Club Privada Las Lomas',
    slug: 'casa-club-privada-las-lomas',
    description: 'Residencia en coto privado con casa club, canchas de pádel, alberca semiolímpica y parque infantil. Lista para habitar.',
    address: 'Paseo de las Lomas 104',
    city: 'Zapopan, Jalisco',
    price: 340000,
    property_type: 1,
    property_status: 1, // En Venta
    bedrooms: 3,
    bathrooms: 3,
    size: 235,
    garage: 2,
    featured: 0,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 106,
    agency_id: 1,
    title: 'Quinta Campestre San Miguel',
    slug: 'quinta-campestre-san-miguel',
    description: 'Propiedad única con jardines maduros, árboles frutales, pozo propio y casa de huéspedes independiente.',
    address: 'Carretera a Dolores Km 8',
    city: 'San Miguel de Allende, Gto.',
    price: 430000,
    property_type: 5,
    property_status: 1, // En Venta
    bedrooms: 4,
    bathrooms: 4,
    size: 520,
    garage: 4,
    featured: 0,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
  },
];

export const DEFAULT_REAL_ESTATE_TERMS = `1. Aceptación de los Términos
Al acceder y utilizar este portal inmobiliario, usted acepta cumplir y estar legalmente sujeto a los presentes Términos y Condiciones de Uso. Si no está de acuerdo con alguno de ellos, le solicitamos abstenerse de utilizar el servicio.

2. Objeto del Portal
El portal tiene como propósito la difusión, promoción y contacto comercial para la compraventa, arrendamiento y consignación de bienes inmuebles intermediados o promovidos por nuestra agencia inmobiliaria.

3. Exactitud de la Información
Las descripciones, fotografías, planos, precios y disponibilidad de los inmuebles publicados se ofrecen a título orientativo y han sido suministrados de buena fe. Los precios y condiciones pueden modificarse sin previo aviso y están sujetos a verificación legal y disponibilidad final.

4. Formulario de Contacto y Solicitud de Información
Al remitir sus datos a través de los formularios del portal, usted autoriza a nuestros asesores inmobiliarios a comunicarse por correo electrónico, llamada telefónica o WhatsApp para brindarle la información solicitada y agendar visitas guiadas.

5. Propiedad Intelectual
Todos los contenidos, fotografías, logotipos, diseños y marcas exhibidas en este sitio web son propiedad exclusiva de la agencia inmobiliaria o cuentan con licencias autorizadas de uso, quedando prohibida su reproducción sin consentimiento expreso.`;

export const DEFAULT_REAL_ESTATE_PRIVACY = `1. Responsable del Tratamiento
Nuestra agencia inmobiliaria es responsable del tratamiento, uso y protección de los datos personales que usted nos proporcione a través de este portal web.

2. Finalidad del Tratamiento de Datos
Los datos personales recabados (nombre, correo electrónico, teléfono y mensaje de interés) serán utilizados exclusivamente para:
- Atender y responder a sus consultas sobre inmuebles en venta o alquiler.
- Coordinar citas y visitas guiadas a las propiedades de su interés.
- Mantenerlo informado sobre oportunidades y novedades inmobiliarias que se ajusten a su búsqueda.

3. Protección y Confidencialidad
Implementamos medidas de seguridad técnicas, administrativas y digitales para proteger su información contra pérdida, uso indebido, acceso no autorizado o alteración. No vendemos ni compartimos sus datos con terceros con fines publicitarios ajenos a nuestra actividad inmobiliaria.

4. Derechos del Titular (ARCO)
Usted tiene derecho a conocer qué datos personales tenemos, solicitar su rectificación en caso de ser inexactos, pedir su cancelación u oponerse al tratamiento de los mismos comunicándose directamente a nuestros canales de contacto oficiales.`;
