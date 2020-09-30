export const up = (knex) =>
  knex.raw(`
      CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
      LANGUAGE plpgsql
      AS
      $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$;
  `);

export const down = (knex) =>
  knex.raw(`
    DROP FUNCTION IF EXISTS update_timestamp() CASCADE;
  `);
