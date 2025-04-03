// Global type declarations for the project

// Declare modules for CSS imports
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Declare modules for image imports
declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

// Fix for JSX element type errors
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
