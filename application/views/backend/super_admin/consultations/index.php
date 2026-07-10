<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="cw-main-content pt-3">

            <!-- HEADER -->
            <header class="cw-directory-header">
                <div class="cw-header-left d-flex align-items-center gap-3">
                    <div class="cw-brand-icon">
                        <i data-lucide="stethoscope" size="24"></i>
                    </div>
                    <h1>Consultations</h1>
                </div>

                <div class="cw-header-right">
                    <div class="cw-search-pill-container">
                        <i data-lucide="search"
                            class="cw-search-pill-icon"
                            size="18"></i>

                        <input type="text"
                            id="main-search"
                            class="cw-search-pill-input"
                            placeholder="Search patient or diagnosis...">
                    </div>

                    <a href="<?= base_url('portal/consultations/add'); ?>"
                        class="cw-btn-new">

                        <i data-lucide="plus" size="20"></i>
                        New Consultation
                    </a>
                </div>
            </header>

            <!-- LIST -->
            <div class="cw-stack">
                
                <?php foreach($consultations as $row): ?>

                <div class="cw-item-card">

                    <!-- LEFT -->
                    <div class="cw-card-left">

                        <div class="cw-card-avatar">
                            <img
                                src="<?= $this->crud_model->getPhoto('user',$row['patient_id']); ?>"
                                style="width:100%;"
                                alt="">
                        </div>

                        <div class="cw-card-info">

                            <h3>
                                <?= $row['patient_name']; ?>
                            </h3>

                            <span class="ref-id">
                                <i data-lucide="calendar" size="12"></i>

                                <?= date(
                                    'd/m/Y H:i',
                                    strtotime($row['consultation_date'])
                                ); ?>
                            </span>

                        </div>

                    </div>

                    <!-- CENTER -->
                    <div class="cw-card-center">

                        <div class="cw-bubble cw-bubble-labs">

                            <i data-lucide="message-square" size="16"></i>

                            <?= character_limiter(
                                strip_tags($row['chief_complaint']),
                                40
                            ); ?>

                        </div>
                        
                        <?php if(!empty($row['diagnosis'])): ?>
                        <div class="cw-bubble cw-bubble-meds">

                            <i data-lucide="clipboard-check" size="16"></i>

                            <?= character_limiter(
                                strip_tags($row['diagnosis']),
                                40
                            ); ?>

                        </div>
                        <?php endif; ?>
                        
                        <?php if(!empty($row['follow_up_date'])): ?>

                        <div class="cw-bubble cw-bubble-city">

                            <i data-lucide="calendar-days" size="16"></i>

                            Follow-up:
                            <?= date(
                                'd/m/Y',
                                strtotime($row['follow_up_date'])
                            ); ?>

                        </div>

                        <?php endif; ?>

                    </div>

                    <!-- RIGHT -->
                    <div class="cw-card-right">

                        <div class="cw-meta-date">

                            <span class="cw-meta-label">
                                Doctor
                            </span>

                            <span class="cw-meta-val">
                                <?= $row['doctor_name']; ?>
                            </span>

                        </div>

                        <div class="cw-action-wrap">

                            <a href="<?= base_url('portal/consultations/view/'.$row['id']); ?>"
                                class="cw-btn-circle cw-btn-history"
                                title="View">

                                <i data-lucide="eye" size="20"></i>

                            </a>

                            <a href="<?= base_url('portal/consultations/edit/'.$row['id']); ?>"
                                class="cw-btn-circle cw-btn-profile"
                                title="Edit">

                                <i data-lucide="square-pen" size="20"></i>

                            </a>
                            <a href="<?= base_url('portal/consultations/delete/'.$row['id']); ?>"
                               class="cw-btn-circle text-danger"
                               onclick="return confirm('¿Desea eliminar esta consulta?');">
                                <i data-lucide="trash-2" size="18"></i>
                            </a>

                        </div>

                    </div>

                </div>

                <?php endforeach; ?>

            </div>

        </div>
    </div>
</div>
<script>
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Efecto de agrupación profesional
    const cards = document.querySelectorAll('.cw-item-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('show');
        }, index * 100);
    });


});
</script>