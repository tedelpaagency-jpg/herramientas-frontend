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
<div class="middle-sidebar-bottom">
        <div class="middle-sidebar-left">
             <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                                <div class="border-0 d-flex">
                                    <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel">Ajustes de la tienda</h4>    
                                </div>
                            </div>
                            <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                                
                                <form class="app-form rounded-control row g-3 needs-validation mt-2" novalidate="" action="<?php echo base_url('portal/settings/saveSettings'); ?>" method="post" enctype="multipart/form-data">
                        <div class="col-md-12">
                            <label class="form-label" for="validationCustom01">Nombre de la tienda</label>
                            <input class="form-control" id="validationCustom01" placeholder="Nombre de la tienda" required="" value="<?php echo $this->crud_model->getInfo('system_name'); ?>" name="name" type="text" />
                            <div class="invalid-feedback">
                                Debe ingresar un nombre
                            </div>
                        </div>
                         <div class="col-md-12">
                            <label class="form-label" for="validationCustom01">Descipción</label>
                            <textarea class="form-control" id="validationCustom01"required=""  name="description"  ><?php echo $this->crud_model->getInfo('description'); ?></textarea>
                            <div class="invalid-feedback">
                                Debe ingresar una descipcion del sistema
                            </div>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label" for="validationCustom01">Dirección completa</label>
                            <textarea class="form-control" id="validationCustom01"required=""  name="address"  ><?php echo $this->crud_model->getInfo('address'); ?></textarea>
                            <div class="invalid-feedback">
                                Debe ingresar una dirección
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label" for="validationCustom01">Número de teléfono</label>
                            <input class="form-control" id="validationCustom01" placeholder="+56 9 9999 9999" required="" value="<?php echo $this->crud_model->getInfo('phone'); ?>" name="phone" type="text" />
                            <div class="invalid-feedback">
                                Debe ingresar un número de teléfono
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label" for="validationCustom01">Correo electrónico</label>
                            <input class="form-control" id="validationCustom01" placeholder="correo@gmail.com" required="" value="<?php echo $this->crud_model->getInfo('email'); ?>" name="email" type="text" />
                            <div class="invalid-feedback">
                                Debe ingresar un correo electrónico
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="validationCustom01">Costo Adicional a productos</label>
                            <input class="form-control" id="validationCustom01" placeholder="" required="" value="<?php echo $this->crud_model->getInfo('cost_sale_price'); ?>" name="cost_sale_price" type="text" />
                            <div class="invalid-feedback">
                                Debe ingresar un número de teléfono
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="validationCustom01">Costo de envio</label>
                            <input class="form-control" id="validationCustom01" placeholder="" required="" value="<?php echo $this->crud_model->getInfo('cost_delivery'); ?>" name="cost_delivery" type="text" />
                            <div class="invalid-feedback">
                                Debe ingresar un número de teléfono
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="validationCustom01">Costo adicional de envio</label>
                            <input class="form-control" id="validationCustom01" placeholder="" required="" value="<?php echo $this->crud_model->getInfo('cost_delivery_aditional'); ?>" name="cost_delivery_aditional" type="text" />
                            <div class="invalid-feedback">
                                Debe ingresar un número de teléfono
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="validationCustom01">Facebook</label>
                            <input class="form-control" id="validationCustom01" placeholder="https://www.facebook.com/usuario"  value="<?php echo $this->crud_model->getInfo('facebook'); ?>" name="facebook" type="text"   />
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="validationCustom01">Instagram</label>
                            <input class="form-control" id="validationCustom01" placeholder="https://www.instagram.com/usuario"  value="<?php echo $this->crud_model->getInfo('instagram'); ?>" name="instagram" type="text" />
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="validationCustom01">Ticktock</label>
                            <input class="form-control" id="validationCustom01" placeholder="https://www.ticktock.com/usuario" value="<?php echo $this->crud_model->getInfo('ticktock'); ?>" name="ticktock" type="text"  />
                        </div>
                        <div class="col-md-6">
                            <div class="widget-box-2 mb-20">
                                <h5 class="title">Logo</h5>
                                <center>
                                    <div class="image-container" style="position: relative; display: inline-block;">
                                        <img id="logoPreview" src="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('logo'); ?>" alt="Imagen actual" style="width: 200px; height: auto; border: 1px solid #ccc; border-radius: 8px;">

                                        <!-- Input oculto para seleccionar imagen -->
                                        <input type="file" name="logo" id="logoFile" style="display: none;" accept="image/*">
                                       
                                        <!-- Ícono para activar selección -->
                                        <div class="edit-icon" onclick="document.getElementById('logoFile').click();">
                                            <i class="fas fa-pen"></i>
                                        </div>
                                    </div>
                                </center>

                                <script>
                                document.getElementById('logoFile').addEventListener('change', function(event) {
                                    const file = event.target.files[0];
                                    if (file) {
                                        // Mostrar previsualización
                                        const reader = new FileReader();
                                        reader.onload = function(e) {
                                            document.getElementById('logoPreview').src = e.target.result;
                                        };
                                        reader.readAsDataURL(file);

                                    }
                                });
                                </script>

                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="widget-box-2 mb-20">
                                <h5 class="title">Favicon</h5>
                                <center>
                                    <div class="image-container" style="position: relative; display: inline-block;">
                                        <img id="faviPreview" src="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('favicon'); ?>" alt="Imagen actual" style="width: 200px; height: auto; border: 1px solid #ccc; border-radius: 8px;">

                                        <!-- Input oculto para seleccionar imagen -->
                                        <input type="file" name="favicon" id="faviFile" style="display: none;" accept="image/*">

                                       
                                        <!-- Ícono para activar selección -->
                                        <div class="edit-icon" onclick="document.getElementById('faviFile').click();">
                                            <i class="fas fa-pen"></i>
                                        </div>
                                    </div>
                                </center>

                                <script>
                                document.getElementById('faviFile').addEventListener('change', function(event) {
                                    const file = event.target.files[0];
                                    if (file) {
                                        // Mostrar previsualización
                                        const reader = new FileReader();
                                        reader.onload = function(e) {
                                            document.getElementById('faviPreview').src = e.target.result;
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                });
                                </script>

                            </div>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label" for="validationCustom01">Proveedores de dropi</label>
                            <select class="form-control select2" name="dropi_suppliers_list[]" multiple="">
                                <?php $suppliers_selected = json_decode($this->crud_model->getInfo('dropi_suppliers'),true); ?>
                                <?php $suppliers = $this->db->get_where('suppliers',['status'=>1])->result_array(); ?>
                                <?php foreach($suppliers as $supplier): ?>
                                    <option value="<?= $supplier['id']; ?>" <?php if(in_array($supplier['id'],$suppliers_selected)) echo 'selected'; ?> ><?= $supplier['store_name']; ?></option>
                                <?php endforeach;?>
                            </select>
                        </div>
                        <div class="col-md-12">
                                        <button type="submit" class="btn btn-primary text-center  text-white">Guardar</button>
                                    </div>
                    </form>
                            </div>
                        </div>
        </div>
</div>