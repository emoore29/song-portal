export function estimateTime(listenCount: number): string {
  const averageFetch = 6;
  let estimatedSeconds = (listenCount / 1000) * averageFetch;

  const hours = Math.floor(estimatedSeconds / 3600);
  estimatedSeconds %= 3600;
  const minutes = Math.floor(estimatedSeconds / 60);
  const seconds = estimatedSeconds % 60;

  return hours > 0
    ? `${hours.toString()} hr ${minutes.toString()} min`
    : `${minutes.toString()} min ${seconds.toFixed(0).toString()} sec`;
}
