export interface EstateCategory {
  id: number;
  name: string;
  icon: string;
  count?: number;
}

export const ESTATE_CATEGORIES_CATALOG: EstateCategory[] = [
  { id: 1, name: 'Bodegas', icon: 'warehouse' },
  { id: 2, name: 'Casa', icon: 'home' },
  { id: 3, name: 'Complejo turístico', icon: 'palmtree' },
  { id: 4, name: 'Departamento', icon: 'building' },
  { id: 5, name: 'Edificio', icon: 'building-2' },
  { id: 6, name: 'Empresa', icon: 'briefcase' },
  { id: 7, name: 'Finca', icon: 'trees' },
  { id: 8, name: 'Galpón', icon: 'warehouse' },
  { id: 9, name: 'Gasolinera', icon: 'fuel' },
  { id: 10, name: 'Hacienda', icon: 'landmark' },
  { id: 11, name: 'Hotel', icon: 'hotel' },
  { id: 12, name: 'Local comercial', icon: 'store' },
  { id: 13, name: 'Lotes', icon: 'layers' },
  { id: 14, name: 'Lotización', icon: 'map' },
  { id: 15, name: 'Oficinas', icon: 'briefcase' },
  { id: 16, name: 'Oficinas amobladas', icon: 'armchair' },
  { id: 17, name: 'Planta', icon: 'factory' },
  { id: 18, name: 'Propiedad Comercial', icon: 'shopping-bag' },
  { id: 19, name: 'Quinta', icon: 'home' },
  { id: 20, name: 'Solar', icon: 'sun' },
  { id: 21, name: 'Suites', icon: 'key' },
  { id: 22, name: 'Terreno', icon: 'mountain' },
];

export const getEstateCategoryName = (propertyType: any): string => {
  if (propertyType === null || propertyType === undefined || propertyType === '') {
    return 'Inmueble';
  }

  // Si ya es un nombre legible
  if (typeof propertyType === 'string' && isNaN(Number(propertyType))) {
    const lower = propertyType.toLowerCase();
    const map: Record<string, string> = {
      house: 'Casa',
      apartment: 'Departamento',
      land: 'Terreno',
      commercial: 'Comercial',
      office: 'Oficina',
    };
    return map[lower] || propertyType;
  }

  const num = Number(propertyType);
  const found = ESTATE_CATEGORIES_CATALOG.find(c => c.id === num);
  return found ? found.name : 'Inmueble';
};

export const getEstateOperationLabel = (propertyStatus: any): string => {
  const num = Number(propertyStatus);
  switch (num) {
    case 1:
      return 'Alquiler';
    case 2:
      return 'Venta';
    case 3:
      return 'Remate';
    default:
      return 'Operación';
  }
};

export const getEstateStatusLabel = (status: any): string => {
  const s = String(status);
  switch (s) {
    case '1':
    case 'available':
      return 'Disponible';
    case '2':
    case 'reserved':
      return 'Reservada';
    case '3':
    case 'sold':
      return 'Vendida';
    case '4':
    case 'rented':
      return 'Alquilada';
    default:
      return 'Activa';
  }
};
