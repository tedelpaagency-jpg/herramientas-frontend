<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de sesión | trivali</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Lucide Icons -->
    <link rel="icon" href="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfoAgency('favicon',1);?>" type="image/x-icon">
    <link rel="shortcut icon" href="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfoAgency('favicon',1);?>" type="image/x-icon">
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="<?= base_url(); ?>public/assets/js/plugin.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        :root {
            --trivali-blue: #2563eb;
            --trivali-success: #10b981;
            --trivali-error: #ef4444;
        }

       body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    overflow: hidden;
    background-color: #0f172a;
}
        
        .glass-container {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* --- ANIMACIONES DEL AVIÓN --- */
        #plane-display {
            transition: color 0.4s ease, filter 0.4s ease, transform 0.4s ease;
            transform-origin: center;
        }

        .plane-default { color: var(--trivali-blue); fill: rgba(37, 99, 235, 0.1); }
        .plane-success { color: var(--trivali-success) !important; fill: rgba(16, 185, 129, 0.2) !important; filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.6)); }
        .plane-error { color: var(--trivali-error) !important; fill: rgba(239, 68, 68, 0.2) !important; filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.6)); }

        .floating { animation: float 3s ease-in-out infinite; }
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(2deg); }
        }

        .engine-on {
            animation: engine-vibrate 0.1s linear infinite;
            transform: translateY(-15px) rotate(-5deg) !important;
        }
        @keyframes engine-vibrate {
            0% { transform: translateY(-15px) rotate(-5deg) translateX(0); }
            50% { transform: translateY(-15px) rotate(-5deg) translateX(1px); }
            100% { transform: translateY(-15px) rotate(-5deg) translateX(-1px); }
        }

        /* Nueva animación de palpitación verde */
        .success-pulse {
            animation: success-pulse-anim 0.6s ease-in-out infinite;
        }
        @keyframes success-pulse-anim {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.4)); }
            50% { transform: scale(1.2); filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.8)); }
        }

        /* Animación de error (palpitación roja + sacudida leve) */
        .error-pulse {
            animation: error-pulse-anim 0.6s ease-in-out infinite;
        }
        
        @keyframes error-pulse-anim {
            0%, 100% {
                transform: scale(1);
                filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.4));
            }
            50% {
                transform: scale(1.15);
                filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.9));
            }
        }

        .reveal { animation: reveal 1s ease-out forwards; }
        @keyframes reveal {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
      body.antialiased.text-slate-900 {
    background-image: url(https://portal.trivali.us/public/assets/images/fondopantalla.png);
    background-color: #171717;
}

img.icon.login {
    width: 29%;
}

.w-full.md\:w-1\/2.flex.flex-col.items-center.justify-center.p-8.sm\:p-12 {
    background-color: white;
}
    
    .hidden.md\:flex.md\:w-1\/2.bg-blue-600\/5.p-12.flex-col.justify-between.border-r.border-white\/10 {
    background-color: #effdff;
}

button#login-btn {
    background-color: #1d1d1d;
}


span.text-xl.font-black.text-blue-900.tracking-tighter.uppercase {
    color: #1d1d1d;
}

.text-blue-950 {
    --tw-text-opacity: 1;
    color: rgb(29 29 29);
}
        
    </style>
</head>
<body class="antialiased text-slate-900">

    <div id="main-wrapper" class="min-h-screen w-full relative flex items-center justify-center p-4">
        
        <div class="relative z-10 w-full max-w-[1000px] min-h-[600px] glass-container rounded-[3rem] shadow-2xl border border-white/40 flex flex-col md:flex-row overflow-hidden reveal">
            
            <!-- SECCIÓN IZQUIERDA -->
            <div class="hidden md:flex md:w-1/2 bg-blue-600/5 p-12 flex-col justify-between border-r border-white/10">
                <div>
                    <div class="flex items-center gap-3 mb-12">
                        
                        <span class="text-xl font-black text-blue-900 tracking-tighter uppercase">ZIIGO PRO</span>
                    </div>
                    <h2 class="text-5xl font-black text-blue-950 leading-[1.1]">Juntos llegamos más lejos.</h2>
                    <p class="mt-6 text-blue-900/60 font-medium text-lg leading-relaxed">Tu pasaporte al portal de gestión integral.</p>
                </div>
                <div class="p-6 bg-white/40 rounded-[2rem] border border-white/60 backdrop-blur-md">
                    <div class="flex items-center gap-3">
                        <div class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span class="text-xs font-bold text-blue-900 uppercase tracking-widest">Servidor ZIIGO en línea</span>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN DERECHA: FORMULARIO -->
            <div class="w-full md:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12">
                
                <div class="w-full max-w-[340px]">
                    <!-- AVIÓN DINÁMICO -->
                    <div id="plane-box" class="flex flex-col items-center mb-10 floating transition-all duration-500">
                         <img class="icon login"src="https://red.ziigo.pro/public/assets/images/ziigopro.png" class="w-10 h-10" alt="Logo">
                           
                        </div>
                    </div>

                    <div class="text-center mb-8">
                        <h3 class="text-3xl font-black text-slate-900 tracking-tight">Iniciar Sesión</h3>
                        <p id="status-msg" class="text-slate-500 text-sm mt-2 font-medium">Panel de control de acceso</p>
                    </div>

                    <!-- LÓGICA DE ERROR PHP ROBUSTA -->
                    <?php 
                        $show_error = false;
                        if (isset($_SESSION['error']) && $_SESSION['error'] == 1) {
                            $show_error = true;
                        } elseif (isset($this->session) && method_exists($this->session, 'userdata') && $this->session->userdata('error') == 1) {
                            $show_error = true;
                        }
                    ?>

                   
                    <div id="php-error-flag" style="display:none" data-error="true" class="d-none mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-bold flex items-center gap-2">
                        <i data-lucide="alert-circle" class="w-4 h-4"></i>
                        Credenciales incorrectas. Verifique los datos.
                    </div>
                    
                    <div id="php-success-flag" style="display:none"
                         data-error="false"
                         class=" d-none mb-4 p-3 bg-green-50 border border-green-100 text-green-600 text-xs rounded-xl font-bold flex items-center gap-2">
                        <i data-lucide="check-circle" class="w-4 h-4"></i>
                        Credenciales válidas. Bienvenido.
                    </div>

                   

                    <form class="space-y-4" method="POST" action="<?= base_url(); ?>login/auth" id="loginForm">
                        <div class="relative">
                            <input 
                                name="username"
                                type="text" 
                                required 
                                onfocus="handleInputFocus()" 
                                onblur="handleInputBlur()"
                                onkeydown="playTypewriterSound()"
                                placeholder="Nombre de usuario" 
                                class="w-full px-6 py-4 bg-white/70 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none font-bold transition-all placeholder:text-slate-400"
                            >
                        </div>
                        <div class="relative">
                            <input 
                                id="password"
                                name="password"
                                type="password" 
                                required 
                                onfocus="handleInputFocus()" 
                                onblur="handleInputBlur()"
                                onkeydown="playTypewriterSound()"
                                placeholder="Contraseña" 
                                class="w-full px-6 py-4 pr-14 bg-white/70 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none font-bold transition-all placeholder:text-slate-400"
                            >
                        
                            <button type="button"
                                    id="togglePassword"
                                    class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                                <i id="eyeIcon" data-lucide="eye" class="w-5 h-5"></i>
                            </button>
                        </div>
                        
                        <div class="flex items-center gap-2 px-2">
                            <input type="checkbox" id="checkDefault" name="remember" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                            <label for="checkDefault" class="text-xs font-bold text-slate-500 cursor-pointer">Recuérdame</label>
                        </div>

                        <button type="submit" id="login-btn" class="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-xl text-lg active:scale-95 mt-2">
                            Ingresar a portal
                        </button>
                    </form>
                    
                    <div class="mt-6 text-center">
                        <a href="<?= base_url(); ?>login/reset_password" class="text-xs font-bold text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');
        const eyeIcon = document.getElementById('eyeIcon');
        
        toggleBtn.addEventListener('click', function () {
            const isPassword = passwordInput.type === 'password';
        
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeIcon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
        
            if (window.lucide) {
                lucide.createIcons();
            }
        });


        lucide.createIcons();

        const planeBox = document.getElementById('plane-box');
        const planeIcon = document.getElementById('plane-display');
        const loginBtn = document.getElementById('login-btn');
        const loginForm = document.getElementById('loginForm');
        const phpError = document.getElementById('php-error-flag');
        const phpSuccess = document.getElementById('php-success-flag');
        
        let audioCtx;
        function initAudio() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();
        }

        function playTypewriterSound() {
            initAudio();
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(); osc.stop(now + 0.05);
        }

        function playErrorSound() {
            initAudio();
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(70, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(); osc.stop(now + 0.3);
        }

        function playSuccessSound() {
            initAudio();
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.5);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(); osc.stop(now + 0.6);
        }

        function handleInputFocus() {
            planeBox.classList.remove('floating');
            planeBox.classList.add('engine-on');
        }

        function handleInputBlur() {
            planeBox.classList.remove('engine-on');
            planeBox.classList.add('floating');
        }

       

        // Login con estados success / error y redirección (jQuery)
        $('#loginForm').on('submit', function (e) {
            e.preventDefault();
            
            console.log('accediendo');
            const $form      = $(this);
            const $loginBtn  = $('#login-btn');
            const $planeIcon = $('#plane-display');
            const $planeBox  = $('#plane-box');
            
    
            const redirectTo =  'portal/feed';
        
            // Estado loading
            $loginBtn.prop('disabled', true).html(
                '<div class="flex items-center justify-center gap-2">' +
                    '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>' +
                    '<span>Autorizando vuelo...</span>' +
                '</div>'
            );
        
            // Reset clases
            $planeIcon.removeClass('plane-success plane-error').addClass('plane-default');
            $planeBox.removeClass('success-pulse error-pulse engine-on floating');
        
            // Envío AJAX
            $.ajax({
                url: $form.attr('action'),
                type: 'POST',
                data: $form.serialize(),
                dataType: 'json',
                success: function (res) {
                    
                    console.log(res);
                    if (res.status === 'success') {
                        // SUCCESS
                        
                        $planeIcon.removeClass('plane-default').addClass('plane-success');
                        $planeBox.addClass('success-pulse');
                        
                        try { playSuccessSound(); } catch (e) {}
                        
                        // Mostrar
                        phpSuccess.style.display = 'flex';
                        
                        setTimeout(function () {
                           window.location.href = res.redirect;
                        }, 1500);
        
                    } else {
                        // ERROR
                        $planeIcon.removeClass('plane-default').addClass('plane-error');
                        $planeBox.addClass('error-pulse');
                        // Mostrar
                        phpError.style.display = 'flex';
                        
                        
                        try { playErrorSound(); } catch(e) {}
                        setTimeout(() => {
                            
                            $planeBox.removeClass('error-pulse');
                            $planeIcon.addClass('plane-default').removeClass('plane-error');
                            phpError.style.display = 'none';
                        }, 3500);
        
                        try { playErrorSound(); } catch (e) {}
        
                        $loginBtn.prop('disabled', false).text('Intentar nuevamente');
                    }
                },
                error: function () {
                    // ERROR AJAX
                    $planeIcon.removeClass('plane-default').addClass('plane-error');
                    $planeBox.addClass('error-pulse');
        
                    $loginBtn.prop('disabled', false).text('Error de conexión');
                }
            });
        });


    </script>
</body>
</html>