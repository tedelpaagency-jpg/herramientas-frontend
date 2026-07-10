<script src="https://cdnjs.cloudflare.com/ajax/libs/signature_pad/1.3.4/signature_pad.js"></script>
<link rel="stylesheet" href="https://red.ziigo.pro/public/assets/css/style.css">
<style>
.editor {
    max-width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    background-color: #f4f6fd;
    overflow: auto;
    text-align: center;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    border: 10px solid white;
    padding: 10px;
}


@media (min-width: 769px) {
    .sheet {
        transform: scale(1.1); /* zoom desktop */
    }
}


.sheet-viewport {
    width: 100%;
    overflow: auto;
    display: flex;
    justify-content: center;
        padding-top: 60px;
}

.sheet {
    border: 1px solid #ccc;
    box-sizing: border-box;
    background-color: white;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    text-align: left;
    line-height: 1.24;
    font-family: Arial;
    font-weight: normal;
    word-spacing: -1px;
    width: 21.59cm;
    height: 27.94cm;
    padding: 2.5cm 3cm;
    margin: 0 auto; /* Centra horizontalmente */
    
}

.carta {
    width: 21.59cm;
    height: 27.94cm;
    padding: 2.5cm 3cm;
    background-image: url('<?php echo base_url(); ?>public/assets/images/w8_form.png');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}

.sheet input {
    font-size: 12px;
    transform-origin: top left;
}


</style>


<?php 
$lexvault = $this->db->get_where('w8',array('id'=>$id))->result_array();
foreach($lexvault as $details):
?>
<div class="">
    <!-- Container-fluid starts-->
    <div class="" style="padding-bottom: 50px;padding-top: 15px;">
        <!-- Zero Configuration  Starts-->
        <div class="editor">

            <!-- Aquí se agregarán las hojas -->
            <div class="sheet-viewport">
                <div class="sheet carta">
                   <input class="w8-field" type="text" name="name_line1" value="<?= $details['name_line1']; ?>" style="position: absolute; top: 316px; left: 47px;  width: 452px;background: #80808045;"/>
                   <input class="w8-field"  type="text" name="name_line2" value="<?= $details['name_line2']; ?>" style="position: absolute; top: 316px; left: 498px; width: 270px;background: #80808045;"/>
                   <input class="w8-field" type="text" name="address_line1" value="<?= $details['address_line1']; ?>" style="position: absolute; top: 348px; left: 47px;  width: 721px;background: #80808045;"/>
                   <input class="w8-field" type="text" name="address_line2" value="<?= $details['address_line2']; ?>" style="position: absolute; top: 380px; left: 47px;  width: 538px;background: #80808045;"/>
                   <input class="w8-field" type="text" name="city" value="<?= $details['city']; ?>" style="position: absolute; top: 380px; left: 583px; width: 186px;background: #80808045;"/>
                   <input class="w8-field" type="text" name="state" value="<?= $details['state']; ?>" style="position: absolute; top: 412px; left: 47px; width: 721px;background: #80808045;"/>
                   <input class="w8-field" type="text" name="postal_code" value="<?= $details['postal_code']; ?>" style="position: absolute; top: 444px; left: 47px;  width: 538px;background: #80808045;"/>
                   <input class="w8-field" type="text" name="reference_number" value="<?= $details['reference_number']; ?>" style="position: absolute; top: 444px; left: 583px; width: 186px;background: #80808045;"/>
                   <input class="w8-field" type="text" name="tax_id" value="<?= $details['tax_id']; ?>" style="position: absolute; top: 476px; left: 47px; width: 721px;background: #80808045;"/>
                   <input class="w8-field" type="text" name="reference_number" value="<?= $details['reference_number']; ?>" style="position: absolute; top: 509px; left: 47px;  width: 337px;background: #80808045;"/>
                   <input class="w8-field" type="checkbox" name="dob" value="<?= $details['dob']; ?>" style="position: absolute; top: 497px; left: 663px; width: 186px;background: #80808045;"/>
                   <input class="w8-field" type="text" name="treaty_claim" value="<?= $details['treaty_claim']; ?>" style="position: absolute; top: 540px; left: 47px;  width: 337px;background: #80808045;"/>
                   <input class="w8-field" type="text" name="input_13" value="<?= $details['input_13']; ?>" style="position: absolute; top: 540px; left: 383px;  width: 387px;background: #80808045;"/>
                   <input class="w8-field" type="text" name="input_14" value="<?= $details['input_14']; ?>" style="position: absolute; top: 572px; left: 315px;  width: 270px;background: #80808045;"/>
                   <input class="w8-field" type="text" name="input_15" value="<?= $details['input_15']; ?>" style="position: absolute; top: 620px; left: 85px;  width: 150px;background: #80808045;"/>
                   <input class="w8-field"  type="text" name="input_16" value="<?= $details['input_16']; ?>" style="position: absolute;top: 620px;left: 468px;width: 31px;background: #80808045;">
                   <input class="w8-field" type="text" name="input_17" value="<?= $details['input_17']; ?>" style="position: absolute;top: 637px;left: 78px;width: 681px;background: #80808045;height: 18px;">
                   <input class="w8-field" type="text" name="input_18" value="<?= $details['input_18']; ?>" style="position: absolute;top: 670px;left: 47px;width: 720px;background: #80808045;height: 18px;">
                    <input class="w8-field" type="checkbox" name="input_19" value="<?= $details['input_19']; ?>" style="position: absolute; top: 913px; left: 59px; width: 186px;background: #80808045;"/>
                    <?php if($details['input_19'] == ''): ?>
                    <a href="javascript:void(0)" onclick="showModalLG('<?= base_url(); ?>modal/popup4/client_sign/<?= $id; ?>')" class="btn btn-success text-center  text-white" style="position: absolute;top: 939px;left: 143px;width: 423px;height: 18px;padding:0px;"><b>Firmar</b></a>
                    <?php else: ?>
                    <img src="<?= base_url(); ?>public/assets/signatures/<?= $details['signature']; ?>"  style="position: absolute;top: 850px;left: 187px;width: 150px;height: 150px;padding:0px;" /> 
                    <?php endif; ?>
                    <input class="w8-field" type="text" name="signed_date" value="<?= $details['signed_date']; ?>" style="position: absolute;top: 939px;left: 573px;width: 193px;background: #80808045;height: 18px;">
                   <input class="w8-field" type="text" name="input_20" value="<?= $details['input_20']; ?>" style="position: absolute;top: 972px;left: 142px;width: 624px;background: #80808045;height: 18px;">
                
                </div>
            </div>
           
        </div>
        
    </div>
  
</div>

<?php endforeach; ?>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<?php include_once('modal.php'); ?>
<script>
$('.w8-field').on('change keyup', function () {
    let el = $(this);
    let value = el.is(':checkbox') ? (el.is(':checked') ? 1 : 0) : el.val();
    
    console.log(value); 
    $.post("<?= base_url('portal/w8/updateField'); ?>", {
        id: <?= $id; ?>,
        field: el.attr('name'),
        value: value
    });
    
    
});
</script>

