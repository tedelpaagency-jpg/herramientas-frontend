<?php $user_id = 128; // ID del usuario logueado ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Formulario Visa Americana DS-160</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">

  <style>
    body {
      background-color: #1c2223;
      /*background-image: url('https://portal.trivali.ec/public/assets/images/fondo.png'); */
      color: #212529;
    }

    .container {
      max-width: 1000px;
      margin-top: 30px;
    }

    .border {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }

    h5 {
      margin-bottom: 15px;
    }

    .is-valid {
      border-color: #28a745 !important;
    }

    .is-invalid {
      border-color: #dc3545 !important;
    }
    
    /* Estilos generales para el contenedor flotante */
    .logo-flotante {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
    }
    
    /* Estilos para el logo de escritorio (grande) */
    .logo-flotante .logo-escritorio {
        display: block; /* Visible por defecto */
        width: 120px; /* Tamaño del logo de escritorio */
        height: auto;
    }
    
    /* Estilos para el logo de móvil (pequeño) */
    .logo-flotante .logo-movil {
        display: none; /* Oculto por defecto */
        width: 50px; /* Tamaño del logo de móvil */
        height: auto;
    }
    
    /* Media Query: Aplica estos estilos en pantallas más pequeñas de 768px */
    @media (max-width: 768px) {
        .logo-flotante .logo-escritorio {
            display: none; /* Oculta el logo de escritorio */
        }
    
        .logo-flotante .logo-movil {
            display: block; /* Muestra el logo de móvil */
            /* Aquí puedes agregar estilos para que se vea diferente, como centrado */
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
        }
    }
    
    .is-valid {
        border-color: #10b1d9 !important;
    }
    
    .text-white {
   
    font-size: 237%;
    font-weight: 400;
    font-style: italic;
}

  </style>
</head>

<body>
    <?php
     $visa = $this->db->get_where('visa',array('visa_id'=>$visa_id))->row_array();
     $agencia_id = $this->db->get_where('user',array('user_id'=>$visa['user_id']))->row()->agency_id;
     $agency = $this->db->get_where('agency',array('id'=>$agencia_id))->row_array();
    ?>   
    <div class="logo-flotante">
    <img src="<?= base_url(); ?>public/assets/images/logo/<?= $agency['logo']; ?>" 
         alt="Logo de TELDEOA Escritorio" 
         class="logo-escritorio">
    <img src="<?= base_url(); ?>public/assets/images/logo/<?= $agency['logo']; ?>" 
         alt="Logo de TELDEOA Móvil" 
         class="logo-movil">
</div>
    
    <?php 
  
    if($visa['status'] == 1 || $this->session->userdata('login_user_id') != ''): 
    
    ?>    
    
  <div class="container">
    <form id="visaForm">
      <h3 class="text-center mb-4 text-white">Formulario - Visa Americana</h3>
      <h3 class="text-center mb-4 text-white">Nombre: <?= $visa['name'];?></h3>
      <!-- 1. INFORMACIÓN PERSONAL -->
      <div class="border p-4">
        <h5>1. Información Personal</h5>
        <div class="form-row">
          <div class="col-md-6"><input type="text" class="form-control" name="name" placeholder="Nombre(s) completos" required=""></div>
          <div class="col-md-6"><input type="date" class="form-control" name="birthday" placeholder="Fecha de nacimiento" required=""></div>
        </div>
        <div class="form-row mt-2">
          <div class="col-md-4"><input type="text" class="form-control" name="born_city" placeholder="Lugar de nacimiento (ciudad, provincia, país)" required=""></div>
          <div class="col-md-4">
            <select class="form-control" name="marital_status" required="">
              <option value="">Estatus marital</option>
              <option>Soltero</option>
              <option>Casado</option>
              <option>Divorciado</option>
              <option>Viudo</option>
              <option>Unión civil</option>
            </select>
          </div>
          <div class="col-md-4"><input type="text" class="form-control" name="morefullname" placeholder="Otro nombre/apellido usado"></div>
        </div>

        <div class="form-row mt-2">
          <div class="col-md-6"><select class="form-control" name="sex">
              <option value="">Sexo</option>
              <option>Masculino</option>
              <option>Femenino</option>
            </select></div>
          <div class="col-md-6"><input type="text" class="form-control" name="another_nationality" placeholder="Origen de nacionalidad"></div>
        </div>

        <div class="form-row mt-2">
          <div class="col-md-4">
            <select class="form-control toggle-target" name="has_other_nationality" id="has_other_nationality" data-rules='[{"target":"hon","value":"Sí"}]'>
              <option value="">¿Mantiene otra nacionalidad?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
          <div class="col-md-4 hon d-none">
            <input type="text" class="form-control" name="what_nationality" id="what_nationality" placeholder="¿Cuál(es)?">
          </div>
          <div class="col-md-4 hon d-none">
            <select class="form-control" name="has_other_passport">
              <option value="">¿Tiene pasaporte de otra nacionalidad?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
        </div>

        <div class="form-row mt-2">
          <div class="col-md-6"><select class="form-control" name="is_resident_other_country">
              <option value="">¿Es residente permanente de otro país?</option>
              <option>Sí</option>
              <option>No</option>
            </select></div>
          <div class="col-md-6"><input type="text" class="form-control" name="permanent_residence_country" placeholder="País/países de residencia permanente"></div>
        </div>

        <div class="form-row mt-2">
          <div class="col-md-12"><input type="text" class="form-control" name="cedula" placeholder="Número de cédula" required=""></div>
        </div>
      </div>

      <!-- 2. INFORMACIÓN DEL VIAJE -->
      <div class="border p-4">
        <h5>2. Información del Viaje 1</h5>
        <div class="form-row">
          <div class="col-md-6"><input type="date" class="form-control" name="travel_date" placeholder="Fecha aproximada de viaje"></div>
          <div class="col-md-6"><input type="text" class="form-control" name="stay_duration" placeholder="Tiempo de estadía"></div>
        </div>
        <div class="form-row mt-2">
          <div class="col-md-12"><input type="text" class="form-control" name="address_in_usa" placeholder="Dirección en EE.UU."></div>
        </div>
        <p class=" mt-2"><b>¿Quién paga el viaje?</b></p>
        <div class="form-row mt-2">
          <div class="col-md-12"><input type="text" class="form-control" name="payer_name" placeholder="Nombre completo"></div>
          <div class="col-md-4 mt-2"><input type="text" class="form-control" name="payer_phone" placeholder="Número telefónico"></div>
          <div class="col-md-4 mt-2"><input type="text" class="form-control" name="payer_email" placeholder="Correo electrónico"></div>
          <div class="col-md-4 mt-2"><input type="text" class="form-control" name="payer_relationship" placeholder="Relación con esa persona"></div>
          <div class="col-md-12 mt-2"><input type="text" class="form-control" name="payer_address" placeholder="Dirección"></div>
        </div>
      </div>

      <!-- 3. INFORMACIÓN DEL VIAJE -->
      <div class="border p-4">
        <h5>3. Información del Viaje 2</h5>
        <div class="form-row">
          <div class="col-md-12">
            <select class="form-control toggle-target" name="has_other_persons" id="has_other_persons" data-rules='[{"target":"hop","value":"Sí"}]'>
              <option value="">¿Otras personas viajarán con usted?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <div class="form-row mt-2 d-none hop">
          <div class="col-md-12">
            <select class="form-control toggle-target" name="has_group" id="has_group" data-rules='[{"target":"hg","value":"Sí"},{"target":"pd","value":"No"}]'>
              <option value="">¿viajará como parte de un grupo o una organización?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <div class="form-row mt-2 d-none hg">
          <div class="col-md-12"><input type="text" class="form-control" name="name_group" placeholder="Nombre del grupo/organización"></div>
        </div>
        <div class="form-row mt-2 d-none pd">
          <div class="col-md-12"><textarea class="form-control" rows="3" name="persons_details" placeholder="indicar los nombres completos y la relación que tiene con el/los acompañante/s"></textarea></div>
        </div>
      </div>

      <!-- 4. INFORMACIÓN DEL VIAJE 3 -->
      <div class="border p-4">
        <h5>4. Información del Viaje 3</h5>

        <!-- 1. ¿Alguna vez ha estado en los Estados Unidos? -->
        <div class="form-row">
          <div class="col-md-6">
            <select class="form-control toggle-target" name="has_been_usa" id="has_been_usa" data-rules='[{"target":"hbu","value":"Sí"}]'>
              <option value="">¿Alguna vez ha estado en los Estados Unidos?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
          <div class="col-md-4 hbu d-none"><input type="date" class="form-control" name="date_been_usa" placeholder="Fecha de llegada"></div>
          <div class="col-md-2 hbu d-none"><input type="text" class="form-control" name="days_been_usa" placeholder="Días de la estadía"></div>
        </div>

        <!-- 3. ¿Mantiene o ha mantenido una licencia de conducir en los Estados Unidos? -->
        <div class="form-row mt-2">
          <div class="col-md-6">
            <select class="form-control toggle-target" name="has_usa_licence" id="has_usa_licence" data-rules='[{"target":"hul","value":"Sí"}]'>
              <option value="">¿Mantiene o ha mantenido una licencia de conducir en los Estados Unidos?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
          <div class="col-md-3 hul d-none"><input type="number" class="form-control" name="licence_usa" placeholder="Número de la licencia de conducir"></div>
          <div class="col-md-3 hul d-none"><input type="text" class="form-control" name="licence_usa_state" placeholder="Estado que la emitió"></div>
        </div>

        <!-- 5. ¿Alguna vez se le ha emitido una visa americana? -->
        <div class="form-row mt-2">
          <div class="col-md-6">
            <select class="form-control toggle-target" name="has_emited_visa" id="has_emited_visa" data-rules='[{"target":"hev","value":"Sí"}]'>
              <option value="">¿Alguna vez se le ha emitido una visa americana?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
          <div class="col-md-4 hev d-none"><input type="date" class="form-control" name="date_emited_visa" placeholder="Fecha última emisión"></div>
          <div class="col-md-2 hev d-none"><input type="text" class="form-control" name="no_emited_visa" placeholder="Número de visa"></div>
        </div>

        <!-- 7. Huellas dactilares -->
        <div class="form-row mt-2 hev d-none">
          <div class="col-md-12">
            <select class="form-control" name="has_fingerprint" id="has_fingerprint">
              <option value="">¿Se registraron las huellas dactilares de sus diez dedos?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
        </div>

        <!-- 8. Visa perdida o robada -->
        <div class="form-row mt-2 hev d-none">
          <div class="col-md-8">
            <select class="form-control toggle-target" name="visa_lost" id="has_emited_visa" data-rules='[{"target":"vl","value":"Sí"}]'>
              <option value="">¿Su visa americana se le ha perdido o ha sido robada?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
          <div class="col-md-4 vl d-none"><input type="date" class="form-control" name="visa_lost_date" placeholder="Fecha del suceso"></div>
          <div class="col-md-12 mt-2 vl  d-none">
            <textarea class="form-control" name="visa_lost_details" placeholder="Explique qué ocurrió"></textarea>
          </div>
        </div>

        <!-- 9. Visa cancelada o revocada -->
        <div class="form-row mt-2 hev d-none">
          <div class="col-md-12">
            <select class="form-control toggle-target" name="visa_revoked" id="visa_revoked" data-rules='[{"target":"vr","value":"Sí"}]'>
              <option value="">¿Su visa americana ha sido cancelada o revocada?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
          <div class="col-md-12 mt-2 vr d-none">
            <textarea class="form-control " name="visa_revoked_details" placeholder="Explique qué ocurrió"></textarea>
          </div>
        </div>

        <!-- 10. Negación de visa o admisión -->
        <div class="form-row mt-2">
          <div class="col-md-12">
            <select class="form-control toggle-target" name="visa_denied" id="visa_denied" data-rules='[{"target":"vd","value":"Sí"}]'>
              <option value="">¿Alguna vez le han negado la visa americana, le han negado la admisión a EE.UU. o le han retirado su solicitud de admisión en el puerto de entrada?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
          <div class="col-md-12 mt-2 vd">
            <textarea class="form-control" name="visa_denied_details" placeholder="Si es afirmativa, explique"></textarea>
          </div>
        </div>

        <!-- 11. Petición de inmigrante -->
        <div class="form-row mt-2">
          <div class="col-md-12">
            <select class="form-control toggle-target" name="immigrant_petition" id="immigrant_petition" data-rules='[{"target":"ip","value":"Sí"}]'>
              <option value="">¿Alguien ha presentado alguna vez una petición de inmigrante en su nombre ante los Servicios de Inmigración y Ciudadanía de los EE.UU.?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
          <div class="col-md-12 mt-2 ip">
            <textarea class="form-control" name="immigrant_petition_details" placeholder="En caso afirmativa, explique"></textarea>
          </div>
        </div>

      </div>
      <!-- 5. DOMICILIO E INFORMACIÓN DE CONTACTO -->
      <div class="border p-4">
        <h5>5. Domicilio e Información de Contacto</h5>

        <!-- 1. Dirección completa de su domicilio -->
        <div class="form-row">
          <div class="col-md-12">
            <input type="text" class="form-control" name="home_address" placeholder="Dirección completa de su domicilio (avenida, calles, código postal)">
          </div>
        </div>

        <!-- 2. Ciudad y provincia donde reside -->
        <div class="form-row mt-2">
          <div class="col-md-6">
            <input type="text" class="form-control" name="home_city" placeholder="Ciudad">
          </div>
          <div class="col-md-6">
            <input type="text" class="form-control" name="home_province" placeholder="Provincia/Estado">
          </div>
        </div>

        <!-- 3. ¿Su dirección postal es la misma que su dirección de domicilio? -->
        <div class="form-row mt-2">
          <div class="col-md-6">
            <select class="form-control toggle-target" name="same_postal_address" id="same_postal_address" data-rules='[{"target":"postal_address_fields","value":"No"}]'>
              <option value="">¿Su dirección postal es la misma que su domicilio?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
        </div>

        <!-- 4. Dirección postal si es diferente -->
        <div class="form-row mt-2 d-none postal_address_fields">
          <div class="col-md-12">
            <input type="text" class="form-control" name="postal_address" placeholder="Dirección postal completa">
          </div>
          <div class="col-md-6 mt-2">
            <input type="text" class="form-control" name="postal_city" placeholder="Ciudad">
          </div>
          <div class="col-md-6 mt-2">
            <input type="text" class="form-control" name="postal_province" placeholder="Provincia/Estado">
          </div>
          <div class="col-md-12 mt-2">
            <input type="text" class="form-control" name="postal_zip" placeholder="Código postal">
          </div>
        </div>

        <!-- 5. Número telefónico primario -->
        <div class="form-row mt-2">
          <div class="col-md-4">
            <input type="text" class="form-control" name="phone_primary" placeholder="Número telefónico primario">
          </div>
          <div class="col-md-4">
            <input type="text" class="form-control" name="phone_secondary" placeholder="Número telefónico secundario">
          </div>
          <div class="col-md-4">
            <input type="text" class="form-control" name="phone_work" placeholder="Número telefónico laboral">
          </div>
        </div>

        <!-- 8. Otros números en los últimos 5 años -->
        <div class="form-row mt-2">
          <div class="col-md-6">
            <select class="form-control toggle-target" name="other_phones_used" id="other_phones_used" data-rules='[{"target":"other_phones_fields","value":"Sí"}]'>
              <option value="">¿Ha usado algún otro número telefónico en los últimos 5 años?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
          <div class="col-md-6 d-none other_phones_fields">
            <input type="text" class="form-control" name="other_phones_details" placeholder="Indique cuáles">
          </div>
        </div>

        <!-- 9. Correo electrónico -->
        <div class="form-row mt-2">
          <div class="col-md-6">
            <input type="email" class="form-control" name="email_primary" placeholder="Correo electrónico">
          </div>
        </div>

        <!-- 10. Otros correos en los últimos 5 años -->
        <div class="form-row mt-2">
          <div class="col-md-6">
            <select class="form-control toggle-target" name="other_emails_used" id="other_emails_used" data-rules='[{"target":"other_emails_fields","value":"Sí"}]'>
              <option value="">¿Ha usado algún otro correo electrónico en los últimos 5 años?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
          <div class="col-md-6 d-none other_emails_fields">
            <input type="text" class="form-control" name="other_emails_details" placeholder="Indique cuáles">
          </div>
        </div>

        <!-- 11. Presencia en redes sociales -->
        <div class="form-row mt-2">
          <div class="col-md-12">
            <select class="form-control toggle-target" name="social_media_presence" id="social_media_presence" data-rules='[{"target":"social_media_fields","value":"Sí"}]'>
              <option value="">¿Mantiene presencia en alguna de las redes sociales?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
          <div class="col-md-12 mt-2 d-none social_media_fields">
            <input type="text" class="form-control" name="social_media_details" placeholder="Indique la red social e identificador">
          </div>
        </div>

        <!-- 12. Otros sitios web o aplicaciones -->
        <div class="form-row mt-2">
          <div class="col-md-12">
            <select class="form-control toggle-target" name="other_web_presence" id="other_web_presence" data-rules='[{"target":"other_web_fields","value":"Sí"}]'>
              <option value="">¿Desea proporcionar información sobre otros sitios web o apps que haya usado en los últimos 5 años?</option>
              <option>Sí</option>
              <option>No</option>
            </select>
          </div>
          <div class="col-md-12 mt-2 d-none other_web_fields">
            <input type="text" class="form-control" name="other_web_details" placeholder="Indique el sitio y su identificador">
          </div>
        </div>

      </div>
      <!-- 6. INFORMACIÓN DEL PASAPORTE -->
    <div class="border p-4">
        <h5>6. Información del Pasaporte</h5>
        
        <!-- 1. Número de pasaporte -->
        <div class="form-row">
            <div class="col-md-6">
                <input type="text" class="form-control" name="passport_number" placeholder="Número de pasaporte">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="passport_country_city" placeholder="País y ciudad de emisión">
            </div>
        </div>
        
        <!-- 3. Fecha de emisión y expiración -->
        <div class="form-row mt-2">
            <div class="col-md-6">
                <input type="date" class="form-control" name="passport_issue_date" placeholder="Fecha de emisión">
            </div>
            <div class="col-md-6">
                <input type="date" class="form-control" name="passport_expiry_date" placeholder="Fecha de expiración">
            </div>
        </div>
        
        <!-- 4. Pasaporte perdido o robado -->
        <div class="form-row mt-2">
            <div class="col-md-12">
                <select class="form-control toggle-target" name="passport_lost" id="passport_lost"
                        data-rules='[{"target":"passport_lost_fields","value":"Sí"}]'>
                    <option value="">¿Alguna vez su pasaporte se le ha perdido o ha sido robado?</option>
                    <option>Sí</option>
                    <option>No</option>
                </select>
            </div>
        </div>
        
        <!-- Campos a mostrar si el pasaporte se perdió o fue robado -->
        <div class="form-row mt-2 d-none passport_lost_fields">
            <div class="col-md-6">
                <input type="text" class="form-control" name="lost_passport_number" placeholder="Número de pasaporte/documento de viaje">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="lost_passport_country" placeholder="País/autoridad que emitió el pasaporte/documento">
            </div>
            <div class="col-md-12 mt-2">
                <textarea class="form-control" name="lost_passport_details" placeholder="Explique qué ocurrió"></textarea>
            </div>
        </div>
    
    </div>
    <!-- 7. INFORMACIÓN DE CONTACTO EN LOS ESTADOS UNIDOS -->
    <div class="border p-4">
        <h5>7. Información de contacto en los Estados Unidos</h5>
        
        <!-- 1. Nombres completos de quien lo recibirá -->
        <div class="form-row">
            <div class="col-md-6">
                <input type="text" class="form-control" name="us_contact_name" placeholder="Nombres completos de quien lo recibirá">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="us_contact_organization" placeholder="Nombre de la organización/hotel que lo recibirá">
            </div>
        </div>
        
        <!-- 3. Relación con la persona u organización -->
        <div class="form-row mt-2">
            <div class="col-md-12">
                <input type="text" class="form-control" name="us_contact_relationship" placeholder="Indicar la relación que tiene con la persona u organización">
            </div>
        </div>
        
        <!-- 4. Dirección completa -->
        <div class="form-row mt-2">
            <div class="col-md-12">
                <input type="text" class="form-control" name="us_contact_address" placeholder="Dirección completa en los Estados Unidos">
            </div>
        </div>
        
        <!-- 5. Ciudad, estado y código postal -->
        <div class="form-row mt-2">
            <div class="col-md-4">
                <input type="text" class="form-control" name="us_contact_city" placeholder="Ciudad">
            </div>
            <div class="col-md-4">
                <input type="text" class="form-control" name="us_contact_state" placeholder="Estado">
            </div>
            <div class="col-md-4">
                <input type="text" class="form-control" name="us_contact_zip" placeholder="Código postal">
            </div>
        </div>
        
        <!-- 6. Número telefónico y correo electrónico -->
        <div class="form-row mt-2">
            <div class="col-md-6">
                <input type="text" class="form-control" name="us_contact_phone" placeholder="Número telefónico">
            </div>
            <div class="col-md-6">
                <input type="email" class="form-control" name="us_contact_email" placeholder="Correo electrónico">
            </div>
        </div>
        
    </div>
  
      <!-- 8. INFORMACIÓN FAMILIAR -->
    <div class="border p-4">
        <h5>8. Información Familiar</h5>
        <p class=" mt-2"><b>1. Padre</b></p>
        <!-- 1. Padre -->
        <div class="form-row mt-2">
            <div class="col-md-6">
                <input type="text" class="form-control" name="father_name" placeholder="Nombre completo del padre">
            </div>
            <div class="col-md-6">
                <input type="date" class="form-control" name="father_birthday" placeholder="Fecha de nacimiento (opcional)">
            </div>
        </div>
        <div class="form-row mt-2">
            <div class="col-md-6">
                <select class="form-control toggle-target" name="father_in_usa" data-rules='[{"target":"father_status","value":"Sí"}]'>
                    <option value="">¿Está su padre en los Estados Unidos?</option>
                    <option>Sí</option>
                    <option>No</option>
                </select>
            </div>
            <div class="col-md-6 d-none father_status">
                <select class="form-control " name="father_status" >
                    <option value="">¿Estatus en Estados Unidos?</option>
                    <option>Ciudadano americano</option>
                    <option>Residente legal permanente</option>
                </select>
            </div>
        </div>
        <p class=" mt-2"><b>2. Madre</b></p>
        <!-- 2. Madre -->
        <div class="form-row mt-3">
            <div class="col-md-6">
                <input type="text" class="form-control" name="mother_name" placeholder="Nombre completo de la madre">
            </div>
            <div class="col-md-6">
                <input type="date" class="form-control" name="mother_birthday" placeholder="Fecha de nacimiento (opcional)">
            </div>
        </div>
        <div class="form-row mt-2">
            <div class="col-md-6">
                <select class="form-control toggle-target" name="mother_in_usa" data-rules='[{"target":"mother_status","value":"Sí"}]'>
                    <option value="">¿Está su madre en los Estados Unidos?</option>
                    <option>Sí</option>
                    <option>No</option>
                </select>
            </div>
            <div class="col-md-6 d-none mother_status">
                <select class="form-control " name="mother_status" >
                    <option value="">¿Estatus en Estados Unidos?</option>
                    <option>Ciudadana americano</option>
                    <option>Residente legal permanente</option>
                </select>
            </div>
        </div>
        
        <p class=" mt-2"><b>3. Parientes inmediatos</b></p>
        <!-- 3. Parientes inmediatos -->
        <div class="form-row mt-3">
            <div class="col-md-12">
                <select class="form-control toggle-target" name="immediate_relatives_usa" data-rules='[{"target":"immediate_relatives_fields","value":"Sí"}]'>
                    <option value="">¿Tiene parientes inmediatos en los Estados Unidos?</option>
                    <option>Sí</option>
                    <option>No</option>
                </select>
            </div>
        </div>
        <div class="form-row mt-2 d-none immediate_relatives_fields">
            <div class="col-md-4">
                <input type="text" class="form-control" name="immediate_relative_name" placeholder="Nombres completos">
            </div>
            <div class="col-md-4">
                <input type="text" class="form-control" name="immediate_relative_relationship" placeholder="Parentesco">
            </div>
            <div class="col-md-4">
                <select class="form-control" name="immediate_relative_status">
                    <option value="">Indicar estatus</option>
                    <option>Ciudadano americano</option>
                    <option>Residente legal permanente</option>
                </select>
            </div>
        </div>
        
        <p class=" mt-2"><b>4. Divorciado/a</b></p>
        <!-- 4. Divorciado/a -->
        <div class="form-row mt-3">
            <div class="col-md-8">
                <select class="form-control toggle-target" name="previous_spouses" id="previous_spouses"
                        data-rules='[{"target":"divorce_status","value":"Sí"}]'>
                    <option value="">¿Se a divorciado con anterioridad?</option>
                    <option>Sí</option>
                    <option>No</option>
                </select>
            </div>
            <div class="col-md-4 divorce_status">
                <input type="number" class="form-control" name="previous_spouses_number" placeholder="Número de previos esposos/esposas">
            </div>
        </div>
        <div class="form-row mt-2 divorce_status">
            <div class="col-md-6">
                <input type="text" class="form-control" name="previous_spouse1_name" placeholder="Nombre completo del previo matrimonio 1">
            </div>
            <div class="col-md-6">
                <input type="date" class="form-control" name="previous_spouse1_birthday" placeholder="Fecha de nacimiento">
            </div>
        </div>
        <div class="form-row mt-2 divorce_status">
            <div class="col-md-4">
                <input type="text" class="form-control" name="previous_spouse1_country" placeholder="País/región de origen">
            </div>
            <div class="col-md-4 divorce_status">
                <input type="text divorce_status" class="form-control" name="previous_spouse1_city" placeholder="Ciudad de nacimiento">
            </div>
            <div class="col-md-4 divorce_status">
                <input type="text" class="form-control" name="previous_spouse1_dates" placeholder="Fecha de casamiento y disolución">
            </div>
        </div>
        
        <div class="form-row mt-2 divorce_status">
            <div class="col-md-6">
                <input type="text" class="form-control" name="previous_spouse1_marriage_place" placeholder="País/región donde el casamiento fue consumado">
            </div>
        </div>
        
        <p class=" mt-2"><b>5. Cónyuge / Unión libre / Unión civil</b></p>
        <!-- 5. Cónyuge / Unión libre / Unión civil -->
        <div class="form-row mt-3">
            <div class="col-md-12">
                <select class="form-control toggle-target" name="spouse" id="spouse"
                        data-rules='[{"target":"spouse_status","value":"Sí"}]'>
                    <option value="">¿Cónyuge / Unión libre / Unión civil?</option>
                    <option>Sí</option>
                    <option>No</option>
                </select>
            </div>
        </div>
        <div class="form-row mt-3 spouse_status">
            <div class="col-md-6">
                <input type="text" class="form-control" name="spouse_name" placeholder="Nombres completos">
            </div>
            <div class="col-md-6">
                <input type="date" class="form-control" name="spouse_birthday" placeholder="Fecha de nacimiento">
            </div>
        </div>
        <div class="form-row mt-2 spouse_status">
            <div class="col-md-6">
                <input type="text" class="form-control" name="spouse_country" placeholder="País/región de origen">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="spouse_city" placeholder="Ciudad de nacimiento">
            </div>
        </div>
        <div class="form-row mt-2 spouse_status">
            <div class="col-md-12">
                <input type="text" class="form-control" name="spouse_address" placeholder="Dirección de domicilio">
            </div>
        </div>
        
        <p class=" mt-2"><b>6. Viudo/a </b></p>
        <!-- 6. Viudo/a -->
        <div class="form-row mt-3">
            <div class="col-md-12">
                <select class="form-control toggle-target" name="widow" id="widow"
                        data-rules='[{"target":"widow_status","value":"Sí"}]'>
                    <option value="">¿Viudo/a?</option>
                    <option>Sí</option>
                    <option>No</option>
                </select>
            </div>
        </div>
        <div class="form-row widow_status mt-3">
            <div class="col-md-6">
                <input type="text" class="form-control" name="widow_name" placeholder="Nombres completos">
            </div>
            <div class="col-md-6">
                <input type="date" class="form-control" name="widow_birthday" placeholder="Fecha de nacimiento">
            </div>
        </div>
        <div class="form-row widow_status mt-2">
            <div class="col-md-6">
                <input type="text" class="form-control" name="widow_country" placeholder="País/región de origen">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="widow_city" placeholder="Ciudad de nacimiento">
            </div>
        </div>
        
        <p class=" mt-2"><b>7. Otros familiares</b></p>
        <!-- 7. Otros familiares -->
        <div class="form-row mt-3">
            <div class="col-md-12">
                <select class="form-control toggle-target" name="other_relative" id="spouse"
                        data-rules='[{"target":"other_relative_status","value":"Sí"}]'>
                    <option value="">¿Otros familiares?</option>
                    <option>Sí</option>
                    <option>No</option>
                </select>
            </div>
        </div>
        <div class="form-row other_relative_status mt-3">
            <div class="col-md-6">
                <input type="text" class="form-control" name="other_relative_name" placeholder="Nombres completos">
            </div>
            <div class="col-md-6">
                <input type="date" class="form-control" name="other_relative_birthday" placeholder="Fecha de nacimiento">
            </div>
        </div>
        <div class="form-row other_relative_status mt-2">
            <div class="col-md-6">
                <input type="text" class="form-control" name="other_relative_country" placeholder="País/región de origen">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="other_relative_city" placeholder="Ciudad de nacimiento">
            </div>
        </div>
        <div class="form-row other_relative_status mt-2">
            <div class="col-md-12">
                <input type="text" class="form-control" name="other_relative_address" placeholder="Dirección de domicilio">
            </div>
        </div>
    
    </div>
    
    <!-- 9. INFORMACIÓN LABORAL / EDUCATIVA -->
    <div class="border p-4">
        <h5>9. Información Laboral / Educativa</h5>
        <p class=" mt-2"><b>1. Actual</b></p>
        <!-- Información laboral/educación 1: actual -->
        <div class="form-row mt-2">
            <div class="col-md-6">
                <input type="text" class="form-control" name="current_occupation" placeholder="Ocupación primaria (especificar)">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="current_employer" placeholder="Nombre del empleador o institución educativa">
            </div>
        </div>
        <div class="form-row mt-2">
            <div class="col-md-12">
                <input type="text" class="form-control" name="current_address" placeholder="Dirección completa">
            </div>
        </div>
        <div class="form-row mt-2">
            <div class="col-md-6">
                <input type="text" class="form-control" name="current_city_country" placeholder="País, provincia, ciudad y código postal">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="current_phone" placeholder="Número telefónico">
            </div>
        </div>
        <div class="form-row mt-2">
            <div class="col-md-6">
                <input type="date" class="form-control" name="current_start_date" placeholder="Fecha de inicio">
            </div>
            <div class="col-md-6">
                <input type="number" class="form-control" name="current_income" placeholder="Ingreso mensual (si está empleado)">
            </div>
        </div>
        <div class="form-row mt-2">
            <div class="col-md-12">
                <textarea class="form-control" name="current_responsibilities" placeholder="Brevemente describa sus responsabilidades"></textarea>
            </div>
        </div>
        
        <!-- Información laboral/educación 2: pasado -->
        <p class=" mt-2"><b>2. Pasado</b></p>
        <div class="form-row mt-3">
            <div class="col-md-12">
                <select class="form-control toggle-target" name="previously_employed" data-rules='[{"target":"previous_employment_fields","value":"Sí"}]'>
                    <option value="">¿Estuvo previamente empleado?</option>
                    <option>Sí</option>
                    <option>No</option>
                </select>
            </div>
        </div>
        <div class="form-row mt-2 d-none previous_employment_fields">
            <!-- Primer empleo previo -->
            <div class="col-md-6">
                <input type="text" class="form-control" name="previous_employer1_name" placeholder="Nombre de la empresa">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="previous_employer1_address" placeholder="Dirección completa">
            </div>
        </div>
        <div class="form-row mt-2 d-none previous_employment_fields">
            <div class="col-md-6">
                <input type="text" class="form-control" name="previous_employer1_city_country" placeholder="País, provincia, ciudad y código postal">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="previous_employer1_phone" placeholder="Número telefónico">
            </div>
        </div>
        <div class="form-row mt-2 d-none previous_employment_fields">
            <div class="col-md-6">
                <input type="text" class="form-control" name="previous_employer1_role" placeholder="Rol/cargo que desempeñaba">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="previous_employer1_supervisor" placeholder="Nombres completos de su supervisor/jefe directo">
            </div>
        </div>
        <div class="form-row mt-2 d-none previous_employment_fields">
            <div class="col-md-6">
                <input type="text" class="form-control" name="previous_employer1_period" placeholder="¿Desde cuándo hasta cuándo laboró?">
            </div>
            <div class="col-md-6">
                <textarea class="form-control" name="previous_employer1_responsibilities" placeholder="Brevemente describa sus responsabilidades"></textarea>
            </div>
        </div>
        
        <!-- Educación: bachillerato o superior -->
        <p class=" mt-2"><b>3. Bachillerato o Superior</b></p>
        <div class="form-row mt-3">
            <div class="col-md-12">
                <select class="form-control toggle-target" name="studied_high_school_or_higher" data-rules='[{"target":"education_fields","value":"Sí"}]'>
                    <option value="">¿Ha estudiado bachillerato o nivel superior?</option>
                    <option>Sí</option>
                    <option>No</option>
                </select>
            </div>
        </div>
        <div class="form-row mt-2 d-none education_fields">
            <div class="col-md-6">
                <input type="text" class="form-control" name="education_institution" placeholder="Nombre de la institución">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="education_address" placeholder="Dirección completa">
            </div>
        </div>
        <div class="form-row mt-2 d-none education_fields">
            <div class="col-md-6">
                <input type="text" class="form-control" name="education_city_country" placeholder="País, provincia, ciudad y código postal">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="education_phone" placeholder="Número telefónico">
            </div>
        </div>
        <div class="form-row mt-2 d-none education_fields">
            <div class="col-md-6">
                <input type="text" class="form-control" name="education_course" placeholder="Especificar curso de estudio / especialidad">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="education_supervisor" placeholder="Nombres completos de supervisor/jefe directo">
            </div>
        </div>
        <div class="form-row mt-2 d-none education_fields">
            <div class="col-md-6">
                <input type="text" class="form-control" name="education_period" placeholder="¿Desde cuándo hasta cuándo estudió?">
            </div>
        </div>
    
    </div>
    <!-- 10. INFORMACIÓN ADICIONAL -->
    <div class="border p-4">
        <h5>10. Información Adicional</h5>
        
        <div class="form-row mt-2">
            <div class="col-md-6">
                <input type="text" class="form-control" name="clan_or_tribe" placeholder="¿Pertenece a algún clan o tribu? (indicar el nombre)">
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control" name="other_language" placeholder="¿Qué otro idioma domina aparte del español?">
            </div>
        </div>
        
        <div class="form-row mt-2">
            <div class="col-md-12">
                <textarea class="form-control" name="countries_visited_last5years" placeholder="¿Ha viajado a otro país/región en los últimos 5 años? Indique en cuáles estuvo"></textarea>
            </div>
        </div>
        
        <div class="form-row mt-2">
            <div class="col-md-12">
                <textarea class="form-control" name="organization_participation" placeholder="¿Ha pertenecido, contribuido o trabajado para alguna organización profesional, social o benéfica? Indique cuáles"></textarea>
            </div>
        </div>
        
        <div class="form-row mt-2">
            <div class="col-md-12">
                <textarea class="form-control" name="special_skills" placeholder="¿Tiene alguna habilidad o capacitación especializada (armas de fuego, explosivos, experiencia nuclear, biológica o química)? Explique"></textarea>
            </div>
        </div>
        
        <div class="form-row mt-2">
            <div class="col-md-6">
                <select class="form-control toggle-target" name="military_service" data-rules='[{"target":"military_fields","value":"Sí"}]'>
                    <option value="">¿Ha servido en la milicia?</option>
                    <option>Sí</option>
                    <option>No</option>
                </select>
            </div>
        </div>
        
        <div class="form-row mt-2 d-none military_fields">
            <div class="col-md-6"><input type="text" class="form-control" name="military_country" placeholder="Nombre del país/región en la que sirvió"></div>
            <div class="col-md-6"><input type="text" class="form-control" name="military_branch" placeholder="Rama de servicio"></div>
        </div>
        
        <div class="form-row mt-2 d-none military_fields">
            <div class="col-md-4"><input type="text" class="form-control" name="military_rank" placeholder="Rango/posición"></div>
            <div class="col-md-4"><input type="text" class="form-control" name="military_specialty" placeholder="Especialidad militar"></div>
            <div class="col-md-4"><input type="text" class="form-control" name="military_period" placeholder="¿Desde cuándo hasta cuándo estuvo sirviendo?"></div>
        </div>
    
    </div>
    <style>
    .upload-box {
        width: 100%;
        height: 150px;
        background: #fff;
        border: 2px dashed #ccc;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        cursor: pointer;
        position: relative;
    }
    .upload-box img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .placeholder-text {
        color: #999;
        font-size: 14px;
    }
    </style>
       <!-- 11. SUBIR DOCUMENTOS CON PREVIEW -->
    <div class="border p-4">
        <h5>11. Subir Documentos</h5>
        <div class="form-row text-center">
    
            <!-- Comprobante -->
            <div class="col-md-4">
                <label>Foto de Comprobante</label>
                <div class="upload-box" id="box_proof_file">
                    <span class="placeholder-text">Esperando imagen</span>
                </div>
                <input type="file" accept=".png, .jpg, .jpeg" class="d-none upload-visa" id="proof_file" data-field="proof_file">
                <button type="button" class="btn btn-sm btn-secondary mt-2 select-btn" data-target="proof_file">Seleccionar</button>
            </div>
    
            <!-- Foto Carnet -->
            <div class="col-md-4">
                <label>Foto Carnet</label>
                <div class="upload-box" id="box_id_card_file">
                    <span class="placeholder-text">Esperando imagen</span>
                </div>
                <input type="file" accept=".png, .jpg, .jpeg" class="d-none upload-visa" id="id_card_file" data-field="id_card_file">
                <button type="button" class="btn btn-sm btn-secondary mt-2 select-btn" data-target="id_card_file">Seleccionar</button>
            </div>
    
            <!-- Pasaporte -->
            <div class="col-md-4">
                <label>Subir Pasaporte</label>
                <div class="upload-box" id="box_passport_file">
                    <span class="placeholder-text">Esperando imagen</span>
                </div>
                <input type="file" accept=".png, .jpg, .jpeg" class="d-none upload-visa" id="passport_file" data-field="passport_file">
                <button type="button" class="btn btn-sm btn-secondary mt-2 select-btn" data-target="passport_file">Seleccionar</button>
            </div>
    
        </div>
    </div>
    
    <!-- 12. SUBIR DOCUMENTOS -->
    <div class="border p-4">
        <p> TRIVALI.EC no se responsabiliza por datos que no sean verídicos arriba anotados ya que confiamos en la buena fe 
y veracidad de la información brindada por el aplicante.</p>
    </div>

    </form>
  </div>

  <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
  <script>
    const visa_id = <?= $visa_id; ?>;

    $(document).ready(function () {

      // Mostrar/ocultar campos según data-rules
      $(".toggle-target").on("change", function () {
        const val = $(this).val();
        const rules = $(this).data("rules"); // jQuery parsea JSON automáticamente
        rules.forEach(rule => {
          $("." + rule.target).toggleClass("d-none", val !== rule.value);
        });
      }).trigger("change");

      // Cargar datos existentes
        $.getJSON("<?= base_url('visa/get_data/') ?>" + visa_id, function (data) {
            if (data) {
                for (let key in data) {
                    // Llenar inputs normales
                    $("[name='" + key + "']").val(data[key]).change();
        
                    // Mostrar imágenes si existen
                    const imageFields = ['proof_file', 'id_card_file', 'passport_file'];
                    if (imageFields.includes(key) && data[key]) {
                        let boxId = "#box_" + key;
                        $(boxId).html('<img src="<?= base_url() ?>' + data[key] + '" class="img-fluid">');
                    }
                }
            }
        });


      // Guardar campo automáticamente al salir del input
      $("#visaForm").on("blur", "input, select, textarea", function () {
        let field = $(this).attr("name");
        let value = $(this).val();

        if (value.trim() === "") {
          $(this).removeClass("is-valid").addClass("is-invalid");
        } else {
          $(this).removeClass("is-invalid").addClass("is-valid");
        }

        $.post("<?= base_url('visa/save_field') ?>", { visa_id: visa_id, field: field, value: value }, function (res) {
          console.log("Guardado:" + res);
        }, "json");
      });
      
      
      // Abrir selector al dar clic en el recuadro o botón
    $(".select-btn").click(function() {
        let target = $(this).data("target");
        $("#" + target).click();
    });

    $(".upload-box").click(function() {
        let id = $(this).attr("id").replace("box_","");
        $("#" + id).click();
    });

    // Subida y preview
    $(".upload-visa").on("change", function() {
        let fileInput = $(this)[0];
        let field = $(this).data("field");
        let file = fileInput.files[0];
        let box = $("#box_" + field);
        let formData = new FormData();

        formData.append("visa_id", visa_id);
        formData.append("field", field);
        formData.append("file", file);

       

        // Subida AJAX
        $.ajax({
            url: "<?= base_url('visa/upload_file') ?>",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function(res) {
                if (res.success) {
                    console.log("Archivo " + field + " guardado correctamente.");
                    
                    Toastify({
                      text: "Guardado..." ,
                      duration: 3000,
                      close: true,
                      gravity: "top", // `top` or `bottom`
                      position: "right", // `left`, `center` or `right`
                      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
                    }).showToast();
                } else {
                    alert("Error al subir " + field + ": " + res.message);
                }
            }
        }).done(function(){
            
             // Preview
                if (file.type.startsWith("image/")) {
                    let reader = new FileReader();
                    reader.onload = function(e) {
                        box.html('<img src="' + e.target.result + '">');
                    };
                    reader.readAsDataURL(file);
                } else {
                    box.html('<span class="placeholder-text">' + file.name + '</span>');
                }
        });
    });

    });
  </script>
    <?php else: ?>
        <div class="container">
            <div class="border p-4">
                <h5>Este formulario ya no se encuentra disponible, consulta con tu asesor para más información.</h5>
            </div>
        </div>
    <?php endif; ?>
</body>

</html>