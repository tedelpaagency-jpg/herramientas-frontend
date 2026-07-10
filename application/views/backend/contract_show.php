<!DOCTYPE html>
<html lang="en">

<head>

    <!-- apexcharts css-->
    <link rel="stylesheet" type="text/css" href="<?= base_url(); ?>public/assets/vendor/apexcharts/apexcharts.css">

    <!-- slick css -->
    <link rel="stylesheet" href="<?= base_url(); ?>public/assets/vendor/slick/slick.css">
    <link rel="stylesheet" href="<?= base_url(); ?>public/assets/vendor/slick/slick-theme.css">

    <!-- filepond css -->
    <link href="<?= base_url(); ?>public/assets/vendor/filepond/filepond.css" rel="stylesheet">
    <link href="<?= base_url(); ?>public/assets/vendor/filepond/image-preview.min.css" rel="stylesheet">


    <!-- glight css -->
    <link rel="stylesheet" href="<?= base_url(); ?>public/assets/vendor/glightbox/glightbox.min.css">


    <!-- css end-->
    <?php
    include('head.php');
    include('css.php');
    ?>
</head>

<body class="ltr ">

<div class="app-wrapper">
       
<main>
             <?php include 'contract/'.$page_name.'.php';?>
        </main>
    <!-- tap on top -->
    <div class="go-top">
      <span class="progress-value">
        <i class="ti ti-arrow-up"></i>
      </span>
    </div>

    <?php
    include('footer.php');
    ?>
</div>

<?php
include('modal.php');
?>

</body>

<?php
include('scripts.php');
?>



</html>
