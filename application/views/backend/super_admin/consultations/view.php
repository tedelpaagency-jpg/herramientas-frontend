<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="cw-main-content pt-3">

            <div class="card shadow-xss rounded-xxl border-0 mb-3">

                <div class="card-body p-4 w-100 bg-current border-0 d-flex justify-content-between align-items-center rounded-3">
                    <div class="d-flex align-items-center">
                        <i data-lucide="stethoscope" class="text-white"></i>

                        <h4 class="font-xs text-white fw-600 ms-3 mb-0">
                            Consulta Médica #<?= $consultation['id']; ?>
                        </h4>
                    </div>

                    <div>
                        <a href="<?= base_url('portal/consultations/edit/'.$consultation['id']); ?>"
                            class="btn btn-light btn-sm">
                            <i data-lucide="square-pen" size="16"></i>
                            Editar
                        </a>

                        <a href="<?= base_url('portal/consultations'); ?>"
                            class="btn btn-dark btn-sm">
                            <i data-lucide="arrow-left" size="16"></i>
                            Regresar
                        </a>
                    </div>
                </div>

                <div class="card-body">

                    <!-- PACIENTE -->

                    <div class="card border-0 bg-light mb-4">
                        <div class="card-body">

                            <div class="row">

                                <div class="col-md-2 text-center">

                                    <img src="<?= $this->crud_model->getPhoto('user',$consultation['patient_id']); ?>"
                                        class="rounded-circle"
                                        style="width:100px;height:100px;object-fit:cover;">

                                </div>

                                <div class="col-md-10">

                                    <h3 class="fw-700">
                                        <?= $consultation['patient_name']; ?>
                                    </h3>

                                    <div class="row">

                                        <div class="col-md-4">
                                            <strong>Fecha Consulta</strong><br>
                                            <?= date('d/m/Y H:i', strtotime($consultation['consultation_date'])); ?>
                                        </div>

                                        <div class="col-md-4">
                                            <strong>Médico</strong><br>
                                            <?= $consultation['doctor_name']; ?>
                                        </div>

                                        <div class="col-md-4">
                                            <strong>Próximo Control</strong><br>

                                            <?= !empty($consultation['follow_up_date'])
                                                ? date('d/m/Y', strtotime($consultation['follow_up_date']))
                                                : 'No definido'; ?>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>

                    <!-- SIGNOS VITALES -->

                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">
                                Signos Vitales
                            </h5>
                        </div>

                        <div class="card-body">

                            <div class="row text-center">

                                <div class="col-md-2">
                                    <h4><?= $consultation['weight']; ?></h4>
                                    <small>Peso (Kg)</small>
                                </div>

                                <div class="col-md-2">
                                    <h4><?= $consultation['height']; ?></h4>
                                    <small>Altura (cm)</small>
                                </div>

                                <div class="col-md-2">
                                    <h4><?= $consultation['temperature']; ?></h4>
                                    <small>Temperatura</small>
                                </div>

                                <div class="col-md-2">
                                    <h4><?= $consultation['heart_rate']; ?></h4>
                                    <small>F. Cardíaca</small>
                                </div>

                                <div class="col-md-2">
                                    <h4><?= $consultation['systolic_pressure']; ?></h4>
                                    <small>Presión Alta</small>
                                </div>

                                <div class="col-md-2">
                                    <h4><?= $consultation['diastolic_pressure']; ?></h4>
                                    <small>Presión Baja</small>
                                </div>

                            </div>

                        </div>
                    </div>

                    <!-- MOTIVO DE CONSULTA -->

                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">
                                Motivo de Consulta
                            </h5>
                        </div>

                        <div class="card-body">
                            <?= nl2br($consultation['chief_complaint']); ?>
                        </div>
                    </div>

                    <!-- ENFERMEDAD ACTUAL -->

                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">
                                Enfermedad Actual
                            </h5>
                        </div>

                        <div class="card-body">
                            <?= nl2br($consultation['history_present_illness']); ?>
                        </div>
                    </div>

                    <!-- EXAMEN FÍSICO -->

                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">
                                Examen Físico
                            </h5>
                        </div>

                        <div class="card-body">
                            <?= nl2br($consultation['physical_examination']); ?>
                        </div>
                    </div>

                    <!-- DIAGNÓSTICO -->

                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">
                                Diagnóstico
                            </h5>
                        </div>

                        <div class="card-body">
                            <?= nl2br($consultation['diagnosis']); ?>
                        </div>
                    </div>

                    <!-- TRATAMIENTO -->

                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">
                                Tratamiento
                            </h5>
                        </div>

                        <div class="card-body">
                            <?= nl2br($consultation['treatment']); ?>
                        </div>
                    </div>

                    <!-- OBSERVACIONES -->

                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">
                                Observaciones
                            </h5>
                        </div>

                        <div class="card-body">
                            <?= nl2br($consultation['notes']); ?>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    lucide.createIcons();
});
</script>