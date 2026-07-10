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
            