<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left pe-0">
        <div class="row">
            <div class="col-xl-12">
                <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                    <div class="card-body d-flex align-items-center p-0">
                        <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Solicitudes de Canje (Premios)</h2>
                    </div>
                </div>

                <div class="row ps-2 pe-1">
                    <div class="card shadow-xss rounded-xxl border-0 mb-3 mt-3">
                        <div class="card-body d-flex align-items-center p-4">
                            <h4 class="fw-700 mb-0 font-xssss text-grey-900">Listado de Solicitudes</h4>
                        </div>
                        <div class="card-body pt-0 ps-4 pe-4 pb-3">
                            <div class="table-responsive">
                                <table class="table" id="dataTable">
                                    <thead>
                                        <tr class="fw-700 font-xssss text-grey-900 pt-3 pb-3">
                                            <th>ID</th>
                                            <th>Clínica / Agencia</th>
                                            <th>Puntos Actuales</th>
                                            <th>Premio Solicitado</th>
                                            <th>Puntos Requeridos</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php 
                                            $requests = $this->crud_model->getAgencyRewardsRequests();
                                            foreach($requests as $req): 
                                                $agency_name = $this->crud_model->getInfoAgency('name', $req->agency_id);
                                                $current_points = $this->crud_model->getUserPointsTotal('agency', $req->agency_id);
                                                $reward = $this->crud_model->getReward($req->reward_id);
                                        ?>
                                            <tr>
                                                <td><?= $req->id; ?></td>
                                                <td><strong><?= htmlspecialchars($agency_name); ?></strong></td>
                                                <td>
                                                    <span class="badge border border-primary text-primary bg-transparent font-xssss">
                                                        <?= number_format($current_points, 2); ?> pts
                                                    </span>
                                                </td>
                                                <td>
                                                     <div class="d-flex align-items-center">
                                                         <img src="<?= $this->crud_model->getPhotoReward($req->reward_id); ?>" alt="" class="avatar-xs rounded-3 me-2" style="width: 35px; height: 35px; object-fit: cover;">
                                                         <strong><?= $reward ? htmlspecialchars($reward->name) : 'Premio Eliminado'; ?></strong>
                                                     </div>
                                                 </td>
                                                <td>
                                                    <span class="badge border border-warning text-warning bg-transparent font-xssss">
                                                        <?= number_format($req->points); ?> pts
                                                    </span>
                                                </td>
                                                <td>
                                                    <?php if ($current_points >= $req->points): ?>
                                                        <a href="<?= base_url(); ?>portal/agency_rewards_requests/approve/<?= base64_encode($req->id); ?>"
                                                           onclick="return confirm('¿Confirmar aprobación del canje? Se descontarán <?= $req->points; ?> puntos de la clínica.');"
                                                           class="badge bg-success text-white p-2 me-2">
                                                            <i class="feather-check-circle"></i> Aprobar
                                                        </a>
                                                    <?php else: ?>
                                                        <button class="badge bg-secondary text-white p-2 me-2" disabled title="Puntos insuficientes">
                                                            <i class="feather-alert-triangle"></i> Puntos Insuficientes
                                                        </button>
                                                    <?php endif; ?>
                                                    <a href="<?= base_url(); ?>portal/agency_rewards_requests/reject/<?= base64_encode($req->id); ?>"
                                                       onclick="return confirm('¿Confirmar rechazo del canje?');"
                                                       class="badge bg-danger text-white p-2">
                                                        <i class="feather-x-circle"></i> Rechazar
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
            </div>
        </div>
    </div>
</div>
