
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
.timeline-item{
    position:relative;
    padding-left:40px;
}

.timeline-item:before{
    content:'';
    position:absolute;
    left:14px;
    top:0;
    bottom:-20px;
    width:2px;
    background:#e5e7eb;
}

.timeline-dot{
    position:absolute;
    left:8px;
    top:25px;
    width:14px;
    height:14px;
    border-radius:50%;
    background:#2563eb;
    z-index:10;
}

</style>

    <div class="middle-sidebar-bottom">
        <div class="middle-sidebar-left">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
                        <div class="card-body p-4">

                            <div class="row align-items-center">
                        
                                <div class="col-lg-2 text-center">
                                    <img src="<?= $this->crud_model->getPhoto('user',$user['user_id']); ?>"
                                        onerror="this.onerror=null; this.src='<?= base_url(); ?>public/assets/images/users/dummy-avatar.jpg';"
                                        class="rounded-circle border border-3 shadow"
                                        style="width:120px;height:120px;object-fit:cover;">
                                </div>
                        
                                <div class="col-lg-7">
                        
                                    <h2 class="fw-700 mb-1">
                                        <?= $user['name'].' '.$user['last_name']; ?>
                                    </h2>
                        
                                    <p class="text-muted mb-3">
                                        <?= $this->crud_model->calcularEdad($user['birthday']); ?> años
                                        · <?= $user['gender'] ?? 'No definido'; ?>
                                    </p>
                        
                                    <div class="mb-2">
                                        <i class="feather-mail me-2"></i>
                                        <?= $user['email']; ?>
                                    </div>
                        
                                    <div class="mb-3">
                                        <i class="feather-phone me-2"></i>
                                        <?= $user['phone']; ?>
                                    </div>
                        
                                    <span class="badge bg-danger me-2">
                                        ⚠ Sin alergias registradas
                                    </span>
                        
                                </div>
                        
                                <div class="col-lg-3 text-end">
                        
                                    <div class="mb-3">
                                        <small class="text-muted d-block">Última consulta</small>
                                        <strong>Sin registros</strong>
                                    </div>
                        
                                    <div class="mb-4">
                                        <small class="text-muted d-block">Próxima cita</small>
                                        <strong>No programada</strong>
                                    </div>
                        
                                    <a href="<?= base_url(); ?>portal/consultations/add/<?= $user_id; ?>" class="p-3  bg-current text-white d-inline-block text-center fw-600 font-xssss rounded-3 text-uppercase ls-3">Nueva consulta</a>
                        
                                </div>
                            </div>
                        </div>
                        <div class="card-body d-block w-100 shadow-none mb-0 p-0 border-top-xs">
                            <ul class="nav nav-tabs h55 d-flex product-info-tab border-bottom-0 ps-4" id="pills-tab" role="tablist">
                                <li class="active list-inline-item me-5"><a class="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block active" href="#navtabs1" data-bs-toggle="tab">General</a></li>
                                <li class="list-inline-item me-5"><a class="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#tabBackgrounds" data-bs-toggle="tab">Antecedentes</a></li>
                                <li class="list-inline-item me-5"><a class="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navtabsAppointments" data-bs-toggle="tab">Citas</a></li>
                                <li class="list-inline-item me-5"><a class="fw-700 font-xssss text-grey-500 pt-3 pb-3 ls-1 d-inline-block" href="#navtabs2" data-bs-toggle="tab">Recetas</a></li>
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
                                    <div class="card-body d-flex align-items-center  p-4">
                                        <h4 class="fw-700 mb-0 font-xssss text-grey-900">Información</h4>
                                        <a  class="fw-600 ms-auto font-xssss text-primary" href="javascript:void(0);" onclick="goToTab('#navtabs3')">Editar</a>
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
                                        <i class="feather-mail text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-0">Email <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"><?= $user['email']; ?></span></h4>
                                    </div>
                                    <div class="card-body d-flex pt-0">
                                        <i class="feather-map-pin text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-1"><?= $this->db->get_where('pais',['id'=>$user['pais_id']])->row()->nombre; ?> </h4>
                                    </div>
                                    <div class="card-body d-flex pt-0">
                                        <i class="feather-users text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-1">Genarel Group</h4>
                                    </div>
                                </div>

                                <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 mt-3">
    
                                    <div class="card-body d-flex align-items-center p-4">
                                        <h4 class="fw-700 mb-0 font-xssss text-grey-900">Parámetros clínicos</h4>
                                        <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/clinical_records_form/<?= $user['user_id']; ?>')" class="fw-600 ms-auto font-xssss text-primary">Actualizar</a>
                                    </div>
                                    <?php 
                                        $clinical_records = $this->db->order_by('id','DESC')->get_where('clinical_records',['patient_id'=>$user['user_id']])->first_row();

                                        if(isset($clinical_records)):
                                           $records = $this->db
                                                        ->select("
                                                            p.id AS parameter_id,
                                                            p.name,
                                                            p.icon,
                                                            p.unit,
                                                            cv.value
                                                        ")
                                                        ->from('clinical_parameters p')
                                                        ->join(
                                                            'clinical_values cv',
                                                            'cv.parameter_id = p.id AND cv.record_id = '.$clinical_records->id,
                                                            'left'
                                                        )
                                                        ->order_by('p.id','ASC')
                                                        ->get()
                                                        ->result_array();

                                        foreach($records as $record):
                                    ?>
                                    <!-- Altura -->
                                    <div class="card-body border-top-xs d-flex pt-3">
                                        <i class="<?= $record['icon']; ?> text-grey-500 me-3 font-lg"></i>
                                        <h4 class="fw-700 text-grey-900 font-xssss mt-0">
                                            <?= $record['name']; ?>
                                            <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                                                <?= $record['value']; ?> <?= $record['unit']; ?>
                                            </span>
                                        </h4>
                                    </div>
                                    <?php endforeach; ?>            
                                   <?php else:  ?>
                                    <div class="card border-0 text-center d-block p-3">

                                        <img src="https://uicobe.com/html/sociala/images/bg-43.png" alt="icon" class="w200 mb-4 ms-auto me-auto pt-md-5">
                                        <p class="text-grey-500 font-xsss">Aun no has registrado ningun parametro, haz click aca para el primer registro.</p>
                                        <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/clinical_records_form/<?= $user['user_id']; ?>')" class="p-3 w175 bg-current text-white d-inline-block text-center fw-600 font-xssss rounded-3 text-uppercase ls-3">Parámetros Clínicos</a>
                                    </div>
                                    <?php endif ?>
                                </div>

                                <?php 
                                    
                                $this->db->limit(3);
                                $this->db->where('patient_id', $user['user_id']);
                                $this->db->where('status', 0);
                                $query = $this->db->get('tasks');
                                $tasks = $query->result();
                                if(count($tasks) > 0):
                                 
                            ?>
                            <div class="card w-100 shadow-xss rounded-xxl border-0 mb-3 ">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Recordatorios</h4>
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
                                    <div class="col-12">
                                        <div id="consultationContainer"></div>
                                        
                                        <div  id="loader" class="card w-100 text-center shadow-xss rounded-xxl border-0 p-4 mb-3 mt-3 ">
                                            <div class="snippet mt-2 ms-auto me-auto" data-title=".dot-typing">
                                                <div class="stage">
                                                    <div class="dot-typing"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                        </div>
                      </div>
                        <div class="tab-pane fade p-3" id="navtabsAppointments" role="tabpanel">
                        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body d-flex align-items-center  p-4">
                                <h4 class="fw-700 mb-0 font-xssss text-grey-900">Citas</h4>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                <div class="table-responsive">
                                   <table class="table table-striped text-nowrap" id="sale_data">
                                        <thead>
                                            <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                <th class="border-0 py-2">Fecha</th>
                                                <th class="border-0 py-2">Paciente</th>
                                                <th class="border-0 py-2">Servicios</th>
                                                <th class="border-0 py-2">Nombre de la venta</th>
                                                <th class="border-0 py-2">Equipo</th>
                                                <th class="border-0 py-2">Fecha de la venta</th>
                                                <th class="border-0 py-2">valor comisionable</th>
                                                <th class="border-0 py-2">Estado</th>
                                                <th class="border-0 py-2">Accion</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                      </div>
                        <div class="tab-pane fade" id="tabBackgrounds">

                            <div class="card border-0 shadow-xss rounded-xxl">
                        
                                <div class="card-body d-flex justify-content-between align-items-center">
                        
                                    <div>
                                        <h4 class="fw-700 mb-1">Antecedentes Médicos</h4>
                                        <p class="text-muted mb-0">
                                            Historial y antecedentes registrados del paciente.
                                        </p>
                                    </div>
                        
                                    <a href="<?= base_url('portal/patient_backgrounds/'.$user['user_id']); ?>"
                                        class="p-3  bg-current text-white d-inline-block text-center fw-600 font-xssss rounded-3 text-uppercase ls-3m">
                                        <i class="feather-edit me-2"></i>
                                        Editar Antecedentes
                                    </a>
                        
                                </div>
                        
                            </div>
                        
                            <div class="row mt-3">
                        
                                <?php if(empty($background_types)): ?>
                        
                                    <div class="col-12">
                                        <div class="alert alert-warning">
                                            No existen tipos de antecedentes configurados.
                                        </div>
                                    </div>
                        
                                <?php else: ?>
                        
                                    <?php foreach($background_types as $field): ?>
                        
                                        <?php
                                            $value = '';
                        
                                            if(isset($values[$field['id']]))
                                            {
                                                $value = $values[$field['id']];
                                            }
                                        ?>
                        
                                        <div class="col-lg-6 mb-3">
                        
                                            <div class="card border-0 shadow-sm rounded-xl h-100">
                        
                                                <div class="card-body">
                        
                                                    <h5 class="fw-700 mb-3">
                                                        <?= $field['name']; ?>
                                                    </h5>
                        
                                                    <?php if(trim($value) != ''): ?>
                        
                                                        <div class="text-grey-700">
                                                            <?= nl2br(htmlspecialchars($value)); ?>
                                                        </div>
                        
                                                    <?php else: ?>
                        
                                                        <div class="text-muted">
                                                            Sin información registrada.
                                                        </div>
                        
                                                    <?php endif; ?>
                        
                                                </div>
                        
                                            </div>
                        
                                        </div>
                        
                                    <?php endforeach; ?>
                        
                                <?php endif; ?>
                        
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
    <script>

    
    let offset = 0;
    let loading = false;
    let patient_id = <?= $user_id; ?>;
    
    function loadMoreConsultations() {
    
        if (loading) return;
        loading = true;
    
        $("#loader").show();
    
        $.ajax({
            url: "<?= base_url('portal/load_more_consultations'); ?>",
            type: "POST",
            dataType: "json",
            data: {
                offset: offset,
                patient_id: patient_id
            },
            success: function(res) {
    
                $("#loader").hide();
                console.log(res);
                if (res && res.html && res.html.trim().length > 0) {
    
                    $("#consultationContainer").append(res.html);
    
                    offset += 5;
    
                    if (!res.has_more) {
                        $(window).off("scroll");
                    }
    
                } else {
    
                    $(window).off("scroll");
    
                }
    
                loading = false;
            },
            error: function(xhr) {
    
                console.log('ERROR AJAX:', xhr.responseText);
    
                $("#loader").hide();
    
                loading = false;
            }
        });
    }
    
    // Primer lote
    $(function() {
        loadMoreConsultations();
    });
    
    // Scroll infinito
    $(window).on("scroll", function () {
    
        if (
            $(window).scrollTop() + $(window).height() >=
            $(document).height() - 200
        ) {
            loadMoreConsultations();
        }
    
    });
  

        function goToTab(tabId) {
            let tab = document.querySelector('[href="' + tabId + '"]');
            if (tab) {
                let bsTab = new bootstrap.Tab(tab);
                bsTab.show();
            }
        }
    </script>
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