declare global {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    onSort?: any;
    sort?: any;
    css?: CSSInterpolation
  }
  namespace JSX {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      onSort?: any;
      sort?: any;
      css?: CSSInterpolation
    }
  }
}