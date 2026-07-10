 <div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0">
                    <div class="row">
                        <div class="col-xl-12">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Storie</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Search here.">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                </div>
                            </div>

                            <div class="row ps-2 pe-1">
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
                                    
                                            $is_video = ($story_images['file_type'] === 'video');
                                            $file_url = base_url('public/uploads/notices/' . $story_images['file_name']);
                                        ?>
                                    
                                        
                                        <div class="col-md-3 col-xss-6 pe-2 ps-2" onclick="showAjaxModalStories('<?= base_url(); ?>modal/popup/modal_storie/<?= $story['id']; ?>')">
                                             <div class="card h300 d-block border-0 shadow-xss rounded-3 bg-gradiant-bottom overflow-hidden mb-3 bg-image-cover" >
                                                 
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
                                                
                                                <div class="card-body d-block w-100 position-absolute bottom-0 text-center">
                                                    <figure class="avatar ms-auto me-auto mb-0 position-relative w50 z-index-1"><img src="<?php echo $this->crud_model->getPhoto('user',$story['user_id']); ?>" alt="image" class="float-right p-0 bg-white rounded-circle w-100 shadow-xss"></figure>
                                                    <div class="clearfix"></div>
                                                    <h4 class="fw-600 position-relative z-index-1 ls-3 font-xssss text-white mt-2 mb-1"><?php echo $this->crud_model->getName('user',$story['user_id']); ?></h4>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                            </div>
                        </div>               
                    </div>
                </div>
                 
            </div>  