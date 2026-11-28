import { type ReactNode } from 'react';

import LeftSidebar from 'components/Sidebar/LeftSidebar';
import RightSidebar from 'components/Sidebar/RightSidebar';

/**
 * Feed in the middle with a profile menu on the left and community panels on the
 * right. The side columns appear when the screen is wide enough for them.
 */
const PageLayout = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto my-6 grid max-w-352 items-start gap-6 px-4 md:grid-cols-[minmax(0,1fr)_16rem] xl:grid-cols-[16rem_minmax(0,42rem)_20rem] xl:justify-center">
    <LeftSidebar />
    {children}
    <RightSidebar />
  </div>
);

export default PageLayout;
