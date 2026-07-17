<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

<?php 
$row = NULL;
if(isset($param2) && $param2 != '') {
    $row = $this->crud_model->getReward($param2);
}
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

<form method="post" action="<?php echo base_url('portal/rewards/saveReward/'. ($row ? base64_encode($row->id) : '')); ?>" enctype="multipart/form-data">

    <div class="modal-body row">
        <div class="col-md-12">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" name="name" required
                value="<?php echo isset($row) ? htmlspecialchars($row->name) : ''; ?>">
        </div>
        <div class="col-md-12 mt-2">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" name="description" required><?php echo isset($row) ? htmlspecialchars($row->description) : ''; ?></textarea>
        </div>
        <div class="col-md-12 mt-3">
            <label class="form-label">Imagen del Premio</label>
            <input type="file" name="photo" class="form-control" accept="image/*">
            <?php if (isset($row) && !empty($row->photo)): ?>
                <div class="mt-2">
                    <img src="<?php echo $this->crud_model->getPhotoReward($row->id); ?>" width="100px" style="border-radius: 8px; border: 1px solid #ccc; max-height: 100px; object-fit: cover;">
                </div>
            <?php endif; ?>
        </div>
    </div>

    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary text-white">
            <?php echo isset($row) ? 'Actualizar' : 'Agregar'; ?>
        </button>
    </div>

</form>
