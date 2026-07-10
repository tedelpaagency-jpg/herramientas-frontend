<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="row">
            <div class="col-xl-12">
                <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                    <div class="card-body d-flex align-items-center p-0">
                        <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Permisos (<?= $plan['name'] ?>)</h2>
                        <div class="search-form-2 ms-auto">
                            <i class="ti-search font-xss"></i>
                            <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                        </div>
                        <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                        <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url() ?>modal/popup/modal_add_plan/');"  class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                    </div>
                </div>
                 <a href="<?= base_url(); ?>portal/permissions"   class="ms-2 mt-3 mb-3 p-2 bg-info rounded-3 theme-dark-bg  text-white">Permisos</a>
                <div class="card shadow-xss rounded-xxl border-0 mb-3 mt-3">
                    <div class="card-body d-flex align-items-center p-4">
                        <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de permisos</h4>
                    </div>
                    <div class="card-body pt-0 ps-4 pe-4 pb-3">
                        <div class="row">
                            <?php foreach($all_permissions as $p): ?>
                                <div class="col-4 mb-2">
                                    <label>
                                        <input type="checkbox"
                                               class="permission-check"
                                               data-id="<?= $p['id'] ?>"
                                               <?= in_array($p['id'], $plan_permissions) ? 'checked' : '' ?> >
                                        <?= $p['name'] ?>
                                    </label>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            </div>               
        </div>
    </div>
</div>


<script>
$('.permission-check').on('change', function() {
    $.post("<?= base_url('portal/update_permissions/'.$plan['id']) ?>", {
        permission_id: $(this).data('id'),
        status: $(this).is(':checked') ? 1 : 0
    }, function(res){
        alert('Actualizado');
    }, 'json');
});

</script>