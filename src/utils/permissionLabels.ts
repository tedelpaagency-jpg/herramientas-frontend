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
  approve_travel_reports: {
    label: 'Aprobar Directamente Reportes de Viajes',
    description: 'Permite al Administrador de Agencia autorizar expedientes de viajes sin requerir la aprobación de la Marca Blanca',
    module: 'Turismo & Viajes',
  },
  'packages.view': {
    label: 'Ver Catálogo de Paquetes Turísticos',
    description: 'Permite consultar itinerarios y paquetes de viajes B2B',
    module: 'Turismo & Viajes',
  },
  'packages.create': {
    label: 'Crear Paquetes Turísticos',
    description: 'Permite diseñar e ingresar nuevos itinerarios de viajes',
    module: 'Turismo & Viajes',
  },
  'packages.update': {
    label: 'Editar Paquetes Turísticos',
    description: 'Permite modificar detalles, precios e itinerarios de viajes',
    module: 'Turismo & Viajes',
  },
  'packages.delete': {
    label: 'Eliminar Paquetes Turísticos',
    description: 'Permite dar de baja o eliminar paquetes del catálogo',
    module: 'Turismo & Viajes',
  },
  'packages.catalog': {
    label: 'Acceso al Catálogo B2B',
    description: 'Permite buscar y cotizar itinerarios de mayoristas',
    module: 'Turismo & Viajes',
  },
  'packages.manage': {
    label: 'Administrar Paquetes de Viaje',
    description: 'Acceso completo de gestión comercial sobre paquetes turísticos',
    module: 'Turismo & Viajes',
  },
  'packages.pricing': {
    label: 'Configurar Reglas de Precios & Márgenes',
    description: 'Permite establecer comisiones y porcentajes de ganancia',
    module: 'Turismo & Viajes',
  },
  'requests.view': {
    label: 'Ver Solicitudes de Reserva',
    description: 'Acceso a cotizaciones y reservas de paquetes turísticos',
    module: 'Turismo & Viajes',
  },
  'requests.create': {
    label: 'Crear Solicitudes de Viaje',
    description: 'Permite solicitar reservas y cotizaciones para clientes',
    module: 'Turismo & Viajes',
  },
  'requests.approve': {
    label: 'Aprobar Solicitudes de Viaje',
    description: 'Permite autorizar y confirmar reservas solicitadas por agentes',
    module: 'Turismo & Viajes',
  },
  'requests.reject': {
    label: 'Rechazar Solicitudes de Viaje',
    description: 'Permite denegar solicitudes con observaciones explicativas',
    module: 'Turismo & Viajes',
  },
  'requests.manage': {
    label: 'Administrar Solicitudes B2B',
    description: 'Gestión integral de estado de reservas e itinerarios',
    module: 'Turismo & Viajes',
  },
  'requests.view_financials': {
    label: 'Ver Financieros & Liquidaciones de Viajes',
    description: 'Acceso a montos, pagos a proveedores y ganancias de reservas',
    module: 'Turismo & Viajes',
  },
  'requests.upload_supplier_payment': {
    label: 'Subir Comprobantes de Pago a Proveedores',
    description: 'Permite registrar transferencias y recibos de proveedores',
    module: 'Turismo & Viajes',
  },
  'requests.manage_status': {
    label: 'Cambiar Estado de Solicitudes de Reserva',
    description: 'Permite avanzar o retroceder el flujo comercial de la reserva',
    module: 'Turismo & Viajes',
  },
  'stages.create': {
    label: 'Crear Etapas del CRM',
    description: 'Permite añadir nuevas fases o columnas al embudo comercial en el Kanban',
    module: 'CRM & Clientes',
  },
  'stages.view': {
    label: 'Ver Etapas del CRM',
    description: 'Permite visualizar el mapa de fases del pipeline comercial',
    module: 'CRM & Clientes',
  },
  'stages.update': {
    label: 'Editar Etapas del CRM',
    description: 'Permite modificar el nombre, color u orden de las fases comerciales',
    module: 'CRM & Clientes',
  },
  'stages.delete': {
    label: 'Eliminar Etapas del CRM',
    description: 'Permite remover columnas o fases obsoletas del embudo comercial',
    module: 'CRM & Clientes',
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
    label: 'Módulo de Tareas',
    description: 'Acceso al organizador y gestor de tareas',
    module: 'General & Tareas',
  },
  'courses.view': {
    label: 'Módulo de Capacitación & Cursos',
    description: 'Acceso a la academia digital y material de formación',
    module: 'Capacitación',
  },
  'courses.create': {
    label: 'Crear Cursos & Lecciones',
    description: 'Permite agregar nuevos programas educativos y módulos de formación',
    module: 'Capacitación',
  },
  'courses.update': {
    label: 'Editar Cursos & Contenidos',
    description: 'Permite modificar temas, duraciones e información de cursos',
    module: 'Capacitación',
  },
  'courses.delete': {
    label: 'Eliminar Cursos',
    description: 'Permite remover programas de capacitación obsoletos',
    module: 'Capacitación',
  },
  'courses.assign': {
    label: 'Asignar Cursos a Usuarios',
    description: 'Permite matricular asesores y equipos en programas educativos',
    module: 'Capacitación',
  },
  'courses.resources': {
    label: 'Gestionar Recursos Educativos',
    description: 'Permite adjuntar archivos en PDF, video y material descargable',
    module: 'Capacitación',
  },
  'activities.view': {
    label: 'Módulo de Actividades & Tareas',
    description: 'Acceso a consultar grupos de actividades, asignaciones y entregas de estudiantes',
    module: 'Actividades',
  },
  'activities.create': {
    label: 'Crear Grupos de Actividades',
    description: 'Permite diseñar nuevos grupos de actividades, cuestionarios y tareas formativas',
    module: 'Actividades',
  },
  'activities.update': {
    label: 'Editar Actividades & Tareas',
    description: 'Permite modificar consignas, fechas límite y configuración de actividades',
    module: 'Actividades',
  },
  'activities.delete': {
    label: 'Eliminar Actividades',
    description: 'Permite remover grupos de actividades y tareas creadas',
    module: 'Actividades',
  },
  'activities.assign': {
    label: 'Asignar Actividades a Estudiantes',
    description: 'Permite asignar actividades a usuarios, agencias o cursos específicos',
    module: 'Actividades',
  },
  'activities.resources': {
    label: 'Recursos de Actividades',
    description: 'Permite adjuntar guías, rúbricas y material de apoyo en las actividades',
    module: 'Actividades',
  },
  'activities.progress': {
    label: 'Ver Progreso & Calificaciones',
    description: 'Permite revisar entregas de alumnos, calificar y ver el estado de avance',
    module: 'Actividades',
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
  'landings.view': {
    label: 'Ver Landing Pages',
    description: 'Acceso a consultar y listar páginas de aterrizaje de la agencia',
    module: 'Landing Pages',
  },
  'landings.create': {
    label: 'Crear Landing Pages',
    description: 'Permite diseñar y publicar nuevas landing pages para la agencia',
    module: 'Landing Pages',
  },
  'landings.edit': {
    label: 'Editar Landing Pages',
    description: 'Permite modificar formularios, diseño y configuración de landings',
    module: 'Landing Pages',
  },
  'landings.delete': {
    label: 'Eliminar Landing Pages',
    description: 'Permite dar de baja o eliminar landing pages existentes',
    module: 'Landing Pages',
  },
  view_landings: {
    label: 'Ver Landing Pages',
    description: 'Acceso a consultar y listar páginas de aterrizaje de la agencia',
    module: 'Landing Pages',
  },
  manage_landings: {
    label: 'Administrar Landing Pages',
    description: 'Acceso completo para crear, editar y eliminar páginas de aterrizaje',
    module: 'Landing Pages',
  },
  'permission_groups.view': {
    label: 'Ver Grupos de Permisos',
    description: 'Permite consultar y visualizar los grupos de permisos configurables del tenant',
    module: 'Roles & Permisos',
  },
  'permission_groups.create': {
    label: 'Crear Grupos de Permisos',
    description: 'Permite registrar nuevos grupos de permisos personalizados',
    module: 'Roles & Permisos',
  },
  'permission_groups.edit': {
    label: 'Editar Grupos de Permisos',
    description: 'Permite actualizar el nombre, descripción y estado de grupos de permisos',
    module: 'Roles & Permisos',
  },
  'permission_groups.delete': {
    label: 'Eliminar Grupos de Permisos',
    description: 'Permite eliminar grupos de permisos no utilizados mediante baja segura',
    module: 'Roles & Permisos',
  },
  'permission_groups.manage': {
    label: 'Administrar Permisos de Grupo',
    description: 'Permite configurar, agregar y remover permisos asociados a un grupo',
    module: 'Roles & Permisos',
  },
  'roles.manage': {
    label: 'Administrar Roles & Permisos',
    description: 'Permite crear, configurar y asignar roles y permisos personalizados a usuarios del equipo',
    module: 'Roles & Permisos',
  },
  'roles.view': {
    label: 'Ver Roles & Permisos',
    description: 'Permite consultar el catálogo de roles y permisos configurados en la agencia',
    module: 'Roles & Permisos',
  },
  manage_roles: {
    label: 'Administrar Roles & Permisos',
    description: 'Permite crear y gestionar los roles de la agencia',
    module: 'Roles & Permisos',
  },
};

const ACTION_MAP: Record<string, { verb: string; desc: string }> = {
  create: { verb: 'Crear', desc: 'Permite crear nuevos registros de ' },
  view: { verb: 'Ver', desc: 'Permite consultar y visualizar ' },
  update: { verb: 'Editar', desc: 'Permite actualizar y modificar ' },
  edit: { verb: 'Editar', desc: 'Permite actualizar y modificar ' },
  delete: { verb: 'Eliminar', desc: 'Permite dar de baja y borrar ' },
  destroy: { verb: 'Eliminar', desc: 'Permite dar de baja y borrar ' },
  manage: { verb: 'Administrar', desc: 'Acceso completo de gestión y control sobre ' },
  assign: { verb: 'Asignar', desc: 'Permite asignar a usuarios y miembros del equipo ' },
  approve: { verb: 'Aprobar', desc: 'Permite validar y aprobar solicitudes de ' },
  reject: { verb: 'Rechazar', desc: 'Permite denegar o rechazar solicitudes de ' },
  pricing: { verb: 'Gestionar Precios de', desc: 'Permite configurar tarifas y márgenes para ' },
  catalog: { verb: 'Ver Catálogo de', desc: 'Acceso al catálogo comercial de ' },
  resources: { verb: 'Gestionar Recursos de', desc: 'Acceso a materiales y archivos adjuntos de ' },
};

const DOMAIN_MAP: Record<string, string> = {
  stages: 'Etapas del CRM',
  stage: 'Etapas del CRM',
  courses: 'Cursos y Capacitaciones',
  course: 'Cursos y Capacitaciones',
  packages: 'Paquetes de Viajes',
  package: 'Paquetes de Viajes',
  requests: 'Solicitudes de Reserva',
  request: 'Solicitudes de Reserva',
  clients: 'Clientes y Leads',
  client: 'Clientes y Leads',
  estates: 'Propiedades Inmobiliarias',
  estate: 'Propiedades Inmobiliarias',
  automations: 'Reglas de Automatización',
  automation: 'Reglas de Automatización',
  users: 'Usuarios y Equipo',
  user: 'Usuarios y Equipo',
  tasks: 'Tareas',
  task: 'Tareas',
  landings: 'Landing Pages',
  landing: 'Landing Pages',
  permission_groups: 'Grupos de Permisos',
  roles: 'Roles & Permisos',
  role: 'Roles & Permisos',
};

export function getPermissionLabel(key: string): string {
  if (!key) return 'Acceso General';
  const normalizedKey = key.toLowerCase().trim();

  if (PERMISSION_LABELS[normalizedKey]) {
    return PERMISSION_LABELS[normalizedKey].label;
  }

  if (normalizedKey.includes('.')) {
    const [domain, action] = normalizedKey.split('.');
    const verb = ACTION_MAP[action]?.verb || action;
    const domainName = DOMAIN_MAP[domain] || domain;
    return `${verb} ${domainName}`;
  }

  return key
    .replace(/^view_/, 'Ver ')
    .replace(/^manage_/, 'Administrar ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function getPermissionDescription(key: string): string {
  if (!key) return 'Permiso de acceso al módulo';
  const normalizedKey = key.toLowerCase().trim();

  if (PERMISSION_LABELS[normalizedKey]) {
    return PERMISSION_LABELS[normalizedKey].description;
  }

  if (normalizedKey.includes('.')) {
    const [domain, action] = normalizedKey.split('.');
    const descPrefix = ACTION_MAP[action]?.desc || 'Permite gestionar ';
    const domainName = DOMAIN_MAP[domain] || domain;
    return `${descPrefix}${domainName} en la plataforma.`;
  }

  return `Permite acceso y gestión del módulo ${key.replace(/_/g, ' ')}.`;
}

export function getPermissionModule(key: string): string {
  if (!key) return 'General';
  const normalizedKey = key.toLowerCase().trim();

  if (PERMISSION_LABELS[normalizedKey]) {
    return PERMISSION_LABELS[normalizedKey].module;
  }

  // Consistent rubro & domain category mapping
  if (
    normalizedKey.startsWith('estates.') ||
    normalizedKey.startsWith('estate.') ||
    normalizedKey === 'view_estates' ||
    normalizedKey === 'manage_estates' ||
    normalizedKey.includes('estate')
  ) {
    return 'Inmobiliaria';
  }

  if (
    normalizedKey.startsWith('visas.') ||
    normalizedKey.startsWith('packages.') ||
    normalizedKey.startsWith('requests.') ||
    normalizedKey.startsWith('commissions.') ||
    normalizedKey.includes('visa') ||
    normalizedKey.includes('travel') ||
    normalizedKey.includes('w8')
  ) {
    return 'Turismo & Viajes';
  }

  if (
    normalizedKey.startsWith('landings.') ||
    normalizedKey.startsWith('landing.') ||
    normalizedKey.includes('landing')
  ) {
    return 'Landing Pages';
  }

  if (
    normalizedKey.startsWith('lexvault.') ||
    normalizedKey.startsWith('contracts.') ||
    normalizedKey.includes('lexvault') ||
    normalizedKey.includes('contract')
  ) {
    return 'Legal & Contratos';
  }

  if (
    normalizedKey.startsWith('stages.') ||
    normalizedKey.startsWith('clients.') ||
    normalizedKey.startsWith('workspaces.') ||
    normalizedKey.startsWith('automations.') ||
    normalizedKey.includes('crm') ||
    normalizedKey.includes('lead')
  ) {
    return 'CRM & Clientes';
  }

  if (
    normalizedKey.startsWith('campaigns.') ||
    normalizedKey.startsWith('marketing.') ||
    normalizedKey.includes('email_marketing')
  ) {
    return 'Marketing & Campañas';
  }

  if (
    normalizedKey.startsWith('pos.') ||
    normalizedKey.startsWith('products.') ||
    normalizedKey.includes('pos') ||
    normalizedKey.includes('spin_wheel')
  ) {
    return 'Comercio & POS';
  }

  if (
    normalizedKey.startsWith('courses.') ||
    normalizedKey.startsWith('activities.') ||
    normalizedKey.includes('course') ||
    normalizedKey.includes('activit')
  ) {
    return 'Capacitación & Academia';
  }

  if (
    normalizedKey.startsWith('roles.') ||
    normalizedKey.startsWith('permission_groups.') ||
    normalizedKey.startsWith('users.') ||
    normalizedKey.includes('role') ||
    normalizedKey.includes('permission_group')
  ) {
    return 'Roles & Usuarios';
  }

  if (normalizedKey.includes('.')) {
    const [domain] = normalizedKey.split('.');
    return DOMAIN_MAP[domain] || 'General';
  }

  return 'General';
}
