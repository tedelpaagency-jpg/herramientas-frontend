  <link rel="stylesheet" href="<?php echo base_url(); ?>public/assets/frontend/fonts/fonts.css">
  <link rel="stylesheet" href="<?php echo base_url(); ?>public/assets/frontend/fonts/font-icons.css">
  <link rel="stylesheet" type="text/css" href="https://immobillis.trivali.ec/public/assets/frontend/css/styles.css">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

  <!-- Start Container Fluid -->
  <style>
.image-container {
    position: relative;
    width: 200px;
    /* Ajusta el tamaño */
    height: 200px;
    overflow: hidden;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: fit;
}

.edit-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: white;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 50%;
    display: none;
}

.image-container:hover .edit-icon {
    display: block;
}

#fileInput {
    display: none;
}
  </style>
  <?php $fila = $this->db->get_where('productos', array('id' => $id))->row_array(); ?>
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left">
      <h4 class="page-title"><?= isset($fila) ? 'Editar' : 'Agregar' ?></h4>
      <br>
      <form id="propertyForm" enctype="multipart/form-data" action="<?= base_url('portal/add_edit_product/saveProduct') ?>" method="post">
            <input type="hidden" name="id" value="<?= isset($fila) ? $fila['id'] : '' ?>">
            <input type="hidden" name="type" value="<?= $type; ?>">
            <div class="row">
                <div class="col-lg-12 row">
                    <div class="<?= $type != 3 ? 'col-md-6' : 'col-md-12';?> ">
                      <div class="widget-box-2 mb-20">
                          <h5 class="title">Seleccionar Imagen Principal</h5>
                          <?php $main_image = $this->db->get_where('producto_images',array('product_id'=>$fila['id'],'is_main'=>1))->first_row()->image_url; ?>
                          <center>
                              <div class="image-container" onclick="showModalLG('<?= base_url(); ?>modal/popup/modal_add_images/single/main_image');">
                                  <img id="main_image" src="<?php if( isset($fila)):
                                                                        if (strpos($main_image, 'public') !== false): echo base_url() . $main_image; 
                                                                        else: echo  'http://d39ru7awumhhs2.cloudfront.net/' . $main_image; 
                                                                        endif;
                                                                    else: echo base_url() . 'public/uploads/gallery/no_image.png'; endif; ?>" alt="Imagen actual">
                                  <input type="hidden" name="main_image" value="<?= isset($fila) ? $main_image : '' ?>">
                                  <div class="edit-icon">
                                      <i class="fas fa-pen"></i>
                                  </div>
                              </div>
                          </center>
                        </div>
                    </div>
                    <div class="<?= $type != 3 ? 'col-md-6' : 'd-none';?>">
                      <div class="widget-box-2 mb-20">
                          <h5 class="title">Imagenes adicionales</h5>
                          <div class="row" id="extra_images">
                            <?php 
                                $extra_image = $this->db->get_where('producto_images',array('product_id'=>$fila['id'],'is_main'=>0))->result_array();
                                $image_urls = array_column($extra_image, 'image_url'); // Extrae solo los valores de image_url
                                $joined_urls = implode(',', $image_urls)
                             ?>
                              <div style="cursor: grab;" class="item-upload file-delete image-container" onclick="showModalLG('<?= base_url(); ?>modal/popup/modal_add_images/multiple/extra_images');">
                                  <img src="<?= base_url(); ?>public/uploads/gallery/no_image.png" alt="img">
                                  <input type="hidden" name="extra_images" value="<?= $joined_urls; ?>">
                                  <div class="edit-icon">
                                      <i class="fas fa-plus"></i>
                                  </div>
                              </div>
                              
                              <?php foreach($extra_image as $e): ?>
                              
                              <?php 
                                    if (strpos($e['image_url'], 'public') !== false): 
                                          $src = base_url() . $e['image_url']; 
                                    else: 
                                          $src ='http://d39ru7awumhhs2.cloudfront.net/' . $e['image_url']; 
                                    endif;
                                      ?>
                                      
                              <div class="col-md-3">
                                  <div class="item-upload file-delete" data-filename="<?= $e['image_url']; ?>" data-container="extra_images">
                                      <img src="<?= $src?>" alt="img">
                                      <span class="icon icon-trash remove-file remove-image"><i class="fas fa-trash"></i></span>
                                  </div>
                              </div>
                              <?php endforeach; ?>
                          </div>
                      </div>
                    </div>
                    
                    <div class="col-lg-12">
                        <div class="widget-box-2 mb-20">
                          <h5 class="title">Información</h5>
                          <div class="box-info-property">
                              <div class="row g-3">
                                  
                                  <div class=" <?= $type != 3 ? 'col-md-8' : 'col-md-12';?>">
                                      <label class="form-label">Nombre</label>
                                      <input type="text" name="name" class="form-control" value="<?= isset($fila) ? $fila['name'] : '' ?>">
                                  </div>
                                  <div class="<?= $type != 3 ? 'col-md-4' : 'd-none';?>">
                                      <label class="form-label">SKU</label>
                                      <input type="text" name="sku" class="form-control" value="<?= isset($fila) ? $fila['sku'] : '' ?>">
                                  </div>
                                  <div class="col-12">
                                      <label class="form-label">Descripción</label>
                                      <textarea name="description" class="form-control" rows="2"><?= isset($fila) ? $fila['description'] : '' ?></textarea>
                                  </div>
                                  <div class="<?= $type != 3 ? 'col-md-6' : 'd-none';?>">
                                      <label class="form-label">Precio de venta</label>
                                      <input type="number" step="0.01" name="sale_price" class="form-control" value="<?= isset($fila) ? $fila['sale_price'] : '' ?>">
                                  </div>
                                  <div class="<?= $type != 3 ? 'col-md-6' : 'col-md-12';?>">
                                      <label class="form-label">Precio sugerido</label>
                                      <input type="number" step="0.01" name="suggested_price" class="form-control" value="<?= isset($fila) ? $fila['suggested_price'] : '' ?>">
                                  </div>
                                  <div class="<?= $type != 3 ? 'col-md-12' : 'd-none';?>">
                                      <label for="phone">Seleccionar proveedor</label>
                                      <select class="form-control select2" data-choices name="supplier_id" id="choices-single-default" >
                                          <option value="">Seleccionar</option>
                                          <?php
                                          if($user_type == 3):
                                                $com = $this->db->where('user_id',$this->session->userdata('login_user_id'))->get('user')->result_array();
                                            else:
                                                $com = $this->db->where('type',3)->where('status',1)->get('user')->result_array();
                                            endif;
                                                foreach($com as $c):
                                            ?>
                                          <option value="<?= $c['user_id']; ?>" <?php if(isset($fila)) { echo $fila['supplier_id'] == $c['user_id'] ? 'selected':$user_type == 3 ? 'selected':''; } ?>><?= $c['name']; ?></option>
                                          <?php endforeach; ?>
                                      </select>
                                  </div>
                                  <div class="<?= $type != 3 ? 'col-md-12' : 'd-none';?>">
                                      <label for="phone">Seleccionar categoría</label>
                                      <select class="form-control select2" name="categories_id[]" multiple>
                                          <option value="">Seleccionar</option>
                                          <?php
                                                $selected_categories = [];
                                                if (isset($fila)) {
                                                    $query = $this->db->get_where('product_categories',['product_id'=>$fila['id']]);
                                                    foreach ($query->result_array() as $row) {
                                                        $selected_categories[] = $row['category_id'];
                                                    }
                                                }
                                                
                                                $com = $this->db->get('categories')->result_array();
                                                foreach($com as $c):
                                            ?>
                                            <option value="<?= $c['id']; ?>" <?= (in_array($c['id'], $selected_categories)) ? 'selected' : ''; ?>>
                                                <?= $c['name']; ?>
                                            </option>
                                          <?php endforeach; ?>
                                      </select>
                                  </div>
                              </div>
                          </div>
                      </div>
                    </div>
                    <div class="col-lg-12">
                        <div class="box-btn">
                          <button type="submit" class="tf-btn primary">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>  
      </form>


  </div>
</div>
  <!-- End Container Fluid -->
  <br>
  <script>
$(document).ready(function() {
    $('.select2').select2();
     $(document).on('click', '.remove-image', function () {
        const item = $(this).closest('.item-upload');
        const filename = item.data('filename'); // debe incluir ruta relativa exacta
        const container = item.data('container');

        console.log("Eliminando:", filename);
        // Eliminar visualmente el bloque
        item.parent().remove();

        // Obtener el input
        const $input = $('input[name="' + container + '"]');
        let imagesArray = $input.val().split(',');

        // Eliminar el filename exacto del array
        imagesArray = imagesArray.filter(image => image.trim() !== filename.trim());

        // Actualizar el input
        $input.val(imagesArray.join(','));

        console.log("Actualizado:", $input.val());
    });
});
  </script>