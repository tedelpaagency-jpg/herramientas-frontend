<style>
    .table td, .table th {
    
    border-top: none; 
}
.w-50 {
    width: 50px !important;
}

.h-50 {
    height: 50px !important;
}
.cart-details .fs-6 {
    text-transform: capitalize;
    font-weight: 600;
    margin-bottom: 0;
}

.f-w-500 {
    font-weight: 500 !important;
}

.cart-details p span {
    font-size: 12px;
    margin-left: 2px;
}

.border {
    border: 1px solid #ccc !important;
}
.w-35 {
    width: 35px !important;
}
.h-35 {
    height: 35px !important;
}
.b-r-6 {
    border-radius: 6px !important;
}
.text-center {
    text-align: center !important;
}
.ms-1 {
    margin-left: .25rem !important;
}
.me-1 {
    margin-right: .25rem !important;
}
.table  {
    font-size: 15px !important;
}
table thead th {
    border-bottom: 1px dashed rgba(var(--secondary), 0.4);
    color: rgba(var(--dark), 1);
    font-weight: 600;
    padding: 0.5rem 0.75rem;
    font-size: 15px !important;
}

.paginate_button.previous {
    background-color: rgba(var(--secondary), 0.1) !important;
    background: rgba(var(--secondary), 0.1);
    color: rgba(var(--secondary), 1) !important;
    border: 1px dashed rgba(var(--dark), 0.2);
}

.paginate_button {
    box-sizing: border-box;
    display: inline-block;
    min-width: 1.5em;
    padding: .5em 1em;
    margin-left: 2px;
    text-align: center;
    text-decoration: none !important;
    cursor: pointer;
    color: inherit !important;
    border: 1px solid transparent;
    border-radius: 2px;
    background: transparent;
}

.paginate_button.current {
    background-color: rgba(var(--primary), 1) !important;
    background: rgba(var(--primary), 1);
    color: rgba(var(--white), 1) !important;
    border: 1px dashed rgba(var(--dark), 0.2);
}


.paginate_button.next {
    background-color: rgba(var(--primary), 0.1) !important;
    background: rgba(var(--primary), 0.1);
    color: rgba(var(--primary), 1) !important;
}

#sticky1 .inner-wrapper-sticky {
  background-color: #fff;
  width: 100%;
}

</style>
<div class="middle-sidebar-bottom">
                <div class="middle-sidebar-left pe-0 ms-0 me-0" style="max-width: 100%;">
                    <div class="row">
                        <div class="col-xl-12  chat-left scroll-bar">
                            <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                <div class="card-body d-flex align-items-center p-0">
                                    <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Super visas</h2>
                                    <div class="search-form-2 ms-auto">
                                        <i class="ti-search font-xss"></i>
                                        <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar producto">
                                    </div>
                                    <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                                      <a href="<?= base_url(); ?>portal/add_edit_product/0/3" class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                                </div>
                            </div>
                            <div class="row ps-2 pe-2">
                                 <?php 
                                    $products = $this->db->get_where('productos',['status'=>1,'type'=>3])->result_array(); 
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
                                            <a href="#" class="position-relative d-block"><img src="<?= $src; ?>" alt="image" class="w-100" style="    height: 250px;" onerror="this.onerror=null; this.src='<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('logo');?>';"></a>
                                        </div>
                                        <div class="card-body pt-0">
                                            <h4 class="fw-700 font-xss mt-0 lh-28 mb-0"><a href="#" class="text-dark text-grey-900"><?php echo $product['name']; ?></a></h4>
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
                                
                        
                            </div>
                            <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                                <div class="card-body d-flex align-items-center  p-4">
                                    <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de ventas</h4>
                                </div>
                                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                    <div class="table-responsive">
                                       <table class="table " id="sale_data">
                                            <thead>
                                                <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3 ">
                                                    <th class="border-0 py-2">No.</th>
                                                    <th class="border-0 py-2">Fecha</th>
                                                    <th class="border-0 py-2">Usuario</th>
                                                    <th class="border-0 py-2">Cliente</th>
                                                    <th class="border-0 py-2">Total</th>
                                                    <th class="border-0 py-2">Estado</th>
                                                    <th class="border-0 py-2">Accion</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                 <?php 
                                                           
                                                            $this->db->order_by('id','DESC');
                                                            $this->db->where('seller_id',$this->session->userdata('login_user_id'));
                                                            $this->db->where('type',3);
                                                            $sales = $this->db->get('product_sales')->result();
                                                           
                                                           $cont = 1;
                                                           foreach($sales as $sale): 
                                                              ?>
                                                   <tr>
                                                        <td><?php echo $cont++; ?></td>
                                                        <td><?php echo $sale->created_at; ?></td>
                                                       <td>
                                                           <?php if($sale->seller_id != ''): ?>
                                                           <div class="d-flex align-items-center">
                                                               <img src="<?= $this->crud_model->getPhoto('user',$sale->seller_id); ?>" alt="" class="avatar-xs rounded-circle me-2">
                                                               <div>
                                                                   <h5 class="fs-14 m-0 fw-normal"><?= $this->crud_model->getName('user',$sale->seller_id); ?></h5>
                                                               </div>
                                                           </div>
                                                            <?php else: ?>
                                                            Sin agente asignado
                                                            <?php endif; ?>
                                                       </td>
                                                        <td><?php echo $sale->name.' '.$sale->last_name; ?></td>
                                                       <td><?php echo $sale->grand_total; ?></td>
                                                        <td>
                                                           <?php if($sale->status == 0): ?><span class="badge border border-warning text-warning bg-transparent">Pendiente</span>
                                                           <?php elseif($sale->status == 1): ?><span class="badge border border-current text-current bg-transparent">Aprovada</span>
                                                           <?php elseif($sale->status == 2): ?><span class="badge border border-danger text-danger bg-transparent">Rechazado</span>
                                                           <?php elseif($sale->status == 4): ?><span class="badge border border-primary text-primary bg-transparent">Verificada</span>
                                                           <?php elseif($sale->status == 5): ?><span class="badge border border-warning text-warning bg-transparent">Enviada</span>
                                                           <?php elseif($sale->status == 6): ?><span class="badge border border-success text-success bg-transparent">Entregada</span>
                                                           <?php endif; ?>
                                                       </td>

                                                       <td>
                                                           <a href="<?= base_url(); ?>portal/product_sales_details/<?= base64_encode($sale->id); ?>" class="badge border border-info text-info bg-transparent"><i class="fa-solid fa-file fa-fw"></i></a>

                                                       </td>

                                                   </tr>
                                                   <?php 
                                                        endforeach;
                                                    ?>
                                                
                                            </tbody>
                                        </table>
                                    </div>
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