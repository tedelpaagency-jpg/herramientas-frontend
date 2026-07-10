<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="cw-main-content pt-3">

            <div class="card border-0 shadow-xss rounded-xxl mb-3">
                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-center">

                        <div>
                            <h4 class="fw-700 mb-1">
                                Antecedentes Médicos
                            </h4>

                            <p class="text-muted mb-0">
                                <?= $patient['name'].' '.$patient['last_name']; ?>
                            </p>
                        </div>

                        <a href="<?= base_url('portal/patient_profile/'.base64_encode($patient['user_id'])); ?>"
                            class="btn btn-light">
                            <i class="feather-arrow-left"></i>
                            Regresar
                        </a>

                    </div>

                </div>
            </div>

            <form method="post"
                action="<?= base_url('portal/save_patient_backgrounds/'.$patient['user_id']); ?>">

                <div class="row">

                    <?php foreach($background_types as $field): ?>

                        <?php
                            $value = '';

                            if(isset($values[$field['id']]))
                            {
                                $value = $values[$field['id']];
                            }
                        ?>

                        <div class="col-lg-12 mb-3">

                            <div class="card border-0 shadow-sm rounded-xl h-100">

                                <div class="card-body">

                                    <label class="form-label fw-600">
                                        <?= $field['name']; ?>
                                    </label>

                                    <?php if($field['field_type'] == 'textarea'): ?>

                                        <textarea
                                            name="background_<?= $field['id']; ?>"
                                            class="form-control"
                                            rows="5"
                                            style="    height: 150px;line-height: normal;"
                                            ><?= html_escape($value); ?></textarea>

                                    <?php elseif($field['field_type'] == 'text'): ?>

                                        <input
                                            type="text"
                                            name="background_<?= $field['id']; ?>"
                                            class="form-control"
                                            value="<?= html_escape($value); ?>">

                                    <?php elseif($field['field_type'] == 'number'): ?>

                                        <input
                                            type="number"
                                            name="background_<?= $field['id']; ?>"
                                            class="form-control"
                                            value="<?= html_escape($value); ?>">

                                    <?php elseif($field['field_type'] == 'date'): ?>

                                        <input
                                            type="date"
                                            name="background_<?= $field['id']; ?>"
                                            class="form-control"
                                            value="<?= html_escape($value); ?>">

                                    <?php elseif($field['field_type'] == 'select'): ?>

                                        <?php
                                            $options = explode(',', $field['options']);
                                        ?>

                                        <select
                                            name="background_<?= $field['id']; ?>"
                                            class="form-control">

                                            <option value="">
                                                Seleccionar
                                            </option>

                                            <?php foreach($options as $option): ?>

                                                <option
                                                    value="<?= trim($option); ?>"
                                                    <?= trim($option) == $value ? 'selected' : ''; ?>>
                                                    <?= trim($option); ?>
                                                </option>

                                            <?php endforeach; ?>

                                        </select>

                                    <?php else: ?>

                                        <textarea
                                            name="background_<?= $field['id']; ?>"
                                            class="form-control"
                                            rows="5"><?= html_escape($value); ?></textarea>

                                    <?php endif; ?>

                                    <?php if(!empty($field['description'])): ?>

                                        <small class="text-muted d-block mt-2">
                                            <?= $field['description']; ?>
                                        </small>

                                    <?php endif; ?>

                                </div>

                            </div>

                        </div>

                    <?php endforeach; ?>

                </div>

                <div class="card border-0 shadow-xss rounded-xxl">
                    <div class="card-body text-end">

                        <button type="submit"
                            class="btn btn-primary">
                            <i class="feather-save"></i>
                            Guardar Antecedentes
                        </button>

                    </div>
                </div>

            </form>

        </div>
    </div>
</div>