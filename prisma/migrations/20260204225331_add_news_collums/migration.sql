-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GESTOR');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'GESTOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "traffic_source" TEXT NOT NULL,
    "funnel_type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "budget" DECIMAL(10,2),
    "description" TEXT,
    "status" "OfferStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_metrics" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "ctr" DECIMAL(5,2),
    "cpc" DECIMAL(10,2),
    "cpm" DECIMAL(10,2),
    "leads" INTEGER,
    "sales" INTEGER,
    "conversion_rate" DECIMAL(5,2),
    "revenue" DECIMAL(10,2),
    "cost" DECIMAL(10,2),
    "roas" DECIMAL(10,2),
    "aov" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offer_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benchmarks" (
    "id" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "country" TEXT,
    "traffic_source" TEXT,
    "funnel_type" TEXT,
    "metric_name" TEXT NOT NULL,
    "min_value" DECIMAL(10,2) NOT NULL,
    "max_value" DECIMAL(10,2) NOT NULL,
    "ideal_value" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benchmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_reports" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "validation_status" TEXT NOT NULL,
    "validation_explanation" TEXT,
    "bottlenecks" JSONB NOT NULL,
    "action_plan" JSONB NOT NULL,
    "missing_data" JSONB NOT NULL,
    "next_test_recommendations" TEXT,
    "ai_model" TEXT NOT NULL,
    "prompt_tokens" INTEGER,
    "completion_tokens" INTEGER,
    "total_tokens" INTEGER,
    "estimated_cost" DECIMAL(10,6),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "offers_user_id_idx" ON "offers"("user_id");

-- CreateIndex
CREATE INDEX "offers_niche_idx" ON "offers"("niche");

-- CreateIndex
CREATE INDEX "offers_country_idx" ON "offers"("country");

-- CreateIndex
CREATE UNIQUE INDEX "offer_metrics_offer_id_key" ON "offer_metrics"("offer_id");

-- CreateIndex
CREATE INDEX "benchmarks_niche_country_traffic_source_funnel_type_idx" ON "benchmarks"("niche", "country", "traffic_source", "funnel_type");

-- CreateIndex
CREATE UNIQUE INDEX "benchmarks_niche_country_traffic_source_funnel_type_metric__key" ON "benchmarks"("niche", "country", "traffic_source", "funnel_type", "metric_name");

-- CreateIndex
CREATE INDEX "ai_reports_offer_id_idx" ON "ai_reports"("offer_id");

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_metrics" ADD CONSTRAINT "offer_metrics_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_reports" ADD CONSTRAINT "ai_reports_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_reports" ADD CONSTRAINT "ai_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
