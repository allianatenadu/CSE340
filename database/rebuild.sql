-- ==========================================
-- COMPLETE CSE MOTORS DATABASE REBUILD
-- Run this entire script in pgAdmin4
-- ==========================================

-- Step 1: Clean slate - Drop all existing tables and types
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.classification CASCADE;
DROP TABLE IF EXISTS public.account CASCADE;
DROP TYPE IF EXISTS public.account_type CASCADE;

-- Step 2: Create account_type enum
CREATE TYPE public.account_type AS ENUM
    ('Client', 'Employee', 'Admin');

ALTER TYPE public.account_type
    OWNER TO cse340;

-- Step 3: Create classification table
CREATE TABLE IF NOT EXISTS public.classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name character varying NOT NULL
);

-- Step 4: Create inventory table with ALL required columns
CREATE TABLE IF NOT EXISTS public.inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make character varying NOT NULL,
    inv_model character varying NOT NULL,
    inv_year integer NOT NULL,
    inv_description character varying NOT NULL,
    inv_image character varying NOT NULL,
    inv_thumbnail character varying NOT NULL,
    inv_price DECIMAL(10,2) NOT NULL,
    inv_miles INTEGER NOT NULL,
    inv_color character varying NOT NULL,
    classification_id integer NOT NULL
);

-- Step 5: Create relationship between inventory and classification
ALTER TABLE public.inventory
ADD CONSTRAINT fk_classification
FOREIGN KEY (classification_id)
REFERENCES public.classification (classification_id);

-- Step 6: Create account table
CREATE TABLE IF NOT EXISTS public.account (
    account_id SERIAL PRIMARY KEY,
    account_firstname character varying NOT NULL,
    account_lastname character varying NOT NULL,
    account_email character varying NOT NULL,
    account_password character varying NOT NULL,
    account_type public.account_type NOT NULL DEFAULT 'Client'::account_type
);

-- Step 7: Insert classification data
INSERT INTO public.classification (classification_name)
VALUES  
    ('Custom'),
    ('Sedan'), 
    ('SUV'), 
    ('Truck'), 
    ('Sport');

-- Step 8: Insert complete inventory data with ALL available vehicles
INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
VALUES
-- Custom vehicles (classification_id = 1)
('Ford', 'Model T', 1908, 'The Ford Model T, colloquially known as the "Tin Lizzie," was the first mass-produced car that middle-class Americans could afford.', '/images/vehicles/model-t.jpg', '/images/vehicles/model-t-tn.jpg', 30000, 26000, 'Black', 1),
('Chevrolet', 'Mystery Machine', 1972, 'Groovy! This psychedelic van is perfect for mystery solving adventures. Complete with flower power paint job and room for the whole gang.', '/images/vehicles/mystery-van.jpg', '/images/vehicles/mystery-van-tn.jpg', 42000, 78000, 'Blue', 1),
('Lamborghini', 'Aventador', 2019, 'Luxury supercar with breathtaking performance. This beast delivers an unforgettable driving experience with its powerful V12 engine.', '/images/vehicles/adventador.jpg', '/images/vehicles/adventador-tn.jpg', 397500, 2100, 'White', 1),
('Aerocar', 'Sky', 1963, 'The only road-legal flying car ever produced in series. Street legal and airworthy, this vehicle transitions from street to sky with its 150 hp Lycoming engine.', '/images/vehicles/aerocar.jpg', '/images/vehicles/aerocar-tn.jpg', 1395000, 2940, 'Yellow', 1),
('Batmobile', 'Custom', 1989, 'Ever want to be a superhero? Now you can with the only replica Batmobile from the 1989 movie. Guaranteed to turn heads wherever you go.', '/images/vehicles/batmobile.jpg', '/images/vehicles/batmobile-tn.jpg', 65000, 29, 'Black', 1),
('DeLorean', 'DMC-12', 1981, 'The iconic time machine from Back to the Future! Stainless steel body and gullwing doors make this car truly unique.', '/images/vehicles/delorean.jpg', '/images/vehicles/delorean-tn.jpg', 65000, 35420, 'Silver', 1),
('Nissan', 'Micra', 2018, 'Compact and efficient city car with unique styling. Perfect for urban adventures and tight parking spaces.', '/images/vehicles/micra.jpg', '/images/vehicles/micra.jpg', 18500, 15200, 'White', 1),

-- Sedan vehicles (classification_id = 2)
('Ford', 'Crown Victoria', 2008, 'One of the most popular police cars of all time. Reliable, spacious, and tough. Perfect for those who want a commanding presence on the road.', '/images/vehicles/crwn-vic.jpg', '/images/vehicles/crwn-vic-tn.jpg', 15000, 138000, 'White', 2),

-- SUV vehicles (classification_id = 3)  
('Hummer', 'H3', 2009, 'Do you have 6 kids and like to go offroading? The Hummer gives you a huge interior with an engine to get you out of any muddy or rocky situation.', '/images/vehicles/hummer.jpg', '/images/vehicles/hummer-tn.jpg', 41000, 58000, 'Silver', 3),
('Jeep', 'Wrangler', 2019, 'The Jeep Wrangler is an uncompromising vehicle. It is true to its original design and of capability delivered to explore new roads and territories.', '/images/vehicles/wrangler.jpg', '/images/vehicles/wrangler-tn.jpg', 28045, 41205, 'Yellow', 3),
('Dodge', 'Ram Van', 1986, 'Reliable work van perfect for contractors, delivery services, or converting into the ultimate road trip vehicle.', '/images/vehicles/ram-van.jpg', '/images/vehicles/ram-van.jpg', 18500, 156000, 'Brown', 3),
('Cadillac', 'Escalade', 2019, 'This stylin car is great for any occasion from going to the beach to meeting the president. The luxurious inside makes this car a home away from home.', '/images/vehicles/escalade.jpg', '/images/vehicles/escalade-tn.jpg', 75195, 41958, 'Black', 3),

-- Truck vehicles (classification_id = 4)
('Ford', 'Ranchero', 1970, 'The classic car-truck hybrid. Perfect blend of style and utility. Great for hauling and cruising in equal measure.', '/images/vehicles/ranchero.jpg', '/images/vehicles/ranchero.jpg', 28000, 85000, 'Rust', 4),
('Ford', 'Big Foot', 1987, 'The ultimate monster truck! Crush cars and conquer any terrain with this massive 4x4 beast. Not street legal but tons of fun!', '/images/vehicles/bigfoot.jpg', '/images/vehicles/bigfoot.jpg', 75000, 45000, 'Blue', 4),
('Emergency', 'Fire Truck', 1995, 'Authentic fire department vehicle. Fully equipped for emergency response. Perfect for collectors or emergency services.', '/images/vehicles/fire-truck.jpg', '/images/vehicles/fire-truck-tn.jpg', 45000, 120000, 'Red', 4),

-- Sport vehicles (classification_id = 5)
('Chevrolet', 'Camaro', 2018, 'If you want to look cool, this is the car you need! Two seater, open-air, go-cart fun! Fast and stylish with modern performance.', '/images/vehicles/camaro.jpg', '/images/vehicles/camaro-tn.jpg', 45000, 8500, 'Black', 5);

-- Step 9: Insert required test accounts with plain text passwords
-- These will be automatically hashed on first login by the flexible login function
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type)
VALUES
    ('Basic', 'Client', 'basic@340.edu', 'I@mABas1cCl!3nt', 'Client'),
    ('Happy', 'Employee', 'happy@340.edu', 'I@mAnEmpl0y33', 'Client'),
    ('Manager', 'User', 'manager@340.edu', 'I@mAnAdm!n1strat0r', 'Client');

-- Step 10: Alternative - Insert with plain text passwords (will be hashed on first login)
-- Uncomment these lines if you prefer to use plain text passwords initially
-- INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type)
-- VALUES
--     ('Basic', 'Client', 'basic@340.edu', 'I@mABas1cCl!3nt', 'Client'),
--     ('Happy', 'Employee', 'happy@340.edu', 'I@mAnEmpl0y33', 'Employee'),
--     ('Manager', 'User', 'manager@340.edu', 'I@mAnAdm!n1strat0r', 'Admin');

-- Step 11: Update existing accounts to correct types (if accounts already exist)
-- Run these only if you already have the accounts and need to update their types
UPDATE public.account 
SET account_type = 'Employee' 
WHERE account_email = 'happy@340.edu';

UPDATE public.account 
SET account_type = 'Admin' 
WHERE account_email = 'manager@340.edu';

-- Step 12: Verification queries
SELECT '=== DATABASE REBUILD COMPLETE ===' as status;

SELECT 'Classifications created:' as info;
SELECT * FROM public.classification ORDER BY classification_id;

SELECT 'Inventory by classification:' as info;
SELECT 
    c.classification_name,
    COUNT(i.inv_id) as vehicle_count,
    STRING_AGG(i.inv_make || ' ' || i.inv_model, ', ' ORDER BY i.inv_make, i.inv_model) as vehicles
FROM public.classification c
LEFT JOIN public.inventory i ON c.classification_id = i.classification_id
GROUP BY c.classification_id, c.classification_name
ORDER BY c.classification_id;

SELECT 'All inventory records:' as info;
SELECT inv_id, inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, classification_id 
FROM public.inventory 
ORDER BY classification_id, inv_id;

SELECT 'Test accounts created:' as info;
SELECT account_id, account_firstname, account_lastname, account_email, account_type 
FROM public.account 
ORDER BY account_type, account_email;

SELECT 'Account types summary:' as info;
SELECT account_type, COUNT(*) as count 
FROM public.account 
GROUP BY account_type 
ORDER BY account_type;

SELECT 'Checking for any problematic image references:' as info;
SELECT COUNT(*) as f150_count FROM public.inventory WHERE inv_image LIKE '%f150%' OR inv_thumbnail LIKE '%f150%';

SELECT '=== READY FOR TESTING ===' as final_status;

-- Step 13: Quick test account creation script (alternative approach)
-- If you want to create the test accounts manually later, use these commands:
/*
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type)
VALUES
    ('Basic', 'Client', 'basic@340.edu', 'I@mABas1cCl!3nt', 'Client'),
    ('Happy', 'Employee', 'happy@340.edu', 'I@mAnEmpl0y33', 'Employee'), 
    ('Manager', 'User', 'manager@340.edu', 'I@mAnAdm!n1strat0r', 'Admin');
*/