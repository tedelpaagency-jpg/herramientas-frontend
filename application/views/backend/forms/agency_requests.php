<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZIIGO Business - Registro Pro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --ziigo-orange: #ff5722;
            --fb-blue: #1877f2;
            --bg-gradient: linear-gradient(135deg, #f0f2f5 0%, #e5e7eb 100%);
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-gradient);
            min-height: 100vh;
        }

        .premium-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border-radius: 1.5rem;
        }

        .fb-input {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1.5px solid #e5e7eb;
        }

        .fb-input:focus {
            border-color: var(--fb-blue);
            box-shadow: 0 0 0 4px rgba(24, 119, 242, 0.15);
            transform: translateY(-1px);
            background: white;
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #4b5563;
            font-weight: 700;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 2rem 0 1rem 0;
        }

        .section-header::after {
            content: "";
            flex: 1;
            height: 1px;
            background: linear-gradient(to right, #e5e7eb, transparent);
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 26px;
        }

        .switch input { opacity: 0; width: 0; height: 0; }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 18px; width: 18px;
            left: 4px; bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider { background-color: var(--fb-blue); }
        input:checked + .slider:before { transform: translateX(24px); }

        .file-drop-area {
            border: 2px dashed #cbd5e1;
            transition: all 0.3s ease;
        }

        .file-drop-area:hover {
            border-color: var(--fb-blue);
            background: rgba(24, 119, 242, 0.02);
        }

        .hidden-section {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s cubic-bezier(0, 1, 0, 1);
        }

        .hidden-section.visible {
            max-height: 1000px;
            transition: max-height 1s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade { animation: fadeIn 0.5s ease forwards; }
    </style>
</head>
<body class="py-12 px-4">

    <!-- Header Animado -->
    <div class="max-w-4xl mx-auto text-center mb-12 animate-fade">
         <a href="/" class="mb-2" style="display: block; align-content: center; justify-items: center;">
            <img src='<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfoAgency('logo',1);?>' class="w-100" style="width: 50%;">
        </a>
        <p class="text-slate-500 font-medium text-lg italic">"Elevando los estándares del turismo mundial"</p>
    </div>

    <div class="max-w-4xl mx-auto premium-card p-8 md:p-12 animate-fade" style="animation-delay: 0.1s">
        <form id="masterForm" class="space-y-6" action="<?= base_url(); ?>form/saveRequest" method="POST" enctype="multipart/form-data">
            
            <div class="section-header">Identidad Corporativa</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="name" placeholder="Nombre Comercial*" required class="fb-input p-4 rounded-xl text-sm bg-slate-50">
                <input type="text" name="razon" placeholder="Razón Social (Facturación)" class="fb-input p-4 rounded-xl text-sm bg-slate-50">
                <input type="text" name="ruc" placeholder="Número de Identificación Fiscal (RUC/NIT/DNI)*" required class="fb-input p-4 rounded-xl text-sm bg-slate-50 md:col-span-2">
            </div>

            <div class="section-header">Localización Global</div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" name="address" placeholder="Dirección Exacta*" required class="fb-input p-4 rounded-xl text-sm bg-slate-50 md:col-span-3">
                <input type="text" name="city" placeholder="Ciudad*" required class="fb-input p-4 rounded-xl text-sm bg-slate-50">
                <input type="text" name="province" placeholder="Provincia/Estado" class="fb-input p-4 rounded-xl text-sm bg-slate-50">
                <input type="text" name="postal_code" placeholder="Código Postal*" required class="fb-input p-4 rounded-xl text-sm bg-slate-50">
                
                <div class="md:col-span-3">
                    <select id="countrySelect" name="countrySelect" required class="fb-input w-full p-4 rounded-xl text-sm bg-slate-50 text-slate-700">
                        <option value="">Seleccionar</option>
                        <?php $paises = $this->db->get('pais')->result_array(); ?>
                        <?php foreach($paises as $pais): ?>
                            <option value="<?= $pais['id']; ?>" ><?= $pais['nombre']; ?></option>
                        <?php endforeach;?>
                    </select>
                </div>
            </div>

            <div class="section-header">Tipo de Entidad</div>
            <div class="p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-bold text-blue-900">¿Es usted una Agencia de Viajes?</h4>
                        <p class="text-sm text-blue-700">Active esta opción para acceder a beneficios mayoristas.</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="agenciaToggle" value="1" name="is_agency">
                        <span class="slider"></span>
                    </label>
                </div>

                <div id="agenciaSection" class="hidden-section">
                    <div class="pt-6 grid grid-cols-2 gap-4">
                        <input type="text" name="legal_name" placeholder="Nombre legal de la empresa" class="fb-input p-4 rounded-xl text-sm bg-white">
                        <input type="text" name="legal_id" placeholder="Numero de id de empresa" class="fb-input p-4 rounded-xl text-sm bg-white">
                        <div id="logoAgencia" class="space-y-2 opacity-30 transition-opacity duration-300">
                            <label class="text-xs font-bold text-slate-500 uppercase ml-1">Logo Empresa</label>
                            <div id="dropZone3" class="file-drop-area rounded-2xl p-8 flex flex-col items-center justify-center cursor-not-allowed text-center bg-slate-50">
                                
                                <svg class="w-10 h-10 text-slate-400 mb-2 file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                <span id="logoAgenciaText" class="text-xs font-medium text-slate-400 file-text">Logo de la gencia</span>
                                <input type="file" name="logo_file" id="inputLogoAgencia" class="hidden" accept="image/*,application/pdf" disabled>
                            </div>
                        </div>
                        
                        <div id="docAgencia" class="space-y-2 opacity-30 transition-opacity duration-300">
                            <label class="text-xs font-bold text-slate-500 uppercase ml-1">RUC Empresa</label>
                            <div id="dropZone2" class="file-drop-area rounded-2xl p-8 flex flex-col items-center justify-center cursor-not-allowed text-center bg-slate-50">
                                
                                <svg class="w-10 h-10 text-slate-400 mb-2 file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                <span id="docAgenciaText" class="text-xs font-medium text-slate-400 file-text">Solo para agencias</span>
                                <input type="file" name="agency_ruc_file" id="inputAgencia" class="hidden" accept="image/*,application/pdf" disabled>
                            </div>
                        </div>
                
                    </div>
                </div>
            </div>

            <div class="section-header">Persona de Contacto</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text"  name="contact_name"      placeholder="Nombre*" required class="fb-input p-4 rounded-xl text-sm bg-slate-50">
                <input type="text"  name="contact_last_name" placeholder="Apellido*" required class="fb-input p-4 rounded-xl text-sm bg-slate-50">
                <input type="email" name="contact_email"    placeholder="Correo corporativo*" required class="fb-input p-4 rounded-xl text-sm bg-slate-50">
                <input type="tel"   name="contact_phone"      placeholder="Teléfono de contacto*" required class="fb-input p-4 rounded-xl text-sm bg-slate-50">
                <input type="tel"   name="contact_whatsapp"   placeholder="WhatsApp (Opcional)" class="fb-input p-4 rounded-xl text-sm bg-slate-50">
                <div></div>
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase ml-1">Foto de perfil</label>
                    <div class="file-drop-area rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer text-center bg-slate-50">
                      
                    
                        <svg class="w-10 h-10 text-slate-400 mb-2 file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span class="default-text text-xs font-medium text-slate-600 file-text">
                            Click para subir archivo
                        </span>
                    
                        <input type="file" name="photo_file" class="hidden" required="">
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase ml-1">Foto de la cedula personal*</label>
                    <div class="file-drop-area rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer text-center bg-slate-50">
                      
                    
                        <svg class="w-10 h-10 text-slate-400 mb-2 file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span class="default-text text-xs font-medium text-slate-600 file-text">
                            Click para subir archivo
                        </span>
                    
                        <input type="file" name="contact_ruc_file" class="hidden">
                    </div>
                </div>
            </div>
            <div class="pt-4">
                <textarea name="details" placeholder="Observaciones adicionales..." rows="3" class="fb-input w-full p-4 rounded-xl text-sm bg-slate-50"></textarea>
            </div>

            <div class="pt-8">
                <button type="submit" class="w-full bg-[#1877f2] hover:bg-blue-600 text-white font-bold text-xl py-5 rounded-2xl shadow-xl transition-all active:scale-95">
                    Finalizar Registro Profesional
                </button>
            </div>
        </form>
    </div>

    <script>
        // Lógica de Sonido de Máquina de Escribir (Web Audio API)
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        function playTypewriterSound() {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(150 + Math.random() * 50, audioCtx.currentTime);
            
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        }

        // Listener para todos los inputs y textareas
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                playTypewriterSound();
            }
        });


        // Lógica condicional
        const toggle = document.getElementById('agenciaToggle');
        const section = document.getElementById('agenciaSection');
        const docAgencia = document.getElementById('docAgencia');
        const dropZone2 = document.getElementById('dropZone2');
        const inputAgencia = document.getElementById('inputAgencia');
        const docAgenciaText = document.getElementById('docAgenciaText');
        
        const logoAgencia = document.getElementById('logoAgencia');
        const dropZone3 = document.getElementById('dropZone3');
        const inputLogoAgencia = document.getElementById('inputLogoAgencia');
        const logoAgenciaText = document.getElementById('logoAgenciaText');

        toggle.addEventListener('change', function() {
            if(this.checked) {
                section.classList.add('visible');
                docAgencia.classList.remove('opacity-30');
                dropZone2.classList.remove('cursor-not-allowed');
                dropZone2.classList.add('cursor-pointer');
                inputAgencia.disabled = false;
                docAgenciaText.innerText = "Subir RUC/Documento";
                
                logoAgencia.classList.remove('opacity-30');
                dropZone3.classList.remove('cursor-not-allowed');
                dropZone3.classList.add('cursor-pointer');
                inputLogoAgencia.disabled = false;
                logoAgenciaText.innerText = "Subir Logo de la Agencia";
                
                
            } else {
                
                logoAgencia.classList.add('opacity-30');
                dropZone3.classList.add('cursor-not-allowed');
                inputLogoAgencia.disabled = true;
                logoAgenciaText.innerText = "Solo para agencias";
                
                docAgencia.classList.add('opacity-30');
                dropZone2.classList.add('cursor-not-allowed');
                inputAgencia.disabled = true;
                docAgenciaText.innerText = "Solo para agencias";
            }
        });

  

        document.querySelectorAll('.file-drop-area').forEach(zone => {
            zone.addEventListener('click', () => {
                const input = zone.querySelector('input');
                if(!input.disabled) input.click();
            });
        });
    </script>
<script>
    function getFileIcon(file) {
        if (file.type === 'application/pdf') {
            return `
                <svg class="file-icon w-10 h-10 text-red-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/>
                </svg>`;
        }

        if (file.type.startsWith('image/')) {
            return `
                <svg class="file-icon w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/>
                </svg>`;
        }

        return `
            <svg class="file-icon w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-width="2" d="M9 12h6"/>
            </svg>`;
    }

    document.querySelectorAll('.file-drop-area input[type="file"]').forEach(input => {
        input.addEventListener('change', function () {
            if (!this.files.length) return;

            const file = this.files[0];
            const zone = this.closest('.file-drop-area');

            // reemplaza SOLO el svg
            zone.querySelector('.file-icon').outerHTML = getFileIcon(file);

            // reemplaza SOLO el texto
            zone.querySelector('.file-text').textContent = file.name;
        });
    });
</script>


<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<script>
    $('#masterForm').on('submit', function (e) {
        e.preventDefault();
        
        const $form = $(this);
        const $btn  = $form.find('button[type="submit"]');

        const originalText  = $btn.text();
        const originalClass = $btn.attr('class');

        // estado enviando
        $btn
            .prop('disabled', true)
            .text('Enviando solicitud...')
            .css('background-color', '#ff6000');

        const formData = new FormData(this);
        
        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: formData,
            processData: false, // obligatorio para archivos
            contentType: false, // obligatorio para archivos
            success: function (response) {
                alert('SISTEMA ZIIGO: El registro ha sido enviado exitosamente.');
                console.log(response);
                $('#masterForm')[0].reset();

                //reset visual de dropzones
                $('.file-drop-area').each(function () {

                    $(this).find('.file-icon').replaceWith(`
                        <svg class="file-icon w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/>
                        </svg>
                    `);
                
                    $(this).find('.file-text').replaceWith(`
                        <span class="file-text text-xs font-medium text-slate-600">
                            Click para subir archivo
                        </span>
                    `);
                
                });

                 //reset estado agencia
                $('#agenciaToggle').prop('checked', false);
                $('#agenciaSection').removeClass('visible');
                $('#docAgencia').addClass('opacity-30');
                $('#inputAgencia').prop('disabled', true);
                $('#docAgenciaText').text('Solo para agencias');
            },
            error: function () {
                alert('Error al enviar el formulario');
            },
            
            complete: function () {
                // se ejecuta SIEMPRE (success o error)
                $btn
                    .prop('disabled', false)
                    .text(originalText)
                    .attr('class', originalClass)
                    .css('background-color', '');
            }
        });
    });
</script>


</body>
</html>