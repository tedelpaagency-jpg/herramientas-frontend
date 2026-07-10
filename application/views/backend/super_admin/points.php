<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="row">
                <div class="col-xl-12">
                    <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                        <div class="card-body d-flex align-items-center p-0">
                            <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Puntos</h2>
                            <div class="search-form-2 ms-auto">
                                <i class="ti-search font-xss"></i>
                                <input type="text" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Buscar">
                            </div>
                            <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i class="feather-filter font-xss text-grey-500"></i></a>
                            <a href="javascript:void(0)" onclick="showAjaxModal('<?= base_url(); ?>modal/popup/points_form')" class="btn-round-md ms-2 bg-success theme-dark-bg rounded-3 text-white"><i class="feather-plus-circle font-xss "></i></a>
                        </div>
                    </div>

                    <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                        <div class="card-body d-flex align-items-center  p-4">
                            <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de puntos</h4>
                        </div>
                        <div class="card-body  pt-0 ps-4 pe-4 pb-3 ">
                             <div class="row">
                                <div class="col-xl-12 col-xxl-12 col-lg-12 mt-3  ">
                                    <div class="row">
                                        <div class="col-lg-4 pe-2 ps-2">
                                            <div class="card w-100 border-0 shadow-none p-4 rounded-xxl  mb-3" style="background-color: #f6f3ff;">
                                                <div class="card-body d-flex p-0">
                                                    <i class="btn-round-lg d-inline-block me-3 bg-secondary feather-lock font-md text-white"></i>
                                                    <h4 class="text-secondary font-xl fw-700"><?php $incoms  = $this->crud_model->get_total_amount_by_user(1); echo number_format($incoms,2,'.',','); ?> <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">📈 Ingresos</span></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 pe-2 ps-2">
                                            <div class="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3" style="background-color: #e2f6e9;">
                                                <div class="card-body d-flex p-0">
                                                    <i class="btn-round-lg d-inline-block me-3 bg-success feather-command font-md text-white"></i>
                                                    <h4 class="text-success font-xl fw-700"><?php $expenses  = $this->crud_model->get_total_amount_by_user(0); echo number_format($expenses,2,'.',','); ?><span class="fw-500 mt-0 d-block text-grey-500 font-xssss">📉 Retiros</span></h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-4 ps-2">
                                            <div class="card w-100 border-0 shadow-none p-4 rounded-xxl mb-3" style="background-color: #fff0e9;">
                                                <div class="card-body d-flex p-0">
                                                    <i class="btn-round-lg d-inline-block me-3 bg-warning feather-shopping-bag font-md text-white"></i>
                                                    <h4 class="text-warning font-xl fw-700"><?= number_format( $incoms-$expenses,2,'.',',') ?> <span class="fw-500 mt-0 d-block text-grey-500 font-xssss">💰 Balance</span></h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div> 
                            </div>
                        </div>
                    </div>
                    <div class="card  shadow-xss rounded-xxl border-0 mb-3 mt-3">
                            <div class="card-body">
                                <div class="table-responsive table-centered" style="padding:50px;">
                                        <table class="display table table-striped text-nowrap" id="example">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Fecha</th>
                                                    <th>Usuario</th>
                                                    <th>Monto</th>
                                                    <th>Tipo</th>
                                                    <th>Comprobante</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php $finanzas = $this->db->order_by('id','DESC')->get_where('points',[])->result(); ?>
                                                <?php foreach($finanzas as $finanza): ?>
                                                    <tr>
                                                        <td ><?php echo $finanza->id; ?></td>
                                                        <td><?php echo $finanza->date; ?></td>
                                                        <td>
                                                             <div class="d-flex align-items-center">
                                                                  <img src="<?= $this->crud_model->getPhoto('user',$finanza->user_id); ?>" alt="" class="avatar-xs rounded-circle me-2">
                                                                  <div>
                                                                      <h5 class="fs-14 m-0 fw-normal"><?php echo $this->crud_model->getName('user',$finanza->user_id); ?></h5>
                                                                  </div>
                                                              </div>
                                                        </td>
                                                        <td><?php echo $finanza->amount; ?></td>
                                                        <td><?php echo $finanza->type == 1 ? '<span class="badge border border-success text-success bg-transparent">Ingreso</span>':'<span class="badge border border-danger text-danger bg-transparentr">Retiro</span>'; ?>
                                                        </td>
                                                        <td>
                                                            <a href="<?= base_url().$finanza->photo; ?>" target="_blank"  class="badge border border-success text-success bg-transparent icon-btn b-r-4"><i class="ti ti-file "></i></a>
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

    </div>   <!-- end row-->

</div>
               <!-- End Container Fluid -->
               <script>
$(document).ready(function() {
    $('.copyLink').on('click', function(event) {
        event.preventDefault(); // Prevenir la acción predeterminada del enlace

        // Obtener el enlace
        var link = $(this).attr('href');

        // Crear un elemento temporal para copiar el texto
        var tempInput = $('<input>');
        $('body').append(tempInput);
        tempInput.val(link).select();
        document.execCommand('copy');
        tempInput.remove();

        // Mostrar el mensaje de alerta
           Toastify({
                      text: "Enlace copiado al portapapeles" ,
                      duration: 3000,
                      close: true,
                      gravity: "top", // `top` or `bottom`
                      position: "right", // `left`, `center` or `right`
                      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
                    }).showToast();
        
    });
});
</script>