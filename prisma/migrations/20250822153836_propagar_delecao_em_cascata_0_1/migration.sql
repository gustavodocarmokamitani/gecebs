-- DropForeignKey
ALTER TABLE "ManagerCategory" DROP CONSTRAINT "ManagerCategory_managerId_fkey";

-- AddForeignKey
ALTER TABLE "ManagerCategory" ADD CONSTRAINT "ManagerCategory_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;
