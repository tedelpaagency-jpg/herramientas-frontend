<div class="cw-stack" id="clinic-list">

    <?php if (!empty($users)): ?>
        <?php foreach ($users as $user): ?>
            <div class="cw-item-card">
                <div class="cw-card-left">
                    <div class="cw-card-avatar">
                        <img style="width:100%"
                             src="<?= $this->crud_model->getPhoto('user', $user->user_id); ?>">
                    </div>

                    <div class="cw-card-info">
                        <h3><?= $user->name . ' ' . $user->last_name; ?></h3>
                        <span class="ref-id">
                            <i data-lucide="cake" size="10"></i>
                            <?= $this->crud_model->calcularEdad($user->birthday); ?>
                        </span>
                    </div>
                </div>

                <div class="cw-card-center">
                    <div class="cw-bubble cw-bubble-labs">
                        <i data-lucide="microscope" size="16"></i> 12 Laboratorios
                    </div>
                    <div class="cw-bubble cw-bubble-meds">
                        <i data-lucide="users" size="16"></i> 45 Médicos
                    </div>
                    <div class="cw-bubble cw-bubble-visitor">
                        <i data-lucide="user-check" size="16"></i> Lcdo. Marcos Silva
                    </div>
                    <div class="cw-bubble cw-bubble-city">
                        <i data-lucide="map-pin" size="16"></i> Guayaquil
                    </div>
                </div>

                <div class="cw-card-right">
                    <div class="cw-meta-date">
                        <span class="cw-meta-label">Ultima consulta</span>
                        <span class="cw-meta-val">Sin consultas </span>
                    </div>
                    <div class="cw-action-wrap">
                        
                        <a href="<?= base_url(); ?>portal/patient_profile/<?= base64_encode($user->user_id); ?>"
                            class="cw-btn-circle cw-btn-profile" title="Ver Perfil">
                            <i data-lucide="user" size="20"></i>
                        </a>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <p style="padding:15px;">Sin resultados</p>
    <?php endif; ?>

</div>

<div class="cw-pagination">
    <?= $links ?>
</div>