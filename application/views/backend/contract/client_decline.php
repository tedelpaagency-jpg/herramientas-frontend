
<div class="modal-header">
    <h5 class="modal-title" id="exampleModalLabel">Firmar</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
 
<div class="modal-body row">
        <div class="col-sm-12 ">
            <div class="form-group">
                <label>Cuentanos porqué declinas este contrato?</label>
                <textarea name="saveDecline" row="5" id="saveDecline"></textarea>
            </div>
        </div>
    </div>
<div class="modal-footer">
    <button type="submit" class="btn btn-primary" id="save">Guardar</button>
</div>

<script>
$(document).ready(function() {

    $('#save').on('click', function() {
        
             if (signaturePad.isEmpty()) {
                    alert("El motivo no puede quedar vacío.");
                } else {
                    $.ajax({
                            url: '<?= base_url(); ?>contract/saveDecline/<?= $param2; ?>', // Cambia esto por tu URL de servidor
                            type: 'POST',
                            data: {'decline':$('#saveDecline').val() },
                            success: function(response) {
                                location.reload();
                            },
                            error: function(xhr, status, error) {
                                console.error('Error al guardar la firma:', error);
                            }
                        });
                }
    });
});
</script>
