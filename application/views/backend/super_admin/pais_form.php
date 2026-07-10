
<?php 
    if(isset($param2))
    $user = $this->db->get_where('pais',array('id'=>$param2))->row();
?>

<form method="post" action="<?php echo  base_url('portal/pais/save')  ?>" enctype="multipart/form-data">
<div class="modal-header">
    <h5 class="modal-title" id="exampleModalLabel"><?php echo isset($user) ? 'Actualizar ' : 'Agregar '; ?></h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
 
     <input type="hidden" name="id" value="<?= $param2; ?>" >
    <div class="modal-body row" style="padding:20px;">
        <div class="col-md-12">
            <div class="form-group">
                <label for="name">Nombre</label>
                <input type="text" class="form-control" id="name" name="nombre" value="<?php echo isset($user) ? $user->nombre : ''; ?>">
            </div>
        </div>
         <div class="col-md-12">
            <div class="form-group">
                <label for="name">Extension</label>
                <textarea type="text" class="form-control" id="name" name="code" ><?php echo isset($user) ? $user->code : ''; ?></textarea
            </div>
        </div>
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    <button type="submit" class="btn btn-primary"><?php echo isset($user) ? 'Actualizar ' : 'Agregar '; ?></button>
</div>
</form>
