<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"/>

<?php 
if(isset($param2))
    $row = $this->db->get_where('agency_roulette', ['id' => $param2])->row();
?>

<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" class="d-inline-block mt-2">
            <i class="ti-arrow-left font-sm text-white"></i>
        </a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2">
            <?php echo isset($row) ? 'Editar Ruleta' : 'Nueva Ruleta'; ?>
        </h4>
    </div>
</div>

<form method="post" action="<?php echo base_url('portal/gifts/saveGift/'.base64_encode($row->id)); ?>">

    <div class="modal-body row">

        <div class="col-md-12">
             <div class="form-group mb-3">
                <label class="fw-600">Agencia</label>
                <select class="form-control" name="agency_id" required>
                    <option value="">Seleccionar agencia</option>
                    <?= $agencies = $this->db->get('agency')->result(); ?>
                    <?php foreach ($agencies as $a): ?>
                        <option value="<?= $a->id; ?>" <?= $a->id == $row->agency_id ? 'Selected':''; ?> >
                            <?= $a->name; ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <div class="col-md-12 mt-2">
             <div class="form-group mb-3">
                <label class="fw-600">Ruleta</label>
                <select class="form-control" name="roulette_id" required>
                    <option value="">Seleccionar ruleta</option>
                    <?php $roulettes = $this->db->get('roulettes')->result(); ?>
                    <?php foreach ($roulettes as $r): ?>
                        <option value="<?= $r->id; ?>" <?= $r->id == $row->roulette_id ? 'Selected':''; ?> >
                            <?= $r->title; ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>
    </div>

    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary text-white">
            <?php echo isset($row) ? 'Actualizar' : 'Agregar'; ?>
        </button>
    </div>

</form>
