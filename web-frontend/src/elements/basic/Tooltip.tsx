import { Tooltip as TooltipAntD } from 'antd';
import { TooltipPlacement } from 'antd/es/tooltip';
import { useMemo } from 'react';
import defaultTooltipText from '../../constants/defaultTooltipText';

type InputProps = {
  children: React.ReactNode;
  title?: string;
  placement?: TooltipPlacement;
  delay?: number;
};

function Tooltip({
  children,
  title = defaultTooltipText,
  placement = 'right',
}: InputProps) {
  return useMemo(
    () => (
      <TooltipAntD title={title} placement={placement} mouseEnterDelay={1}>
        {children}
      </TooltipAntD>
    ),
    [title, placement, children],
  );
}

export default Tooltip;
