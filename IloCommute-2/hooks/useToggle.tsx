import { useCallback, useState } from "react";

const useToggle = (initState: boolean = false) => {
  const [state, setState] = useState<boolean>(initState);

  const toggle = useCallback(() => setState((prev) => !prev), []);
  const setForce= useCallback((value: boolean) => setState(value), []);

  return [state, toggle, setForce] as const;
};

export default useToggle;
