<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

<?php 
$ar_id = $param2;
$agency_id = $param3;

$row = NULL;
if(isset($ar_id) && $ar_id != 0 && $ar_id != '0') {
    $row = $this->crud_model->getAgencyReward($ar_id);
    if ($row) {
        $agency_id = $row->agency_id;
    }
}
?>

<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" class="d-inline-block mt-2">
            <i class="ti-arrow-left font-sm text-white"></i>
        </a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2">
            <?php echo isset($row) ? 'Editar Premio de Clínica' : 'Asignar Premio a Clínica'; ?>
        </h4>
    </div>
</div>

<form method="post" action="<?php echo base_url('portal/agency_rewards/save/'. ($row ? $row->id : '0')); ?>">
    <input type="hidden" name="agency_id" value="<?= $agency_id; ?>">

    <div class="modal-body row">
        <div class="col-md-12">
            <label class="form-label">Premio</label>
            <select class="form-select select2" name="reward_id" required style="width: 100%">
                <option value="">Seleccionar Premio</option>
                <?php 
                    $rewards = $this->crud_model->getRewardsActive();
                    foreach ($rewards as $r):
                ?>
                    <option value="<?= $r->id; ?>" <?= (isset($row) && $row->reward_id == $r->id) ? 'selected' : ''; ?>>
                        <?= htmlspecialchars($r->name); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="col-md-12 mt-3">
            <label class="form-label">Puntos Requeridos</label>
            <input type="number" class="form-control" name="points" min="0" required
                value="<?php echo isset($row) ? $row->points : ''; ?>" placeholder="Ej. 100">
        </div>
    </div>

    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary text-white">
            <?php echo isset($row) ? 'Actualizar' : 'Asignar'; ?>
        </button>
    </div>
</form>
