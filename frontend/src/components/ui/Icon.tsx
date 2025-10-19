import * as Icons from 'lucide-react';

// All Lucide icon names as a union type
export type LucideIconName = keyof typeof Icons;

export type IconProps = {
  name: LucideIconName;
  size?: number;
  color?: string;
  className?: string;
};

const Icon = (props: IconProps) => {
  const { name, size = 24, color = 'currentColor', className = '' } = props;
  const LucideIcon = Icons[name] as React.ElementType | undefined;
  if (!LucideIcon) return null;
  return <LucideIcon size={size} color={color} className={className} />;
};

export default Icon;
