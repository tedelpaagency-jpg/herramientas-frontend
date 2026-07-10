<?php 
    if(isset($param2))
    $row = $this->db->get_where('lexvault_template',array('lexvault_template_id'=>base64_decode($param2)))->row_array();
?>
<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" aria-label="Close" class="d-inline-block mt-2"><i class="ti-arrow-left font-sm text-white"></i></a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel"><?php echo isset($user) ? 'Actualizar Plantilla' : 'Agregar Plantilla'; ?></h4>    
    </div>
    
</div>
<form action="<?php echo isset($row) ?  base_url().'portal/lexvault_templates/edit/'. $param2 :  base_url().'portal/lexvault_templates/add/'. $param2; ?>" method="post" id="idForm">
<div class="modal-body row">
    <div class="mb-3">
        <label class="col-form-label" for="recipient-name">Nombre:<span style="color:red;">*</span></label>
        <input class="form-control" type="text" name="name" value="<?php echo $row['name']; ?>">
    </div>
    
    <div class="mb-3">
        <label class="col-form-label" for="message-text">Descripción:</label>
        <textarea class="form-control" name="description"><?php echo $row['description']; ?></textarea>
    </div>
    <div class="ms-3 mb-3 form-check">
    <input 
        type="checkbox"
        class="form-check-input"
        id="is_public"
        name="is_public"
        value="1"
        <?php echo (!empty($row['is_public']) && $row['is_public'] == 1) ? 'checked' : ''; ?>
    >
    <label class="form-check-label" for="is_public">
        Plantilla pública
    </label>
</div>

</div>
    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary text-center  text-white"><?php echo isset($row) ? 'Actualizar' : 'Agregar'; ?></button>
    </div>
</form>
