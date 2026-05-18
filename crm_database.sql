-- ==========================================================
-- CRM DATABASE - Nhóm 4 người
-- Phiên bản: 1.0
-- Mô tả: Quản lý Lead, Khách hàng, Sản phẩm, Báo giá,
--        Hợp đồng, Hóa đơn, Tài liệu, Người liên hệ
-- ==========================================================

CREATE DATABASE IF NOT EXISTS crm_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE crm_db;

-- ----------------------------------------------------------
-- BẢNG HỖ TRỢ (LOOKUP TABLES)
-- ----------------------------------------------------------

-- Người dùng hệ thống (nhóm 4 người + mở rộng)
CREATE TABLE users (
    id       INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100)    NOT NULL,
    email    VARCHAR(100)    NOT NULL UNIQUE,
    password VARCHAR(255)    NOT NULL,
    role     ENUM('admin','manager','sales') NOT NULL DEFAULT 'sales',
    is_active TINYINT(1)     NOT NULL DEFAULT 1,
    created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tỉnh / Thành phố (63 tỉnh VN)
CREATE TABLE provinces (
    id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Nguồn khách hàng (Facebook, Zalo, Referral, Website...)
CREATE TABLE lead_sources (
    id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Nhóm bán hàng
CREATE TABLE sales_groups (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    manager_id INT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Danh mục Sản phẩm / Dịch vụ
CREATE TABLE product_categories (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT
) ENGINE=InnoDB;


-- ----------------------------------------------------------
-- MODULE: QUẢN LÝ SẢN PHẨM / DỊCH VỤ (Task 4.x)
-- ----------------------------------------------------------

CREATE TABLE products (
    id          INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
    code        VARCHAR(50)   NOT NULL UNIQUE COMMENT 'Mã sản phẩm',
    name        VARCHAR(200)  NOT NULL,
    category_id INT UNSIGNED,
    price       DECIMAL(15,2) NOT NULL DEFAULT 0,
    image       VARCHAR(255)  COMMENT 'Đường dẫn file ảnh',
    description TEXT,
    is_active   TINYINT(1)    NOT NULL DEFAULT 1,
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- ----------------------------------------------------------
-- MODULE: QUẢN LÝ LEAD (Task 1.x)
-- ----------------------------------------------------------

CREATE TABLE leads (
    id               INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(100)  NOT NULL                        COMMENT 'Tên lead',
    company          VARCHAR(200)                                  COMMENT 'Tên công ty',
    phone            VARCHAR(20)                                   COMMENT 'Số điện thoại',
    email            VARCHAR(100),
    expected_revenue DECIMAL(15,2)                                COMMENT 'Doanh số dự kiến',
    tax_code         VARCHAR(20)                                   COMMENT 'Mã số thuế',
    id_card          VARCHAR(20)                                   COMMENT 'CCCD / CMND',
    province_id      TINYINT UNSIGNED,
    source_id        TINYINT UNSIGNED,
    sales_group_id   INT UNSIGNED,
    assigned_to      INT UNSIGNED,
    service_interest TEXT                                          COMMENT 'Dịch vụ / Sản phẩm quan tâm (Task 1.2)',
    status           ENUM('new','contacting','converted','dropped')
                     NOT NULL DEFAULT 'new'                        COMMENT 'Tình trạng lead (Task 1.3)',
    note             TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (province_id)    REFERENCES provinces(id)     ON DELETE SET NULL,
    FOREIGN KEY (source_id)      REFERENCES lead_sources(id)  ON DELETE SET NULL,
    FOREIGN KEY (sales_group_id) REFERENCES sales_groups(id)  ON DELETE SET NULL,
    FOREIGN KEY (assigned_to)    REFERENCES users(id)         ON DELETE SET NULL
) ENGINE=InnoDB;

-- Lịch sử tương tác với Lead (Task 1.4)
CREATE TABLE lead_interactions (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    lead_id          INT UNSIGNED NOT NULL,
    type             ENUM('call','meeting','email') NOT NULL,
    note             TEXT,
    interaction_date DATETIME     NOT NULL,
    created_by       INT UNSIGNED,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id)    REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- ----------------------------------------------------------
-- MODULE: QUẢN LÝ KHÁCH HÀNG - B2B & B2C (Task 2.x)
-- ----------------------------------------------------------

CREATE TABLE customers (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(200) NOT NULL,
    type           ENUM('B2B','B2C')                         NOT NULL DEFAULT 'B2B',
    tier           ENUM('standard','silver','gold','diamond') NOT NULL DEFAULT 'standard' COMMENT 'Phân loại: Bạc/Vàng/Kim Cương',
    phone          VARCHAR(20),
    email          VARCHAR(100),
    tax_code       VARCHAR(20)  COMMENT 'Mã số thuế (B2B)',
    id_card        VARCHAR(20)  COMMENT 'CCCD (B2C)',
    address        VARCHAR(500),
    province_id    TINYINT UNSIGNED,
    source_id      TINYINT UNSIGNED,
    sales_group_id INT UNSIGNED,
    assigned_to    INT UNSIGNED,
    status         ENUM('active','inactive','blacklist') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái chăm sóc (Task 2.7)',
    lead_id        INT UNSIGNED COMMENT 'Lead gốc đã chuyển đổi thành KH',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (province_id)    REFERENCES provinces(id)    ON DELETE SET NULL,
    FOREIGN KEY (source_id)      REFERENCES lead_sources(id) ON DELETE SET NULL,
    FOREIGN KEY (sales_group_id) REFERENCES sales_groups(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to)    REFERENCES users(id)        ON DELETE SET NULL,
    FOREIGN KEY (lead_id)        REFERENCES leads(id)        ON DELETE SET NULL
) ENGINE=InnoDB;

-- Lịch sử tương tác với Khách hàng (Task 2.3)
CREATE TABLE customer_interactions (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id      INT UNSIGNED NOT NULL,
    type             ENUM('call','email','meeting') NOT NULL,
    note             TEXT,
    interaction_date DATETIME     NOT NULL,
    created_by       INT UNSIGNED,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by)  REFERENCES users(id)     ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tài liệu đính kèm Khách hàng (Task 2.4)
CREATE TABLE customer_documents (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED  NOT NULL,
    name        VARCHAR(200)  NOT NULL,
    file_path   VARCHAR(500)  NOT NULL,
    file_type   VARCHAR(50),
    uploaded_by INT UNSIGNED,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)     ON DELETE SET NULL
) ENGINE=InnoDB;

-- Phản hồi / Khiếu nại (Task 2.6)
CREATE TABLE complaints (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED  NOT NULL,
    title       VARCHAR(300)  NOT NULL,
    description TEXT,
    status      ENUM('open','processing','resolved','closed') NOT NULL DEFAULT 'open',
    resolved_at DATETIME,
    created_by  INT UNSIGNED,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by)  REFERENCES users(id)     ON DELETE SET NULL
) ENGINE=InnoDB;


-- ----------------------------------------------------------
-- MODULE: QUẢN LÝ NGƯỜI LIÊN HỆ (Task 3.x)
-- ----------------------------------------------------------

CREATE TABLE contacts (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED               COMMENT 'Liên kết 1-N với Khách hàng (Task 3.2)',
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(20),
    email       VARCHAR(100),
    birth_date  DATE,
    position    VARCHAR(100)               COMMENT 'Chức danh / Vị trí',
    is_primary  TINYINT(1)   NOT NULL DEFAULT 0 COMMENT 'Người liên hệ chính',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ----------------------------------------------------------
-- MODULE: QUẢN LÝ TÀI LIỆU KHO (Task 8.1)
-- ----------------------------------------------------------

CREATE TABLE documents (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(200) NOT NULL,
    file_path    VARCHAR(500) NOT NULL,
    type         VARCHAR(100)            COMMENT 'Loại tài liệu',
    version      VARCHAR(20)             COMMENT 'Phiên bản',
    release_date DATE,
    expiry_date  DATE,
    uploaded_by  INT UNSIGNED,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- ----------------------------------------------------------
-- MODULE: THƯƠNG VỤ / CƠ HỘI BÁN HÀNG (Task 2.5 - hỗ trợ)
-- ----------------------------------------------------------

CREATE TABLE deals (
    id          INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED,
    title       VARCHAR(300)  NOT NULL,
    value       DECIMAL(15,2),
    status      ENUM('open','won','lost') NOT NULL DEFAULT 'open',
    assigned_to INT UNSIGNED,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id)     ON DELETE SET NULL
) ENGINE=InnoDB;


-- ----------------------------------------------------------
-- MODULE: QUẢN LÝ BÁO GIÁ (Task 5.x)
-- ----------------------------------------------------------

-- Template mẫu Báo giá (Task 5.5)
CREATE TABLE quote_templates (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(200) NOT NULL,
    content    LONGTEXT     NOT NULL COMMENT 'Nội dung HTML/Markdown template',
    created_by INT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Báo giá (Task 5.1, 5.2)
CREATE TABLE quotes (
    id           INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
    quote_number VARCHAR(50)   NOT NULL UNIQUE COMMENT 'Số báo giá',
    customer_id  INT UNSIGNED,
    deal_id      INT UNSIGNED,
    template_id  INT UNSIGNED,
    date         DATE          NOT NULL,
    validity_date DATE                   COMMENT 'Ngày hết hiệu lực',
    status       ENUM('draft','negotiating','paused','closed','cancelled','failed')
                 NOT NULL DEFAULT 'draft'  COMMENT 'Luồng trạng thái BG (Task 5.2)',
    subtotal     DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount     DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax          DECIMAL(15,2) NOT NULL DEFAULT 0,
    total        DECIMAL(15,2) NOT NULL DEFAULT 0,
    note         TEXT,
    created_by   INT UNSIGNED,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)       ON DELETE SET NULL,
    FOREIGN KEY (deal_id)     REFERENCES deals(id)           ON DELETE SET NULL,
    FOREIGN KEY (template_id) REFERENCES quote_templates(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by)  REFERENCES users(id)           ON DELETE SET NULL
) ENGINE=InnoDB;

-- Chi tiết dòng hàng trong Báo giá
CREATE TABLE quote_items (
    id               INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
    quote_id         INT UNSIGNED  NOT NULL,
    product_id       INT UNSIGNED,
    product_name     VARCHAR(200)  NOT NULL COMMENT 'Snapshot tên SP tại thời điểm BG',
    unit_price       DECIMAL(15,2) NOT NULL DEFAULT 0,
    quantity         DECIMAL(10,2) NOT NULL DEFAULT 1,
    discount_percent DECIMAL(5,2)  NOT NULL DEFAULT 0,
    total            DECIMAL(15,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (quote_id)   REFERENCES quotes(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- ----------------------------------------------------------
-- MODULE: QUẢN LÝ HỢP ĐỒNG (Task 6.x)
-- ----------------------------------------------------------

-- Template mẫu Hợp đồng (Task 6.3)
CREATE TABLE contract_templates (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(200) NOT NULL,
    content    LONGTEXT     NOT NULL,
    created_by INT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Hợp đồng (Task 6.1, 6.2)
CREATE TABLE contracts (
    id              INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
    contract_number VARCHAR(50)   NOT NULL UNIQUE COMMENT 'Số hợp đồng',
    customer_id     INT UNSIGNED,
    quote_id        INT UNSIGNED  COMMENT 'Convert từ Báo giá (Task 5.3)',
    template_id     INT UNSIGNED,
    sign_date       DATE          COMMENT 'Ngày ký',
    expiry_date     DATE          COMMENT 'Ngày hết hạn - dùng cho widget cảnh báo (Task 6.2)',
    value           DECIMAL(15,2) NOT NULL DEFAULT 0,
    manager_id      INT UNSIGNED  COMMENT 'Người quản lý hợp đồng',
    status          ENUM('active','expired','cancelled') NOT NULL DEFAULT 'active',
    note            TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)          ON DELETE SET NULL,
    FOREIGN KEY (quote_id)    REFERENCES quotes(id)             ON DELETE SET NULL,
    FOREIGN KEY (template_id) REFERENCES contract_templates(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id)  REFERENCES users(id)              ON DELETE SET NULL
) ENGINE=InnoDB;


-- ----------------------------------------------------------
-- MODULE: QUẢN LÝ HÓA ĐƠN (Task 5.4 + Task 2.5)
-- ----------------------------------------------------------

CREATE TABLE invoices (
    id             INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50)   NOT NULL UNIQUE COMMENT 'Số hóa đơn',
    customer_id    INT UNSIGNED,
    quote_id       INT UNSIGNED  COMMENT 'Convert từ Báo giá (Task 5.4)',
    contract_id    INT UNSIGNED  COMMENT 'Liên kết Hợp đồng',
    date           DATE          NOT NULL,
    due_date       DATE          COMMENT 'Hạn thanh toán',
    subtotal       DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount       DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax            DECIMAL(15,2) NOT NULL DEFAULT 0,
    total          DECIMAL(15,2) NOT NULL DEFAULT 0,
    status         ENUM('unpaid','partial','paid','cancelled') NOT NULL DEFAULT 'unpaid',
    note           TEXT,
    created_by     INT UNSIGNED,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)  ON DELETE SET NULL,
    FOREIGN KEY (quote_id)    REFERENCES quotes(id)     ON DELETE SET NULL,
    FOREIGN KEY (contract_id) REFERENCES contracts(id)  ON DELETE SET NULL,
    FOREIGN KEY (created_by)  REFERENCES users(id)      ON DELETE SET NULL
) ENGINE=InnoDB;

-- Chi tiết dòng hàng trong Hóa đơn
CREATE TABLE invoice_items (
    id               INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
    invoice_id       INT UNSIGNED  NOT NULL,
    product_id       INT UNSIGNED,
    product_name     VARCHAR(200)  NOT NULL COMMENT 'Snapshot tên SP tại thời điểm HĐ',
    unit_price       DECIMAL(15,2) NOT NULL DEFAULT 0,
    quantity         DECIMAL(10,2) NOT NULL DEFAULT 1,
    discount_percent DECIMAL(5,2)  NOT NULL DEFAULT 0,
    total            DECIMAL(15,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)  ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)  ON DELETE SET NULL
) ENGINE=InnoDB;


-- ==========================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- ==========================================================

-- Tài khoản mặc định (password: 'Admin@123' - nhớ đổi sau)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@crm.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Thành Viên 1', 'member1@crm.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sales'),
('Thành Viên 2', 'member2@crm.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'sales'),
('Thành Viên 3', 'member3@crm.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager');

-- Nguồn Lead
INSERT INTO lead_sources (name) VALUES
('Facebook'), ('Zalo'), ('Website'), ('Referral'), ('Cold Call'), ('Hội thảo'), ('Email Marketing');

-- Danh mục sản phẩm mẫu
INSERT INTO product_categories (name, description) VALUES
('Phần mềm', 'Các sản phẩm phần mềm'),
('Dịch vụ tư vấn', 'Tư vấn triển khai và hỗ trợ'),
('Bảo trì', 'Gói bảo trì và hỗ trợ kỹ thuật');

-- Một số tỉnh thành phố lớn (63 tỉnh - thêm đủ nếu cần)
INSERT INTO provinces (name) VALUES
('Hà Nội'), ('Hồ Chí Minh'), ('Đà Nẵng'), ('Hải Phòng'), ('Cần Thơ'),
('Bình Dương'), ('Đồng Nai'), ('Long An'), ('Khánh Hòa'), ('Quảng Ninh'),
('Nghệ An'), ('Thừa Thiên Huế'), ('Lâm Đồng'), ('Bà Rịa - Vũng Tàu'), ('An Giang');

-- Nhóm bán hàng mẫu
INSERT INTO sales_groups (name, manager_id) VALUES
('Nhóm Bắc', 4),
('Nhóm Nam', 4);


-- ==========================================================
-- INDEX HỖ TRỢ TÌM KIẾM NHANH (Task 1.5, 4.1)
-- ==========================================================

-- Tìm kiếm Lead
ALTER TABLE leads
    ADD INDEX idx_leads_status       (status),
    ADD INDEX idx_leads_province     (province_id),
    ADD INDEX idx_leads_source       (source_id),
    ADD INDEX idx_leads_sales_group  (sales_group_id),
    ADD INDEX idx_leads_phone        (phone),
    ADD INDEX idx_leads_assigned     (assigned_to);

-- Tìm kiếm Khách hàng
ALTER TABLE customers
    ADD INDEX idx_customers_type     (type),
    ADD INDEX idx_customers_tier     (tier),
    ADD INDEX idx_customers_status   (status),
    ADD INDEX idx_customers_province (province_id);

-- Tìm kiếm Sản phẩm
ALTER TABLE products
    ADD INDEX idx_products_category  (category_id),
    ADD INDEX idx_products_active    (is_active);

-- Cảnh báo HĐ sắp hết hạn (Task 6.2)
ALTER TABLE contracts
    ADD INDEX idx_contracts_expiry   (expiry_date, status);

-- Hóa đơn chưa thanh toán
ALTER TABLE invoices
    ADD INDEX idx_invoices_status    (status),
    ADD INDEX idx_invoices_due       (due_date);
