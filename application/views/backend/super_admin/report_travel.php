<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="row">
            <div class="col-xl-12">

                <!-- HEADER -->
                <div class="card shadow-xss w-100 d-flex border-0 p-4 mb-3">
                    <div class="card-body d-flex align-items-center p-0">
                        <h2 class="fw-700 mb-0 font-md text-grey-900">Reporte de viajes</h2>

                        <!-- BUSCADOR RÁPIDO -->
                        <form method="get" action="<?= site_url('report_travel') ?>" class="search-form-2 ms-auto">
                            <i class="ti-search font-xss"></i>
                            <input type="text" name="code"
                                   value="<?= $this->input->get('code') ?>"
                                   class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0"
                                   placeholder="Buscar por código">
                        </form>

                        <!-- BOTÓN FILTROS -->
                        <a href="#" class="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"
                           onclick="showAjaxModal('<?= base_url() ?>modal/popup/reports_filters/');">
                            <i class="feather-filter font-xss text-grey-500"></i>
                        </a>
                    </div>
                </div>

                <!-- TARJETAS RESUMEN -->
                <div class="card shadow-xss rounded-xxl border-0 mb-3 mt-3">
                    <div class="card-body d-flex align-items-center p-4">
                        <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de viajes</h4>
                    </div>

                    <div class="card-body pt-0 ps-4 pe-4 pb-3">
                        <div class="row">

                            <div class="col-lg-3">
                                <div class="card border-0 p-4 rounded-xxl mb-3" style="background:#e5f6ff;">
                                    <div class="d-flex">
                                        <i class="btn-round-lg me-3 bg-primary feather-home text-white"></i>
                                        <h4 class="text-primary fw-700">2.3M
                                            <span class="d-block text-grey-500 font-xssss">day visiter</span>
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-3">
                                <div class="card border-0 p-4 rounded-xxl mb-3" style="background:#f6f3ff;">
                                    <div class="d-flex">
                                        <i class="btn-round-lg me-3 bg-secondary feather-lock text-white"></i>
                                        <h4 class="text-secondary fw-700">44.6K
                                            <span class="d-block text-grey-500 font-xssss">total user</span>
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-3">
                                <div class="card border-0 p-4 rounded-xxl mb-3" style="background:#e2f6e9;">
                                    <div class="d-flex">
                                        <i class="btn-round-lg me-3 bg-success feather-command text-white"></i>
                                        <h4 class="text-success fw-700">603
                                            <span class="d-block text-grey-500 font-xssss">monthly sale</span>
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-3">
                                <div class="card border-0 p-4 rounded-xxl mb-3" style="background:#fff0e9;">
                                    <div class="d-flex">
                                        <i class="btn-round-lg me-3 bg-warning feather-shopping-bag text-white"></i>
                                        <h4 class="text-warning fw-700">3M
                                            <span class="d-block text-grey-500 font-xssss">day visiter</span>
                                        </h4>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- TABLA -->
                <div class="card shadow-xss rounded-xxl border-0 mb-3 mt-3">
                    <div class="card-body table-responsive">
                        <table class="table  align-middle">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Usuario</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (!empty($sales)) : foreach ($sales as $row) : ?>
                                    <tr>
                                        <td><?= $row->code ?></td>
                                        <td><?= $row->name ?></td>
                                        <td><?= $row->user_id ?></td>
                                        <td><?= $row->client_id ?></td>
                                        <td><?= date('Y-m-d', strtotime($row->datetime)) ?></td>
                                        <td><?= number_format($row->total_client, 2) ?></td>
                                        <td><?= $row->status ?></td>
                                    </tr>
                                <?php endforeach; else: ?>
                                    <tr>
                                        <td colspan="7" class="text-center">Sin resultados</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>


