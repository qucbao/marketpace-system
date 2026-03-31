import { AppShell, LoadingState, PageContainer } from "@/components/ui";

export default function Loading() {
  return (
    <AppShell>
      <PageContainer>
        <LoadingState
          title="Dang tai du lieu"
          description="Vui long cho trong giay lat."
          className="mt-10"
        />
      </PageContainer>
    </AppShell>
  );
}
