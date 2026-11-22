import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_expertise_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__expertise_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__expertise_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_projects_project_status" AS ENUM('ongoing', 'completed');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_project_status" AS ENUM('ongoing', 'completed');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_insights_category" AS ENUM('news', 'articles');
  CREATE TYPE "public"."enum_insights_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__insights_v_version_category" AS ENUM('news', 'articles');
  CREATE TYPE "public"."enum__insights_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__insights_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_publications_publication_type" AS ENUM('report', 'article', 'book', 'brief', 'conference');
  CREATE TYPE "public"."enum_publications_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__publications_v_version_publication_type" AS ENUM('report', 'article', 'book', 'brief', 'conference');
  CREATE TYPE "public"."enum__publications_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__publications_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_partners_partner_type" AS ENUM('client', 'partner', 'donor', 'research', 'government');
  CREATE TYPE "public"."enum_partners_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_version_partner_type" AS ENUM('client', 'partner', 'donor', 'research', 'government');
  CREATE TYPE "public"."enum__partners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_consultants_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__consultants_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__consultants_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_organization_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__organization_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__organization_v_published_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'in-progress', 'replied', 'archived', 'spam');
  CREATE TYPE "public"."enum_contact_messages_locale" AS ENUM('vi', 'en');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_company_information_social_links_platform" AS ENUM('facebook', 'linkedin', 'youtube', 'zalo', 'x', 'website');
  CREATE TYPE "public"."enum__company_information_v_version_social_links_platform" AS ENUM('facebook', 'linkedin', 'youtube', 'zalo', 'x', 'website');
  CREATE TABLE "expertise" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"image_id" integer,
  	"order" numeric DEFAULT 100,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_expertise_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "expertise_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_expertise_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_image_id" integer,
  	"version_order" numeric DEFAULT 100,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__expertise_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__expertise_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_expertise_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"project_status" "enum_projects_project_status" DEFAULT 'ongoing',
  	"featured_image_id" integer,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"content" jsonb,
  	"location" varchar,
  	"client" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"expertise_id" integer,
  	"consultants_id" integer,
  	"partners_id" integer
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_project_status" "enum__projects_v_version_project_status" DEFAULT 'ongoing',
  	"version_featured_image_id" integer,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_featured" boolean DEFAULT false,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_content" jsonb,
  	"version_location" varchar,
  	"version_client" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"expertise_id" integer,
  	"consultants_id" integer,
  	"partners_id" integer
  );
  
  CREATE TABLE "insights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category" "enum_insights_category" DEFAULT 'news',
  	"published_at" timestamp(3) with time zone,
  	"cover_image_id" integer,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_insights_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "insights_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "insights_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"consultants_id" integer,
  	"expertise_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "_insights_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category" "enum__insights_v_version_category" DEFAULT 'news',
  	"version_published_at" timestamp(3) with time zone,
  	"version_cover_image_id" integer,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__insights_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__insights_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_insights_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_insights_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"consultants_id" integer,
  	"expertise_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "publications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"publication_type" "enum_publications_publication_type" DEFAULT 'report',
  	"year" numeric,
  	"external_authors" varchar,
  	"doi" varchar,
  	"external_url" varchar,
  	"file_id" integer,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_publications_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "publications_locales" (
  	"title" varchar,
  	"abstract" varchar,
  	"publisher" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "publications_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"consultants_id" integer,
  	"expertise_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "_publications_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_publication_type" "enum__publications_v_version_publication_type" DEFAULT 'report',
  	"version_year" numeric,
  	"version_external_authors" varchar,
  	"version_doi" varchar,
  	"version_external_url" varchar,
  	"version_file_id" integer,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__publications_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__publications_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_publications_v_locales" (
  	"version_title" varchar,
  	"version_abstract" varchar,
  	"version_publisher" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_publications_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"consultants_id" integer,
  	"expertise_id" integer,
  	"projects_id" integer
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"partner_type" "enum_partners_partner_type" DEFAULT 'partner',
  	"logo_id" integer,
  	"website" varchar,
  	"approved_for_public_display" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_partners_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "partners_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_partners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_partner_type" "enum__partners_v_version_partner_type" DEFAULT 'partner',
  	"version_logo_id" integer,
  	"version_website" varchar,
  	"version_approved_for_public_display" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 100,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__partners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__partners_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_partners_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "consultants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"photo_id" integer,
  	"organization_unit_id" integer,
  	"email" varchar,
  	"show_email" boolean DEFAULT false,
  	"order" numeric DEFAULT 100,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_consultants_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "consultants_locales" (
  	"honorific" varchar,
  	"position" varchar,
  	"summary" varchar,
  	"biography" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "consultants_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"expertise_id" integer
  );
  
  CREATE TABLE "_consultants_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_photo_id" integer,
  	"version_organization_unit_id" integer,
  	"version_email" varchar,
  	"version_show_email" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 100,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__consultants_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__consultants_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_consultants_v_locales" (
  	"version_honorific" varchar,
  	"version_position" varchar,
  	"version_summary" varchar,
  	"version_biography" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_consultants_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"expertise_id" integer
  );
  
  CREATE TABLE "organization" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"head_id" integer,
  	"order" numeric DEFAULT 100,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_organization_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "organization_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_organization_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_parent_id" integer,
  	"version_head_id" integer,
  	"version_order" numeric DEFAULT 100,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__organization_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__organization_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_organization_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_contact_messages_status" DEFAULT 'new' NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"organization" varchar,
  	"phone" varchar,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"locale" "enum_contact_messages_locale",
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"expertise_id" integer,
  	"projects_id" integer,
  	"insights_id" integer,
  	"publications_id" integer,
  	"partners_id" integer,
  	"media_id" integer,
  	"consultants_id" integer,
  	"organization_id" integer,
  	"contact_messages_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "company_information_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_company_information_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "company_information" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tax_code" varchar,
  	"founded_year" numeric,
  	"email" varchar,
  	"phone" varchar,
  	"map_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "company_information_locales" (
  	"company_name" varchar DEFAULT 'Veraleaf' NOT NULL,
  	"legal_name" varchar,
  	"about_text" varchar,
  	"philosophy_text" varchar,
  	"mission" varchar,
  	"vision" varchar,
  	"general_information" jsonb,
  	"organization_note" varchar,
  	"address" varchar,
  	"office_hours" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_company_information_v_version_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__company_information_v_version_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_company_information_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_tax_code" varchar,
  	"version_founded_year" numeric,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_map_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_company_information_v_locales" (
  	"version_company_name" varchar DEFAULT 'Veraleaf' NOT NULL,
  	"version_legal_name" varchar,
  	"version_about_text" varchar,
  	"version_philosophy_text" varchar,
  	"version_mission" varchar,
  	"version_vision" varchar,
  	"version_general_information" jsonb,
  	"version_organization_note" varchar,
  	"version_address" varchar,
  	"version_office_hours" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "expertise" ADD CONSTRAINT "expertise_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "expertise_locales" ADD CONSTRAINT "expertise_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_expertise_v" ADD CONSTRAINT "_expertise_v_parent_id_expertise_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."expertise"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_expertise_v" ADD CONSTRAINT "_expertise_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_expertise_v_locales" ADD CONSTRAINT "_expertise_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_expertise_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_expertise_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_consultants_fk" FOREIGN KEY ("consultants_id") REFERENCES "public"."consultants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_expertise_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_consultants_fk" FOREIGN KEY ("consultants_id") REFERENCES "public"."consultants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights_locales" ADD CONSTRAINT "insights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights_rels" ADD CONSTRAINT "insights_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights_rels" ADD CONSTRAINT "insights_rels_consultants_fk" FOREIGN KEY ("consultants_id") REFERENCES "public"."consultants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights_rels" ADD CONSTRAINT "insights_rels_expertise_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "insights_rels" ADD CONSTRAINT "insights_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_parent_id_insights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."insights"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v_locales" ADD CONSTRAINT "_insights_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_insights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v_rels" ADD CONSTRAINT "_insights_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_insights_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v_rels" ADD CONSTRAINT "_insights_v_rels_consultants_fk" FOREIGN KEY ("consultants_id") REFERENCES "public"."consultants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v_rels" ADD CONSTRAINT "_insights_v_rels_expertise_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_insights_v_rels" ADD CONSTRAINT "_insights_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications" ADD CONSTRAINT "publications_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publications_locales" ADD CONSTRAINT "publications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_consultants_fk" FOREIGN KEY ("consultants_id") REFERENCES "public"."consultants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_expertise_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "publications_rels" ADD CONSTRAINT "publications_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_parent_id_publications_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."publications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v_locales" ADD CONSTRAINT "_publications_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_publications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_publications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_consultants_fk" FOREIGN KEY ("consultants_id") REFERENCES "public"."consultants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_expertise_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_publications_v_rels" ADD CONSTRAINT "_publications_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_locales" ADD CONSTRAINT "partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_parent_id_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v_locales" ADD CONSTRAINT "_partners_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "consultants" ADD CONSTRAINT "consultants_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultants" ADD CONSTRAINT "consultants_organization_unit_id_organization_id_fk" FOREIGN KEY ("organization_unit_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultants_locales" ADD CONSTRAINT "consultants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."consultants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "consultants_rels" ADD CONSTRAINT "consultants_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."consultants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "consultants_rels" ADD CONSTRAINT "consultants_rels_expertise_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_consultants_v" ADD CONSTRAINT "_consultants_v_parent_id_consultants_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."consultants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_consultants_v" ADD CONSTRAINT "_consultants_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_consultants_v" ADD CONSTRAINT "_consultants_v_version_organization_unit_id_organization_id_fk" FOREIGN KEY ("version_organization_unit_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_consultants_v_locales" ADD CONSTRAINT "_consultants_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_consultants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_consultants_v_rels" ADD CONSTRAINT "_consultants_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_consultants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_consultants_v_rels" ADD CONSTRAINT "_consultants_v_rels_expertise_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organization" ADD CONSTRAINT "organization_parent_id_organization_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organization" ADD CONSTRAINT "organization_head_id_consultants_id_fk" FOREIGN KEY ("head_id") REFERENCES "public"."consultants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organization_locales" ADD CONSTRAINT "organization_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_organization_v" ADD CONSTRAINT "_organization_v_parent_id_organization_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organization_v" ADD CONSTRAINT "_organization_v_version_parent_id_organization_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organization_v" ADD CONSTRAINT "_organization_v_version_head_id_consultants_id_fk" FOREIGN KEY ("version_head_id") REFERENCES "public"."consultants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_organization_v_locales" ADD CONSTRAINT "_organization_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_organization_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_expertise_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_publications_fk" FOREIGN KEY ("publications_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultants_fk" FOREIGN KEY ("consultants_id") REFERENCES "public"."consultants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organization_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_information_social_links" ADD CONSTRAINT "company_information_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_information"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company_information_locales" ADD CONSTRAINT "company_information_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_information"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_information_v_version_social_links" ADD CONSTRAINT "_company_information_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_information_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_company_information_v_locales" ADD CONSTRAINT "_company_information_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_company_information_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "expertise_slug_idx" ON "expertise" USING btree ("slug");
  CREATE INDEX "expertise_image_idx" ON "expertise" USING btree ("image_id");
  CREATE INDEX "expertise_archived_idx" ON "expertise" USING btree ("archived");
  CREATE INDEX "expertise_updated_at_idx" ON "expertise" USING btree ("updated_at");
  CREATE INDEX "expertise_created_at_idx" ON "expertise" USING btree ("created_at");
  CREATE INDEX "expertise__status_idx" ON "expertise" USING btree ("_status");
  CREATE UNIQUE INDEX "expertise_locales_locale_parent_id_unique" ON "expertise_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "expertise_locales_parent_id_idx" ON "expertise_locales" USING btree ("_parent_id");
  CREATE INDEX "_expertise_v_parent_idx" ON "_expertise_v" USING btree ("parent_id");
  CREATE INDEX "_expertise_v_version_version_slug_idx" ON "_expertise_v" USING btree ("version_slug");
  CREATE INDEX "_expertise_v_version_version_image_idx" ON "_expertise_v" USING btree ("version_image_id");
  CREATE INDEX "_expertise_v_version_version_archived_idx" ON "_expertise_v" USING btree ("version_archived");
  CREATE INDEX "_expertise_v_version_version_updated_at_idx" ON "_expertise_v" USING btree ("version_updated_at");
  CREATE INDEX "_expertise_v_version_version_created_at_idx" ON "_expertise_v" USING btree ("version_created_at");
  CREATE INDEX "_expertise_v_version_version__status_idx" ON "_expertise_v" USING btree ("version__status");
  CREATE INDEX "_expertise_v_created_at_idx" ON "_expertise_v" USING btree ("created_at");
  CREATE INDEX "_expertise_v_updated_at_idx" ON "_expertise_v" USING btree ("updated_at");
  CREATE INDEX "_expertise_v_snapshot_idx" ON "_expertise_v" USING btree ("snapshot");
  CREATE INDEX "_expertise_v_published_locale_idx" ON "_expertise_v" USING btree ("published_locale");
  CREATE INDEX "_expertise_v_latest_idx" ON "_expertise_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_expertise_v_locales_locale_parent_id_unique" ON "_expertise_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_expertise_v_locales_parent_id_idx" ON "_expertise_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_project_status_idx" ON "projects" USING btree ("project_status");
  CREATE INDEX "projects_featured_image_idx" ON "projects" USING btree ("featured_image_id");
  CREATE INDEX "projects_archived_idx" ON "projects" USING btree ("archived");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_locales_parent_id_idx" ON "projects_locales" USING btree ("_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_expertise_id_idx" ON "projects_rels" USING btree ("expertise_id");
  CREATE INDEX "projects_rels_consultants_id_idx" ON "projects_rels" USING btree ("consultants_id");
  CREATE INDEX "projects_rels_partners_id_idx" ON "projects_rels" USING btree ("partners_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_project_status_idx" ON "_projects_v" USING btree ("version_project_status");
  CREATE INDEX "_projects_v_version_version_featured_image_idx" ON "_projects_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_projects_v_version_version_archived_idx" ON "_projects_v" USING btree ("version_archived");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_locales_parent_id_idx" ON "_projects_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_expertise_id_idx" ON "_projects_v_rels" USING btree ("expertise_id");
  CREATE INDEX "_projects_v_rels_consultants_id_idx" ON "_projects_v_rels" USING btree ("consultants_id");
  CREATE INDEX "_projects_v_rels_partners_id_idx" ON "_projects_v_rels" USING btree ("partners_id");
  CREATE UNIQUE INDEX "insights_slug_idx" ON "insights" USING btree ("slug");
  CREATE INDEX "insights_category_idx" ON "insights" USING btree ("category");
  CREATE INDEX "insights_published_at_idx" ON "insights" USING btree ("published_at");
  CREATE INDEX "insights_cover_image_idx" ON "insights" USING btree ("cover_image_id");
  CREATE INDEX "insights_archived_idx" ON "insights" USING btree ("archived");
  CREATE INDEX "insights_updated_at_idx" ON "insights" USING btree ("updated_at");
  CREATE INDEX "insights_created_at_idx" ON "insights" USING btree ("created_at");
  CREATE INDEX "insights__status_idx" ON "insights" USING btree ("_status");
  CREATE UNIQUE INDEX "insights_locales_locale_parent_id_unique" ON "insights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "insights_locales_parent_id_idx" ON "insights_locales" USING btree ("_parent_id");
  CREATE INDEX "insights_rels_order_idx" ON "insights_rels" USING btree ("order");
  CREATE INDEX "insights_rels_parent_idx" ON "insights_rels" USING btree ("parent_id");
  CREATE INDEX "insights_rels_path_idx" ON "insights_rels" USING btree ("path");
  CREATE INDEX "insights_rels_consultants_id_idx" ON "insights_rels" USING btree ("consultants_id");
  CREATE INDEX "insights_rels_expertise_id_idx" ON "insights_rels" USING btree ("expertise_id");
  CREATE INDEX "insights_rels_projects_id_idx" ON "insights_rels" USING btree ("projects_id");
  CREATE INDEX "_insights_v_parent_idx" ON "_insights_v" USING btree ("parent_id");
  CREATE INDEX "_insights_v_version_version_slug_idx" ON "_insights_v" USING btree ("version_slug");
  CREATE INDEX "_insights_v_version_version_category_idx" ON "_insights_v" USING btree ("version_category");
  CREATE INDEX "_insights_v_version_version_published_at_idx" ON "_insights_v" USING btree ("version_published_at");
  CREATE INDEX "_insights_v_version_version_cover_image_idx" ON "_insights_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_insights_v_version_version_archived_idx" ON "_insights_v" USING btree ("version_archived");
  CREATE INDEX "_insights_v_version_version_updated_at_idx" ON "_insights_v" USING btree ("version_updated_at");
  CREATE INDEX "_insights_v_version_version_created_at_idx" ON "_insights_v" USING btree ("version_created_at");
  CREATE INDEX "_insights_v_version_version__status_idx" ON "_insights_v" USING btree ("version__status");
  CREATE INDEX "_insights_v_created_at_idx" ON "_insights_v" USING btree ("created_at");
  CREATE INDEX "_insights_v_updated_at_idx" ON "_insights_v" USING btree ("updated_at");
  CREATE INDEX "_insights_v_snapshot_idx" ON "_insights_v" USING btree ("snapshot");
  CREATE INDEX "_insights_v_published_locale_idx" ON "_insights_v" USING btree ("published_locale");
  CREATE INDEX "_insights_v_latest_idx" ON "_insights_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_insights_v_locales_locale_parent_id_unique" ON "_insights_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_insights_v_locales_parent_id_idx" ON "_insights_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_insights_v_rels_order_idx" ON "_insights_v_rels" USING btree ("order");
  CREATE INDEX "_insights_v_rels_parent_idx" ON "_insights_v_rels" USING btree ("parent_id");
  CREATE INDEX "_insights_v_rels_path_idx" ON "_insights_v_rels" USING btree ("path");
  CREATE INDEX "_insights_v_rels_consultants_id_idx" ON "_insights_v_rels" USING btree ("consultants_id");
  CREATE INDEX "_insights_v_rels_expertise_id_idx" ON "_insights_v_rels" USING btree ("expertise_id");
  CREATE INDEX "_insights_v_rels_projects_id_idx" ON "_insights_v_rels" USING btree ("projects_id");
  CREATE UNIQUE INDEX "publications_slug_idx" ON "publications" USING btree ("slug");
  CREATE INDEX "publications_file_idx" ON "publications" USING btree ("file_id");
  CREATE INDEX "publications_archived_idx" ON "publications" USING btree ("archived");
  CREATE INDEX "publications_updated_at_idx" ON "publications" USING btree ("updated_at");
  CREATE INDEX "publications_created_at_idx" ON "publications" USING btree ("created_at");
  CREATE INDEX "publications__status_idx" ON "publications" USING btree ("_status");
  CREATE UNIQUE INDEX "publications_locales_locale_parent_id_unique" ON "publications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "publications_locales_parent_id_idx" ON "publications_locales" USING btree ("_parent_id");
  CREATE INDEX "publications_rels_order_idx" ON "publications_rels" USING btree ("order");
  CREATE INDEX "publications_rels_parent_idx" ON "publications_rels" USING btree ("parent_id");
  CREATE INDEX "publications_rels_path_idx" ON "publications_rels" USING btree ("path");
  CREATE INDEX "publications_rels_consultants_id_idx" ON "publications_rels" USING btree ("consultants_id");
  CREATE INDEX "publications_rels_expertise_id_idx" ON "publications_rels" USING btree ("expertise_id");
  CREATE INDEX "publications_rels_projects_id_idx" ON "publications_rels" USING btree ("projects_id");
  CREATE INDEX "_publications_v_parent_idx" ON "_publications_v" USING btree ("parent_id");
  CREATE INDEX "_publications_v_version_version_slug_idx" ON "_publications_v" USING btree ("version_slug");
  CREATE INDEX "_publications_v_version_version_file_idx" ON "_publications_v" USING btree ("version_file_id");
  CREATE INDEX "_publications_v_version_version_archived_idx" ON "_publications_v" USING btree ("version_archived");
  CREATE INDEX "_publications_v_version_version_updated_at_idx" ON "_publications_v" USING btree ("version_updated_at");
  CREATE INDEX "_publications_v_version_version_created_at_idx" ON "_publications_v" USING btree ("version_created_at");
  CREATE INDEX "_publications_v_version_version__status_idx" ON "_publications_v" USING btree ("version__status");
  CREATE INDEX "_publications_v_created_at_idx" ON "_publications_v" USING btree ("created_at");
  CREATE INDEX "_publications_v_updated_at_idx" ON "_publications_v" USING btree ("updated_at");
  CREATE INDEX "_publications_v_snapshot_idx" ON "_publications_v" USING btree ("snapshot");
  CREATE INDEX "_publications_v_published_locale_idx" ON "_publications_v" USING btree ("published_locale");
  CREATE INDEX "_publications_v_latest_idx" ON "_publications_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_publications_v_locales_locale_parent_id_unique" ON "_publications_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_publications_v_locales_parent_id_idx" ON "_publications_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_publications_v_rels_order_idx" ON "_publications_v_rels" USING btree ("order");
  CREATE INDEX "_publications_v_rels_parent_idx" ON "_publications_v_rels" USING btree ("parent_id");
  CREATE INDEX "_publications_v_rels_path_idx" ON "_publications_v_rels" USING btree ("path");
  CREATE INDEX "_publications_v_rels_consultants_id_idx" ON "_publications_v_rels" USING btree ("consultants_id");
  CREATE INDEX "_publications_v_rels_expertise_id_idx" ON "_publications_v_rels" USING btree ("expertise_id");
  CREATE INDEX "_publications_v_rels_projects_id_idx" ON "_publications_v_rels" USING btree ("projects_id");
  CREATE UNIQUE INDEX "partners_slug_idx" ON "partners" USING btree ("slug");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_archived_idx" ON "partners" USING btree ("archived");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "partners__status_idx" ON "partners" USING btree ("_status");
  CREATE UNIQUE INDEX "partners_locales_locale_parent_id_unique" ON "partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_locales_parent_id_idx" ON "partners_locales" USING btree ("_parent_id");
  CREATE INDEX "_partners_v_parent_idx" ON "_partners_v" USING btree ("parent_id");
  CREATE INDEX "_partners_v_version_version_slug_idx" ON "_partners_v" USING btree ("version_slug");
  CREATE INDEX "_partners_v_version_version_logo_idx" ON "_partners_v" USING btree ("version_logo_id");
  CREATE INDEX "_partners_v_version_version_archived_idx" ON "_partners_v" USING btree ("version_archived");
  CREATE INDEX "_partners_v_version_version_updated_at_idx" ON "_partners_v" USING btree ("version_updated_at");
  CREATE INDEX "_partners_v_version_version_created_at_idx" ON "_partners_v" USING btree ("version_created_at");
  CREATE INDEX "_partners_v_version_version__status_idx" ON "_partners_v" USING btree ("version__status");
  CREATE INDEX "_partners_v_created_at_idx" ON "_partners_v" USING btree ("created_at");
  CREATE INDEX "_partners_v_updated_at_idx" ON "_partners_v" USING btree ("updated_at");
  CREATE INDEX "_partners_v_snapshot_idx" ON "_partners_v" USING btree ("snapshot");
  CREATE INDEX "_partners_v_published_locale_idx" ON "_partners_v" USING btree ("published_locale");
  CREATE INDEX "_partners_v_latest_idx" ON "_partners_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_partners_v_locales_locale_parent_id_unique" ON "_partners_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_partners_v_locales_parent_id_idx" ON "_partners_v_locales" USING btree ("_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "consultants_slug_idx" ON "consultants" USING btree ("slug");
  CREATE INDEX "consultants_photo_idx" ON "consultants" USING btree ("photo_id");
  CREATE INDEX "consultants_organization_unit_idx" ON "consultants" USING btree ("organization_unit_id");
  CREATE INDEX "consultants_archived_idx" ON "consultants" USING btree ("archived");
  CREATE INDEX "consultants_updated_at_idx" ON "consultants" USING btree ("updated_at");
  CREATE INDEX "consultants_created_at_idx" ON "consultants" USING btree ("created_at");
  CREATE INDEX "consultants__status_idx" ON "consultants" USING btree ("_status");
  CREATE UNIQUE INDEX "consultants_locales_locale_parent_id_unique" ON "consultants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "consultants_locales_parent_id_idx" ON "consultants_locales" USING btree ("_parent_id");
  CREATE INDEX "consultants_rels_order_idx" ON "consultants_rels" USING btree ("order");
  CREATE INDEX "consultants_rels_parent_idx" ON "consultants_rels" USING btree ("parent_id");
  CREATE INDEX "consultants_rels_path_idx" ON "consultants_rels" USING btree ("path");
  CREATE INDEX "consultants_rels_expertise_id_idx" ON "consultants_rels" USING btree ("expertise_id");
  CREATE INDEX "_consultants_v_parent_idx" ON "_consultants_v" USING btree ("parent_id");
  CREATE INDEX "_consultants_v_version_version_slug_idx" ON "_consultants_v" USING btree ("version_slug");
  CREATE INDEX "_consultants_v_version_version_photo_idx" ON "_consultants_v" USING btree ("version_photo_id");
  CREATE INDEX "_consultants_v_version_version_organization_unit_idx" ON "_consultants_v" USING btree ("version_organization_unit_id");
  CREATE INDEX "_consultants_v_version_version_archived_idx" ON "_consultants_v" USING btree ("version_archived");
  CREATE INDEX "_consultants_v_version_version_updated_at_idx" ON "_consultants_v" USING btree ("version_updated_at");
  CREATE INDEX "_consultants_v_version_version_created_at_idx" ON "_consultants_v" USING btree ("version_created_at");
  CREATE INDEX "_consultants_v_version_version__status_idx" ON "_consultants_v" USING btree ("version__status");
  CREATE INDEX "_consultants_v_created_at_idx" ON "_consultants_v" USING btree ("created_at");
  CREATE INDEX "_consultants_v_updated_at_idx" ON "_consultants_v" USING btree ("updated_at");
  CREATE INDEX "_consultants_v_snapshot_idx" ON "_consultants_v" USING btree ("snapshot");
  CREATE INDEX "_consultants_v_published_locale_idx" ON "_consultants_v" USING btree ("published_locale");
  CREATE INDEX "_consultants_v_latest_idx" ON "_consultants_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_consultants_v_locales_locale_parent_id_unique" ON "_consultants_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_consultants_v_locales_parent_id_idx" ON "_consultants_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_consultants_v_rels_order_idx" ON "_consultants_v_rels" USING btree ("order");
  CREATE INDEX "_consultants_v_rels_parent_idx" ON "_consultants_v_rels" USING btree ("parent_id");
  CREATE INDEX "_consultants_v_rels_path_idx" ON "_consultants_v_rels" USING btree ("path");
  CREATE INDEX "_consultants_v_rels_expertise_id_idx" ON "_consultants_v_rels" USING btree ("expertise_id");
  CREATE INDEX "organization_parent_idx" ON "organization" USING btree ("parent_id");
  CREATE INDEX "organization_head_idx" ON "organization" USING btree ("head_id");
  CREATE INDEX "organization_archived_idx" ON "organization" USING btree ("archived");
  CREATE INDEX "organization_updated_at_idx" ON "organization" USING btree ("updated_at");
  CREATE INDEX "organization_created_at_idx" ON "organization" USING btree ("created_at");
  CREATE INDEX "organization__status_idx" ON "organization" USING btree ("_status");
  CREATE UNIQUE INDEX "organization_locales_locale_parent_id_unique" ON "organization_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "organization_locales_parent_id_idx" ON "organization_locales" USING btree ("_parent_id");
  CREATE INDEX "_organization_v_parent_idx" ON "_organization_v" USING btree ("parent_id");
  CREATE INDEX "_organization_v_version_version_parent_idx" ON "_organization_v" USING btree ("version_parent_id");
  CREATE INDEX "_organization_v_version_version_head_idx" ON "_organization_v" USING btree ("version_head_id");
  CREATE INDEX "_organization_v_version_version_archived_idx" ON "_organization_v" USING btree ("version_archived");
  CREATE INDEX "_organization_v_version_version_updated_at_idx" ON "_organization_v" USING btree ("version_updated_at");
  CREATE INDEX "_organization_v_version_version_created_at_idx" ON "_organization_v" USING btree ("version_created_at");
  CREATE INDEX "_organization_v_version_version__status_idx" ON "_organization_v" USING btree ("version__status");
  CREATE INDEX "_organization_v_created_at_idx" ON "_organization_v" USING btree ("created_at");
  CREATE INDEX "_organization_v_updated_at_idx" ON "_organization_v" USING btree ("updated_at");
  CREATE INDEX "_organization_v_snapshot_idx" ON "_organization_v" USING btree ("snapshot");
  CREATE INDEX "_organization_v_published_locale_idx" ON "_organization_v" USING btree ("published_locale");
  CREATE INDEX "_organization_v_latest_idx" ON "_organization_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_organization_v_locales_locale_parent_id_unique" ON "_organization_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_organization_v_locales_parent_id_idx" ON "_organization_v_locales" USING btree ("_parent_id");
  CREATE INDEX "contact_messages_status_idx" ON "contact_messages" USING btree ("status");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_expertise_id_idx" ON "payload_locked_documents_rels" USING btree ("expertise_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_insights_id_idx" ON "payload_locked_documents_rels" USING btree ("insights_id");
  CREATE INDEX "payload_locked_documents_rels_publications_id_idx" ON "payload_locked_documents_rels" USING btree ("publications_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_consultants_id_idx" ON "payload_locked_documents_rels" USING btree ("consultants_id");
  CREATE INDEX "payload_locked_documents_rels_organization_id_idx" ON "payload_locked_documents_rels" USING btree ("organization_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "company_information_social_links_order_idx" ON "company_information_social_links" USING btree ("_order");
  CREATE INDEX "company_information_social_links_parent_id_idx" ON "company_information_social_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "company_information_locales_locale_parent_id_unique" ON "company_information_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "company_information_locales_parent_id_idx" ON "company_information_locales" USING btree ("_parent_id");
  CREATE INDEX "_company_information_v_version_social_links_order_idx" ON "_company_information_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_company_information_v_version_social_links_parent_id_idx" ON "_company_information_v_version_social_links" USING btree ("_parent_id");
  CREATE INDEX "_company_information_v_created_at_idx" ON "_company_information_v" USING btree ("created_at");
  CREATE INDEX "_company_information_v_updated_at_idx" ON "_company_information_v" USING btree ("updated_at");
  CREATE UNIQUE INDEX "_company_information_v_locales_locale_parent_id_unique" ON "_company_information_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_company_information_v_locales_parent_id_idx" ON "_company_information_v_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "expertise" CASCADE;
  DROP TABLE "expertise_locales" CASCADE;
  DROP TABLE "_expertise_v" CASCADE;
  DROP TABLE "_expertise_v_locales" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "insights" CASCADE;
  DROP TABLE "insights_locales" CASCADE;
  DROP TABLE "insights_rels" CASCADE;
  DROP TABLE "_insights_v" CASCADE;
  DROP TABLE "_insights_v_locales" CASCADE;
  DROP TABLE "_insights_v_rels" CASCADE;
  DROP TABLE "publications" CASCADE;
  DROP TABLE "publications_locales" CASCADE;
  DROP TABLE "publications_rels" CASCADE;
  DROP TABLE "_publications_v" CASCADE;
  DROP TABLE "_publications_v_locales" CASCADE;
  DROP TABLE "_publications_v_rels" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "partners_locales" CASCADE;
  DROP TABLE "_partners_v" CASCADE;
  DROP TABLE "_partners_v_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "consultants" CASCADE;
  DROP TABLE "consultants_locales" CASCADE;
  DROP TABLE "consultants_rels" CASCADE;
  DROP TABLE "_consultants_v" CASCADE;
  DROP TABLE "_consultants_v_locales" CASCADE;
  DROP TABLE "_consultants_v_rels" CASCADE;
  DROP TABLE "organization" CASCADE;
  DROP TABLE "organization_locales" CASCADE;
  DROP TABLE "_organization_v" CASCADE;
  DROP TABLE "_organization_v_locales" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "company_information_social_links" CASCADE;
  DROP TABLE "company_information" CASCADE;
  DROP TABLE "company_information_locales" CASCADE;
  DROP TABLE "_company_information_v_version_social_links" CASCADE;
  DROP TABLE "_company_information_v" CASCADE;
  DROP TABLE "_company_information_v_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_expertise_status";
  DROP TYPE "public"."enum__expertise_v_version_status";
  DROP TYPE "public"."enum__expertise_v_published_locale";
  DROP TYPE "public"."enum_projects_project_status";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_project_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";
  DROP TYPE "public"."enum_insights_category";
  DROP TYPE "public"."enum_insights_status";
  DROP TYPE "public"."enum__insights_v_version_category";
  DROP TYPE "public"."enum__insights_v_version_status";
  DROP TYPE "public"."enum__insights_v_published_locale";
  DROP TYPE "public"."enum_publications_publication_type";
  DROP TYPE "public"."enum_publications_status";
  DROP TYPE "public"."enum__publications_v_version_publication_type";
  DROP TYPE "public"."enum__publications_v_version_status";
  DROP TYPE "public"."enum__publications_v_published_locale";
  DROP TYPE "public"."enum_partners_partner_type";
  DROP TYPE "public"."enum_partners_status";
  DROP TYPE "public"."enum__partners_v_version_partner_type";
  DROP TYPE "public"."enum__partners_v_version_status";
  DROP TYPE "public"."enum__partners_v_published_locale";
  DROP TYPE "public"."enum_consultants_status";
  DROP TYPE "public"."enum__consultants_v_version_status";
  DROP TYPE "public"."enum__consultants_v_published_locale";
  DROP TYPE "public"."enum_organization_status";
  DROP TYPE "public"."enum__organization_v_version_status";
  DROP TYPE "public"."enum__organization_v_published_locale";
  DROP TYPE "public"."enum_contact_messages_status";
  DROP TYPE "public"."enum_contact_messages_locale";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_company_information_social_links_platform";
  DROP TYPE "public"."enum__company_information_v_version_social_links_platform";`)
}
