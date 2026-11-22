import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "company_information" ADD COLUMN "phone2" varchar;
  ALTER TABLE "_company_information_v" ADD COLUMN "version_phone2" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "company_information" DROP COLUMN "phone2";
  ALTER TABLE "_company_information_v" DROP COLUMN "version_phone2";`)
}
