declare module '*.png' {
    const value: string;
    export = value;
}

declare module '*.svg' {
    const content: any;
    export default content;
  }
  
  declare module '*.json' {
    const content: any;
    export default content;
  }