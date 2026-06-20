import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <DocsLayout
      tree={{
        name: null,
        children: [],
      }}
      {...baseOptions()}
      sidebar={{ enabled: false }}
      tabs={false}
    >
      {children}
    </DocsLayout>
  );
}
