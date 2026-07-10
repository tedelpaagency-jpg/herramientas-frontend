<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="cw-main-content pt-3">

            <header class="cw-directory-header">
                <div class="cw-header-left d-flex align-items-center gap-3">
                    <div class="cw-brand-icon">
                        <i data-lucide="users" size="24"></i>
                    </div>
                    <h1>Pacientes</h1>
                </div>

                <div class="cw-header-right">
                    <div class="cw-search-pill-container">
                        <i data-lucide="search" class="cw-search-pill-icon" size="18"></i>
                        <input type="text" id="search" class="cw-search-pill-input"
                               placeholder="Buscar paciente...">
                    </div>

                    <button class="cw-btn-new"
                        onclick="showAjaxModal('<?= base_url(); ?>modal/popup/<?= urlencode('patients/patient_form'); ?>/0/<?= $rol_id; ?>')">
                        <i data-lucide="plus" size="20"></i>
                        Nueva Paciente
                    </button>
                </div>
            </header>

            <div id="list-container">
                <?php $this->load->view('backend/super_admin/patients/list', $users); ?>
            </div>

        </div>
    </div>
</div>

<script>


document.addEventListener('DOMContentLoaded', function () {

    lucide.createIcons();

    loadPage(1);

    initSearch('search', function (value) {
        loadPage(1, 'patients');
    });

});


</script>