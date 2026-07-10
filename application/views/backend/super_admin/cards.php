<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Tarjetas Públicas</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                    <a href="<?= base_url() ?>portal/card_edit/"  data-toggle="modal" class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                                </div>
                            </div>

                            <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de Perfiles</h4>
                                </div>
                                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                    <div class="table-responsive">
                                       <table class="table " id="sale_data">
                                            <thead>
                                                <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                    <th>Usuario</th>
                                                    <th>Agencia</th>
                                                    <th>Ultima Actualización</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php
                                                    $this->db->order_by('id','DESC');
                                        
                                                    $lexvault = $this->db->get('user_profile')->result_array();
                                                    foreach($lexvault as $row):
                                                        ?>
                                                        <tr>
                                                            <td>
                                                                <div class="d-flex align-items-center">
                                                                  <img src="<?= $this->crud_model->getPhoto('user',$row['user_id']); ?>" alt="" class="avatar-xs rounded-circle me-2">
                                                                  <div>
                                                                      <h5 class="fs-14 m-0 fw-normal"><?= $this->crud_model->getName('user',$row['user_id']); ?></h5>
                                                                  </div>
                                                                </div>
                                                            </td>
                                                            <td><?= $this->db->get_where('agency',['id'=>$row['agency_id']])->row()->name; ?></td>
                                                            <td><?= $row['updated_at']; ?></td>
                                                            <td class="text-center">
                                                                <!-- Botón Copiar -->
                                                                <a href="javascript:void(0)"
                                                                   class="badge border border-success text-success bg-transparent copyLink"
                                                                   title="Copiar enlace"
                                                                   data-link="<?= base_url('card?user_id='.base64_encode($row['user_id'])) ?>">
                                                                    <i class="fa-solid fa-link fa-fw"></i>
                                                                </a>
                                                                <a href="<?= base_url('portal/card_edit/'.base64_encode($row['id'])) ?>"
                                                                   class="badge border border-info text-info bg-transparent"
                                                                   title="Ver detalles">
                                                                    <i class="fa-solid fa-file-lines fa-fw"></i>
                                                                </a>
                                                                <?php if($row['status'] == 1): ?>
                                                                <!-- Botón Ver -->
                                                                <a href="javascript:void(0)" onclick="enableVisa('<?= base64_encode($row['id']); ?>',2)"
                                                                   class="badge border border-danger text-danger bg-transparent"
                                                                   title="Ver detalles">
                                                                    <i class="fa-solid fa-eye fa-fw"></i>
                                                                </a>
                                                                   
                                                                <?php else:?>
                                                                    <a href="javascript:void(0)" onclick="enableVisa('<?= base64_encode($row['id']); ?>',1)"
                                                                       class="badge border border-info text-info bg-transparent"
                                                                       title="Ver detalles">
                                                                        <i class="fa-solid fa-eye-slash fa-fw"></i>
                                                                    </a>
                                                                <?php endif; ?>
                        
                                                                <!-- Botón Eliminar -->
                                                                <a href="javascript:void(0)"
                                                                   class="badge border border-danger text-danger bg-transparent"
                                                                   title="Eliminar"
                                                                   onclick="confirmDelete('<?= base_url(); ?>portal/card_edit/delete/<?= base64_encode($row['id']) ?>')">
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