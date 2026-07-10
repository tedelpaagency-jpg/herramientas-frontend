<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificación Premium de ZIIGO</title>
    <style>
        /* Estilos base con mejoras visuales modernas */
        body {
            margin: 0;
            padding: 0;
            background-color: #f8fafc; /* Fondo más aireado y limpio */
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
        }
        
        table {
            border-spacing: 0;
            border-collapse: collapse;
            width: 100%;
        }
        
        td {
            padding: 0;
        }
        
        img {
            border: 0;
            display: block;
        }
        
        .wrapper {
            background-color: #f8fafc;
            padding: 40px 0;
        }

        /* Contenedor con sombra profunda y bordes más redondeados */
        .main-container {
            background-color: #ffffff;
            margin: 0 auto;
            max-width: 550px;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            overflow: hidden;
        }

        /* Botón con degradado y sombra de elevación */
        .action-button {
            background: linear-gradient(135deg, #1877f2 0%, #0a56bd 100%);
            color: #ffffff !important;
            font-weight: 600;
            font-size: 15px;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            box-shadow: 0 4px 14px rgba(24, 119, 242, 0.4);
        }

        /* Footer con degradado suave en el fondo */
        .footer-profile {
            background: linear-gradient(to bottom, #ffffff, #f1f5f9);
            border-top: 1px solid #e2e8f0;
            padding: 24px;
        }

        .profile-img {
            border-radius: 50%;
            width: 52px;
            height: 52px;
            object-fit: cover;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Icono con degradado circular */
        .icon-circle {
            background: radial-gradient(circle at top left, #e7f3ff, #cfe3ff);
            width: 44px; 
            height: 44px; 
            border-radius: 12px; /* Estilo 'squircle' moderno */
            text-align: center;
        }
    </style>
</head>
<body>
    <?php
                                
        
        $agency_id = 1; 
    ?>
    <div class="wrapper">
        
        <!-- HEADER / LOGO -->
        <table align="center" style="max-width: 550px; margin-bottom: 24px;">
            <tr>
                <td align="center">
                    <!-- Representación de Logo Profesional -->
                    <div style="padding: 10px;">
                        <img src="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfoAgency('logo',$agency_id); ?>" alt="Logo Empresa <?= $agency_id; ?>" width="160">
                    </div>
                </td>
            </tr>
        </table>

        <!-- TARJETA PRINCIPAL -->
        <table class="main-container" align="center" cellpadding="0" cellspacing="0">
            
            <!-- Encabezado con efecto de barra superior -->
            <tr>
                <td style="height: 4px; background: linear-gradient(to right, #1877f2, #38bdf8);"></td>
            </tr>

            <!-- Encabezado de la Notificación -->
            <tr>
                <td style="padding: 20px 24px; background-color: #ffffff;">
                    <table>
                        <tr>
                            <td width="44" valign="top">
                                <div class="icon-circle">
                                    <img src="https://cdn-icons-png.flaticon.com/512/3602/3602145.png" alt="Notificación" width="22" style="padding-top: 11px; margin: 0 auto;">
                                </div>
                            </td>
                            <td style="padding-left: 16px;">
                                <div style="font-size: 14px; color: #0f172a;">
                                    <strong>Centro de Notificaciones</strong>
                                    <span style="color: #64748b;"> </span>
                                </div>
                                <div style="font-size: 12px; color: #94a3b8; margin-top: 4px; font-weight: 500;">TECNOLOGIA ZIIGO</div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Contenido Principal -->
            <tr>
                <td style="padding: 0 24px 32px 24px;">
                    <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: -0.025em;">Error en la solicitud</h2>
                    
                    <!-- Detalle de la tarea (Estilo Glassmorphism / Elevado) -->
                    <table width="100%" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
                        <tr>
                            <td style="padding: 20px; border-left: 4px solid #1877f2;">
                                <div style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 6px;">Motivo del rechazo</div>
                                <div style="font-size: 18px; color: #0f172a; font-weight: 700; margin-bottom: 16px;"><?= $rason; ?></div>
                                
                            </td>
                        </tr>
                    </table>

                </td>
            </tr>

            <!-- FOOTER DE LA TARJETA (Personal) -->
            
            <tr>
                <td class="footer-profile">
                    <table width="100%">
                        <tr>
                            <td width="52" valign="top">
                                <img src="<?= base_url(); ?>public/assets/images/logo/<?= $this->crud_model->getInfoAgency('logo',$agency_id); ?>" alt="Responsable" class="profile-img">
                            </td>

                                <td style="padding-left: 16px; vertical-align: middle;">
                                    <div style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.025em; margin-bottom: 2px;">Conctácto</div>
                                    <div style="font-size: 15px; font-weight: 600; color: #1e293b;"><?= $this->crud_model->getInfoAgency('name',$agency_id); ?></div>
                                    <div style="font-size: 14px; color: #1877f2; font-weight: 700; margin-top: 2px;">
                                        <img src="https://cdn-icons-png.flaticon.com/512/724/724664.png" width="12" style="display: inline; vertical-align: middle; margin-right: 4px;"> 
                                        +<?= $this->crud_model->getInfoAgency('phone',$agency_id); ?>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            
        </table>

        

    </div>

</body>
</html>