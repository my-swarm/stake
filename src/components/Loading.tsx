import React, { ReactElement } from 'react';
import { Skeleton } from 'antd';

export function Loading(): ReactElement {
  return (
    <div>
      {/*<LoadingIcon prefixCls="swm" existIcon={true} />*/}
      <Skeleton active />
    </div>
  );
}
