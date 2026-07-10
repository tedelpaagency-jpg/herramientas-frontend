 
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="row">
            <div class="col-xl-12">
                <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                    <div class="card-body d-flex align-items-center p-0">
                        <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Comercios</h2>
                        <div class="search-form-2 ms-auto">
                            <i class="ti-search font-xss"></i>
                            <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                        </div>
                        <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                        <a href="javascript:void(0)"  onclick="showAjaxModal('<?= base_url(); ?>modal/popup/hunter_form/0/<?= $rol_id; ?>')"  data-toggle="modal" class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                    </div>
                </div>

                <div class="row ps-2 pe-1">
                    <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body d-flex align-items-center p-4">
                                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de regsitros </h4>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                <div class="table-responsive">
                                   <table class="table " id="sale_data">
                                        <thead>
                                            <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Teléfono</th>
                                                <th>Formulario/Tienda</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php  $users = $this->db->get_where('requests',['forms_id'=>$form_id])->result(); ?>
                                            <?php 
                                                foreach($users as $user): 
                                                $form = $this->db->get_where('forms',['forms_id'=>$form_id])->row();
                                            ?>
                                                <tr>
                                                   <td><?php echo $user->name.' '.$user->last_name; ?></td>
                                                    <td><?php echo $user->email; ?></td>
                                                    <td><?php echo $user->phone; ?></td>
                                                    <td><?php echo $form->name; ?></td>
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
     
</div>    
<script>
  $(document).on('click', '.copy-btn', function() {
    // Buscar el input más cercano
    var input = $(this).closest('.input-group').find('input');
    
    // Seleccionar y copiar
    input.select();
    document.execCommand('copy');

    // Opcional: mostrar alerta
    alert("¡Enlace copiado!");
  });
</script>
