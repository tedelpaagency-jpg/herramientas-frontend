<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<?php 
    if(isset($param2))
     $producto = $this->db->get_where('productos', ['id' => $param2])->row_array();
     $currency  = $this->crud_model->getInfo('currency');
?>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
   
:root{
      --bg:#0b0b0c;
      --overlay:rgba(0,0,0,.55);
      --card:#ffffff;
      --text:#1a1a1a;
      --muted:#6b7280;
      --primary:#ff7902;        /* rojo botón */
      --primary-700:#ff7902cd;
      --ring:#3b82f6;            /* azul foco accesible */
      --border:#e5e7eb;
      --success:#16a34a;
      --chip:#ff7902;
      --radius:14px;
    }

    /* Header */

    .thumb{
      width:48px; height:48px; border-radius:10px; background:#eee; overflow:hidden; flex:0 0 auto;
      display:grid; place-items:center; font-size:22px;
    }
    .title-wrap{flex:1 1 auto; min-width:0}
    .title{
      font-weight:700; font-size:18px; line-height:1.2;
      text-transform:uppercase; letter-spacing:.3px;
      text-align:center; width:100%;
    }
    .subtitle{
      font-size:14px; color:var(--muted);
    }
    .price2{
      margin-left:auto; font-weight:700;
      background:var(--chip);
      padding:8px 10px; border-radius:10px; white-space:nowrap;
    }

    /* Body */
    .card__body{padding:22px}
    .section-title{
      font-weight:700; font-size:16px; margin:6px 0 10px 0;
    }

    /* Método de envío */
    .shipping{
      display:flex; align-items:center; justify-content:space-between;
      border:1px solid var(--border); border-radius:12px;
      padding:12px 14px; margin-bottom:18px;
      background:#fff;
    }
    .shipping-left{display:flex; align-items:center; gap:10px}
    .badge{
      background:#eefdf3; color:var(--success); font-weight:600; font-size:13px;
      padding:6px 10px; border-radius:999px;
    }
    .radio{
      width:18px; height:18px; border:2px solid #9ca3af; border-radius:50%; display:inline-grid; place-items:center;
    }
    .radio::after{
      content:""; width:10px; height:10px; border-radius:50%; background:var(--success); transform:scale(0);
      transition:.15s ease;
    }
    input[type="radio"]:checked + .radio::after{ transform:scale(1); }

    /* Form grid */
    .grid{
      display:grid; gap:14px;
      grid-template-columns:1fr;
    }
    @media (min-width:720px){
      .grid{grid-template-columns:1fr 1fr}
      .grid .full{grid-column:1 / -1}
    }

    /* Field */
    .field{display:flex; flex-direction:column; gap:6px}
    .label{font-size:13px; font-weight:600}
    .req{color:#ef4444}
    .control{
      display:flex; align-items:center; gap:10px;
      border:1px solid var(--border); border-radius:12px;
      padding:12px 14px; background:#fff;
    }
    .control:focus-within{outline:3px solid var(--ring); outline-offset:2px}
    .control svg{flex:0 0 auto}
    .input, .select, .textarea{
      width:100%; border:0; outline:0; font:inherit; background:transparent;
    }
    .select{appearance:none; background-image:linear-gradient(45deg, transparent 50%, #9ca3af 50%), linear-gradient(135deg, #9ca3af 50%, transparent 50%);
      background-position:calc(100% - 16px) 50%, calc(100% - 11px) 50%;
      background-size:6px 6px, 6px 6px; background-repeat:no-repeat;
      cursor:pointer;
    }

    /* CTA */
    .cta{
      margin-top:18px;
      background:var(--primary); color:white; border:0;
      width:100%; padding:16px 18px; border-radius:999px;
      font-weight:800; letter-spacing:.3px; cursor:pointer;
      display:flex; align-items:center; justify-content:center; gap:10px;
    }
    .cta:hover{background:var(--primary-700)}
    .cta small{opacity:.9; font-weight:700}

    /* Helpers */
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
  </style>
<?php 
  if(isset($param2)) { 
    $producto     = $this->db->get_where('productos', ['id' => $param2])->row_array();
  }
  $precio_base   = isset($producto) ? ($producto['suggested_price'] + $this->crud_model->getInfo('cost_sale_price')) : 0;
  $precio_envio  = $this->crud_model->getInfo('cost_delivery');
  $precio_total  = $precio_base + $precio_envio;
?>
<div class="modal-header">
    <!-- Header -->
  
 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

    <div class="title-wrap">
      <div class="title" id="dlg-title">LLENA TUS DATOS, NOS COMUNICAREMOS CONTIGO</div>
    </div>

    <!-- Chip de precio base -->
    <span class="price2" style="color:white !important; " ><?= $currency; ?><?= number_format($precio_base+$precio_envio,2); ?></span>
 
</div>
<form method="post" action="<?php echo  base_url('product/product_sales/store'); ?>" enctype="multipart/form-data" id="formSale">
        <input type="hidden" value="<?= $param3; ?>" name="seller" />
        <?php if(isset($producto)): ?>
            <input type="hidden" value="<?= $producto['id']; ?>" name="product" />
        <?php endif; ?>
        <input type="hidden" name="sale_price" value="<?= number_format($precio_base,2,'.',','); ?>" />
        <input type="hidden" name="total" value="<?= number_format($precio_total,2,'.',','); ?>" />
        
    <div class="modal-body row" style="text-align:left !important;">
        <div class="overlay" role="dialog" aria-modal="true" aria-labelledby="dlg-title">
            <article class="">
              <!-- Body -->
              <div class="card__body">
                <!-- Product line -->
                <div class="control full" style="margin-bottom:12px; border:0; padding:0; background:transparent;">
                  <div class="thumb" aria-hidden="true">💎</div>
                  <div>
                    <div style="font-weight:700; font-size:15px;"><?= isset($producto) ? htmlspecialchars($producto['name']) : 'Producto' ?></div>
                    <div class="subtitle">Selecciona tu método de envío y completa tus datos</div>
                  </div>
                </div>
        
                <!-- Método de envío -->
                <div class="section-title">Método de envío</div>
                <label class="shipping full" for="envio-gratis">
                  <div class="shipping-left">
                    <input id="envio-gratis" name="envio" type="radio" checked class="sr-only"  />
                    <span class="radio" aria-hidden="true"></span>
                    <span>Valor de envío</span>
                  </div>
                  <span class="badge">Gratis</span>
                </label>
        
                <!-- Form -->
                <form class="grid" action="#" method="post" novalidate>
                  <!-- Nombres y Apellidos -->
                  <div class="field full">
                    <label class="label" for="nombre">Nombres <span class="req">*</span></label>
                    <div class="control">
                      <!-- user icon -->
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <input class="input" id="nombre" name="name" type="text" placeholder="Nombres" required>
                    </div>
                  </div>
                  <div class="field full">
                    <label class="label" for="nombre">Apellidos <span class="req">*</span></label>
                    <div class="control">
                      <!-- user icon -->
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <input class="input" id="nombre" name="last_name" type="text" placeholder="Apellidos" required>
                    </div>
                  </div>
        
                  <!-- Teléfono -->
                  <div class="field full">
                    <label class="label" for="telefono">Telefono / Whatsapp <span class="req">*</span></label>
                    <div class="control">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.58a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <input class="input" id="telefono" name="phone" type="tel" inputmode="tel" placeholder="904 885 155" required>
                    </div>
                  </div>
                    <!-- Pais -->
                  <div class="field">
                    <label class="label" for="pais">Pais <span class="req">*</span></label>
                    <div class="control">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                        <select class="select" id="pais" class="form-control" name="pais">
                            <option value="2" selected>Peru</option>
                        </select>
                    </div>
                  </div>
                  
                  <!-- Provincia -->
                  <div class="field">
                    <label class="label" for="provincia">Departamento <span class="req">*</span></label>
                    <div class="control">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                        <select class="select" id="provincia" disabled class="form-control" name="provincia">
                            <option value="" class="form-control">Selecciona un Departamento</option>
                        </select>
                    </div>
                  </div>
        
                  <!-- Ciudad -->
                  <div class="field">
                    <label class="label" for="ciudad">Provincia <span class="req">*</span></label>
                    <div class="control">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 22h18"></path><path d="M6 18V6h4v12"></path><path d="M14 18V2h4v16"></path>
                      </svg>
                      <select class="select" id="canton" disabled class="form-control" name="canton">
                            <option value="" class="form-control">Selecciona una Provincia</option>
                        </select>
                    </div>
                  </div>
        
                  <!-- CTA -->
                  <button class="cta full" type="submit" aria-label="Realiza tu compra por 79 soles" id="btnSubmit">
                    <span>REALIZA TU COMPRA AQUÍ</span> <small>— <?= $currency; ?><?= number_format($precio_total,2); ?></small>
                  </button>
                </form>
              </div>
            </article>
          </div>
    </div>
</form>
<script>
$(document).ready(function () {
    $('#formSale').on('submit', function (e) {
        e.preventDefault();

        var form = $(this)[0];
        var formData = new FormData(form);
        
        $('#btnSubmit').attr('disabled','disabled');    
        $('#btnSubmit').html('<span>Procesando pedido....</span>'); 
        
        $.ajax({
            url: $(form).attr('action'),
            type: 'POST',
            data: formData,
            processData: false, // no procesar datos
            contentType: false, // no establecer tipo
            beforeSend: function () {
                // opcional: mostrar loader
                console.log('Enviando...');
            },
            success: function (response) {
                try {
                    var res = JSON.parse(response);
                    if (res.status === 'success') {
                        
                        showModalLG('<?= base_url(); ?>modal/popup3/sale_success/<?= $producto['id']?>/<?= base64_encode($seller) ?>')
                        
                    } else {
                        alert(res.message || 'Error al guardar');
                        $('#btnSubmit').removeAttr('disabled');   
                    }
                } catch (e) {
                    console.log(response);
                    alert('Respuesta inesperada del servidor');
                    $('#btnSubmit').removeAttr('disabled');   
                }
            },
            error: function (xhr) {
                alert('Error en la solicitud: ' + xhr.status);
            }
        });
    });
});
</script>

<script>
    
$(document).ready(function() {
    // Cargar países al iniciar la página
    $.getJSON("<?= base_url('user/obtener_provincias/2'); ?>", function(data) {
        $.each(data, function(index, provincia) {
            $("#provincia").append($("<option>", {
                value: provincia.id,
                text: provincia.nombre
            }));
        });
        $("#provincia").prop('disabled', false);
    });

    // Evento para cargar cantones cuando cambia la provincia
    $("#provincia").on("change", function() {
        let provincia_id = $(this).val();
        $("#canton").empty().append('<option value="">Selecciona un cantón</option>').prop('disabled', true);

        if (provincia_id) {
            $.getJSON("<?= base_url('user/obtener_cantones/'); ?>" + provincia_id, function(data) {
                $.each(data, function(index, canton) {
                    $("#canton").append($("<option>", {
                        value: canton.id,
                        text: canton.nombre
                    }));
                });
                $("#canton").prop('disabled', false);
            });
        }
    });

    $("input[name='recaudo']").change(function() {
        if ($(this).val() == "0") {
            $("#transferenciaInfo").slideDown();
            $('#numero_transferencia').attr('required', 'required');
            $('#foto_transferencia').attr('required', 'required');

        } else {
            $("#transferenciaInfo").slideUp();
            $('#numero_transferencia').removeAttr('required', 'required');
            $('#foto_transferencia').removeAttr('required', 'required');
        }
    });

});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload").change(function() {
    readURL(this);
});
</script>