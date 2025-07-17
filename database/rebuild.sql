-- STEP 1: Create account_type enum
-- DROP TYPE IF EXISTS public.account_type;
CREATE TYPE public.account_type AS ENUM
    ('Client', 'Employee', 'Admin');

ALTER TYPE public.account_type
    OWNER TO cse340;

-- STEP 2: Create classification table
CREATE TABLE IF NOT EXISTS public.classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name character varying NOT NULL
);

-- STEP 3: Create inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make character varying NOT NULL,
    inv_model character varying NOT NULL,
    inv_year integer NOT NULL,
    inv_description character varying NOT NULL,
    inv_image character varying NOT NULL,
    inv_thumbnail character varying NOT NULL,
    classification_id integer NOT NULL
);

-- STEP 4: Create relationship between inventory and classification
ALTER TABLE public.inventory
ADD CONSTRAINT fk_classification
FOREIGN KEY (classification_id)
REFERENCES public.classification (classification_id);

-- STEP 5: Create account table
CREATE TABLE IF NOT EXISTS public.account (
    account_id SERIAL PRIMARY KEY,
    account_firstname character varying NOT NULL,
    account_lastname character varying NOT NULL,
    account_email character varying NOT NULL,
    account_password character varying NOT NULL,
    account_type public.account_type NOT NULL DEFAULT 'Client'::account_type
);

-- STEP 6: Insert classification data (example values)
INSERT INTO public.classification (classification_name)
VALUES ('Sedan'), ('SUV'), ('Truck'), ('Sport'), ('Utility');

-- STEP 7: Insert sample inventory data
INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, classification_id)
VALUES
('GM', 'Hummer', 2016, 'Do you have 6 kids and like to go offroading? The Hummer gives you the small interiors with an engine to get you out of any muddy or rocky situation.', '/images/hummer.jpg', '/images/hummer-tn.jpg', 2),
('Ford', 'F-150', 2020, 'Best-selling truck in America.', '/images/f150.jpg', '/images/f150-tn.jpg', 3),
('Chevy', 'Camaro', 2022, 'Fast and stylish.', '/images/camaro.jpg', '/images/camaro-tn.jpg', 4);

-- STEP 8: QUERY 4 from assignment2.sql — Update Hummer description
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- STEP 9: QUERY 6 from assignment2.sql — Update image paths
UPDATE public.inventory
SET inv_image = CASE
    WHEN inv_image NOT LIKE '%/vehicles/%'
    THEN REPLACE(inv_image, '/images/', '/images/vehicles/')
    ELSE inv_image
END,
inv_thumbnail = CASE
    WHEN inv_thumbnail NOT LIKE '%/vehicles/%'
    THEN REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
    ELSE inv_thumbnail
END;
