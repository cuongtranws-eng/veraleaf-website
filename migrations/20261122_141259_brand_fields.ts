import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "company_information_locales" ADD COLUMN "slogan" varchar;
  ALTER TABLE "company_information_locales" ADD COLUMN "tagline" varchar;
  ALTER TABLE "_company_information_v_locales" ADD COLUMN "version_slogan" varchar;
  ALTER TABLE "_company_information_v_locales" ADD COLUMN "version_tagline" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "company_information_locales" DROP COLUMN "slogan";
  ALTER TABLE "company_information_locales" DROP COLUMN "tagline";
  ALTER TABLE "_company_information_v_locales" DROP COLUMN "version_slogan";
  ALTER TABLE "_company_information_v_locales" DROP COLUMN "version_tagline";`)
}
