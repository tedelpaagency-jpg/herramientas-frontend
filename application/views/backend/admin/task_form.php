<?php $task = $this->db->get_where('tasks', ['id' => $param2])->row(); ?>
<form action="<?= base_url(); ?>portal/tasks/scheduleTasks" method="POST"  >
    <input type="hidden" value="<?php echo $param2; ?>" name="id" />
    <div class="modal-header">
        <div class="mb-3">
            <h4>Editar Tarea</h4>
        </div>
    </div>
    <div class="modal-body">
      <div class="ticket-form">
        <div class="row">
    
          <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Nombre de la tarea</label>
              <input class="form-control" name="task_name" value="<?= isset($task->name) ? $task->name : ''; ?>" required />
            </div>
          </div>
    
          <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Cliente</label>
              <select class="form-select select2" name="patient_id" onchange="getNewPatient(this.value)" style="width:100%">
                <option value="">Seleccionar</option>
                <?php $patients = $this->db->where('status',1)->where('agency_id',$this->session->userdata('current_agency'))->get('client')->result(); ?>
                <option value="New" <?= (isset($task->patient_id) && $task->patient_id=='New')?'selected':''; ?>>Nuevo Cliente</option>
                <?php foreach ($patients as $patient): ?>
                  <option value="<?= $patient->client_id; ?>" <?= (isset($task->patient_id) && $task->patient_id==$patient->client_id) ? 'selected':''; ?>>
                    <?= $patient->name.' '.$patient->last_name.'('.$patient->phone.')'; ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </div>
          </div>
    
          <div class="col-md-12 row" id="newPatient" style="<?= (isset($task->patient_id) && $task->patient_id=='New')?'display:block;':'display:none;'; ?>">
            <div class="col-md-12">
              <div class="mb-3">
                <label class="form-label">Nombre </label>
                <input class="form-control" placeholder="Nombres" type="text" name="name" value="<?= isset($task->name) ? $task->name : ''; ?>">
              </div>
            </div>
            <div class="col-md-12">
              <div class="mb-3">
                <label class="form-label">Apellido </label>
                <input class="form-control" placeholder="Apellidos" type="text" name="last_name" value="<?= isset($task->last_name) ? $task->last_name : ''; ?>">
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Correo</label>
                <input class="form-control" placeholder="Correo" type="text" name="email" value="<?= isset($task->email) ? $task->email : ''; ?>">
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Teléfono</label>
                <input class="form-control" placeholder="phone" type="text" name="phone" value="<?= isset($task->phone) ? $task->phone : ''; ?>">
              </div>
            </div>
          </div>
    
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Fecha</label>
              <input class="form-control" id="datename" name="date" type="date" value="<?= isset($task->date) ? $task->date : date('Y-m-d'); ?>">
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Hora</label>
              <input class="form-control" name="time" id="duename" type="time" value="<?= isset($task->time) ? $task->time : date('H:i'); ?>">
            </div>
          </div>
          <div class="col-md-12">
            <div class="mb-3">
              <label class="form-label">Mensaje</label>
              <textarea class="form-control" name="notes" rows="3"><?= isset($task->notes) ? $task->notes : ''; ?></textarea>
            </div>
          </div>
    
          <div class="col-md-12">
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="reminderToggle" name="reminder" value="1" <?= (isset($task->reminder) && $task->reminder==1)?'checked':''; ?>>
              <label class="form-check-label" for="reminderToggle">Quiero recordatorio</label>
            </div>
          </div>
    
          <div class="col-md-12" id="reminderBlock" style="<?= (isset($task->reminder) && $task->reminder==1)?'display:block;':'display:none;'; ?>">
            <div class="mb-3">
              <label class="form-label">¿Cuándo recordar?</label>
              <select class="form-select" id="reminderOffset" name="reminder_offset" <?= (isset($task->reminder) && $task->reminder == 1)?'':'disabled'; ?>>
                <option value="">Seleccionar…</option>
                <optgroup label="Horas antes">
                  <option value="-1 hours" <?= (isset($task->reminder_offset) && $task->reminder_offset=='-1 hours')?'selected':''; ?>>1 hora antes</option>
                  <option value="-2 hours" <?= (isset($task->reminder_offset) && $task->reminder_offset=='-2 hours')?'selected':''; ?>>2 horas antes</option>
                  <option value="-3 hours" <?= (isset($task->reminder_offset) && $task->reminder_offset=='-3 hours')?'selected':''; ?>>3 horas antes</option>
                </optgroup>
                <optgroup label="Días antes">
                  <option value="-1 days" <?= (isset($task->reminder_offset) && $task->reminder_offset=='-1 days')?'selected':''; ?>>1 día antes</option>
                  <option value="-2 days" <?= (isset($task->reminder_offset) && $task->reminder_offset=='-2 days')?'selected':''; ?>>2 días antes</option>
                  <option value="-3 days" <?= (isset($task->reminder_offset) && $task->reminder_offset=='-3 days')?'selected':''; ?>>3 días antes</option>
                </optgroup>
              </select>
            </div>
          </div>
    
        </div>
      </div>
    </div>
    
    <script>
    $(function () {
      if ($.fn.select2) {
        $('#exampleModal').on('shown.bs.modal', function() {
            $('.select2').select2({
                dropdownParent: $('#exampleModal'),
                width: '100%'
            });
        });
      }
    
      $('#reminderToggle').on('change', function () {
        const enabled = $(this).is(':checked');
        $('#reminderBlock').toggle(enabled);
        $('#reminderOffset').prop('disabled', !enabled);
      });
    
      $('#patient_id').on('change', function(){
        const val = $(this).val();
        $('#newPatient').toggle(val === 'New');
      });
    });
    </script>
    <div class="modal-footer">
                     <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Cerrar
                     </button>
                     <button class="btn btn-primary" id="ticketkey" type="submit" >Actualizar
                     </button>
                 </div>
</form>

