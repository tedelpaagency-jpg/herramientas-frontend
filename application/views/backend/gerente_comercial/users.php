<?php
if($rol_id != 2):
else:
?>
<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Gerentes Comerciales</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                    <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/user_form/0/2')" data-toggle="modal" class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                                </div>
                            </div>

                            <div class="row ps-2 pe-1">
                                <?php $users = $this->db->get_where('user',['rol_id'=>$rol_id])->result_array(); ?>
                                <?php foreach($users as $user): ?>
                                <div class="col-md-6 col-sm-6 pe-2 ps-2">
                                    <div class="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                                        <div class="card-body position-relative h100 bg-image-cover bg-image-center" style="background-image: url(https://uicobe.com/html/sociala/images/e-4.jpg);" ></div>
                                        <div class="card-body d-block w-100 pl-10 pe-4 pb-4 pt-0 text-left position-relative">
                                            <figure class="avatar position-absolute w75 z-index-1" style="top:-40px; left: 15px;"><img src="<?= base_url(); ?>public/assets/images/users/<?= $user['photo']; ?>" onerror="this.onerror=null; this.src='<?= base_url(); ?>public/assets/images/users/dummy-avatar.jpg';" alt="image" class="float-right p-1 bg-white rounded-circle w-100" ></figure>
                                            <div class="clearfix"></div>
                                            <h4 class="fw-700 font-xsss mt-3 mb-1"><?= $user['name'].' '.$user['last_name']; ?></h4>
                                            <p class="fw-500 font-xsssss text-grey-500 mt-0 mb-3"><?= $user['email']; ?></p>
                                            <span class="position-absolute right-15 top-0 d-flex align-items-center">
                                                <a href="<?= base_url(); ?>portal/user_profile/<?= base64_encode($user['user_id']); ?>" class="text-center p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-700 ls-lg text-white">PERFIL</a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <?php endforeach; ?>                                
                            </div>
                        </div>               
                    </div>
                </div>
                 
            </div>
<?php endif;?>
