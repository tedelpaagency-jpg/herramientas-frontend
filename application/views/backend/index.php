<!DOCTYPE html>
<html lang="en">
<?php include_once('partials/head.php'); ?>

<body class="<?= $this->crud_model->getInfo('theme') != '' ? $this->crud_model->getInfo('theme'): 'color-theme-blue'; ?> <?= $this->crud_model->getInfo('dark_theme') != '' ? $this->crud_model->getInfo('dark_theme'): ''; ?> mont-font">

    <div class="preloader"></div>

    
    <div class="main-wrapper">

        <!-- navigation top-->
        <?php include_once($this->session->userdata('login_type').'/partials/navigation_top.php'); ?>
        <!-- navigation top -->

        <!-- navigation left -->
        <?php include_once($this->session->userdata('login_type').'/partials/navigation_left.php'); ?>
        <!-- navigation left -->
        
        <!-- main content -->
        <div class="main-content right-chat-active <?= $this->crud_model->getInfo('menu_size') != '' ? $this->crud_model->getInfo('menu_size'): ''; ?>">
            <?php include_once($this->session->userdata('login_type').'/'.$page_name.'.php'); ?>     
        </div>
        <!-- main content -->

        <!-- right content -->
        <?php include_once('partials/right_content.php'); ?>
        <!-- right content -->
        
         <!-- navigation mobile -->
        <?php include_once($this->session->userdata('login_type').'/partials/navigation_mobile.php'); ?>
        <!-- navigation mobile -->
        
    </div> 
    <?php include_once('partials/modal.php'); ?>
    <?php include_once('partials/scripts.php'); ?>
    
</body>

</html>