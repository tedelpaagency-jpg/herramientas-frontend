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

                    <!-- SOLO ESTE ACTIVA EL COLLAPSE -->
                    <h4 class="font-xs fw-600 ms-4 mb-0 mt-2 d-flex align-items-center text-white"
                        data-bs-toggle="collapse" data-bs-target="#collapseAjustes" style="cursor:pointer;">

                        <span>Ajustes de la tienda</span>

                        <i class="feather-chevron-down collapse-icon ms-2"></i>
                    </h4>
                </div>
            </div>
            <div id="collapseAjustes" class="collapse ">
                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                    <form class="app-form rounded-control row g-3 needs-validation mt-2" novalidate=""
                        action="<?php echo base_url('portal/settings/saveSettings'); ?>" method="post"
                        enctype="multipart/form-data">
                        <div class="col-md-12">
                            <label class="form-label" for="validationCustom01">Nombre de la tienda</label>
                            <input class="form-control" id="validationCustom01" placeholder="Nombre de la tienda"
                                required="" value="<?php echo $this->crud_model->getInfo('system_name'); ?>" name="name"
                                type="text" />
                            <div class="invalid-feedback">
                                Debe ingresar un nombre
                            </div>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label" for="validationCustom01">Descipción</label>
                            <textarea class="form-control" id="validationCustom01" required=""
                                name="description"><?php echo $this->crud_model->getInfo('description'); ?></textarea>
                            <div class="invalid-feedback">
                                Debe ingresar una descipcion del sistema
                            </div>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label" for="validationCustom01">Dirección completa</label>
                            <textarea class="form-control" id="validationCustom01" required=""
                                name="address"><?php echo $this->crud_model->getInfo('address'); ?></textarea>
                            <div class="invalid-feedback">
                                Debe ingresar una dirección
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label" for="validationCustom01">Número de teléfono</label>
                            <input class="form-control" id="validationCustom01" placeholder="+56 9 9999 9999"
                                required="" value="<?php echo $this->crud_model->getInfo('phone'); ?>" name="phone"
                                type="text" />
                            <div class="invalid-feedback">
                                Debe ingresar un número de teléfono
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label" for="validationCustom01">Correo electrónico</label>
                            <input class="form-control" id="validationCustom01" placeholder="correo@gmail.com"
                                required="" value="<?php echo $this->crud_model->getInfo('email'); ?>" name="email"
                                type="text" />
                            <div class="invalid-feedback">
                                Debe ingresar un correo electrónico
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="validationCustom01">Costo Adicional a productos</label>
                            <input class="form-control" id="validationCustom01" placeholder="" required=""
                                value="<?php echo $this->crud_model->getInfo('cost_sale_price'); ?>"
                                name="cost_sale_price" type="text" />
                            <div class="invalid-feedback">
                                Debe ingresar un número de teléfono
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="validationCustom01">Costo de envio</label>
                            <input class="form-control" id="validationCustom01" placeholder="" required=""
                                value="<?php echo $this->crud_model->getInfo('cost_delivery'); ?>" name="cost_delivery"
                                type="text" />
                            <div class="invalid-feedback">
                                Debe ingresar un número de teléfono
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="validationCustom01">Costo adicional de envio</label>
                            <input class="form-control" id="validationCustom01" placeholder="" required=""
                                value="<?php echo $this->crud_model->getInfo('cost_delivery_aditional'); ?>"
                                name="cost_delivery_aditional" type="text" />
                            <div class="invalid-feedback">
                                Debe ingresar un número de teléfono
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="validationCustom01">Facebook</label>
                            <input class="form-control" id="validationCustom01"
                                placeholder="https://www.facebook.com/usuario"
                                value="<?php echo $this->crud_model->getInfo('facebook'); ?>" name="facebook"
                                type="text" />
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="validationCustom01">Instagram</label>
                            <input class="form-control" id="validationCustom01"
                                placeholder="https://www.instagram.com/usuario"
                                value="<?php echo $this->crud_model->getInfo('instagram'); ?>" name="instagram"
                                type="text" />
                        </div>
                        <div class="col-md-4">
                            <label class="form-label" for="validationCustom01">Ticktock</label>
                            <input class="form-control" id="validationCustom01"
                                placeholder="https://www.ticktock.com/usuario"
                                value="<?php echo $this->crud_model->getInfo('ticktock'); ?>" name="ticktock"
                                type="text" />
                        </div>
                        <div class="col-md-6">
                            <div class="widget-box-2 mb-20">
                                <h5 class="title">Logo</h5>
                                <center>
                                    <div class="image-container" style="position: relative; display: inline-block;">
                                        <img id="logoPreview"
                                            src="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('logo'); ?>"
                                            alt="Imagen actual"
                                            style="width: 200px; height: auto; border: 1px solid #ccc; border-radius: 8px;">

                                        <!-- Input oculto para seleccionar imagen -->
                                        <input type="file" name="logo" id="logoFile" style="display: none;"
                                            accept="image/*">

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
                                        <img id="faviPreview"
                                            src="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfo('favicon'); ?>"
                                            alt="Imagen actual"
                                            style="width: 200px; height: auto; border: 1px solid #ccc; border-radius: 8px;">

                                        <!-- Input oculto para seleccionar imagen -->
                                        <input type="file" name="favicon" id="faviFile" style="display: none;"
                                            accept="image/*">


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
                            <button type="submit" class="btn btn-primary text-center  text-white">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
            <div class="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                <div class="border-0 d-flex">

                    <!-- SOLO ESTE ACTIVA EL COLLAPSE -->
                    <h4 class="font-xs fw-600 ms-4 mb-0 mt-2 d-flex align-items-center text-white"
                        data-bs-toggle="collapse" data-bs-target="#collapseCapacitaciones" style="cursor:pointer;">

                        <span>Capacitaciones</span>

                        <i class="feather-chevron-down collapse-icon ms-2"></i>
                    </h4>
                    <div style="position: absolute; right: 12px;">
                        <a href="javascript:void(0)"
                            onclick="showAjaxModal('<?= base_url(); ?>modal/popup/iframe_form/')"
                            class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i
                                class="feather-plus-circle font-xss "></i></a>
                    </div>
                </div>
            </div>
            <div id="collapseCapacitaciones" class="collapse ">
                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                    <div class="app-datatable-default overflow-auto">
                        <table class="display table table-striped text-nowrap" id="example">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descipción</th>
                                    <th>Url</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php 
                                        
                                        $states = $this->db->where('status',1)->get('iframes')->result();
                                        foreach($states as $state): 
                                    ?>
                                <tr>
                                    <td><?php echo $state->id; ?></td>
                                    <td><?php echo $state->titulo; ?></td>
                                    <td><?php echo $state->descripcion; ?></td>
                                    <td><a href="<?php echo $state->iframes; ?>"
                                            target="_blank"><?php echo $state->url; ?></a></td>
                                    <td>
                                        <a href="javascript:void(0)"
                                            onclick="showAjaxModal('<?= base_url(); ?>modal/popup/iframe_form/<?= $state->id; ?>')"
                                            class="btn btn-light-warning icon-btn b-r-4"><i class="ti ti-edit"></i></a>
                                        <a href="javascript:void(0)" class="btn btn-light-danger icon-btn b-r-4"
                                            onclick="delete_element('portal/iframes/deleteIframe/<?= $state->id; ?>')"><i
                                                class="ti ti-trash"></i></i></a>

                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
        <div class="card shadow-xss rounded-xxl border-0 mb-3 mt-3">

            <!-- HEADER (CLICK PARA COLAPSAR) -->
            <div class="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">

                <div class="border-0 d-flex w-100 align-items-center">

                    <!-- SOLO ESTE ACTIVA EL COLLAPSE -->
                    <h4 class="font-xs fw-600 ms-4 mb-0 mt-2 d-flex align-items-center text-white"
                        data-bs-toggle="collapse" data-bs-target="#collapsePaises" style="cursor:pointer;">

                        <span>Paises</span>

                        <i class="feather-chevron-down collapse-icon ms-2"></i>
                    </h4>

                    <!-- BOTÓN SEPARADO -->
                    <div style="position: absolute; right: 12px;">
                        <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/pais_form/')"
                            class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white">
                            <i class="feather-plus-circle font-xss"></i>
                        </a>
                    </div>

                </div>
            </div>

            <!-- CONTENIDO COLAPSABLE -->
            <div id="collapsePaises" class="collapse ">
                <div class="card-body pt-0 ps-4 pe-4 pb-3">
                    <div class="app-datatable-default overflow-auto">
                        <table class="display table table-striped text-nowrap">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Extension</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php 
                                        $states = $this->db->get('pais')->result();
                                        foreach($states as $state): 
                                    ?>
                                <tr>
                                    <td><?= $state->id; ?></td>
                                    <td><?= $state->nombre; ?></td>
                                    <td>+<?= $state->code; ?></td>
                                    <td>
                                        <a href="javascript:void(0)"
                                            onclick="showAjaxModal('<?= base_url(); ?>modal/popup/pais_form/<?= $state->id; ?>')"
                                            class="badge border border-warning text-warning bg-transparent">
                                            <i class="fa-solid fa-pencil fa-fw"></i>
                                        </a>

                                        <a href="javascript:void(0)"
                                            class="badge border border-danger text-danger bg-transparent"
                                            onclick="delete_element('portal/pais/delete/<?= $state->id; ?>')">
                                            <i class="fa-solid fa-trash fa-fw"></i>
                                        </a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
            <div class="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                <div class="border-0 d-flex">

                    <!-- SOLO ESTE ACTIVA EL COLLAPSE -->
                    <h4 class="font-xs fw-600 ms-4 mb-0 mt-2 d-flex align-items-center text-white"
                        data-bs-toggle="collapse" data-bs-target="#collapseCorreos" style="cursor:pointer;">

                        <span>Correos</span>

                        <i class="feather-chevron-down collapse-icon ms-2"></i>
                    </h4>

                    <div style="position: absolute; right: 12px;">
                        <a href="javascript:void(0)"
                            onclick="showAjaxModal('<?= base_url(); ?>modal/popup/email_form/')"
                            class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i
                                class="feather-plus-circle font-xss "></i></a>
                    </div>
                </div>
            </div>
            <div id="collapseCorreos" class="collapse ">
                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                    <div class="app-datatable-default overflow-auto">
                        <table class="display table table-striped text-nowrap" id="example">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Plantilla</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php  $templates = $this->db->get('email_templates')->result(); foreach($templates as $t): ?>
                                <tr>
                                    <td><?= $t->id; ?></td>
                                    <td><?= $t->name; ?></td>
                                    <td>
                                        <?php 
                                                $files = json_decode($t->files,true);
                                                foreach ($files as $file)
                                                {
                                                    echo '<a href="'.base_url('uploads/email_templates/'.$file).'" target="_blank" download  >'.$file.'</a><br>';
                                                }
                                            ?>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)"
                                            onclick="showAjaxModal('<?= base_url(); ?>modal/popup/email_form/<?= $t->id; ?>')">Editar</a>
                                        <a href="<?= base_url('portal/email_templates/delete/'.$t->id); ?>"
                                            onclick="return confirm('¿Eliminar?')">Eliminar</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
            <div class="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                <div class="border-0 d-flex">

                    <!-- SOLO ESTE ACTIVA EL COLLAPSE -->
                    <h4 class="font-xs fw-600 ms-4 mb-0 mt-2 d-flex align-items-center text-white"
                        data-bs-toggle="collapse" data-bs-target="#collapseesSpeciality" style="cursor:pointer;">

                        <span>Especialidades</span>

                        <i class="feather-chevron-down collapse-icon ms-2"></i>
                    </h4>

                    <div style="position: absolute; right: 12px;">
                        <a href="javascript:void(0)"
                            onclick="showAjaxModal('<?= base_url(); ?>modal/popup/especiality_form/')"
                            class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i
                                class="feather-plus-circle font-xss "></i></a>
                    </div>
                </div>
            </div>
            <div id="collapseesSpeciality" class="collapse ">
                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                    <div class="app-datatable-default overflow-auto">
                        <table class="display table table-striped text-nowrap" id="example">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php  $rows = $this->db->get('specialties')->result(); foreach($rows as $row): ?>
                                <tr>
                                    <td><?= $row->id; ?></td>
                                    <td><?= $row->name; ?></td>
                                    <td>
                                        <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/especiality_form/<?= $row->id; ?>')">Editar</a>
                                        <a href="<?= base_url('portal/specialties/delete/'.$row->id); ?>"  onclick="return confirm('¿Eliminar?')">Eliminar</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
            <div class="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                <div class="border-0 d-flex">

                    <!-- SOLO ESTE ACTIVA EL COLLAPSE -->
                    <h4 class="font-xs fw-600 ms-4 mb-0 mt-2 d-flex align-items-center text-white"
                        data-bs-toggle="collapse" data-bs-target="#collapseesParameters" style="cursor:pointer;">

                        <span>Parametros Clínicos</span>

                        <i class="feather-chevron-down collapse-icon ms-2"></i>
                    </h4>

                    <div style="position: absolute; right: 12px;">
                        <a href="javascript:void(0)"
                            onclick="showAjaxModal('<?= base_url(); ?>modal/popup/clinical_parameters_form/')"
                            class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i
                                class="feather-plus-circle font-xss "></i></a>
                    </div>
                </div>
            </div>
            <div id="collapseesParameters" class="collapse ">
                <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                    <div class="app-datatable-default overflow-auto">
                        <table class="display table table-striped text-nowrap" id="example">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Icono</th>
                                    <th>Nombre</th>
                                    <th>Unidad</th>
                                    <th>Especialidad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php  $rows = $this->db->get('clinical_parameters')->result(); foreach($rows as $row): ?>
                                <tr>
                                    <td><?= $row->id; ?></td>
                                    <td><?= $row->icon; ?></td>
                                    <td><?= $row->name; ?></td>
                                    <td><?= $row->unit; ?></td>
                                    <td><?= $row->type != '' ? $this->db->get_where('specialties',['id'=>$row->type])->row()->name:'General'; ?></td>
                                    <td>
                                        <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/clinical_parameters_form/<?= $row->id; ?>')">Editar</a>
                                        <a href="<?= base_url('portal/specialties/delete/'.$row->id); ?>"  onclick="return confirm('¿Eliminar?')">Eliminar</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
document.querySelectorAll('.collapse').forEach(function(el) {

    el.addEventListener('show.bs.collapse', function() {
        let icon = document.querySelector('[data-bs-target="#' + el.id + '"] .collapse-icon');
        if (icon) icon.style.transform = 'rotate(180deg)';
    });

    el.addEventListener('hide.bs.collapse', function() {
        let icon = document.querySelector('[data-bs-target="#' + el.id + '"] .collapse-icon');
        if (icon) icon.style.transform = 'rotate(0deg)';
    });

});
</script>