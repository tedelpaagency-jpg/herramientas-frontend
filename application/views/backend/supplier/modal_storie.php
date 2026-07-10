
<?php 
    if(isset($param2))
      $story_images = $this->db
        ->order_by('id','DESC')
        ->get_where('notice_image',['notice_id'=>$param2])
        ->result_array();
?>

<button type="button" class="close mt-0 position-absolute top--30 right--10" data-bs-dismiss="modal" aria-label="Close"><i class="ti-close text-white font-xssss"></i></button>
<div class="modal-body p-0">
    <div class="card w-100 border-0 rounded-3 overflow-hidden bg-gradiant-bottom bg-gradiant-top">
        <div class="owl-carousel owl-theme dot-style3 story-slider owl-dot-nav nav-none">
            <?php foreach($story_images as $story): ?>
            <?php 
                $is_video = ($story['file_type'] === 'video');
                $file_url = base_url('public/uploads/notices/' . $story['file_name']);
            ?>
                <div class="item">
                    <!-- Contenido imagen/video -->
                    <?php if ($is_video): ?>
                        <video class=""
                               autoplay
                               loop
                               playsinline style="border-radius: 20px;">
                            <source src="<?= $file_url ?>" type="video/mp4">
                        </video>
                    <?php else: ?>
                        <img src="<?= $file_url ?>" 
                             class="">
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>