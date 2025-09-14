# GovTracking Personal System

A personal tracking system to manage **Bus**, **PCN**, and **SWDI** records with automated timestamps and CSV imports.

## 1. Auto-update `updatedAt` Column

Ensure that every time a record is updated, the `updatedAt` column updates automatically.

```sql
-- Bus
ALTER TABLE "Bus"
ALTER COLUMN "updatedAt" SET DEFAULT now();

CREATE OR REPLACE FUNCTION update_bus_updatedAt_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bus_updatedAt
BEFORE UPDATE ON "Bus"
FOR EACH ROW
EXECUTE FUNCTION update_bus_updatedAt_column();

-- PCN
ALTER TABLE "PCN"
ALTER COLUMN "updatedAt" SET DEFAULT now();

CREATE OR REPLACE FUNCTION update_pcn_updatedAt_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pcn_updatedAt
BEFORE UPDATE ON "PCN"
FOR EACH ROW
EXECUTE FUNCTION update_pcn_updatedAt_column();

-- SWDI
ALTER TABLE "SWDI"
ALTER COLUMN "updatedAt" SET DEFAULT now();

CREATE OR REPLACE FUNCTION update_swdi_updatedAt_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_swdi_updatedAt
BEFORE UPDATE ON "SWDI"
FOR EACH ROW
EXECUTE FUNCTION update_swdi_updatedAt_column();
2. Import CSV Files
Ensure your CSV files have the correct headers and are saved locally.

sql
Copy code
-- SWDI
COPY "Swdi"("hhId", "grantee", "swdiScore", "encoded", "issue", "date", "userId", "username")
FROM 'C:/Users/herna/Desktop/ACCOMPLISHMENTSWDI.csv'
DELIMITER ','
CSV HEADER
QUOTE '"'
ENCODING 'WIN1252';

-- PCN
COPY "Pcn"("hhId", "grantee", "pcn", "tr", "encoded", "issue", "date", "userId", "username")
FROM 'C:/Users/herna/Desktop/ACCOMPLISHMENTPCN.csv'
DELIMITER ','
CSV HEADER
QUOTE '"'
ENCODING 'UTF8';

-- Bus
COPY "Bus"("lgu", "barangay", "hhId", "granteeName", "typeOfUpdate", "encoded", "issue", "subjectOfChange", "date", "userId", "username")
FROM 'C:/Users/herna/Desktop/ACCOMPLISHMENTBUS.csv'
DELIMITER ','
CSV HEADER
QUOTE '"'
ENCODING 'WIN1252';
3. Log Uploaded Documents
Insert imported data into the EncodedDocument table for tracking.

sql
Copy code
-- SWDI
INSERT INTO "EncodedDocument" ("hhId", "name", "documentType", "documentId", "encoded", "userId", "username", "date")
SELECT "hhId", "grantee", 'SWDI', "id", "encoded", "userId", "username", "date"
FROM "Swdi";

-- PCN
INSERT INTO "EncodedDocument" ("hhId", "name", "documentType", "documentId", "encoded", "userId", "username", "date")
SELECT "hhId", "grantee", 'PCN', "id", "encoded", "userId", "username", "date"
FROM "Pcn";

-- Bus
INSERT INTO "EncodedDocument" ("hhId", "name", "documentType", "documentId", "encoded", "userId", "username", "date")
SELECT "hhId", "granteeName", 'BUS', "id", "encoded", "userId", "username", "date"
FROM "Bus";
4. Usage Guide
Run the SQL script to create triggers for auto-updating updatedAt.

Place your CSV files in a local directory.

Use the COPY commands to import data into SWDI, PCN, and Bus tables.

Insert records into EncodedDocument for a centralized log.

pgsql
Copy code

You can copy and paste this directly into your `README.md` file. If you need further assistance or modifications, feel free to ask!
::contentReference[oaicite:0]{index=0}