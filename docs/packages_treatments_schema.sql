-- Esquema para Módulo de Paquetes y Tratamientos
-- Ejecutar en el servidor MySQL del sistema ERP

CREATE TABLE IF NOT EXISTS `treatment_plans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `agency_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `status` TINYINT(1) DEFAULT 1 COMMENT '1: Activo, 0: Inactivo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_treatment_plans_agency` (`agency_id`),
  INDEX `idx_treatment_plans_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `treatment_plan_services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `treatment_plan_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `sessions_count` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_plan_services_plan` (`treatment_plan_id`),
  INDEX `idx_plan_services_service` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `patient_treatments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `agency_id` INT NOT NULL,
  `patient_id` INT NOT NULL COMMENT 'Relación con la tabla user (rol_id = 8)',
  `treatment_plan_id` INT DEFAULT NULL COMMENT 'Null si es tratamiento personalizado',
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL COMMENT 'Precio acordado/cobrado',
  `status` VARCHAR(50) DEFAULT 'active' COMMENT 'active, completed, cancelled',
  `start_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_patient_treatments_patient` (`patient_id`),
  INDEX `idx_patient_treatments_agency` (`agency_id`),
  INDEX `idx_patient_treatments_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `patient_treatment_services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patient_treatment_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `quantity_ordered` INT NOT NULL DEFAULT 1 COMMENT 'Sesiones necesarias/compradas',
  `quantity_used` INT NOT NULL DEFAULT 0 COMMENT 'Sesiones consumidas',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_patient_treatment_services_pt` (`patient_treatment_id`),
  INDEX `idx_patient_treatment_services_svc` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `patient_treatment_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patient_treatment_id` INT NOT NULL,
  `patient_treatment_service_id` INT NOT NULL,
  `session_date` DATETIME NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_pt_sessions_treatment` (`patient_treatment_id`),
  INDEX `idx_pt_sessions_service` (`patient_treatment_service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `patient_treatment_extras` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patient_treatment_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_pt_extras_treatment` (`patient_treatment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
