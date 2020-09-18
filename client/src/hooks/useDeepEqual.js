import { useCallback, useEffect, useMemo, useRef } from 'react';
import { isEqual } from 'lodash';

const useDeepEqual = (value) => {
  const ref = useRef();

  if (!isEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
};

export const useDeepEqualCallback = (callback, dependencies) =>
  useCallback(callback, useDeepEqual(dependencies));
export const useDeepEqualEffect = (callback, dependencies) => {
  useEffect(callback, useDeepEqual(dependencies));
};
export const useDeepEqualMemo = (callback, dependencies) =>
  useMemo(callback, useDeepEqual(dependencies));
