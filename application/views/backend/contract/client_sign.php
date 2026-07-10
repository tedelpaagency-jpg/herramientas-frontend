<script src="https://cdnjs.cloudflare.com/ajax/libs/signature_pad/1.3.4/signature_pad.js" integrity="sha512-j36pYCzm3upwGd6JGq6xpdthtxcUtSf5yQJSsgnqjAsXtFT84WH8NQy9vqkv4qTV9hK782TwuHUTSwo2hRF+/A==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<style>
    

     

</style>
<div class="modal-header">
    <h5 class="modal-title" id="exampleModalLabel">Firmar</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
</div>
 
<div class="modal-body row">
        <div class="col-sm-12 ">
            <div>
                <canvas id="signature-pad" width="300" height="400" style="border:1px solid #000;"></canvas>
                
            </div>
            <img id="signature-image" src="" alt="Firma guardada" style="display:none;"/>
        </div>
    </div>
<div class="modal-footer">
    <button type="button" class="btn btn-secondary" id="clear" >Limpiar</button>
    <button type="submit" class="btn btn-primary" id="save">Guardar</button>
</div>

<script>
$(document).ready(function() {
    var canvas = document.getElementById('signature-pad');
    var signaturePad = new SignaturePad(canvas);

    $('#clear').on('click', function() {
        signaturePad.clear();
    });

    $('#save').on('click', function() {
        if (signaturePad.isEmpty()) {
            alert("Por favor, dibuja tu firma.");
        } else {
            var dataURL = signaturePad.toDataURL('image/png');
             if (signaturePad.isEmpty()) {
                    alert("Por favor, dibuja tu firma.");
                } else {
                    canvas.toBlob(function(blob) {
                        var formData = new FormData();
                        formData.append('signature', blob, 'signature.png');

                        $.ajax({
                            url: '<?= base_url(); ?>contract/saveSing/<?= $param2; ?>', // Cambia esto por tu URL de servidor
                            type: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function(response) {
                                alert('Firma guardada con éxito.');
                            },
                            error: function(xhr, status, error) {
                                console.error('Error al guardar la firma:', error);
                            }
                        });
                    }, 'image/png');
                }
        }
    });
});
</script>
