
<?php 
    $user = $this->db->get_where('user',['user_id'=>$user_id])->row_array(); 
    if(isset($user)):
?>
<style>
.avatar-upload {
  position: relative;
  max-width: 205px;
  margin: 0px;
  padding-top:20px;
  padding-bottom:20px;
  left: 35%;
}
.avatar-upload .avatar-edit {
  position: absolute;
  right: 88px;
  z-index: 1;
  top: 30px;
}
.avatar-upload .avatar-edit input {
  display: none;
}
.avatar-upload .avatar-edit input + label {
  display: inline-block;
  width: 25px;
  height: 25px;
  margin-bottom: 0;
  border-radius: 100%;
  background: #ff5656eb;
  border: 1px solid transparent;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  font-weight: normal;
  transition: all 0.2s ease-in-out;
}
.avatar-upload .avatar-edit input + label:hover {
  background: #ff5656eb;
  border-color: #d6d6d6;
}
.avatar-upload .avatar-edit input + label:after {
  content: "\f040";
  font-family: 'FontAwesome';
  color: #fff;
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  text-align: center;
  margin: auto;
}
.avatar-upload .avatar-preview {
  width: 120px;
  height: 120px;
  position: relative;
  border-radius: 100%;
  border: 5px solid #e2e1e1;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
}
.avatar-upload .avatar-preview > div {
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

</style>
 
    <div class="middle-sidebar-bottom">
        <div class="middle-sidebar-left">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
                        <div class="card-body h250 p-0 rounded-xxl overflow-hidden m-3"><img src="<?= base_url(); ?>public/assets/images/portada.png" alt="image"></div>
                        <div class="card-body p-0 position-relative">
                            <figure class="avatar position-absolute w100 z-index-1" style="top:-40px; left: 30px;"><img src="<?= base_url(); ?>public/assets/images/users/<?= $user['photo']; ?>" onerror="this.onerror=null; this.src='<?= base_url(); ?>public/assets/images/users/dummy-avatar.jpg';" alt="image" class="float-right p-1 bg-white rounded-circle w-100 h90"></figure>
                            <h4 class="fw-700 font-sm mt-2 mb-lg-5 mb-4 pl-15"><?= $user['name'].' '.$user['last_name']; ?> <span class="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block"><?= $user['email']; ?></span></h4>
                            <div class="d-flex align-items-center justify-content-center position-absolute-md right-15 top-0 me-2">
                               <a href="tel:+<?= $user['phone']; ?>" class="d-none d-lg-block bg-greylight btn-round-lg ms-2 rounded-3 text-grey-700"><i class="feather-phone font-md"></i></a>
                               <a href="mailto:<?= $user['email']; ?>" class="d-none d-lg-block bg-greylight btn-round-lg ms-2 rounded-3 text-grey-700"><i class="feather-mail font-md"></i></a>
                               
                            </div>
                        </div>
                        <div class="card-body d-block w-100 shadow-none mb-0 p-0 border-top-xs">
                            <ul class="nav nav-tabs h55 d-flex product-info-tab border-bottom-0 ps-4" id="pills-tab" role="tablist">
                                <li class="active list-inline-item me-5"><a class="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block active" href="#navtabs1" data-bs-toggle="tab">Estadísticas</a></li>
                                <li class="list-inline-item me-5"><a class="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navtabs2" data-bs-toggle="tab">Registros</a></li>
                                <li class="list-inline-item me-5"><a class="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navtabs3" data-bs-toggle="tab">Editar</a></li>
                                <li class="list-inline-item me-5"><a class="fw-700 font-xssss text-danger pt-3 pb-3 ls-1 d-inline-block" href="#navDelete" data-bs-toggle="tab">Eliminar</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="tab-content" id="myTabContent">
                      <div class="tab-pane fade show active p-3" id="navtabs1" role="tabpanel">
                        <div class="row">
                            <div class="col-xl-4 col-xxl-3 col-lg-4 pe-0">
                                <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                    <div class="card-body d-block p-4">
                                        <h4 class="fw-700 mb-3 font-xsss text-grey-900">About</h4>
                                        <p class="fw-500 text-grey-500 lh-24 font-xssss mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus</p>
                                    </div>
                                    <div class="card-body border-top-xs d-flex">
                                        <i class="feather-lock text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-0">Private <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">What's up, how are you?</span></h4>
                                    </div>
                
                                    <div class="card-body d-flex pt-0">
                                        <i class="feather-eye text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-0">Visble <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">Anyone can find you</span></h4>
                                    </div>
                                    <div class="card-body d-flex pt-0">
                                        <i class="feather-map-pin text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-1">Flodia, Austia </h4>
                                    </div>
                                    <div class="card-body d-flex pt-0">
                                        <i class="feather-users text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-1">Genarel Group</h4>
                                    </div>
                                </div>
                                <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3">
                                    <div class="card-body d-flex align-items-center  p-4">
                                        <h4 class="fw-700 mb-0 font-xssss text-grey-900">Event</h4>
                                        <a href="#" class="fw-600 ms-auto font-xssss text-primary">See all</a>
                                    </div>
                                    <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                                        <div class="bg-success me-2 p-3 rounded-xxl"><h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0"><span class="ls-1 d-block font-xsss text-white fw-600">FEB</span>22</h4></div>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-2">Meeting with clients <span class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500">41 madison ave, floor 24 new work, NY 10010</span> </h4>
                                    </div>
                
                                    <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                                        <div class="bg-warning me-2 p-3 rounded-xxl"><h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0"><span class="ls-1 d-block font-xsss text-white fw-600">APR</span>30</h4></div>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-2">Developer Programe <span class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500">41 madison ave, floor 24 new work, NY 10010</span> </h4>
                                    </div>
                
                                    <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                                        <div class="bg-primary me-2 p-3 rounded-xxl"><h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0"><span class="ls-1 d-block font-xsss text-white fw-600">APR</span>23</h4></div>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-2">Aniversary Event <span class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500">41 madison ave, floor 24 new work, NY 10010</span> </h4>
                                    </div>
                                     
                                </div>
                            </div>
                            <div class="col-xl-8 col-xxl-9 col-lg-8 mt-3  ">
                                <div class="row">
                                    <div class="col-lg-6 pe-2">
                                    <div class="card w-100 border-0 shadow-none p-4 rounded-xxl  mb-3" style="background-color: #e5f6ff;">
                                        <div class="card-body d-flex p-0">
                                            <i class="btn-round-lg d-inline-block me-3 bg-primary-gradiant feather-home font-md text-white"></i>
                                            <h4 class="text-primary font-xl fw-700">2.3M <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">day visiter</span></h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 pe-2 ps-2">
                                    <div class="card w-100 border-0 shadow-none p-4 rounded-xxl  mb-3" style="background-color: #f6f3ff;">
                                        <div class="card-body d-flex p-0">
                                            <i class="btn-round-lg d-inline-block me-3 bg-secondary feather-lock font-md text-white"></i>
                                            <h4 class="text-secondary font-xl fw-700">44.6K <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">total user</span></h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 pe-2 ps-2">
                                    <div class="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3" style="background-color: #e2f6e9;">
                                        <div class="card-body d-flex p-0">
                                            <i class="btn-round-lg d-inline-block me-3 bg-success feather-command font-md text-white"></i>
                                            <h4 class="text-success font-xl fw-700">603 <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">monthly sale</span></h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 ps-2">
                                    <div class="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3" style="background-color: #fff0e9;">
                                        <div class="card-body d-flex p-0">
                                            <i class="btn-round-lg d-inline-block me-3 bg-warning feather-shopping-bag font-md text-white"></i>
                                            <h4 class="text-warning font-xl fw-700">3M <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">day visiter</span></h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-12">
                                    <div class="card w-100 h90px p-3 border-0 mb-3 rounded-xxl bg-lightblue2 shadow-none overflow-hidden">
                                        <div id="chart-usersMultiplee"></div>
                                    </div>
                                </div>
                                </div>
                                
                            </div> 
                        </div>
                      </div>
                    
                      <div class="tab-pane fade p-3" id="navtabs2" role="tabpanel">
                        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body d-flex align-items-center  p-4">
                                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Registros</h4>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                <div class="table-responsive">
                                   <table class="table table-striped text-nowrap" id="sale_data">
                                        <thead>
                                            <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                <th class="border-0 py-2">No.</th>
                                                <th class="border-0 py-2">Nombre</th>
                                                <th class="border-0 py-2">Estado</th>
                                                <th class="border-0 py-2">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php 
                                                $cont = 1;
                                                $sales = $this->db->order_by('id','DESC')->get('requests',['user_id'=>$user_id])->result();
                                                
                                            ?>
                                            <?php foreach($sales as $sale): ?>
                                                <tr>
                                                    <td><?php echo $sale->id; ?></td>    
                                                    <td><?php echo $sale->name.' '.$sale->last_name; ?></td>
                                                    <td>
                                                         <?php if($sale->status == 1): ?><span class="badge border border-warning text-warning bg-transparent">Pendiente</span>
                                                         <?php elseif($sale->status == 2): ?><span class="badge border border-success text-success bg-transparent">Aprobada</span>
                                                         <?php elseif($sale->status == 0): ?><span class="badge border border-danger text-danger  bg-transparent">Rechazada</span>
                                                         <?php endif; ?>
                                                    </td>
                                                    
                                                    <td>
                                                        <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/request_form/<?= $sale->id; ?>')" class="badge border border-primary text-primary bg-transparent icon-btn b-r-4"><i class="ti ti-file"></i></a>
                                                        
                                                        <?php if($sale->status == 1): ?>
                                                            <a href="javascript:void(0)" class="badge border border-success text-success bg-transparent icon-btn b-r-4 btn-aprobar" data-id="<?= base64_encode($sale->id); ?>"><i class="ti ti-check"></i>
                                                            </a>
                                                            
                                                            <a href="javascript:void(0)" class="badge border border-danger text-danger bg-transparent icon-btn b-r-4 btn-rechazar" data-id="<?= base64_encode($sale->id); ?>"><i class="ti ti-trash"></i>
                                                            </a>
                                                        <?php endif; ?>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                                   <!-- End Container Fluid -->
                                    <script>
                                    
                                    
                                    $(document).ready(function () {
                                    
                                        // Aprobar con comisión
                                        $('.btn-aprobar').click(function (e) {
                                            e.preventDefault();
                                            const id = $(this).data('id');
                                    
                                            Swal.fire({
                                                title: '¿Aprobar solicitud?',
                                                input: 'number',
                                                inputLabel: 'Ingrese la comisión (%)',
                                                inputPlaceholder: 'Ej. 10',
                                                inputAttributes: {
                                                    min: 0,
                                                    step: 0.01
                                                },
                                                showCancelButton: true,
                                                confirmButtonText: 'Aprobar',
                                                cancelButtonText: 'Cancelar',
                                                inputValidator: (value) => {
                                                    if (!value || isNaN(value) || value < 0) {
                                                        return 'Debe ingresar una comisión válida';
                                                    }
                                                }
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    $.ajax({
                                                        url: "<?= base_url('portal/requests/updateRequest') ?>",
                                                        method: "POST",
                                                        data: {
                                                            id: id,
                                                            status: 2, // aprobado
                                                            comision: result.value
                                                        },
                                                        success: function (response) {
                                                            Swal.fire('¡Aprobado!', 'La solicitud ha sido aprobada.', 'success');
                                                            location.reload();
                                                            // Puedes refrescar la tabla o recargar la página
                                                        },
                                                        error: function () {
                                                            Swal.fire('Error', 'No se pudo aprobar la solicitud.', 'error');
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    
                                        // Rechazar con motivo
                                        $('.btn-rechazar').click(function (e) {
                                            e.preventDefault();
                                            const id = $(this).data('id');
                                    
                                            Swal.fire({
                                                title: '¿Rechazar solicitud?',
                                                input: 'text',
                                                inputLabel: 'Motivo del rechazo',
                                                inputPlaceholder: 'Ingrese el motivo',
                                                showCancelButton: true,
                                                confirmButtonText: 'Rechazar',
                                                cancelButtonText: 'Cancelar',
                                                inputValidator: (value) => {
                                                    if (!value) {
                                                        return 'Debe ingresar un motivo';
                                                    }
                                                }
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    $.ajax({
                                                        url: "<?= base_url('portal/requests/updateRequest') ?>",
                                                        method: "POST",
                                                        data: {
                                                            id: id,
                                                            status: 0, // rechazado
                                                            motivo: result.value
                                                        },
                                                        success: function (response) {
                                                            Swal.fire('¡Rechazado!', 'La solicitud ha sido rechazada.', 'success');
                                                            location.reload();
                                                            // Actualizar vista o tabla
                                                        },
                                                        error: function () {
                                                            Swal.fire('Error', 'No se pudo rechazar la solicitud.', 'error');
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    
                                    });
                                    </script>
                                </div>
                            </div>
                        </div>
                      </div>
                      
                      <div class="tab-pane fade p-3" id="navtabs3" role="tabpanel">
                        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                                <div class="border-0 d-flex">
                                    <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel">Editar</h4>    
                                </div>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                
                                <form method="post" action="<?php echo base_url('portal/users/save/'.$user['user_id']); ?>" enctype="multipart/form-data" class="row">
                                    <input type="hidden" name="user_id" value="<?= $user['user_id']; ?>" />
                                    <input type="hidden" name="rol_id" value="<?= $user['rol_id']; ?>" />
                                    <h4 class="fw-600 mb-3 mt-3 font-xssss text-grey-500 d-flex align-items-center ">Información</h4>
                                    <div class="col-sm-12 ">
                                        <div class="avatar-upload">
                                            <div class="avatar-edit">
                                                <input type="file" name="photo" id="imageUpload" accept=".png, .jpg, .jpeg">
                                                <label for="imageUpload"></label>
                                            </div>
                                            <div class="avatar-preview" style="border: 2px solid #198cff8f;">
                                                <div id="imagePreview" style="background-image: url(<?php echo $this->crud_model->getPhoto('user',$user['user_id']); ?>);">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="name" class="mont-font fw-600 font-xsss">Nombre</label>
                                            <input type="text" class="form-control" id="name" name="name" value="<?php echo isset($user) ? $user['name']  : ''; ?>">
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="ruc" class="mont-font fw-600 font-xsss">RUC</label>
                                            <input type="text" class="form-control" id="ruc" name="ruc" value="<?php echo isset($user) ? $user['ruc']  : ''; ?>">
                                        </div>
                                    </div>
                                    <h4 class="fw-600 mb-3 mt-3 font-xssss text-grey-500 d-flex align-items-center ">Credenciales</h4>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="username" class="mont-font fw-600 font-xsss">Nombre de Usuario</label>
                                            <input type="text" class="form-control" id="username" name="username" value="<?php echo isset($user) ? $user['username']  : ''; ?>" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="password" class="mont-font fw-600 font-xsss">Contraseña</label>
                                            <input type="password" class="form-control" id="password" name="password" autocomplete="off">
                                        </div>
                                    </div>
                                    <h4 class="fw-600 mb-3 mt-3 font-xssss text-grey-500 d-flex align-items-center ">Contáctos</h4>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="phone" class="mont-font fw-600 font-xsss">Numero de telefono</label>
                                            <input type="number" class="form-control" id="phone" name="phone" value="<?php echo isset($user) ? $user['phone']  : ''; ?>">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="email" class="mont-font fw-600 font-xsss">Correo Electronico</label>
                                            <input type="email" class="form-control" id="email" name="email" value="<?php echo isset($user) ? $user['email']  : ''; ?>">
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group mb-3">
                                            <label for="email" class="mont-font fw-600 font-xsss">Dirección</label>
                                            <select id="pais" class="form-control mb-3" name="pais" required="">
                                                <option value="">Selecciona un país</option>
                                                <?php $paises = $this->db->get_where('pais')->result_array();?>
                                                <?php foreach($paises as $pais):?>
                                                <option value="<?= $pais['id']; ?>" <?= $user['pais_id'] == $pais['id'] ? 'Selected':''; ?>><?= $pais['nombre']; ?></option>
                                                <?php endforeach?>
                                            </select>
                                            <br>
                                            <select id="provincia"  class="form-control mb-3" name="provincia" required="">
                                                <option value="" class="form-control">Selecciona una provincia</option>
                                                <?php $provincias = $this->db->get_where('provincia',['pais_id'=>$user['pais_id']])->result_array();?>
                                                <?php foreach($provincias as $provincia):?>
                                                <option value="<?= $provincia['id']; ?>" <?= $user['provincia_id'] == $provincia['id'] ? 'Selected':''; ?>><?= $provincia['nombre']; ?></option>
                                                <?php endforeach?>
                                            </select>
                                            <br>
                                            <select id="canton"  class="form-control mb-3" name="canton" required="">
                                                <option value="" class="form-control">Selecciona un cantón</option>
                                                <?php $cantones = $this->db->get_where('canton',['provincia_id'=>$user['provincia_id']])->result_array();?>
                                                <?php foreach($cantones as $canton):?>
                                                <option value="<?= $canton['id']; ?>" <?= $user['canton_id'] == $canton['id'] ? 'Selected':''; ?>><?= $canton['nombre']; ?></option>
                                                <?php endforeach?>
                                            </select>
                                            <br>
                                            <textarea class="form-control" id="email" name="address" rows="3" required=""><?= $canton['address']; ?></textarea>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <button type="submit" class="btn btn-primary text-center  text-white">Guardar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                      </div>
                      <div class="tab-pane fade p-3" id="navDelete" role="tabpanel">
                        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body p-4 w-100 bg-danger border-0 d-flex rounded-3">
                                <div class="border-0 d-flex">
                                    <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel">Eliminar</h4>    
                                </div>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                <div class="row" >
                                    <?php if($user['status'] != 0): ?>
                                    <h4 class="fw-600 mb-3  mt-3 font-xssss text-grey-500 d-flex align-items-center ">Eliminar agencia</h4>
                                    <div class="col-md-12 ">
                                        <p>Al confirmar la agencia ya no tendra acceso al sistema pero sus registros y reportes sera accesible para los administradores, si desea continuar confirme en el siguiente botón.</p>
                                   </div>
                                    <div class="col-md-12 mt-3">
                                        <a href="javascript:void(0)" onclick="delete_element('portal/users/delete/<?= base64_encode($user['user_id']); ?>')" class="btn btn-danger text-center  text-white">Confirmar</a>
                                    </div>
                                    <?php else: ?>
                                    <h4 class="fw-600 mb-3  mt-3 font-xssss text-grey-500 d-flex align-items-center ">Eliminar agencia</h4>
                                    <div class="col-md-12 ">
                                        <p>Esta agencia ya a sido eliminada.</p>
                                   </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>  
    
<?php else: ?>

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-6 col-md-8 text-center default-page vh-100 align-items-center d-flex">
                <div class="card border-0 text-center d-block p-0">
                    <img src="https://uicobe.com/html/sociala/images/bg-43.png" alt="icon" class="w200 mb-4 ms-auto me-auto pt-md-5">
                    <h1 class="fw-700 text-grey-900 display3-size display4-md-size">Oops! It looks like you're lost.</h1>
                    <p class="text-grey-500 font-xsss">The page you're looking for isn't available. Try to search again or use the go to.</p>
                    <a href="<?= base_url(); ?>" class="p-3 w175 bg-current text-white d-inline-block text-center fw-600 font-xssss rounded-3 text-uppercase ls-3">Página de inicio</a>
                </div>
            </div>
        </div>
    </div> 

<?php endif; ?>