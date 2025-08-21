/*
  Warnings:

  - You are about to drop the column `houseNumber` on the `Athlete` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Confirmation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Confirmation` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Confirmation` table. All the data in the column will be lost.
  - Added the required column `eventId` to the `Confirmation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ConfirmationUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Confirmation" DROP CONSTRAINT "Confirmation_teamId_fkey";

-- AlterTable
ALTER TABLE "Athlete" DROP COLUMN "houseNumber",
ADD COLUMN     "shirtNumber" TEXT;

-- AlterTable
ALTER TABLE "Confirmation" DROP COLUMN "date",
DROP COLUMN "name",
DROP COLUMN "teamId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "eventId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ConfirmationUser" ADD COLUMN     "status" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "eventId" INTEGER;

-- CreateTable
CREATE TABLE "PaymentItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "quantityEnabled" BOOLEAN NOT NULL DEFAULT false,
    "paymentId" INTEGER NOT NULL,

    CONSTRAINT "PaymentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "type" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmationItem" (
    "confirmationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "paymentItemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ConfirmationItem_pkey" PRIMARY KEY ("confirmationId","userId","paymentItemId")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentItem" ADD CONSTRAINT "PaymentItem_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Confirmation" ADD CONSTRAINT "Confirmation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationItem" ADD CONSTRAINT "ConfirmationItem_confirmationId_userId_fkey" FOREIGN KEY ("confirmationId", "userId") REFERENCES "ConfirmationUser"("confirmationId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationItem" ADD CONSTRAINT "ConfirmationItem_paymentItemId_fkey" FOREIGN KEY ("paymentItemId") REFERENCES "PaymentItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
