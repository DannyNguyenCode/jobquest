import { PageHeader } from "@/components/ui/PageHeader";
import {
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
} from "@/components/ui/Panel";
import { PanelAlert } from "@/components/ui/PanelAlert";
import { EmptyState } from "@/components/ui/EmptyState";
import { OverviewLayout } from "@/components/ui/layouts";
import { SkeletonState } from "@/components/ui/SkeletonState";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function DashboardFoundationPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        purpose="Foundation preview of the shared application shell and panel system."
        breadcrumbs={
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap gap-2">
              <li>JobQuest</li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Dashboard</li>
            </ol>
          </nav>
        }
        badges={
          <StatusBadge
            tone="info"
            label="Foundation preview — not live JobQuest data"
          />
        }
        actions={
          <button type="button" className="btn btn-primary">
            Primary action placeholder
          </button>
        }
      />

      <div className="mb-6">
        <PanelAlert tone="info" title="Foundation preview notice">
          This page demonstrates the Phase 2A design system and application
          shell. It does not show live JobQuest data, statistics, or workflow
          results.
        </PanelAlert>
      </div>

      <OverviewLayout>
        <Panel aria-labelledby="attention-panel-title">
          <PanelHeader
            titleId="attention-panel-title"
            title="Needs attention"
            description="Placeholder panel for time-sensitive work."
            badge={<StatusBadge tone="warning" label="Needs Attention" />}
          />
          <PanelBody>
            <EmptyState
              title="No attention items yet"
              description="When workflow features are implemented, due research and follow-ups will appear here."
              action={
                <button type="button" className="btn btn-outline btn-sm">
                  Learn about upcoming workflows
                </button>
              }
            />
          </PanelBody>
        </Panel>

        <Panel aria-labelledby="readiness-panel-title">
          <PanelHeader
            titleId="readiness-panel-title"
            title="Profile readiness"
            description="Placeholder panel for profile completion context."
            badge={<StatusBadge tone="neutral" label="Not connected" />}
          />
          <PanelBody>
            <p className="text-sm text-base-content/80">
              Profile readiness indicators will appear after Step 2 features are
              implemented. This panel is structural only.
            </p>
          </PanelBody>
          <PanelFooter>
            <p className="text-sm text-base-content/70">
              Footer example for secondary metadata.
            </p>
          </PanelFooter>
        </Panel>

        <Panel aria-labelledby="skeleton-panel-title">
          <PanelHeader
            titleId="skeleton-panel-title"
            title="Skeleton demonstration"
            description="Component demonstration of reserved loading geometry."
          />
          <PanelBody>
            <SkeletonState
              label="Component demonstration: skeleton loading state"
              rows={4}
            />
          </PanelBody>
        </Panel>
      </OverviewLayout>
    </>
  );
}
