   <div aria-hidden="true" aria-labelledby="ticketModalLabel" class="modal fade" id="ticketModal" >
         <div class="modal-dialog modal-dialog-centered">
             <div class="modal-content">
                 <div class="modal-header bg-primary">
                     <h1 class="modal-title fs-5 text-white" id="ticketModalLabel">Agendar Tareas</h1>
                     <button aria-label="Close" class="btn-close m-0" data-bs-dismiss="modal" type="button"></button>
                 </div>
                  <form action="<?= base_url(); ?>portal/tasks/scheduleTasks" method="POST" >
                 <div class="modal-body">
                      <div class="ticket-form">
                        <div class="row">
                    
                          <div class="col-12">
                            <div class="mb-3">
                              <label class="form-label">Nombre de la tarea</label>
                              <input class="form-control" name="task_name" value="" required="" />
                            </div>
                          </div>
                         <div class="col-12">
                             <div class="mb-3">
                                 <label class="form-label">Cliente</label>
                                 <select class="form-select select2" name="patient_id" onchange="getNewPatient(this.value)" style="width:100%">
                                     <option value="">Seleccionar</option>
                                     <option value="New">Nuevo Cliente</option>
                                     <?php $patients = $this->db->where('agency_id',$this->session->userdata('current_agency'))->where('status',1)->get('client')->result(); ?>
                                     <?php foreach ($patients as $patient): ?>
                                     <option value="<?= $patient->client_id; ?>"><?= $patient->name.' '.$patient->last_name.'('.$patient->phone.')'; ?></option>
                                     <?php endforeach; ?>
                                 </select>
                             </div>
                         </div>
                          <!-- Campos cliente (como los tenías) -->
                          <div class="col-md-12 row" id="newPatient" style="display: none;">
                            <div class="col-md-12">
                              <div class="mb-3">
                                <label class="form-label" for="priority">Nombre </label>
                                <input class="form-control" placeholder="Nombres" type="text" name="name">
                              </div>
                            </div>
                            <div class="col-md-12">
                              <div class="mb-3">
                                <label class="form-label" for="priority">Apellido </label>
                                <input class="form-control" placeholder="Apellidos" type="text" name="last_name">
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="mb-3">
                                <label class="form-label" for="priority">Correo</label>
                                <input class="form-control" placeholder="Correo" type="text" name="email">
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="mb-3">
                                <label class="form-label" for="priority">Teléfono</label>
                                <input class="form-control" placeholder="phone" type="text" name="phone">
                              </div>
                            </div>
                          </div>
                    
                          <!-- Fecha/Hora/Notas (como los tenías) -->
                          <div class="col-md-6">
                            <div class="mb-3">
                              <label class="form-label">Fecha</label>
                              <input class="form-control" id="datename" name="date" type="date" value="<?= date('Y-m-d'); ?>">
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="mb-3">
                              <label class="form-label">Hora</label>
                              <input class="form-control" name="time" id="duename" type="time" value="<?= date('H:i'); ?>">
                            </div>
                          </div>
                          <div class="col-md-12">
                            <div class="mb-3">
                              <label class="form-label">Mensaje</label>
                              <textarea class="form-control" name="notes" id="duename" rows="3"></textarea>
                            </div>
                          </div>
                    
                          <!-- ⚡ Recordatorio -->
                          <div class="col-md-12">
                            <div class="mb-3 form-check">
                              <input type="checkbox" class="form-check-input" id="reminderToggle" name="reminder" value="1">
                              <label class="form-check-label" for="reminderToggle">Quiero recordatorio</label>
                            </div>
                          </div>
                          <div class="col-md-12" id="reminderBlock" style="display:none;">
                            <div class="mb-3">
                              <label class="form-label">¿Cuándo recordar?</label>
                              <select class="form-select" id="reminderOffset" name="reminder_offset" disabled>
                                <option value="">Seleccionar…</option>
                                <optgroup label="Horas antes">
                                  <option value="-1 hours">1 hora antes</option>
                                  <option value="-2 hours">2 horas antes</option>
                                  <option value="-3 hours">3 horas antes</option>
                                </optgroup>
                                <optgroup label="Días antes">
                                  <option value="-1 days">1 día antes</option>
                                  <option value="-2 days">2 días antes</option>
                                  <option value="-3 days">3 días antes</option>
                                </optgroup>
                              </select>
                            </div>
                          </div>
                    
                        </div>
                      </div>
                    </div>

                 <div class="modal-footer">
                     <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Cerrar
                     </button>
                     <button class="btn btn-primary" id="ticketkey" type="submit" >Agendar
                     </button>
                 </div>
                 </form>
             </div>
         </div>
     </div>

<!-- Modal Resultado -->
<div class="modal top side  fade" id="resultadoModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-4">
            <h3 class="modal-title">¡FELICITACIONES!</h3>
            <div class="text-center my-3">
                 <i class="fas fa-trophy fa-4x text-warning"></i>
            </div>
            <p>Has ganado:</p>
            <div class="premio-grande" id="premio-ganado">PREMIO</div>
            <a href="<?= base_url(); ?>portal/gifts" class="btn btn-ziigo mt-3" data-bs-dismiss="modal">RECLAMAR PREMIO</a>
        </div>
    </div>
</div>

<!-- Modal -->
<div class="modal top side  fade" id="modalAddStorie" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-lg modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-current">
                <div class="border-0 d-flex">
                    <a type="button" data-bs-dismiss="modal" aria-label="Close" class="d-inline-block mt-2"><i class="ti-arrow-left font-sm text-white"></i></a>
                    <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel">Agregar Story</h4>    
                </div>
            </div>
             <form method="post" action="<?= base_url('portal/feed/crear_post'); ?>" method="post" enctype="multipart/form-data">
                <input type="hidden" value="story" name="type" />
                <div class="modal-body row">
                    <div class="card-body p-0 d-flex">
                        <figure class="avatar me-3"><img src="<?= $this->crud_model->getPhoto('user',$this->session->userdata('login_user_id')); ?>" alt="image" class="shadow-sm rounded-circle w45"></figure>
                        <h4 class="fw-700 text-grey-900 font-xssss mt-1"><?= $this->crud_model->getName('user',$this->session->userdata('login_user_id')); ?> </h4>
                    </div>
                        <input type="file"
                               name="files[]"
                               id="filepond2"
                               multiple
                               data-allow-reorder="true"
                               data-max-file-size="300MB"
                               data-max-files="10">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                    <button type="submit" class="btn btn-primary text-center  text-white">Agregar Story</button>
                </div>
                </form>
            
        </div>
    </div>
</div>

<div class="modal bottom side fade" id="Modalstries" tabindex="-1" role="dialog" style=" overflow-y: auto;">
     <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content border-0 bg-transparent">
            
        </div>
    </div>
</div>
            
<script type="text/javascript">
$(document).on('shown.bs.modal', function () {
    $(document).off('focusin.modal');
});

function showAjaxModal(url) {
    $('#exampleModal .modal-content').html('<div style="text-align:center;margin-top:200px;"><img src="<?php echo base_url();?>public/assets/images/preloader.svg" /></div>');
    $('#exampleModal').modal('show', {
        backdrop: 'true'
    });
    $.ajax({
        url: url,
        success: function(response) {
            
           
            $('#exampleModal .modal-content').html(response);
        }
    });
}

function showAjaxModalStories(url) {

    $('#Modalstries .modal-content').html(
        '<div style="text-align:center;margin-top:200px;">' +
        '<img src="<?= base_url();?>public/assets/images/preloader.svg" />' +
        '</div>'
    );

    $('#Modalstries').modal('show');

    $.ajax({
        url: url,
        success: function (response) {
            $('#Modalstries .modal-content').html(response);
        }
    }).done(function () {

       
    });
}

$('#Modalstries').on('hidden.bs.modal', function () {
    $('.story-video').each(function () {
        this.pause();
        this.currentTime = 0;
    });

    $('.story-slider').trigger('destroy.owl.carousel');
});





$('#Modalstries').on('hidden.bs.modal', function () {
    // Tu función aquí
     $('#Modalstries .modal-content').html('');
});
</script>
<script type="text/javascript">
function showModal(url) {
    $('#onboardingFormModal .modal-content').html('<div style="text-align:center;margin-top:50px;"><img src="<?php echo base_url().'assets/img/Spinner-5.gif';?>" /></div>');
    $('#onboardingFormModal').modal('show', {
        backdrop: 'true'
    });
    $.ajax({
        url: url,
        success: function(response) {
            $('#onboardingFormModal .modal-content').html(response);
        }
    });
}
</script>

<script type="text/javascript">
function showModalLG(url) {
    $('#mortalidad .modal-body').html('<div style="text-align:center;margin-top:50px;"><img src="<?php echo base_url().'assets/img/Spinner-5.gif';?>" /></div>');
    $('#mortalidad').modal('show', {
        backdrop: 'true'
    });
    $.ajax({
        url: url,
        success: function(response) {
            $('#mortalidad .modal-content').html(response);
        }
    });
}
</script>


<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-body">
                <!-- contenido largo -->
            </div>
        </div>
    </div>
</div>


<div aria-hidden="true" class="onboarding-modal modal fade bd-example-modal-lg animated " id="mortalidad" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-centered modal-lg" role="document">
        <div class="modal-content text-center" style="margin-top:50px;">
            
        </div>
    </div>
</div>


<script type="text/javascript">
function showModalTemp(url) {
    $('#temperatura .modal-body').html('<div style="text-align:center;margin-top:50px;"><img src="<?php echo base_url().'assets/img/Spinner-5.gif';?>" /></div>');
    $('#temperatura').modal('show', {
        backdrop: 'true'
    });
    $.ajax({
        url: url,
        success: function(response) {
            $('#temperatura .modal-body').html(response);
        }
    });
}
</script>

<div aria-hidden="true" class="onboarding-modal modal fade bd-example-modal-lg animated " id="temperatura" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-centered modal-lg" role="document">
        <div class="modal-content text-center" style="margin-top:50px;">
            <button aria-label="Close" class="close" data-dismiss="modal" type="button"><span class="close-label">Cerrar</span><span class="os-icon os-icon-close"></span></button>
            <div class="onboarding-content with-gradient">
                <div class="modal-body">
                    <hr>
                </div>
            </div>
        </div>
    </div>
</div>



<div aria-hidden="true" class="onboarding-modal modal fade animated " id="onboardingFormModal" role="dialog" tabindex="-1">
    <div class="modal-dialog modal-centered modal-lg" role="document">
        <button aria-label="Close" class="close" data-dismiss="modal" type="button"><span class="close-label"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg></button>

        <div class="modal-content">

        </div>
    </div>
</div>



<script type="text/javascript">
function confirm_modal(delete_url) {
    $('#modal_delete').modal('show', {
        backdrop: 'static'
    });
    document.getElementById('delete_link').setAttribute('href', delete_url);
}
</script>
<style>
.datepicker {
    z-index: 1151 !important;
}

</style>
