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
      --primary:#e11d48;        /* rojo botón */
      --primary-700:#be123c;
      --ring:#3b82f6;            /* azul foco accesible */
      --border:#e5e7eb;
      --success:#16a34a;
      --chip:#f3f4f6;
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
    .price{
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
      <div class="title" id="dlg-title">🎉 FELICIDADES 🎉</div>
      <div class="title" id="dlg-title">TU PEDIDO HA SIDO ENVIADO CON EXITO</div>
    </div>

</div>
    <div class="modal-body row" style="text-align:left !important;">
        <div class="overlay" role="dialog" aria-modal="true" aria-labelledby="dlg-title">
            <article class="">
              <!-- Body -->
              <div class="card__body">
                <!-- Product line -->
                    <div class="control full" style="margin-bottom:12px; border:0; padding:0; background:transparent;">
                      <div class="thumb" aria-hidden="true">✅</div>
                      <div>
                        <div style="font-weight:700; font-size:15px;"><?= isset($producto) ? htmlspecialchars($producto['name']) : 'Producto' ?></div>
                        <div class="subtitle">En breve un asesor se contactara contigo para ayudarte 😉</div>
                      </div>
                    </div>
                </div>
               
            </article>
          
        </div>
  </div>