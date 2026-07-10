<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" aria-label="Close" class="d-inline-block mt-2"><i class="ti-arrow-left font-sm text-white"></i></a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel">Agregar contracto</h4>    
    </div>
    
</div>
<form action="<?php echo base_url(); ?>portal/lexvault/add" method="post" id="idForm">
<div class="modal-body row">
    <div class="col-sm-12 col-md-12 ">
        <div class="mb-3">
            <label class="form-label" for="exampleFormControlSelect9">Plantilla</label><span style="color:red">*</span>
            <select class="form-select js-example-basic-single" required name="lexvault_template_id" >
                <option value="">Seleccionar</option>
                <?php  $managers = $this->db->get('lexvault_template')->result_array();
                    foreach ($managers as $mg): ?>
                <option value="<?php echo $mg['lexvault_template_id'] ?>"><?php echo $mg['name']; ?></option>
                <?php endforeach;  ?>
            </select>
        </div>
    </div>
    <div class="col-sm-12 col-md-12 mb-3">
        <div class="mb-3">
            <label class="form-label" for="exampleFormControlSelect9">Nombre</label><span style="color:red">*</span>
            <input class="form-control" type="text" name="name" required />
        </div>
    </div>
    <div class="col-sm-12 col-md-12 mb-3">
        <div class="mb-3">
            <label class="form-label" for="exampleFormControlSelect9">Descripción</label><span style="color:red">*</span>
            <textarea class="form-control"  name="description" required ></textarea>
        </div>
    </div>
</div>
    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary text-center  text-white"><?php echo isset($row) ? 'Actualizar' : 'Agregar'; ?></button>
    </div>
</form>
