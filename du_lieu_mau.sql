-- ============================================================
-- CRM DATABASE - SEED DATA (BẢN ĐẦY ĐỦ)
-- Tạo ngày: 2026-05-27
-- Dùng INSERT IGNORE để an toàn nếu đã có dữ liệu
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ============================================================
-- 1. PROVINCES
-- ============================================================
INSERT IGNORE INTO `provinces` (`id`, `name`) VALUES
(1,'Hà Nội'),(2,'Hồ Chí Minh'),(3,'Đà Nẵng'),(4,'Hải Phòng'),
(5,'Cần Thơ'),(6,'Bình Dương'),(7,'Đồng Nai'),(8,'Long An'),
(9,'Khánh Hòa'),(10,'Quảng Ninh'),(11,'Nghệ An'),(12,'Thừa Thiên Huế'),
(13,'Lâm Đồng'),(14,'Bà Rịa - Vũng Tàu'),(15,'An Giang');

-- ============================================================
-- 2. LEAD_SOURCES
-- ============================================================
INSERT IGNORE INTO `lead_sources` (`id`, `name`) VALUES
(1,'Facebook'),(2,'Zalo'),(3,'Website'),(4,'Referral'),
(5,'Cold Call'),(6,'Hội thảo'),(7,'Email Marketing');

-- ============================================================
-- 3. PRODUCT_CATEGORIES
-- ============================================================
INSERT IGNORE INTO `product_categories` (`id`, `name`, `is_active`) VALUES
(1,'Phần mềm',1),(2,'Dịch vụ tư vấn',1),(3,'Bảo trì',1);

-- ============================================================
-- 4. USERS
-- ============================================================
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `created_at`) VALUES
(1,'Admin',       'admin@crm.local',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','admin',  1,'2026-05-18 07:14:28'),
(2,'Thành Viên 1','member1@crm.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','sales',  1,'2026-05-18 07:14:28'),
(3,'Thành Viên 2','member2@crm.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','sales',  1,'2026-05-18 07:14:28'),
(4,'Thành Viên 3','member3@crm.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','manager',1,'2026-05-18 07:14:28');

-- ============================================================
-- 5. SALES_GROUPS
-- ============================================================
INSERT IGNORE INTO `sales_groups` (`id`, `name`, `manager_id`, `created_at`) VALUES
(1,'Nhóm Bắc',4,'2026-05-18 07:14:28'),
(2,'Nhóm Nam', 4,'2026-05-18 07:14:28');

-- ============================================================
-- 6. PRODUCTS
-- ============================================================
INSERT IGNORE INTO `products` (`id`,`code`,`name`,`category_id`,`price`,`image`,`description`,`is_deleted`,`created_at`,`updated_at`) VALUES
(1, 'SW-CRM-001','Phần mềm CRM Cơ bản',          1,15000000.00,NULL,'Quản lý khách hàng, lead, deal cho doanh nghiệp vừa và nhỏ',    0,'2026-01-05 08:00:00','2026-01-05 08:00:00'),
(2, 'SW-CRM-002','Phần mềm CRM Nâng cao',         1,35000000.00,NULL,'Đầy đủ tính năng: báo giá, hợp đồng, hóa đơn, báo cáo',       0,'2026-01-05 08:00:00','2026-01-05 08:00:00'),
(3, 'SW-ERP-001','Phần mềm ERP Doanh nghiệp',     1,80000000.00,NULL,'Hệ thống quản trị tổng thể tích hợp CRM, kế toán, kho',        0,'2026-01-06 08:00:00','2026-01-06 08:00:00'),
(4, 'SW-ACC-001','Phần mềm Kế toán',              1,12000000.00,NULL,'Quản lý thu chi, sổ sách kế toán theo chuẩn Việt Nam',         0,'2026-01-06 08:00:00','2026-01-06 08:00:00'),
(5, 'SV-CON-001','Tư vấn triển khai CRM',          2, 5000000.00,NULL,'Tư vấn cài đặt, cấu hình và đào tạo sử dụng CRM (theo ngày)', 0,'2026-01-07 08:00:00','2026-01-07 08:00:00'),
(6, 'SV-CON-002','Tư vấn chuyển đổi số',           2,20000000.00,NULL,'Phân tích quy trình và lên kế hoạch chuyển đổi số toàn diện', 0,'2026-01-07 08:00:00','2026-01-07 08:00:00'),
(7, 'SV-TRN-001','Đào tạo sử dụng phần mềm',      2, 3000000.00,NULL,'Đào tạo người dùng cuối tại chỗ hoặc trực tuyến (theo khóa)', 0,'2026-01-08 08:00:00','2026-01-08 08:00:00'),
(8, 'MT-BAS-001','Gói bảo trì Cơ bản (1 năm)',     3, 6000000.00,NULL,'Hỗ trợ kỹ thuật qua email & hotline, cập nhật phiên bản',     0,'2026-01-09 08:00:00','2026-01-09 08:00:00'),
(9, 'MT-PRO-001','Gói bảo trì Chuyên sâu (1 năm)', 3,12000000.00,NULL,'Hỗ trợ 24/7, cử chuyên viên đến tận nơi khi cần thiết',      0,'2026-01-09 08:00:00','2026-01-09 08:00:00'),
(10,'MT-CLO-001','Hosting & Lưu trữ đám mây',      3, 4800000.00,NULL,'Thuê máy chủ cloud, sao lưu dữ liệu tự động hàng ngày',       0,'2026-01-10 08:00:00','2026-01-10 08:00:00');

-- ============================================================
-- 7. LEADS
-- ============================================================
INSERT IGNORE INTO `leads` (`id`,`name`,`company`,`phone`,`email`,`expected_revenue`,`tax_code`,`id_card`,`province_id`,`source_id`,`sales_group_id`,`assigned_to`,`service_interest`,`status`,`note`,`created_at`,`updated_at`) VALUES
(1, 'Nguyễn Văn Hùng', 'Công ty TNHH Hùng Phát',      '0901234501','hung.nv@hungphat.vn',    50000000.00,'0312345678',NULL,        2,1,2,2,'Phần mềm CRM Nâng cao, Tư vấn triển khai',    'converted', 'Chuyển thành khách hàng tháng 3',         '2026-01-15 09:00:00','2026-03-10 10:00:00'),
(2, 'Trần Thị Lan',     'Công ty CP Lan Anh',           '0912345602','lan.tt@lananh.com',       30000000.00,'0398765432',NULL,        1,3,1,3,'Phần mềm CRM Cơ bản, Bảo trì Cơ bản',        'converted', 'Chuyển thành khách hàng tháng 2',         '2026-01-20 09:00:00','2026-02-28 10:00:00'),
(3, 'Lê Quốc Bảo',      'DNTN Bảo Thịnh',              '0923456703','bao.lq@baothinh.vn',     20000000.00,NULL,        '034111222',3,2,2,2,'Phần mềm Kế toán, Đào tạo',                   'contacting','Đã demo lần 1, đang chờ quyết định',      '2026-02-01 09:00:00','2026-05-10 10:00:00'),
(4, 'Phạm Minh Tuấn',   'Công ty TNHH MTV Tuấn Minh',  '0934567804','tuan.pm@tuanminh.vn',    80000000.00,'0412398765',NULL,        6,4,2,2,'ERP Doanh nghiệp, Tư vấn chuyển đổi số',      'contacting','Khách hàng tiềm năng lớn, cần chăm sóc', '2026-02-10 09:00:00','2026-05-15 10:00:00'),
(5, 'Hoàng Thị Mai',    NULL,                           '0945678905','mai.ht@gmail.com',         8000000.00,NULL,        '079333444',1,1,1,2,'Phần mềm CRM Cơ bản',                         'new',       'Lead từ Facebook Ads, chưa liên hệ',      '2026-03-05 09:00:00','2026-03-05 09:00:00'),
(6, 'Vũ Đình Khoa',     'Công ty CP Khoa Việt',         '0956789006','khoa.vd@khoaviet.com',   45000000.00,'0212398765',NULL,        4,6,1,3,'CRM Nâng cao, Hosting & Lưu trữ đám mây',     'contacting','Gặp tại hội thảo chuyển đổi số',         '2026-03-12 09:00:00','2026-05-01 10:00:00'),
(7, 'Đặng Thị Hoa',     'Trường THCS Hoa Phượng',      '0967890107','hoa.dt@hoaphuong.edu.vn',15000000.00,NULL,        NULL,       11,7,1,3,'Phần mềm Kế toán, Bảo trì Cơ bản',           'new',       'Lead từ Email Marketing',                 '2026-03-20 09:00:00','2026-03-20 09:00:00'),
(8, 'Bùi Thanh Sơn',    'Công ty TNHH Sơn Hà',         '0978901208','son.bt@sonha.vn',         60000000.00,'0513412345',NULL,        5,5,2,2,'ERP Doanh nghiệp, Tư vấn triển khai',         'dropped',   'Khách quyết định dùng sản phẩm đối thủ', '2026-02-25 09:00:00','2026-04-01 10:00:00'),
(9, 'Ngô Thị Phương',   'Hộ kinh doanh Phương Thảo',   '0989012309','phuong.nt@gmail.com',    12000000.00,NULL,        '085555666',9,2,2,2,'Phần mềm Kế toán',                            'contacting','Khách hàng nhỏ, đang tư vấn gói phù hợp','2026-04-08 09:00:00','2026-05-12 10:00:00'),
(10,'Trịnh Công Danh',  'Công ty CP Danh Tiến',         '0990123410','danh.tc@danhtienvn.com', 95000000.00,'0612345678',NULL,        7,4,2,2,'ERP, CRM Nâng cao, Tư vấn chuyển đổi số',    'converted', 'Chuyển thành KH chiến lược tháng 4',     '2026-02-20 09:00:00','2026-04-15 10:00:00');

-- ============================================================
-- 8. CUSTOMERS
-- ============================================================
INSERT IGNORE INTO `customers` (`id`,`name`,`type`,`tier`,`phone`,`email`,`tax_code`,`id_card`,`address`,`province_id`,`source_id`,`sales_group_id`,`assigned_to`,`status`,`lead_id`,`created_at`,`updated_at`) VALUES
(1, 'Công ty TNHH Hùng Phát',          'B2B','gold',    '0901234501','info@hungphat.vn',       '0312345678',NULL,        '45 Nguyễn Thị Minh Khai, Q.3',              2, 1,2,2,'active',  1,   '2026-03-10 10:00:00','2026-05-10 10:00:00'),
(2, 'Công ty CP Lan Anh',               'B2B','silver',  '0912345602','info@lananh.com',        '0398765432',NULL,        '12 Trần Phú, Hoàn Kiếm',                    1, 3,1,3,'active',  2,   '2026-02-28 10:00:00','2026-05-01 10:00:00'),
(3, 'Công ty CP Danh Tiến',             'B2B','diamond', '0990123410','contact@danhtienvn.com', '0612345678',NULL,        '88 Lê Lợi, Hải Châu, Đà Nẵng',             7, 4,2,2,'active',  10,  '2026-04-15 10:00:00','2026-05-15 10:00:00'),
(4, 'Công ty TNHH Phúc Thành',          'B2B','gold',    '0911222333','phucthanh@ptvn.com',     '0712345000',NULL,        '99 Hùng Vương, Ninh Kiều, Cần Thơ',        5, 6,2,2,'active',  NULL,'2026-01-10 10:00:00','2026-05-01 10:00:00'),
(5, 'Nguyễn Hữu Tài',                  'B2C','standard','0933111222','tai.nh@gmail.com',        NULL,        '079111222','34 Lý Thường Kiệt, Q.10, HCM',             2, 1,2,2,'active',  NULL,'2026-01-20 10:00:00','2026-04-20 10:00:00'),
(6, 'Công ty TNHH Tấn Phát Technology', 'B2B','diamond', '0922333444','info@tanphattech.vn',    '0812398765',NULL,        '200 Pasteur, Q.3, TP.HCM',                 2, 4,2,2,'active',  NULL,'2025-11-15 10:00:00','2026-05-10 10:00:00'),
(7, 'Công ty CP Minh Châu',             'B2B','silver',  '0944555666','info@minhchau.vn',       '0912398765',NULL,        '55 Bạch Đằng, Hồng Bàng, Hải Phòng',      4, 3,1,3,'active',  NULL,'2026-02-05 10:00:00','2026-04-30 10:00:00'),
(8, 'Lê Thị Bích Ngọc',                'B2C','standard','0955666777','ngoc.ltb@gmail.com',      NULL,        '082333444','78 Nguyễn Văn Cừ, Q.5, HCM',              2, 2,2,2,'inactive',NULL,'2026-01-25 10:00:00','2026-03-01 10:00:00'),
(9, 'Công ty TNHH Gia Bảo',            'B2B','standard','0966777888','giabao@gibaovn.com',      '0112345678',NULL,        '10 Phố Huế, Hai Bà Trưng, Hà Nội',        1, 5,1,3,'active',  NULL,'2026-03-01 10:00:00','2026-05-01 10:00:00'),
(10,'Tập đoàn Sao Việt',               'B2B','diamond', '0977888999','info@saoviet.com.vn',     '0912399999',NULL,        '1 Đường Trường Sa, Ngũ Hành Sơn, Đà Nẵng',3, 4,1,1,'active',  NULL,'2025-10-01 10:00:00','2026-05-20 10:00:00');

-- ============================================================
-- 9. CONTACTS
-- ============================================================
INSERT IGNORE INTO `contacts` (`id`,`customer_id`,`name`,`phone`,`email`,`birth_date`,`position`,`is_primary`,`created_at`,`updated_at`) VALUES
(1, 1, 'Nguyễn Văn Hùng',  '0901234501','hung.nv@hungphat.vn',    '1985-06-15','Giám đốc',              1,'2026-03-10 10:00:00','2026-03-10 10:00:00'),
(2, 1, 'Trần Thị Thu',      '0901234502','thu.tt@hungphat.vn',     '1990-03-20','Kế toán trưởng',       0,'2026-03-10 10:00:00','2026-03-10 10:00:00'),
(3, 2, 'Trần Thị Lan',      '0912345602','lan.tt@lananh.com',      '1988-09-10','Giám đốc điều hành',   1,'2026-02-28 10:00:00','2026-02-28 10:00:00'),
(4, 2, 'Nguyễn Anh Dũng',  '0912345603','dung.na@lananh.com',     '1992-12-05','Trưởng phòng IT',      0,'2026-02-28 10:00:00','2026-02-28 10:00:00'),
(5, 3, 'Trịnh Công Danh',  '0990123410','danh.tc@danhtienvn.com', '1980-04-22','Chủ tịch HĐQT',        1,'2026-04-15 10:00:00','2026-04-15 10:00:00'),
(6, 3, 'Lưu Thị Hương',    '0990123411','huong.lt@danhtienvn.com','1987-07-18','Giám đốc Tài chính',   0,'2026-04-15 10:00:00','2026-04-15 10:00:00'),
(7, 4, 'Dương Văn Phúc',   '0911222333','phuc.dv@ptvn.com',       '1983-11-30','Tổng Giám đốc',        1,'2026-01-10 10:00:00','2026-01-10 10:00:00'),
(8, 4, 'Ngô Bích Hà',       '0911222334','ha.nb@ptvn.com',         '1991-02-14','Trưởng phòng Mua sắm', 0,'2026-01-10 10:00:00','2026-01-10 10:00:00'),
(9, 5, 'Nguyễn Hữu Tài',   '0933111222','tai.nh@gmail.com',       '1995-08-25',NULL,                   1,'2026-01-20 10:00:00','2026-01-20 10:00:00'),
(10,6, 'Cao Tấn Phát',      '0922333444','phat.ct@tanphattech.vn', '1979-01-08','CEO',                  1,'2025-11-15 10:00:00','2025-11-15 10:00:00'),
(11,6, 'Vũ Thị Ngân',       '0922333445','ngan.vt@tanphattech.vn', '1990-05-17','Giám đốc Vận hành',   0,'2025-11-15 10:00:00','2025-11-15 10:00:00'),
(12,7, 'Phan Minh Châu',    '0944555666','chau.pm@minhchau.vn',    '1982-10-03','Giám đốc',             1,'2026-02-05 10:00:00','2026-02-05 10:00:00'),
(13,9, 'Đỗ Gia Bảo',        '0966777888','bao.dg@gibaovn.com',     '1986-03-12','Giám đốc',             1,'2026-03-01 10:00:00','2026-03-01 10:00:00'),
(14,10,'Lý Sao Nam',         '0977888999','nam.ls@saoviet.com.vn',  '1975-12-28','Chủ tịch Tập đoàn',   1,'2025-10-01 10:00:00','2025-10-01 10:00:00'),
(15,10,'Hoàng Thúy Nga',    '0977888998','nga.ht@saoviet.com.vn',  '1988-06-09','Phó Chủ tịch',         0,'2025-10-01 10:00:00','2025-10-01 10:00:00');

-- ============================================================
-- 10. DEALS
-- ============================================================
INSERT IGNORE INTO `deals` (`id`,`customer_id`,`title`,`value`,`status`,`assigned_to`,`created_at`,`updated_at`) VALUES
(1,1, 'Triển khai CRM Nâng cao – Hùng Phát',          40000000.00,'won', 2,'2026-03-11 08:00:00','2026-04-01 08:00:00'),
(2,2, 'Cung cấp CRM Cơ bản + Bảo trì – Lan Anh',      21000000.00,'won', 3,'2026-03-01 08:00:00','2026-03-20 08:00:00'),
(3,3, 'Dự án ERP tổng thể – Danh Tiến',              180000000.00,'won', 2,'2026-04-16 08:00:00','2026-05-10 08:00:00'),
(4,4, 'Gia hạn & nâng cấp ERP – Phúc Thành',          55000000.00,'open',2,'2026-04-20 08:00:00','2026-05-15 08:00:00'),
(5,6, 'Hợp đồng tổng thể năm 2026 – Tấn Phát Tech', 250000000.00,'won', 2,'2026-01-05 08:00:00','2026-02-01 08:00:00'),
(6,7, 'Triển khai CRM + Kế toán – Minh Châu',         47000000.00,'open',3,'2026-05-01 08:00:00','2026-05-20 08:00:00'),
(7,9, 'Cung cấp phần mềm – Gia Bảo',                  15000000.00,'open',3,'2026-03-05 08:00:00','2026-05-18 08:00:00'),
(8,10,'Hợp đồng khung năm 2026 – Sao Việt',          320000000.00,'won', 1,'2025-10-05 08:00:00','2025-12-20 08:00:00');

-- ============================================================
-- 11. QUOTE_TEMPLATES
-- ============================================================
INSERT IGNORE INTO `quote_templates` (`id`,`name`,`content`,`created_by`,`created_at`) VALUES
(1,'Mẫu báo giá phần mềm chuẩn',
 '<h2>BÁO GIÁ PHẦN MỀM</h2><p>Kính gửi: {{customer_name}}</p><table>{{items}}</table><p>Tổng: {{total}}</p><p>Hiệu lực: {{validity_date}}</p>',
 1,'2026-01-03 08:00:00'),
(2,'Mẫu báo giá dịch vụ tư vấn',
 '<h2>BÁO GIÁ DỊCH VỤ TƯ VẤN</h2><p>Kính gửi: {{customer_name}}</p><table>{{items}}</table><p>Tổng: {{total}}</p>',
 1,'2026-01-03 08:00:00'),
(3,'Mẫu báo giá gói tổng thể',
 '<h2>BÁO GIÁ GÓI GIẢI PHÁP TỔNG THỂ</h2><p>Kính gửi: {{customer_name}}</p><table>{{items}}</table><p>Chiết khấu: {{discount}}</p><p>Tổng: {{total}}</p>',
 1,'2026-01-04 08:00:00');

-- ============================================================
-- 12. QUOTES
-- ============================================================
INSERT IGNORE INTO `quotes` (`id`,`quote_number`,`customer_id`,`deal_id`,`template_id`,`date`,`validity_date`,`status`,`subtotal`,`discount`,`tax`,`total`,`note`,`created_by`,`created_at`,`updated_at`) VALUES
(1,'BG-2026-0001',1, 1,1,'2026-03-12','2026-04-12','closed',     40000000.00, 2000000.00, 3800000.00, 41800000.00,'Báo giá CRM Nâng cao + tư vấn triển khai',    2,'2026-03-12 09:00:00','2026-04-01 10:00:00'),
(2,'BG-2026-0002',2, 2,1,'2026-03-02','2026-04-01','closed',     21000000.00,       0.00, 2100000.00, 23100000.00,'Báo giá CRM Cơ bản + 1 năm bảo trì',          3,'2026-03-02 09:00:00','2026-03-20 10:00:00'),
(3,'BG-2026-0003',3, 3,3,'2026-04-17','2026-05-17','closed',    195000000.00,15000000.00,18000000.00,198000000.00,'Báo giá ERP tổng thể cho Danh Tiến',           2,'2026-04-17 09:00:00','2026-05-10 10:00:00'),
(4,'BG-2026-0004',4, 4,3,'2026-04-21','2026-05-21','negotiating', 60000000.00, 5000000.00, 5500000.00, 60500000.00,'Nâng cấp ERP, đang thương lượng chiết khấu',  2,'2026-04-21 09:00:00','2026-05-15 10:00:00'),
(5,'BG-2026-0005',6, 5,3,'2026-01-06','2026-02-05','closed',    275000000.00,25000000.00,25000000.00,275000000.00,'Gói tổng thể 2026 – Tấn Phát Technology',     2,'2026-01-06 09:00:00','2026-02-01 10:00:00'),
(6,'BG-2026-0006',7, 6,1,'2026-05-02','2026-06-01','negotiating', 50000000.00, 3000000.00, 4700000.00, 51700000.00,'CRM Nâng cao + Kế toán + Bảo trì',           3,'2026-05-02 09:00:00','2026-05-20 10:00:00'),
(7,'BG-2026-0007',9, 7,1,'2026-03-06','2026-04-05','draft',      15000000.00,       0.00, 1500000.00, 16500000.00,'Báo giá CRM Cơ bản',                          3,'2026-03-06 09:00:00','2026-03-06 09:00:00'),
(8,'BG-2025-0042',10,8,3,'2025-10-10','2025-11-09','closed',    350000000.00,30000000.00,32000000.00,352000000.00,'Hợp đồng khung Sao Việt 2026',                1,'2025-10-10 09:00:00','2025-12-20 10:00:00');

-- ============================================================
-- 13. QUOTE_ITEMS
-- ============================================================
INSERT IGNORE INTO `quote_items` (`id`,`quote_id`,`product_id`,`product_name`,`unit_price`,`quantity`,`discount_percent`,`total`) VALUES
(1, 1,2,'Phần mềm CRM Nâng cao',          35000000.00,1.00,0.00,35000000.00),
(2, 1,5,'Tư vấn triển khai CRM',           5000000.00,1.00,0.00, 5000000.00),
(3, 2,1,'Phần mềm CRM Cơ bản',            15000000.00,1.00,0.00,15000000.00),
(4, 2,8,'Gói bảo trì Cơ bản (1 năm)',      6000000.00,1.00,0.00, 6000000.00),
(5, 3,3,'Phần mềm ERP Doanh nghiệp',      80000000.00,1.00,0.00,80000000.00),
(6, 3,6,'Tư vấn chuyển đổi số',           20000000.00,1.00,0.00,20000000.00),
(7, 3,5,'Tư vấn triển khai CRM',           5000000.00,5.00,0.00,25000000.00),
(8, 3,9,'Gói bảo trì Chuyên sâu (1 năm)', 12000000.00,1.00,0.00,12000000.00),
(9, 3,10,'Hosting & Lưu trữ đám mây',      4800000.00,1.00,0.00, 4800000.00),
(10,4,3,'Phần mềm ERP Doanh nghiệp',      80000000.00,1.00,0.00,80000000.00),
(11,5,3,'Phần mềm ERP Doanh nghiệp',      80000000.00,1.00,0.00,80000000.00),
(12,5,2,'Phần mềm CRM Nâng cao',          35000000.00,1.00,0.00,35000000.00),
(13,5,9,'Gói bảo trì Chuyên sâu (1 năm)', 12000000.00,2.00,0.00,24000000.00),
(14,6,2,'Phần mềm CRM Nâng cao',          35000000.00,1.00,0.00,35000000.00),
(15,6,4,'Phần mềm Kế toán',              12000000.00,1.00,0.00,12000000.00),
(16,7,1,'Phần mềm CRM Cơ bản',            15000000.00,1.00,0.00,15000000.00);

-- ============================================================
-- 14. CONTRACT_TEMPLATES
-- ============================================================
INSERT IGNORE INTO `contract_templates` (`id`,`name`,`content`,`created_by`,`created_at`) VALUES
(1,'Hợp đồng cung cấp phần mềm',
 '<h2>HỢP ĐỒNG CUNG CẤP PHẦN MỀM</h2><p>Số: {{contract_number}}</p><p>Bên A: Công ty chúng tôi</p><p>Bên B: {{customer_name}}</p><p>Ngày ký: {{sign_date}}</p><p>Giá trị: {{value}} VNĐ</p><p>Hạn hiệu lực: {{expiry_date}}</p>',
 1,'2026-01-03 08:00:00'),
(2,'Hợp đồng khung dịch vụ năm',
 '<h2>HỢP ĐỒNG KHUNG DỊCH VỤ</h2><p>Số: {{contract_number}}</p><p>Bên A: Công ty chúng tôi</p><p>Bên B: {{customer_name}}</p><p>Ngày ký: {{sign_date}}</p><p>Giá trị: {{value}} VNĐ</p><p>Hạn hiệu lực: {{expiry_date}}</p>',
 1,'2026-01-04 08:00:00');

-- ============================================================
-- 15. CONTRACTS
-- ============================================================
INSERT IGNORE INTO `contracts` (`id`,`contract_number`,`customer_id`,`quote_id`,`template_id`,`sign_date`,`expiry_date`,`value`,`manager_id`,`status`,`note`,`created_at`,`updated_at`) VALUES
(1,'HD-2026-0001',1, 1,1,'2026-04-01','2027-04-01', 41800000.00,4,'active', 'Hợp đồng CRM Nâng cao – Hùng Phát',        '2026-04-01 10:00:00','2026-04-01 10:00:00'),
(2,'HD-2026-0002',2, 2,1,'2026-03-20','2027-03-20', 23100000.00,4,'active', 'Hợp đồng CRM Cơ bản – Lan Anh',            '2026-03-20 10:00:00','2026-03-20 10:00:00'),
(3,'HD-2026-0003',3, 3,1,'2026-05-10','2027-05-10',198000000.00,4,'active', 'Hợp đồng ERP – Danh Tiến',                  '2026-05-10 10:00:00','2026-05-10 10:00:00'),
(4,'HD-2026-0004',6, 5,2,'2026-02-01','2027-02-01',275000000.00,4,'active', 'Hợp đồng khung 2026 – Tấn Phát Technology', '2026-02-01 10:00:00','2026-02-01 10:00:00'),
(5,'HD-2025-0055',10,8,2,'2025-12-20','2026-12-20',352000000.00,4,'active', 'Hợp đồng khung 2026 – Sao Việt',            '2025-12-20 10:00:00','2025-12-20 10:00:00'),
(6,'HD-2025-0030',4,NULL,1,'2025-06-01','2026-05-31', 48000000.00,4,'expired','Hợp đồng cũ đã hết hạn – Phúc Thành',     '2025-06-01 10:00:00','2026-06-01 10:00:00');

-- ============================================================
-- 16. INVOICES
-- ============================================================
INSERT IGNORE INTO `invoices` (`id`,`invoice_number`,`customer_id`,`quote_id`,`contract_id`,`date`,`due_date`,`subtotal`,`discount`,`tax`,`total`,`status`,`note`,`created_by`,`created_at`,`updated_at`) VALUES
(1,'HD-INV-2026-001',1, 1,1,'2026-04-05','2026-04-20', 40000000.00, 2000000.00, 3800000.00, 41800000.00,'paid',   'Hóa đơn đợt 1 – Hùng Phát (đã TT)',        2,'2026-04-05 09:00:00','2026-04-22 09:00:00'),
(2,'HD-INV-2026-002',2, 2,2,'2026-03-22','2026-04-10', 21000000.00,       0.00, 2100000.00, 23100000.00,'paid',   'Hóa đơn thanh toán 1 lần – Lan Anh',        3,'2026-03-22 09:00:00','2026-04-09 09:00:00'),
(3,'HD-INV-2026-003',3, 3,3,'2026-05-12','2026-05-27',100000000.00, 7500000.00, 9250000.00,101750000.00,'unpaid', 'Hóa đơn đợt 1/2 – Danh Tiến (chờ TT)',     2,'2026-05-12 09:00:00','2026-05-12 09:00:00'),
(4,'HD-INV-2026-004',6, 5,4,'2026-02-05','2026-02-20',137500000.00,12500000.00,12500000.00,137500000.00,'paid',   'Hóa đơn đợt 1/2 – Tấn Phát Technology',    2,'2026-02-05 09:00:00','2026-02-18 09:00:00'),
(5,'HD-INV-2026-005',6, 5,4,'2026-05-01','2026-05-16',137500000.00,12500000.00,12500000.00,137500000.00,'partial','Hóa đơn đợt 2/2 – Tấn Phát (đã TT 50%)',   2,'2026-05-01 09:00:00','2026-05-15 09:00:00'),
(6,'HD-INV-2026-006',10,8,5,'2026-01-05','2026-01-20',176000000.00,15000000.00,16100000.00,177100000.00,'paid',   'Hóa đơn đợt 1/2 – Sao Việt',               1,'2026-01-05 09:00:00','2026-01-18 09:00:00'),
(7,'HD-INV-2026-007',10,8,5,'2026-04-01','2026-04-16',176000000.00,15000000.00,16100000.00,177100000.00,'paid',   'Hóa đơn đợt 2/2 – Sao Việt',               1,'2026-04-01 09:00:00','2026-04-14 09:00:00');

-- ============================================================
-- 17. INVOICE_ITEMS
-- ============================================================
INSERT IGNORE INTO `invoice_items` (`id`,`invoice_id`,`product_id`,`product_name`,`unit_price`,`quantity`,`discount_percent`,`total`) VALUES
(1, 1,2,'Phần mềm CRM Nâng cao',          35000000.00,1.00,0.00,35000000.00),
(2, 1,5,'Tư vấn triển khai CRM',           5000000.00,1.00,0.00, 5000000.00),
(3, 2,1,'Phần mềm CRM Cơ bản',            15000000.00,1.00,0.00,15000000.00),
(4, 2,8,'Gói bảo trì Cơ bản (1 năm)',      6000000.00,1.00,0.00, 6000000.00),
(5, 3,3,'Phần mềm ERP Doanh nghiệp',      80000000.00,1.00,0.00,80000000.00),
(6, 3,6,'Tư vấn chuyển đổi số',           20000000.00,1.00,0.00,20000000.00),
(7, 4,3,'Phần mềm ERP Doanh nghiệp',      80000000.00,1.00,0.00,80000000.00),
(8, 4,2,'Phần mềm CRM Nâng cao',          35000000.00,1.00,0.00,35000000.00),
(9, 5,9,'Gói bảo trì Chuyên sâu (1 năm)', 12000000.00,2.00,0.00,24000000.00),
(10,5,10,'Hosting & Lưu trữ đám mây',      4800000.00,1.00,0.00, 4800000.00),
(11,6,3,'Phần mềm ERP Doanh nghiệp',      80000000.00,1.00,0.00,80000000.00),
(12,6,2,'Phần mềm CRM Nâng cao',          35000000.00,1.00,0.00,35000000.00),
(13,7,9,'Gói bảo trì Chuyên sâu (1 năm)', 12000000.00,2.00,0.00,24000000.00),
(14,7,6,'Tư vấn chuyển đổi số',           20000000.00,1.00,0.00,20000000.00);

-- ============================================================
-- 18. CUSTOMER_INTERACTIONS
-- ============================================================
INSERT IGNORE INTO `customer_interactions` (`id`,`customer_id`,`type`,`note`,`interaction_date`,`created_by`,`created_at`) VALUES
(1, 1,'call',   'Gọi điện xác nhận tiến độ triển khai CRM tuần 1',                        '2026-04-03 09:30:00',2,'2026-04-03 09:30:00'),
(2, 1,'meeting','Họp kick-off dự án CRM, xác nhận yêu cầu chi tiết',                      '2026-04-08 14:00:00',2,'2026-04-08 14:00:00'),
(3, 1,'email',  'Gửi tài liệu hướng dẫn sử dụng CRM phiên bản 2.1',                      '2026-04-15 10:00:00',2,'2026-04-15 10:00:00'),
(4, 2,'call',   'Kiểm tra tình hình sử dụng phần mềm sau 1 tháng go-live',               '2026-04-25 10:00:00',3,'2026-04-25 10:00:00'),
(5, 2,'meeting','Đào tạo bổ sung cho nhân viên mới của Lan Anh (5 người)',                '2026-05-05 09:00:00',3,'2026-05-05 09:00:00'),
(6, 3,'call',   'Khảo sát yêu cầu ERP của Danh Tiến qua điện thoại',                     '2026-04-18 11:00:00',2,'2026-04-18 11:00:00'),
(7, 3,'meeting','Demo ERP tại văn phòng Đà Nẵng, có mặt ban lãnh đạo và IT',             '2026-04-22 09:00:00',2,'2026-04-22 09:00:00'),
(8, 4,'call',   'Trao đổi yêu cầu nâng cấp ERP, thêm module quản lý kho',                '2026-04-25 14:00:00',2,'2026-04-25 14:00:00'),
(9, 6,'meeting','Họp review quý 1 với ban lãnh đạo Tấn Phát Technology',                  '2026-04-01 09:00:00',2,'2026-04-01 09:00:00'),
(10,6,'email',  'Gửi báo cáo hiệu suất hệ thống và đề xuất cải tiến Q2',                 '2026-04-05 08:00:00',2,'2026-04-05 08:00:00'),
(11,7,'call',   'Tư vấn báo giá CRM + Kế toán cho Minh Châu',                            '2026-05-03 11:00:00',3,'2026-05-03 11:00:00'),
(12,9,'call',   'Tư vấn gói CRM Cơ bản phù hợp với quy mô Gia Bảo',                     '2026-03-08 09:00:00',3,'2026-03-08 09:00:00'),
(13,10,'meeting','Họp tổng kết 6 tháng triển khai, lên kế hoạch mở rộng 2026',           '2026-04-10 09:00:00',1,'2026-04-10 09:00:00'),
(14,10,'email', 'Gửi đề xuất gói dịch vụ nâng cao cho năm 2027',                         '2026-05-20 08:00:00',1,'2026-05-20 08:00:00'),
(15,5,'call',   'Giải đáp thắc mắc về tính năng báo cáo phần mềm',                       '2026-04-22 14:30:00',2,'2026-04-22 14:30:00');

-- ============================================================
-- 19. CUSTOMER_DOCUMENTS
-- ============================================================
INSERT IGNORE INTO `customer_documents` (`id`,`customer_id`,`name`,`file_path`,`file_type`,`uploaded_by`,`uploaded_at`) VALUES
(1,1, 'Hợp đồng HD-2026-0001 (bản scan)',         'uploads/customers/1/HD-2026-0001.pdf',           'application/pdf',              2,'2026-04-02 10:00:00'),
(2,1, 'Giấy phép kinh doanh – Hùng Phát',          'uploads/customers/1/gpkd_hungphat.pdf',           'application/pdf',              2,'2026-03-12 10:00:00'),
(3,2, 'Hợp đồng HD-2026-0002 (bản scan)',          'uploads/customers/2/HD-2026-0002.pdf',            'application/pdf',              3,'2026-03-21 10:00:00'),
(4,3, 'Biên bản nghiệm thu giai đoạn 1 – Danh Tiến','uploads/customers/3/bienban_nghiemthu_1.pdf',   'application/pdf',              2,'2026-05-15 10:00:00'),
(5,6, 'Hợp đồng khung HD-2026-0004',               'uploads/customers/6/HD-2026-0004.pdf',            'application/pdf',              2,'2026-02-02 10:00:00'),
(6,6, 'Biên bản bàn giao hệ thống ERP',             'uploads/customers/6/bienban_bangiao_erp.pdf',    'application/pdf',              2,'2026-03-15 10:00:00'),
(7,10,'Hợp đồng khung HD-2025-0055',               'uploads/customers/10/HD-2025-0055.pdf',           'application/pdf',              1,'2025-12-21 10:00:00'),
(8,10,'Kế hoạch triển khai 2026 – Sao Việt',       'uploads/customers/10/kehoach_2026.xlsx',          'application/vnd.ms-excel',     1,'2026-01-03 10:00:00');

-- ============================================================
-- 20. LEAD_INTERACTIONS
-- ============================================================
INSERT IGNORE INTO `lead_interactions` (`id`,`lead_id`,`type`,`note`,`interaction_date`,`created_by`,`created_at`) VALUES
(1, 1,'call',   'Gọi điện lần đầu, giới thiệu sản phẩm CRM Nâng cao cho anh Hùng',     '2026-01-16 09:00:00',2,'2026-01-16 09:00:00'),
(2, 1,'meeting','Demo phần mềm tại văn phòng khách, phản hồi tích cực',                 '2026-01-25 14:00:00',2,'2026-01-25 14:00:00'),
(3, 2,'call',   'Liên hệ lead Lan Anh, tư vấn gói CRM Cơ bản',                         '2026-01-21 10:00:00',3,'2026-01-21 10:00:00'),
(4, 2,'email',  'Gửi brochure sản phẩm và báo giá sơ bộ cho chị Lan',                  '2026-01-28 08:00:00',3,'2026-01-28 08:00:00'),
(5, 3,'call',   'Cuộc gọi lần 1: anh Bảo quan tâm phần mềm kế toán',                  '2026-02-03 11:00:00',2,'2026-02-03 11:00:00'),
(6, 3,'meeting','Demo phần mềm kế toán trực tuyến qua Zoom',                            '2026-02-15 14:00:00',2,'2026-02-15 14:00:00'),
(7, 4,'call',   'Gọi điện khảo sát nhu cầu ERP của công ty Tuấn Minh',                 '2026-02-12 09:00:00',2,'2026-02-12 09:00:00'),
(8, 4,'meeting','Gặp mặt trực tiếp, trình bày giải pháp ERP tổng thể',                 '2026-02-20 14:00:00',2,'2026-02-20 14:00:00'),
(9, 6,'meeting','Gặp anh Khoa tại hội thảo chuyển đổi số – trao đổi sơ bộ nhu cầu',  '2026-03-12 17:00:00',3,'2026-03-12 17:00:00'),
(10,10,'call',  'Gọi điện tư vấn sơ bộ dự án ERP cho Danh Tiến, hẹn gặp mặt',         '2026-02-22 10:00:00',2,'2026-02-22 10:00:00');

-- ============================================================
-- 21. COMPLAINTS
-- ============================================================
INSERT IGNORE INTO `complaints` (`id`,`customer_id`,`title`,`description`,`status`,`resolved_at`,`created_by`,`created_at`,`updated_at`) VALUES
(1,2,'Phần mềm bị lỗi khi xuất báo cáo Excel',
 'Khi xuất báo cáo doanh thu theo tháng ra file Excel, hệ thống báo lỗi 500. Đã thử trên 2 máy tính khác nhau.',
 'resolved','2026-04-10 15:00:00',3,'2026-04-05 09:00:00','2026-04-10 15:00:00'),
(2,1,'Tốc độ hệ thống CRM chậm vào giờ cao điểm',
 'Vào khoảng 8h-9h và 13h-14h, hệ thống load rất chậm, ảnh hưởng đến công việc của nhân viên sales (khoảng 8 người).',
 'processing',NULL,2,'2026-04-18 10:00:00','2026-04-20 10:00:00'),
(3,6,'Lỗi đồng bộ dữ liệu giữa ERP và CRM',
 'Module kho của ERP không đồng bộ được số lượng tồn kho real-time sang CRM. Phát hiện chênh lệch số liệu từ ngày 10/04.',
 'processing',NULL,2,'2026-04-20 09:00:00','2026-05-10 10:00:00'),
(4,10,'Yêu cầu thêm quyền truy cập báo cáo cho giám đốc chi nhánh',
 'Tài khoản giám đốc chi nhánh không xem được báo cáo tổng hợp toàn công ty. Đề nghị bổ sung quyền.',
 'resolved','2026-05-05 10:00:00',1,'2026-04-28 14:00:00','2026-05-05 10:00:00'),
(5,7,'Không nhận được email thông báo khi có deal mới',
 'Sau khi cấu hình email notification, hệ thống không gửi email khi có deal mới được tạo. Đã kiểm tra cấu hình SMTP.',
 'open',NULL,3,'2026-05-15 09:00:00','2026-05-15 09:00:00'),
(6,4,'Yêu cầu hỗ trợ import dữ liệu khách hàng từ Excel',
 'Công ty có file danh sách 500 khách hàng cũ muốn import vào hệ thống nhưng chưa biết cách thực hiện.',
 'closed','2026-03-15 16:00:00',2,'2026-03-10 11:00:00','2026-03-15 16:00:00');

-- ============================================================
-- 22. DOCUMENTS (nội bộ)
-- ============================================================
INSERT IGNORE INTO `documents` (`id`,`name`,`file_path`,`type`,`version`,`release_date`,`expiry_date`,`uploaded_by`,`created_at`) VALUES
(1,'Hướng dẫn sử dụng CRM v2.1',            'docs/huong_dan_crm_v2.1.pdf',      'Tài liệu hướng dẫn','2.1',  '2026-03-01',NULL,        1,'2026-03-01 08:00:00'),
(2,'Hướng dẫn sử dụng ERP v1.5',            'docs/huong_dan_erp_v1.5.pdf',      'Tài liệu hướng dẫn','1.5',  '2026-01-15',NULL,        1,'2026-01-15 08:00:00'),
(3,'Quy trình bán hàng nội bộ 2026',        'docs/quy_trinh_ban_hang_2026.pdf', 'Quy trình',         '1.0',  '2026-01-02','2026-12-31',4,'2026-01-02 08:00:00'),
(4,'Chính sách chiết khấu Q1-Q2/2026',      'docs/chinh_sach_chiet_khau.pdf',   'Chính sách',        '1.0',  '2026-01-02','2026-06-30',4,'2026-01-02 08:00:00'),
(5,'Biểu mẫu báo cáo công việc hàng tuần', 'docs/bieu_mau_bao_cao_tuan.xlsx',  'Biểu mẫu',          '1.2',  '2026-02-01',NULL,        4,'2026-02-01 08:00:00'),
(6,'Catalog sản phẩm & dịch vụ 2026',       'docs/catalog_2026.pdf',            'Marketing',         '2026', '2026-01-10','2026-12-31',1,'2026-01-10 08:00:00');

-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;
-- HOÀN TẤT IMPORT
-- ============================================================
