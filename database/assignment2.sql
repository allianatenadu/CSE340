-- 1. Insert Tony Stark
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Update Tony's account_type to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3. Delete Tony Stark
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- 4. Update Hummer description using REPLACE
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. Join to get Sport vehicles
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Safe version: only add '/vehicles/' if it's not already in the path
UPDATE inventory
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
