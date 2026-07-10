<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZIIGO - Ecosistema Empresarial Premium</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        :root {
            --ziigo-primary: #0f172a;
            --ziigo-accent: #3b82f6;
        }

        

        .module-card {
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .icon-wrapper {
            position: relative;
            background: #ffffff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid rgba(226, 232, 240, 0.5);
        }

        .module-card:hover .icon-wrapper {
            transform: translateY(-5px);
            box-shadow: 0 20px 30px -10px rgba(15, 23, 42, 0.1);
            border-color: var(--glow-color);
            background: linear-gradient(145deg, #ffffff, #f8fafc);
        }

        .icon-svg {
            transition: all 0.4s ease;
            width: 28px; 
            height: 28px;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .module-card:hover .icon-svg {
            filter: drop-shadow(0 0 8px var(--glow-color));
        }

        .glass-modal {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(30px);
        }

        .country-pill {
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .country-pill.active {
            background: #0f172a;
            color: white;
            box-shadow: 0 10px 20px -5px rgba(15, 23, 24, 0.2);
        }

        /* Estilos de los Planes */
        .plan-card {
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            border: 2px solid transparent;
        }
        .plan-card.active {
            border-color: #3b82f6;
            background: #f8faff;
        }

        /* Carrito Horizontal */
        .cart-bar {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 1000px;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 2rem;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 100;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .cart-empty {
            transform: translateX(-50%) translateY(150%);
        }

        .cart-item-pill {
            animation: slideIn 0.4s ease-out;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.05);
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="p-4 md:p-12">

    <!-- HEADER / MARCA -->
    <header class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div class="flex items-center gap-4 group cursor-pointer">
            <div class="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rounded-[1.2rem]">
                <span class="text-white font-black text-xl italic">Z</span>
            </div>
            <div>
                <h1 class="text-2xl font-extrabold tracking-tighter text-slate-900 uppercase">ZIIGO<span class="text-blue-600">.</span></h1>
                <p class="text-[8px] font-bold text-slate-400 tracking-[0.4em] uppercase">Ecosystem</p>
            </div>
        </div>

        <div class="flex bg-slate-100 p-1 rounded-2xl gap-1">
            <button onclick="setCountry('EC')" id="btn-ec" class="country-pill active px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <span></span> Dolar
            </button>
            
        </div>
    </header>

    <!-- SECCIÓN DE PLANES -->
    <section class="max-w-6xl mx-auto px-4 mb-20">
        <div class="flex flex-col items-center mb-10 text-center">
            <span class="text-[9px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Paso 1</span>
            <h2 class="text-3xl font-black text-slate-900 uppercase tracking-tighter">Selecciona tu Base</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Plan Essential -->
            <div onclick="selectPlan('essential')" id="plan-essential" class="plan-card bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 cursor-pointer relative overflow-hidden group">
                <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg class="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2z"/></svg>
                </div>
                <h3 class="text-lg font-black text-slate-900 uppercase italic">Essential</h3>
                <p class="text-slate-400 text-xs mt-2 mb-6">Lo básico para iniciar tu transformación.</p>
                <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-black text-slate-900" id="price-essential">$49</span>
                    <span class="text-slate-400 font-bold text-xs">/mes</span>
                </div>
                <ul class="mt-8 space-y-3">
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        ZIIGO
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        Soporte Estándar
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        1 Usuario Admin
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        Viajes
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Contratos
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Regalos
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Visas
                    </li>
                </ul>
                <br>
                 <button onclick="selectPlan('PLAN ESSENTIAL')" class="plan-btn w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200">
                    Seleccionado
                </button>
            </div>

            <!-- Plan Business -->
            <div onclick="selectPlan('business')" id="plan-business" class="plan-card bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 cursor-pointer relative overflow-hidden group">
                <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-blue-600">
                    <svg class="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <div class="bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded-full w-max mb-4 tracking-widest uppercase">Más Popular</div>
                <h3 class="text-lg font-black text-slate-900 uppercase italic">Business</h3>
                <p class="text-slate-400 text-xs mt-2 mb-6">Para empresas en pleno crecimiento.</p>
                <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-black text-slate-900" id="price-business">$89</span>
                    <span class="text-slate-400 font-bold text-xs">/mes</span>
                </div>
                <ul class="mt-8 space-y-3">
                      <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        ZIIGO
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        Soporte Estándar
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        1 Usuario Admin
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        Viajes
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Contratos
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Regalos
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Visas
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Hunter
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Campañas
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Micro Site
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Tareas
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Agenda
                    </li>
                      <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       CRM
                    </li>
                </ul>
                <br>
                 <button onclick="selectPlan('business')" class="plan-btn w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200">
                    Seleccionado
                </button>
            </div>

            <!-- Plan Enterprise -->
            <div onclick="selectPlan('enterprise')" id="plan-enterprise" class="plan-card bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 cursor-pointer relative overflow-hidden group">
                <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg class="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM7 12l3-3 7 7-3 3-7-7z"/></svg>
                </div>
                <h3 class="text-lg font-black text-slate-900 uppercase italic">Enterprise</h3>
                <p class="text-slate-400 text-xs mt-2 mb-6">Escalabilidad total y personalización.</p>
                <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-black text-slate-900" id="price-enterprise">$159</span>
                    <span class="text-slate-400 font-bold text-xs">/mes</span>
                </div>
                <ul class="mt-8 space-y-3">
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       ZIIGO
                    </li>
                      <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        Soporte Estándar
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        1 Usuario Admin
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                        Viajes
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Contratos
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Regalos
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Visas
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Hunter
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Campañas
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Micro Site
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Tareas
                    </li>
                     <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Agenda
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       Automatizacion N8N
                    </li>
                    <li class="flex items-center gap-3 text-xs font-medium text-slate-600">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                       CRM
                    </li>

                </ul>
                <br>
                 <button onclick="selectPlan('PLAN ENTERPRISE')" class="plan-btn w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200">
                    Seleccionado
                </button>
            </div>
        </div>
    </section>

    <!-- MÓDULOS ZIIGO -->
    <section class="max-w-6xl mx-auto px-4 mb-20">
        <div class="flex flex-col items-center mb-12">
            <span class="text-[9px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Paso 2</span>
            <h2 class="text-3xl font-black text-slate-900 uppercase tracking-tighter text-center">Configura tu Ecosistema</h2>
            <p class="text-slate-400 text-sm mt-2">Selecciona los módulos que deseas activar para tu negocio.</p>
        </div>
        
        <div id="module-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
            <!-- Módulos inyectados -->
        </div>
    </section>

    <!-- CARRITO HORIZONTAL (CHECKOUT) -->
    <div id="cart-bar" class="cart-bar cart-empty">
        <div class="flex items-center gap-4 overflow-hidden flex-grow mr-6">
            <div class="hidden md:flex flex-col mr-2">
                <span class="text-[9px] font-black text-blue-400 uppercase tracking-widest">Carrito</span>
                <span class="text-white font-bold text-xs" id="cart-count">0 items</span>
            </div>
            <div id="cart-items-list" class="flex gap-2 overflow-x-auto no-scrollbar py-2">
                <!-- Items del carrito -->
            </div>
        </div>

        <div class="flex items-center gap-6 shrink-0">
            <div class="text-right">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Mensual</span>
                <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-black text-white" id="cart-total">$0</span>
                    <span class="text-slate-400 font-bold text-[10px]" id="cart-currency">USD</span>
                </div>
            </div>
            <button class="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                CHECKOUT
            </button>
        </div>
    </div>

    <!-- MODAL MÓDULOS -->
    <div id="modal" class="fixed inset-0 bg-slate-950/80 z-[110] flex items-center justify-center p-4 opacity-0 pointer-events-none transition-all duration-500">
        <div class="glass-modal w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative scale-95 transition-all duration-500" id="modal-content">
            <button onclick="closeModal()" class="absolute top-8 right-8 bg-white/50 hover:bg-slate-900 hover:text-white p-2.5 rounded-full transition-all z-20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div class="w-full md:w-1/2 bg-slate-50 flex items-center justify-center min-h-[300px] p-10">
                <div id="modal-video-placeholder" class="w-full aspect-video rounded-[2rem] bg-white shadow-xl flex items-center justify-center overflow-hidden relative border border-slate-100">
                     <svg class="w-12 h-12 text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                </div>
            </div>
            <div class="w-full md:w-1/2 p-12 flex flex-col justify-between bg-white">
                <div>
                    <div class="flex items-center gap-4 mb-8">
                        <div id="modal-icon-container" class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"></div>
                        <h2 id="modal-title" class="text-3xl font-black text-slate-900 tracking-tighter uppercase"></h2>
                    </div>
                    <p id="modal-desc" class="text-slate-500 text-sm leading-relaxed mb-10 font-medium"></p>
                    <div class="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 flex justify-between items-center">
                        <div>
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest" id="modal-pricing-label">Precio Módulo</span>
                            <div class="flex items-baseline gap-1 mt-0.5">
                                <span class="text-3xl font-black text-slate-900" id="modal-price"></span>
                                <span class="text-slate-400 font-bold uppercase text-[10px]" id="modal-currency-label"></span>
                            </div>
                        </div>
                        <button id="modal-add-btn" class="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all">Añadir</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentCountry = 'EC';
        let cart = [];
        let selectedPlan = null;

        const planPrices = {
            essential: { EC: 29, PE: 107 },
            business: { EC: 59, PE: 218 },
            enterprise: { EC: 99, PE: 366 }
        };

        const icons = {
            ventas: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 8l3 3 7-7" /></svg>`,
            viajes: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 3 21 3s-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.7.5-1.1z" /></svg>`,
            contratos: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
            visas: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>`,
            regalos: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8v12"/><path d="M3 12h18"/><path d="M7 8a5 5 0 0110 0"/></svg>`,
            hunet: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
            campañas: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3h10a3 3 0 013 3v1z"/><path d="M10 11v6a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2"/></svg>`,
            agendamiento: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
            tareas: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
            tikvao: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M12 18h.01"/></svg>`,
            plan: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.63 3 12"/><polyline points="21 12 16.5 14.63 16.5 19.79"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`
        };

        const modules = [
            { id: 'ventas', name: 'Ventas', icon: 'ventas', color: '#3b82f6', desc: 'Control de facturación, presupuestos y proyecciones de ingresos.', priceEC: 12, pricePE: 45 },
            { id: 'viajes', name: 'Viajes', icon: 'viajes', color: '#6366f1', desc: 'Gestión de viáticos, rutas y reservas corporativas.', priceEC: 10, pricePE: 37 },
            { id: 'contratos', name: 'Contratos', icon: 'contratos', color: '#10b981', desc: 'Repositorio legal con firma electrónica y avisos de vencimiento.', priceEC: 15, pricePE: 55 },
            { id: 'visas', name: 'Visas', icon: 'visas', color: '#f59e0b', desc: 'Asesoría y seguimiento de procesos migratorios laborales.', priceEC: 25, pricePE: 92 },
            { id: 'regalos', name: 'Regalos', icon: 'regalos', color: '#f43f5e', desc: 'Gestión de incentivos y programas de fidelización.', priceEC: 8, pricePE: 30 },
            { id: 'hunet', name: 'Hunet', icon: 'hunet', color: '#8b5cf6', desc: 'Plataforma de recursos humanos y clima organizacional.', priceEC: 18, pricePE: 66 },
            { id: 'campañas', name: 'Campañas', icon: 'campañas', color: '#06b6d4', desc: 'Marketing masivo y comunicación estratégica segmentada.', priceEC: 20, pricePE: 74 },
            { id: 'agendamiento', name: 'Agenda', icon: 'agendamiento', color: '#14b8a6', desc: 'Citas, reservas y gestión de tiempo profesional.', priceEC: 9, pricePE: 33 },
            { id: 'tareas', name: 'Tareas', icon: 'tareas', color: '#f97316', desc: 'Productividad de equipos y gestión de proyectos por hitos.', priceEC: 7, pricePE: 26 },
            { id: 'tikvao', name: 'Micro Site', icon: 'tikvao', color: '#1e293b', desc: 'Tu identidad digital en un solo enlace: Video y contacto.', priceEC: 5, pricePE: 19 }
        ];

        function setCountry(code) {
            currentCountry = code;
            document.getElementById('btn-ec').classList.toggle('active', code === 'EC');
            document.getElementById('btn-pe').classList.toggle('active', code === 'PE');
            
            // Actualizar precios de planes
            document.getElementById('price-essential').innerText = code === 'EC' ? '$29' : 'S/ 107';
            document.getElementById('price-business').innerText = code === 'EC' ? '$59' : 'S/ 218';
            document.getElementById('price-enterprise').innerText = code === 'EC' ? '$99' : 'S/ 366';
            
            updateCart();
            renderGrid();
        }

        function selectPlan(planId) {
            selectedPlan = planId;
            document.querySelectorAll('.plan-card').forEach(card => card.classList.remove('active'));
            document.getElementById(`plan-${planId}`).classList.add('active');
            updateCart();
        }

        function renderGrid() {
            const grid = document.getElementById('module-grid');
            grid.innerHTML = '';
            modules.forEach(mod => {
                const isInCart = cart.some(item => item.id === mod.id);
                const card = document.createElement('div');
                card.className = `module-card flex flex-col items-center cursor-pointer group ${isInCart ? 'opacity-40 grayscale-[0.5]' : ''}`;
                card.style.setProperty('--glow-color', mod.color);
                card.onclick = () => openModal(mod);
                card.innerHTML = `
                    <div class="icon-wrapper w-14 h-14 rounded-full flex items-center justify-center mb-3 overflow-hidden" style="color: ${mod.color}">
                        ${icons[mod.icon]}
                        ${isInCart ? '<div class="absolute inset-0 bg-slate-900/10 flex items-center justify-center"><svg class="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div>' : ''}
                    </div>
                    <span class="text-[8px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-[0.2em] text-center">${mod.name}</span>
                `;
                grid.appendChild(card);
            });
        }

        function openModal(mod) {
            const modal = document.getElementById('modal');
            const isInCart = cart.some(item => item.id === mod.id);
            
            document.getElementById('modal-title').innerText = mod.name;
            document.getElementById('modal-desc').innerText = mod.desc;
            
            const price = currentCountry === 'EC' ? `$${mod.priceEC}` : `S/ ${mod.pricePE}`;
            document.getElementById('modal-price').innerText = price;
            document.getElementById('modal-currency-label').innerText = currentCountry === 'EC' ? 'USD' : 'PEN';
            
            const iconContainer = document.getElementById('modal-icon-container');
            iconContainer.innerHTML = icons[mod.icon];
            iconContainer.style.color = mod.color;
            iconContainer.style.backgroundColor = mod.color + '10';

            const addBtn = document.getElementById('modal-add-btn');
            if (isInCart) {
                addBtn.innerText = 'Remover';
                addBtn.className = 'bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-all';
                addBtn.onclick = () => { removeFromCart(mod.id); closeModal(); };
            } else {
                addBtn.innerText = 'Añadir al Ecosistema';
                addBtn.className = 'bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all';
                addBtn.onclick = () => { addToCart(mod); closeModal(); };
            }

            modal.classList.remove('opacity-0', 'pointer-events-none');
            document.getElementById('modal-content').classList.remove('scale-95');
            document.getElementById('modal-content').classList.add('scale-100');
        }

        function closeModal() {
            const modal = document.getElementById('modal');
            modal.classList.add('opacity-0', 'pointer-events-none');
            document.getElementById('modal-content').classList.remove('scale-100');
            document.getElementById('modal-content').classList.add('scale-95');
        }

        function addToCart(mod) {
            if (!cart.some(item => item.id === mod.id)) {
                cart.push(mod);
                updateCart();
                renderGrid();
            }
        }

        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            updateCart();
            renderGrid();
        }

        function updateCart() {
            const cartBar = document.getElementById('cart-bar');
            const itemsList = document.getElementById('cart-items-list');
            const countEl = document.getElementById('cart-count');
            const totalEl = document.getElementById('cart-total');
            const currencyEl = document.getElementById('cart-currency');

            if (cart.length === 0 && !selectedPlan) {
                cartBar.classList.add('cart-empty');
                return;
            }

            cartBar.classList.remove('cart-empty');
            
            let total = 0;
            itemsList.innerHTML = '';
            
            // Si hay un plan, añadirlo primero al carrito visual
            if (selectedPlan) {
                total += planPrices[selectedPlan][currentCountry];
                const planPill = document.createElement('div');
                planPill.className = 'cart-item-pill flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-400/30 shrink-0 bg-blue-500/10';
                planPill.innerHTML = `
                    <div class="text-blue-400">${icons.plan.replace('width="28"', 'width="16"').replace('height="28"', 'height="16"')}</div>
                    <span class="text-white text-[10px] font-black uppercase tracking-tighter">Plan ${selectedPlan}</span>
                `;
                itemsList.appendChild(planPill);
            }

            cart.forEach(item => {
                total += currentCountry === 'EC' ? item.priceEC : item.pricePE;
                
                const pill = document.createElement('div');
                pill.className = 'cart-item-pill flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 shrink-0';
                pill.innerHTML = `
                    <div style="color: ${item.color}">${icons[item.icon].replace('width="28"', 'width="16"').replace('height="28"', 'height="16"')}</div>
                    <span class="text-white text-[10px] font-bold uppercase tracking-tighter">${item.name}</span>
                    <button onclick="removeFromCart('${item.id}')" class="text-white/40 hover:text-white ml-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                `;
                itemsList.appendChild(pill);
            });

            countEl.innerText = `${cart.length + (selectedPlan ? 1 : 0)} items`;
            totalEl.innerText = `${currentCountry === 'EC' ? '$' : 'S/ '}${total}`;
            currencyEl.innerText = currentCountry === 'EC' ? 'USD' : 'PEN';
        }

        renderGrid();
    </script>
</body>
</html>