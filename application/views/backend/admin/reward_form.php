<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

<?php 
if(isset($param2))
    $row = $this->db->get_where('rewards', ['id' => $param2])->row();
?>

<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" class="d-inline-block mt-2">
            <i class="ti-arrow-left font-sm text-white"></i>
        </a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2">
            <?php echo isset($row) ? 'Editar Premio' : 'Nuevo Premio'; ?>
        </h4>
    </div>
</div>

<form method="post" action="<?php echo base_url('portal/rewards/saveReward/'.base64_encode($row->id)); ?>">

    <div class="modal-body row">
        <div class="col-md-12">
            <label>Nombre</label>
            <input type="text" class="form-control" name="name"
                value="<?php echo isset($row) ? $row->name : ''; ?>">
        </div>
        <div class="col-md-12 mt-2">
            <label>Descripción</label>
            <textarea class="form-control" name="description"><?php echo isset($row) ? $row->description : ''; ?></textarea>
        </div>
    </div>

    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary text-white">
            <?php echo isset($row) ? 'Actualizar' : 'Agregar'; ?>
        </button>
    </div>

</form>
