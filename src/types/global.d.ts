export {};
declare module "bootstrap/dist/js/bootstrap.bundle.min.js";
declare global {
  interface Window {
    gsap?: typeof import("gsap");
    SplitText?: any; 
    ScrollTrigger?: any;
  }
}