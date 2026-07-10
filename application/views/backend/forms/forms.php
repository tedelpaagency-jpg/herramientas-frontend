<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfoAgency('name',$form->agency_id); ?>" type="image/x-icon">
    <link rel="shortcut icon" href="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfoAgency('logo',$form->agency_id); ?>" type="image/x-icon">
    <title><?= $page_title; ?> | <?= $this->crud_model->getInfoAgency('description',$form->agency_id); ?> ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
    
    
        .color-theme-red {
          --theme-color: #f32323;
          --theme-color-rgb: 255, 59, 48;
          --theme-color-shade: #fb9f81 ;
          --theme-color-tint: #ff6259;
        }
        
        .color-theme-green {
          --theme-color: #4cd964;
          --theme-color-rgb: 76, 217, 100;
          --theme-color-shade: #2cd048;
          --theme-color-tint: #6ee081;
        }
        
        .color-theme-blue {
          --theme-color: #05f;
          --theme-color-rgb: 33, 150, 243;
          --theme-color-shade: #09f;
          --theme-color-tint: #1E74FD;
        }
        
        .color-theme-deepblue {
          --theme-color: #0f36c0;
          --theme-color-rgb: 33, 150, 243;
          --theme-color-shade: #103ace;
          --theme-color-tint: #1E74FD;
        }
        
        .color-theme-pink {
          --theme-color: #ff2d55;
          --theme-color-rgb: 255, 45, 85;
          --theme-color-shade: #ff0434;
          --theme-color-tint: #ff5676;
        }
        
        .color-theme-yellow {
          --theme-color: #fbaf03;
          --theme-color-rgb: 255, 204, 0;
          --theme-color-shade: #d6ab00;
          --theme-color-tint: #ffd429;
        }
        
        .color-theme-orange {
          --theme-color: #ff9500;
          --theme-color-rgb: 255, 149, 0;
          --theme-color-shade: #d67d00;
          --theme-color-tint: #ffa629;
        }
        
        .color-theme-purple {
          --theme-color: #9c27b0;
          --theme-color-rgb: 156, 39, 176;
          --theme-color-shade: #7e208f;
          --theme-color-tint: #b92fd1;
        }
        
        .color-theme-deeppurple {
          --theme-color: #673ab7;
          --theme-color-rgb: 103, 58, 183;
          --theme-color-shade: #563098;
          --theme-color-tint: #7c52c8;
        }
        
        .color-theme-lightblue {
          --theme-color: #346e93;
          --theme-color-rgb: 90, 200, 250;
          --theme-color-shade: #7ac1ed;
          --theme-color-tint: #82d5fb;
        }
        
        .color-theme-teal {
          --theme-color: #00bfad;
          --theme-color-rgb: 0, 150, 136;
          --theme-color-shade: #00bfad;
          --theme-color-tint: #00bfad;
        }
        
        .color-theme-lime {
          --theme-color: #cddc39;
          --theme-color-rgb: 205, 220, 57;
          --theme-color-shade: #bac923;
          --theme-color-tint: #d6e25c;
        }
        
        .color-theme-deeporange {
          --theme-color: #ff6b22;
          --theme-color-rgb: 255, 107, 34;
          --theme-color-shade: #f85200;
          --theme-color-tint: #ff864b;
        }
        
        .color-theme-gray {
          --theme-color: #8e8e93;
          --theme-color-rgb: 142, 142, 147;
          --theme-color-shade: #79797f;
          --theme-color-tint: #a3a3a7;
        }
        
        .color-theme-white {
          --theme-color: #ffffff;
          --theme-color-rgb: 255, 255, 255;
          --theme-color-shade: #ebebeb;
          --theme-color-tint: #ffffff;
        }
        
        .color-theme-black {
          --theme-color: #000000;
          --theme-color-rgb: 0, 0, 0;
          --theme-color-shade: #000000;
          --theme-color-tint: #141414;
        }
        
        .color-theme-brown {
          --theme-color: #f2ece5;
          --theme-color-rgb: #f6f2ec;
          --theme-color-shade: #a27761;
          --theme-color-tint: #e4d8ca;
        }
        
        .color-theme-darkgreen {
          --theme-color: #1c891f;
          --theme-color-rgb: 142, 142, 147;
          --theme-color-shade: #79797f;
          --theme-color-tint: #a3a3a7;
        }
        
        .color-theme-cayan {
          --theme-color: #7ac1ed;
          --theme-color-rgb: 255, 255, 255;
          --theme-color-shade: #6ae2da;
          --theme-color-tint: #6ae2da;
        }
        
        .color-theme-darkorchid {
          --theme-color: #9932cc;
          --theme-color-rgb: 0, 0, 0;
          --theme-color-shade: #000000;
          --theme-color-tint: #141414;
        }
        
        .color-theme-black {
          --theme-color: #000;
          --theme-color-rgb: 0, 0, 0;
          --theme-color-shade: #000;
          --theme-color-tint: #000;
        }
        
        .color-theme-cadetblue {
          --theme-color: #5f9ea0;
          --theme-color-rgb: 0, 0, 0;
          --theme-color-shade: #5f9ea0;
          --theme-color-tint: #5f9ea0;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
        }
        
        .glass-effect {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .animate-blob {
            animation: blob 7s infinite;
        }
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .input-focus-effect:focus-within {
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
            border-color: #3b82f6;
        }
        [x-cloak] { display: none !important; }
        
        
        
        .md\:col-span-6.p-8.md\:p-14.bg-slate-900\/40 {
            background-color: #1a1a16;
        }
        
        .flex.items-center.gap-4.bg-white\/10.p-4.rounded-2xl.border.border-white\/10.hover\:bg-white\/20.transition-all.cursor-default.group {
            background-color: #1a1a16;
        }
        
        .iti {
           
            width: 100%;
        }
        
        .bg-white.px-6.py-3.rounded-2xl.shadow-xl.mb-6.flex.items-center.gap-2.transform.hover\:scale-105.transition-transform.duration-300 {
    width: 181px;
}

    </style>
    <!-- CSS del plugin -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/25.3.1/css/intlTelInput.min.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/25.3.1/build/css/intlTelInput.min.css" integrity="sha512-X3pJz9m4oT4uHCYS6UjxVdWk1yxSJJIJOJMIkf7TjPpb1BzugjiFyHu7WsXQvMMMZTnGUA9Q/GyxxCWNDZpdHA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body class="antialiased overflow-x-hidden <?= $this->crud_model->getInfo('theme') != '' ? $this->crud_model->getInfo('theme'): 'color-theme-blue'; ?>">

    <div class="min-h-screen flex items-center justify-center p-4 relative" x-data="{ submitted: false, nombre: '' }">
        
        <!-- Elementos de fondo animados -->
        <div class="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute top-0 -right-4 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" style="animation-delay: 2s;"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" style="animation-delay: 4s;"></div>

        <!-- Contenedor Principal -->
        <div class="relative w-full max-w-5xl grid md:grid-cols-10 glass-effect rounded-[2.5rem] shadow-2xl overflow-hidden" 
             x-show="!submitted" 
             x-transition:enter="transition ease-out duration-700"
             x-transition:enter-start="opacity-0 transform translate-y-10"
             x-transition:enter-end="opacity-100 transform translate-y-0">
            
            <!-- Columna Izquierda: Branding -->
            <div class="hidden md:flex md:col-span-4 flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative" style="background: var(--theme-color);">
                <div class="z-10">
                    <h2 class="text-4xl font-bold mb-6 leading-tight">
                        Digitalizamos <br>  
                        <span class="" style="color:grey">la gestión de tu agencia</span> <br>
                        para que crezca sin límites.
                    </h2>
                    <p class="text-4xl text-lg mb-10">
                        Red Ziigo centraliza contratos digitales, prospectos, marketing,
                        tareas y gestión de visas en una sola plataforma web.
                    </p>
            
                    <div class="space-y-5">
                        
                        <div class="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-default group">
                            <div class=" text-white p-2 rounded-lg text-blue-900 group-hover:scale-110 transition-transform" style="background: var(--theme-color-shade);">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span class="font-medium">Automatización de procesos y contratos digitales</span>
                        </div>
            
                        <div class="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-default group">
                            <div class="text-white p-2 rounded-lg text-blue-900 group-hover:scale-110 transition-transform" style="background: var(--theme-color-shade);">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span class="font-medium">Control total de ventas, clientes y operaciones</span>
                        </div>
            
                    </div>
                </div>
            
                <!-- Decoración -->
                <div class="absolute -bottom-20 -left-20 w-64 h-64 border-[30px] border-white/5 rounded-full"></div>
            </div>

            <!-- Columna Derecha: Formulario -->
            <div class="md:col-span-6 p-8 md:p-14 bg-slate-900/40">
                <div class="flex flex-col items-center mb-10">
                    <div class="bg-white px-6 py-3 rounded-2xl shadow-xl mb-6 flex items-center gap-2 transform hover:scale-105 transition-transform duration-300">
                        <img src="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfoAgency('logo',$form->agency_id); ?>">
                    </div>
                    <p class="text-slate-400 text-center">¡Bienvenidos a <?= $this->crud_model->getInfoAgency('name',$form->agency_id); ?>. Juntos llegamos más lejos!</p>
                </div>
                            <?php
                                if($this->session->flashdata('success') != '' ):
                                    
                            ?>
                            <div class="mb-3 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800" role="alert">
                                <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879A1 1 0 006.293 10.293l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                <span><?= $this->session->flashdata('success'); ?></span>
                            </div>
                           <?php endif;?>
                 <form method="post" action="<?php echo  base_url('form/insertRequest'); ?>" id="formSale" class="app-form rounded-control">
                                    <input type="hidden" name="forms_id" value="<?= $form->forms_id; ?>" />
                       
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div class="relative group">
                            <input type="text" x-model="nombre" required placeholder="Nombre"  name="name" 
                                class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all mb-3">
                        </div>
                        <div class="relative group"> 
                            <input type="text" required placeholder="Apellido" name="last_name"
                                class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all  mb-3">
                        </div>
                    </div>

                    <div class="relative">
                        <input type="email" required placeholder="Correo electrónico" name="email"
                            class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all  mb-3">
                    </div>

                    <div class="relative mb-3">
                        <input type="tel" required placeholder="Número de teléfono" name="phone" id="phone"
                            class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all  mb-3">
                            <input id="full_phone" name="full_phone" value="" type="hidden" />
                    </div>
                    
                    <div class="relative">
                        <div class="form-group mb-3">
                            <textarea class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all  mb-3" id="email" name="address" rows="3" placeholder="Mensaje"></textarea>
                        </div>
                    </div>
                    
                <div class="w-full">
                    <div class="w-full">
                        <label class="w-full flex items-center p-4 rounded-2xl cursor-pointer border transition-all duration-300
                                      bg-slate-800/30 border-slate-700 text-slate-400 hover:bg-slate-800">
                
                            <input type="checkbox" name="terms" value="1" class="peer hidden">
                
                            <div class="w-5 h-5 border-2 rounded-md mr-3 flex items-center justify-center transition-all
                                        border-slate-600 peer-checked:bg-blue-500 peer-checked:border-blue-500">
                                
                                <svg class="w-3 h-3 text-white hidden peer-checked:block"
                                     fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                                </svg>
                            </div>
                
                            <span class="text-sm font-medium">
                                Acepto los 
                                <a href="https://oficina.thecorredor.com/terms_condition"
                                   target="_blank"
                                   class="underline"
                                   style="color:var(--secondary)">
                                   términos y condiciones
                                </a>
                            </span>
                        </label>
                    </div>
                </div>

                    <button type="submit" 
                        class="w-full  text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-900/40 transform hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 mt-8" style="background: var(--theme-color-shade);">
                        <span>Enviar mensaje</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                    
                    <p class="text-center text-slate-500 text-xs mt-6 tracking-wide">
                        Estamos a un paso de hablar <span class="text-blue-400">=)</span>
                    </p>
                </form>
            </div>
        </div>

        <!-- Pantalla de Éxito -->
        <div class="relative w-full max-w-xl glass-effect p-12 rounded-[2.5rem] text-center" 
             x-show="submitted" x-cloak
             x-transition:enter="transition ease-out duration-500"
             x-transition:enter-start="opacity-0 scale-90"
             x-transition:enter-end="opacity-100 scale-100">
            <div class="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 ring-4 ring-green-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 class="text-3xl font-bold text-white mb-4">¡Enviado con éxito!</h3>
            <p class="text-slate-400 text-lg mb-8">Gracias <span x-text="nombre" class="text-blue-400 font-semibold"></span>. Tu solicitud ha sido procesada y un asesor de <span class="text-white">Immobillis</span> te contactará en breve.</p>
            <button @click="submitted = false" class="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-2 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Volver al formulario
            </button>
        </div>
    </div>
    <!-- latest jquery-->
<script src="<?= base_url(); ?>public/assets/js/jquery-3.6.3.min.js"></script>

<!-- Bootstrap js-->
<script src="<?= base_url(); ?>public/assets/vendor/bootstrap/bootstrap.bundle.min.js"></script>

<!-- JS del plugin -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/25.3.1/build/js/intlTelInputWithUtils.min.js" integrity="sha512-d+hkex91aDobSWZFCNXPNnuCCHwEgizrGNraZmaP4pvmYeORZ6IG3zABu61A7n0VKuCBTpdxVTmpoNZQecpLUg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    const input = document.querySelector("#phone");
    const hiddenInput = document.querySelector("#full_phone");

    const iti = window.intlTelInput(input, {
      initialCountry: "us",
      preferredCountries: [ "us", "ec", "mx","co","gt"],
      nationalMode: false,
      autoPlaceholder: "polite",
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/25.3.1/js/utils.min.js"
    });

    // Actualiza el input oculto cada vez que cambia el número
    input.addEventListener('change', updateFullNumber);
    input.addEventListener('keyup', updateFullNumber);

    function updateFullNumber() {
      const number = iti.getNumber(); // número completo con código de país
      hiddenInput.value = number;
    }
  });
</script>
<script src="<?= base_url(); ?>public/assets/vendor/bootstrap/bootstrap.bundle.min.js"></script>
</body>
</html>