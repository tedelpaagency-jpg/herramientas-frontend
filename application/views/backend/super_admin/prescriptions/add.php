<style>
        /* ========================================================
           TEMA VISUAL: CLEAN, SHARP & EDITORIAL (CLASES ÚNICAS)
           ======================================================== */
        :root {
            /* Colores de Interfaz Únicos */
            --cw-bg-body: #f3f4f6;           
            --cw-bg-card: #ffffff;
            --cw-border-light: #e5e7eb;
            --cw-border-dark: #d1d5db;
            
            /* Textos Únicos */
            --cw-text-primary: #111827;
            --cw-text-secondary: #4b5563;
            --cw-text-tertiary: #9ca3af;
            
            /* Acentos Funcionales Únicos */
            --cw-accent-main: #0f172a;       
            --cw-accent-brand: #4f46e5;      
            --cw-accent-meds: #10b981;       
            --cw-accent-labs: #0ea5e9;       
            
            /* Sombras nítidas Únicas */
            --cw-shadow-float: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            --cw-shadow-dropdown: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            
            --cw-radius-box: 12px;
            --cw-radius-input: 8px;
            --cw-font-main: 'Plus Jakarta Sans', sans-serif;
        }

        

        body.cw-modal-open-custom { overflow: hidden; }
/* --- CONTENEDOR APP --- */
.app-shell {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    padding-bottom: 90px;
    /* Espacio para la barra móvil */
    max-width: 1400px;
    margin: 0 auto;
}
        /* --- LAYOUT ESTRUCTURAL --- */
        .cw-app-shell {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            padding-bottom: 90px;
            max-width: 1500px;
            margin: 0 auto;
        }

        @media (min-width: 992px) {
            .cw-app-shell { 
                flex-direction: row; 
                gap: 4rem; 
                padding: 2.5rem; 
                justify-content: center;
            } 
            .cw-sidebar-panel { width: 380px; flex-shrink: 0; }
            .cw-preview-panel { flex-grow: 1; max-width: 850px; }
        }

        /* --- PANEL IZQUIERDO (CONTROLES) --- */
        .cw-editor-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--cw-border-light);
        }

        .cw-editor-header h1 {
            font-size: 1.1rem;
            font-weight: 800;
            margin: 0;
            letter-spacing: -0.02em;
            color: var(--cw-accent-main);
        }

        .cw-control-block {
            background: var(--cw-bg-card);
            border-radius: var(--cw-radius-box);
            padding: 1.25rem;
            border: 1px solid var(--cw-border-light);
            box-shadow: var(--cw-shadow-float);
            margin-bottom: 1.25rem;
        }

        .cw-field-label {
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--cw-text-secondary);
            margin-bottom: 6px;
            display: block;
            letter-spacing: 0.05em;
        }

        .cw-input-sharp {
            width: 100%;
            border: 1px solid var(--cw-border-dark);
            border-radius: var(--cw-radius-input);
            padding: 10px 12px;
            font-size: 0.85rem;
            font-weight: 500;
            background-color: #fff;
            color: var(--cw-text-primary);
            transition: all 0.2s;
            outline: none;
        }

        .cw-input-sharp:focus {
            border-color: var(--cw-accent-brand);
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
        }
        
        input[type="date"].cw-input-sharp {
            cursor: pointer;
            position: relative;
        }

        /* Banner Historial Clínico (Sub Header) */
        .cw-history-banner {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 8px 12px;
            margin-top: 12px;
            font-size: 0.8rem;
            color: #1e3a8a;
            animation: slideUpFade 0.3s ease-out forwards;
        }

        .cw-history-banner button {
            margin-left: auto;
            background: white;
            border: 1px solid #bfdbfe;
            border-radius: 6px;
            padding: 4px 10px;
            font-size: 0.75rem;
            font-weight: 700;
            color: #2563eb;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .cw-history-banner button:hover {
            background: #dbeafe;
        }

        /* Segmented Control (Tabs) */
        .cw-segmented-control {
            display: flex;
            background: var(--cw-bg-body);
            padding: 4px;
            border-radius: 10px;
            margin-bottom: 1.25rem;
            border: 1px solid var(--cw-border-light);
        }

        .cw-segment-btn {
            flex: 1;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            background: transparent;
            color: var(--cw-text-secondary);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        .cw-segment-btn.active {
            background: var(--cw-bg-card);
            color: var(--cw-accent-main);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* Buscador Autocomplete */
        .cw-search-wrap { position: relative; }
        .cw-autocomplete-dropdown {
            position: absolute;
            top: 100%; left: 0; right: 0;
            background: var(--cw-bg-card);
            border-radius: var(--cw-radius-input);
            border: 1px solid var(--cw-border-light);
            box-shadow: var(--cw-shadow-dropdown);
            z-index: 1000;
            display: none;
            max-height: 220px;
            overflow-y: auto;
            padding: 4px;
            margin-top: 4px;
        }
        .cw-autocomplete-item {
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--cw-text-primary);
        }
        .cw-autocomplete-item:hover { background: #f3f4f6; color: var(--cw-accent-brand); }
        .cw-autocomplete-sub { font-size: 0.7rem; color: var(--cw-text-tertiary); display: block; margin-top: 2px;}

        /* Botones de Acción */
        .cw-btn-action-dark {
            background: var(--cw-accent-main);
            color: white;
            border: none;
            border-radius: var(--cw-radius-input);
            padding: 10px 16px;
            font-size: 0.85rem;
            font-weight: 600;
            width: 100%;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .cw-btn-action-dark:hover { background: #000; }
        
        .cw-btn-action-outline {
            background: transparent;
            color: var(--cw-accent-main);
            border: 1px solid var(--cw-border-dark);
            border-radius: var(--cw-radius-input);
            padding: 10px 16px;
            font-size: 0.85rem;
            font-weight: 600;
            width: 100%;
            transition: all 0.2s;
        }
        .cw-btn-action-outline:hover { background: var(--cw-bg-body); }

        /* --- MODAL HISTORIAL CLÍNICO --- */
        .cw-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
            z-index: 100000; display: none; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.3s ease;
        }
        .cw-modal-overlay.active { display: flex; opacity: 1; }
        .cw-modal-content {
            background: white; border-radius: 16px; width: 90%; max-width: 650px;
            max-height: 85vh; display: flex; flex-direction: column;
            box-shadow: var(--cw-shadow-dropdown); transform: translateY(20px);
            transition: transform 0.3s ease;
        }
        .cw-modal-overlay.active .cw-modal-content { transform: translateY(0); }
        .cw-modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--cw-border-light); display: flex; justify-content: space-between; align-items: center; }
        .cw-modal-body { padding: 1.5rem; overflow-y: auto; flex-grow: 1; }
        
        /* Timeline Historial */
        .cw-history-record { border-left: 2px solid var(--cw-border-dark); padding-left: 1.5rem; margin-left: 0.5rem; position: relative; margin-bottom: 2rem; }
        .cw-history-record:last-child { margin-bottom: 0; border-left-color: transparent; }
        .cw-history-record::before { content: ''; position: absolute; left: -6px; top: 0; width: 10px; height: 10px; border-radius: 50%; background: var(--cw-accent-brand); border: 2px solid white; }
        .cw-history-date { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--cw-accent-brand); margin-bottom: 4px; letter-spacing: 0.05em; }
        .cw-history-diag { font-size: 1.05rem; font-weight: 700; color: var(--cw-text-primary); margin-bottom: 8px; }
        .cw-history-text { font-size: 0.85rem; color: var(--cw-text-secondary); line-height: 1.6; }

        /* Detalles de Historial (Meds/Labs) */
        .cw-history-details {
            margin-top: 14px;
            background: #f8fafc;
            border: 1px solid var(--cw-border-light);
            border-radius: 8px;
            padding: 12px 14px;
        }
        .cw-detail-group { margin-bottom: 12px; }
        .cw-detail-group:last-child { margin-bottom: 0; }
        .cw-detail-title {
            font-size: 0.65rem;
            font-weight: 800;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 6px;
            letter-spacing: 0.05em;
        }
        .cw-detail-title.meds { color: var(--cw-accent-meds); }
        .cw-detail-title.labs { color: var(--cw-accent-labs); }
        
        .cw-detail-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .cw-detail-list li {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--cw-text-primary);
            position: relative;
            padding-left: 14px;
            margin-bottom: 4px;
            line-height: 1.4;
        }
        .cw-detail-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: var(--cw-text-tertiary);
        }
        .cw-detail-list li span.dose {
            font-weight: 400;
            color: var(--cw-text-secondary);
        }


        /* --- VISTA DE RECETA (LADO DERECHO) --- */
        .cw-preview-sticky-wrapper {
            position: sticky;
            top: 2.5rem;
            width: 100%;
            margin: 0; 
            max-height: calc(100vh - 5rem);
            overflow-y: auto;
            border-radius: 0; 
            box-shadow: var(--cw-shadow-dropdown);
            background: white;
            border: 1px solid var(--cw-border-light);
            border-top: 6px solid var(--cw-accent-main);
        }

        .cw-prescription-sheet {
            background: white;
            min-height: 29.7cm;
            width: 100%;
            padding: 4.5rem;
            display: flex;
            flex-direction: column;
            color: var(--cw-text-primary);
        }

        /* Lógica Móvil */
        @media (max-width: 991px) {
            .cw-preview-panel {
                position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                background: var(--cw-bg-body); z-index: 9999; transform: translateY(100%);
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                display: flex; flex-direction: column;
            }
            .cw-preview-panel.show-mobile { transform: translateY(0); }
            .cw-preview-sticky-wrapper {
                position: static; margin-top: 60px; max-height: calc(100vh - 60px);
                max-width: 100%; border: none; box-shadow: none; border-top: 4px solid var(--cw-accent-main);
            }
            .cw-prescription-sheet { padding: 2rem 1.5rem; min-height: auto; padding-bottom: 100px; }
            .cw-mobile-preview-header {
                position: fixed; top: 0; left: 0; width: 100%; background: white;
                height: 60px; display: flex; justify-content: space-between; align-items: center;
                padding: 0 20px; border-bottom: 1px solid var(--cw-border-light); z-index: 10000;
            }
            .cw-mobile-bottom-bar {
                position: fixed; bottom: 0; left: 0; width: 100%; background: white;
                padding: 12px 20px; box-shadow: 0 -4px 10px rgba(0,0,0,0.05); z-index: 9000;
                display: flex; justify-content: space-between; align-items: center;
                border-top: 1px solid var(--cw-border-light);
            }
        }
        @media (min-width: 992px) {
            .cw-mobile-preview-header, .cw-mobile-bottom-bar { display: none !important; }
        }

        /* Botones Móviles */
        .cw-btn-float-action {
            background: var(--cw-bg-body); color: var(--cw-accent-main);
            border: 1px solid var(--cw-border-dark); padding: 10px 16px; border-radius: var(--cw-radius-input);
            font-weight: 600; display: flex; align-items: center; gap: 8px;
        }
        .cw-counter-badge {
            background: var(--cw-accent-brand); color: white; border-radius: 12px;
            padding: 2px 8px; font-size: 0.7rem; font-weight: 700;
        }

        /* ========================================================
           DISEÑO INTERNO DE LA RECETA (EDITORIAL CLEAN)
           ======================================================== */
        
        .cw-sheet-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--cw-text-primary);
        }

        .cw-sheet-header h2 {
            font-size: 1.6rem;
            font-weight: 800;
            letter-spacing: -0.03em;
            margin: 0 0 4px 0;
            color: var(--cw-text-primary);
            text-transform: uppercase;
        }

        .cw-sheet-header .cw-subtitle {
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--cw-text-secondary);
            letter-spacing: 0.05em;
        }

        .cw-sheet-header .cw-doc-meta {
            text-align: right;
        }

        .cw-sheet-header .cw-doc-type {
            font-size: 0.7rem;
            font-weight: 800;
            letter-spacing: 0.1em;
            color: var(--cw-text-tertiary);
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        /* Barra de Paciente Inline */
        .cw-patient-inline-bar {
            display: flex;
            flex-wrap: wrap;
            background: #fafafa;
            border: 1px solid var(--cw-border-light);
            border-radius: 6px;
            padding: 12px 16px;
            gap: 20px;
            margin-bottom: 2.5rem;
            align-items: center;
        }

        .cw-patient-inline-bar .cw-p-item {
            display: flex;
            align-items: baseline;
            gap: 6px;
        }

        .cw-patient-inline-bar .cw-lbl {
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
            color: var(--cw-text-tertiary);
        }

        .cw-patient-inline-bar .cw-val {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--cw-text-primary);
        }

        /* Separadores de Sección */
        .cw-section-divider {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 1.5rem 0 1rem 0;
        }
        
        .cw-section-divider span {
            font-size: 0.65rem;
            font-weight: 800;
            color: var(--cw-text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .cw-section-divider::after {
            content: '';
            flex-grow: 1;
            height: 1px;
            background: var(--cw-border-light);
        }

        /* Elementos de Lista */
        .cw-list-item-clean {
            position: relative;
            padding: 10px 0 10px 16px;
            margin-bottom: 8px;
            border-bottom: 1px solid #f9fafb;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .cw-list-item-clean:last-child { border-bottom: none; }

        .cw-list-item-clean::before {
            content: '';
            position: absolute;
            left: 0;
            top: 14px;
            width: 3px;
            height: 14px;
            border-radius: 2px;
        }

        .cw-type-med::before { background-color: var(--cw-accent-meds); }
        .cw-type-lab::before { background-color: var(--cw-accent-labs); }

        .cw-item-main-text {
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--cw-text-primary);
            margin-bottom: 2px;
        }

        .cw-item-sub-text {
            font-size: 0.8rem;
            font-weight: 400;
            color: var(--cw-text-secondary);
            line-height: 1.4;
        }

        /* Botón de Borrar */
        .cw-btn-remove-ghost {
            opacity: 0.5; 
            color: #f87171; 
            background: transparent;
            border: none;
            padding: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
        }
        .cw-list-item-clean:hover .cw-btn-remove-ghost { 
            opacity: 0.8; 
        }
        .cw-btn-remove-ghost:hover { 
            opacity: 1 !important; 
            color: #dc2626; 
            background: #fef2f2; 
            transform: scale(1.05); 
        }

        /* Caja de Notas (DISEÑO AJUSTADO) */
        .cw-clinical-notes-box {
            margin-top: 1.5rem; 
            padding: 0.75rem 1.25rem; 
            background: transparent; 
            border-left: 3px solid #fbbf24;
            border-radius: 0;
            font-size: 0.85rem;
            color: var(--cw-text-primary);
            font-weight: 500;
            white-space: pre-wrap;
            word-wrap: break-word;
            line-height: 1.5;
        }

        .cw-clinical-notes-box .cw-lbl-note {
            font-size: 0.6rem;
            font-weight: 800;
            color: #d97706; 
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 4px; 
            display: block;
        }

        /* Caja de Próxima Cita */
        .cw-appointment-box {
            margin-top: 1.5rem;
            display: inline-block;
            padding: 10px 16px;
            background: var(--cw-accent-soft);
            border-radius: 6px;
            border-left: 3px solid var(--cw-accent-brand);
        }

        .cw-appointment-box .cw-lbl-apt {
            font-size: 0.6rem;
            font-weight: 800;
            color: var(--cw-accent-brand);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: block;
            margin-bottom: 2px;
        }

        .cw-appointment-box .cw-val-apt {
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--cw-text-primary);
            text-transform: capitalize;
        }

        .cw-sheet-footer {
            margin-top: auto;
            text-align: center;
            padding-top: 4rem;
        }

        .cw-stamp-line {
            width: 200px;
            height: 1px;
            background: var(--cw-text-primary);
            margin: 0 auto 8px;
        }

        .cw-stamp-text { font-size: 0.85rem; font-weight: 700; color: var(--cw-text-primary); text-transform: uppercase; }
        .cw-stamp-sub { font-size: 0.65rem; color: var(--cw-text-tertiary); letter-spacing: 0.05em; }

        @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-item { animation: slideUpFade 0.3s ease-out forwards; }

        @media print {
            body { background: #fff; padding: 0; }
            .no-print { display: none !important; }
            .cw-app-shell { display: block; padding: 0; margin: 0; max-width: 100%;}
            .cw-preview-panel { width: 100% !important; margin: 0; padding: 0; }
            .cw-preview-sticky-wrapper { position: static; box-shadow: none; border: none; max-width: 100%; }
            .cw-prescription-sheet { padding: 0; min-height: auto; }
            
            /* Asegurar colores de impresión */
            .cw-patient-inline-bar { border: none; border-bottom: 1px solid #000; background: transparent; padding: 10px 0; border-radius: 0; }
            .cw-clinical-notes-box { background: transparent !important; border-left: 3px solid #fbbf24 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .cw-appointment-box { border: 1px solid var(--cw-border-dark); background: transparent !important; }
            .cw-type-med::before { background-color: var(--cw-accent-meds) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .cw-type-lab::before { background-color: var(--cw-accent-labs) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }

        #cw-preview-panel-id {
            position: relative;
        }

        /* overlay */
        .cw-loader-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            background: rgba(107, 114, 128, 0.4); /* gris translúcido */
            backdrop-filter: blur(2px);

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 10px;
            z-index: 10;

            opacity: 0;
            pointer-events: none;
            transition: 0.2s ease;
        }

        .cw-loader-overlay.active {
            opacity: 1;
            pointer-events: all;
        }

        /* spinner */
        .cw-loader-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #6366f1;
            border-radius: 50%;
            animation: cw-spin 1s linear infinite;
        }

        @keyframes cw-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

    </style>
    <!-- Google Fonts: Plus Jakarta Sans -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
<div class="middle-sidebar-bottom">
    <div class="middle-sidebar-left app-shell">
        <div class="cw-app-shell">
    
    <!-- LADO IZQUIERDO: CONTROLES -->
    <div class="cw-sidebar-panel no-print">

        <!-- Bloque: Paciente -->
        <div class="cw-control-block">
            <div class="cw-segmented-control">
                <button class="cw-segment-btn active" data-cw-ptype="registrado">Paciente Guardado</button>
                <button class="cw-segment-btn" data-cw-ptype="nuevo">Nuevo Registro</button>
            </div>

            <div id="cw-ui-pt-registrado">
                <div class="cw-search-wrap">
                    <label class="cw-field-label">Buscar Paciente</label>
                    <input type="text" id="cw-search-paciente" class="cw-input-sharp" placeholder="Nombre completo..." autocomplete="off">
                    <div id="cw-results-paciente" class="cw-autocomplete-dropdown">
                        
                    </div>
                </div>
                <!-- Banner de Historial Clínico -->
                <div id="cw-history-banner" class="cw-history-banner" style="display: none;">
                    <i data-lucide="clipboard-list" size="16"></i>
                    <span>Historial Disponible (2 Visitas)</span>
                    <button type="button" onclick="openHistoryModal()">Ver</button>
                </div>
            </div>

            <div id="cw-ui-pt-nuevo" style="display: none;">
                <div class="mb-3">
                    <label class="cw-field-label">Nombre Completo</label>
                    <input type="text" id="cw-in-pt-nombre" class="cw-input-sharp" placeholder="Ej: Carlos Silva">
                </div>
                <div class="row g-2">
                    <div class="col-7">
                        <label class="cw-field-label">Celular</label>
                        <input type="tel" id="cw-in-pt-tel" class="cw-input-sharp" placeholder="09xxxxxx">
                    </div>
                    <div class="col-5">
                        <label class="cw-field-label">Edad</label>
                        <input type="number" id="cw-in-pt-edad" class="cw-input-sharp" placeholder="Años">
                    </div>
                </div>
            </div>
        </div>

        <!-- Bloque: Módulos Clínicos -->
        <div class="cw-segmented-control">
            <button class="cw-segment-btn active" data-cw-module="receta"><i data-lucide="pill" size="14"></i> Receta Médica</button>
            <button class="cw-segment-btn" data-cw-module="laboratorio"><i data-lucide="microscope" size="14"></i> Laboratorio</button>
        </div>

        <!-- Tab: Receta -->
        <div id="cw-module-receta-container">

            <div class="cw-control-block">
        
                <div class="mb-3 cw-search-wrap">
        
                    <label class="cw-field-label">
                        Fármaco Base
                    </label>
        
                    <input type="hidden" id="cw-product-id">
        
                    <input
                        type="text"
                        id="cw-search-med"
                        class="cw-input-sharp"
                        placeholder="Buscar principio activo..."
                        autocomplete="off">
        
                    <div
                        id="cw-results-med"
                        class="cw-autocomplete-dropdown"
                        style="display:none;">
                    </div>
        
                </div>
        
                
        
                <div class="mb-3 cw-search-wrap">
        
                    <label class="cw-field-label">
                        Posología
                    </label>
        
                    <input
                        type="text"
                        id="cw-in-dosis"
                        class="cw-input-sharp"
                        placeholder="Ej: Tomar 1 cada 8 horas...">
                    <div id="cw-dose-suggestions" class="cw-autocomplete-dropdown"></div>
        
                </div>
        
                <button
                    id="cw-btn-add-med"
                    class="cw-btn-action-dark">
        
                    Añadir a Prescripción
        
                </button>
        
            </div>
        
        </div>

        <!-- Tab: Laboratorio -->
        <div id="cw-module-laboratorio-container" style="display: none;">
            <div class="cw-control-block">
                <div class="mb-3 cw-search-wrap">
                    <label class="cw-field-label">Estudio Clínico</label>
                    <input type="text" id="cw-search-lab" class="cw-input-sharp" placeholder="Buscar examen..." autocomplete="off">
                    <div id="cw-results-lab" class="cw-autocomplete-dropdown">
                        <div class="cw-autocomplete-item">Biometría Hemática Completa</div>
                        <div class="cw-autocomplete-item">Glucosa Basal</div>
                        <div class="cw-autocomplete-item">Perfil Lipídico Integral</div>
                        <div class="cw-autocomplete-item">EGO (Examen General de Orina)</div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="cw-field-label">Detalle Solicitud</label>
                    <input type="text" id="cw-in-lab-obs" class="cw-input-sharp" placeholder="Ej: Paciente en ayuno estricto">
                </div>
                <button id="cw-btn-add-lab" class="cw-btn-action-dark" style="background: var(--cw-accent-brand);">Añadir Estudio</button>
            </div>
        </div>

        <!-- Bloque: Notas y Próxima Cita -->
        <div class="cw-control-block">
            <div class="mb-3">
                <label class="cw-field-label">Evolución Clínica (Notas)</label>
                <textarea id="cw-in-comentario" class="cw-input-sharp" rows="3" placeholder="Redacte las observaciones médicas aquí..."></textarea>
            </div>
            <div>
                <label class="cw-field-label">Siguiente Consulta (Opcional)</label>
                <input type="date" id="cw-in-proxima-cita" class="cw-input-sharp">
            </div>
        </div>

        <!-- Botón Guardar -->
        <div class="d-none d-lg-block mb-4">
            <button class="cw-btn-action-outline fw-800" >GUARDAR RECETA</button>
        </div>
    </div>

    <!-- BARRA INFERIOR MÓVIL -->
    <div class="cw-mobile-bottom-bar d-lg-none no-print">
        <button class="cw-btn-float-action" id="cw-btn-open-preview">
            <i data-lucide="file-text" size="18"></i>
            Documento <span class="cw-counter-badge" id="cw-mobile-item-count">0</span>
        </button>
        <button class="cw-btn-action-dark" style="width: auto; padding: 10px 24px;">Guardar</button>
    </div>

    <!-- LADO DERECHO: VISTA PREVIA (HOJA EDITORIAL) -->
    <div class="cw-preview-panel" id="cw-preview-panel-id">
         <!-- OVERLAY LOADER -->
        <div id="cw-loader" class="cw-loader-overlay">
            <div class="cw-loader-spinner"></div>
        </div>
        <!-- HEADER MÓVIL (Vista Previa) -->
        <div class="cw-mobile-preview-header d-lg-none no-print">
            <div class="fw-700 text-primary d-flex align-items-center">
                <i data-lucide="file-check" size="18" class="me-2 text-muted"></i> Vista Previa
            </div>
            <button class="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" id="cw-btn-close-preview" style="width: 34px; height: 34px; border: none;">
                <i data-lucide="chevron-down" size="20"></i>
            </button>
        </div>

        <div class="cw-preview-sticky-wrapper">
            <div class="cw-prescription-sheet" id="cw-printable-area">
                
                <!-- Encabezado Editorial Nítido -->
                <div class="cw-sheet-header">
                    <div>
                        <h2>DR. JULIÁN DE LA TORRE</h2>
                        <div class="cw-subtitle">MÉDICO INTERNISTA ESP.</div>
                        <div class="cw-subtitle text-muted mt-1">Clínica Torre Médica, Piso 4</div>
                    </div>
                    <div class="cw-doc-meta">
                        <div class="cw-doc-type">Prescripción Oficial</div>
                        <div id="cw-view-fecha" class="fw-600" style="font-size:0.9rem;">--/--/----</div>
                        <div class="cw-subtitle text-muted mt-1">MSP: 4433-22-BA</div>
                    </div>
                </div>

                <!-- Barra Paciente Compacta -->
                <div class="cw-patient-inline-bar">
                    <div class="cw-p-item"><span class="cw-lbl">Paciente:</span> <span class="cw-val" id="cw-view-nombre">---</span></div>
                    <div class="cw-p-item"><span class="cw-lbl">Edad:</span> <span class="cw-val" id="cw-view-edad">---</span></div>
                    <div class="cw-p-item"><span class="cw-lbl">Tel:</span> <span class="cw-val" id="cw-view-tel">---</span></div>
                </div>

                <!-- Contenido Dinámico -->
                
                <!-- Medicamentos -->
                <div id="cw-preview-rx-section" style="display: none;">
                    <div class="cw-section-divider">
                        <span>Plan Farmacológico</span>
                    </div>
                    <div id="cw-med-list-container"></div>
                </div>

                <!-- Laboratorio -->
                <div id="cw-preview-lab-section" style="display: none; margin-top: 2rem;">
                    <div class="cw-section-divider">
                        <span>Estudios Complementarios</span>
                    </div>
                    <div id="cw-lab-list-container"></div>
                </div>

                <!-- Notas Clínicas Limpias -->
                <div id="cw-view-historial-box" style="display: none;">
                    <div class="cw-clinical-notes-box">
                        <span class="cw-lbl-note">Observaciones Clínicas</span>
                        <div id="cw-view-comentario"></div>
                    </div>
                </div>

                <!-- Próxima Cita -->
                <div id="cw-view-cita-box" style="display: none;">
                    <div class="cw-appointment-box">
                        <span class="cw-lbl-apt">Próxima Consulta</span>
                        <div class="cw-val-apt" id="cw-view-proxima-cita"></div>
                    </div>
                </div>

                <!-- Firma Minimalista -->
                <div class="cw-sheet-footer">
                    <div class="cw-stamp-line"></div>
                    <div class="cw-stamp-text">DR. JULIÁN DE LA TORRE</div>
                    <div class="cw-stamp-sub">FIRMA Y SELLO AUTORIZADO</div>
                </div>
            </div>
        </div>
        
        <div class="text-center mt-4 mb-5 no-print d-none d-lg-block">
            <button onclick="window.print()" class="cw-btn-action-dark" style="display: inline-flex; width: auto; padding: 12px 32px; border-radius: 30px;">
                <i data-lucide="printer" size="16"></i> Imprimir Documento
            </button>
        </div>
        <div class="text-center mt-3 mb-5 no-print d-lg-none">
            <button onclick="window.print()" class="cw-btn-action-dark">
                <i data-lucide="printer" size="16"></i> Imprimir
            </button>
        </div>
    </div>
</div>

<!-- MODAL DE HISTORIAL CLÍNICO -->
<div id="cw-history-modal" class="cw-modal-overlay no-print">
    <div class="cw-modal-content">
        <div class="cw-modal-header">
            <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0; color: var(--cw-accent-main); display: flex; align-items: center;">
                <i data-lucide="clipboard-list" size="18" class="me-2 text-primary"></i> Historial Clínico
            </h3>
            <button onclick="closeHistoryModal()" style="border: none; background: #f3f4f6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <i data-lucide="x" size="18"></i>
            </button>
        </div>
        <div class="cw-modal-body">
            <!-- Registro 1 -->
            <div class="cw-history-record">
                <div class="cw-history-date">12 Marzo, 2026</div>
                <div class="cw-history-diag">Faringoamigdalitis Aguda</div>
                <div class="cw-history-text">Paciente acude con dolor de garganta intenso, fiebre de 38.5°C y malestar general. Se observan placas purulentas en amígdalas. Se prescribe antibioticoterapia y reposo.</div>
                
                <div class="cw-history-details">
                    <div class="cw-detail-group">
                        <div class="cw-detail-title meds"><i data-lucide="pill" size="12"></i> Medicamentos Prescritos</div>
                        <ul class="cw-detail-list">
                            <li>Amoxicilina + Ácido Clavulánico 875/125mg <span class="dose">- 1 tableta cada 12h por 7 días</span></li>
                            <li>Ibuprofeno 400mg <span class="dose">- 1 tableta cada 8h por 3 días</span></li>
                        </ul>
                    </div>
                    <div class="cw-detail-group">
                        <div class="cw-detail-title labs"><i data-lucide="microscope" size="12"></i> Exámenes Solicitados</div>
                        <ul class="cw-detail-list">
                            <li>Cultivo de exudado faríngeo</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Registro 2 -->
            <div class="cw-history-record">
                <div class="cw-history-date">05 Enero, 2026</div>
                <div class="cw-history-diag">Control General Anual</div>
                <div class="cw-history-text">Revisión de rutina. Exámenes de laboratorio dentro de los parámetros normales. Presión arterial 120/80. Se recomienda mantener dieta balanceada y ejercicio.</div>
                
                <div class="cw-history-details">
                    <div class="cw-detail-group">
                        <div class="cw-detail-title labs"><i data-lucide="microscope" size="12"></i> Exámenes Solicitados</div>
                        <ul class="cw-detail-list">
                            <li>Biometría Hemática Completa</li>
                            <li>Perfil Lipídico Integral</li>
                            <li>Química Sanguínea (27 elementos)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    </div>
</div>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();
        $('.right-chat').removeClass('active-sidebar');
        $('.main-content').removeClass('right-chat-active');
        
        let timeoutPaciente = null;

            $('#cw-search-paciente').on('input', function() {
                let query = $(this).val();

                clearTimeout(timeoutPaciente);

                timeoutPaciente = setTimeout(() => {
                    
                    console.log(query);

                    if(query.length < 2){
                        $('#cw-results-paciente').hide();
                        return;
                    }

                    $.ajax({
                        url: "<?= base_url('portal/patients/search_patient') ?>",
                        type: "POST",
                        data: {search: query},
                        dataType: "json",
                        success: function(res){

                        console.log(res);

                            let html = '';

                            res.forEach(p => {
                                html += `
                                    <div class="cw-autocomplete-item patient-info"
                                        data-id="${p.user_id}"
                                        data-nombre="${p.name+' '+p.last_name}"
                                        data-tel="${p.phone}"
                                        data-edad="${p.age}">
                                        
                                        ${p.name+' '+p.last_name}
                                        <span class="cw-autocomplete-sub">
                                            Telf: ${p.phone} • ${p.age} años
                                        </span>
                                    </div>
                                `;
                            });

                            $('#cw-results-paciente').html(html).show();

                        },

                        error: function(xhr, status, error){
                            console.log("ERROR STATUS:", status);
                            console.log("ERROR MSG:", error);
                            console.log("RESPONSE TEXT:", xhr.responseText);

                            alert("Error en AJAX, revisa consola");
                        }
                    });

                }, 300);
            });


            // seleccionar paciente
            $(document).on('click', '.patient-info', function(){

                let nombre = $(this).data('nombre');
                let tel    = $(this).data('tel');
                let edad   = $(this).data('edad');
                let id     = $(this).data('id');

                $('#cw-search-paciente').val(nombre);
                $('#cw-view-nombre').text(nombre);
                $('#cw-view-tel').text(tel);
                $('#cw-view-edad').text(edad + ' años');

                window.patient_id = id;

                $('#cw-results-paciente').hide();

                // NUEVO: verificar historial
                loadPatientHistoryInfo(id);
            });

            function loadPatientHistoryInfo(patient_id){

                $('#cw-history-banner').show();
                $('#cw-history-banner span').text(`Historial Disponible)`);

            }

            document.querySelector('.cw-btn-action-outline').addEventListener('click', savePrescription);

    
            function savePrescription() {

                if(meds.length === 0 && labs.length === 0){
                    alert("Agrega al menos un medicamento o estudio");
                    return;
                }

                 showLoader();
                
                let data = {
                    patient_id: window.patient_id || null,
                    patient_name: $('#cw-view-nombre').text(),
                    phone: $('#cw-view-tel').text(),
                    age: $('#cw-view-edad').text(),

                    medications: meds,
                    labs: labs,
                    comment: $('#cw-in-comentario').val(),
                    next_appointment: $('#cw-in-proxima-cita').val()
                };

                $.ajax({
                    url: "<?= base_url('portal/prescription/save') ?>",
                    type: "POST",
                    data: {data: JSON.stringify(data)},
                    dataType: "json",
                    success: function(res){
                        if(res.status){
                            alert("Guardado correctamente");
                            hideLoader();
                        }
                    },
                    error: function(e){
                        console.log(e.responseText);
                        hideLoader();
                    }
                });
            }

        // --- SISTEMA DE AUDIO OPTIMIZADO ---
        let audioCtx = null;
        
        const playSuccessSound = () => {
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const t = audioCtx.currentTime;
                
                const osc1 = audioCtx.createOscillator(); const gn1 = audioCtx.createGain();
                osc1.type = 'sine'; osc1.frequency.setValueAtTime(523.25, t);
                gn1.gain.setValueAtTime(0, t); gn1.gain.linearRampToValueAtTime(0.1, t + 0.02); gn1.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
                osc1.connect(gn1); gn1.connect(audioCtx.destination); osc1.start(t); osc1.stop(t + 0.4);

                const osc2 = audioCtx.createOscillator(); const gn2 = audioCtx.createGain();
                osc2.type = 'sine'; osc2.frequency.setValueAtTime(783.99, t + 0.08);
                gn2.gain.setValueAtTime(0, t + 0.08); gn2.gain.linearRampToValueAtTime(0.1, t + 0.1); gn2.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
                osc2.connect(gn2); gn2.connect(audioCtx.destination); osc2.start(t + 0.08); osc2.stop(t + 0.5);
            } catch(e) { }
        };

        const playRemoveSound = () => {
            try {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const t = audioCtx.currentTime;
                const osc = audioCtx.createOscillator(); const gn = audioCtx.createGain();
                osc.type = 'sine'; osc.frequency.setValueAtTime(300, t); osc.frequency.exponentialRampToValueAtTime(150, t + 0.2); 
                gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(0.05, t + 0.02); gn.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
                osc.connect(gn); gn.connect(audioCtx.destination); osc.start(t); osc.stop(t + 0.2);
            } catch(e) {}
        };

        let meds = []; let labs = []; let pMode = 'registrado';

        // --- LÓGICA MODAL HISTORIAL ---
        const historyModal = document.getElementById('cw-history-modal');
        window.openHistoryModal = () => {
            historyModal.style.display = 'flex';
            setTimeout(() => historyModal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        };
        window.closeHistoryModal = () => {
            historyModal.classList.remove('active');
            setTimeout(() => { 
                historyModal.style.display = 'none'; 
                document.body.style.overflow = ''; 
            }, 300);
        };

        // --- LÓGICA MÓVIL ---
        const previewPanel = document.getElementById('cw-preview-panel-id');
        const body = document.body;
        document.getElementById('cw-btn-open-preview').addEventListener('click', () => {
            previewPanel.classList.add('show-mobile'); body.classList.add('cw-modal-open-custom');
        });
        document.getElementById('cw-btn-close-preview').addEventListener('click', () => {
            previewPanel.classList.remove('show-mobile'); body.classList.remove('cw-modal-open-custom');
        });

        // --- TABS LOGIC ---
        document.querySelectorAll('.cw-segment-btn').forEach(t => {
            t.addEventListener('click', () => {
                const group = t.parentElement;
                group.querySelectorAll('.cw-segment-btn').forEach(btn => btn.classList.remove('active'));
                t.classList.add('active');
                
                if(t.dataset.cwPtype) {
                    pMode = t.dataset.cwPtype;
                    document.getElementById('cw-ui-pt-registrado').style.display = pMode==='registrado'?'block':'none';
                    document.getElementById('cw-ui-pt-nuevo').style.display = pMode==='nuevo'?'block':'none';
                    // Ocultar banner de historial si cambia a nuevo
                    if(pMode === 'nuevo') document.getElementById('cw-history-banner').style.display = 'none';
                    syncPatient();
                }
                if(t.dataset.cwModule) {
                    document.getElementById('cw-module-receta-container').style.display = t.dataset.cwModule==='receta'?'block':'none';
                    document.getElementById('cw-module-laboratorio-container').style.display = t.dataset.cwModule==='laboratorio'?'block':'none';
                }
            });
        });

        // --- BUSCADOR ---
        const setupSearch = (idIn, idRes, onSelect) => {
            const i = document.getElementById(idIn); const r = document.getElementById(idRes);
            i.addEventListener('focus', () => { if(r.children.length) r.style.display = 'block'; });
            i.addEventListener('input', () => {
                const term = i.value.toLowerCase(); let hasResults = false;
                r.querySelectorAll('.cw-autocomplete-item').forEach(item => {
                    const text = item.innerText.toLowerCase();
                    if(text.includes(term)) { item.style.display = ''; hasResults = true; } 
                    else { item.style.display = 'none'; }
                });
                r.style.display = hasResults ? 'block' : 'none';
            });
            document.addEventListener('click', (e) => { if (!i.contains(e.target) && !r.contains(e.target)) r.style.display = 'none'; });
            r.querySelectorAll('.cw-autocomplete-item').forEach(item => {
                item.addEventListener('click', () => { onSelect(item); r.style.display = 'none'; });
            });
        };

        setupSearch('cw-search-med', 'cw-results-med', (item) => {
            const clone = item.cloneNode(true);
            const sub = clone.querySelector('.cw-autocomplete-sub');
            if(sub) sub.remove();
            document.getElementById('cw-search-med').value = clone.innerText.trim();
        });
        
        setupSearch('cw-search-lab', 'cw-results-lab', (item) => {
            const clone = item.cloneNode(true);
            const sub = clone.querySelector('.cw-autocomplete-sub');
            if(sub) sub.remove();
            document.getElementById('cw-search-lab').value = clone.innerText.trim();
        });

        const syncPatient = () => {
            if(pMode === 'nuevo') {
                document.getElementById('cw-view-nombre').innerText = document.getElementById('cw-in-pt-nombre').value || "---";
                document.getElementById('cw-view-tel').innerText = document.getElementById('cw-in-pt-tel').value || "---";
                const ed = document.getElementById('cw-in-pt-edad').value;
                document.getElementById('cw-view-edad').innerText = ed ? ed + " años" : "---";
            } else {
                const val = document.getElementById('cw-search-paciente').value;
                document.getElementById('cw-view-nombre').innerText = val || "---";
            }
        };
        ['cw-in-pt-nombre', 'cw-in-pt-tel', 'cw-in-pt-edad'].forEach(id => document.getElementById(id).addEventListener('input', syncPatient));

 

        document.getElementById('cw-btn-add-lab').addEventListener('click', () => {
            const n = document.getElementById('cw-search-lab').value.trim(); 
            const o = document.getElementById('cw-in-lab-obs').value.trim();
            if(!n) { alert("Por favor, indique el estudio clínico."); return; }
            
            labs.push({ n, o });
            document.getElementById('cw-search-lab').value = "";
            document.getElementById('cw-in-lab-obs').value = "";
            playSuccessSound(); render();
        });

        window.removeItem = (type, idx) => {
            if(type === 'med') meds.splice(idx, 1); else labs.splice(idx, 1);
            playRemoveSound(); render();
        };

        const render = () => {
            document.getElementById('cw-mobile-item-count').innerText = meds.length + labs.length;

            document.getElementById('cw-preview-rx-section').style.display = meds.length ? 'block' : 'none';
            document.getElementById('cw-med-list-container').innerHTML = meds.map((m, i) => `
                <div class="cw-list-item-clean cw-type-med fade-in-item">
                    <div class="flex-grow-1">
                        <div class="cw-item-main-text">${m.n}</div>
                        ${m.d ? `<div class="cw-item-sub-text">${m.d}</div>` : ''}
                    </div>
                    <button class="cw-btn-remove-ghost" onclick="removeItem('med', ${i})" title="Quitar">
                        <i data-lucide="x" size="20"></i>
                    </button>
                </div>
            `).join('');

            document.getElementById('cw-preview-lab-section').style.display = labs.length ? 'block' : 'none';
            document.getElementById('cw-lab-list-container').innerHTML = labs.map((l, i) => `
                <div class="cw-list-item-clean cw-type-lab fade-in-item">
                    <div class="flex-grow-1">
                        <div class="cw-item-main-text">${l.n}</div>
                        ${l.o ? `<div class="cw-item-sub-text">Nota: ${l.o}</div>` : ''}
                    </div>
                    <button class="cw-btn-remove-ghost" onclick="removeItem('lab', ${i})" title="Quitar">
                        <i data-lucide="x" size="20"></i>
                    </button>
                </div>
            `).join('');
            
            lucide.createIcons();
        };

        // Notas Historial
        document.getElementById('cw-in-comentario').addEventListener('input', (e) => {
            const val = e.target.value;
            document.getElementById('cw-view-historial-box').style.display = val ? 'block' : 'none';
            document.getElementById('cw-view-comentario').innerText = val;
        });

        // Próxima Cita (Formateo de Calendario Nativo)
        ['input', 'change'].forEach(evt => {
            document.getElementById('cw-in-proxima-cita').addEventListener(evt, (e) => {
                const val = e.target.value;
                document.getElementById('cw-view-cita-box').style.display = val ? 'block' : 'none';
                
                if(val) {
                    const [year, month, day] = val.split('-');
                    const dateObj = new Date(year, month - 1, day);
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    const formattedDate = dateObj.toLocaleDateString('es-ES', options);
                    
                    const textCita = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
                    document.getElementById('cw-view-proxima-cita').innerText = textCita;
                } else {
                    document.getElementById('cw-view-proxima-cita').innerText = "";
                }
            });
        });

        document.getElementById('cw-view-fecha').innerText = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

        function showLoader(){
            $('#cw-loader').addClass('active');
        }

        function hideLoader(){
            $('#cw-loader').removeClass('active');
        }
        
        $('#cw-search-med').on('keyup', function(){

            const term = $(this).val();
        
            $('#cw-product-id').val('');
        
            if(term.length < 2){
        
                $('#cw-results-med')
                    .hide()
                    .html('');
        
                return;
            }
        
            $.get(
                '<?= site_url("prescriptions/search_medicines") ?>',
                {term},
                function(resp){
        
                    let rows = JSON.parse(resp);
        
                    let html = '';
        
                    rows.forEach(function(r){
        
                        html += `
                        <div
                            class="cw-autocomplete-item medicine-item"
                            data-id="${r.id}"
                            data-name="${r.name}">
                            ${r.name}
                        </div>`;
                    });
        
                    if(!html){
        
                        html = `
                        <div class="cw-autocomplete-item text-muted">
                            No existe en catálogo.
                            Puede escribirlo manualmente.
                        </div>`;
                    }
        
                    $('#cw-results-med')
                        .html(html)
                        .show();
                }
            );
        
        });
        
        $(document).on('click','.medicine-item',function(){

            let id = $(this).data('id');
            let name = $(this).data('name');
        
            $('#cw-product-id').val(id);
            $('#cw-search-med').val(name);
        
            $('#cw-results-med').hide();
        
            loadDoseSuggestions(id);
        });
        
        function loadDoseSuggestions(product_id)
        {
            $.get(
                '<?= site_url("prescriptions/get_dose_suggestions") ?>',
                {product_id},
                function(resp){
        
                    let rows = JSON.parse(resp);
        
                    if(!rows.length){
        
                        $('#cw-dose-suggestions')
                            .hide()
                            .html('');
        
                        return;
                    }
        
                    let html = '';
        
                    rows.forEach(function(r){
        
                        html += `
                        <div
                            class="cw-autocomplete-item dose-item"
                            data-dose="${r.dose}">
        
                            <div>
                                <strong>${r.dose}</strong>
                            </div>
        
                            <small>
                                Utilizado ${r.total} veces
                            </small>
        
                        </div>`;
                    });
        
                    $('#cw-dose-suggestions')
                        .html(html)
                        .show();
                }
            );
        }
        
        $(document).on('click','.dose-item',function(){
        
            $('#cw-in-dosis').val(
                $(this).data('dose')
            );
        
            $('#cw-dose-suggestions').hide();
        });
        
       $('#cw-in-dosis').on('input',function(){

            $('#cw-dose-suggestions').hide();
        
        });
        
               // --- ACCIONES AÑADIR ---
        document
        .getElementById('cw-btn-add-med')
        .addEventListener('click', () => {
        
            const id = $('#cw-product-id').val() || null;
        
            const n = $('#cw-search-med')
                .val()
                .trim();
        
            const d = $('#cw-in-dosis')
                .val()
                .trim();
        
            if(!n){
        
                alert(
                    'Por favor indique el medicamento.'
                );
        
                return;
            }
        
            meds.push({
        
                id : id,
                n  : n,
                d  : d
        
            });
        
            $('#cw-product-id').val('');
            $('#cw-search-med').val('');
            $('#cw-in-dosis').val('');
        
            $('#cw-results-med').hide();
            $('#cw-dose-suggestions').html('');
        
            render();
        
        });
    
    });
</script>