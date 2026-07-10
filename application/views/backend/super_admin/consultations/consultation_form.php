<style>
        /* ========================================================
           TEMA VISUAL V3: ZIIGO STYLE (CLEAN & DARK NAVY)
           ======================================================== */
        :root {
            --cw-bg-body: #f8fafc;           
            --cw-bg-card: #ffffff;
            --cw-border-light: #e2e8f0;
            --cw-border-dark: #cbd5e1;
            
            --cw-text-primary: #0f172a;
            --cw-text-secondary: #475569;
            --cw-text-tertiary: #64748b;
            
            --cw-accent-main: #0f172a;       /* Azul Marino muy oscuro (Botones principales) */
            --cw-accent-brand: #4f46e5;      /* Indigo */
            --cw-accent-brand-soft: #eef2ff; 
            --cw-accent-diag: #f59e0b;       
            --cw-accent-meds: #10b981;
            --cw-accent-danger: #ef4444;
            --cw-accent-danger-soft: #fef2f2;
            --cw-accent-yellow: #fbbf24;
            
            --cw-shadow-float: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            --cw-shadow-dropdown: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            
            --cw-radius-box: 12px;
            --cw-radius-input: 8px;
            --cw-font-main: 'Plus Jakarta Sans', sans-serif;
        }

        body {
            font-family: var(--cw-font-main);
            background-color: var(--cw-bg-body);
            color: var(--cw-text-primary);
            min-height: 100vh;
            margin: 0;
            font-size: 0.9rem;
            -webkit-font-smoothing: antialiased;
        }

        body.cw-modal-open-custom { overflow: hidden; }

        /* --- LAYOUT ESTRUCTURAL --- */
        .cw-app-shell {
            display: flex;
            flex-direction: column;
            padding: 1rem;
            padding-bottom: 90px;
            max-width: 1500px;
            margin: 0 auto;
            height: 100vh;
        }

        @media (min-width: 992px) {
            .cw-app-shell { 
                flex-direction: row; 
                gap: 2rem; 
                padding: 1.5rem; 
                justify-content: center;
            } 
            .cw-sidebar-panel { width: 440px; flex-shrink: 0; overflow-y: auto; padding-right: 10px; height: calc(100vh - 3rem); }
            .cw-preview-panel { flex-grow: 1; max-width: 900px; height: calc(100vh - 3rem); display: flex; flex-direction: column;}
            
            .cw-sidebar-panel::-webkit-scrollbar { width: 6px; }
            .cw-sidebar-panel::-webkit-scrollbar-track { background: transparent; }
            .cw-sidebar-panel::-webkit-scrollbar-thumb { background: var(--cw-border-dark); border-radius: 10px; }
        }

        /* --- ZIIGO TOP HEADER --- */
        .cw-top-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 1rem 1.5rem; background: white; border-bottom: 1px solid var(--cw-border-light);
            margin-bottom: 1rem;
        }
        .cw-top-header .logo { font-size: 1.8rem; font-weight: 900; color: #f97316; letter-spacing: -1px; }
        .cw-top-header-icons { display: flex; gap: 12px; }
        .cw-th-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--cw-bg-body); display: flex; align-items: center; justify-content: center; color: var(--cw-text-primary); cursor: pointer; }

        /* --- PANEL IZQUIERDO (CONTROLES) --- */
        .cw-editor-header {
            display: flex; align-items: center; justify-content: space-between;
            margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px solid var(--cw-border-light);
        }

        .cw-header-title-wrap { display: flex; align-items: center; gap: 12px; }
        .cw-editor-header h1 { font-size: 1.1rem; font-weight: 800; margin: 0; color: var(--cw-accent-main); }

        /* Indicador de Pasos */
        .cw-flow-steps { display: flex; gap: 8px; }
        .cw-step-dot { 
            width: 10px; height: 10px; border-radius: 50%; background: var(--cw-border-dark); 
            cursor: pointer; transition: 0.2s ease; display: inline-block;
        }
        .cw-step-dot:hover { transform: scale(1.3); }
        .cw-step-dot.active { background: var(--cw-accent-brand); cursor: default; transform: scale(1.2); box-shadow: 0 0 0 3px var(--cw-accent-brand-soft);}
        .cw-step-dot.completed { background: var(--cw-accent-brand); opacity: 0.6; }
        .cw-step-dot.completed:hover { opacity: 1; }

        .cw-control-block {
            background: var(--cw-bg-card); border-radius: var(--cw-radius-box); padding: 1.5rem;
            border: 1px solid var(--cw-border-light); box-shadow: var(--cw-shadow-float); margin-bottom: 1.25rem;
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .cw-field-label {
            font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--cw-text-secondary);
            margin-bottom: 8px; display: block; letter-spacing: 0.05em;
        }

        /* Inputs */
        .cw-input-sharp {
            width: 100%; border: 1px solid var(--cw-border-dark); border-radius: var(--cw-radius-input);
            padding: 12px 14px; font-size: 0.9rem; font-weight: 500; background-color: #fff;
            color: var(--cw-text-primary); transition: all 0.2s; outline: none;
        }
        .cw-input-sharp::placeholder { color: var(--cw-text-tertiary); font-weight: 400; }
        .cw-input-sharp:focus { border-color: var(--cw-accent-brand); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); }

        /* Controles Segmentados */
        .cw-segmented-control {
            display: flex; background: #f1f5f9; padding: 4px; border-radius: 12px; margin-bottom: 1.5rem;
        }
        .cw-segment-btn {
            flex: 1; border: none; padding: 10px 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 600;
            background: transparent; color: var(--cw-text-secondary); transition: all 0.2s ease;
            display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; outline: none;
        }
        .cw-segment-btn.active {
            background: white; color: var(--cw-text-primary); box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-weight: 800;
        }

        /* Grid Signos Vitales */
        .cw-vitals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .cw-vital-input-group { position: relative; }
        .cw-vital-input-group input { padding-right: 36px; }
        .cw-vital-unit { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 0.7rem; font-weight: 700; color: var(--cw-text-tertiary); pointer-events: none; }

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
        
        .cw-cie-badge { background: #e2e8f0; color: #475569; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 800; }
        
        
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


        /* Listas Izquierda (Diagnósticos, Meds, Labs) */
        .cw-selected-list { display: flex; flex-direction: column; gap: 8px; margin-top: 1rem; }
        .cw-selected-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #f8fafc; border: 1px solid var(--cw-border-light); border-radius: var(--cw-radius-input); }
        .cw-selected-info { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: var(--cw-text-primary); }
        .cw-selected-info .sub-detail { font-weight: 400; color: var(--cw-text-secondary); display: block; font-size: 0.75rem; margin-top: 2px;}
        .cw-btn-remove { color: var(--cw-accent-danger); background: transparent; border: none; cursor: pointer; padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center;}
        .cw-btn-remove:hover { background: var(--cw-accent-danger-soft); }

        /* Botones de Acción */
        .cw-btn-action-dark {
            background: var(--cw-accent-main); color: white; border: none; border-radius: var(--cw-radius-input);
            padding: 14px 16px; font-size: 0.9rem; font-weight: 700; width: 100%; transition: all 0.2s;
            display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; outline: none;
        }
        .cw-btn-action-dark:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); }
        
        .cw-btn-action-blue {
            background: #4179ff; color: white; border: none; border-radius: var(--cw-radius-input);
            padding: 14px 16px; font-size: 0.9rem; font-weight: 700; transition: all 0.2s;
            display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; outline: none;margin-right: 10px;
        }
        .cw-btn-action-blue:hover { background: #204787; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2); }

        .cw-btn-action-outline {
            background: transparent; color: var(--cw-accent-main); border: 1px solid var(--cw-border-dark);
            border-radius: var(--cw-radius-input); padding: 14px 16px; font-size: 0.9rem; font-weight: 700;
            width: 100%; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; outline:none;
        }
        .cw-btn-action-outline:hover { background: var(--cw-bg-body); }

        /* Botón de Cámara */
        .cw-btn-camera {
            background: #eff6ff; color: var(--cw-accent-brand); border: 2px dashed #bfdbfe;
            border-radius: var(--cw-radius-input); padding: 16px; font-size: 0.95rem; font-weight: 800;
            width: 100%; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer;
        }
        .cw-btn-camera:hover { background: #dbeafe; border-color: var(--cw-accent-brand); transform: translateY(-2px); }

        /* --- BARRA INFERIOR MÓVIL --- */
        .cw-mobile-bottom-bar {
            position: fixed; bottom: 0; left: 0; width: 100%; background: #ffffff;
            padding: 12px 20px; box-shadow: 0 -4px 15px rgba(0,0,0,0.08); z-index: 9000;
            display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--cw-border-light);
        }
        @media (min-width: 992px) { .cw-mobile-bottom-bar { display: none !important; } }

        .cw-btn-mobile-icon {
            display: flex; align-items: center; justify-content: center; background: #f8fafc; 
            border: 1px solid var(--cw-border-dark); padding: 10px; border-radius: 8px; 
            color: var(--cw-text-primary); cursor: pointer; transition: 0.2s;
        }
        .cw-btn-mobile-icon:hover { background: #e2e8f0; }

        .cw-btn-mobile-doc {
            display: flex; align-items: center; justify-content: center; gap: 8px; background: #f8fafc; 
            border: 1px solid var(--cw-border-dark); padding: 10px 16px; border-radius: 8px; 
            font-weight: 800; color: var(--cw-text-primary); font-size: 0.95rem; cursor: pointer; flex-grow: 1; margin: 0 10px;
        }
        .cw-badge-blue {
            background: var(--cw-accent-brand); color: white; border-radius: 50%; width: 22px; height: 22px;
            display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 800;
        }
        .cw-btn-mobile-save {
            background: var(--cw-accent-main); color: white; border: none; padding: 12px 28px; 
            border-radius: 8px; font-weight: 800; font-size: 0.95rem; cursor: pointer;
        }

        /* --- PANELES DERECHOS (MEDIA Y RECETA) --- */
        .cw-right-panel-container {
            display: flex; flex-direction: column; height: 100%; width: 100%; overflow: hidden;
            border-radius: var(--cw-radius-box); box-shadow: var(--cw-shadow-float); border: 1px solid var(--cw-border-light);
        }

        /* Multimedia Workspace (Paso 1) */
        .cw-media-workspace { background: var(--cw-bg-card); display: flex; flex-direction: column; height: 100%; overflow: hidden; }
        .cw-media-header { padding: 1.5rem; border-bottom: 1px solid var(--cw-border-light); display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
        .cw-media-header h2 { font-size: 1.25rem; font-weight: 800; margin: 0; color: var(--cw-text-primary); display: flex; align-items: center; gap: 10px; }
        .cw-media-header h2 i { color: var(--cw-accent-brand); }
        .cw-media-body { padding: 1.5rem; flex-grow: 1; overflow-y: auto; background: #f1f5f9; scrollbar-width: thin; }
        
        .cw-main-dropzone { border: 2px dashed var(--cw-border-dark); border-radius: 16px; padding: 3rem 2rem; text-align: center; background: white; cursor: pointer; transition: all 0.3s ease; margin-bottom: 2rem; }
        .cw-main-dropzone:hover, .cw-main-dropzone.dragover { border-color: var(--cw-accent-brand); background: var(--cw-accent-brand-soft); }
        .cw-md-icon { color: var(--cw-accent-brand); background: white; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.15); }
        .cw-md-title { font-size: 1.1rem; font-weight: 800; color: var(--cw-text-primary); margin-bottom: 8px; }
        .cw-md-sub { font-size: 0.85rem; font-weight: 500; color: var(--cw-text-secondary); margin-bottom: 4px;}
        
        .cw-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
        .cw-media-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: var(--cw-shadow-float); border: 1px solid var(--cw-border-light); display: flex; flex-direction: column; transition: transform 0.2s; animation: fadeIn 0.3s ease-out; }
        .cw-media-card:hover { transform: translateY(-4px); box-shadow: var(--cw-shadow-dropdown); }
        .cw-mc-preview { height: 160px; background: #e2e8f0; position: relative; cursor: zoom-in; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .cw-mc-preview img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .cw-mc-preview:hover img { transform: scale(1.05); }
        .cw-mc-remove { position: absolute; top: 8px; right: 8px; background: rgba(255, 255, 255, 0.9); color: var(--cw-accent-danger); border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: 0.2s; }
        .cw-mc-remove:hover { background: var(--cw-accent-danger); color: white; }
        .cw-mc-details { padding: 12px; border-top: 1px solid var(--cw-border-light); }
        .cw-mc-input { width: 100%; border: none; background: transparent; font-size: 0.85rem; color: var(--cw-text-primary); outline: none; font-weight: 500; }
        .cw-mc-input::placeholder { color: var(--cw-text-tertiary); font-weight: 400; }

        /* Recipe Paper Workspace (Paso 2) */
        .cw-recipe-workspace {
            background: #e2e8f0; display: block; height: 100%; overflow-y: auto; padding: 2rem;
            text-align: center; scrollbar-width: thin;
        }

        .cw-prescription-sheet {
            background: white; min-height: 29.7cm; width: 100%; max-width: 800px; padding: 4rem;
            display: flex; flex-direction: column; color: var(--cw-text-primary);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-top: 8px solid var(--cw-accent-main);
            margin: 0 auto; text-align: left; height: max-content; flex-shrink: 0;
        }

        /* Diseño interno de la Hoja de Receta */
        .cw-sheet-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--cw-text-primary); }
        .cw-sheet-header h2 { font-size: 1.6rem; font-weight: 900; letter-spacing: -0.03em; margin: 0 0 4px 0; color: var(--cw-text-primary); text-transform: uppercase; }
        .cw-sheet-header .cw-subtitle { font-size: 0.8rem; font-weight: 500; color: var(--cw-text-secondary); letter-spacing: 0.05em; text-transform: uppercase;}
        .cw-sheet-header .cw-doc-meta { text-align: right; }
        .cw-sheet-header .cw-doc-type { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; color: var(--cw-text-tertiary); text-transform: uppercase; margin-bottom: 4px; }

        .cw-patient-inline-bar { display: flex; flex-wrap: wrap; background: #fafafa; border: 1px solid var(--cw-border-light); border-radius: 6px; padding: 12px 16px; gap: 20px; margin-bottom: 2.5rem; align-items: center; }
        .cw-patient-inline-bar .cw-p-item { display: flex; align-items: baseline; gap: 6px; }
        .cw-patient-inline-bar .cw-lbl { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--cw-text-tertiary); }
        .cw-patient-inline-bar .cw-val { font-size: 0.9rem; font-weight: 700; color: var(--cw-text-primary); }

        .cw-section-divider { display: flex; align-items: center; gap: 12px; margin: 1.5rem 0 1rem 0; }
        .cw-section-divider span { font-size: 0.65rem; font-weight: 800; color: var(--cw-text-secondary); text-transform: uppercase; letter-spacing: 0.1em; }
        .cw-section-divider::after { content: ''; flex-grow: 1; height: 1px; background: var(--cw-border-light); }

        .cw-list-item-clean { position: relative; padding: 12px 0 12px 16px; margin-bottom: 8px; border-bottom: 1px solid #f9fafb; display: flex; justify-content: space-between; align-items: flex-start; }
        .cw-list-item-clean:last-child { border-bottom: none; }
        .cw-list-item-clean::before { content: ''; position: absolute; left: 0; top: 16px; width: 3px; height: 14px; border-radius: 2px; }
        .cw-type-med::before { background-color: var(--cw-accent-meds); }
        .cw-type-lab::before { background-color: var(--cw-accent-labs); }
        .cw-item-main-text { font-size: 0.95rem; font-weight: 700; color: var(--cw-text-primary); margin-bottom: 4px; }
        .cw-item-sub-text { font-size: 0.85rem; font-weight: 500; color: var(--cw-text-secondary); line-height: 1.4; }

        /* Notas Observaciones en la Receta */
        .cw-clinical-notes-box {
            margin-top: 2rem; padding: 1rem 1.5rem; background: #fffcf0; border-left: 3px solid var(--cw-accent-yellow);
            font-size: 0.9rem; color: var(--cw-text-primary); font-weight: 500; white-space: pre-wrap; word-wrap: break-word; line-height: 1.6;
        }
        .cw-clinical-notes-box .cw-lbl-note { font-size: 0.65rem; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; display: block; }
        
        /* Cita */
        .cw-appointment-box { margin-top: 1.5rem; display: inline-block; padding: 10px 16px; background: var(--cw-accent-brand-soft); border-radius: 6px; border-left: 3px solid var(--cw-accent-brand); }
        .cw-appointment-box .cw-lbl-apt { font-size: 0.6rem; font-weight: 800; color: var(--cw-accent-brand); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px; }
        .cw-appointment-box .cw-val-apt { font-size: 0.95rem; font-weight: 700; color: var(--cw-text-primary); text-transform: capitalize; }

        .cw-sheet-footer { margin-top: auto; text-align: center; padding-top: 4rem; }
        .cw-stamp-line { width: 200px; height: 1px; background: var(--cw-text-primary); margin: 0 auto 8px; }
        .cw-stamp-text { font-size: 0.85rem; font-weight: 800; color: var(--cw-text-primary); text-transform: uppercase; }
        .cw-stamp-sub { font-size: 0.65rem; color: var(--cw-text-tertiary); letter-spacing: 0.05em; text-transform: uppercase;}

        /* Lógica Móvil Preview Panel */
        @media (max-width: 991px) {
            .cw-app-shell { height: auto; }
            .cw-right-panel-container { border-radius: 0; border: none; }
            .cw-preview-panel {
                position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                background: var(--cw-bg-body); z-index: 9999; transform: translateY(100%);
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); padding: 0;
            }
            .cw-preview-panel.show-mobile { transform: translateY(0); }
            
            /* Ajustes para Evidencia Móvil */
            .cw-media-workspace { border-top: 4px solid var(--cw-accent-brand); }
            .cw-media-header { padding-top: 1.5rem; }
            
            /* Ajustes para Receta Móvil */
            .cw-recipe-workspace { padding: 0; background: var(--cw-bg-body); border-top: 4px solid var(--cw-accent-main);}
            .cw-prescription-sheet { padding: 2rem 1.5rem; min-height: auto; max-width: 100%; box-shadow: none; border-top: none; padding-bottom: 2rem; height: max-content;}
            
            .cw-mobile-preview-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 1rem 1.5rem; border-bottom: 1px solid var(--cw-border-light); background: white;
            }
        }
        @media (min-width: 992px) { .cw-mobile-preview-header { display: none !important; } }

        /* --- VISOR DE IMÁGENES (LIGHTBOX) --- */
        .cw-lightbox {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px);
            z-index: 100000; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; padding: 2rem;
        }
        .cw-lightbox.active { display: flex; opacity: 1; }
        .cw-lightbox-content { position: relative; max-width: 90%; max-height: 90%; display: flex; flex-direction: column; align-items: center; }
        .cw-lightbox-img { max-width: 100%; max-height: 80vh; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); object-fit: contain; }
        .cw-lightbox-caption { color: white; margin-top: 1rem; font-size: 1.1rem; font-weight: 600; }
        .cw-lightbox-close { position: absolute; top: -40px; right: -40px; background: transparent; border: none; color: white; cursor: pointer; padding: 8px; transition: 0.2s; }
        .cw-lightbox-close:hover { transform: scale(1.1); color: var(--cw-accent-danger); }
        @media (max-width: 991px) { .cw-lightbox-close { right: 0; top: -50px; } }

      
        
        .d-none-custom { display: none !important; }

        @media print {
            body { background: #fff; padding: 0; }
            .no-print { display: none !important; }
            .cw-app-shell { display: block; padding: 0; margin: 0; max-width: 100%;}
            .cw-preview-panel { width: 100% !important; margin: 0; padding: 0; }
            .cw-right-panel-container { border: none; box-shadow: none;}
            .cw-recipe-workspace { padding: 0; background: white;}
            .cw-prescription-sheet { padding: 0; min-height: auto; max-width: 100%; box-shadow: none; border-top: none;}
            .cw-patient-inline-bar { border: none; border-bottom: 1px solid #000; background: transparent; padding: 10px 0; border-radius: 0; }
            .cw-clinical-notes-box { background: transparent !important; border-left: 3px solid #fbbf24 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact;}
            .cw-appointment-box { border: 1px solid var(--cw-border-dark); background: transparent !important; }
            .cw-type-med::before { background-color: var(--cw-accent-meds) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .cw-type-lab::before { background-color: var(--cw-accent-labs) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
    </style>
<div class="">
    <div class=" p-2">
        <div class="cw-app-shell">
    
            <!-- LADO IZQUIERDO: FORMULARIOS DINÁMICOS -->
            <div class="cw-sidebar-panel no-print">
                
                <!-- HEADER COMPARTIDO -->
                <div class="cw-editor-header">
                    <div class="cw-header-title-wrap" id="header-title-wrap">
                        <i data-lucide="clipboard-pen" size="22" style="color: var(--cw-accent-meds);" id="header-icon"></i>
                        <h1 id="header-title">Valoración y Diagnóstico</h1>
                    </div>
                    
                    <!-- Pasos: Unificados en 2 -->
                    <div class="cw-flow-steps">
                        <div class="cw-step-dot active" id="dot-step-1" onclick="goToStep(1)" title="Valoración y Diagnóstico"></div>
                        <div class="cw-step-dot" id="dot-step-2" onclick="goToStep(2)" title="Receta"></div>
                    </div>
                </div>
        
                <!-- ========================================== -->
                <!-- PASO 1: VALORACIÓN Y DIAGNÓSTICO UNIFICADO -->
                <!-- ========================================== -->
                <div id="view-step-1">
                    
                    <!-- BLOQUE PACIENTE -->
                
                    <div class="cw-control-block" id="patientBlock">
                        
                        <input type="hidden" id="patient_id" name="patient_id" value="<?php echo $patient['user_id']; ?>">
                        
                    <?php if(isset($patient) && $patient){ ?>
                        
                 
                        <label class="cw-field-label mb-3" style="color: var(--cw-accent-main);"><i data-lucide="user" size="14" class="me-1"></i> Paciente</label>
                        <div class="cw-patient-card">
                            
                            <div class="d-flex justify-content-between align-items-center">
                                
                                <div class="d-flex">
                                    
                                    <div class="cw-card-avatar">
                                        <img style="width: 100%;"  src="<?= $this->crud_model->getPhoto('user',$patient['user_id']); ?>" alt="">
                                    </div>
                                    <div class="cw-card-info ps-2 pt-2">
                                        <h5 class="cw-field-label mb-1"><?php echo $patient['name'].' '.$patient['last_name']; ?></h5>
                                        <small class="cw-field-label">ID #<?php echo $patient['user_id']; ?></small>
                                    </div>
                                  
                                </div>
                        
                                <a href="<?= base_url(); ?>portal/patient_profile/<?= base64_encode($patient['user_id']); ?>" class="btn btn-sm btn-outline-primary">
                                    Ver perfil
                                </a>
                            </div>
                        
                            <hr>
                        
                            <div class="row">
                                <div class="col-md-4">
                                    <strong>Teléfono</strong><br>
                                    <?php echo $patient['phone']; ?>
                                </div>
                        
                                <div class="col-md-2">
                                    <strong>Edad</strong><br>
                                    <div style="text-wrap-mode: nowrap;"><?= $this->crud_model->calcularEdad($patient['birthday']); ?> años</div>
                                </div>
                        
                                <div class="col-md-3">
                                    <strong>Sexo</strong><br>
                                    <div style="text-wrap-mode: nowrap;"><?= $patient['gender'] ?? 'No definido'; ?></div>
                                </div>
                        
                                
                            </div>
                        
                            <div class="mt-3">
                                <div id="cw-history-banner" class="cw-history-banner" style="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="clipboard-list" aria-hidden="true" size="16" class="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>
                                    <span>Historial Disponible)</span>
                                    <button type="button" onclick="openHistoryModal()">Ver</button>
                                </div>
                            </div>
                        </div>
                  
                    
                        
                        
                     
                        
                        <?php } else { ?>
                        
                          
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
                                        <label class="cw-field-label">Nombre</label>
                                        <input type="text" id="cw-in-pt-nombre" class="cw-input-sharp" placeholder="Ej: Carlos Jose">
                                    </div>
                                    <div class="mb-3">
                                        <label class="cw-field-label">Apellido</label>
                                        <input type="text" id="cw-in-pt-lastname" class="cw-input-sharp" placeholder="Ej:Silva Lopez">
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-7">
                                            <label class="cw-field-label">Celular</label>
                                            <input type="tel" id="cw-in-pt-tel" class="cw-input-sharp" placeholder="09xxxxxx">
                                        </div>
                                        <div class="col-5">
                                            <label class="cw-field-label">F. Nacimiento</label>
                                            <input type="date" id="cw-in-pt-edad" class="cw-input-sharp" placeholder="Años">
                                        </div>
                                    </div>
                                </div>
                            
                        <?php } ?>

                    </div>
        
                    <!-- Signos Vitales -->
                    <div class="cw-control-block">
                        <label class="cw-field-label mb-3" style="color: var(--cw-accent-main);"><i data-lucide="activity" size="14" class="me-1"></i> Parámetros clínicos</label>
                        <div class="cw-vitals-grid">
                            <?php 
                            $clinical_records = $this->db->order_by('id','DESC')->get_where('clinical_records',['consultation_id'=>$consultation['id']])->first_row();

                            if(isset($clinical_records)):
                                    $records = $this->db
                                            ->select('
                                                p.id AS parameter_id,
                                                p.name,
                                                p.icon,
                                                p.unit,
                                                cv.value
                                            ')
                                            ->from('clinical_parameters p')
                                            ->join(
                                                'clinical_values cv',
                                                'cv.parameter_id = p.id AND cv.record_id = '.$this->db->escape($clinical_records->id),
                                                'left'
                                            )
                                            ->where('p.status', 1)
                                            ->order_by('p.id', 'ASC')
                                            ->get()
                                            ->result_array();

                                foreach($records as $record):
                            ?>
                                 <div>
                                    <label class="cw-field-label" style="font-size: 0.55rem;"><?= $record['name']; ?></label>
                                    <div class="cw-vital-input-group">
                                        <input type="text" name="values[<?= $record['parameter_id']; ?>]" id="cw-in-temp" class="cw-input-sharp" value="<?= $record['value']; ?>">
                                        <span class="cw-vital-unit"><?= $record['unit']; ?></span>
                                    </div>
                                </div>
                                
                                
                                <?php endforeach; ?>            
                            <?php else:  
                                $parameters = $this->db->get_where('clinical_parameters',['status'=>1])->result_array();

                                foreach($parameters as $p):
                            ?>
                                     
                                <div>
                                    <label class="cw-field-label" style="font-size: 0.55rem;"><?= $p['name']; ?></label>
                                    <div class="cw-vital-input-group">
                                        <input type="text" name="values[<?= $p['id']; ?>]" id="cw-in-temp" class="cw-input-sharp" placeholder="">
                                        <span class="cw-vital-unit"><?= $p['unit']; ?></span>
                                    </div>
                                </div>
                                <?php endforeach; ?>            
                            <?php endif ?>
                           
                        </div>
                    </div>
        
                    <!-- Anamnesis -->
                    <div class="cw-control-block">
                        <div class="mb-3">
                            <label class="cw-field-label">Motivo de Consulta</label>
                            <textarea id="chief_complaint" class="cw-input-sharp" rows="2" placeholder="Ej. Dolor abdominal de 2 días de evolución..."><?= isset($consultation['chief_complaint'] ) ? $consultation['chief_complaint'] : ""; ?></textarea>
                        </div>
                        <div>
                            <label class="cw-field-label">Enfermedad Actual</label>
                            <textarea id="history_present_illness" class="cw-input-sharp" rows="3" placeholder="Desarrollo cronológico de los síntomas..."><?= isset($consultation['history_present_illness'] ) ? $consultation['history_present_illness'] : ""; ?></textarea>
                        </div>
                    </div>
        
                    <!-- Examen Físico -->
                    <div class="cw-control-block">
                        <label class="cw-field-label">Examen Físico Regional</label>
                        <textarea id="physical_examination" class="cw-input-sharp" rows="3" placeholder="Hallazgos en cabeza, cuello, tórax, abdomen..."><?= isset($consultation['physical_examination'] ) ? $consultation['physical_examination'] : ""; ?></textarea>
                    </div>
        
                    <!-- Plan de Tratamiento General -->
                    <div class="cw-control-block mb-4">
                        <label class="cw-field-label">Plan de Tratamiento y Recomendaciones</label>
                        <textarea id="treatment" class="cw-input-sharp" rows="4" placeholder="Dieta, reposo, indicaciones generales no farmacológicas..."><?= isset($consultation['treatment'] ) ? $consultation['treatment'] : ""; ?></textarea>
                    </div>
        
                    <!-- Botón Siguiente Paso (Desktop) -->
                    <div class="d-none d-lg-flex mb-4">
                        <button type="button"
                                id="btnSaveClinical"
                                class="cw-btn-action-blue"
                                onclick="saveClinicalConsultation()">
                            <i data-lucide="save" size="18"></i> Guardar
                        </button>
                        <button class="cw-btn-action-dark" onclick="goToStep(2)">
                            Recetar <i data-lucide="arrow-right" size="18"></i>
                        </button>
                    </div>
                </div>
        
                <!-- ========================================== -->
                <!-- PASO 2: RECETA (Anteriormente Paso 3)      -->
                <!-- ========================================== -->
                <div id="view-step-2" class="d-none-custom">
                    <div class="cw-control-block" id="patientBlock2">
                         
                    <?php if(isset($patient) && $patient){ ?>
                        
                 
                        <label class="cw-field-label mb-3" style="color: var(--cw-accent-main);"><i data-lucide="user" size="14" class="me-1"></i> Paciente</label>
                        <div class="cw-patient-card">
                            
                            <div class="d-flex justify-content-between align-items-center">
                                
                                <div class="d-flex">
                                    
                                    <div class="cw-card-avatar">
                                        <img style="width: 100%;"  src="<?= $this->crud_model->getPhoto('user',$patient['user_id']); ?>" alt="">
                                    </div>
                                    <div class="cw-card-info ps-2 pt-2">
                                        <h5 class="cw-field-label mb-1"><?php echo $patient['name'].' '.$patient['last_name']; ?></h5>
                                        <small class="cw-field-label">ID #<?php echo $patient['user_id']; ?></small>
                                    </div>
                                  
                                </div>
                        
                                <a href="<?= base_url(); ?>portal/patient_profile/<?= base64_encode($patient['user_id']); ?>" class="btn btn-sm btn-outline-primary">
                                    Ver perfil
                                </a>
                            </div>
                        
                            <hr>
                        
                            <div class="row">
                                <div class="col-md-4">
                                    <strong>Teléfono</strong><br>
                                    <?php echo $patient['phone']; ?>
                                </div>
                        
                                <div class="col-md-2">
                                    <strong>Edad</strong><br>
                                    <div style="text-wrap-mode: nowrap;"><?= $this->crud_model->calcularEdad($patient['birthday']); ?> años</div>
                                </div>
                        
                                <div class="col-md-3">
                                    <strong>Sexo</strong><br>
                                    <div style="text-wrap-mode: nowrap;"><?= $patient['gender'] ?? 'No definido'; ?></div>
                                </div>
                        
                                
                            </div>
                        
                            <div class="mt-3">
                                <div id="cw-history-banner" class="cw-history-banner" style="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="clipboard-list" aria-hidden="true" size="16" class="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>
                                    <span>Historial Disponible)</span>
                                    <button type="button" onclick="openHistoryModal()">Ver</button>
                                </div>
                            </div>
                        </div>
                     
                        
                        <?php } ?>

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
                            <textarea id="cw-in-comentario" class="cw-input-sharp" rows="3" placeholder="Redacte las observaciones médicas aquí..."><?= $prescription['comment']; ?></textarea>
                        </div>
                        <div>
                            <label class="cw-field-label">Siguiente Consulta (Opcional)</label>
                            <input type="date" id="cw-in-proxima-cita" value="<?= $prescription['next_appointment']; ?>" class="cw-input-sharp">
                        </div>
                    </div>
            
                    <!-- Botón Guardar -->
                    <div class="d-none d-lg-block mb-4">
                        <button class="cw-btn-action-outline fw-800" >GUARDAR RECETA</button>
                    </div>
                </div>
        
            </div>
        
            <!-- BARRA INFERIOR MÓVIL DINÁMICA -->
            <div class="cw-mobile-bottom-bar no-print">
                <!-- Botón Atrás -->
                <button class="cw-btn-mobile-icon" id="mobile-btn-back" onclick="goToStep(1)" style="display: none;">
                    <i data-lucide="chevron-left" size="20"></i>
                </button>
                
                <!-- Botón Documento/Evidencia -->
                <button class="cw-btn-mobile-doc" id="cw-btn-open-preview">
                    <i data-lucide="image" size="20" style="color: var(--cw-text-secondary);" id="mobile-btn-doc-icon"></i>
                    <span id="mobile-btn-doc-text">Evidencia</span>
                    <div class="cw-badge-blue" id="mobile-file-counter">0</div>
                </button>
                
                <!-- Botón Guardar / Siguiente -->
                <button class="cw-btn-mobile-save" id="mobile-btn-next" onclick="goToStep(2)">
                    Receta
                </button>
            </div>
        
            <!-- LADO DERECHO: PANELES DINÁMICOS -->
            <div class="cw-preview-panel" id="cw-preview-panel-id">
                
                <!-- CONTENEDOR COMÚN (Borde redondeado en desktop) -->
                <div class="cw-right-panel-container">
                    
                    <!-- HEADER MÓVIL -->
                    <div class="cw-mobile-preview-header d-lg-none" id="mobile-right-header">
                        <div class="fw-800 text-primary d-flex align-items-center" style="font-size: 1.1rem; color: var(--cw-accent-main);" id="mobile-right-title">
                            <i data-lucide="images" size="20" class="me-2" style="color: var(--cw-accent-brand);"></i> Galería Clínica
                        </div>
                        <button class="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" id="cw-btn-close-preview" style="width: 36px; height: 36px; border: none; background: #f1f5f9;">
                            <i data-lucide="x" size="20"></i>
                        </button>
                    </div>
        
                    <!-- VISTA A: ESPACIO DE TRABAJO MULTIMEDIA (Paso 1) -->
                    <div class="cw-media-workspace" id="workspace-media">
                        <div class="cw-media-header d-none d-lg-flex">
                            <h2><i data-lucide="image-plus" size="24"></i> Evidencia Clínica Adjunta</h2>
                            <div style="font-size: 0.85rem; color: var(--cw-text-secondary); font-weight: 600;">
                                Radiografías, Fotos o Exámenes
                            </div>
                        </div>
        
                        <div class="cw-media-body">
                            <div class="cw-main-dropzone" id="cw-main-dropzone" onclick="document.getElementById('cw-file-upload').click()">
                                <div class="cw-md-icon"><i data-lucide="upload-cloud" size="32"></i></div>
                                <div class="cw-md-title">Arrastra y suelta tus archivos aquí</div>
                                <div class="cw-md-sub">o haz clic para explorar en tu computadora o móvil</div>
                                <input type="file" id="cw-file-upload" multiple accept="image/*,.pdf" style="display:none;">
                            </div>
        
                            <div class="cw-gallery-grid" id="cw-gallery-grid">
                                <!-- Galería JS -->
                            </div>
                        </div>
                    </div>
        
                    <!-- VISTA B: HOJA DE RECETA OFICIAL (Paso 2) -->
                    <div class="cw-recipe-workspace d-none-custom" id="workspace-receta">
                        <div class="cw-prescription-sheet">
                            <!-- Encabezado Editorial Nítido -->
                            <div class="cw-sheet-header">
                                <div>
                                    <h2>DR. <?= $this->crud_model->getName('user',$consultation['doctor_id']); ?></h2>
                                    <div class="cw-subtitle">MÉDICO INTERNISTA ESP.</div>
                                    <div class="cw-subtitle text-muted mt-1" style="text-transform: none;">Clínica Torre Médica, Piso 4</div>
                                </div>
                                <div class="cw-doc-meta">
                                    <div class="cw-doc-type">Prescripción Oficial</div>
                                    <div id="cw-view-fecha" class="fw-800" style="font-size:0.95rem; color: var(--cw-text-primary);">--/--/----</div>
                                    <div class="cw-subtitle text-muted mt-1" style="text-transform: none;">MSP: 4433-22-BA</div>
                                </div>
                            </div>
        
                            <!-- Barra Paciente Compacta -->
                            <div class="cw-patient-inline-bar">
                                <div class="cw-p-item"><span class="cw-lbl">Paciente:</span> <span class="cw-val patient-name"><?php echo $patient['name'].' '.$patient['last_name']; ?></span></div>
                                <div class="cw-p-item"><span class="cw-lbl">Edad:</span> <span class="cw-val patient-age"><?= $this->crud_model->calcularEdad($patient['birthday']); ?> años</span></div>
                                <div class="cw-p-item"><span class="cw-lbl">Tel:</span> <span class="cw-val patient-phone"><?php echo $patient['phone']; ?></span></div>
                            </div>
        
                            <!-- Medicamentos -->
                            <div id="cw-preview-rx-section" style="display: none;">
                                <div class="cw-section-divider"><span>Plan Farmacológico</span></div>
                                <div id="cw-view-meds-list"></div>
                            </div>
        
                            <!-- Laboratorio -->
                            <div id="cw-preview-lab-section" style="display: none; margin-top: 2rem;">
                                <div class="cw-section-divider"><span>Estudios Complementarios</span></div>
                                <div id="cw-view-labs-list"></div>
                            </div>
        
                            <!-- Notas Clínicas -->
                            <div id="cw-view-notas-box" style="display: <?= $prescription['comment'] == '' ? 'none':'block'; ?>;">
                                <div class="cw-clinical-notes-box">
                                    <span class="cw-lbl-note">Observaciones Clínicas</span>
                                    <div id="cw-view-notas"><?= $prescription['comment']; ?></div>
                                </div>
                            </div>
        
                            <!-- Próxima Cita -->
                            <div id="cw-view-cita-box" style="display: <?= $prescription['next_appointment'] == '' ? 'none':'block'; ?>;">
                                <div class="cw-appointment-box">
                                    <span class="cw-lbl-apt">Próxima Consulta</span>
                                    <div class="cw-val-apt" id="cw-view-cita"><?= $prescription['next_appointment']; ?></div>
                                </div>
                            </div>
        
                            <!-- Firma Minimalista -->
                            <div class="cw-sheet-footer">
                                <div class="cw-stamp-line"></div>
                                <div class="cw-stamp-text">DR. <?= $this->crud_model->getName('user',$consultation['doctor_id']); ?></div>
                                <div class="cw-stamp-sub">FIRMA Y SELLO AUTORIZADO</div>
                            </div>
                        </div>
                        
                        <div class="text-center mt-4 mb-5 pb-5 no-print cw-print-container">
                            <button onclick="window.print()" class="cw-btn-action-outline" style="display: inline-flex; width: auto; padding: 12px 32px; border-radius: 30px; background: white;">
                                <i data-lucide="printer" size="18"></i> Imprimir 
                            </button>
                            <button  id="btn-download-recipe" onclick="downloadRecipe(<?= $prescription['id']; ?>)" class="cw-btn-action-outline" style="display: inline-flex; width: auto; padding: 12px 32px; border-radius: 30px; background: white;">
                                <i data-lucide="download" size="18"></i> Descargar
                            </button>
                            <button  id="btn-send-recipe" onclick="sendRecipe(<?= $prescription['id']; ?>)" class="cw-btn-action-outline" style="display: inline-flex; width: auto; padding: 12px 32px; border-radius: 30px; background: white;">
                               <i data-lucide="message-circle"></i> Enviar
                            </button>
                        </div>
                    </div>
        
                </div>
            </div>
        </div>
        
        <!-- LIGHTBOX PARA VER IMÁGENES GRANDES -->
        <div class="cw-lightbox" id="cw-lightbox">
            <div class="cw-lightbox-content">
                <button class="cw-lightbox-close" onclick="closeLightbox()"><i data-lucide="x-circle" size="32"></i></button>
                <img src="" alt="Vista previa" class="cw-lightbox-img" id="cw-lightbox-img">
                <div class="cw-lightbox-caption" id="cw-lightbox-caption"></div>
            </div>
        </div>
        
        <!-- Contenedor para Toasts -->
       
    </div>
</div>

<script>
    let currentStep = 1;
    
             
        function saveClinicalConsultation(){

            let values = {};
        
            $('input[name^="values"]').each(function(){
        
                let match = $(this).attr('name').match(/\[(\d+)\]/);
        
                if(match){
                    values[match[1]] = $(this).val();
                }
        
            });
            
            
            let patient_data = null;
            
            if ($('#patient_id').val() == 0) {
                
                if( $('#cw-in-pt-nombre').val() == '' || $('#cw-in-pt-lastname').val() == '' || $('#cw-in-pt-tel').val() == '')
                {
                    Swal.fire({
                        icon:'error',
                        title:'Error',
                        text:'Debe seleccionar un paciente o agregar los datos de uno nuevo.'
                    });
                    
                    return;
                    
                }
                
                patient_data = {
                    id: $('#patient_id').val(),
                    name: $('#cw-in-pt-nombre').val(),
                    last_name: $('#cw-in-pt-lastname').val(),
                    phone: $('#cw-in-pt-tel').val(),
                    birthday: $('#cw-in-pt-edad').val()
                };
            
            }
            
        
            $.ajax({
                url: '<?= base_url('portal/consultations/update/'.$consultation['id']); ?>',
                type: 'POST',
                dataType: 'json',
                data:{
                    patient_id: $('#patient_id').val(),
                    patient_data: patient_data,
                    chief_complaint: $('#chief_complaint').val(),
                    history_present_illness: $('#history_present_illness').val(),
                    physical_examination: $('#physical_examination').val(),
                    treatment: $('#treatment').val(),
                    values: values
                },
                beforeSend:function(){
        
                    $('#btnSaveClinical')
                        .prop('disabled',true)
                        .text('Guardando...');
        
                },
                success:function(response){
        
                    if(response.status){
        
                        $('#patient_id').val(response.patient.user_id);
                        
                        html_patient = `
                            <div class="cw-control-block">
                                <label class="cw-field-label mb-3" style="color:var(--cw-accent-main)">
                                    <i data-lucide="user" size="14"></i> Paciente
                                </label>
            
                                <div class="cw-patient-card">
            
                                    <div class="d-flex justify-content-between align-items-center">
            
                                        <div class="d-flex">
            
                                            <div class="cw-card-avatar">
                                                <img style="width:100%" src="${base_url}public/assets/images/avatars/${response.patient.name[0].toUpperCase()}.png">
                                            </div>
            
                                            <div class="cw-card-info ps-2 pt-2">
                                                <h5 class="cw-field-label mb-1">
                                                    ${response.patient.name} ${response.patient.last_name}
                                                </h5>
            
                                                <small>ID #${response.patient.user_id}</small>
                                            </div>
            
                                        </div>
            
                                        <a href="${base_url}portal/patient_profile/${btoa(response.patient.user_id)}"
                                           class="btn btn-sm btn-outline-primary">
                                            Ver perfil
                                        </a>
            
                                    </div>
            
                                </div>
            
                            </div>
                        `;
                        
                        $('#patientBlock').html(html_patient);
                        $('#patientBlock2').html(html_patient);
                        
                        $('.patient-name').html(response.patient.name+' '+response.patient.last_name);
                        $('.patient-phone').html(response.patient.phone);
                        
                        showToast('¡Consulta Guardada!');
        
                    }else{
        
                        Swal.fire({
                            icon:'error',
                            title:'Error',
                            text:response.message
                        });
        
                    }
        
                },
                error:function(){
        
                    Swal.fire({
                        icon:'error',
                        title:'Error',
                        text:'No fue posible guardar la información.'
                    });
        
                },
                complete:function(){
        
                    $('#btnSaveClinical')
                        .prop('disabled',false)
                        .text('Guardar');
        
                }
            });
        
        }
    
    document.addEventListener('DOMContentLoaded', () => {
        const galleryGrid = document.getElementById('cw-gallery-grid');
        const counterMobile = document.getElementById('mobile-file-counter');
        let attachedMedia = <?= json_encode($media); ?>;
        
        lucide.createIcons();
         renderGallery();
    
        $('.right-chat').removeClass('active-sidebar');
        $('.main-content  ').removeClass('right-chat-active');
        
        // --- TABS LOGIC ---

        
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

                $('#patient_id').val(id);

                $('#cw-results-paciente').hide();

                // NUEVO: verificar historial
                loadPatientHistoryInfo(id);
            });
            
            function loadPatientHistoryInfo(patient_id){

                $('#cw-history-banner').show();
                $('#cw-history-banner span').text(`Historial Disponible)`);

            }
            
        
         // Config Fecha Hoja
        const now = new Date();
        document.getElementById('cw-view-fecha').innerText = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

        // --- NAVEGACIÓN ENTRE PASOS (SPA LOGIC UNIFICADA A 2 PASOS) ---
        window.goToStep = function(step) {
            currentStep = step;
            
            const view1 = document.getElementById('view-step-1');
            const view2 = document.getElementById('view-step-2');
            
            const dot1 = document.getElementById('dot-step-1');
            const dot2 = document.getElementById('dot-step-2');
            
            const titleWrap = document.getElementById('header-title-wrap');
            
            const wsMedia = document.getElementById('workspace-media');
            const wsReceta = document.getElementById('workspace-receta');
            
            // Mobile Buttons
            const btnBack = document.getElementById('mobile-btn-back');
            const btnNext = document.getElementById('mobile-btn-next');
            const btnDocText = document.getElementById('mobile-btn-doc-text');
            const btnDocIcon = document.getElementById('mobile-btn-doc-icon');
            const badgeMedia = document.getElementById('mobile-file-counter');

            // Reset Views
            view1.classList.add('d-none-custom');
            view2.classList.add('d-none-custom');
            
            dot1.className = 'cw-step-dot';
            dot2.className = 'cw-step-dot';

            if (step === 1) {
                view1.classList.remove('d-none-custom');
                titleWrap.innerHTML = `<i data-lucide="clipboard-pen" size="22" style="color: var(--cw-accent-brand);"></i><h1 style="color: var(--cw-accent-main);">Valoración y Diagnóstico</h1>`;
                dot1.className = 'cw-step-dot active';
                
                // Panel Derecho: Media
                wsMedia.classList.remove('d-none-custom');
                wsReceta.classList.add('d-none-custom');
                
                // Mobile
                btnBack.style.display = 'none';
                btnNext.innerText = 'Receta';
                btnNext.onclick = () => goToStep(2);
                btnDocText.innerText = 'Evidencia';
                btnDocIcon.setAttribute('data-lucide', 'image');
                badgeMedia.style.display = 'flex';
                updateMobileRightHeader('Galería Clínica', 'images', 'var(--cw-accent-brand)');
            } 
            else if (step === 2) {
                view2.classList.remove('d-none-custom');
                titleWrap.innerHTML = `<i data-lucide="pill" size="22" style="color: var(--cw-accent-meds);"></i><h1 style="color: var(--cw-accent-main);">Emitir Receta</h1>`;
                dot1.className = 'cw-step-dot completed';
                dot2.className = 'cw-step-dot active';
                
                // Panel Derecho: RECETA
                wsMedia.classList.add('d-none-custom');
                wsReceta.classList.remove('d-none-custom');
                
                // Mobile
                btnBack.style.display = 'flex';
                btnBack.onclick = () => goToStep(1);
                btnNext.innerText = 'Guardar';
                btnNext.onclick = () => showToast('¡Consulta Guardada y Finalizada!');
                btnDocText.innerText = 'Ver Receta';
                btnDocIcon.setAttribute('data-lucide', 'file-text');
                badgeMedia.style.display = 'none'; // Ocultar contador en esta vista
                updateMobileRightHeader('Hoja de Prescripción', 'file-check', 'var(--cw-accent-main)');
            }
            
            lucide.createIcons();
            if(window.innerWidth < 992) window.scrollTo(0,0);
        }

        function updateMobileRightHeader(title, icon, color) {
            document.getElementById('mobile-right-title').innerHTML = `<i data-lucide="${icon}" size="20" class="me-2" style="color: ${color};"></i> ${title}`;
        }

        // --- LÓGICA MÓVIL (PANEL DERECHO) ---
        const previewPanel = document.getElementById('cw-preview-panel-id');
        const body = document.body;
        document.getElementById('cw-btn-open-preview').addEventListener('click', () => {
            previewPanel.classList.add('show-mobile'); body.classList.add('cw-modal-open-custom');
        });
        document.getElementById('cw-btn-close-preview').addEventListener('click', () => {
            previewPanel.classList.remove('show-mobile'); body.classList.remove('cw-modal-open-custom');
        });
        
               // --- LÓGICA PASO 2: RECETA Y LABORATORIO ---
        window.switchModule = function(mod) {
            document.getElementById('tab-med-btn').classList.remove('active');
            document.getElementById('tab-lab-btn').classList.remove('active');
            document.getElementById(`tab-${mod}-btn`).classList.add('active');
            
            document.getElementById('module-med').classList.add('d-none-custom');
            document.getElementById('module-lab').classList.add('d-none-custom');
            document.getElementById(`module-${mod}`).classList.remove('d-none-custom');
        };
        
         // --- SISTEMA DE CARGA Y GALERÍA DE ARCHIVOS (MEDIA WORKSPACE) ---
       
        const dropzone = document.getElementById('cw-main-dropzone');
        const fileInput = document.getElementById('cw-file-upload');
       
       

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => { dropzone.addEventListener(eventName, preventDefaults, false); });
        function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }
        ['dragenter', 'dragover'].forEach(eventName => { dropzone.addEventListener(eventName, () => dropzone.classList.add('dragover'), false); });
        ['dragleave', 'drop'].forEach(eventName => { dropzone.addEventListener(eventName, () => dropzone.classList.remove('dragover'), false); });

        dropzone.addEventListener('drop', (e) => { let dt = e.dataTransfer; handleFiles(dt.files); });
        fileInput.addEventListener('change', function() { handleFiles(this.files); });
       
        function handleFiles(files) {

            ([...files]).forEach(file => {
        
                uploadSingleMedia(file);
        
            });
        
        }
        
        function uploadSingleMedia(file){

            let formData = new FormData();
            patient_id = $('#patient_id').val();
            
         
            
            if(patient_id == 0)
            {
                Swal.fire({
                    icon:'error',
                    title:'Error',
                    text:'Debe seleccionar un paciente o agregar los datos de uno nuevo.'
                });
                
                return;
                
            }
                

            formData.append('consultation_id', <?= $consultation['id']; ?>);
            formData.append('patient_id', patient_id);
            formData.append('file', file);
            let toastId = showLoadingToast('Subiendo archivo...');
            
            $.ajax({
        
                url: base_url + 'consultations/uploadSingleMedia',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                
                success: function(response){
        
                    console.log('RESPONSE:', response);
        
                    if(response.status){
                        
                         updateToast(toastId, 'Archivo subido correctamente', 'success');
                        
                        attachedMedia.push({
                            id: response.id,
                            name: response.original_name || response.file_name,
                            file_name: response.file_name,
                            url: response.url,
                            note: response.note || '',
                            mime_type: 'image'
                        });
        
                        renderGallery();
        
                    }else{
        
                       updateToast(toastId, 'Hubo un problema al subir el archivo.', 'error');
        
                    }
        
                },
        
                error: function(xhr){
            
                    updateToast(toastId, 'Error de conexión', 'error');

                    console.log(xhr.responseText);
        
                }
        
            });
        
        }
        
        
        function deleteMedia(id){

            $.post(
                base_url + 'consultations/deleteMedia',
                {id:id},
                function(response){
        
                    if(response.status){
        
                        attachedMedia = attachedMedia.filter(x => x.id != id);
        
                        renderGallery();
        
                    }
        
                },
                'json'
            );
        
        }

      

        function renderGallery(){

            galleryGrid.innerHTML = '';
        
            if(counterMobile){
                counterMobile.innerText = attachedMedia.length;
            }
        
            attachedMedia.forEach(file => {
                
                
                
                let url = file.url || base_url + 'uploads/consultations/' + file.file_name;

                let name = file.name || file.file_name || 'archivo';

                 const isImage = (file.type && file.type.startsWith('image'))
                    || url.match(/\.(jpg|jpeg|png|webp|avif)$/i);
                
               console.log(name);

              
                let previewContent = '';
        
                if(isImage){
        
                    previewContent = `
                        <img src="${url}" 
                             onclick="openLightbox('${url}','${name}')">
                    `;
        
                }else{
        
                    previewContent = `
                        <div style="text-align:center; padding:2rem 0;">
                            <i data-lucide="file-text" size="48"></i>
                            <div style="font-size:12px;">${name}</div>
                        </div>
                    `;
                }
        
                galleryGrid.insertAdjacentHTML('beforeend',`
        
                    <div class="cw-media-card">
        
                        <div class="cw-mc-preview">
        
                            ${previewContent}
        
                            <button type="button"
                                    class="cw-mc-remove"
                                    data-id="${file.id}"
                                   >
        
                                <i data-lucide="trash-2" size="16"></i>
        
                            </button>
        
                        </div>
        
                        <div class="cw-mc-details">
        
                            <input type="text"
                                   class="cw-mc-input"
                                   value="${name || ''}"
                                   onchange="updateMediaNote(${file.id}, this.value)">
        
                        </div>
        
                    </div>
        
                `);
        
            });
        
            lucide.createIcons();
        }

        // Inicializar vista en paso 1
        goToStep(1);
        
         document.addEventListener('click', function(e){

            const btn = e.target.closest('.cw-mc-remove');
            if(!btn) return;
    
            deleteMedia(btn.dataset.id);
    
        });
        
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
        
        
        
        document.querySelector('.cw-btn-action-outline').addEventListener('click', savePrescription);
        
        function savePrescription() 
        {

            if(medsList.length === 0 && labsList.length === 0){
                alert("Agrega al menos un medicamento o estudio");
                return;
            }
   
            
            let data = {
                patient_id: $('#patient_id').val() || null,
                patient_name: $('#cw-view-nombre').text(),
                consultation_id: <?= $consultation['id']; ?>,
                phone: $('#cw-view-tel').text(),
                age: $('#cw-view-edad').text(),

                medications: medsList,
                labs: labsList,
                comment: $('#cw-in-comentario').val(),
                next_appointment: $('#cw-in-proxima-cita').val()
            };

            $.ajax({
                url: "<?= base_url('portal/prescription/save') ?>",
                type: "POST",
                data: {data: JSON.stringify(data)},
                dataType: "json",
                success: function(res){
                    console.log(res);
                    if(res.status){
                        
                       $('#btn-download-recipe').attr('onclick',`downloadRecipe(${res.prescription_id})`)
                       $('#btn-send-recipe').attr('onclick',`sendRecipe(${res.prescription_id})`)
                       showToast('¡Receta Guardada!');
                    }
                },
                error: function(e){
                    console.log(e.responseText);
                   
                }
            });
        }
        
        
        
                // Notas Historial
        document.getElementById('cw-in-comentario').addEventListener('input', (e) => {
            const val = e.target.value;
            document.getElementById('cw-view-notas-box').style.display = val ? 'block' : 'none';
            document.getElementById('cw-view-notas').innerText = val;
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
                    document.getElementById('cw-view-cita').innerText = val;
                } else {
                    document.getElementById('cw-view-cita').innerText = "";
                }
            });
        });

        document.getElementById('cw-view-fecha').innerText = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        
        
    });
    
    // --- Botones de receta  ---
    function downloadRecipe(id) {
       window.open("<?= base_url('portal/prescription/download_pdf/') ?>" + id, '_blank');
    }
    
     function sendRecipe(id) {
    
        let toastId = showLoadingToast('Enviando receta...');
    
        $.ajax({
            url: '<?= base_url('portal/prescription/send_whatsapp/') ?>' + id,
            type: 'GET',
            dataType: 'json',
    
            success: function(response){
    
                if(response.status){
                    updateToast(toastId, 'Receta enviada', 'success');
                }else{
                    updateToast(toastId, response.msg || 'Hubo un problema al enviar la receta', 'error');
                }
    
            },
    
            error: function(xhr, status, error){
    
                console.error(xhr.responseText);
    
                updateToast(
                    toastId,
                    'Error de conexión (' + xhr.status + '): ' + error,
                    'error'
                );
    
            }
    
        });
    
    }
    
    // --- LOGICA DE LIGHTBOX (Visor de Imágenes) ---
    function openLightbox(src, caption) {
        const lightbox = document.getElementById('cw-lightbox');
        document.getElementById('cw-lightbox-img').src = src;
        document.getElementById('cw-lightbox-caption').innerText = caption;
        lightbox.style.display = 'flex'; setTimeout(() => lightbox.classList.add('active'), 10);
    }
    function closeLightbox() {
        const lightbox = document.getElementById('cw-lightbox');
        lightbox.classList.remove('active'); setTimeout(() => lightbox.style.display = 'none', 300);
    }

    // --- SISTEMA DE TOASTS ---
    function showToast(message) {
        const container = document.getElementById('cw-toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'cw-toast';
        toast.innerHTML = `<i data-lucide="check-circle" size="20" style="color: #34d399;"></i><span>${message}</span>`;
        container.appendChild(toast);
        lucide.createIcons();
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
    }
    
    function showLoadingToast(message){

        const container = document.getElementById('cw-toast-container');
        if(!container) return null;
    
        const id = 'toast_' + Date.now();
    
        const toast = document.createElement('div');
        toast.className = 'cw-toast cw-toast-loading';
        toast.id = id;
    
        toast.innerHTML = `
            <i data-lucide="loader" class="cw-spin" size="20"></i>
            <span>${message}</span>
        `;
    
        container.appendChild(toast);
        lucide.createIcons();
    
        setTimeout(() => toast.classList.add('show'), 10);
    
        return id;
    }
    
    function updateToast(id, message, type = 'success'){

        const toast = document.getElementById(id);
        if(!toast) return;
    
        const icon = type === 'error'
            ? 'x-circle'
            : 'check-circle';
    
        toast.innerHTML = `
            <i data-lucide="${icon}" size="20"></i>
            <span>${message}</span>
        `;
    
        lucide.createIcons();
    
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }


        
            
        // --- IA Functions ---
       
        // --- LÓGICA PASO 1 (AHORA INCLUYE DIAGNÓSTICOS): BUSCADOR CIE-10 ---


        let prescriptionDetails = <?= json_encode($prescription_details); ?>;

        let medsList = [];
        let labsList = [];
        
        prescriptionDetails.forEach(item => {
        
            if(item.type === 'med'){
                medsList.push({
                    id: item.id,
                    type: item.type,
                    n: item.name,
                    d: item.dose
                });
            }
        
            if(item.type === 'lab'){
                labsList.push({
                    id: item.id,
                    type: item.type,
                    n: item.name
                });
            }
        
        });
        
        
        renderMedsAndLabs();
    
        // Añadir Fármaco
        document.getElementById('cw-btn-add-med').addEventListener('click', () => {
            
            const id = $('#cw-product-id').val() || null;
            const n = document.getElementById('cw-search-med').value.trim();
            const d = document.getElementById('cw-in-dosis').value.trim();
            
            if(!n) return;
            
            medsList.push({id:id, n: n, d: d });
            
            document.getElementById('cw-search-med').value = ''; document.getElementById('cw-in-dosis').value = '';
            
            renderMedsAndLabs();
        });

        // Añadir Laboratorio
        document.getElementById('cw-btn-add-lab').addEventListener('click', () => {
            const n = document.getElementById('cw-in-lab-name').value.trim();
            const o = document.getElementById('cw-in-lab-note').value.trim();
            if(!n) return;
            labsList.push({ name: n, note: o });
            document.getElementById('cw-in-lab-name').value = ''; document.getElementById('cw-in-lab-note').value = '';
            renderMedsAndLabs();
        });

        window.removeItem = (type, index) => {
            if(type === 'med') medsList.splice(index, 1); else labsList.splice(index, 1);
            
            renderMedsAndLabs();
        };

        function renderMedsAndLabs() {

            // Render Hoja Derecha (Documento)
            const secMeds = document.getElementById('cw-preview-rx-section');
            const viewMeds = document.getElementById('cw-view-meds-list');
            secMeds.style.display = medsList.length ? 'block' : 'none';
            viewMeds.innerHTML = medsList.map((m,i) => `
                <div class="cw-list-item-clean cw-type-med fade-in-item ">
                    <div class="flex-grow-1">
                        <div class="cw-item-main-text">${m.n}</div>${m.d ? `<div class="cw-item-sub-text">${m.d}</div>` : ''}
                        
                    </div>
                    <button class="cw-btn-remove-ghost" onclick="removeItem('med', ${i})" title="Quitar">
                            <i data-lucide="x" size="20"></i>
                        </button>
                </div>
            `).join('');

            const secLabs = document.getElementById('cw-preview-lab-section');
            const viewLabs = document.getElementById('cw-view-labs-list');
            secLabs.style.display = labsList.length ? 'block' : 'none';
            viewLabs.innerHTML = labsList.map(l => `
                <div class="cw-list-item-clean cw-type-lab">
                    <div class="flex-grow-1"><div class="cw-item-main-text">${l.n}</div>${l.d ? `<div class="cw-item-sub-text">Nota: ${l.d}</div>` : ''}</div>
                </div>
            `).join('');

            lucide.createIcons();
        }

        




       
</script>
