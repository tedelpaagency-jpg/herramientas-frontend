 <nav class="navigation scroll-bar <?= $this->crud_model->getInfo('menu_background') != '' ? $this->crud_model->getInfo('menu_background'): ''; ?> <?= $this->crud_model->getInfo('menu_size') != '' ? $this->crud_model->getInfo('menu_size'): ''; ?> mb-3">
            <div class="container ps-0 pe-0">
                <div class="nav-content  mb-5">
                    <div class="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
                        <div class="nav-caption fw-600 font-xssss text-info"><span>Principal </span></div>
                        <ul class="mb-1 top-content">
                            <li class="logo d-none d-xl-block d-lg-block"></li>
                            <li><a href="<?= base_url(); ?>portal/feed" class="nav-content-bttn open-font" ><i class="feather-tv btn-round-md bg-blue-gradiant me-3"></i><span>Inicio</span></a></li>
                            <li><a href="<?= base_url(); ?>portal/tasks" class="nav-content-bttn open-font"><i class="feather-file-text btn-round-md bg-gold-gradiant me-3"></i><span>Tareas </span></a></li>   
                            <li><a href="<?= base_url(); ?>portal/user_profile/<?= base64_encode($this->session->userdata('login_user_id')); ?>" class="nav-content-bttn open-font"><i class="feather-user btn-round-md bg-primary-gradiant me-3"></i><span>Perfil </span></a></li>                        
                                                  
                        </ul>
                    </div>
                    <div class="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2">
                        <div class="nav-caption fw-600 font-xssss text-info"><span>Usuarios</span></div>
                        <ul class="mb-3">
                            <li><a href="<?= base_url(); ?>portal/users/<?= base64_encode(3); ?>" class="nav-content-bttn open-font"><i class="font-xl text-current feather-users me-3"></i><span>Administradores</span></a></li>
                            <li><a href="<?= base_url(); ?>portal/users/<?= base64_encode(4); ?>" class="nav-content-bttn open-font"><i class="font-xl text-current feather-users me-3"></i><span>Gerentes</span></a></li>
                            <li><a href="<?= base_url(); ?>portal/users/<?= base64_encode(5); ?>" class="nav-content-bttn open-font"><i class="font-xl text-current feather-users me-3"></i><span>Counters</span></a></li>
                           
                                                   
                        </ul>
                    </div>
                    <div class="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2">
                        <div class="nav-caption fw-600 font-xssss text-info"><span>Herramientas</span></div>
                        <ul class="mb-3">
                            <li><a href="<?= base_url(); ?>portal/my_canvas/" class="nav-content-bttn open-font "><i class="font-xl feather-image me-3 " style="color: #5928eb;"></i><span class="animate-marketing-text icon-animated">Marketing </span></a></li>   
                            <li><a href="<?= base_url(); ?>portal/product_sales" class="nav-content-bttn open-font"><i class="font-xl text-current feather-box me-3"></i><span>Ventas</span></a></li>
                            <li><a href="<?= base_url(); ?>portal/travel_sales" class="nav-content-bttn open-font"><i class="font-xl text-current feather-briefcase me-3"></i><span>Viajes</span></a></li>
                            <li><a href="<?= base_url(); ?>portal/lexvault" class="nav-content-bttn open-font"><i class="font-xl text-current feather-file-text me-3"></i><span>Contratos</span></a></li>
                            <li><a href="<?= base_url(); ?>portal/visas_ref" class="nav-content-bttn open-font"><i class="font-xl text-current feather-credit-card me-3"></i><span>Visas</span></a></li>
                             <li><a href="<?= base_url(); ?>portal/pos_visas" class="nav-content-bttn open-font"><i class="font-xl text-current feather-credit-card me-3"></i><span>Super Visas</span></a></li>
                            <li><a href="<?= base_url(); ?>portal/gifts" class="nav-content-bttn open-font"><i class="font-xl text-current feather-gift me-3"></i><span>Regalos</span></a></li>
                            
                            <li><a href="<?= base_url(); ?>portal/hunter" class="nav-content-bttn open-font"><i class="font-xl text-current feather-briefcase me-3"></i><span>Hunter</span></a></li>
                            
                            <li><a href="<?= base_url(); ?>portal/campaign" class="nav-content-bttn open-font"><i class="font-xl text-current feather-flag me-3"></i><span>Campañas</span></a></li>
                            
                            
                                                   
                        </ul>
                    </div>
                    <div class="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2">
                        <div class="nav-caption fw-600 font-xssss text-info"><span></span> Configuración</div>
                        <ul class="mb-1">
                            <li class="logo d-none d-xl-block d-lg-block"></li>
                            <li><a href="<?= base_url(); ?>portal/settings" class="nav-content-bttn open-font h-auto pt-2 pb-2"><i class="font-sm feather-settings me-3 text-grey-500"></i><span>Ajustes</span></a></li>
                           
                            <li><a href="<?= base_url(); ?>portal/plans" class="nav-content-bttn open-font h-auto pt-2 pb-2"><i class="font-sm feather-pie-chart me-3 text-grey-500"></i><span>Planes</span></a></li>
                           
                        </ul>
                    </div>
                    <div class="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-3">
                        <div class="nav-caption fw-600 font-xssss text-danger"><span></span> Cerrar Sesión</div>
                        <ul class="mb-1">
                            <li class="logo d-none d-xl-block d-lg-block"></li>
                            <li><a href="<?= base_url(); ?>logout" class="nav-content-bttn open-font h-auto pt-2 pb-2"><i class="font-sm fa-solid fa-right-from-bracket me-3 text-grey-500"></i><span>Cerrar Sesión</span></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>