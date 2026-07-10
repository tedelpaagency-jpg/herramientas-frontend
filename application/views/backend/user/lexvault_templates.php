<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Contratos</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                    <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url() ?>modal/popup/modal_lexvault_template/');" data-toggle="modal" class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                                </div>
                            </div>
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
                                                    <th>Descripción</th>
                                                    <th>Campos</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php  
                                                    $this->db->where('status',1);
                                                    $this->db->where('pais_id',$this->session->userdata('current_country'));
                                                    $this->db->where('agency_id',$this->session->userdata('current_agency'));
                                                    $contracts = $this->db->get('lexvault_template')->result_array(); 
                                                    
                                                    foreach($contracts as $row):
                                                ?>
                                                <tr>
                                                    <td><?php echo $row['name'];   ?></td>
                                                    <td><?php echo $row['description'];   ?></td>
                                                    <td>
                                                        <ul style="list-style-type: disc;"><?php  $fields = json_decode($row['fields'],true); foreach ($fields as $valor) {
                                                                        echo '<li>'.$valor . '</li>';
                                                                    }  ?>
                                                        </ul>
                                                    </td>
                                                    <td>
                                                        <a  class="badge border border-info text-info bg-transparent" href="<?php echo base_url();?>portal/lexvault_template_edit/<?php echo base64_encode( $row['lexvault_template_id']); ?>"><i class="fa-solid fa-file-lines fa-fw"></i></a>
                                                        &nbsp
                                                        <a  href="javascript:void(0)" class="badge border border-success text-success bg-transparent" onclick="showAjaxModal('<?php echo base_url();?>modal/popup/modal_lexvault_template/<?php echo base64_encode( $row['lexvault_template_id']); ?>');" ><i class="fa-solid fa-pencil fa-fw"></i></a>
                                                        &nbsp
                                                        <a  class="badge border border-danger text-danger bg-transparent" href="javascript:void(0)" onclick="deleteLextvault('<?php echo base64_encode($row['lexvault_template_id']); ?>')"><i class="fa-solid fa-trash fa-fw"></i></a>
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