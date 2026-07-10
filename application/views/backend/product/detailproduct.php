<?php
$producto = $this->db->get_where('productos', ['id' => $producto_id])->row_array();
$seller_array = explode('-', $seller);
$seller_id = $seller_array[1];
$seller_type = 'user';
$precio_envio  = $this->crud_model->getInfo('cost_delivery');
$currency  = $this->crud_model->getInfo('currency');
$main_image = $this->db->get_where('producto_images', ['product_id' => $producto['id'], 'is_main' => 1])->first_row()->image_url;
if (strpos($main_image, 'public') !== false):
  $src = base_url() . $main_image;
else:
  $src = 'http://d39ru7awumhhs2.cloudfront.net/' . $main_image;
endif;


?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TIKVAO | <?= $producto['name']; ?></title>
<meta property="og:title" content="TIKVAO | <?= $producto['name']; ?>">
<meta property="og:description" content="TIKVAO - Los mejores productos">
<meta property="og:image" content="<?= $src; ?>">
<meta property="og:type" content="article">
<link rel="icon" href="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('favicon');?>" type="image/x-icon">
<link rel="shortcut icon" href="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('favicon');?>" type="image/x-icon">
<!-- Bootstrap y AOS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Material Icons -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">

<style>
body {
  font-family: "Poppins", sans-serif;
  background-color: #fff;
  color: #333;
  overflow-x: hidden;
}

/* === BARRA SUPERIOR === */
.top-bar {
  background: linear-gradient(90deg, #ff4747, #ff7a00, #ff4747);
  color: white;
  text-align: center;
  padding: 8px 0;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  overflow: hidden;
  position: sticky;
  top: 0;
      z-index: 1300;
}
.top-bar span {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 10s linear infinite;
}
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

/* HEADER */
header {
  position: sticky;
  top: 30px;
  z-index: 400;
  background: #fff;
  border-bottom: 2px solid #eee;
  text-align: center;
  padding: 15px 0;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 2px;
}

/* HEADER */
header img {
      width: 100px;
}

/* CONTADOR */
.offer-timer {
  background: #f5f8ff;
  border-radius: 12px;
  padding: 15px 20px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
  margin: 20px auto;
  max-width: 450px;
  transition: all 0.4s ease;
}
.offer-timer.sticky {
  position: fixed;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 100%;
  border-radius: 0;
  padding: 10px;
  z-index: 500;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  background: #f9fbff;
}
.offer-timer h5 { font-weight: 700; color: #1a1a40; margin-bottom: 10px; }
.timer-box { display: flex; justify-content: center; gap: 10px; font-weight: 600; }
.timer-segment {
  background: #fff;
  border-radius: 8px;
  padding: 10px 15px;
  min-width: 60px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.timer-number { font-size: 24px; color: #1a1a40; }
.timer-label { font-size: 10px; color: #777; text-transform: uppercase; }

.hero-img { width: 100%; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); }
.product-title { font-size: 1.6rem; font-weight: 600; color: #222; }
.price { color: #ff7902; font-size: 1.5rem; font-weight: 700; }
.old-price { text-decoration: line-through; color: #888; margin-left: 8px; }

/* BOTÓN DESTACADO */
.btn-buy {
  background: #ff7902;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  padding: 12px 24px;
  transition: all 0.3s ease;
   animation: 
   pulseGlow 1.5s ease-in-out infinite,     /* Brillo suave */
   shakeEvery10s 1s ease-in-out infinite;
}
.btn-buy:hover {
  background: #ff7902cd;
  transform: scale(1.05);
}

@keyframes pulseGlow {
  0% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 121, 2, 0.7); }
  50% { transform: scale(1.06); box-shadow: 0 0 20px rgba(255, 121, 2, 0.6); }
  100% { transform: scale(1); box-shadow: 0 0 0 rgba(255, 121, 2, 0.7); }
}

@keyframes vibrate {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
  60% { transform: translate(-2px, -2px); }
  80% { transform: translate(2px, 2px); }
}

@keyframes floatUpDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes shakeEvery10s {
  0%, 95%, 100% { transform: translateX(0); }
  2%, 4%, 6%, 8% { transform: translateX(-5px); }
  3%, 5%, 7%, 9% { transform: translateX(5px); }
}

.gallery img { width: 80px; border-radius: 8px; margin: 5px; cursor: pointer; transition: transform 0.3s; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); }
.gallery img:hover { transform: scale(1.05); }
.features { background: #fff0f5; border-radius: 15px; padding: 20px; }
.verified { font-size: 0.9rem; color: #444; }
footer { background: #ff7902; color: #fff; text-align: center; padding: 20px; margin-top: 50px; }
.ck-content img {
  max-width: 100% !important;
  width: 100% !important;
  height: auto !important;
}

.ck-content iframe,
.ck-content video {
  max-width: 100%;
  width: 100%;
  height: auto;
}

.ck-content table {
  width: 100%;
  max-width: 100%;
  display: block;
  overflow-x: auto;
}

.ck-content p {
  word-break: break-word;
}
</style>
</head>
<body>

<!-- BARRA SUPERIOR -->
<div class="top-bar">
  <span>🚚 ¡ENVÍO GRATIS A TODO EL PAÍS! 💖 ¡Aprovecha esta oferta limitada!</span>
</div>

<!-- HEADER -->
<header><img src="https://portalperu.tikvao.com/public/assets/images/logo/1759285335_imagen_2025-09-30_202143253-removebg-preview.png"></header>



<!-- CONTENIDO -->
<div class="container py-4">
  <div class="row align-items-center">
    <div class="col-md-6" data-aos="fade-right">
      <img src="<?= $src; ?>" alt="<?= $producto['name']; ?>" class="hero-img" id="mainImage">
      <?php
        $src_galery = $this->db->get_where('producto_images', ['product_id' => $producto['id']])->result_array();
      ?>
      <div class="gallery d-flex flex-wrap justify-content-center mt-3">
        <?php foreach($src_galery as $src_img):?>  
            <img src="<?= base_url() . $src_img['image_url']; ?>" alt="1">
        <?php endforeach; ?>
      </div>
    </div>
    <div class="col-md-6" data-aos="fade-left">
      <h2 class="product-title">💫 <?= $producto['name']; ?></h2>
      <p class="text-muted verified">
        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#289eff" d="M15.616 3.268L12 .186L8.383 3.268l-4.737.378l-.378 4.737L.186 12l3.082 3.617l.378 4.737l4.737.378l3.616 3.082l3.617-3.082l4.737-.378l.378-4.737L23.813 12l-3.082-3.617l-.378-4.737zM11 16.414L6.585 12L8 10.586l3 3l5.5-5.5L17.914 9.5z"/></svg>
        Producto Verificado
      </p>

      <div class="mb-3">
        <span class="price"><?= $currency; ?> <?= $producto['suggested_price']+$precio_envio; ?></span>
        <span class="old-price"><?= $currency; ?> <?= $producto['suggested_price']+10+$precio_envio; ?></span>
      </div>

      <hr class="my-4">

      <div class="d-flex align-items-center mb-2">
        <img class="rounded-circle user me-2" width="32" src="<?= $this->crud_model->getPhoto($seller_type,$seller_id); ?>" alt="avatar">
        <div>
          <small class="text-muted">Agente vendedor</small><br>
          <h4 class="dropdown-header"><?= $this->crud_model->getName($seller_type,$seller_id);?></h4>
        </div>
      </div>

      <hr class="my-4">

      <button class="btn btn-buy w-100" onclick="showModalLG('<?= base_url(); ?>modal/popup3/sale_form/<?= $producto['id']?>/<?= base64_encode($seller) ?>')">
         PIDE AHORA Y PAGA AL RECIBIR
      </button>
        <hr class="my-4">
        <!-- CONTADOR -->
        <div class="offer-timer" id="offer-timer">
            
          <h5>LA OFERTA ACABA EN:</h5>
          <div class="timer-box">
            <div class="timer-segment"><div class="timer-number" id="days">00</div><div class="timer-label">DÍAS</div></div>
            <div class="timer-segment"><div class="timer-number" id="hours">00</div><div class="timer-label">HORAS</div></div>
            <div class="timer-segment"><div class="timer-number" id="minutes">00</div><div class="timer-label">MINUTOS</div></div>
            <div class="timer-segment"><div class="timer-number" id="seconds">00</div><div class="timer-label">SEGUNDOS</div></div>
          </div>
          <p class="mt-2 text-muted small">¡Apresúrate!</p>
        </div>
      <hr class="my-4">

      <div class="features">
        <p><strong>📦 Producto Físico</strong></p>
        <p><strong>💎 Categoría:</strong>
          <?php
          $catsss = $this->db->limit(1)->get_where('product_categories',['product_id'=>$producto['id']])->result_array();
          foreach($catsss as $cat):
            echo $this->db->get_where('categories',['id'=>$cat['category_id']])->row()->name;
          endforeach;
          ?>
        </p>
        <p><strong>🚚 Pide ahora y recibe en 1 - 3 días</strong></p>
      </div>
    </div>
  </div>
   <hr class="my-4">
      <!-- Texto inferior -->
      <div class="row mt-5">
        <div class="ck-content" data-aos="fade-up">
          <?= $producto['description']; ?>
        </div>
      </div>
</div>

<!-- MODAL -->
<div class="modal fade bd-example-modal-lg" id="mortalidad" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-centered modal-lg" role="document">
    <div class="modal-content text-center" style="margin-top:50px;"></div>
  </div>
</div>

<footer>2025 © Todos los derechos reservados a trivali Group Desarrollado por tedelpa</footer>

<?php include_once './modal.php'; ?>

<!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
<script>AOS.init();</script>

<script>
function showModalLG(url) {
  $('#mortalidad .modal-body').html('<div style="text-align:center;margin-top:50px;"><img src="<?= base_url().'assets/img/Spinner-5.gif';?>" /></div>');
  $('#mortalidad').modal('show', { backdrop: 'true' });
  $.ajax({
    url: url,
    success: function(response) {
      $('#mortalidad .modal-content').html(response);
    }
  });
}

// GALERÍA
$(".gallery img").click(function() {
  $("#mainImage").attr("src", $(this).attr("src"));
});

// CONTADOR REGRESIVO (1 hora)
let countdownTime = new Date().getTime() + (60 * 60 * 1000);
let timerInterval = setInterval(() => {
  let now = new Date().getTime();
  let distance = countdownTime - now;
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  $("#days").text(String(days).padStart(2, "0"));
  $("#hours").text(String(hours).padStart(2, "0"));
  $("#minutes").text(String(minutes).padStart(2, "0"));
  $("#seconds").text(String(seconds).padStart(2, "0"));

  if (distance < 0) {
    clearInterval(timerInterval);
    $(".offer-timer").html("<h5>¡La oferta ha terminado!</h5>");
  }
}, 1000);

// CONTADOR STICKY
$(window).on("scroll", function() {
  //const timer = $("#offer-timer");
  //if ($(this).scrollTop() > 250) timer.addClass("sticky");
  //else timer.removeClass("sticky");
});
</script>

</body>
</html>
