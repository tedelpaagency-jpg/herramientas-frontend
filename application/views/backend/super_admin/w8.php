<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Contratos W8</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                    <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url() ?>modal/popup/w8_form/');"  class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                                </div>
                            </div>
                             <a href="<?= base_url(); ?>portal/lexvault_templates"  data-toggle="modal" class="ms-2 mt-3 mb-3 p-2 bg-info rounded-3 theme-dark-bg  text-white">Plantillas</a>
                            <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de contratos</h4>
                                </div>
                                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                    <div class="table-responsive">
                                       <table class="table " id="sale_data">
                                            <thead>
                                                <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                    <th>Nombre</th>
                                                    <th>Fecha</th>
                                                    <th>Estado</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php  
                                                    $this->db->order_by('id','DESC');
                                                    $lexvault = $this->db->get('w8')->result_array(); 
                                                    foreach($lexvault as $row):
                                                    
                                                ?>
                                                <tr>
                                                   
                                                    <td><?php echo $row['name'];   ?></td>
                                                    <td><?php echo $row['date'];   ?></td>
                                                    <td>
                                                         <?php if($row['status'] == 0): ?><span class="badge border border-warning text-warning bg-transparent">Pendiente</span>
                                                         <?php elseif($row['status'] == 1): ?><span class="badge border border-success text-success bg-transparent">Completado</span>
                                                         <?php elseif($row['status'] == 2): ?><span class="badge border border-danger text-danger bg-transparent">Rechazado</span>
                                                         <?php endif; ?>
                                                    </td>
                                                    <td>
                                                        <a  class="badge border border-success text-success bg-transparent copyLink" 
                                                            href="javascript:void(0)"  
                                                            data-link="<?= base_url('w8?campaign='.base64_encode($row['id'])) ?>">
                                                            <i class='fa-solid fa-link fa-fw'></i>
                                                        </a>
                                                        <a  class="badge border border-info text-info bg-transparent" href="<?= base_url('w8?campaign='.base64_encode($row['id'])) ?>"><i class='fa-solid fa-eye fa-fw'></i></a>
                                                        <a  class="badge border border-info text-info bg-transparent" href="javascript:void(0)" onclick="showAjaxModal('<?= base_url() ?>modal/popup/w8_form/<?php echo $row['id']; ?>');"><i class='fa-solid fa-pencil fa-fw' ></i></a>
                                                        <a  class="badge border border-danger text-danger bg-transparent" href="javascript:void(0)" onclick="  delete_element('portal/w8/delete/<?php echo $row['id']; ?>')"><i class="fa-solid fa-trash fa-fw"></i></a>
                                                    </td>
                                                </tr>
                                                <?php endforeach;?>
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
$(document).ready(function() {
    // Función para copiar enlace
    $('.copyLink').on('click', function() {
        var link = $(this).data('link');
        navigator.clipboard.writeText(link).then(() => {
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
    
    // Función para confirmar eliminación
    window.confirmDelete = function(url) {
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
});
</script>