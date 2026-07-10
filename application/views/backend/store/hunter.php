<?php
 $rol_id = 7;
?>
 
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="row">
            <div class="col-xl-12">
                <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                    <div class="card-body d-flex align-items-center p-0">
                        <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Agencias</h2>
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
                                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de agencias</h4>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                <div class="table-responsive">
                                   <table class="table " id="sale_data">
                                        <thead>
                                            <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Usuario</th>
                                                <th>QR</th>
                                                <th>Link</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php $users = $this->db->get_where('user',['rol_id'=>$rol_id,'status !='=>0,'agency_id'=>$this->session->userdata('current_agency')])->result(); ?>
                                            <?php foreach($users as $user): ?>
                                                <tr>
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                              <img src="<?= $this->crud_model->getPhoto('user',$user->user_id); ?>" alt="" class="avatar-xs rounded-circle me-2">
                                                              <div>
                                                                  <h5 class="fs-14 m-0 fw-normal"><?php echo $user->name.' '.$user->last_name; ?></h5>
                                                              </div>
                                                          </div>
                                                    </td>
                                                    <td><?php echo $user->email; ?></td>
                                                    <td><?php echo $user->username; ?></td>
                                                    <td><a href="<?= $qr = $this->crud_model->getStoreQr($user->user_id); ?>"><img src="<?= $qr; ?>" width="50px;"></a>
                                                    </td>
                                                    <td>
                                                      <div class="input-group">
                                                        <input type="text" class="form-control" value="<?= base_url('hunter?store='.base64_encode($user->user_id)); ?>">
                                                        <button class="btn btn-outline-secondary copy-btn" type="button" title="Copiar">
                                                          <i class="fa fa-clipboard"></i>
                                                        </button>
                                                      </div>
                                                    </td>
                                                    
                                                    <td><?php echo $user->status == 1 ? '<span class="badge border border-success text-success bg-transparent">Activo</span>':'<span class="badge border border-danger text-danger bg-transparent">Suspendido</span>'; ?>
                                                    </td>
                                                    <td>
                                                        <a href="<?= base_url(); ?>portal/hunter_profile/<?= base64_encode($user->user_id); ?>"  class="badge border border-primary text-primary bg-transparent icon-btn b-r-4"><i class="ti ti-user"></i></a>
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
