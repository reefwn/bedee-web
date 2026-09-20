import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_faq_variant" AS ENUM('plain', 'tinted');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_variant" AS ENUM('plain', 'tinted');
  ALTER TABLE "pages_blocks_faq" ADD COLUMN "variant" "enum_pages_blocks_faq_variant" DEFAULT 'plain';
  ALTER TABLE "_pages_v_blocks_faq" ADD COLUMN "variant" "enum__pages_v_blocks_faq_variant" DEFAULT 'plain';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_faq" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_faq" DROP COLUMN "variant";
  DROP TYPE "public"."enum_pages_blocks_faq_variant";
  DROP TYPE "public"."enum__pages_v_blocks_faq_variant";`)
}
