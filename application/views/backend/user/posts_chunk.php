 <style>.notice-text {
    font-size: 16px !important;
    font-weight: 500 !important;
    line-height: 26px !important;
    text-align: justify !important;
    width: 100%;
}

/* Ajuste para videos en el feed */
.feed-video {
    width: 100%;
    height: 220px;        /* alto ideal para un feed */
    object-fit: cover;    /* recorta sin deformar */
    border-radius: 8px;
}

</style>
<?php foreach($notices as $notice): ?>
        <div class="card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
            <div class="card-body p-0 d-flex">
                <figure class="avatar me-3"><img src="<?php echo $this->crud_model->getPhoto('user',$notice['user_id']); ?>" alt="image" class="shadow-sm rounded-circle w45"></figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-1"><?php echo $this->crud_model->getName('user',$notice['user_id']); ?>  <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"><?= $this->crud_model->time_elapsed_es($notice['created_at']); ?></span></h4>
            </div>
            <div class="card-body p-0 me-lg-5">
                <p class="fw-500  lh-26 font-xssss w-100 notice-text text-justify"><?= $notice['post']; ?></p>
                <a href="javascript:void(0)"  onclick="toggleNotice(this)" class="see-more text-primary font-xssss fw-600 <?= mb_strlen($notice['post']) >= '300'? '':'d-none'; ?> " >Ver más</a>
            </div>
                    <?php 
                    $notices_images = $this->db
                        ->order_by('id','DESC')
                        ->get_where('notice_image',['notice_id'=>$notice['id']])
                        ->result_array();
                    
                    $items = $notices_images;
                    $count = count($items);
                    
                    if ($count > 0):
                    
                        // Máximo a mostrar
                        $max = ($count > 4) ? 4 : $count;
                    
                        // Definir columnas según total
                        $cols = [];
                    
                        if ($count == 1) {
                            $cols = ['col-12'];
                        } elseif ($count == 2) {
                            $cols = ['col-6', 'col-6'];
                        } elseif ($count == 3) {
                            $cols = ['col-6', 'col-6', 'col-12'];
                        } elseif ($count >= 4) {
                            $cols = ['col-6', 'col-6', 'col-6', 'col-6'];
                        }
                    ?>
                    <div class="card-body d-block p-0">
                        <div class="row ps-2 pe-2">
                    
                            <?php foreach (array_slice($items, 0, $max) as $index => $file): ?>
                                <?php
                                    $is_video = ($file['file_type'] === 'video');
                                    $file_url = base_url('public/uploads/notices/' . $file['file_name']);
                                    $col = $cols[$index];
                                ?>
                    
                                <div class="<?= $col ?> p-1 position-relative">
                    
                                    <?php if ($is_video): ?>
                    
                                        <a href="<?= $file_url ?>" data-gallery="notice-<?= $notice['id'] ?>" class="d-block position-relative glightbox">
                                            <video class="rounded-3 w-100 " muted >
                                                <source src="<?= $file_url ?>" type="video/mp4">
                                            </video>
                                            <span class="position-absolute top-50 start-50 translate-middle text-white fw-bold"
                                                  style="font-size:22px; text-shadow:0 0 5px #000;">
                                                ▶
                                            </span>
                                        </a>
                    
                                    <?php else: ?>
                    
                                        <a href="<?= $file_url ?>" data-gallery="notice-<?= $notice['id'] ?>" class="glightbox">
                                            <img src="<?= $file_url ?>" class="rounded-3 w-100">
                    
                                            <?php if ($index === ($max - 1) && $count > 4): ?>
                                                <span class="img-count font-sm text-white fw-600 position-absolute top-0 start-0 w-100 h-100
                                                             d-flex justify-content-center align-items-center rounded-3"
                                                      style="background: rgba(0,0,0,0.5); font-size:26px;">
                                                    +<?= $count - 4 ?>
                                                </span>
                                            <?php endif; ?>
                    
                                        </a>
                    
                                    <?php endif; ?>
                    
                                </div>
                            <?php endforeach; ?>
                    
                        </div>
                    </div>
                    <?php endif; ?>



            <div class="card-body d-flex p-0 mt-3">
                <a href="#" class="emoji-bttn d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"><i class="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss"></i> <i class="feather-heart text-white bg-red-gradiant me-2 btn-round-xs font-xss"></i>2.8K Like</a>
                <div class="emoji-wrap">
                    <ul class="emojis list-inline mb-0">
                        <li class="emoji list-inline-item"><i class="em em---1"></i> </li>
                        <li class="emoji list-inline-item"><i class="em em-angry"></i></li>
                        <li class="emoji list-inline-item"><i class="em em-anguished"></i> </li>
                        <li class="emoji list-inline-item"><i class="em em-astonished"></i> </li>
                        <li class="emoji list-inline-item"><i class="em em-blush"></i></li>
                        <li class="emoji list-inline-item"><i class="em em-clap"></i></li>
                        <li class="emoji list-inline-item"><i class="em em-cry"></i></li>
                        <li class="emoji list-inline-item"><i class="em em-full_moon_with_face"></i></li>
                    </ul>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
                            
 