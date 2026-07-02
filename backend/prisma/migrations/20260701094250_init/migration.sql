-- CreateEnum
CREATE TYPE "Language" AS ENUM ('es', 'en');

-- CreateEnum
CREATE TYPE "ReputationTier" AS ENUM ('NEWCOMER', 'TRUSTED', 'VECINO', 'GUARDIAN');

-- CreateEnum
CREATE TYPE "PinCategory" AS ENUM ('SAFETY_INCIDENT', 'TRAFFIC', 'POLICE_CONTROL', 'EVENT', 'LOST_FOUND', 'CIVIC_ISSUE', 'EXPAT_MEETUP', 'WEATHER_HAZARD');

-- CreateEnum
CREATE TYPE "ReportSource" AS ENUM ('APP');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT,
    "phoneNumber" TEXT,
    "displayName" TEXT,
    "preferredLanguage" "Language" NOT NULL DEFAULT 'es',
    "reputationTier" "ReputationTier" NOT NULL DEFAULT 'NEWCOMER',
    "reputationScore" INTEGER NOT NULL DEFAULT 0,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "homeLat" DOUBLE PRECISION,
    "homeLng" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pins" (
    "id" TEXT NOT NULL,
    "category" "PinCategory" NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "intensity" INTEGER NOT NULL DEFAULT 1,
    "source" "ReportSource" NOT NULL DEFAULT 'APP',
    "photoUrl" TEXT,
    "confirmCount" INTEGER NOT NULL DEFAULT 0,
    "disputeCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT,

    CONSTRAINT "pins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- AddForeignKey
ALTER TABLE "pins" ADD CONSTRAINT "pins_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
