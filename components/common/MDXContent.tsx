"use client";
import * as runtime from "react/jsx-runtime";

/** Renders Velite's compiled MDX body string. Optional component overrides. */
export function MDXContent({
  code,
  components = {},
}: {
  code: string;
  components?: Record<string, React.ComponentType>;
}) {
  const fn = new Function(code);
  const { default: Content } = fn({ ...runtime });
  return <Content components={components} />;
}
