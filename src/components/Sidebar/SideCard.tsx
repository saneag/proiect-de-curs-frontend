import { type ReactNode } from 'react';

interface Props {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

/** A titled white panel used by the side columns. */
const SideCard = ({ title, icon, children }: Props) => (
  <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
      <span className="text-blue-600">{icon}</span>
      {title}
    </h2>
    {children}
  </section>
);

export default SideCard;
