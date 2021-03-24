import React, { PropsWithChildren, ReactElement } from 'react';

export function Heading({ children }: PropsWithChildren<{}>): ReactElement {
  return (
    <div className="heading-wrap">
      <h2 className="heading">{children}</h2>
    </div>
  );
}
