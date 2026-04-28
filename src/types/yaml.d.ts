// Ambient declaration for YAML file imports via @modyfi/vite-plugin-yaml
declare module '*.yaml' {
  const value: Record<string, unknown>;
  export default value;
}
