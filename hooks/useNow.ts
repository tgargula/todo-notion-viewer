import { useEffect, useState } from "react";

const useNow = (deps: Array<unknown>) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 15000);
    return () => clearInterval(id);
  }, deps);

  return now;
};

export default useNow;
