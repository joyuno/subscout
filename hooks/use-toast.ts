// Temporary stub for use-toast hook
// This should be implemented by the appropriate worker

export function useToast() {
  return {
    toast: (options: { title?: string; description?: string; variant?: string }) => {
      console.log('Toast:', options);
    },
  };
}
