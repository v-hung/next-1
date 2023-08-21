declare global {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    onSort?: any;
    sort?: any;
  }
  namespace JSX {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      onSort?: any;
      sort?: any;
    }
  }
}