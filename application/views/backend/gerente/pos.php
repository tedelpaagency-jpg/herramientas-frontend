<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0 ms-0 me-0" style="max-width: 100%;">
                    <div class="row">
                        <div class="col-xl-12  chat-left scroll-bar">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Productos</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar producto">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                </div>
                            </div>
                            <div class="row ps-2 pe-2">
                                 <?php 
                                    foreach ($products as $product):
                                    $wherehouse = $this->db->limit(1)->get_where('producto_warehouses',array('product_id'=>$product['id']))->result_array(); 
                                    $main_image = $this->db->get_where('producto_images',array('product_id'=>$product['id'],'is_main'=>1))->first_row()->image_url;
                                    
                                    if (strpos($main_image, 'public') !== false):
                                        $src = base_url() . $main_image;
                                    else:
                                        $src = 'http://d39ru7awumhhs2.cloudfront.net/'.$main_image;
                                    endif;
                                ?>
                                <div class="col-lg-3 col-md-3 col-sm-6 mb-3 pe-2 ps-2">
                                    <div class="card w-100 p-0 hover-card shadow-xss border-0 rounded-3 overflow-hidden me-1">
                                        <div class="card-image w-100 mb-3">
                                            <a href="default-hotel-details.html" class="position-relative d-block"><img src="<?= $src; ?>" alt="image" class="w-100" style="    height: 250px;" onerror="this.onerror=null; this.src='<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('logo');?>';"></a>
                                        </div>
                                        <div class="card-body pt-0">
                                            <a href="<?= base_url()?>portal/add_edit_canvas/<?= $product['id']; ?>"><i class="feather-image font-md text-grey-500 position-absolute right-0 me-3"></i></a>
                                            <h4 class="fw-700 font-xss mt-0 lh-28 mb-0"><a href="default-hotel-details.html" class="text-dark text-grey-900"><?php echo $product['name']; ?></a></h4>
                                            <h6 class="font-xsssss text-grey-500 fw-600 mt-0 mb-2"> <?php $catsss = $this->db->limit(1)->get_where('product_categories',array('product_id'=>$product['id']))->result_array(); ?>
                                                  <?php foreach($catsss as $cat):?>
                                                  <?= $this->db->get_where('categories',array('id'=>$cat['category_id']))->row()->name; ?>
                                                  <?php endforeach;?>
                                                  <br></h6>
                                            <div class="clearfix"></div>
                                            <span class="font-lg fw-700 mt-0 pe-3 ls-2 lh-32 d-inline-block text-success float-left"><span class="font-xsssss">$</span><?= $product['suggested_price']; ?> <span class="font-xsssss text-grey-500">/ mo</span> </span>
                                             <?php if($this->session->userdata('current_supplier') == '' || $filters['supplier'] == $this->session->userdata('current_supplier') || $product['supplier_id'] == $this->session->userdata('current_supplier')): ?>
                                            <a href="javascript:void(0)" data-id="<?= $product['id']; ?>" class="position-absolute bottom-15 mb-2 right-15  add-to-cart"><i class="btn-round-sm bg-primary-gradiant text-white font-sm feather-shopping-bag"></i></a>
                                             <?php else:?>
                                            <a href="javascript:void(0)" data-id="<?= $product['id']; ?>" class="position-absolute bottom-15 mb-2 right-15"><i class="btn-round-sm bg-danger text-white font-sm feather-x"></i></a>

                                          <?php endif;?>
                                        </div>
                                    </div>
                                </div>
                                <?php endforeach; ?>
                                <?php
                        $visible_pages = 5;
                        $start_page = max(1, $current_page - floor($visible_pages / 2));
                        $end_page = min($start_page + $visible_pages - 1, $total_pages);
                        
                        if ($end_page - $start_page < $visible_pages - 1) {
                            $start_page = max(1, $end_page - $visible_pages + 1);
                        }
                        
                        $query_params = $_GET;
                        unset($query_params['page']);
                        $query_string = http_build_query($query_params);
                        $base_url = base_url('portal/pos');
                        ?>
                        <div class="dataTables_paginate paging_simple_numbers">
                            <a class="paginate_button previous <?= ($current_page == 1) ? 'disabled' : '' ?>"
                               href="<?= $base_url . '?page=' . ($current_page - 1) . ($query_string ? '&' . $query_string : '') ?>">Previous</a>
                        
                            <span>
                                <?php for ($i = $start_page; $i <= $end_page; $i++): ?>
                                    <a class="paginate_button <?= ($i == $current_page) ? 'current' : '' ?>"
                                       href="<?= $base_url . '?page=' . $i . ($query_string ? '&' . $query_string : '') ?>"><?= $i ?></a>
                                <?php endfor; ?>
                            </span>
                        
                            <a class="paginate_button next <?= ($current_page == $total_pages) ? 'disabled' : '' ?>"
                               href="<?= $base_url . '?page=' . ($current_page + 1) . ($query_string ? '&' . $query_string : '') ?>">Next</a>
                        </div>
                            </div>
                        </div>   
                    </div>
                </div>
                 
            </div> 
            <script>
            $(document).on('click', '.add-to-cart', function (e) {
            e.preventDefault();
            
                var productId = $(this).data('id');
                console.log(productId);
                $.ajax({
                    url:  '<?= base_url(); ?>cart/add_to_cart/' + productId,
                    type: 'POST',
                    dataType: 'json',
                    success: function (response) {
                         if (response.success) {
                                Toastify({
                                      text: "Se ha agregado al carrito" ,
                                      duration: 3000,
                                      close: true,
                                      gravity: "top", // `top` or `bottom`
                                      position: "right", // `left`, `center` or `right`
                                      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
                                    }).showToast();
                            }
                        
                       location.reload();
                        
                    },
                    error: function () {
                        alert('Error en la solicitud');
                    }
                });
            });
        
       
            </script>