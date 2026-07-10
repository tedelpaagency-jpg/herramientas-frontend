
<style>
.image-container {
    position: relative;
    width: 200px;
    /* Ajusta el tamaño */
    height: 200px;
    overflow: hidden;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: fit;
}

.edit-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: white;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 50%;
    display: none;
}

.image-container:hover .edit-icon {
    display: block;
}

#fileInput {
    display: none;
}
</style>
<?php 
    $agency = $this->db->get_where('agency',['id'=>$id])->row_array(); 
    if(isset($agency)):
?>
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left">
        <div class="row">
            <div class="col-lg-12">
                <div class="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
                    <div class="card-body h250 p-0 rounded-xxl overflow-hidden m-3"><img src="<?= base_url(); ?>public/assets/images/portada.png" alt="image"></div>
                    <div class="card-body p-0 position-relative">
                        <figure class="avatar position-absolute w100 z-index-1" style="top:-40px; left: 30px;"><img src="<?= base_url(); ?>public/assets/images/logo/<?= $agency['logo']; ?>" alt="image" class="float-right p-1 bg-white rounded-circle w-100 h90"></figure>
                        <h4 class="fw-700 font-sm mt-2 mb-lg-5 mb-4 pl-15"><?= $agency['name']; ?> <span class="fw-500 font-xssss text-grey-500 mt-1 mb-3 d-block"><?= $agency['email']; ?></span></h4>
                        <div class="d-flex align-items-center justify-content-center position-absolute-md right-15 top-0 me-2">
                           <a href="tel:+<?= $agency['phone']; ?>" class="d-none d-lg-block bg-greylight btn-round-lg ms-2 rounded-3 text-grey-700"><i class="feather-phone font-md"></i></a>
                           <a href="mailto:<?= $agency['email']; ?>" class="d-none d-lg-block bg-greylight btn-round-lg ms-2 rounded-3 text-grey-700"><i class="feather-mail font-md"></i></a>
                           
                        </div>
                    </div>
                    <div class="card-body d-block w-100 shadow-none mb-0 p-0 border-top-xs">
                        <ul class="nav nav-tabs h55 d-flex product-info-tab border-bottom-0 ps-4" id="pills-tab" role="tablist">
                            <li class="active list-inline-item me-5"><a class="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block active" href="#navtabs1" data-bs-toggle="tab">Estadísticas</a></li>
                            <li class="list-inline-item me-5"><a class="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navtabs2" data-bs-toggle="tab">Usuarios</a></li>
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
                                                        <div class="card-label">Total</div>
                                                        <div class="holder-name"><?php echo $agency['name']; ?></div>
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
                                                        <div class="card-label">Total</div>
                                                        <div class="holder-name"><?php echo $agency['name']; ?></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body border-top-xs d-flex">
                                        <i class="feather-user text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-0">Nombre <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"><?php echo $agency['name']; ?></span></h4>
                                    </div>
                
                                    <div class="card-body d-flex pt-0">
                                        <i class="feather-phone text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-0">Teléfono <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"><?= $agency['phone']; ?></span></h4>
                                    </div>
                                    <div class="card-body d-flex pt-0">
                                        <i class="feather-map-pin text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-1"><?= $this->db->get_where('pais',['id'=>$agency['pais_id']])->row()->nombre; ?>, <?= $this->db->get_where('provincia',['id'=>$agency['provincia_id']])->row()->nombre; ?>, <?= $this->db->get_where('canton',['id'=>$agency['canton_id']])->row()->nombre; ?> </h4>
                                    </div>
                                    
                                </div>
                                
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
                
                    <div class="tab-pane fade p-3" id="navtabs2" role="tabpanel">
                        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body d-flex align-items-center p-4">
                                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Administradores</h4>
                            
                                <a href="javascript:void(0)" 
                                   onclick="showAjaxModal('<?= base_url(); ?>modal/popup/user_form/0/3/<?= $agency['id']; ?>')" 
                                   data-toggle="modal"
                                   class="ms-auto btn-round-md bg-success theme-dark-bg rounded-3 text-white">
                                    <i class="feather-plus-circle font-xss"></i>
                                </a>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                <div class="table-responsive">
                                   <table class="table " id="sale_data">
                                        <thead>
                                            <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                <th>Nombres</th>
                                                <th>Email</th>
                                                <th>Usuario</th>
                                                <th>Teléfono</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php $users = $this->db->get_where('user',['rol_id'=>3,'status !='=>0,'agency_id'=>$agency['id']])->result(); ?>
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
                                                    <td><?php echo $user->phone; ?></td>
                                                    <td><?php echo $user->status == 1 ? '<span class="badge border border-success text-success bg-transparent">Activo</span>':'<span class="badge border border-danger text-danger bg-transparent">Suspendido</span>'; ?>
                                                    </td>
                                                    <td>
                                                        <a href="<?= base_url(); ?>portal/user_profile/<?= base64_encode($user->user_id); ?>"  class="badge border border-primary text-primary bg-transparent icon-btn b-r-4"><i class="ti ti-user"></i></a>
                                                        <?php if($user->code != ''): ?>
                                                        <a href="<?= base_url(); ?>portal/users/sendCreds/<?= base64_encode($user->user_id); ?>"
                                                           onclick="return confirm('¿Deseas enviar las credenciales por WhatsApp?');"
                                                           class="badge border border-success text-success bg-transparent icon-btn b-r-4">
                                                            <i class="fab fa-whatsapp"></i>
                                                        </a>
                                                        <a href="<?= base_url(); ?>portal/users/sendCredsEmail/<?= base64_encode($user->user_id); ?>"
                                                           onclick="return confirm('¿Deseas enviar las credenciales por Email?');"
                                                           class="badge border border-success text-success bg-transparent icon-btn b-r-4">
                                                            <i class="fa fa-envelope"></i>
                                                        </a>
                                                        <?php endif; ?>    

                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body d-flex align-items-center p-4">
                                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Gerente</h4>
                            
                                <a href="javascript:void(0)" 
                                   onclick="showAjaxModal('<?= base_url(); ?>modal/popup/user_form/0/4/<?= $agency['id']; ?>')" 
                                   data-toggle="modal"
                                   class="ms-auto btn-round-md bg-success theme-dark-bg rounded-3 text-white">
                                    <i class="feather-plus-circle font-xss"></i>
                                </a>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                <div class="table-responsive">
                                   <table class="table " id="sale_data">
                                        <thead>
                                            <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                <th>Nombres</th>
                                                <th>Email</th>
                                                <th>Usuario</th>
                                                <th>Equipo</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php $users = $this->db->get_where('user',['rol_id'=>4,'status !='=>0,'agency_id'=>$agency['id']])->result(); ?>
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
                                                    <td><?php echo $this->crud_model->getCompanyName($user->company_id); ?></td>
                                                    <td><?php echo $user->status == 1 ? '<span class="badge border border-success text-success bg-transparent">Activo</span>':'<span class="badge border border-danger text-danger bg-transparent">Suspendido</span>'; ?>
                                                    </td>
                                                    <td>
                                                        <a href="<?= base_url(); ?>portal/user_profile/<?= base64_encode($user->user_id); ?>"  class="badge border border-primary text-primary bg-transparent icon-btn b-r-4"><i class="ti ti-user"></i></a>
                                                       <?php if($user->code != ''): ?>
                                                        <a href="<?= base_url(); ?>portal/users/sendCreds/<?= base64_encode($user->user_id); ?>"
                                                           onclick="return confirm('¿Deseas enviar las credenciales por WhatsApp?');"
                                                           class="badge border border-success text-success bg-transparent icon-btn b-r-4">
                                                            <i class="fab fa-whatsapp"></i>
                                                        </a>
                                                        <a href="<?= base_url(); ?>portal/users/sendCredsEmail/<?= base64_encode($user->user_id); ?>"
                                                           onclick="return confirm('¿Deseas enviar las credenciales por Email?');"
                                                           class="badge border border-success text-success bg-transparent icon-btn b-r-4">
                                                            <i class="fa fa-envelope"></i>
                                                        </a>
                                                        <?php endif; ?>    
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body d-flex align-items-center p-4">
                                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Counters</h4>
                            
                                <a href="javascript:void(0)" 
                                   onclick="showAjaxModal('<?= base_url(); ?>modal/popup/user_form/0/5/<?= $agency['id']; ?>')" 
                                   data-toggle="modal"
                                   class="ms-auto btn-round-md bg-success theme-dark-bg rounded-3 text-white">
                                    <i class="feather-plus-circle font-xss"></i>
                                </a>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                <div class="table-responsive">
                                   <table class="table " id="sale_data">
                                        <thead>
                                            <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                <th>Nombres</th>
                                                <th>Email</th>
                                                <th>Usuario</th>
                                                <th>Equipo</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php $users = $this->db->get_where('user',['rol_id'=>5,'status !='=>0,'agency_id'=>$agency['id']])->result(); ?>
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
                                                    <td><?php echo $this->crud_model->getCompanyName($user->company_id); ?></td>
                                                    <td><?php echo $user->status == 1 ? '<span class="badge border border-success text-success bg-transparent">Activo</span>':'<span class="badge border border-danger text-danger bg-transparent">Suspendido</span>'; ?>
                                                    </td>
                                                    <td>
                                                        <a href="<?= base_url(); ?>portal/user_profile/<?= base64_encode($user->user_id); ?>"  class="badge border border-primary text-primary bg-transparent icon-btn b-r-4"><i class="ti ti-user"></i></a>
                                                        <?php if($user->code != ''): ?>
                                                        <a href="<?= base_url(); ?>portal/users/sendCreds/<?= base64_encode($user->user_id); ?>"
                                                           onclick="return confirm('¿Deseas enviar las credenciales por WhatsApp?');"
                                                           class="badge border border-success text-success bg-transparent icon-btn b-r-4">
                                                            <i class="fab fa-whatsapp"></i>
                                                        </a>
                                                        <a href="<?= base_url(); ?>portal/users/sendCredsEmail/<?= base64_encode($user->user_id); ?>"
                                                           onclick="return confirm('¿Deseas enviar las credenciales por Email?');"
                                                           class="badge border border-success text-success bg-transparent icon-btn b-r-4">
                                                            <i class="fa fa-envelope"></i>
                                                        </a>
                                                        <?php endif; ?>    
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
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
                                
                                <form method="post" action="<?=  base_url('portal/agencies/saveAgency'); ?>" enctype="multipart/form-data" class="row">
                                    <input type="hidden" name="id" value="<?= $agency['id']; ?>" />
                                    <h4 class="fw-600 mb-3 mt-3 font-xssss text-grey-500 d-flex align-items-center ">Información</h4>
                                    <div class="col-md-12">
                                        <label class="form-label" for="validationCustom01">Nombre de la tienda</label>
                                        <input class="form-control" id="validationCustom01" placeholder="Nombre de la tienda" required="" value="<?= $agency['name']; ?>" name="name" type="text" />
                                        <div class="invalid-feedback">
                                            Debe ingresar un nombre
                                        </div>
                                    </div>
                                     <div class="col-md-12">
                                        <label class="form-label" for="validationCustom01">Descripción</label>
                                        <textarea class="form-control" id="validationCustom01"required=""  name="description"  ><?= $agency['description']; ?></textarea>
                                        <div class="invalid-feedback">
                                            Debe ingresar una descipcion del sistema
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <label class="form-label" for="validationCustom01">Dirección completa</label>
                                        <textarea class="form-control" id="validationCustom01"required=""  name="address"  ><?= $agency['address']; ?></textarea>
                                        <div class="invalid-feedback">
                                            Debe ingresar una dirección
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label" for="validationCustom01">Número de teléfono</label>
                                        <input class="form-control" id="validationCustom01" placeholder="+56 9 9999 9999" required="" value="<?= $agency['phone']; ?>" name="phone" type="text" />
                                        <div class="invalid-feedback">
                                            Debe ingresar un número de teléfono
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label" for="validationCustom01">Correo electrónico</label>
                                        <input class="form-control" id="validationCustom01" placeholder="correo@gmail.com" required="" value="<?= $agency['email']; ?>" name="email" type="text" />
                                        <div class="invalid-feedback">
                                            Debe ingresar un correo electrónico
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label" for="validationCustom01">Costo Adicional a productos</label>
                                        <input class="form-control" id="validationCustom01" placeholder="" required="" value="<?= $agency['cost_sale_price']; ?>" name="cost_sale_price" type="text" />
                                        <div class="invalid-feedback">
                                            Debe ingresar un número de teléfono
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label" for="validationCustom01">Costo de envio</label>
                                        <input class="form-control" id="validationCustom01" placeholder="" required="" value="<?= $agency['cost_delivery']; ?>" name="cost_delivery" type="text" />
                                        <div class="invalid-feedback">
                                            Debe ingresar un número de teléfono
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label" for="validationCustom01">Costo adicional de envio</label>
                                        <input class="form-control" id="validationCustom01" placeholder="" required="" value="<?= $agency['cost_delivery_aditional']; ?>" name="cost_delivery_aditional" type="text" />
                                        <div class="invalid-feedback">
                                            Debe ingresar un número de teléfono
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label" for="validationCustom01">Facebook</label>
                                        <input class="form-control" id="validationCustom01" placeholder="https://www.facebook.com/usuario"  value="<?= $agency['facebook']; ?>" name="facebook" type="text"   />
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label" for="validationCustom01">Instagram</label>
                                        <input class="form-control" id="validationCustom01" placeholder="https://www.instagram.com/usuario"  value="<?= $agency['instagram']; ?>" name="instagram" type="text" />
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label" for="validationCustom01">Ticktock</label>
                                        <input class="form-control" id="validationCustom01" placeholder="https://www.ticktock.com/usuario" value="<?= $agency['ticktock']; ?>" name="ticktock" type="text"  />
                                    </div>
                                    <div class="col-md-6">
                                        <div class="widget-box-2 mb-20">
                                            <h5 class="title">Logo</h5>
                                            <center>
                                                <div class="image-container" style="position: relative; display: inline-block;">
                                                    <img id="logoPreview" src="<?= base_url(); ?>public/assets/images/logo/<?= $agency['logo']; ?>" alt="Imagen actual" style="width: 200px; height: auto; border: 1px solid #ccc; border-radius: 8px;">
                            
                                                    <!-- Input oculto para seleccionar imagen -->
                                                    <input type="file" name="logo" id="logoFile" style="display: none;" accept="image/*">
                                                   
                                                    <!-- Ícono para activar selección -->
                                                    <div class="edit-icon" onclick="document.getElementById('logoFile').click();">
                                                        <i class="fas fa-pen"></i>
                                                    </div>
                                                </div>
                                            </center>
                            
                                            <script>
                                            document.getElementById('logoFile').addEventListener('change', function(event) {
                                                const file = event.target.files[0];
                                                if (file) {
                                                    // Mostrar previsualización
                                                    const reader = new FileReader();
                                                    reader.onload = function(e) {
                                                        document.getElementById('logoPreview').src = e.target.result;
                                                    };
                                                    reader.readAsDataURL(file);
                            
                                                }
                                            });
                                            </script>
                            
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="widget-box-2 mb-20">
                                            <h5 class="title">Favicon</h5>
                                            <center>
                                                <div class="image-container" style="position: relative; display: inline-block;">
                                                    <img id="faviPreview" src="<?= base_url(); ?>public/assets/images/logo/<?= $agency['favicon']; ?>" alt="Imagen actual" style="width: 200px; height: auto; border: 1px solid #ccc; border-radius: 8px;">
                            
                                                    <!-- Input oculto para seleccionar imagen -->
                                                    <input type="file" name="favicon" id="faviFile" style="display: none;" accept="image/*">
                            
                                                   
                                                    <!-- Ícono para activar selección -->
                                                    <div class="edit-icon" onclick="document.getElementById('faviFile').click();">
                                                        <i class="fas fa-pen"></i>
                                                    </div>
                                                </div>
                                            </center>
                            
                                            <script>
                                            document.getElementById('faviFile').addEventListener('change', function(event) {
                                                const file = event.target.files[0];
                                                if (file) {
                                                    // Mostrar previsualización
                                                    const reader = new FileReader();
                                                    reader.onload = function(e) {
                                                        document.getElementById('faviPreview').src = e.target.result;
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            });
                                            </script>
                            
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
                                    <?php if($agency['status'] != 0): ?>
                                    <h4 class="fw-600 mb-3  mt-3 font-xssss text-grey-500 d-flex align-items-center ">Eliminar agencia</h4>
                                    <div class="col-md-12 ">
                                        <p>Al confirmar la agencia ni sus usuarios tendran acceso al sistema pero sus ventas, reportes y demas aun sera accesible para los administradores y gerentes, si desea continuar confirme en el siguiente botón.</p>
                                   </div>
                                    <div class="col-md-12 mt-3">
                                        <a href="javascript:void(0)" onclick="delete_element('portal/agencies/deleteAgency/<?= base64_encode($agency['id']); ?>')" class="btn btn-danger text-center  text-white">Confirmar</a>
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