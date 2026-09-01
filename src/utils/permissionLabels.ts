export const PERMISSION_LABELS: Record<string, { label: string; description: string; module: string }> = {
  view_estates: {
    label: 'Módulo de Propiedades Inmobiliarias',
    description: 'Acceso a la gestión de inmuebles, propiedades y captaciones',
    module: 'Inmobiliaria',
  },
  manage_estates: {
    label: 'Administrar Propiedades Inmobiliarias',
    description: 'Crear, editar y eliminar propiedades de la agencia',
    module: 'Inmobiliaria',
  },
  view_visas: {
    label: 'Módulo de Visas y Tramitación',
    description: 'Acceso a solicitudes de visados y expedientes turísticos',
    module: 'Turismo & Viajes',
  },
  manage_visas: {
    label: 'Administrar Visados & Trámites',
    description: 'Aprobar, editar y gestionar estados de trámites de visas',
    module: 'Turismo & Viajes',
  },
  view_travel_reports: {
    label: 'Reportes de Viajes & Clearing',
    description: 'Acceso a balances de pasajes, hoteles y liquidaciones B2B',
    module: 'Turismo & Viajes',
  },
  'packages.view': {
    label: 'Catálogo de Paquetes Turísticos B2B',
    description: 'Acceso a itinerarios y paquetes de mayoristas de viajes',
    module: 'Turismo & Viajes',
  },
  'requests.view': {
    label: 'Solicitudes de Reserva de Viajes',
    description: 'Acceso al módulo de cotizaciones y reservas de viajes',
    module: 'Turismo & Viajes',
  },
  view_w8_forms: {
    label: 'Formularios W8 / W9',
    description: 'Acceso a formularios tributarios de viajes internacionales',
    module: 'Turismo & Viajes',
  },
  view_products: {
    label: 'Módulo de Productos e Inventario',
    description: 'Acceso al catálogo de productos y control de stock',
    module: 'Comercio & POS',
  },
  view_pos: {
    label: 'Terminal Punto de Venta (POS)',
    description: 'Acceso a la caja registradora y ventas presenciales',
    module: 'Comercio & POS',
  },
  manage_pos: {
    label: 'Administrar POS & Cajas Registradoras',
    description: 'Configurar terminales, cobros y aperturas/cierres de caja',
    module: 'Comercio & POS',
  },
  view_spin_wheel: {
    label: 'Ruleta de Promociones & Gamificación',
    description: 'Acceso a la ruleta de premios para clientes',
    module: 'Comercio & POS',
  },
  view_crm: {
    label: 'Módulo CRM & Prospectos',
    description: 'Acceso al embudo Kanban y gestión de leads comerciales',
    module: 'CRM & Clientes',
  },
  manage_crm: {
    label: 'Administrar CRM & Workspaces',
    description: 'Crear pipelines, fases personalizadas y reasignar asesores',
    module: 'CRM & Clientes',
  },
  view_clients: {
    label: 'Directorio de Clientes',
    description: 'Acceso a la base de clientes y campos personalizados',
    module: 'CRM & Clientes',
  },
  'tasks.view': {
    label: 'Módulo de Tareas & Workspaces',
    description: 'Acceso al organizador de tareas y secuencias de trabajo',
    module: 'General & Tareas',
  },
  'courses.view': {
    label: 'Módulo de Capacitación & Cursos',
    description: 'Acceso a la academia digital y material de formación',
    module: 'Capacitación',
  },
  view_lexvault: {
    label: 'Módulo de Contratos Lexvault',
    description: 'Acceso a firma de contratos digitales e instrumentos legales',
    module: 'Legal & Contratos',
  },
  manage_users: {
    label: 'Gestión de Usuarios & Equipo',
    description: 'Crear, invitar y gestionar cuentas de asesores de la agencia',
    module: 'Administración',
  },
  manage_agencies: {
    label: 'Administrar Agencias del Sistema',
    description: 'Gestión de agencias registradas y suscripciones',
    module: 'SuperAdmin',
  },
};

export function getPermissionLabel(key: string): string {
  if (!key) return 'Acceso General';
  const normalizedKey = key.toLowerCase();
  if (PERMISSION_LABELS[normalizedKey]) {
    return PERMISSION_LABELS[normalizedKey].label;
  }
  if (PERMISSION_LABELS[key]) {
    return PERMISSION_LABELS[key].label;
  }
  return key
    .replace(/^view_/, 'Módulo de ')
    .replace(/^manage_/, 'Administrar ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function getPermissionDescription(key: string): string {
  if (!key) return '';
  const normalizedKey = key.toLowerCase();
  if (PERMISSION_LABELS[normalizedKey]) {
    return PERMISSION_LABELS[normalizedKey].description;
  }
  return 'Permiso de acceso al módulo';
}

export function getPermissionModule(key: string): string {
  if (!key) return 'General';
  const normalizedKey = key.toLowerCase();
  if (PERMISSION_LABELS[normalizedKey]) {
    return PERMISSION_LABELS[normalizedKey].module;
  }
  return 'General';
}
