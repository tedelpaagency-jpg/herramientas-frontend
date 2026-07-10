<div class="app-footer border-0 shadow-lg bg-primary-gradiant">
    <a href="<?= base_url(); ?>portal/feed" class="nav-content-bttn nav-center"><i class="feather-home"></i></a>
    <a href="<?= base_url(); ?>portal/stories" class="nav-content-bttn"><i class="feather-zap"></i></a>
    <a href="<?= base_url(); ?>portal/users/<?= base64_encode(2); ?>" class="nav-content-bttn" data-tab="chats"><i class="feather-user"></i></a>            
    <a href="<?= base_url(); ?>portal/pos" class="nav-content-bttn"><i class="feather-shopping-bag"></i></a>
    <a href="<?= base_url(); ?>portal/user_profile/<?= base64_encode($this->session->userdata('login_user_id')); ?>" class="nav-content-bttn"><img style="border-radius:50%" src="<?php echo $this->crud_model->getPhoto('user',$this->session->userdata('login_user_id')); ?>" alt="user" class="w30 shadow-xss"></a>
</div>