export function toggleVisibility(currentVisibility: boolean, isConnected: boolean, service: any): boolean {
  const newVisibility = !currentVisibility;
  if (newVisibility && isConnected && service && typeof service.getEntries === 'function') {
    service.getEntries();
  }
  return newVisibility;
} 