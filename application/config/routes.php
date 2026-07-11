<?php
defined('BASEPATH') OR exit('No direct script access allowed');


$route['default_controller'] = 'login';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

$route['portal/prescriptions']                          = 'prescriptions/index';
$route['portal/prescription']                           = 'prescriptions/add';
$route['portal/prescription/save']                      = 'prescriptions/save';
$route['portal/prescription/get_prescription_detail']   = 'prescriptions/get_prescription_detail';
$route['portal/prescription/download_pdf/(:any)']              = 'prescriptions/download_pdf/$1';
$route['portal/prescription/send_whatsapp/(:any)']             = 'prescriptions/send_whatsapp/$1';
$route['portal/prescriptions/ajax_recipe/(:num)'] = 'prescriptions/ajax_recipe/$1';
$route['portal/prescriptions/ajax_history/(:num)'] = 'prescriptions/ajax_history/$1';

$route['portal/consultations'] = 'consultations/index';
$route['portal/consultations/add'] = 'consultations/add';
$route['portal/consultations/add/(:num)'] = 'consultations/add/$1';

$route['portal/consultations/save'] = 'consultations/save';

$route['portal/consultations/view/(:num)'] = 'consultations/view/$1';

$route['portal/consultations/edit/(:num)'] = 'consultations/edit/$1';

$route['portal/consultations/update/(:num)'] = 'consultations/update/$1';

$route['portal/consultations/delete/(:num)'] = 'consultations/delete/$1';

$route['portal/consultations/patient/(:num)'] = 'consultations/patient/$1';
$route['portal/load_more_consultations'] = 'patients/load_more_consultations';

$route['portal/patients'] = 'patients/index';
$route['portal/patients/ajax_list/(:num)'] = 'patients/ajax_list/$1';
$route['portal/patients/search_patient'] = 'patients/search_patient';
$route['portal/patients/save'] = 'patients/save';
$route['portal/patient_profile/(:any)'] = 'patients/patient_profile/$1';

$route['portal/patient_backgrounds/(:any)'] = 'patients/patient_backgrounds/$1';
$route['portal/save_patient_backgrounds/(:any)'] = 'patients/save_patient_backgrounds/$1';

$route['portal/appointments'] = 'appointments/index';

$route['portal/appointments/add'] = 'appointments/add';
$route['portal/appointments/add/(:num)'] = 'appointments/add/$1';

$route['portal/appointments/store'] = 'appointments/store';

$route['portal/appointments/edit/(:num)'] = 'appointments/edit/$1';
$route['portal/appointments/update/(:num)'] = 'appointments/update/$1';

$route['portal/appointments/view/(:num)'] = 'appointments/view/$1';

$route['portal/appointments/delete/(:num)'] = 'appointments/delete/$1';

$route['api/auth/login'] = 'api/auth/login';
$route['api/auth/logout'] = 'api/auth/logout';
$route['api/auth/refresh'] = 'api/auth/refresh';
$route['api/auth/me'] = 'api/auth/me';
$route['api/auth/register'] = 'api/auth/register';
$route['api/auth/verify-email'] = 'api/auth/verify_email';
$route['api/auth/forgot-password'] = 'api/auth/forgot_password';
$route['api/auth/verify-reset-code'] = 'api/auth/verify_reset_code';
$route['api/auth/reset-password'] = 'api/auth/reset_password';

$route['api/patients'] = 'api/patients/index';
$route['api/patients/(:num)'] = 'api/patients/show/$1';
$route['api/patients/(:num)/backgrounds'] = 'api/patients/backgrounds/$1';
$route['api/patients/(:num)/save-backgrounds'] = 'api/patients/save_backgrounds/$1';
$route['api/patients/(:num)/consultations'] = 'api/patients/consultations/$1';
$route['api/patients/save'] = 'api/patients/save';
$route['api/patients/save/(:num)'] = 'api/patients/save/$1';


