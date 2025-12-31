import PublishedPageClient from "./published-page-client";

export default async function PublishedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <PublishedPageClient slug={slug} />;
}
