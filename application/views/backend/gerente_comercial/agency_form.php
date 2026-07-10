<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />

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
<div class="modal-header bg-current">
    <div class="border-0 d-flex">
        <a type="button" data-bs-dismiss="modal" aria-label="Close" class="d-inline-block mt-2"><i class="ti-arrow-left font-sm text-white"></i></a>
        <h4 class="font-xs text-white fw-600 ms-4 mb-0 mt-2" id="exampleModalLabel">Agregar agencia</h4>    
    </div>
    
</div>
<form method="post" action="<?=  base_url('portal/agencies/saveAgency'); ?>" enctype="multipart/form-data">
    <input type="hidden" value="<?= $this->session->userdata('login_user_id'); ?>" name="gerente_id" />
<div class="modal-body row">
        <h4 class="fw-600 mb-3 mt-3 font-xssss text-grey-500 d-flex align-items-center ">Información</h4>
         <div class="col-md-12">
            <label class="form-label" for="validationCustom01">Nombre de la tienda</label>
            <input class="form-control" id="validationCustom01" placeholder="Nombre de la tienda" required="" value="" name="name" type="text" />
            <div class="invalid-feedback">
                Debe ingresar un nombre
            </div>
        </div>
         <div class="col-md-12">
            <label class="form-label" for="validationCustom01">Descripción</label>
            <textarea class="form-control" id="validationCustom01"required=""  name="description"  ></textarea>
            <div class="invalid-feedback">
                Debe ingresar una descipcion del sistema
            </div>
        </div>
        <div class="col-md-12">
            <label class="form-label" for="validationCustom01">Dirección completa</label>
            <textarea class="form-control" id="validationCustom01"required=""  name="address"  ></textarea>
            <div class="invalid-feedback">
                Debe ingresar una dirección
            </div>
        </div>
        <div class="col-md-6">
            <label class="form-label" for="validationCustom01">Número de teléfono</label>
            <input class="form-control" id="validationCustom01" placeholder="+56 9 9999 9999" required="" value="" name="phone" type="text" />
            <div class="invalid-feedback">
                Debe ingresar un número de teléfono
            </div>
        </div>
        <div class="col-md-6">
            <label class="form-label" for="validationCustom01">Correo electrónico</label>
            <input class="form-control" id="validationCustom01" placeholder="correo@gmail.com" required="" value="" name="email" type="text" />
            <div class="invalid-feedback">
                Debe ingresar un correo electrónico
            </div>
        </div>
        <div class="col-md-4">
            <label class="form-label" for="validationCustom01">Costo Adicional a productos</label>
            <input class="form-control" id="validationCustom01" placeholder="" required="" value="" name="cost_sale_price" type="text" />
            <div class="invalid-feedback">
                Debe ingresar un número de teléfono
            </div>
        </div>
        <div class="col-md-4">
            <label class="form-label" for="validationCustom01">Costo de envio</label>
            <input class="form-control" id="validationCustom01" placeholder="" required="" value="" name="cost_delivery" type="text" />
            <div class="invalid-feedback">
                Debe ingresar un número de teléfono
            </div>
        </div>
        <div class="col-md-4">
            <label class="form-label" for="validationCustom01">Costo adicional de envio</label>
            <input class="form-control" id="validationCustom01" placeholder="" required="" value="" name="cost_delivery_aditional" type="text" />
            <div class="invalid-feedback">
                Debe ingresar un número de teléfono
            </div>
        </div>
        <div class="col-md-4">
            <label class="form-label" for="validationCustom01">Facebook</label>
            <input class="form-control" id="validationCustom01" placeholder="https://www.facebook.com/usuario"  value="" name="facebook" type="text"   />
        </div>
        <div class="col-md-4">
            <label class="form-label" for="validationCustom01">Instagram</label>
            <input class="form-control" id="validationCustom01" placeholder="https://www.instagram.com/usuario"  value="" name="instagram" type="text" />
        </div>
        <div class="col-md-4">
            <label class="form-label" for="validationCustom01">Ticktock</label>
            <input class="form-control" id="validationCustom01" placeholder="https://www.ticktock.com/usuario" value="" name="ticktock" type="text"  />
        </div>
        <div class="col-md-6">
            <div class="widget-box-2 mb-20">
                <h5 class="title">Logo</h5>
                <center>
                    <div class="image-container" style="position: relative; display: inline-block;">
                        <img id="logoPreview" src="<?= base_url(); ?>public/assets/images/logo/ziigo.png" alt="Imagen actual" style="width: 200px; height: auto; border: 1px solid #ccc; border-radius: 8px;">

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
                        <img id="faviPreview" src="<?= base_url(); ?>public/assets/images/logo/ziigo.png" alt="Imagen actual" style="width: 200px; height: auto; border: 1px solid #ccc; border-radius: 8px;">

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
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
    <button type="submit" class="btn btn-primary text-center  text-white">Agregar</button>
</div>
</form>
