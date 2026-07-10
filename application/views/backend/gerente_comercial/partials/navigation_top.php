<div class="nav-header bg-white shadow-xs border-0">
            <div class="nav-top">
                <a href="default.html">
                    <img src='<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('logo');?>' class="w-100">
                </a>
                <a href="#" class="mob-menu ms-auto me-2 chat-active-btn">
                    <i class="feather-message-circle text-grey-900 font-sm btn-round-md bg-greylight"></i>
                </a>
                <a href="default-video.html" class="mob-menu me-2"><i class="feather-video text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
                <a href="#" class="me-2 menu-search-icon mob-menu"><i class="feather-search text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
                <button class="nav-menu me-0 ms-2"></button>
            </div>
            <div class="ms-auto">
                <center>
                    <a href="<?= base_url(); ?>portal/feed" class="p-2 text-center ms-3 menu-icon center-menu-icon"><i class="<?= ($page_name == 'feed') ? 'feather-home font-lg alert-primary btn-round-lg theme-dark-bg text-current ' : 'feather-home font-lg alert-primary btn-round-lg bg-greylight theme-dark-bg text-grey-500 '; ?> "></i></a>
                    <a href="<?= base_url(); ?>portal/stories" class="p-2 text-center ms-0 menu-icon center-menu-icon"><i class="feather-zap font-lg  btn-round-lg theme-dark-bg <?= ($page_name == 'stories') ? 'alert-primary text-current' : 'bg-greylight text-grey-500'; ?> "></i></a>
                    <a href="<?= base_url(); ?>portal/capatitations" class="p-2 text-center ms-0 menu-icon center-menu-icon"><i class="feather-video font-lg  btn-round-lg theme-dark-bg <?= ($page_name == 'capatitations') ? 'alert-primary text-current' : 'bg-greylight text-grey-500'; ?> "></i></a>
                    <a href="<?= base_url(); ?>portal/agencies" class="p-2 text-center ms-0 menu-icon center-menu-icon"><i class="<?= ($page_name == 'agencies') ? 'feather-user font-lg alert-primary btn-round-lg theme-dark-bg text-current' : 'feather-user font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 '; ?> "></i></a>
                    <a href="<?= base_url(); ?>portal/pos" class="p-2 text-center ms-0 menu-icon center-menu-icon"><i class="feather-shopping-bag font-lg  btn-round-lg theme-dark-bg <?= ($page_name == 'pos') ? 'alert-primary text-current' : 'bg-greylight text-grey-500'; ?> "></i></a>
                    <?php $academy = $this->crud_model->getAcademy(); ?>
                    <?php if($academy != ''): ?>
                    <a href="<?= $academy; ?>" target="_blank" class="p-2 text-center ms-0 menu-icon center-menu-icon" target="_blank"><i class="feather-book font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500  "></i></a>
                    <?php endif; ?>
                    <a href="https://ziigo.pro" class="p-2 text-center ms-0 menu-icon center-menu-icon" target="_blank"><i class="feather-send font-lg  btn-round-lg theme-dark-bg <?= ($page_name == 'test') ? 'alert-primary text-current' : 'bg-greylight text-grey-500'; ?> "></i></a>
                </center>
            </div>
            <a href="#" class="p-2 text-center ms-auto menu-icon" id="dropdownMenu3" style="visibility:hidden" data-bs-toggle="dropdown" aria-expanded="false"><span class="dot-count bg-warning"></span><i class="feather-bell font-xl text-current"></i></a>
            <div class="dropdown-menu dropdown-menu-end p-4 rounded-3 border-0 shadow-lg" aria-labelledby="dropdownMenu3">
                
                <h4 class="fw-700 font-xss mb-4">Notification</h4>
                
            </div>
            <a href="#" class="p-2 text-center ms-3 menu-icon chat-active-btn"  ><i class="feather-message-square font-xl text-current"></i></a>
            <div class="p-2 text-center ms-3 position-relative dropdown-menu-icon menu-icon cursor-pointer" style="visibility:hidden">
                <i class="feather-settings animation-spin d-inline-block font-xl text-current"></i>
                
            </div>
            

            <a href="<?= base_url(); ?>portal/user_profile/<?= base64_encode($this->session->userdata('login_user_id')); ?>" class="p-0 ms-3 menu-icon"><img src="<?php echo $this->crud_model->getPhoto('user',$this->session->userdata('login_user_id')); ?>" alt="user" class="w40 mt--1"></a>
            
        </div>