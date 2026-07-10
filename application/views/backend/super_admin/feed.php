<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left">
                    <!-- loader wrapper -->
                    <div class="preloader-wrap p-3">
                        <div class="box shimmer">
                            <div class="lines">
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                            </div>
                        </div>
                        <div class="box shimmer mb-3">
                            <div class="lines">
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                            </div>
                        </div>
                        <div class="box shimmer">
                            <div class="lines">
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                                <div class="line s_shimmer"></div>
                            </div>
                        </div>
                    </div>
                    <!-- loader wrapper -->
                    <div class="row feed-body">
                        <div class="col-xl-12 col-xxl-12 col-lg-12">
                            <div class="card w-100 shadow-none bg-transparent bg-transparent-card border-0 p-0 mb-0">
                                <div class="owl-carousel category-card owl-theme overflow-hidden nav-none">
                                    <div class="item">
                                        <div class="card w125 h200 d-block border-0 shadow-none rounded-xxxl bg-dark overflow-hidden mb-3 mt-3">
                                            <div class="card-body d-block p-3 w-100 position-absolute bottom-0 text-center">
                                                <a href="#" data-bs-target="#modalAddStorie" data-bs-toggle="modal">
                                                    <span class="btn-round-lg bg-white"><i class="feather-plus font-lg"></i></span>
                                                    <div class="clearfix"></div>
                                                    <h4 class="fw-700 position-relative z-index-1 ls-1 font-xssss text-white mt-2 mb-1">Agregar Story </h4>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <?php 
                                        $stories = $this->db
                                            ->order_by('id','DESC')
                                            ->get_where('notice',['status'=>1,'type'=>'story'])
                                            ->result_array(); 
                                        ?>
                                        
                                        <?php foreach($stories as $story): ?>
                                        
                                            <?php
                                                $story_images = $this->db
                                                    ->order_by('id','DESC')
                                                    ->get_where('notice_image',['notice_id'=>$story['id']])
                                                    ->row_array();
                                                
                                                if(!isset($story_images))
                                                {
                                                    continue;
                                                }
                                        
                                                $is_video = ($story_images['file_type'] === 'video');
                                                $file_url = base_url('public/uploads/notices/' . $story_images['file_name']);
                                            ?>
                                        
                                            <div class="item" onclick="showAjaxModalStories('<?= base_url(); ?>modal/popup/modal_storie/<?= $story['id']; ?>')">
                                                <div class="card w125 h200 d-block border-0 shadow-xss rounded-xxxl overflow-hidden mb-3 mt-3 position-relative">
                                        
                                                    <!-- Contenido imagen/video -->
                                                    <?php if ($is_video): ?>
                                                        <video class="w-100 h-100 position-absolute top-0 start-0 object-cover"
                                                               autoplay
                                                               muted
                                                               loop
                                                               playsinline style="border-radius: 20px;">
                                                            <source src="<?= $file_url ?>" type="video/mp4">
                                                        </video>
                                                    <?php else: ?>
                                                        <img src="<?= $file_url ?>" 
                                                             class="w-100 h-100 position-absolute top-0 start-0 object-cover">
                                                    <?php endif; ?>
                                        
                                                    <!-- Capa inferior con datos del usuario -->
                                                    <div class="card-body d-block p-3 w-100 position-absolute bottom-0 text-center bg-transparent ">
                                                        <a href="javascript:void(0)" onclick="showAjaxModalStories('<?= base_url(); ?>modal/popup/modal_storie/<?= $story['id']; ?>')" >
                                                            <figure class="avatar ms-auto me-auto mb-0 position-relative w50 z-index-1"><img src="<?php echo $this->crud_model->getPhoto('user',$story['user_id']); ?>" alt="image" class="float-right p-0 bg-white rounded-circle w-100 shadow-xss"></figure>
                                                            <div class="clearfix"></div>
                                                            <h4 class="fw-600 position-relative z-index-1 ls-1 font-xssss text-white mt-2 mb-1"><?php echo $this->crud_model->getName('user',$story['user_id']); ?></h4>
                                                        </a>
                                                    </div>
                                        
                                                </div>
                                            </div>
                                        
                                        <?php endforeach; ?>

                                </div>
                            </div>
                            <form  action="<?= base_url('portal/feed/crear_post'); ?>" method="post" enctype="multipart/form-data">
                                <div class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
                                    <input type="hidden" value="post" name="type" />
                                    <div class="card-body p-0">
                                        <span class="font-xssss fw-600 text-grey-500 d-flex align-items-center">
                                            <i class="btn-round-sm font-xs text-primary feather-edit-3 me-2 bg-greylight"></i>
                                            Crear anuncio
                                        </span>
                                    </div>
                            
                                    <div class="card-body p-0 mt-3 position-relative">
                                        <figure class="avatar position-absolute ms-2 mt-1 top-5">
                                            <img src="<?= $this->crud_model->getPhoto('user',$this->session->userdata('login_user_id')); ?>" class="shadow-sm rounded-circle w30">
                                        </figure>
                            
                                        <textarea name="message" id="message"
                                                  class="h100 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-500 fw-500 border-light-md theme-dark-bg"
                                                  placeholder="¿Qué deseas anunciar?" required=""></textarea>
                                    </div>
                                    <input type="file"
                                           name="files[]"
                                           id="filepond"
                                           multiple
                                           data-allow-reorder="true"
                                           data-max-file-size="300MB"
                                           data-max-files="10">
                                    
                                        <button type="submit"
                                                class="ms-auto p-2 lh-20 w100 bg-primary-gradiant me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">
                                            Confirm
                                        </button>
                                </div>
                            </form>
                            
                            <div id="postContainer">
                                <!-- aquí se van a cargar los posts por AJAX -->
                            </div>
 

                            <div  id="loader" class="card w-100 text-center shadow-xss rounded-xxl border-0 p-4 mb-3 mt-3 ">
                                <div class="snippet mt-2 ms-auto me-auto" data-title=".dot-typing">
                                    <div class="stage">
                                        <div class="dot-typing"></div>
                                    </div>
                                </div>
                            </div>


                        </div>               
                       

                    </div>
                </div>
                
            </div>  
            