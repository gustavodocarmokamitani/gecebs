-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isFinalized" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "isFinalized" BOOLEAN NOT NULL DEFAULT false;
