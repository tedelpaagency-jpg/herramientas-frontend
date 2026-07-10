
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
                                <li class="list-inline-item me-5"><a class="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navNotes" data-bs-toggle="tab">Notas</a></li>
                                <li class="list-inline-item me-5"><a class="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navCapa" data-bs-toggle="tab">Capacitaciones</a></li>
                                <li class="list-inline-item me-5"><a class="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navtabs3" data-bs-toggle="tab">Editar</a></li>
                                <?php if($user['user_id'] != $this->session->userdata('login_user_id')): ?>
                                <li class="list-inline-item me-5"><a class="fw-700 font-xssss text-danger pt-3 pb-3 ls-1 d-inline-block" href="#navDelete" data-bs-toggle="tab">Eliminar</a></li>
                                <?php endif;?>
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
                                        <!-- Tarjeta Ziigo (Superior) - Naranja -->
                                        <div class="card-wrapper">
                                            <div class="card-container payoneer-card">
                                                <!-- 1. Encabezado: Logo Ziigo (Superior Derecha) -->
                                                <div class="card-header">
                                                    <div class="ziigo-logo">
                                                        <img src="https://red.ziigo.pro/public/assets/images/logo/ziigo.png" 
                                                             alt="Ziigo Logo" 
                                                             onerror="this.src='https://placehold.co/80x30/FFFFFF/000000?text=Ziigo'">
                                                    </div>
                                                </div>
                                                
                                                <!-- 2. Medio: Número de Tarjeta -->
                                                <div class="card-number-row">
                                                    <div class="card-number-style">$0 dolares</div>
                                                </div>
                                    
                                                <!-- 3. Pie de página: Nombre, Expiración, y Logo Red -->
                                                <div class="card-footer">
                                                    <!-- Nombre del Titular -->
                                                    <div class="holder-info">
                                                        <div class="card-label">Titular</div>
                                                        <div class="holder-name"><?php echo $this->crud_model->getName('user',$this->session->userdata('login_user_id')); ?></div>
                                                    </div>
                                    
                                                    <!-- Fecha y Logo de Red -->
                                                   
                                                </div>
                                            </div>
                                        </div>
                                        <br>
                                        <!-- Tarjeta Ziigo (Inferior) - Azul -->
                                        <div class="card-wrapper">
                                            <div class="card-container blue-card">
                                                <!-- 1. Encabezado: Logo Ziigo (Superior Derecha) -->
                                                <div class="card-header">
                                                    <div class="ziigo-logo">
                                                        <img src="https://red.ziigo.pro/public/assets/images/logo/ziigo.png" 
                                                             alt="Ziigo Logo" 
                                                             onerror="this.src='https://placehold.co/80x30/FFFFFF/000000?text=Ziigo'">
                                                    </div>
                                                </div>
                                    
                                                <!-- 2. Medio: Número de Tarjeta -->
                                                <div class="card-number-row">
                                                    <div class="card-number-style">$0 puntos</div>
                                                </div>
                                    
                                                <!-- 3. Pie de página: Nombre, Expiración, y Logo Red -->
                                                <div class="card-footer">
                                                    <!-- Nombre del Titular -->
                                                    <div class="holder-info">
                                                        <div class="card-label">Titular</div>
                                                        <div class="holder-name"><?php echo $this->crud_model->getName('user',$this->session->userdata('login_user_id')); ?></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body border-top-xs d-flex">
                                        <i class="feather-user text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-0">Nombre <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"><?php echo $this->crud_model->getName('user',$this->session->userdata('login_user_id')); ?></span></h4>
                                    </div>
                
                                    <div class="card-body d-flex pt-0">
                                        <i class="feather-phone text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-0">Teléfono <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"><?= $user['phone']; ?></span></h4>
                                    </div>
                                    <div class="card-body d-flex pt-0">
                                        <i class="feather-map-pin text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-1"><?= $this->db->get_where('pais',['id'=>$user['pais_id']])->row()->nombre; ?>, <?= $this->db->get_where('provincia',['id'=>$user['provincia_id']])->row()->nombre; ?>, <?= $this->db->get_where('canton',['id'=>$user['canton_id']])->row()->nombre; ?> </h4>
                                    </div>
                                    <div class="card-body d-flex pt-0">
                                        <i class="feather-users text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-1"><?= $this->db->get_where('agency',['agency_id'])->row()->name; ?></h4>
                                    </div>
                                </div>
                                <?php 
                                    
                                $this->db->limit(3);
                                $this->db->where('user_id',   $this->session->userdata('login_user_id'));
                                $this->db->where('status', 0);
                                $query = $this->db->get('tasks');
                                $tasks = $query->result();
                                if(count($tasks) > 0):
                                 
                            ?>
                            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 ">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Tareas</h4>
                                    <a href="<?= base_url(); ?>portal/tasks" class="fw-600 ms-auto font-xssss text-primary">Ver todas</a>
                                </div>
                                
                                <?php 
                                      foreach ($tasks as $task):
                                          
                                          if($task->status == 0){
                                                    $st     = 'bg-primary';
                                                    $st_txt = '<span class="badge text-light-info"> Pendiente </span>';
                                            }else if($task->status == 1){
                                                    $st     = 'bg-success';
                                                    $st_txt = '<span class="badge text-light-success"> Finalizada </span>';
                                            }else if($task->status == 2){
                                                    $st     = 'bg-danger';
                                                    $st_txt = '<span class="badge text-light-danger"> Cancelada </span>';
                                            }else{
                                                    $st     = 'bg-primary';
                                                    $st_txt = '<span class="badge text-light-info"> Pendiente </span>';
                                            }
                                ?>
                                <div class="card-body d-flex pt-0 ps-4 pe-4 pb-3 overflow-hidden">
                                     <div class="<?= $st; ?> me-2 p-3 rounded-xxl text-center">
                                        <h4 class="fw-700 font-lg ls-3 lh-1 text-white mb-0">
                                            <span class="d-block font-xsss fw-600 uppercase">
                                                <?= date('M', strtotime($task->date)); ?>
                                            </span>
                                            <?= date('d', strtotime($task->date)); ?>
                                            <br>
                                            <span class="d-block font-xsss fw-600 uppercase">
                                                <?= date('H:i', strtotime($task->time)); ?>
                                            </span>
                                        </h4>
                                    </div>
                                    <h4 class="fw-700 text-grey-900 font-xssss mt-2 flex-grow-1">
                                                                        <?= $task->name ?>
                                                                        <span class="d-block font-xsssss fw-500 mt-1 lh-4 text-grey-500">
                                                                            <?php if($task->patient_id != '0') echo "Cliente: ".$this->crud_model->getName('client',$task->patient_id); ?>
                                                                        </span>
                                                                    </h4>
                                </div>
                                <?php endforeach; ?>
                            </div>
                            <?php endif; ?>
                            </div>
                            <div class="col-xl-8 col-xxl-9 col-lg-8 mt-3  ">
                                <div class="row">
                                    <div class="col-lg-6 pe-2">
                                    <div class="card w-100 border-0 shadow-none p-4 rounded-xxl  mb-3" style="background-color: #e5f6ff;">
                                        <div class="card-body d-flex p-0">
                                            <i class="btn-round-lg d-inline-block me-3 bg-primary-gradiant feather-home font-md text-white"></i>
                                            <h4 class="text-primary font-xl fw-700">0 <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">Total de Ventas</span></h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 pe-2 ps-2">
                                    <div class="card w-100 border-0 shadow-none p-4 rounded-xxl  mb-3" style="background-color: #f6f3ff;">
                                        <div class="card-body d-flex p-0">
                                            <i class="btn-round-lg d-inline-block me-3 bg-secondary feather-lock font-md text-white"></i>
                                            <h4 class="text-secondary font-xl fw-700">0 <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">Total de Puntos</span></h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 pe-2 ps-2">
                                    <div class="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3" style="background-color: #e2f6e9;">
                                        <div class="card-body d-flex p-0">
                                            <i class="btn-round-lg d-inline-block me-3 bg-success feather-command font-md text-white"></i>
                                            <h4 class="text-success font-xl fw-700">0 <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">Balance Actual</span></h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 ps-2">
                                    <div class="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3" style="background-color: #fff0e9;">
                                        <div class="card-body d-flex p-0">
                                            <i class="btn-round-lg d-inline-block me-3 bg-warning feather-shopping-bag font-md text-white"></i>
                                            <h4 class="text-warning font-xl fw-700">0 <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">Total de Ventas</span></h4>
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
                      <div class="tab-pane fade p-3" id="navNotes" role="tabpanel">
                        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                                <div class="border-0 d-flex">
                                    <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel">Notas</h4>    
                                </div>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                
                                <form method="post" action="<?php echo base_url('portal/users/update_notes/'.$user['user_id']); ?>" enctype="multipart/form-data" class="row">
                                    <h4 class="fw-600 mb-3 mt-3 font-xssss text-grey-500 d-flex align-items-center ">Editar o Agregar Notas</h4>
                                    <div class="col-md-12">
                                        <div class="form-group mb-3">
                                            <label for="phone" class="mont-font fw-600 font-xsss">Notas</label>
                                            <textarea class="form-control mb-0 p-3 h100 bg-greylight lh-16" id="email" name="notes" rows="5" required=""><?= $user['notes']; ?></textarea>
                                        </div>
                                   </div>
                                    <div class="col-md-12">
                                        <button type="submit" class="btn btn-primary text-center  text-white">Guardar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                      </div>
                      <div class="tab-pane fade p-3" id="navCapa" role="tabpanel">
                        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                                <div class="border-0 d-flex">
                                    <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel">Cursos</h4>    
                                </div>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                
                                <form method="post" id="formCursos" action="<?php echo base_url('portal/guardar_cursos_usuario/'.$user['user_id']); ?>" class="row">
                                    <h4 class="fw-600 mb-3  mt-3 font-xssss text-grey-500 d-flex align-items-center ">Editar o Agregar Cursos</h4>
                                    <div class="col-md-12 ">
                                        <div id="contenedorCheckboxes">
                                        <!-- Aquí se cargarán los checkboxes -->
                                        </div>
                                        <input type="hidden" name="user_type" id="user_type" value="user">
                                        <input type="hidden" name="user_id" id="user_id" value="<?= $user['user_id']; ?>">
                                   </div>
                                    <div class="col-md-12 mt-3">
                                        <button type="submit" class="btn btn-primary text-center  text-white">Guardar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <script>
                          $(function() {
                              
                                $.get('/portal/obtener_cursos_usuario/<?= $user['user_id']; ?>/user' , function(data) {
                                console.log(data);
                                let checkboxes = '';
                                data.forEach(item => {
                                    const checked = item.seleccionado == 1 ? 'checked' : '';
                                    checkboxes += `
                                      <div class="form-check">
                                        <input class="form-check-input" type="checkbox" name="iframes[]" value="${item.id}" id="iframe_${item.id}" ${checked}>
                                        <label class="form-check-label" for="iframe_${item.id}">
                                          ${item.titulo}
                                        </label>
                                      </div>`;
                                });
                        
                                $('#contenedorCheckboxes').html(checkboxes);
                          
                                });
                            });
                      </script>
                      </div>
                      <div class="tab-pane fade p-3" id="navtabs3" role="tabpanel">
                        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                                <div class="border-0 d-flex">
                                    <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel">Editar</h4>    
                                </div>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                
                                <form id="userForm" method="post" action="<?php echo base_url('portal/users/save/'.$user['user_id']); ?>" enctype="multipart/form-data" class="row">
                                    <input type="hidden" name="user_id" value="<?= $user['user_id']; ?>" />
                                    <input type="hidden" name="rol_id" value="<?= $user['rol_id']; ?>" />
                                    <h4 class="fw-600 mb-3 mt-3 font-xssss text-grey-500 d-flex align-items-center ">Información</h4>
                                    <div class="col-sm-6 ">
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
                                    <div class="col-md-6">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="name" class="mont-font fw-600 font-xsss">Nombres</label>
                                                <input type="text" class="form-control" id="name" name="name" value="<?php echo isset($user) ? $user['name']  : ''; ?>">
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="last_name" class="mont-font fw-600 font-xsss">Apellidos</label>
                                                <input type="text" class="form-control" id="last_name" name="last_name" value="<?php echo isset($user) ? $user['last_name']  : ''; ?>">
                                            </div>
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
                                            <textarea class="form-control" id="email" name="address" rows="3" required=""><?= $user['address']; ?></textarea>
                                        </div>
                                    </div>
                                    <h4 class="fw-600 mb-3 mt-3 font-xssss text-grey-500 d-flex align-items-center ">Equipo</h4>
                                    <div class="col-md-12">
                                        <div class="form-group mb-3">
                                            <label for="phone" class="mont-font fw-600 font-xsss">Equipo</label>
                                            <select class="form-control" data-choices name="company_id" id="choices-single-default">
                                                <option value="">Seleccionar</option>
                                                <?php
                                                    $com = $this->db->get_where('company',array('status'=>1))->result_array();
                                                    foreach($com as $c):
                                                ?>
                                                        <option value="<?= $c['company_id']; ?>" <?php if(isset($user)) { echo $user['company_id']  == $c['company_id'] ? 'selected':''; } ?>><?= $c['name']; ?></option>
                                                <?php endforeach; ?>
                                            </select>
                                        </div>
                                   </div>
                                    <div class="col-md-12">
                                        <button type="submit" class="btn btn-primary text-center  text-white">Guardar</button>
                                    </div>
                                </form>
                                <script>
                                    
                                    
                                    $('#userForm').on('submit', function(e) {
                                        e.preventDefault();
                                        
                                        $('#btnsubmit').attr('disabled','disabled');
                                        let form = $(this);
                                        let url = form.attr('action');
                                        let formData = new FormData(this);
                                    
                                        $.ajax({
                                            url: url,
                                            type: "POST",
                                            data: formData,
                                            processData: false,   // obligatorio para file
                                            contentType: false,   // obligatorio para file
                                            dataType: "json",
                                            beforeSend: function() {
                                                // opcional
                                            },
                                            success: function(resp) {
                                                if (resp.status === 'success') {
                                                    
                                                     Toast.fire({
                                                        icon: 'success',
                                                        title: resp.message
                                                    });
                                                    
                                                    location.reload();
                                                    
                                                } else {
                                                    // error
                                                    Toast.fire({
                                                        icon: 'error',
                                                        title: resp.message
                                                    });
                                                    
                                                    $('#btnsubmit').removeAttr('disabled');
                                                }
                                            },
                                            error: function(xhr) {
                                                 // error
                                                Toast.fire({
                                                    icon: 'error',
                                                    title: "Error al procesar la solicitud"
                                                });
                                                    
                                                $('#btnsubmit').removeAttr('disabled');
                                                    
                                                console.log(xhr.responseText);
                                            }
                                        });
                                    });
                                </script>
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
                                    <h4 class="fw-600 mb-3  mt-3 font-xssss text-grey-500 d-flex align-items-center ">Eliminar usuario</h4>
                                    <div class="col-md-12 ">
                                        <p>Al confirmar el usuario ya no tendra acceso al sistema pero sus ventas, reportes y demas aun sera accesible para los administradores y gerentes, si desea continuar confirme en el siguiente botón.</p>
                                   </div>
                                    <div class="col-md-12 mt-3">
                                        <a href="javascript:void(0)" onclick="delete_element('portal/users/delete/<?= base64_encode($user['user_id']); ?>')" class="btn btn-danger text-center  text-white">Confirmar</a>
                                    </div>
                                    <?php else: ?>
                                    <h4 class="fw-600 mb-3  mt-3 font-xssss text-grey-500 d-flex align-items-center ">Eliminar usuario</h4>
                                    <div class="col-md-12 ">
                                        <p>Este usuario ya a sido eliminado.</p>
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