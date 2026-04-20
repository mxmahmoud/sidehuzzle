import { TextClassContext } from '@/components/ui/text';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';

type IconProps = {
  as: LucideIcon;
  className?: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  [key: string]: unknown;
};

function Icon({ as: IconComponent, className, size = 14, ...props }: IconProps) {
  const textClass = React.useContext(TextClassContext);
  void className;
  void textClass;
  const Component = IconComponent as React.ComponentType<any>;
  return <Component color={props.color ?? 'currentColor'} size={size} {...props} />;
}

export { Icon };
