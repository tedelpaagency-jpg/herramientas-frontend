<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>

body {
    font-family: DejaVu Sans, sans-serif;
    background: #f3f4f6;
    padding: 20px;
}

/* contenedor tipo panel */
.panel {
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    padding: 20px;
}

/* encabezado */
.header {
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 15px;
    padding-bottom: 10px;
}

.title {
    font-size: 18px;
    font-weight: bold;
    color: #111827;
}

.sub {
    font-size: 12px;
    color: #6b7280;
}

/* secciones */
.section {
    margin-top: 15px;
}

.section-title {
    font-weight: bold;
    font-size: 13px;
    margin-bottom: 6px;
    color: #374151;
}

/* listas tipo preview */
.item {
    padding: 6px 0;
    border-bottom: 1px solid #f3f4f6;
}

.item:last-child {
    border-bottom: none;
}

.item-name {
    font-size: 13px;
    font-weight: 600;
}

.item-sub {
    font-size: 12px;
    color: #6b7280;
}

/* badges */
.badge {
    display: inline-block;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 6px;
    background: #e0e7ff;
    color: #3730a3;
    margin-bottom: 5px;
}

.badge.lab {
    background: #ecfdf5;
    color: #065f46;
}

</style>
</head>

<body>

<div class="panel">

    <!-- HEADER -->
    <div class="header">
        <div class="title">Receta Médica</div>
        <div class="sub"><?= $p->created_at ?></div>
    </div>

    <!-- PACIENTE -->
    <div class="section">
        <div class="section-title">Paciente</div>
        <div class="item">
            <div class="item-name"><?= $patient->name.' '.$patient->last_name ?></div>
            <div class="item-sub">
                Tel: <?= $patient->phone ?> • Edad: <?= $p->age ?>
            </div>
        </div>
    </div>

    <!-- MEDICAMENTOS -->
    <?php if(!empty($meds)): ?>
    <div class="section">
        <div class="section-title">Medicamentos</div>

        <?php foreach($meds as $m): ?>
            <div class="item">
                <div class="badge">MED</div>
                <div class="item-name"><?= $m->name ?></div>
                <?php if(!empty($m->dose)): ?>
                    <div class="item-sub"><?= $m->dose ?></div>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>

    </div>
    <?php endif; ?>

    <!-- LABS -->
    <?php if(!empty($labs)): ?>
    <div class="section">
        <div class="section-title">Laboratorios</div>

        <?php foreach($labs as $l): ?>
            <div class="item">
                <div class="badge lab">LAB</div>
                <div class="item-name"><?= $l->name ?></div>
                <?php if(!empty($l->observation)): ?>
                    <div class="item-sub"><?= $l->observation ?></div>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>

    </div>
    <?php endif; ?>

    <!-- COMENTARIO -->
    <?php if(!empty($p->comment)): ?>
    <div class="section">
        <div class="section-title">Observaciones</div>
        <div class="item-sub"><?= $p->comment ?></div>
    </div>
    <?php endif; ?>

    <!-- CITA -->
    <?php if(!empty($p->next_appointment)): ?>
    <div class="section">
        <div class="section-title">Próxima cita</div>
        <div class="item-name"><?= $p->next_appointment ?></div>
    </div>
    <?php endif; ?>

</div>

</body>
</html>