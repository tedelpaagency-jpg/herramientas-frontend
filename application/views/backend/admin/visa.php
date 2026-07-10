<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Visas</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                    <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/modal_visa_form/0/<?= $visa_ref_id; ?>')" data-toggle="modal" class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                                </div>
                            </div>

                            <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de visas</h4>
                                </div>
                                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                    <div class="table-responsive">
                                       <table class="table " id="sale_data">
                                            <thead>
                                                <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                    <th>Nombre</th>
                                                    <th>Fecha</th>
                                                    <th>Visa</th>
                                                    <th>Estado</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php
                                                    $this->db->order_by('visa_id','DESC');
                                                    $this->db->where('visa_ref_id' ,$visa_ref_id);
                                                    $this->db->where('status !=' ,0);
                                                    $this->db->where('user_id',$this->session->userdata('login_user_id'));
                                                    $lexvault = $this->db->get('visa')->result_array();
                                                    foreach($lexvault as $row):
                                                        ?>
                                                        <tr>
                                                            <td><?= htmlspecialchars($row['name']) ?></td>
                                                            <td><?= htmlspecialchars($row['date']) ?></td>
                                                            <td><?= $row['visa_type'] == 'USA' ? 'Visa americana' : 'Visa canadiense' ?></td>
                                                            <td>
                                                                <?php if($row['status'] == 1): ?>
                                                                    <span class="badge border border-warning text-warning bg-transparent">Pendiente</span>
                                                                <?php elseif($row['status'] == 2): ?>
                                                                    <span class="badge border border-success text-success bg-transparent">Confirmada</span>
                                                                <?php elseif($row['status'] == 3): ?>
                                                                    <span class="badge border border-danger text-danger bg-transparent">Rechazado</span>
                                                                <?php endif; ?>
                                                            </td>
                                                            <td class="text-center">
                                                                <!-- Botón Copiar -->
                                                                <a href="javascript:void(0)"
                                                                   class="badge border border-success text-success bg-transparent copyLink"
                                                                   title="Copiar enlace"
                                                                   data-link="<?= base_url('visa/show/'.base64_encode($row['visa_id'])) ?>">
                                                                    <i class="fa-solid fa-link fa-fw"></i>
                                                                </a>
                                                                <a href="<?= base_url('visa/show/'.base64_encode($row['visa_id'])) ?>"
                                                                   class="badge border border-info text-info bg-transparent"
                                                                   title="Ver detalles">
                                                                    <i class="fa-solid fa-file-lines fa-fw"></i>
                                                                </a>
                                                                <?php if($row['status'] == 1): ?>
                                                                <!-- Botón Ver -->
                                                                <a href="javascript:void(0)" onclick="enableVisa('<?= base64_encode($row['visa_id']); ?>',2)"
                                                                   class="badge border border-danger text-danger bg-transparent"
                                                                   title="Ver detalles">
                                                                    <i class="fa-solid fa-eye fa-fw"></i>
                                                                </a>
                                                                   
                                                                <?php else:?>
                                                                    <a href="javascript:void(0)" onclick="enableVisa('<?= base64_encode($row['visa_id']); ?>',1)"
                                                                       class="badge border border-info text-info bg-transparent"
                                                                       title="Ver detalles">
                                                                        <i class="fa-solid fa-eye-slash fa-fw"></i>
                                                                    </a>
                                                                <?php endif; ?>
                        
                                                                <!-- Botón Editar -->
                                                                <a href="javascript:void(0)"
                                                                   class="badge border border-info text-info bg-transparent"
                                                                   title="Editar"
                                                                   onclick="showAjaxModal('<?= base_url('modal/popup/modal_visa_form/'.$row['visa_id']) ?>')">
                                                                    <i class="fa-solid fa-edit fa-fw"></i>
                                                                </a>
                        
                                                                <!-- Botón Eliminar -->
                                                                <a href="javascript:void(0)"
                                                                   class="badge border border-danger text-danger bg-transparent"
                                                                   title="Eliminar"
                                                                   onclick="confirmDelete('<?= base_url(); ?>portal/visas/delete/<?= $row['visa_id'] ?>')">
                                                                    <i class="fa-solid fa-trash fa-fw"></i>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    <?php endforeach; ?>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>               
                    </div>
                </div>
                 
            </div>

<script>
    // Función para copiar enlace
    document.addEventListener('DOMContentLoaded', function() {
        // Copiar enlace
        document.querySelectorAll('.copyLink').forEach(btn => {
            btn.addEventListener('click', function() {
                const link = this.getAttribute('data-link');
                navigator.clipboard.writeText(link).then(() => {
                    // Usando Toastify del head existente
                    Toastify({
                        text: "Enlace copiado al portapeles",
                        duration: 3000,
                        close: true,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
                    }).showToast();
                });
            });
        });
    });

 // Función para confirmar eliminación
    function enableVisa(id,status) {
        Swal.fire({
            title: '¿Confirmar acción?',
            text: "Esta acción cambiara el estado del formulario para la visa",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '<?= base_url(); ?>visa/enableVisa/'+id+'/'+status;
            }
        });
    }
    
    // Función para confirmar eliminación
    function confirmDelete(url) {
        Swal.fire({
            title: '¿Confirmar eliminación?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = url;
            }
        });
    }
</script>