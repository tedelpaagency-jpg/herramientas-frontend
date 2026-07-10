<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<?php 
    if(isset($param2))
    $row = $this->db->get_where('visa_ref',array('id'=>$param2))->row();
?>

<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" aria-label="Close" class="d-inline-block mt-2"><i class="ti-arrow-left font-sm text-white"></i></a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel"><?php echo isset($row) ? 'Actualizar solicitud de visa' : 'Nueva solicitud de visa'; ?></h4>    
    </div>
    
</div>
 <form method="post" action="<?php echo isset($row) ?  base_url('portal/visas_ref/update/'.$row->visa_id) :  base_url('portal/visas_ref/add'); ?>" enctype="multipart/form-data">
<div class="modal-body row">
    <div class="col-md-12">
        <div class="form-group">
            <label for="name">Nombres</label>
            <input type="text" class="form-control" id="name" name="name" value="<?php echo isset($row) ? $row->name : ''; ?>">
        </div>
    </div>
</div>
    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary text-center  text-white"><?php echo isset($row) ? 'Actualizar' : 'Agregar'; ?></button>
    </div>
</form>
