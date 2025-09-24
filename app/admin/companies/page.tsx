import { prisma } from "@/lib/prisma";
import AdminCompanies from "./AdminCompanies";

export const revalidate = 0; // always fresh in admin; or remove to use ISR

export default async function CompaniesAdminPage() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminCompanies initialCompanies={companies} />;
}
