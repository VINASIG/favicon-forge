export {};

// These hooks belong only to deterministic browser fixtures. The product creates none of them.
declare global {
  interface Window {
    releaseResponsiveCanvas?: () => void;
    releaseTestImage?: () => void;
    testImageFinished?: boolean;
  }
}
