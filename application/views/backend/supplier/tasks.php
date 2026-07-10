<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Tareas</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                    <a href="javascript:void(0)" id="create_ticket_key"  data-toggle="modal" class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                                </div>
                            </div>

                            <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de tareas</h4>
                                </div>
                                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                     <div class="row">
                                        <div class="col-xl-12 col-xxl-12 col-lg-12 mt-3  ">
                                            <div class="row">
                                                <div class="col-lg-3 pe-2">
                                                    <div class="card w-100 border-0 shadow-none p-4 rounded-xxl  mb-3" style="background-color: #e5f6ff;">
                                                        <div class="card-body d-flex p-0">
                                                            <i class="btn-round-lg d-inline-block me-3 bg-primary-gradiant feather-home font-md text-white"></i>
                                                            <h4 class="text-primary font-xl fw-700"><?= $this->tasks_model->countAppointments($date,'T');?><span class="fw-500 mt-0 d-block text-grey-500 font-xssss">Todas las Tareas</span></h4>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-3 pe-2 ps-2">
                                                    <div class="card w-100 border-0 shadow-none p-4 rounded-xxl  mb-3" style="background-color: #f6f3ff;">
                                                        <div class="card-body d-flex p-0">
                                                            <i class="btn-round-lg d-inline-block me-3 bg-secondary feather-lock font-md text-white"></i>
                                                            <h4 class="text-secondary font-xl fw-700"><?= $this->tasks_model->countAppointments($date, '0');?> <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">Pendientes</span></h4>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-3 pe-2 ps-2">
                                                    <div class="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3" style="background-color: #e2f6e9;">
                                                        <div class="card-body d-flex p-0">
                                                            <i class="btn-round-lg d-inline-block me-3 bg-success feather-command font-md text-white"></i>
                                                            <h4 class="text-success font-xl fw-700"><?= $this->tasks_model->countAppointments($date, 1);?> <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">Completadas</span></h4>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-3 ps-2">
                                                    <div class="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3" style="background-color: #fff0e9;">
                                                        <div class="card-body d-flex p-0">
                                                            <i class="btn-round-lg d-inline-block me-3 bg-warning feather-shopping-bag font-md text-white"></i>
                                                            <h4 class="text-warning font-xl fw-700"><?= $this->tasks_model->countAppointments($date, 2);?> <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">Canceladas</span></h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div> 
                                    </div>
                                </div>
                            </div>
                            <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                <div class="card-body">
                                     <div class="content-wrapper mt-3">
                                         <div class="tabs-content active" id="tab-1">
                                             <div class="mail-table">
                                                 <?php 
                                                 
                                                    $this->db->where('user_id',   $this->session->userdata('login_user_id'));
                                                    $this->db->where('date', $date);
                                                    $query = $this->db->get('tasks');
                                                    $tasks = $query->result();
                                                 
                                                    // Agrupar tareas por hora (de 6 AM a 6 PM)
                                                    $groupedAppointments = [];
                                                    for ($hour = 6; $hour <= 21; $hour++) {
                                                        $formattedHour = sprintf('%02d:00', $hour); // "06:00", "07:00", etc.
                                                        $groupedAppointments[$formattedHour] = [];
                                                    }
                                            
                                                    foreach ($tasks as $task) {
                                                        $hour = date('H:00', strtotime($task->time)); // Extrae la hora en formato "HH:00"
                                                        if (isset($groupedAppointments[$hour])) {
                                                            $groupedAppointments[$hour][] = $task;
                                                        }
                                                    }
                            
                                                        $tasks = $groupedAppointments;
                                                 
                                                 ?>
                                                    <?php 
                                                        foreach ($tasks as $hour => $hourAppointments): 
                                                        
                                                    ?>
                                                        <?php 
                                                            
                                                            if (!empty($hourAppointments)): 
                                                        
                                                                             
                                                        ?>
                                                        
                                                            <div class="hour-section">
                                                                <ul class="list-inline mb-4">
                                                                    <li class="list-inline-item d-block border-bottom me-0"><a href="javascript:void(0)" class="pt-2 pb-2 d-flex align-items-center"><i class="btn-round-md bg-primary-gradiant text-white feather-clock font-md me-3"></i> <h4 class="fw-600 font-xsss mb-0 mt-0"><?= $hour ?></h4></a></li>
                                                                </ul>
                                                                <?php 
                                                                    foreach ($hourAppointments as $task): 
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
                                                                <div class="card-body d-flex align-items-start pt-0 ps-4 pe-4 pb-3 overflow-visible">
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
                                                                            <?= "Agente: ".$this->crud_model->getName($task->user_type,$task->user_id); ?><br>
                                                                            <?php if($task->patient_id != '0') echo "Cliente: ".$this->crud_model->getName('client',$task->patient_id); ?>
                                                                        </span>
                                                                    </h4>
                                                                
                                                                    <div class="dropdown ms-2 align-self-start">
                                                                        <a href="#"
                                                                           class="btn-round-md bg-greylight theme-dark-bg rounded-3"
                                                                           data-bs-toggle="dropdown"
                                                                           data-bs-display="static">
                                                                            <i class="fa-solid fa-ellipsis-vertical font-xss text-grey-500"></i>
                                                                        </a>
                                                                
                                                                        <ul class="dropdown-menu dropdown-menu-end shadow">
                                                                            <li>
                                                                                <a class="dropdown-item" href="javascript:void(0)"
                                                                                   onclick="showAjaxModal('<?= base_url(); ?>modal/popup/task_form/<?= $task->id; ?>')">
                                                                                    <i class="ti ti-pencil me-2"></i> Editar
                                                                                </a>
                                                                            </li>
                                                                            <li>
                                                                                <a class="dropdown-item" href="javascript:void(0)"
                                                                                   onclick="confirm_app('<?= base_url('portal/tasks/confirmar/'.$task->id); ?>')">
                                                                                    <i class="ti ti-check me-2"></i> Completar
                                                                                </a>
                                                                            </li>
                                                                            <li>
                                                                                <a class="dropdown-item" href="javascript:void(0)"
                                                                                   onclick="cancel_app('<?= base_url('portal/tasks/cancelar/'.$task->id); ?>')">
                                                                                    <i class="ti ti-trash me-2"></i> Cancelar
                                                                                </a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                
                                                                </div>

                                                                
                                                                <?php endforeach; ?>
                                                            </div>
                                                        <?php endif; ?>
                                                    <?php endforeach; ?>
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

function confirm_app(url)
{
    Swal.fire({
        title: '¿Estás seguro?',
        text: "También se eliminará toda la información asociada..",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: '#fd4f57',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) 
        {
            location.href = url;
        }
    })
}


function cancel_app(url)
{
    Swal.fire({
        title: '¿Estás seguro?',
        text: "También se eliminará toda la información asociada..",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#9fd13b',
        cancelButtonColor: '#fd4f57',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) 
        {
            location.href = url;
        }
    })
}



      $('#create_ticket_key').on('click', function () {
    $("#ticketModal").modal("show");
  })
 function getNewPatient(type) {
     if (type == 'New') {
         $('#newPatient').show(500);
     } else {
         $('#newPatient').hide(500);
     }
 }
 
 $(function () {

   // Desactiva enforceFocus para permitir escribir en Select2 dentro del modal
$('#ticketModal').on('shown.bs.modal', function() {
    $('.select2').select2({
        dropdownParent: $('#ticketModal'),
        width: '100%'
    });
});
  // Toggle recordatorio
  $('#reminderToggle').on('change', function () {
    const enabled = $(this).is(':checked');
    $('#reminderBlock').toggle(enabled);
    $('#reminderOffset').prop('disabled', !enabled);
  });



});
function getNewPatient(type) {
     if (type == 'New') {
         $('#newPatient').show(500);
     } else {
         $('#newPatient').hide(500);
     }
 }
</script>