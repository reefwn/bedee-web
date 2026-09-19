import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_hero_carousel_slides_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_carousel_slides_floating_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"label" varchar,
  	"sublabel" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_carousel_slides_checklist_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_carousel_slides_floating_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"label" varchar,
  	"sublabel" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_hero_carousel_slides" ADD COLUMN "badge_label" varchar;
  ALTER TABLE "pages_blocks_hero_carousel_slides" ADD COLUMN "secondary_cta_label" varchar;
  ALTER TABLE "pages_blocks_hero_carousel_slides" ADD COLUMN "secondary_cta_url" varchar;
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides" ADD COLUMN "badge_label" varchar;
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides" ADD COLUMN "secondary_cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides" ADD COLUMN "secondary_cta_url" varchar;
  ALTER TABLE "pages_blocks_hero_carousel_slides_checklist_items" ADD CONSTRAINT "pages_blocks_hero_carousel_slides_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_carousel_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_carousel_slides_floating_cards" ADD CONSTRAINT "pages_blocks_hero_carousel_slides_floating_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_carousel_slides_floating_cards" ADD CONSTRAINT "pages_blocks_hero_carousel_slides_floating_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_carousel_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides_checklist_items" ADD CONSTRAINT "_pages_v_blocks_hero_carousel_slides_checklist_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_carousel_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides_floating_cards" ADD CONSTRAINT "_pages_v_blocks_hero_carousel_slides_floating_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides_floating_cards" ADD CONSTRAINT "_pages_v_blocks_hero_carousel_slides_floating_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_carousel_slides"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_carousel_slides_checklist_items_order_idx" ON "pages_blocks_hero_carousel_slides_checklist_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_carousel_slides_checklist_items_parent_id_idx" ON "pages_blocks_hero_carousel_slides_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_carousel_slides_checklist_items_locale_idx" ON "pages_blocks_hero_carousel_slides_checklist_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_carousel_slides_floating_cards_order_idx" ON "pages_blocks_hero_carousel_slides_floating_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_carousel_slides_floating_cards_parent_id_idx" ON "pages_blocks_hero_carousel_slides_floating_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_carousel_slides_floating_cards_locale_idx" ON "pages_blocks_hero_carousel_slides_floating_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_hero_carousel_slides_floating_cards_icon_idx" ON "pages_blocks_hero_carousel_slides_floating_cards" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_slides_checklist_items_order_idx" ON "_pages_v_blocks_hero_carousel_slides_checklist_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_carousel_slides_checklist_items_parent_id_idx" ON "_pages_v_blocks_hero_carousel_slides_checklist_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_slides_checklist_items_locale_idx" ON "_pages_v_blocks_hero_carousel_slides_checklist_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_carousel_slides_floating_cards_order_idx" ON "_pages_v_blocks_hero_carousel_slides_floating_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_carousel_slides_floating_cards_parent_id_idx" ON "_pages_v_blocks_hero_carousel_slides_floating_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_carousel_slides_floating_cards_locale_idx" ON "_pages_v_blocks_hero_carousel_slides_floating_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_hero_carousel_slides_floating_cards_icon_idx" ON "_pages_v_blocks_hero_carousel_slides_floating_cards" USING btree ("icon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_carousel_slides_checklist_items" CASCADE;
  DROP TABLE "pages_blocks_hero_carousel_slides_floating_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_carousel_slides_checklist_items" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_carousel_slides_floating_cards" CASCADE;
  ALTER TABLE "pages_blocks_hero_carousel_slides" DROP COLUMN "badge_label";
  ALTER TABLE "pages_blocks_hero_carousel_slides" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "pages_blocks_hero_carousel_slides" DROP COLUMN "secondary_cta_url";
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides" DROP COLUMN "badge_label";
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides" DROP COLUMN "secondary_cta_label";
  ALTER TABLE "_pages_v_blocks_hero_carousel_slides" DROP COLUMN "secondary_cta_url";`)
}
