<div class="nav-header bg-white shadow-xs border-0">
    <div class="nav-top">
        <a href="<?= base_url(); ?>">
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
            <a href="<?= base_url(); ?>portal/feed" class="p-2 text-center ms-3 menu-icon center-menu-icon">
                <i class="<?= ($page_name == 'feed') ? 'feather-home font-lg alert-primary btn-round-lg theme-dark-bg text-current ' : 'feather-home font-lg alert-primary btn-round-lg bg-greylight theme-dark-bg text-grey-500 '; ?> "></i>
            </a>
            <a href="<?= base_url(); ?>portal/stories" class="p-2 text-center ms-0 menu-icon center-menu-icon">
                <i class="feather-zap font-lg  btn-round-lg theme-dark-bg <?= ($page_name == 'stories') ? 'alert-primary text-current' : 'bg-greylight text-grey-500'; ?>"></i>
            </a>
            <a href="<?= base_url(); ?>portal/capatitations" class="p-2 text-center ms-0 menu-icon center-menu-icon">
                <i class="feather-video font-lg  btn-round-lg theme-dark-bg <?= ($page_name == 'capatitations') ? 'alert-primary text-current' : 'bg-greylight text-grey-500'; ?> "></i>
            </a>
            <a href="<?= base_url(); ?>portal/users/<?= base64_encode(2); ?>" class="p-2 text-center ms-0 menu-icon center-menu-icon">
                <i class="<?= ($page_name == 'users') ? 'feather-user font-lg alert-primary btn-round-lg theme-dark-bg text-current' : 'feather-user font-lg bg-greylight btn-round-lg theme-dark-bg text-grey-500 '; ?> "></i>
            </a>
            <a href="<?= base_url(); ?>portal/pos" class="p-2 text-center ms-0 menu-icon center-menu-icon">
                <i class="feather-shopping-bag font-lg  btn-round-lg theme-dark-bg <?= ($page_name == 'pos') ? 'alert-primary text-current' : 'bg-greylight text-grey-500'; ?> "></i>
            </a>
        </center>
    </div>
            <a href="#" class="p-2 text-center ms-auto menu-icon" style="visibility:hidden" id="dropdownMenu3" data-bs-toggle="dropdown" aria-expanded="false"><span class="dot-count bg-warning"></span><i class="feather-bell font-xl text-current"></i></a>
            <div class="dropdown-menu dropdown-menu-end p-4 rounded-3 border-0 shadow-lg" aria-labelledby="dropdownMenu3">
                
                <h4 class="fw-700 font-xss mb-4">Notification</h4>
               
            </div>
            <a href="#" class="p-2 text-center ms-3 menu-icon chat-active-btn"><i class="feather-message-square font-xl text-current"></i></a>
            <div class="p-2 text-center ms-3 position-relative dropdown-menu-icon menu-icon cursor-pointer">
                <i class="feather-settings animation-spin d-inline-block font-xl text-current"></i>
                <div class="dropdown-menu-settings switchcolor-wrap">
                    <h4 class="fw-700 font-sm mb-4">Settings</h4>
                    <h6 class="font-xssss text-grey-500 fw-700 mb-3 d-block">Choose Color Theme</h6>
                    <ul>
                        <li>
                            <label class="item-radio item-content">
                                <input type="radio" name="color-radio" value="red" <?= $this->crud_model->getInfo('theme') == 'color-theme-red' ? 'checked': ''; ?>><i class="ti-check"></i>
                                <span class="circle-color bg-red" style="background-color: #ff3b30;"></span>
                            </label>
                        </li>
                        <li>
                            <label class="item-radio item-content">
                                <input type="radio" name="color-radio" value="green" <?= $this->crud_model->getInfo('theme') == 'color-theme-green' ? 'checked': ''; ?>><i class="ti-check"></i>
                                <span class="circle-color bg-green" style="background-color: #4cd964;"></span>
                            </label>
                        </li>
                        <li>
                            <label class="item-radio item-content">
                                <input type="radio" name="color-radio" value="blue" <?= $this->crud_model->getInfo('theme') == 'color-theme-blue' ? 'checked': ''; ?>><i class="ti-check"></i>
                                <span class="circle-color bg-blue" style="background-color: #132977;"></span>
                            </label>
                        </li>
                        <li>
                            <label class="item-radio item-content">
                                <input type="radio" name="color-radio" value="pink" <?= $this->crud_model->getInfo('theme') == 'color-theme-pink' ? 'checked': ''; ?>><i class="ti-check"></i>
                                <span class="circle-color bg-pink" style="background-color: #ff2d55;"></span>
                            </label>
                        </li>
                        <li>
                            <label class="item-radio item-content">
                                <input type="radio" name="color-radio" value="yellow" <?= $this->crud_model->getInfo('theme') == 'color-theme-yellow' ? 'checked': ''; ?>><i class="ti-check"></i>
                                <span class="circle-color bg-yellow" style="background-color: #ffcc00;"></span>
                            </label>
                        </li>
                        <li>
                            <label class="item-radio item-content">
                                <input type="radio" name="color-radio" value="orange" <?= $this->crud_model->getInfo('theme') == 'color-theme-orange' ? 'checked': ''; ?>><i class="ti-check"></i>
                                <span class="circle-color bg-orange" style="background-color: #ff9500;"></span>
                            </label>
                        </li>
                        <li>
                            <label class="item-radio item-content">
                                <input type="radio" name="color-radio" value="gray" <?= $this->crud_model->getInfo('theme') == 'color-theme-gray' ? 'checked': ''; ?>><i class="ti-check"></i>
                                <span class="circle-color bg-gray" style="background-color: #8e8e93;"></span>
                            </label>
                        </li>

                        <li>
                            <label class="item-radio item-content">
                                <input type="radio" name="color-radio" value="brown" <?= $this->crud_model->getInfo('theme') == 'color-theme-brown' ? 'checked': ''; ?>><i class="ti-check"></i>
                                <span class="circle-color bg-brown" style="background-color: #D2691E;"></span>
                            </label>
                        </li>
                        <li>
                            <label class="item-radio item-content">
                                <input type="radio" name="color-radio" value="darkgreen" <?= $this->crud_model->getInfo('theme') == 'color-theme-darkgreen' ? 'checked': ''; ?>><i class="ti-check"></i>
                                <span class="circle-color bg-darkgreen" style="background-color: #228B22;"></span>
                            </label>
                        </li>
                        <li>
                            <label class="item-radio item-content">
                                <input type="radio" name="color-radio" value="deeppink" <?= $this->crud_model->getInfo('theme') == 'color-theme-deeppink' ? 'checked': ''; ?>><i class="ti-check"></i>
                                <span class="circle-color bg-deeppink" style="background-color: #FFC0CB;"></span>
                            </label>
                        </li>
                        <li>
                            <label class="item-radio item-content">
                                <input type="radio" name="color-radio" value="cadetblue" <?= $this->crud_model->getInfo('theme') == 'color-theme-cadetblue' ? 'checked': ''; ?>><i class="ti-check"></i>
                                <span class="circle-color bg-cadetblue" style="background-color: #5f9ea0;"></span>
                            </label>
                        </li>
                        <li>
                            <label class="item-radio item-content">
                                <input type="radio" name="color-radio" value="darkorchid" <?= $this->crud_model->getInfo('theme') == 'color-theme-darkorchid' ? 'checked': ''; ?>><i class="ti-check"></i>
                                <span class="circle-color bg-darkorchid" style="background-color: #9932cc;"></span>
                            </label>
                        </li>
                    </ul>
                    
                    <div class="card bg-transparent-card border-0 d-block mt-3">
                        <h4 class="d-inline font-xssss mont-font fw-700">Color del fondo de menu</h4>
                        <div class="d-inline float-right mt-1">
                            <label class="toggle toggle-menu-color"><input type="checkbox" <?= $this->crud_model->getInfo('menu_background') != '' ? 'checked': ''; ?>><span class="toggle-icon"></span></label>
                        </div>
                    </div>
                    <div class="card bg-transparent-card border-0 d-block mt-3">
                        <h4 class="d-inline font-xssss mont-font fw-700">Menu expandido</h4>
                        <div class="d-inline float-right mt-1">
                            <label class="toggle toggle-menu"><input type="checkbox" <?= $this->crud_model->getInfo('menu_size') != '' ? 'checked': ''; ?>><span class="toggle-icon"></span></label>
                        </div>
                    </div>
                    <div class="card bg-transparent-card border-0 d-block mt-3">
                        <h4 class="d-inline font-xssss mont-font fw-700">Modo obscuro</h4>
                        <div class="d-inline float-right mt-1">
                            <label class="toggle toggle-dark"><input type="checkbox" <?= $this->crud_model->getInfo('dark_theme') != '' ? 'checked': ''; ?>><span class="toggle-icon"></span></label>
                        </div>
                    </div>
                    
                </div>
            </div>
            

            <a href="<?= base_url(); ?>portal/user_profile/<?= base64_encode($this->session->userdata('login_user_id')); ?>" class="p-0 ms-3 menu-icon"><img src="<?php echo $this->crud_model->getPhoto('user',$this->session->userdata('login_user_id')); ?>" alt="user" class="w40 mt--1"></a>
            
        </div>