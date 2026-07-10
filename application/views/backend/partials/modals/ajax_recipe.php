<div class="cw-modal-header">
    <h3 class="cw-modal-title">
        <i data-lucide="eye"></i>
        Detalle de Receta
    </h3>

    <button class="cw-btn-close" onclick="closeModal('cwRecipeModal')">
        <i data-lucide="x"></i>
    </button>
</div>

<div class="cw-modal-body">

    <div class="cw-modal-patient-info">

        <div class="p-item">
            <span class="lbl">PACIENTE</span>
            <span class="val"><?= $prescription['name'].' '.$prescription['last_name']; ?></span>
        </div>

        <div class="p-item">
            <span class="lbl">TELÉFONO</span>
            <span class="val"><?= $prescription['phone']; ?></span>
        </div>

        <div class="p-item ms-md-auto">
            <span class="lbl">FECHA</span>
            <span class="val"><?= date('d/m/Y H:i',strtotime($prescription['created_at'])); ?></span>
        </div>

    </div>

    <div class="cw-timeline">

        <div class="cw-timeline-node">

            <div class="cw-tl-date">
                <?= strtoupper(strftime('%d %B %Y',strtotime($prescription['created_at']))); ?>
            </div>

            <div class="cw-tl-title">
                <?= $prescription['comment'] ?: 'Consulta médica'; ?>
            </div>

            <?php
            $meds=[];
            $labs=[];

            foreach($details as $d){

                if($d['type']=='med')
                    $meds[]=$d;
                else
                    $labs[]=$d;

            }
            ?>

            <?php if(count($meds)): ?>

            <div class="cw-tl-card">

                <div class="cw-tl-sec-title meds">
                    <i data-lucide="pill"></i>
                    MEDICAMENTOS
                </div>

                <ul class="cw-tl-list">

                    <?php foreach($meds as $m): ?>

                    <li>

                        <span class="cw-tl-item-name">
                            <?= $m['name']; ?>
                        </span>

                        <?php if($m['description']!=''): ?>

                        <span class="cw-tl-item-dose">
                            <?= $m['description']; ?>
                        </span>

                        <?php endif; ?>

                    </li>

                    <?php endforeach; ?>

                </ul>

            </div>

            <?php endif; ?>

            <?php if(count($labs)): ?>

            <div class="cw-tl-card">

                <div class="cw-tl-sec-title labs">
                    <i data-lucide="microscope"></i>
                    EXÁMENES
                </div>

                <ul class="cw-tl-list">

                    <?php foreach($labs as $l): ?>

                    <li>

                        <span class="cw-tl-item-name">
                            <?= $l['name']; ?>
                        </span>

                        <?php if($l['description']!=''): ?>

                        <span class="cw-tl-item-dose">
                            <?= $l['description']; ?>
                        </span>

                        <?php endif; ?>

                    </li>

                    <?php endforeach; ?>

                </ul>

            </div>

            <?php endif; ?>

            <?php if($prescription['next_appointment']!=''): ?>

            <div class="cw-tl-card">

                <div class="cw-tl-sec-title apt">
                    <i data-lucide="calendar"></i>
                    PRÓXIMA CITA
                </div>

                <div class="cw-tl-apt-date">
                    <?= date('d/m/Y',strtotime($prescription['next_appointment'])); ?>
                </div>

            </div>

            <?php endif; ?>

        </div>

    </div>

</div>

<script>
lucide.createIcons();
</script>