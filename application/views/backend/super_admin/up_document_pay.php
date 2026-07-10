
<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" aria-label="Close" class="d-inline-block mt-2"><i class="ti-arrow-left font-sm text-white"></i></a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel"><?php echo isset($user) ? 'Actualizar usuario' : 'Agregar usuario'; ?></h4>    
    </div>
    
</div>
 <form method="post" action="<?php echo base_url('portal/travel_report/uploadFile/'.$param2); ?>" enctype="multipart/form-data">
     <input type="hidden" name="type" value="<?= $param3; ?>">
<div class="modal-body row">
        
         <div class="col-md-12">
            <div class="form-group">
                <!-- Formulario de Subida de Archivos -->
                <div class="custom-file-container" data-upload-id="myUniqueUploadId">
                    <label>Seleccionar <a href="javascript:void(0)" class="custom-file-container__image-clear" title="Clear Image">x</a></label>
                    <label class="custom-file-container__custom-file">
                        <input type="file" class="custom-file-container__custom-file__custom-file-input" accept="" name="file" required>
                        <input type="hidden" name="MAX_FILE_SIZE" value="10485760" />
                        <span class="custom-file-container__custom-file__custom-file-control"></span>
                    </label>
                    <div class="custom-file-container__image-preview"></div>
                </div>
            </div>
        </div>
    
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    <button type="submit" class="btn btn-primary"><?= $param3 != '2' ? 'Subir comprobante':'Subir excel'; ?></button>
</div>
</form>

<script>
  var firstUpload = new FileUploadWithPreview('myUniqueUploadId');
</script>






















