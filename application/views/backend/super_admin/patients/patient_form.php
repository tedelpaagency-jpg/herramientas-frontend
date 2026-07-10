
<!-- CONTENEDOR PRINCIPAL DEL MODAL -->
<div class="w-100 mx-auto bg-white border rounded-4 shadow d-flex flex-column overflow-hidden" style="max-width:900px;max-height:92vh;">

    <!-- ENCABEZADO -->
    <div class="d-flex align-items-center justify-content-between px-4 py-3 border-bottom bg-white">

        <div class="d-flex align-items-center">

            <!-- Botón Regresar -->
            <button data-bs-dismiss="modal"
                    class="btn btn-light border rounded-5 d-flex align-items-center justify-content-center me-3"
                    style="width:40px;height:40px;"
                    title="Regresar al listado">

                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          d="M10 19l-7-7m0 0l7-7m-7 7h18">
                    </path>
                </svg>

            </button>

            <div>

                <div class="d-flex align-items-center">

                    <h3 class="h5 fw-bold mb-0 me-2">
                        Agregar paciente
                    </h3>

                    <span class="position-relative d-inline-flex rounded-circle bg-success"
                          style="width:8px;height:8px;"
                          title="Sistema en línea">

                        <span class="position-absolute top-0 start-0 w-100 h-100 rounded-circle bg-success opacity-75 pulse-effect"></span>

                    </span>

                </div>

                <p class="small text-muted mb-0 mt-2">
                    Nueva ficha médica para el expediente del centro de salud
                </p>

            </div>

        </div>

    </div>

    <!-- FORMULARIO -->
<?php 
    if(isset($param2))
    $user = $this->db->get_where('user',array('user_id'=>$param2))->row();
?>
        <form  class="overflow-auto p-4 flex-grow-1" id="patientForm" method="post" action="<?php echo base_url('portal/users/save/'); ?>" enctype="multipart/form-data">
        <input type="hidden" name="rol_id" value="<?= $param3; ?>" />
        <!-- INFORMACIÓN DEL PACIENTE -->

        <div class="mb-5">

            <div class="d-flex align-items-center border-bottom pb-2 mb-4">

                <div class="bg-primary rounded-pill me-2"
                     style="width:4px;height:16px;"></div>

                <h4 class="text-uppercase text-muted fw-bold small mb-0">
                    Información del Paciente
                </h4>

            </div>

            <!-- Avatar -->

            <div class="d-flex flex-column align-items-center py-2">

                <span class="text-uppercase fw-bold small text-muted mb-3">
                    Avatar del Paciente
                </span>

                <div class="position-relative">

                    <div class="rounded-circle border shadow-sm d-flex align-items-center justify-content-center overflow-hidden bg-white"
                         style="width:112px;height:112px;">

                        <div id="avatarFallback"
                             class="w-100 h-100 d-flex align-items-center justify-content-center fw-bold fs-1 bg-light text-muted">

                            ?

                        </div>

                        <img id="avatarDisplay"
                             src=""
                             class="d-none w-100 h-100"
                             style="object-fit:cover;"
                             alt="Avatar subido">

                    </div>

                    <label for="avatarFile"
                           class="position-absolute  translate-middle btn btn-danger rounded-circle shadow" style="right: -25px;top: 15px !important;">

                        <svg width="16"
                             height="16"
                             fill="currentColor"
                             viewBox="0 0 20 20">

                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>

                        </svg>

                        <input type="file"
                               id="avatarFile"
                               class="d-none"
                               accept="image/*"
                               onchange="previewAvatar(event)">

                    </label>

                </div>

                <div class="text-center mt-3">

                    <p class="small text-muted mb-1" style="font-size: 11px;">
                        Las iniciales se generan al escribir. Sube una foto para reemplazar.
                    </p>

                    <button type="button"
                            id="removePhotoBtn"
                            onclick="removeUploadedPhoto()"
                            class="btn btn-link btn-sm text-danger d-none p-0">

                        Quitar fotografía

                    </button>

                </div>

            </div>
                        <!-- Formulario: Nombres y Apellidos -->
            <div class="row g-4 mb-4">

                <div class="col-12 col-md-6">
                        <label for="nombres" class="form-label fw-bold">
                            Nombres <span class="text-danger">*</span>
                        </label>

                        <input
                            type="text"
                            id="nombres"
                            name="name" value="<?php echo isset($user) ? $user->name : ''; ?>"
                            required
                            oninput="updateDynamicAvatar()"
                            placeholder="Ej: Francisco Daniel"
                            class="form-control"
                        >
                </div>

                <div class="col-12 col-md-6">

                        <label for="apellidos" class="form-label fw-bold">
                            Apellidos <span class="text-danger">*</span>
                        </label>

                        <input
                            type="text"
                            id="apellidos"
                            name="last_name" value="<?php echo isset($user) ? $user->last_name : ''; ?>"
                            required
                            oninput="updateDynamicAvatar()"
                            placeholder="Ej: Guanochanga Silva"
                            class="form-control"
                        >

                </div>

            </div>

            <!-- Formulario: Fecha de nacimiento y RUC -->
            <div class="row g-4">

                <div class="col-12 col-md-6">
                        <label for="fechaNacimiento" class="form-label fw-bold">
                            Fecha de nacimiento
                            <span class="text-danger">*</span>
                        </label>

                        <input
                            type="date"
                            id="fechaNacimiento"
                            name="birthday" value="<?php echo isset($user) ? $user->birthday : ''; ?>"
                            required
                            class="form-control"
                        >
                </div>

                <div class="col-12 col-md-6">
                        <label for="ruc" class="form-label fw-bold">
                            RUC / Cédula
                            <span class="text-danger">*</span>
                        </label>

                        <input
                            type="text"
                            id="ruc"
                            name="ruc" value="<?php echo isset($user) ? $user->ruc : ''; ?>"
                            required
                            maxlength="13"
                            placeholder="Ej: 1712345678001"
                            class="form-control"
                        >
                </div>

            </div>

        </div>

        <!-- SECCIÓN 2: DATOS DE CONTACTO -->

        <div class="mb-5">

            <div class="d-flex align-items-center border-bottom pb-2 mb-4">

                <div class="bg-primary rounded-pill me-2"
                     style="width:4px;height:16px;"></div>

                <h4 class="text-uppercase text-muted fw-bold small mb-0">
                    Contactos
                </h4>

            </div>

            <div class="row g-4">

                <div class="col-12 col-md-6">

                        <label for="telefono" class="form-label fw-bold">
                            Número de teléfono
                            <span class="text-danger">*</span>
                        </label>

                        <div class="input-group">

                            <span class="input-group-text">
                                +593
                            </span>

                            <input
                                type="tel"
                                id="telefono"
                                name="phone" value="<?php echo isset($user) ? $user->phone : ''; ?>"
                                required
                                placeholder="998372522"
                                class="form-control"
                            >

                        </div>

                </div>

                <div class="col-12 col-md-6">

                        <label for="correo" class="form-label fw-bold">
                            Correo Electrónico
                            <span class="text-danger">*</span>
                        </label>

                        <input
                            type="email"
                            id="correo"
                            name="email" value="<?php echo isset($user) ? $user->email : ''; ?>"
                            required
                            placeholder="ejemplo@clinica.com"
                            class="form-control"
                        >


                </div>

            </div>

        </div>
        
                <!-- SECCIÓN 3: DIRECCIÓN Y REGIONAL -->

        <div class="mb-3">

            <div class="d-flex align-items-center border-bottom pb-2 mb-4">

                <div class="bg-primary rounded-pill me-2"
                     style="width:4px;height:16px;"></div>

                <h4 class="text-uppercase text-muted fw-bold small mb-0">
                    Dirección de Origen
                </h4>

            </div>

            <div class="mb-3">

                <label for="pais" class="form-label fw-bold">
                    País
                    <span class="text-danger">*</span>
                </label>

                <select
                    id="pais"
                    name="pais"
                    required
                    class="form-select">

                    <option value="" disabled selected>
                        Selecciona un país
                    </option>

                    <?php $paises = $this->db->get_where('pais')->result_array();?>
                    <?php foreach($paises as $pais):?>
                    <option value="<?= $pais['id']; ?>" ><?= $pais['nombre']; ?></option>
                    <?php endforeach?>

                </select>

            </div>
            <div class="mb-3">

                <label for="correo" class="form-label fw-bold">
                    Dirección completa
                    <span class="text-danger">*</span>
                </label>

                <input
                    type="text"
                    id="address"
                    name="address" value="<?php echo isset($user) ? $user->address : ''; ?>"
                    required
                    placeholder="ejemplo@clinica.com"
                    class="form-control"
                >

            </div>

        </div>

    </form>

    <!-- PIE DEL MODAL -->

    <div class="d-flex justify-content-end align-items-center gap-2 px-4 py-3 border-top bg-light">

        <!-- Botón Cancelar -->

        <button
            type="button"
            onclick="toggleModal(false)"
            class="btn btn-soft">

            Cerrar

        </button>

        <!-- Botón Guardar -->

        <button
            type="submit"
            form="patientForm"
            id="submitBtn"
            class="btn btn-gradient">

            <!-- Contenido Normal -->

            <span
                id="submitBtnText"
                class="d-flex align-items-center">

                <span class="me-2">
                    Agregar usuario
                </span>

                <svg width="14"
                     height="14"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24">

                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M9 12l2 2 4-4">
                    </path>

                </svg>

            </span>

            <!-- Contenido Cargando -->

            <span
                id="submitBtnLoading"
                class="d-none align-items-center">

                <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true">
                </span>

                <span>
                    Creando expediente...
                </span>

            </span>

        </button>

    </div>

</div>

    <!-- Lógica Interactiva en Javascript -->
    <script>
        let hasUploadedImage = false;

        // Lista de paletas de gradientes para las iniciales del avatar
        // Inspiradas directamente en los estados de citas (Azul lila, Violeta, Esmeralda, Ámbar)
        const AVATAR_GRADIENTS = [
            {
                bg: "bg-gradient-to-tr from-indigo-500 to-purple-600",
                text: "text-white",
                ring: "ring-4 ring-indigo-50"
            },
            {
                bg: "bg-gradient-to-tr from-purple-500 to-pink-600",
                text: "text-white",
                ring: "ring-4 ring-purple-50"
            },
            {
                bg: "bg-gradient-to-tr from-emerald-500 to-teal-600",
                text: "text-white",
                ring: "ring-4 ring-emerald-50"
            },
            {
                bg: "bg-gradient-to-tr from-amber-500 to-orange-600",
                text: "text-white",
                ring: "ring-4 ring-amber-50"
            }
        ];

        // Función para obtener iniciales del nombre completo
        function getInitials(nombres, apellidos) {
            let initials = "";
            if (nombres && nombres.trim().length > 0) {
                initials += nombres.trim().charAt(0).toUpperCase();
            }
            if (apellidos && apellidos.trim().length > 0) {
                initials += apellidos.trim().charAt(0).toUpperCase();
            }
            return initials;
        }

        // Calcula un índice fijo según la primera inicial para asegurar consistencia del gradiente
        function getGradientIndex(char) {
            if (!char) return 0;
            const charCode = char.charCodeAt(0);
            return charCode % AVATAR_GRADIENTS.length;
        }

        // Actualiza el contenedor del avatar basado en el nombre de forma inteligente
        // Actualiza el avatar dinámicamente
        function updateDynamicAvatar() {
        
            const nombres = document.getElementById('nombres').value;
            const apellidos = document.getElementById('apellidos').value;
        
            const avatarFallback = document.getElementById('avatarFallback');
            const avatarDisplay = document.getElementById('avatarDisplay');
        
            const initials = getInitials(nombres, apellidos);
        
            if (hasUploadedImage) return;
        
            avatarDisplay.classList.add('d-none');
            avatarFallback.classList.remove('d-none');
        
            if (initials) {
        
                avatarFallback.innerText = initials;
        
                const gradIndex = getGradientIndex(initials.charAt(0));
                const style = AVATAR_GRADIENTS[gradIndex];
        
                avatarFallback.className =
                    "w-100 h-100 d-flex align-items-center justify-content-center rounded-circle fw-bold fs-3";
        
                avatarFallback.style.background = style.background;
                avatarFallback.style.color = style.color;
                avatarFallback.style.border = "3px solid " + style.border;
        
            } else {
        
                avatarFallback.innerText = "?";
        
                avatarFallback.className =
                    "w-100 h-100 d-flex align-items-center justify-content-center rounded-circle fw-bold fs-3";
        
                avatarFallback.style.background = "#f1f5f9";
                avatarFallback.style.color = "#94a3b8";
                avatarFallback.style.border = "3px solid #e2e8f0";
        
            }
        
        }
        
        // Previsualizar imagen
        function previewAvatar(event) {
        
            const file = event.target.files[0];
        
            if (!file) return;
        
            const reader = new FileReader();
        
            reader.onload = function(e) {
        
                const avatarDisplay = document.getElementById('avatarDisplay');
                const avatarFallback = document.getElementById('avatarFallback');
                const removeBtn = document.getElementById('removePhotoBtn');
        
                avatarDisplay.src = e.target.result;
        
                avatarDisplay.classList.remove('d-none');
                avatarFallback.classList.add('d-none');
        
                hasUploadedImage = true;
        
                removeBtn.classList.remove('d-none');
        
                showToast(
                    'Fotografía cargada',
                    'Se ha enlazado la foto al perfil del paciente.',
                    'success'
                );
        
            };
        
            reader.readAsDataURL(file);
        
        }

        // Permite remover la foto subida y volver instantáneamente a las iniciales calculadas
        function removeUploadedPhoto() {
            const fileInput = document.getElementById('avatarFile');
            const removeBtn = document.getElementById('removePhotoBtn');
            
            fileInput.value = ""; // Limpiar input
            hasUploadedImage = false;
            removeBtn.classList.add('hidden');
            
            // Recalcular avatar dinámico basado en texto actual
            updateDynamicAvatar();
            showToast( 'Foto removida', 'Se ha restablecido el avatar dinámico de iniciales.','error');
        }

        
        // --- SISTEMA DE TOASTS ---
        function showToast(title, message, type = 'success') {
        
            const container = document.getElementById('cw-toast-container');
            if (!container) return null;
        
            // Si ya existe un toast, reutilizarlo
            let toast = container.querySelector('.cw-toast');
        
            if (!toast) {
                toast = document.createElement('div');
                toast.className = 'cw-toast';
                container.appendChild(toast);
            }
        
            let icon = 'check-circle';
            let color = '#34d399';
            let extraStyle = '';
        
            switch(type){
        
                case 'loading':
                    icon = 'loader-circle';
                    color = '#3b82f6';
                    extraStyle = 'animation:spin 1s linear infinite;';
                    break;
        
                case 'error':
                    icon = 'x-circle';
                    color = '#ef4444';
                    break;
        
                case 'success':
                default:
                    icon = 'check-circle';
                    color = '#34d399';
                    break;
            }
        
            toast.innerHTML = `
                <i data-lucide="${icon}" size="20" style="color:${color};${extraStyle}"></i>
                <div>
                    <div class="fw-bold">${title}</div>
                    <div style="font-size: 10px;">${message}</div>
                </div>
            `;
        
            lucide.createIcons();
        
            toast.classList.add('show');
        
            clearTimeout(toast.hideTimer);
        
            if(type !== 'loading'){
                toast.hideTimer = setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 400);
                }, 3000);
            }
        
            return toast;
        }
    
        $(document).on('submit', '#patientForm', function(e) {
            e.preventDefault();
        
            const form = $(this);
            const url = form.attr('action');
            const formData = new FormData(this);
        
            const submitBtn = document.getElementById('submitBtn');
            const textEl = document.getElementById('submitBtnText');
            const loadingEl = document.getElementById('submitBtnLoading');
        
            // UI loading
            submitBtn.disabled = true;
            textEl.classList.add('d-none');
            loadingEl.classList.remove('d-none');
        
            $.ajax({
                url: url,
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
        
                success: function(resp) {
        
                    if (resp.status === 'success') {
        
                        Toast.fire({
                            icon: 'success',
                            title: resp.message
                        });
        
                        // cerrar modal si existe
                        if (typeof toggleModal === 'function') {
                            toggleModal(false);
                        }
        
                        // reset form
                        form[0].reset();
        
                        // limpiar foto si existe
                        if (typeof removeUploadedPhoto === 'function') {
                            removeUploadedPhoto();
                        }
        
                        // recargar lista
                        loadPage(1);
        
                    } else {
        
                        Toast.fire({
                            icon: 'error',
                            title: resp.message
                        });
        
                        submitBtn.disabled = false;
                        textEl.classList.remove('d-none');
                        loadingEl.classList.add('d-none');
                    }
                },
        
                error: function(xhr) {
        
                    Toast.fire({
                        icon: 'error',
                        title: "Error al procesar la solicitud"
                    });
        
                    submitBtn.disabled = false;
                    textEl.classList.remove('d-none');
                    loadingEl.classList.add('d-none');
        
                    console.log(xhr.responseText);
                }
            });
        });

        
        
    </script>