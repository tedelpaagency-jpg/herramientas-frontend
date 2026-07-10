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
        
                /* ------------------------------------ */
        /* CONFETI PROFESIONAL                 */
        /* ------------------------------------ */

        .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 5;
        }

        .confetti {
            position: absolute;
            width: 8px;
            height: 14px;
            opacity: 0;
            border-radius: 2px;
            will-change: transform, opacity;
            animation: confetti-fall var(--duration) ease-out forwards;
        }

        @keyframes confetti-fall {
            0% {
                opacity: 1;
                transform: translate(0, 0) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: translate(var(--final-x), var(--final-y)) rotate(var(--rotation));
            }
        }

        /* Colores modernos del confeti */
        .color-1 { background: #4ade80; }
        .color-2 { background: #60a5fa; }
        .color-3 { background: #facc15; }
        .color-4 { background: #f87171; }
        .color-5 { background: #a78bfa; }

        /* Icono éxito encima del confeti */
        #success-card { position: relative; z-index: 20; }
        #confetti-origin { position: relative; z-index: 30; }

        /* Animaciones extra */
        @keyframes pop-in {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .pop-in-effect {
            animation: pop-in 0.5s ease-out forwards;
        }

        .check-svg {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw-check 3.5s ease-in-out forwards;
        }

        @keyframes draw-check {
            to { stroke-dashoffset: 0; }
        }
        
        
        /* -------------------------- */
        /* CONFETI PROFESIONAL        */
        /* -------------------------- */
        .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 5;
        }
        
        .confetti {
            position: absolute;
            width: 8px;
            height: 14px;
            opacity: 0;
            border-radius: 2px;
            will-change: transform, opacity;
            animation: confetti-fall var(--duration) ease-out forwards;
        }
        
        /* Animación con rotación + caída */
        @keyframes confetti-fall {
            0% {
                opacity: 1;
                transform: translate(0, 0) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: translate(var(--final-x), var(--final-y)) rotate(var(--rotation));
            }
        }
        
        /* Colores modernos */
        .color-1 { background: #4ade80; }
        .color-2 { background: #60a5fa; }
        .color-3 { background: #facc15; }
        .color-4 { background: #f87171; }
        .color-5 { background: #a78bfa; }
    </style>
    
    <?php $row = $this->db->get_where('sale',['sale_id'=>$id])->row_array();?>
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left">
        <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 step step1 active" id="step1">
                <h1 class="text-3xl font-extrabold text-gray-900 mb-8">
                    Completar detalles de la venta
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
        
                        <!-- Paso 2: Completo -->
                        <div class="p-4 rounded-xl border-2 step-complete transition duration-300">
                            <div class="flex items-center">
                                <div class="w-8 h-8 flex items-center justify-center rounded-full text-white step-icon-complete mr-3">
                                    <!-- Icono (Lucide: Check) -->
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 font-medium">Paso 2</p>
                                    <p class="text-sm font-semibold text-green-700">Información</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Paso 3: Activo -->
                        <div class="p-4 rounded-xl border-2 step-active transition duration-300">
                            <div class="flex items-center">
                                <div class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white step-icon-active mr-3">
                                    <!-- Icono (Lucide: File Text) -->
                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 15h6"/><path d="M8 11h8"/></svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 font-medium">Paso 3</p>
                                    <p class="text-sm font-semibold text-blue-700">Detalles</p>
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
        
                 <!-- Sección de Resumen Financiero -->
                <div class="mb-10 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <!-- Icono (Lucide: Trending Up) -->
                        <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/></svg>
                        Resumen Proyectado
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        <!-- Margen Total -->
                        <div class="p-4 rounded-xl financial-box border-l-4 border-green-500 bg-green-50">
                            <p class="text-sm font-medium text-green-700">Margen Total</p>
                            <p class="text-2xl font-extrabold text-green-900 mt-1" id="margen-total">$ <?= isset($row) ? $row['mgt'] :'0.00';?></p>
                            
                        </div>

                        <!-- Ganancia Neta -->
                        <div class="p-4 rounded-xl financial-box border-l-4 border-purple-500 bg-purple-50">
                            <p class="text-sm font-medium text-purple-700">Ganancia Neta</p>
                            <p class="text-2xl font-extrabold text-purple-900 mt-1" id="ganancia-neta">$ <?= isset($row) ? $row['gnt'] :'0.00';?></p>
                            
                        </div>
                        
                        <!-- IVA (15%) -->
                        <div class="p-4 rounded-xl financial-box border-l-4 border-yellow-500 bg-yellow-50">
                            <p class="text-sm font-medium text-yellow-700">IVA (<?php echo $this->crud_model->getInfo('taxes')*100; ?>%)</p>
                            <p class="text-2xl font-extrabold text-yellow-900 mt-1" id="iva">$ <?= isset($row) ? $row['taxes'] :'0.00';?></p>
                           
                        </div>

                        <!-- Total a Facturar -->
                        <div class="p-4 rounded-xl financial-box border-l-4 border-blue-500 bg-blue-100">
                            <p class="text-sm font-medium text-blue-700">Total a Facturar</p>
                            <p class="text-2xl font-extrabold text-blue-900 mt-1" id="total-facturar">$ <?= isset($row) ? $row['fact_value'] :'0.00';?></p>
                            
                        </div>
                    </div>
                </div>
        
        
                <!-- Contenedor Principal del Formulario de Detalles -->
                <div class="mb-10 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Detalles Financieros y de Servicio</h2>
                    <p class="text-gray-500 mb-8">Defina los valores, costos y método de pago para calcular la rentabilidad de esta venta.</p>
                    
                    <form id="details-form" action="<?= base_url(); ?>portal/travel_report/saveReport" method="POST">
                        <input type="hidden" value="<?= $id; ?>" name="sale_id" /> 
                        <!-- Sección de Variables de Rentabilidad -->
                        <div class="mb-10 p-6 rounded-xl border border-blue-200 bg-blue-50">
                            <h3 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
                                <!-- Icono (Lucide: Dollar Sign) -->
                                <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                Variables de Rentabilidad
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
                                <!-- Valor Depositado / Total al Cliente -->
                                <div>
                                    <label for="valor-cliente" class="block text-sm font-medium text-gray-700">Valor depositado del cliente ($)</label>
                                    <div class="mt-1 relative rounded-xl shadow-sm">
                                        <input type="number" id="valor-cliente" name="valor-cliente" placeholder="Ej: 1250.00" value="<?= isset($row) ? $row['total_client'] :'0.00';?>" required step="0.01" class="block w-full px-4 py-3 pl-10 form-control rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span class="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                    </div>
                                    <p class="mt-1 text-xs text-gray-500">Ingreso total (Sin IVA)</p>
                                </div>
        
                                <!-- Costo al Proveedor -->
                                <div>
                                    <label for="costo-proveedor" class="block text-sm font-medium text-gray-700">Costo al Proveedor (o interno) ($)</label>
                                    <div class="mt-1 relative rounded-xl shadow-sm">
                                        <input type="number" id="costo-proveedor" name="costo-proveedor" placeholder="Ej: 1000.00" value="<?= isset($row) ? $row['total_supplier'] :'0.00';?>" required step="0.01" class="block w-full px-4 py-3 pl-10 form-control rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span class="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                    </div>
                                    <p class="mt-1 text-xs text-gray-500">Costo del servicio/producto</p>
                                </div>
                                
                                <!-- Valor Adicional (Cargos extras) -->
                                <div>
                                    <label for="valor-adicional" class="block text-sm font-medium text-gray-700">Valor adicional (Cargos extras) ($)</label>
                                    <div class="mt-1 relative rounded-xl shadow-sm">
                                        <input type="number" id="valor-adicional" name="valor-adicional" placeholder="Ej: 25.00" value="<?= isset($row) ? $row['total_additional'] :'0.00';?>" step="0.01" class="block w-full px-4 py-3 pl-10 form-control rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span class="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                    </div>
                                    <p class="mt-1 text-xs text-gray-500">Comisiones o gastos extra</p>
                                </div>
                                
                                <!-- Gastos de Gestión (Fee) -->
                                <div>
                                    <label for="gastos-gestion" class="block text-sm font-medium text-gray-700">Gastos de Gestión (Fee) ($)</label>
                                    <div class="mt-1 relative rounded-xl shadow-sm">
                                        <input type="number" id="gastos-gestion" name="gastos-gestion" placeholder="Ej: 50.00" value="<?= isset($row) ? $row['total_fee'] :'0.00';?>" step="0.01" class="block w-full px-4 py-3 pl-10 form-control rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150">
                                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span class="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                    </div>
                                    <p class="mt-1 text-xs text-gray-500">Ganancia por manejo de operación</p>
                                </div>
                            </div>
                        </div>
        
                       
        
                        <!-- Sección de Método de Pago y Notas -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                           
                            <!-- Principal -->
                            <div>
                                <label for="fact_principal" class="block text-sm font-medium text-gray-700">Principal de la factura</label>
                                <select id="fact_principal" name="client_id" required class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150">
                                     <option value="">Seleccionar</option>
                                    <?php $clients = $this->db->get_where('sale_details',['sale_id'=>$id])->result_array(); ?>
                                    <?php foreach($clients as $client): ?>
                                    <option value="<?= $client['client_id']; ?>" <?= $client['client_id'] == $row['client_id'] ? 'Selected':''; ?>><?= $this->crud_model->getName('client',$client['client_id']);?></option>
                                    <?php endforeach?>
                                </select>
                            </div>
                            <!-- Tipo de Cliente -->
                            <div>
                                <label for="tipo-cliente" class="block text-sm font-medium text-gray-700">Tipo de viaje</label>
                                <select id="tipo-cliente" name="tipo-cliente" required class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150">
                                    <option value="recurrente">Cliente Recurrente (Ya ha comprado)</option>
                                    <option value="nuevo">Nuevo Cliente (Primera Compra)</option>
                                    <option value="corporativo">Cliente Corporativo/Empresarial</option>
                                    <option value="vip">Cliente VIP/Especial</option>
                                </select>
                            </div>
                        </div>
        
                        <!-- seguro de viaje , chop de viaje -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <!-- Método de Pago -->
                            <div>
                                <label for="metodo-pago" class="block text-sm font-medium text-gray-700">seguro de viaje</label>
                                <select id="metodo-pago" name="metodo-pago" required class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150">
                                    <option value="transferencia">Transferencia Bancaria</option>
                                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
        
                            <!-- Tipo de Cliente -->
                            <div>
                                <label for="tipo-cliente" class="block text-sm font-medium text-gray-700">Chip de viaje</label>
                                <select id="tipo-cliente" name="tipo-cliente" required class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150">
                                    <option value="recurrente">Cliente Recurrente (Ya ha comprado)</option>
                                    <option value="nuevo">Nuevo Cliente (Primera Compra)</option>
                                    <option value="corporativo">Cliente Corporativo/Empresarial</option>
                                    <option value="vip">Cliente VIP/Especial</option>
                                </select>
                            </div>
                        </div>
        
        
                         <!-- Método de Pago -->
                            <div>
                                <label for="metodo-pago" class="block text-sm font-medium text-gray-700">Método de pago</label>
                                <select id="metodo-pago" name="metodo-pago" required class="block w-full px-4 py-3 form-control rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150">
                                    <option value="transferencia">Transferencia Bancaria</option>
                                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                                    <option value="efectivo">Efectivo</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
        
                        
                        <!-- Detalle de la Venta (Textarea) -->
                        <div class="mb-8">
                            <label for="detalle-venta" class="block text-sm font-medium text-gray-700">Detalle de la venta</label>
                            <textarea id="detalle-venta" name="detalle-venta" rows="4" placeholder="Describa brevemente el servicio o producto vendido." class="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition duration-150">Asesoría de venta de terreno en Guayaquil, incluye estudio de mercado y trámites legales.</textarea>
                        </div>
        
        
                        <!-- Botones de acción -->
                        <div class="flex justify-between pt-6 border-t border-gray-100 mt-10">
                            <button type="button" id="back-btn" class="flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out">
                                <!-- Icono de flecha (Lucide: Arrow Left) -->
                                <svg class="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                                Paso Anterior
                            </button>
                            <button type="submit" id="next-btn" class="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105">
                                Revisar y Continuar al Paso 4
                                <!-- Icono de flecha (Lucide: Arrow Right) -->
                                <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </button>
                        </div>
                    </form>
        
                </div>

       
        </div>
            
        
        <!-- Contenedor principal -->
        <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 step step2" id="step2">
    
            <!-- Stepper -->
            <div class="mb-10 bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    
                    <div class="p-4 rounded-xl border-2 step-complete">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full step-icon-complete flex items-center justify-center text-white mr-3">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-600">Paso 1</p>
                                <p class="text-sm font-semibold text-green-700">Datos principales</p>
                            </div>
                        </div>
                    </div>
    
                    <div class="p-4 rounded-xl border-2 step-complete">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full step-icon-complete flex items-center justify-center text-white mr-3">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-600">Paso 2</p>
                                <p class="text-sm font-semibold text-green-700">Información</p>
                            </div>
                        </div>
                    </div>
    
                    <div class="p-4 rounded-xl border-2 step-complete">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full step-icon-complete flex items-center justify-center text-white mr-3">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500">Paso 3</p>
                                <p class="text-sm font-semibold text-green-700">Detalles</p>
                            </div>
                        </div>
                    </div>
    
                    <div class="p-4 rounded-xl border-2 step-active">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full step-icon-complete flex items-center justify-center text-white mr-3">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500">Paso 4</p>
                                <p class="text-sm font-semibold text-green-700">Completado</p>
                            </div>
                        </div>
                    </div>
    
                </div>
            </div>
    
            <!-- Tarjeta de Éxito -->
            <div id="success-card" class="bg-white p-6 sm:p-12 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center min-h-[50vh] pop-in-effect">
    
                
    
                <!-- Ícono de celebración -->
                <div id="confetti-origin" class="mb-4">
                    <span class="text-green-500 text-6xl">🎉</span>
                </div>
                
                
                
                
                <div class="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">¡FELICITACIONES!</h1>
                   
                </div>
                <br>
                <p class="text-2xl font-semibold text-gray-800 mb-8">
                    Tu reporte fue enviado con éxito.
                </p>
    
                <p class="text-gray-500 max-w-lg mb-10">
                    La información de la venta ha sido registrada y los detalles financieros calculados.
                    Puedes revisar el historial o comenzar una nueva venta.
                </p>
    
                <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <a href="<?= base_url(); ?>portal/feed" class="flex items-center px-8 py-3 border border-gray-300 rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                        <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        Ir al Dashboard
                    </a>
    
                    <a href="<?= base_url(); ?>portal/new_travel_report" class="flex items-center px-8 py-3 rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 transform hover:scale-105">
                        <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Crear Nueva Venta
                    </a>
                </div>
    
            </div>
    
        </div>
        
    </div>
</div>

    <!-- JavaScript para manejo de formulario y contadores -->
    <script>
        
        let mgt = 0;
        
        // Guardar campo automáticamente al salir del input
        $("#details-form").on("blur", "input, select, textarea", function () {
            let field = $(this).attr("name");
            let value = $(this).val();
    
            if (value.trim() === "") {
              $(this).removeClass("is-valid").addClass("is-invalid");
            } else {
              $(this).removeClass("is-invalid").addClass("is-valid");
            }
            
            getMargenTotal();
        });

        
   function getMargenTotal() {
        let deposit_client   = parseFloat($('#valor-cliente').val())   || 0;
        let deposit_provider = parseFloat($('#costo-proveedor').val()) || 0;
        let adicional        = parseFloat($('#valor-adicional').val()) || 0;
        let gestion          = parseFloat($('#gastos-gestion').val())  || 0;
    
        mgt = deposit_client - deposit_provider;
    
        $('#margen-total').html('$ ' + mgt.toFixed(2));
    
        // Validación extra: adicional + gestión = margen total
        let sumaExtras = adicional + gestion;
    
        if (sumaExtras !== mgt) {
            $('#valor-adicional, #gastos-gestion')
                .removeClass('is-valid')
                .addClass('is-invalid');
        } else {
            $('#valor-adicional, #gastos-gestion')
                .removeClass('is-invalid')
                .addClass('is-valid');
        }
        
        
        $.post(
            '<?= base_url(); ?>portal/getGNT',
            { mgt: mgt },
            function (data) {
                console.log(data);
        
                $('#ganancia-neta').html('$ ' + parseFloat(data.gnt).toFixed(2));
                $('#iva').html('$ ' + parseFloat(data.taxes).toFixed(2));
                $('#total-facturar').html('$ ' + parseFloat(data.vf).toFixed(2));
            },
            'json' // <- IMPORTANTE
        );
                                
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


    $("#details-form").on("submit", function(e) {
        e.preventDefault(); // evita el envío normal
    
        let form = $(this);
        let url  = form.attr("action");
        let data = form.serialize();
    
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            dataType: "json",
            success: function(res) {
                console.log(res);
    
               if (res.status === 'success') {
                    
                     goToStep2();
                    
                   
                    
                } else {
                    // error
                    Toast.fire({
                        icon: 'error',
                        title: res.message
                    });
                    
                   
                }
            },
            error: function(xhr) {
                 // error
                Toast.fire({
                    icon: 'error',
                    title: "Error al procesar la solicitud"
                });
                    
               
                    
                console.log(xhr.responseText);
            }
        });
    });



        

        
    </script>