<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" aria-label="Close" class="d-inline-block mt-2"><i class="ti-arrow-left font-sm text-white"></i></a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel">Agregar contracto</h4>    
    </div>
    
</div>
<?php $row = $this->db->get_where('email_templates',['id'=>$param2])->row_array(); ?>
<form action="<?php echo base_url(); ?>portal/email_templates/save" method="post" id="idForm" enctype="multipart/form-data">
<div class="modal-body row">
    <input type="hidden" name="id" value="<?= $param2; ?>" />
    <div class="col-sm-12 col-md-12 mb-3">
        <div class="mb-3">
            <label class="form-label" for="exampleFormControlSelect9">Nombre</label><span style="color:red">*</span>
            <input class="form-control" type="text" name="name" value="<?php echo isset($row) ? $row['name'] : ''; ?>" required />
        </div>
    </div>
    <div class="col-sm-12 col-md-12 mb-3">
        <div class="mb-3">
            <label class="form-label" for="exampleFormControlSelect9">Plantilla php</label><span style="color:red">*</span>
            <input class="form-control" type="text" name="plantilla" value="<?php echo isset($row) ? $row['name'] : ''; ?>" required />
        </div>
    </div>
    <div class="col-sm-12 col-md-12 mb-3">
        <div class="mb-3">
            <label class="form-label" for="exampleFormControlSelect9">Archivos para adjuntar</label><span style="color:red">*</span><br>
            <input type="file" name="files[]" placeholder="archivo1.pdf"><br><br>
            <input type="file" name="files[]" placeholder="archivo2.mp4"><br>
        </div>
    </div>
</div>
    <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary text-center  text-white"><?php echo isset($row) ? 'Actualizar' : 'Agregar'; ?></button>
    </div>
</form>
