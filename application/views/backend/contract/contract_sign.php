<script src="https://cdnjs.cloudflare.com/ajax/libs/signature_pad/1.3.4/signature_pad.js"></script>
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

.inner-wrapper-sticky {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 10px;
    border-bottom: 1px solid #00000029;
    text-align: center;
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
    background-image: url('<?php echo base_url(); ?>public/assets/images/membrete.jpg');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}

.oficio {
    width: 21.6cm;
    height: 33cm;
    padding: 2.5cm 3cm;
}

.withBackgroundCarta {
    background-image: url('<?php echo base_url(); ?>public/assets/images/membrete.jpg');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}

.withBackgroundOficio {
    background-image: url('<?php echo base_url(); ?>public/assets/images/membrete.jpg');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}

.withOutBackground {
    background-image: none;
}

#mydiv {
    z-index: 99;
    text-align: center;
    font-size: 16px;
}

#mydivheader {
    padding: 10px;
    cursor: move;
    z-index: 10;
    background-color: #2196F3;
    color: #fff;
}

.toolbar_icons:hover {
    background: grey;
    border: 1px solid #ccc;
}

@media print {
    body,
    page[size="A4"] {
        margin: 0;
        box-shadow: 0;
    }
}

.sheet ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
}

.sheet p, .sheet div {
    margin: 0;
}

.color-picker {
    text-align: center;
}

#colorInput {
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    position: relative;
    top: 10px;
}

.triangulo-amarillo {
    position: relative;
    width: 200px;
    height: 200px;
    background: yellow;
}

.triangulo-amarillo::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 0;
    border-left: 100px solid transparent;
    border-bottom: 100px solid yellow;
}

/* Media query para móviles */
        @media (max-width: 768px) {
            .sheet {
                transform: scale(0.41); /* Escala la hoja al 50% */
                transform-origin: top left;
               
            }
            
            .sheet:not(:first-child) {
                position: relative;
                top: -602px;
            }

            .editor{
                height: 100%;
    margin-bottom: 15px;
            }
            .buttons-container
            {
                position: relative;
                top: -1213px;
            }
            
        }
</style>


<?php 
$lexvault = $this->db->get_where('lexvault',array('lexvault_id'=>$lexvault_id))->result_array();
foreach($lexvault as $details):
?>
<div class="">
    <!-- Container-fluid starts-->
    <div class="" style="padding-bottom: 50px;padding-top: 15px;">
        <!-- Zero Configuration  Starts-->
        <div class="editor">

            <!-- Aquí se agregarán las hojas -->
            <div class="sheets">
                <?php 
                    if($details['content'] != ''):
                        $html = $details['content'];
                $name = $details['name'];
    
                $fields = json_decode($details['fields'], true);
                $claves = array_keys($fields);
                $nclaves = array();
                foreach ($claves as $clave) {
                    array_push($nclaves, '[' . str_replace('_', ' ', $clave) . ']');
                }
                $values = array_values($fields);
                $html = str_replace($nclaves, $values, $html);
                
                if($details['sign'] != '')
                {
                    $html = str_replace('[FIRMA]', '<img src="'.base_url().'public/assets/signatures/'.$details['sign'].'">', $html);
                }
    
    
                        echo $html; 
                    else:
                ?>
                <div class="sheet carta" ></div>
                <?php endif; ?> 
                <?php if($details['status'] == 1):?>
                <div class="buttons-container">
                    <button class="btn btn-danger" onclick="showModalLG('<?= base_url(); ?>modal/popup2/client_decline/<?= base64_encode($lexvault_id);?>')" >Rechazar</button>
                    <button class="btn btn-success"  onclick="showModalLG('<?= base_url(); ?>modal/popup2/client_sign/<?= base64_encode($lexvault_id);?>')" >Firmar</button>
                </div>
                <?php else: ?>
                    
                <?php endif; ?>
            </div>
           
        </div>
        
    </div>
  
</div>

<?php endforeach; ?>
<script>
      $('[contenteditable="true"]').removeAttr('contenteditable');
      $(document).ready(function() {
            adjustEditorHeight();
        
            // Llama a adjustEditorHeight cada vez que la ventana cambie de tamaño
            $(window).resize(function() {
                adjustEditorHeight();
            });
        
            function adjustEditorHeight() {
                if (window.innerWidth <= 768) {
                    
                    var numberOfSheets = $('.sheet').length;
                    var totalHeight = 250 * numberOfSheets;
        
                    $('.sheets').css('height', totalHeight + 'px');
                } else {
                    $('.sheets').css('height', 'auto');
                }
            }
        });
</script>
