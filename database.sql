CREATE DATABASE IF NOT EXISTS classroomed_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE classroomed_db;

CREATE TABLE users (
  user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  full_name VARCHAR(140) NOT NULL,
  email VARCHAR(180) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMINISTRATOR','MAINTENANCE','FACULTY','STUDENT') NOT NULL DEFAULT 'FACULTY',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE buildings (
  building_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  building_name VARCHAR(140) NOT NULL UNIQUE,
  location_description VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE rooms (
  room_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  building_id BIGINT UNSIGNED NOT NULL,
  room_code VARCHAR(50) NOT NULL UNIQUE,
  room_name VARCHAR(140) NOT NULL,
  room_type ENUM('LECTURE_ROOM','LABORATORY','COMPUTER_LAB','CONFERENCE_ROOM','AUDITORIUM','OTHER') NOT NULL DEFAULT 'LECTURE_ROOM',
  capacity INT UNSIGNED NOT NULL,
  status ENUM('AVAILABLE','OCCUPIED','RESERVED','MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rooms_building FOREIGN KEY (building_id) REFERENCES buildings(building_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_room_capacity CHECK (capacity > 0),
  INDEX idx_room_status (status),
  INDEX idx_room_type_capacity (room_type, capacity)
) ENGINE=InnoDB;

CREATE TABLE equipment (
  equipment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  equipment_name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE room_equipment (
  room_id BIGINT UNSIGNED NOT NULL,
  equipment_id BIGINT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  condition_status ENUM('GOOD','LIMITED','UNDER_REPAIR') NOT NULL DEFAULT 'GOOD',
  notes VARCHAR(255),
  PRIMARY KEY (room_id, equipment_id),
  CONSTRAINT fk_room_equipment_room FOREIGN KEY (room_id) REFERENCES rooms(room_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_room_equipment_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_equipment_quantity CHECK (quantity > 0)
) ENGINE=InnoDB;

CREATE TABLE reservations (
  reservation_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference_code VARCHAR(30) NOT NULL UNIQUE,
  requested_by BIGINT UNSIGNED NOT NULL,
  room_id BIGINT UNSIGNED NOT NULL,
  activity_title VARCHAR(180) NOT NULL,
  course_or_department VARCHAR(140),
  reservation_type ENUM('CLASS','EXAM','MEETING','EVENT','LABORATORY','OTHER') NOT NULL DEFAULT 'CLASS',
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  attendee_count INT UNSIGNED NOT NULL,
  status ENUM('PENDING_APPROVAL','APPROVED','CANCELLED','CONFLICT') NOT NULL DEFAULT 'PENDING_APPROVAL',
  series_id VARCHAR(30) NULL,
  series_index SMALLINT UNSIGNED NULL,
  is_fixed TINYINT(1) NOT NULL DEFAULT 0,
  edited_at DATETIME NULL,
  conflict_flag BOOLEAN NOT NULL DEFAULT FALSE,
  conflict_message VARCHAR(500),
  occupancy_confirmed_at DATETIME NULL,
  occupancy_confirmed_by BIGINT UNSIGNED NULL,
  release_reason VARCHAR(500),
  request_notes TEXT,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservation_requestor FOREIGN KEY (requested_by) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_reservation_room FOREIGN KEY (room_id) REFERENCES rooms(room_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_reservation_occupancy_confirmer FOREIGN KEY (occupancy_confirmed_by) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT chk_reservation_attendees CHECK (attendee_count > 0),
  CONSTRAINT chk_reservation_time CHECK (end_time > start_time),
  INDEX idx_reservation_room_date (room_id, reservation_date),
  INDEX idx_reservation_series (series_id),
  INDEX idx_reservation_status_date (status, reservation_date),
  INDEX idx_reservation_requestor (requested_by, submitted_at)
) ENGINE=InnoDB;

CREATE TABLE reservation_equipment (
  reservation_id BIGINT UNSIGNED NOT NULL,
  equipment_id BIGINT UNSIGNED NOT NULL,
  quantity_requested INT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (reservation_id, equipment_id),
  CONSTRAINT fk_reservation_equipment_reservation FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_reservation_equipment_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_requested_equipment_quantity CHECK (quantity_requested > 0)
) ENGINE=InnoDB;

CREATE TABLE reservation_notifications (
  notification_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reservation_id BIGINT UNSIGNED NOT NULL,
  recipient_user_id BIGINT UNSIGNED NOT NULL,
  notification_channel ENUM('IN_APP','EMAIL','SMS','PUSH') NOT NULL DEFAULT 'IN_APP',
  scheduled_at DATETIME NOT NULL,
  sent_at DATETIME NULL,
  delivery_status ENUM('SCHEDULED','SENT','FAILED','CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  message_text VARCHAR(1000) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_reservation FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_notification_recipient FOREIGN KEY (recipient_user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_notification_due (delivery_status, scheduled_at),
  INDEX idx_notification_reservation (reservation_id, scheduled_at)
) ENGINE=InnoDB;

CREATE TABLE maintenance_logs (
  maintenance_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_id BIGINT UNSIGNED NOT NULL,
  reported_by BIGINT UNSIGNED NULL,
  title VARCHAR(160) NOT NULL,
  details TEXT,
  start_date DATETIME NOT NULL,
  expected_end DATETIME NULL,
  actual_end DATETIME NULL,
  status ENUM('SCHEDULED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_maintenance_room FOREIGN KEY (room_id) REFERENCES rooms(room_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_maintenance_reporter FOREIGN KEY (reported_by) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_maintenance_room_dates (room_id, start_date, expected_end)
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  audit_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  action_type VARCHAR(80) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  details JSON NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_audit_entity (entity_type, entity_id),
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;

INSERT IGNORE INTO buildings (building_name, location_description) VALUES
 ('Main Building', 'Academic campus'),
 ('Technology Building', 'Academic campus'),
 ('Science Building', 'Academic campus'),
 ('Administration Building', 'Academic campus'),
 ('Auditorium Complex', 'Academic campus'),
 ('Arts and Humanities Building', 'Academic campus');

INSERT IGNORE INTO equipment (equipment_name, description) VALUES
 ('Projector', 'Room projection equipment'),
 ('Computers', 'Desktop computers for instruction'),
 ('Audio system', 'Speakers and microphone'),
 ('Lab equipment', 'Laboratory apparatus'),
 ('Accessible seating', 'Accessible room setup and seating');

INSERT IGNORE INTO rooms (building_id, room_code, room_name, room_type, capacity, status, notes)
SELECT building_id, 'MAIN-301', 'Main Building Room 301', 'LECTURE_ROOM', 45, 'AVAILABLE', 'Illustrative demo classroom' FROM buildings WHERE building_name='Main Building';
INSERT IGNORE INTO rooms (building_id, room_code, room_name, room_type, capacity, status, notes)
SELECT building_id, 'TECH-COMLAB2', 'Computer Laboratory 2', 'COMPUTER_LAB', 35, 'AVAILABLE', 'Illustrative demo computer lab' FROM buildings WHERE building_name='Technology Building';
INSERT IGNORE INTO rooms (building_id, room_code, room_name, room_type, capacity, status, notes)
SELECT building_id, 'SCI-LAB-A', 'Science Laboratory A', 'LABORATORY', 28, 'AVAILABLE', 'Illustrative demo laboratory' FROM buildings WHERE building_name='Science Building';
INSERT IGNORE INTO rooms (building_id, room_code, room_name, room_type, capacity, status, notes)
SELECT building_id, 'ADMIN-CONF1', 'Conference Room 1', 'CONFERENCE_ROOM', 18, 'AVAILABLE', 'Illustrative demo conference room' FROM buildings WHERE building_name='Administration Building';
INSERT IGNORE INTO rooms (building_id, room_code, room_name, room_type, capacity, status, notes)
SELECT building_id, 'AUD-MAIN', 'Main Auditorium', 'AUDITORIUM', 180, 'AVAILABLE', 'Illustrative demo auditorium' FROM buildings WHERE building_name='Auditorium Complex';
INSERT IGNORE INTO rooms (building_id, room_code, room_name, room_type, capacity, status, notes)
SELECT building_id, 'ARTS-204', 'Arts and Humanities Room 204', 'LECTURE_ROOM', 40, 'MAINTENANCE', 'Illustrative demo room currently in maintenance' FROM buildings WHERE building_name='Arts and Humanities Building';

INSERT IGNORE INTO room_equipment (room_id, equipment_id, quantity, condition_status)
SELECT r.room_id, e.equipment_id, 1, 'GOOD' FROM rooms r JOIN equipment e ON
 (r.room_code='MAIN-301' AND e.equipment_name IN ('Projector','Audio system','Accessible seating')) OR
 (r.room_code='TECH-COMLAB2' AND e.equipment_name IN ('Computers','Projector','Audio system')) OR
 (r.room_code='SCI-LAB-A' AND e.equipment_name IN ('Lab equipment','Projector')) OR
 (r.room_code='ADMIN-CONF1' AND e.equipment_name IN ('Projector','Audio system','Accessible seating')) OR
 (r.room_code='AUD-MAIN' AND e.equipment_name IN ('Projector','Audio system','Accessible seating')) OR
 (r.room_code='ARTS-204' AND e.equipment_name='Projector');

CREATE TABLE user_alerts (
  alert_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  reservation_id BIGINT UNSIGNED NULL,
  alert_type ENUM('APPROVED','REJECTED','CANCELLED','INFO') NOT NULL DEFAULT 'INFO',
  message VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dismissed_at DATETIME NULL,
  CONSTRAINT fk_alert_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_alert_reservation FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id) ON DELETE SET NULL,
  INDEX idx_alert_user (user_id, dismissed_at)
) ENGINE=InnoDB;