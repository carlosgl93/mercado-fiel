-- Migration: Add unit_type column to productos table
-- Run this after updating the schema.prisma file

-- Add unit_type column with default value 'unit'
ALTER TABLE productos 
ADD COLUMN unit_type VARCHAR(10) DEFAULT 'unit';

-- Update existing products to have 'unit' as the default unit type
UPDATE productos 
SET unit_type = 'unit' 
WHERE unit_type IS NULL;

-- Add check constraint to ensure only valid values
ALTER TABLE productos 
ADD CONSTRAINT chk_unit_type 
CHECK (unit_type IN ('kg', 'unit'));
