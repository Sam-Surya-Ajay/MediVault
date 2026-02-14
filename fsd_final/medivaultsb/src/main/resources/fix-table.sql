-- Drop the table if it exists
DROP TABLE IF EXISTS medical_records CASCADE;

-- Create the table with proper column types
CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    title VARCHAR(255),
    doctor_name VARCHAR(255),
    record_type VARCHAR(100),
    description VARCHAR(1000),
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_data BYTEA NOT NULL,
    uploaded_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES users(id)
); 