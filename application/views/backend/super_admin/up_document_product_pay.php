
<div class="modal-header">
    <h5 class="modal-title" id="exampleModalLabel"><?= $param3 != '2' ? 'Subir comprobante':'Subir excel'; ?></h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
 <form method="post" action="<?php echo base_url('portal/product_sales_details/uploadFile/'.$param2); ?>" enctype="multipart/form-data">
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
    <?php 
        $img = $this->db->get_where('product_sales',['id'=>$param2])->row()->foto_transferencia; 
       
        if($img == ''):
    ?>
    var upload = new FileUploadWithPreview('myUniqueUploadId');
    <?php else: ?>
    var upload = new FileUploadWithPreview('myUniqueUploadId').addImagesFromPath
(['<?= base_url(); ?>public/assets/sales/recipes/<?= $img; ?>']);;
    <?php endif;?>
</script>






















