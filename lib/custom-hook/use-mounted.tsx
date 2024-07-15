import { useEffect, useState } from "react";

// Check is component is mounted in client side
export function useMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  return isMounted;
}
