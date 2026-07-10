<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="row">

            <div class="col-xl-12">

                <div class="card shadow-xss w-100 border-0 p-4 mb-3">
                    <div class="card-body p-0">
                        <h2 class="fw-700 font-md text-grey-900 mb-0">
                            Nueva Cita
                        </h2>
                    </div>
                </div>

                <div class="card shadow-xss rounded-xxl border-0 p-4">

                    <form method="post" action="<?= base_url('portal/appointments/store'); ?>">

                        <div class="row">

                            <div class="col-md-6 mb-3">
                                <label class="fw-600 mb-2">
                                    Paciente
                                </label>

                                <select name="patient_id"
                                        class="form-control select2"
                                        required>

                                    <option value="">
                                        Seleccionar paciente
                                    </option>

                                    <?php foreach($patients as $patient): ?>

                                        <option
                                            value="<?= $patient['user_id']; ?>"
                                            <?= isset($patient_id) && $patient_id == $patient['user_id'] ? 'selected' : ''; ?>>

                                            <?= $patient['name'].' '.$patient['last_name']; ?>

                                        </option>

                                    <?php endforeach; ?>

                                </select>
                            </div>

                            <div class="col-md-6 mb-3">
                                <label class="fw-600 mb-2">
                                    Doctor
                                </label>

                                <select name="doctor_id"
                                        class="form-control select2"
                                        required>

                                    <option value="">
                                        Seleccionar doctor
                                    </option>

                                    <?php foreach($doctors as $doctor): ?>

                                        <option value="<?= $doctor['user_id']; ?>">
                                            <?= $doctor['name'].' '.$doctor['last_name']; ?>
                                        </option>

                                    <?php endforeach; ?>

                                </select>
                            </div>

                            <div class="col-md-3 mb-3">
                                <label class="fw-600 mb-2">
                                    Fecha
                                </label>

                                <input type="date"
                                       name="appointment_date"
                                       class="form-control"
                                       value="<?= date('Y-m-d'); ?>"
                                       required>
                            </div>

                            <div class="col-md-3 mb-3">
                                <label class="fw-600 mb-2">
                                    Hora
                                </label>

                                <input type="time"
                                       name="appointment_time"
                                       class="form-control"
                                       required>
                            </div>

                            <div class="col-md-3 mb-3">
                                <label class="fw-600 mb-2">
                                    Duración (minutos)
                                </label>

                                <select name="duration_minutes"
                                        class="form-control">

                                    <option value="15">15 min</option>
                                    <option value="30" selected>30 min</option>
                                    <option value="45">45 min</option>
                                    <option value="60">60 min</option>

                                </select>
                            </div>

                            <div class="col-md-3 mb-3">
                                <label class="fw-600 mb-2">
                                    Estado
                                </label>

                                <select name="status"
                                        class="form-control">

                                    <option value="1" selected>
                                        Pendiente
                                    </option>

                                    <option value="2">
                                        Confirmada
                                    </option>

                                </select>
                            </div>

                            <div class="col-md-12 mb-3">
                                <label class="fw-600 mb-2">
                                    Motivo de la consulta
                                </label>

                                <textarea name="reason"
                                          rows="3"
                                          class="form-control"></textarea>
                            </div>

                            <div class="col-md-12 mb-4">
                                <label class="fw-600 mb-2">
                                    Notas internas
                                </label>

                                <textarea name="notes"
                                          rows="4"
                                          class="form-control"></textarea>
                            </div>

                            <div class="col-md-12">

                                <button type="submit"
                                        class="btn bg-success text-white fw-600">

                                    <i class="feather-save me-2"></i>
                                    Guardar cita

                                </button>

                                <a href="<?= base_url('portal/appointments'); ?>"
                                   class="btn bg-light text-dark ms-2">

                                    Cancelar

                                </a>

                            </div>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    </div>
</div>

<script>
$(document).ready(function() {

    $('.select2').select2({
        width: '100%'
    });

});
</script>