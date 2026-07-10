<?php $producto = $this->db->get_where('productos', ['id' => $producto_id])->row_array(); ?>
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left">
        <div class="row">
            <div class="col-xl-12 mt-3">
                <div class="row">
                    <div class="col-lg-5 offset-lg-1 mb-4">
                        <div class="product-slider-3 owl-carousel owl-theme dot-none owl-nav-link edge-link">
                            <?php $product_images = $this->db->get_where('producto_images',array('product_id'=>$producto['id']))->result_array(); ?>
                            
                            <?php foreach($product_images as $image): ?>
                            
                            <?php if (strpos($image['image_url'], 'public') !== false): 
                                 $src = base_url() . $image['image_url']; 
                             else: 
                                 $src = 'http://d39ru7awumhhs2.cloudfront.net/'.$image['image_url']; 
                            endif; ?>
                            
                            <div class="owl-items pt-lg--10 pb-lg--10 bg-white rounded-3"><img data-thumb="<img src='<?= $src; ?>' />" src="<?= $src; ?>" alt="icon"></div>
                            <?php endforeach; ?>
                           
                        </div>                        
                    </div>
                    <div class="col-lg-6  col-md-12 pad-top-lg-200 pad-bottom-lg-100 pad-top-100 pad-bottom-75 ps-md--5">
                        <h4 class="text-danger font-xssss fw-700 ls-2"><?= $producto['sku']; ?></h4>
                        <h2 class="fw-700 text-grey-900 display1-size lh-3 porduct-title display2-md-size"><?= $producto['name']; ?></h2>
                        <div class="clearfix"></div>
                        <p class="font-xsss fw-400 text-grey-500 lh-30 pe-5 mt-3 me-5"><?= $producto['description']; ?></p>

                        <h6 class="display2-size fw-700 text-current ls-2 mb-2"><span class="font-xl"><?= $this->crud_model->getInfo('currency'); ?></span><?php echo $producto['suggested_price']+$producto['aditional_price']; ?> <span class="font-xs text-danger" style=""><?= $this->crud_model->getInfo('currency'); ?><?php echo $producto['sale_price']; ?></span></h6>
                        <div class="timer bg-white mt-2 mb-0 w350 rounded-3"><div class="time-count"><span class="text-time">00</span> <span class="text-day">Day</span></div> <div class="time-count"><span class="text-time">17</span> <span class="text-day">Hours</span> </div> <div class="time-count"><span class="text-time">49</span> <span class="text-day">Min</span> </div> <div class="time-count"><span class="text-time">11</span> <span class="text-day">Sec</span> </div> </div>
                        <div class="clearfix"></div>
                        <form action="#" class="form--action mt-4 mb-3">
                            <div class="product-action flex-row align-items-center">
                                <a href="#" class="bg-success text-white fw-700 ps-lg-5 pe-lg-5 text-uppercase  float-left border-success border rounded-3 border-size-md d-inline-block mt-0 p-3 text-center ls-3 link" data-id="<?php echo base64_encode($producto['id'] ); ?>"><i class="ti-link font-sm"></i> Copiar Link de Ventas</a>
                            </div>  
                        </form>
                        <div class="clearfix"></div>
                       
                        <ul class="product-feature-list mt-5">
                              
                            <li class="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left"><b class="text-grey-900"> Categoría : </b>  
                                <?php $catsss = $this->db->limit(1)->get_where('product_categories',array('product_id'=>$producto['id']))->result_array(); ?>
                                <?php foreach($catsss as $cat):?>
                                <?= $this->db->get_where('categories',array('id'=>$cat['category_id']))->row()->name; ?>
                                <?php endforeach;?>
                            </li>
                            <li class="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left"><b class="text-grey-900">SKU : </b> <?= $producto['sku']; ?></li>
                          
                            <?php 
                                            
                                $wherehouse = $this->db->limit(1)->get_where('producto_warehouses',array('product_id'=>$producto['id']))->result_array(); 
                                foreach($wherehouse as $cat):
                            
                            ?>
                            
                            <li class="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left"><b class="text-grey-900">Proveedor :  </b> <?= $this->db->get_where('warehouses',array('id'=>$cat['warehouse_id']))->row()->name; ?> </li>
                            <li class="w-50 lh-32 font-xsss text-grey-500 fw-500 float-left"><b class="text-grey-900">Stock: :  </b>  <?= $cat['stock']; ?> </li>

                            <?php endforeach; ?>
                            
                            </li>
                            
                        </ul>
                    </div>
                </div> 
            </div>               
        </div>
    </div>
     
</div> 
<script src="<?= base_url(); ?>public/assets/js/countdown.js"></script>
<script src="https://gijsroge.github.io/owl-carousel2-thumbs/assets/OwlCarousel2Thumbs.min.js"></script>

    <script>
        $(document).ready(function(){
          var owl = $('.product-slider-3');
            owl.owlCarousel({
                autoplay: false,
                autoplayTimeout: 4000,
                loop: true,
                items: 1,
                center: true,
                nav: true,
                thumbs: true,
                thumbImage: false,
                thumbsPrerendered: true,
                thumbContainerClass: 'owl-thumbs',
                thumbItemClass: 'owl-thumb-item',
                navText: ["<i class='ti-angle-left icon-nav'></i>","<i class='ti-angle-right icon-nav'></i>"],
            });
        });
    </script>  

    <script>
        $(function () {

           $('.timer').countdown('2021/6/31', function(event) {
              var $this = $(this).html(event.strftime(''
                // + '<span>%w</span> weeks '
                + '<div class="time-count"><span class="text-time">%d</span> <span class="text-day">Day</span></div> '
                + '<div class="time-count"><span class="text-time">%H</span> <span class="text-day">Hours</span> </div> '
                + '<div class="time-count"><span class="text-time">%M</span> <span class="text-day">Min</span> </div> '
                + '<div class="time-count"><span class="text-time">%S</span> <span class="text-day">Sec</span> </div> '));
            });
        }); 
    </script>