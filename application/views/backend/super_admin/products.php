  <!-- Start Container Fluid -->
  <div class="container-fluid">

      <!-- Start here.... -->
      <div class="row">
          <div class="col-lg-12">
              <div class="card">
                  <div class="card-body">
                      <style>
                      
                      
                      
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

                      <!-- Header -->
                      <div>
                          <a href="<?= base_url(); ?>portal/add_edit_product/" class="btn btn-info">+ Agregar</a>
                      </div>
                      <!-- Filters -->
                      <div class="filters row mb-3" style="z-index: 1010 !important; " id="sticky1">
                               <form action="<?= base_url('portal/listproduct'); ?>" method="GET" class="row" />
                              <div class="col-md-3">
                                  <div class="form-group">
                                      <label for="company">Responsable</label>
                                      <select class="form-select select2" data-choices name="supplier">
                                          <option value="">Todos</option>
                                          <?php     
                                          if($user_type != 3):
                                                    $companys =  $this->db->where('type',3)->where('status',1)->where('pais_id',$this->session->userdata('current_country'))->get('user')->result();
                                                    else:
                                                    $companys =  $this->db->where('user_id',$this->session->userdata('login_user_id'))->get('user')->result();
                                                    endif;
                                                    foreach ($companys as $company):
                                                ?>
                                          <option value="<?php echo $company->user_id; ?>" <?= ($filters['supplier'] == $company->user_id) ? 'selected' : '' ?>><?php echo $company->name; ?></option>
                                          <?php endforeach; ?>
                                      </select>
                                  </div>
                              </div>
                              <div class="col-md-3">
                                  <div class="form-group">
                                      <label for="company">Precio</label>
                                      <div class="input-group">
                                          <input type="number" class="form-control" placeholder="Precio mínimo" id="price-min" name="price_min" value="<?= $filters['price_min']; ?>">
                                          <span class="input-group-text">-</span>
                                          <input type="number" class="form-control" placeholder="Precio máximo" id="price-max" name="price_max" value="<?= $filters['price_max']; ?>">
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-3">
                                  <div class="form-group">
                                      <label for="company">Categoría</label>
                                      <select class="form-select select2" data-choices name="category" >
    
                                          <option value="">Todos</option>
                                          <?php
                                                
                                               $cats = $this->db->get('categories')->result_array();
                                              
    
                                                foreach ($cats as $cat):
                                            ?>
                                          <option value="<?php echo $cat['id']; ?>" <?= ($filters['category'] == $cat['id']) ? 'selected' : '' ?>  ><?php echo $cat['name']; ?></option>
                                          <?php endforeach; ?>
                                      </select>
                                  </div>
                              </div>
                              <div class="col-md-9">
                                  <div class="form-group">
                                      <label for="company">Buscar</label>
                                      <input type="text" name="search" class="form-control " placeholder="Buscar" value="<?= $filters['search']; ?>" >
                                  </div>
                              </div>
                              
                              <div class="col-md-3 mb-3 mt-3">
                                  <div class="form-group">
                                      <button type="submit"  class="btn btn-info " >Buscar</button>
                                  </div>
                              </div>
                              <!-- Productos Angelito -->
                             </form>
                          </div>
                        <a class="btn btn-info text-white mb-3" href="https://portal.trivali.ec/portal/exportar_excel/<?= $filters['supplier']; ?>"><i class="fa-solid fa-file-excel fa-fw"></i>Excel</a>
                      <div class=" app-datatable-default overflow-auto " >
                          <table class="display table table-striped  ">
                              <thead>
                                  <tr>
                                      <th>ID</th>
                                      <th>Nombre</th>
                                      <th>Categoría</th>
                                      <th>Responsable</th>
                                      <th>Bodega</th>
                                      <th>Stock</th>
                                      <th>Precios</th>
                                      <th>Acciones</th>
                                  </tr>
                              </thead>
                              <tbody>
                            
                          <?php 

                                        
                                        foreach ($products as $product):
                                             $wherehouse = $this->db->limit(1)->get_where('producto_warehouses',array('product_id'=>$product['id']))->result_array(); 
                                        ?>
                                <tr>
                                    <td><?= $product['id']?></td>
                                    <td>
                                        <a href="<?php echo base_url(); ?>portal/detailproduct/<?php echo base64_encode($product['id']); ?>" style="text-decoration:none;color:black;">
                                  <?php $main_image = $this->db->get_where('producto_images',array('product_id'=>$product['id'],'is_main'=>1))->first_row()->image_url;?>
                                  <img src="<?php if (strpos($main_image, 'public') !== false): ?>
                                                                <?= base_url() . $main_image; ?>
                                                            <?php else: ?>
                                                                http://d39ru7awumhhs2.cloudfront.net/<?= $main_image; ?>
                                                            <?php endif; ?>" alt="img" width="50px;">
                                                            
                                                            <h5><?php echo $product['name']; ?></h5>
                                                            
                                                            </a>
                                    </td>
                                    <td>
                                        <?php $catsss = $this->db->limit(1)->get_where('product_categories',array('product_id'=>$product['id']))->result_array(); ?>
                                                  <?php foreach($catsss as $cat):?>
                                                  <?= $this->db->get_where('categories',array('id'=>$cat['category_id']))->row()->name; ?>
                                                  <?php endforeach;?>
                                    </td>
                                    <td>
                                        <?= $this->db->get_where('user',array('user_id'=>$product['supplier_id']))->row()->name; ?>
                                    </td>
                                    <td>
                                        
                                         <?php if($cat['warehouse_id']): foreach($wherehouse as $cat):?>
                                                  Bodega:
                                                  <?= $this->db->get_where('warehouses',array('id'=>$cat['warehouse_id']))->row()->name; ?>
                                                  <?php endforeach;?>
                                                  <?php else:?>
                                                  -
                                                  <?php endif;?>
                                    </td>
                                    <td>
                                        
                                         <?php if($cat['stock']): 
                                         foreach($wherehouse as $cat):?>
                                                  <?= $cat['stock']; ?>

                                          <?php endforeach;?>
                                          <?php else: ?>
                                          -
                                          <?php endif;?>
                                    </td>
                                    <td>
                                         <p class="price">$<?php echo $product['sale_price']+$this->crud_model->getInfo('cost_price'); ?> - $<?php echo $product['suggested_price']+$this->crud_model->getInfo('cost_sale_price'); ?></p>

                                    </td>
                                    <td>
                                        <a href="<?php echo base_url(); ?>portal/detailproduct/<?php echo base64_encode($product['id']); ?>" class="btn btn-light-info icon-btn b-r-4"><i class="ti ti-notebook text-info"></i></a>
                                        
                                          <a href="<?php echo base_url(); ?>portal/add_edit_product/<?php echo base64_encode($product['id']); ?>" class="btn btn-light-success icon-btn b-r-4"><i class="ti ti-edit text-success"></i></a>
                                          
                                           <a href="javascript:void(0)" onclick="delete_element('portal/add_edit_product/delete/<?php echo base64_encode($product['id']); ?>')" class="btn btn-light-danger icon-btn b-r-4"><i class="ti ti-trash text-danger"></i></a>
                                         
                                    </td>
                                 
                             </tr>
                         
                          <?php endforeach; ?>
                          </tbody>
                          </table>
                      </div>
                 
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

                  </div> <!-- end col -->
              </div> <!-- end row -->
          </div>
      </div>
  </div>
  <!-- End Container Fluid -->