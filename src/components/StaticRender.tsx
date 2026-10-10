import type { ReactNode } from 'react';

export default function StaticRender({ value }: { value: ReactNode }) {
  return <>{value}</>;
}
