import { prisma } from "@/lib/prisma";
import AdminSection from "../../components/AdminSection";
import UpdateCompanyForm from "../UpdateCompanyForm";
import styles from "../../admin.module.css";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteCompany } from "../../actions/companies";
import CompanyLogoForm from "../CompanyLogoForm";
import CompanyHeroForm from "../CompanyHeroForm";
import CompanyMediaForm from "../CompanyMediaForm";
import ConfirmDeleteButton from "../components/ConfirmDeleteButton";
import SubscriptionForm from "../components/SubscriptionForm";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const companyId = Number(id);

  if (!companyId) {
    notFound();
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      name: true,
      tagline: true,
      url: true,
      companySummary: true,
      createdAt: true,
      logoUrl: true,
      logoPublicId: true,
      heroImageUrl: true,
      heroImagePublicId: true,
      galleryImages: true,
      galleryFeaturedIndex: true,
      servicesOffered: true,
    },
  });

  if (!company) {
    notFound();
  }

  const mappings = await prisma.companyServiceCity.findMany({
    where: { companyId },
    include: {
      serviceCity: {
        include: {
          service: { select: { name: true } },
          city: { select: { name: true, regionCode: true } },
        },
      },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  const plans = await prisma.plan.findMany({
    orderBy: [{ tier: "asc" }, { interval: "asc" }, { priceCents: "asc" }],
  });

  const currentSubscription = await prisma.subscription.findFirst({
    where: { companyId, isCurrent: true },
    orderBy: { createdAt: "desc" },
  });

  async function deleteCompanyAction() {
    "use server";
    await deleteCompany(companyId);
    redirect("/admin/companies");
  }

  const currentPrice =
    currentSubscription ? currentSubscription.priceCents / 100 : 0;

  return (
    <AdminSection
      title={`Company · ${company.name}`}
      right={
        <Link className={`${styles.btn} ${styles.secondary}`} href="/admin/companies">
          ← Back to list
        </Link>
      }
    >
      <div className={`${styles.detailCard} ${styles.companyDetailGrid}`}>
        <div className={styles.companyDetailColumns}>
          <div className={styles.companyDetailColumn}>
            <UpdateCompanyForm
              id={company.id}
              name={company.name}
              tagline={company.tagline}
              url={company.url}
              companySummary={company.companySummary}
              servicesOffered={company.servicesOffered}
            />

            <div className={styles.companyMappings}>
              <div className={styles.companyMappingsHeader}>
                <h3>Mappings: Service · City</h3>
                <span className={styles.muted}>
                  {mappings.length ? `${mappings.length} attached` : "No mappings yet"}
                </span>
              </div>
              {mappings.length ? (
                <div className={styles.mappingsList}>
                  {mappings.map((m) => (
                    <div key={`${m.companyId}-${m.serviceCityId}`} className={styles.mappingRow}>
                      <div>
                        <div className={styles.mappingTitle}>
                          {m.serviceCity.service.name}
                        </div>
                        <div className={styles.mappingMeta}>
                          {m.serviceCity.city.name}
                          {m.serviceCity.city.regionCode
                            ? `, ${m.serviceCity.city.regionCode}`
                            : ""}
                          {m.isFeatured ? " • Featured" : ""}
                        </div>
                      </div>
                      <div className={styles.mappingMetaSmall}>
                        Added {m.createdAt.toISOString().slice(0, 10)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.muted}>No mappings attached to this company.</p>
              )}
            </div>

            <div className={styles.companySubscription}>
              <div className={styles.companySubscriptionHeader}>
                <h3>Subscription</h3>
              </div>
              {currentSubscription ? (
                <div className={styles.subscriptionSummary}>
                  <div>
                    <div className={styles.subscriptionSummaryTitle}>
                      {currentSubscription.tier} · {currentSubscription.interval}
                    </div>
                    <div className={styles.subscriptionSummaryMeta}>
                      {currentSubscription.status} · {currentSubscription.currency}{" "}
                      {currentPrice.toFixed(2)}
                      {currentSubscription.planId ? " · Plan" : " · Custom"}
                    </div>
                  </div>
                  <div className={styles.subscriptionSummaryMeta}>
                    Started{" "}
                    {currentSubscription.startedAt.toISOString().slice(0, 10)}
                  </div>
                </div>
              ) : (
                <p className={styles.muted}>Assign a subscription below.</p>
              )}

              <SubscriptionForm
                companyId={companyId}
                plans={plans}
                currentSubscription={currentSubscription}
                formId="company-subscription-form"
              />
            </div>
          </div>

          <div className={styles.companyDetailColumn}>
            <CompanyLogoForm
              companyId={company.id}
              logoUrl={company.logoUrl}
              logoPublicId={company.logoPublicId}
            />

            <CompanyHeroForm
              companyId={company.id}
              heroImageUrl={company.heroImageUrl}
              heroImagePublicId={company.heroImagePublicId}
            />

        <CompanyMediaForm
          companyId={company.id}
          galleryImages={company.galleryImages}
          galleryFeaturedIndex={company.galleryFeaturedIndex}
        />
          </div>
        </div>

        <div className={styles.companyDangerZone}>
          <div className={styles.companyDangerCopy}>
            <h3 className={styles.companyDangerTitle}>Danger zone</h3>
            <p className={styles.companyDangerHint}>
              Removing a company deletes its content and mappings. This action
              cannot be undone.
            </p>
          </div>
          <form
            className={styles.companyDangerAction}
            action={deleteCompanyAction}
          >
            <ConfirmDeleteButton className={`${styles.btn} ${styles.danger}`}>
              Delete Company
            </ConfirmDeleteButton>
          </form>
        </div>
      </div>
    </AdminSection>
  );
}
