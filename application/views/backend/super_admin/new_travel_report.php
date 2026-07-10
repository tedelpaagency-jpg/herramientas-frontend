<!-- Incluyendo Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Configuración de la fuente Inter -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f7f9fc; /* Fondo muy claro */
        }
        /* Estilos personalizados para el Stepper (Barra de progreso) */
        .step-active {
            box-shadow: 0 4px 14px 0 rgba(0, 150, 255, 0.3);
            border-color: #0096ff;
            background-color: #e5f5ff;
        }
        .step-icon-active {
            background-color: #0096ff;
        }
        /* Estilo para los botones de contador */
        .count-btn {
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .step {
            width: 100%;
            opacity: 0;
            transform: translateX(100%); /* fuera de pantalla derecha */
            transition: transform .4s ease, opacity .4s ease;
            display: none; /* oculto por defecto */
        }
        
        .step.active {
            display: block;
            opacity: 1;
            transform: translateX(0);
        }
        
        .step.exit-left {
            transform: translateX(-100%);
            opacity: 0;
        }
        
        .step.enter-right {
            display: block;
            transform: translateX(100%);
            opacity: 0;
        }
        
        .step.enter-left {
            display: block;
            transform: translateX(-100%);
            opacity: 0;
        }
    </style>
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left">
            
        <form class="app-form" action="" id="saveSaleForm" method="POST"> 
            <input type="hidden" id="client_counts" name="client_counts">
            <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 step step1 active" id="step1">
    
            <h1 class="text-3xl font-extrabold text-gray-900 mb-8">
                Empecemos con tu nueva venta
            </h1>
    
            <!-- Stepper (Barra de progreso multi-paso) -->
            <div class="mb-10 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    
                    <!-- Paso 1: Activo -->
                    <div class="p-4 rounded-xl border-2 border-blue-500 bg-blue-50/70 step-active transition duration-300">
                        <div class="flex items-center">
                            <div class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white step-icon-active mr-3">
                                <!-- Icono (Lucide: User) -->
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-600 font-medium">Paso 1</p>
                                <p class="text-sm font-semibold text-blue-700">Datos principales</p>
                            </div>
                        </div>
                    </div>
    
                    <!-- Paso 2: Inactivo -->
                    <div class="p-4 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition duration-300">
                        <div class="flex items-center">
                            <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 mr-3">
                                <!-- Icono (Lucide: Info) -->
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 font-medium">Paso 2</p>
                                <p class="text-sm font-semibold text-gray-800">Información</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Paso 3: Inactivo -->
                    <div class="p-4 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition duration-300">
                        <div class="flex items-center">
                            <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 mr-3">
                                <!-- Icono (Lucide: File Text) -->
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 15h6"/><path d="M8 11h8"/></svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 font-medium">Paso 3</p>
                                <p class="text-sm font-semibold text-gray-800">Detalles</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Paso 4: Inactivo -->
                    <div class="p-4 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition duration-300">
                        <div class="flex items-center">
                            <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 mr-3">
                                <!-- Icono (Lucide: Check Circle) -->
                                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M9 11l3 3L22 4"/></svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 font-medium">Paso 4</p>
                                <p class="text-sm font-semibold text-gray-800">Revisión final</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <!-- Contenedor Principal del Formulario -->
            <div class="bg-white p-6 sm:p-10 rounded-2xl shadow-xl">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Configuración de la Venta</h2>
          
                    
                    <!-- GRID DE DOS COLUMNAS: NOMBRE Y CONTADORES -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-6">
                        
                        <!-- Columna Izquierda: Nombre de la venta -->
                        <div class="space-y-2">
                            <label for="name_sale" class="block text-base font-semibold text-gray-700">Nombre de la venta</label>
                            <input 
                                type="text" 
                                id="name_sale" 
                                name="name_sale" 
                                placeholder="Ej: Viaje a París Verano 2025"
                                class="block w-full px-4 py-3 form-control rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150"
                                required
                            />
                            <p class="text-sm text-gray-500">Un nombre corto y descriptivo para identificar rápidamente esta venta.</p>
                        </div>
    
                        <!-- Columna Derecha: Contadores de Personas (Ahora es un Toggle/Desplegable) -->
                        <div id="client-counter-section">
                            <!-- Título principal de la sección de conteo -->
                            <label class="block text-base font-semibold text-gray-700 mb-2">
                                ¿Cuántas personas van a viajar?
                            </label>
                            
                            <!-- Contenedor desplegable (TRIGGER) -->
                            <div class="mb-3">
                                <div id="counter-dropdown-trigger" class="w-full px-4 py-3 bg-gray-100 form-control text-gray-700 rounded-xl shadow-sm text-base font-semibold cursor-pointer select-none flex justify-between items-center hover:bg-gray-50 transition duration-150">
                                    <span id="trigger-text" class="text-gray-700">Seleccionar cantidad de viajeros</span>
                                    <!-- Icono de flecha (rota cuando está abierto) -->
                                    <svg id="dropdown-icon" class="w-5 h-5 text-gray-500 transform transition duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </div>
                            </div>
    
                            <!-- Lista de contadores (OCULTA por defecto) -->
                            <div id="client-types-container" class="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-inner hidden">
                                
                                <!-- Contador 1: Adultos (Mínimo 1) -->
                                <div class="client-type-item flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 transition duration-150 hover:shadow-md hover:border-blue-300">
                                    <span class="text-gray-800 font-medium">Adultos / Principal</span>
                                    <div class="flex items-center space-x-2">
                                        <!-- Decrement Button -->
                                        <button type="button" data-type="adultos" data-action="decrement" data-min="1" class="count-btn text-blue-600 bg-blue-100 hover:bg-blue-200 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-150 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        </button>
                                        <!-- Value Input -->
                                        <input type="number" id="adultos_count" value="0" min="1" readonly data-name="Adultos" class="w-12 text-center border-none bg-transparent font-bold text-lg text-gray-900 focus:ring-0 p-0">
                                        <!-- Increment Button -->
                                        <button type="button" data-type="adultos" data-action="increment" class="count-btn text-white bg-blue-600 hover:bg-blue-700 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-150 transform hover:scale-105 active:scale-95">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Contador 2: Niños -->
                                <div class="client-type-item flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 transition duration-150 hover:shadow-md hover:border-blue-300">
                                    <span class="text-gray-800 font-medium">Niños (2-11 años)</span>
                                    <div class="flex items-center space-x-2">
                                        <button type="button" data-type="ninos" data-action="decrement" data-min="0" class="count-btn text-blue-600 bg-blue-100 hover:bg-blue-200 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-150 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        </button>
                                        <input type="number" id="ninos_count" value="0" min="0" readonly data-name="Niños" class="w-12 text-center border-none bg-transparent font-bold text-lg text-gray-900 focus:ring-0 p-0">
                                        <button type="button" data-type="ninos" data-action="increment" class="count-btn text-white bg-blue-600 hover:bg-blue-700 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-150 transform hover:scale-105 active:scale-95">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        </button>
                                    </div>
                                </div>
    
                                <!-- Contador 3: Bebés -->
                                <div class="client-type-item flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 transition duration-150 hover:shadow-md hover:border-blue-300">
                                    <span class="text-gray-800 font-medium">Bebés (0-23 meses)</span>
                                    <div class="flex items-center space-x-2">
                                        <button type="button" data-type="bebes" data-action="decrement" data-min="0" class="count-btn text-blue-600 bg-blue-100 hover:bg-blue-200 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-150 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        </button>
                                        <input type="number" id="bebes_count" value="0" min="0" readonly data-name="Bebés" class="w-12 text-center border-none bg-transparent font-bold text-lg text-gray-900 focus:ring-0 p-0">
                                        <button type="button" data-type="bebes" data-action="increment" class="count-btn text-white bg-blue-600 hover:bg-blue-700 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-150 transform hover:scale-105 active:scale-95">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        </button>
                                    </div>
                                </div>
    
                               <div class="client-type-item flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 transition duration-150 hover:shadow-md hover:border-blue-300">
                                    <span class="text-gray-800 font-medium">Tercera Edad </span>
                                    <div class="flex items-center space-x-2">
                                        <button type="button" data-type="tercera_edad" data-action="decrement" data-min="0" class="count-btn text-blue-600 bg-blue-100 hover:bg-blue-200 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-150 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        </button>
                                        <input type="number" id="tercera_edad_count" value="0" min="0" readonly data-name="Tercera Edad" class="w-12 text-center border-none bg-transparent font-bold text-lg text-gray-900 focus:ring-0 p-0">
                                        <button type="button" data-type="tercera_edad" data-action="increment" class="count-btn text-white bg-blue-600 hover:bg-blue-700 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-150 transform hover:scale-105 active:scale-95">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        </button>
                                    </div>
                                </div>
    
                                 <div class="client-type-item flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 transition duration-150 hover:shadow-md hover:border-blue-300">
                                    <span class="text-gray-800 font-medium">Persona con discapacidad</span>
                                    <div class="flex items-center space-x-2">
                                        <button type="button" data-type="discapacidad" data-action="decrement" data-min="0" class="count-btn text-blue-600 bg-blue-100 hover:bg-blue-200 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-150 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        </button>
                                        <input type="number" id="discapacidad_count" value="0" min="0" readonly data-name="Discapacidad" class="w-12 text-center border-none bg-transparent font-bold text-lg text-gray-900 focus:ring-0 p-0">
                                        <button type="button" data-type="discapacidad" data-action="increment" class="count-btn text-white bg-blue-600 hover:bg-blue-700 p-1 rounded-full w-8 h-8 flex items-center justify-center transition duration-150 transform hover:scale-105 active:scale-95">
                                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                                        </button>
                                    </div>
                                </div>
    
    
                            </div>
                        </div>
                    </div>
                    <!-- FIN DEL GRID -->
    
                    <!-- Botón de acción (Full width, alineado a la derecha, debajo de las dos columnas) -->
                    <div class="flex justify-end pt-6 border-t border-gray-100 mt-8">
                        <a  href="JavaScript:void(0)" onclick="generateFields()" class="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105">
                            Siguiente Paso
                            <!-- Icono de flecha (Lucide: Arrow Right) -->
                            <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </a>
                    </div>
            </div>
        </div>          
        
            <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 step step2" id="step2">
    
                <h1 class="text-3xl font-extrabold text-gray-900 mb-8">
                    Completar información de viajeros
                </h1>
        
                <!-- Stepper (Barra de progreso multi-paso) -->
                <div class="mb-10 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        
                        <!-- Paso 1: Completo -->
                        <div class="p-4 rounded-xl border-2 step-complete transition duration-300">
                            <div class="flex items-center">
                                <div class="w-8 h-8 flex items-center justify-center rounded-full text-white step-icon-complete mr-3">
                                    <!-- Icono (Lucide: Check) -->
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 font-medium">Paso 1</p>
                                    <p class="text-sm font-semibold text-green-700">Datos principales</p>
                                </div>
                            </div>
                        </div>
        
                        <!-- Paso 2: Activo -->
                        <div class="p-4 rounded-xl border-2 step-active transition duration-300">
                            <div class="flex items-center">
                                <div class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white step-icon-active mr-3">
                                    <!-- Icono (Lucide: Info) -->
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 font-medium">Paso 2</p>
                                    <p class="text-sm font-semibold text-blue-700">Información</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Paso 3: Inactivo -->
                        <div class="p-4 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition duration-300">
                            <div class="flex items-center">
                                <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 mr-3">
                                    <!-- Icono (Lucide: File Text) -->
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 15h6"/><path d="M8 11h8"/></svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 font-medium">Paso 3</p>
                                    <p class="text-sm font-semibold text-gray-800">Detalles</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Paso 4: Inactivo -->
                        <div class="p-4 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 transition duration-300">
                            <div class="flex items-center">
                                <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 mr-3">
                                    <!-- Icono (Lucide: Check Circle) -->
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M9 11l3 3L22 4"/></svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 font-medium">Paso 4</p>
                                    <p class="text-sm font-semibold text-gray-800">Revisión final</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
                <!-- Contenedor Principal del Formulario Dinámico -->
                <div class="bg-white p-6 sm:p-10 rounded-2xl shadow-xl">
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Detalles de Cada Viajero</h2>
                    <p class="text-gray-500 mb-8">Por favor, rellene los datos de identificación para las <span id="total-travelers" class="font-bold text-blue-600">...</span> personas registradas en el paso anterior.</p>
                    
                   
                        
                        <!-- Contenedor donde se inyectará el formulario dinámico -->
                        <div id="dynamic-form-container" class="space-y-10">
                            <!-- Los grupos de campos se inyectarán aquí -->
                        </div>
        
                        <!-- Botones de acción -->
                        <div class="flex justify-between pt-6 border-t border-gray-100 mt-10">
                            <button onclick="backToStep1()" type="button" id="back-btn" class="flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out">
                                <!-- Icono de flecha (Lucide: Arrow Left) -->
                                <svg class="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                                Paso Anterior
                            </button>
                            <button  onclick="reportSale()" id="next-btn" class="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105">
                                Guardar y Continuar al Paso 3
                                <!-- Icono de flecha (Lucide: Arrow Right) -->
                                <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </button>
                        </div>
                    
        
                </div>

            </div>
        </form>
    </div>
</div>

    <!-- JavaScript para manejo de formulario y contadores -->
    <script>
        
        
        // Guardar campo automáticamente al salir del input
        $("#saveSaleForm").on("blur", "input, select, textarea", function () {
            let field = $(this).attr("name");
            let value = $(this).val();
    
            if (value.trim() === "") {
              $(this).removeClass("is-valid").addClass("is-invalid");
            } else {
              $(this).removeClass("is-invalid").addClass("is-valid");
            }
        });
      
        const clientCounts = {
                'Adultos': 0,
                'Niños': 0,
                'Bebés': 0,
                'Tercera Edad': 0,
                'Persona con discapacidad': 0
            };
            
            
            
            const container = document.getElementById('client-types-container');
            const trigger = document.getElementById('counter-dropdown-trigger');
            const triggerText = document.getElementById('trigger-text');
            const dropdownIcon = document.getElementById('dropdown-icon');
            const formContainer = document.getElementById('dynamic-form-container');
            const totalTravelersDisplay = document.getElementById('total-travelers');
            
        document.addEventListener('DOMContentLoaded', () => {
            
            
            // Actualiza solo usando clientCounts
            const updateTotalCountDisplay = () => {
                let total = Object.values(clientCounts).reduce((a, b) => a + b, 0);
            
                if (total > 0) {
                    triggerText.innerHTML = `<span class="font-bold">${total}</span> personas seleccionadas`;
                    triggerText.classList.remove('text-gray-700');
                    triggerText.classList.add('text-blue-700');
                    document.getElementById("client_counts").value = JSON.stringify(clientCounts);
                } else {
                    triggerText.textContent = 'Seleccionar cantidad de viajeros';
                    triggerText.classList.remove('text-blue-700');
                    triggerText.classList.add('text-gray-700');
                }
            };
            
            // Actualiza inputs + clientCounts
    const handleCountChange = (event) => {
                const btn = event.target.closest('button');
                if (!btn) return;
            
                const type = btn.dataset.type;        // Adultos, Niños...
                const action = btn.dataset.action;    // increment / decrement
                
                console.log(type);
                
                const input = document.getElementById(`${type}_count`);
            
                if (!input) return;
            
                let current = parseInt(input.value);
                const min = parseInt(input.min) || 0;
            
                if (action === 'increment') {
                    current++;
                } else if (action === 'decrement' && current > min) {
                    current--;
                }
            
                // Actualizar input
                input.value = current;
            
                // ACTUALIZAR clientCounts EXACTAMENTE COMO QUIERES
                clientCounts[type] = current;
            
                // Control visual del botón de decremento
                const decrementBtn = input.previousElementSibling;
                if (decrementBtn && decrementBtn.dataset.action === 'decrement') {
                    const isMin = current <= min;
            
                    decrementBtn.disabled = isMin;
            
                    if (isMin) {
                        decrementBtn.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-200', 'text-gray-400');
                        decrementBtn.classList.remove('bg-blue-100', 'hover:bg-blue-200', 'text-blue-600');
                    } else {
                        decrementBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-200', 'text-gray-400');
                        decrementBtn.classList.add('bg-blue-100', 'hover:bg-blue-200', 'text-blue-600');
                    }
                }
            
                updateTotalCountDisplay();
            };
            
            container.addEventListener('click', handleCountChange);

            
            // Lógica para mostrar/ocultar el desplegable (Dropdown/Toggle Logic)
            trigger.addEventListener('click', () => {
                // Alternar la clase 'hidden' para mostrar/ocultar el contenedor
                container.classList.toggle('hidden');
                
                // Alternar la rotación del icono de flecha
                if (container.classList.contains('hidden')) {
                    dropdownIcon.classList.remove('rotate-180');
                } else {
                    dropdownIcon.classList.add('rotate-180');
                }
            });

            // Inicializar el estado de los botones (deshabilitar si ya están en el mínimo)
            document.querySelectorAll('.client-type-item').forEach(item => {
                const input = item.querySelector('input[type="number"]');
                const decrementButton = item.querySelector('button[data-action="decrement"]');
                const min = parseInt(input.min) || 0;

                if (parseInt(input.value) <= min) {
                    decrementButton.disabled = true;
                    decrementButton.classList.add('opacity-50', 'cursor-not-allowed', 'bg-gray-200', 'text-gray-400');
                }
            });
            
            

           
        });
        
        // Llamar a la función de actualización inicial al cargar la página
        updateTotalCountDisplay();
        
        
    function generateFields()
    {
       
   
        let field =  $('#name_sale');

        if (field.val().trim() === "") {
          field.removeClass("is-valid").addClass("is-invalid");
          return;
        } else {
          field.removeClass("is-invalid").addClass("is-valid");
        }
        
        // ------------------------------------
         // Definición de las etiquetas para cada tipo de cliente (para mejor visualización)
            const clientLabels = {
                'adultos': 'Adulto / Principal',
                'ninos': 'Niño (2-11 años)',
                'bebes': 'Bebé (0-23 meses)',
                'Tercera Edad': 'Tercera Edad',
                'Persona con discapacidad': 'Persona con Discapacidad'
            };
            
        let totalTravelers = 0;
        
            formContainer.innerHTML = ''; // Limpiar el contenedor antes de inyectar
            totalTravelers = 0;

            const normalize = str => str.normalize("NFC").trim();
            // Iterar sobre los tipos de clientes y sus conteos
            Object.keys(clientCounts).forEach(type => {
                
                let key = normalize(type);
                console.log("KEY:", key);
            
                let count = clientCounts[key];
                let label = clientLabels[key];
            
                console.log(count, label);
                
                if (count > 0) {
                    totalTravelers += count;
                    
                    // Contenedor principal para este grupo de clientes
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'group-container bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner mb-8';
                    
                    // Título del grupo
                    const title = document.createElement('h3');
                    title.className = 'text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3';
                    title.textContent = `${label} (${count} persona${count > 1 ? 's' : ''})`;
                    groupDiv.appendChild(title);

                    // Generar campos por cada persona en el conteo
                    for (let i = 1; i <= count; i++) {
                        const personDiv = document.createElement('div');
                        // Separador visual entre personas del mismo tipo
                        personDiv.className = `person-item p-4 mb-4 border-l-4 border-blue-400 bg-white shadow-sm rounded-lg ${i > 1 ? 'mt-6 pt-6 border-t border-gray-100' : ''}`;
                        
                        
                        
                        const personTitle = document.createElement('p');
                        personTitle.className = 'text-md font-semibold text-blue-700 mb-4';
                        personTitle.textContent = `${label} #${i}`;
                        personDiv.appendChild(personTitle);
                        
                        const inputType = document.createElement("input");
                        inputType.type = "hidden";
                        inputType.name = "type[]";
                        inputType.value = type.toLowerCase(); // tu variable
                        
                        personDiv.appendChild(inputType);
                               
                        // Grid para 3 campos: Cédula, Nombres, Apellidos
                        const fieldsGrid = document.createElement('div');
                        fieldsGrid.className = 'grid grid-cols-1 md:grid-cols-3 gap-6';
                        
                        // --- Función de creación de Input Field ---
                        const createInputField = (idSuffix, placeholder, labelText, type = 'text') => {
                            const inputGroup = document.createElement('div');
                            inputGroup.className = 'space-y-1';

                            const label = document.createElement('label');
                            label.htmlFor = `${type.toLowerCase()}-${i}-${idSuffix}`;
                            label.className = 'block text-sm font-medium text-gray-700';
                            label.textContent = labelText;
                            
                            const input = document.createElement('input');
                            input.type = type;
                            input.id = `${type.toLowerCase()}-${i}-${idSuffix}`;
                            input.name = `${idSuffix}`;
                            input.placeholder = placeholder;
                            input.required = true;
                            input.className = 'block w-full px-4 py-3 form-control rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150';
                            

                            inputGroup.appendChild(label);
                            inputGroup.appendChild(input);
                     
                            return inputGroup;
                        };

                        // 1. Número de Cédula (ID)
                        fieldsGrid.appendChild(createInputField('ruc[]', 'Ej: 1712345678', 'Número de Cédula'));
                        
                        // 2. Nombres
                        fieldsGrid.appendChild(createInputField('name[]', 'Ej: Juan Antonio', 'Nombres (Según ID)'));
                        
                        // 3. Apellidos
                        fieldsGrid.appendChild(createInputField('last_name[]', 'Ej: Pérez García', 'Apellidos (Según ID)'));

                        personDiv.appendChild(fieldsGrid);
                        groupDiv.appendChild(personDiv);
                    }

                    formContainer.appendChild(groupDiv);
                }
            });

            // Actualizar el total de viajeros en el texto de cabecera
            totalTravelersDisplay.textContent = totalTravelers;

            // Si no hay viajeros, mostrar un mensaje de error o volver al paso 1 (simulación)
            if (totalTravelers === 0) {
              
                $('#counter-dropdown-trigger').removeClass("is-valid").addClass("is-invalid");
                alert(`No se seleccionó ningún viajero en el Paso 1. Por favor, regrese al paso anterior para configurar la venta.`);
                 
            } else {
                 goToStep2();
            }
            
           
        
    }
        
        
    function goToStep2() {
            const s1 = document.getElementById("step1");
            const s2 = document.getElementById("step2");
        
            // Step 1 sale a la izquierda
            s1.classList.add("exit-left");
        
            setTimeout(() => {
                s1.classList.remove("active", "exit-left");
                s1.style.display = "none";
            }, 400);
        
            // Step 2 entra desde la derecha
            s2.classList.add("enter-right");
            s2.style.display = "block";
        
            requestAnimationFrame(() => {
                s2.classList.remove("enter-right");
                s2.classList.add("active");
            });
        }
        
    function backToStep1() {
            const s1 = document.getElementById("step1");
            const s2 = document.getElementById("step2");
        
            // Step 2 sale a la derecha
            s2.classList.add("exit-right");
        
             s2.classList.remove("active", "exit-right");
                s2.style.display = "none";
        
            // Step 1 entra desde la izquierda
            s1.classList.add("enter-left");
            s1.style.display = "block";
        
            requestAnimationFrame(() => {
                s1.classList.remove("enter-left");
                s1.classList.add("active");
            });
        }


    function reportSale() {
        if ($('#name_sale').val() == '') {
            alert('El nombre de la venta es obligatorio');
        } else {
    
            $('#saveSaleForm').attr('action', '<?= base_url();?>portal/newsale/reportSale')
            $('#saveSaleForm').submit();
        }
    
    }



        

        
    </script>