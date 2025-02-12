/*
  # Add sample VIN data
  
  1. Changes
    - Add sample data for vinmake, vinmodel, and vinstyle tables
    - Includes common manufacturers and models
    
  2. Notes
    - Uses real VIN codes for accuracy
    - Includes recent model years
*/

-- Insert sample manufacturers
INSERT INTO vinmake (make_code, make_name) VALUES
  ('1FA', 'Ford'),
  ('1G1', 'Chevrolet'),
  ('1HD', 'Harley-Davidson'),
  ('1HG', 'Honda'),
  ('1N4', 'Nissan'),
  ('1VW', 'Volkswagen'),
  ('2T1', 'Toyota'),
  ('3MW', 'BMW'),
  ('4S3', 'Subaru'),
  ('5YJ', 'Tesla'),
  ('JH4', 'Acura'),
  ('JM1', 'Mazda'),
  ('JN1', 'Infiniti'),
  ('KL4', 'Buick'),
  ('WAU', 'Audi'),
  ('WBA', 'BMW'),
  ('WDC', 'Mercedes-Benz')
ON CONFLICT (make_code) DO NOTHING;

-- Insert sample models for Ford
WITH ford AS (SELECT id FROM vinmake WHERE make_code = '1FA')
INSERT INTO vinmodel (make_id, model_code, model_name) 
SELECT ford.id, code, name FROM ford, (VALUES
  ('P8C', 'Mustang'),
  ('P8E', 'Explorer'),
  ('P8F', 'F-150'),
  ('P8T', 'Transit'),
  ('P8S', 'Escape')
) AS models(code, name)
ON CONFLICT (make_id, model_code) DO NOTHING;

-- Insert sample models for Toyota
WITH toyota AS (SELECT id FROM vinmake WHERE make_code = '2T1')
INSERT INTO vinmodel (make_id, model_code, model_name)
SELECT toyota.id, code, name FROM toyota, (VALUES
  ('BR', 'Camry'),
  ('BU', 'Corolla'),
  ('BV', 'RAV4'),
  ('BH', 'Highlander'),
  ('BT', 'Tacoma')
) AS models(code, name)
ON CONFLICT (make_id, model_code) DO NOTHING;

-- Insert sample styles for Mustang
WITH mustang AS (
  SELECT vm.id 
  FROM vinmodel vm 
  JOIN vinmake mk ON vm.make_id = mk.id 
  WHERE mk.make_code = '1FA' AND vm.model_code = 'P8C'
)
INSERT INTO vinstyle (model_id, style_code, style_name, body_type, engine, transmission)
SELECT mustang.id, code, name, body, engine, trans
FROM mustang, (VALUES
  ('GT', 'GT Premium', 'Coupe', '5.0L V8', '6-speed manual'),
  ('EC', 'EcoBoost', 'Coupe', '2.3L I4 Turbo', '10-speed automatic'),
  ('CV', 'GT Convertible', 'Convertible', '5.0L V8', '10-speed automatic'),
  ('SH', 'Shelby GT500', 'Coupe', '5.2L V8 Supercharged', '7-speed dual-clutch')
) AS styles(code, name, body, engine, trans)
ON CONFLICT (model_id, style_code) DO NOTHING;