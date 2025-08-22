/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Athlete` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `Athlete` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Manager` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Athlete" DROP CONSTRAINT "Athlete_userId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryAthlete" DROP CONSTRAINT "CategoryAthlete_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Confirmation" DROP CONSTRAINT "Confirmation_eventId_fkey";

-- DropForeignKey
ALTER TABLE "ConfirmationItem" DROP CONSTRAINT "ConfirmationItem_confirmationId_userId_fkey";

-- DropForeignKey
ALTER TABLE "ConfirmationItem" DROP CONSTRAINT "ConfirmationItem_paymentItemId_fkey";

-- DropForeignKey
ALTER TABLE "ConfirmationUser" DROP CONSTRAINT "ConfirmationUser_confirmationId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_userId_fkey";

-- DropForeignKey
ALTER TABLE "ManagerCategory" DROP CONSTRAINT "ManagerCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentItem" DROP CONSTRAINT "PaymentItem_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentUser" DROP CONSTRAINT "PaymentUser_paymentId_fkey";

-- AlterTable
ALTER TABLE "Athlete" ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "Manager" ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Athlete_phone_key" ON "Athlete"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_phone_key" ON "Manager"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Team_phone_key" ON "Team"("phone");

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryAthlete" ADD CONSTRAINT "CategoryAthlete_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerCategory" ADD CONSTRAINT "ManagerCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentItem" ADD CONSTRAINT "PaymentItem_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentUser" ADD CONSTRAINT "PaymentUser_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Confirmation" ADD CONSTRAINT "Confirmation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationUser" ADD CONSTRAINT "ConfirmationUser_confirmationId_fkey" FOREIGN KEY ("confirmationId") REFERENCES "Confirmation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationItem" ADD CONSTRAINT "ConfirmationItem_confirmationId_userId_fkey" FOREIGN KEY ("confirmationId", "userId") REFERENCES "ConfirmationUser"("confirmationId", "userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationItem" ADD CONSTRAINT "ConfirmationItem_paymentItemId_fkey" FOREIGN KEY ("paymentItemId") REFERENCES "PaymentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
