import React from "react";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: Size;
  children: React.ReactNode;
  as?: string;
}

const SIZE_MAP: Record<Size, string> = {
  xs: "max-w-2xl",
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-7xl",
  xl: "max-w-5xl",
};

const Section: React.FC<SectionProps> = ({ size = "lg", children, className = "", as = "section", ...rest }) => {
  const Tag: any = as || "section";
  return (
    <Tag className={`${SIZE_MAP[size]} mx-auto py-8 px-4 ${className}`} {...rest}>
      {children}
    </Tag>
  );
};

export default Section;
