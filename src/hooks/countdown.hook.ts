"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ICountdownState {
  remainingSeconds: number;
  secondsLeft: number;
  formatted: string;
  formattedTime: string;
  isExpired: boolean;
  isUrgent: boolean;
  isCritical: boolean;
}

interface ICountdownOptions {
  initialSeconds?: number;
  durationMinutes?: number;
  startedAt?: string | null;
  onExpire?: () => void;
}

export function useCountdown(
  param1: number | ICountdownOptions,
  param2?: string | null | (() => void),
  param3?: () => void,
): ICountdownState {
  let initialDurationSeconds = 3600;
  let startedAt: string | null | undefined = null;
  let onExpire: (() => void) | undefined;

  if (typeof param1 === "object" && param1 !== null) {
    if (param1.initialSeconds) {
      initialDurationSeconds = param1.initialSeconds;
    } else if (param1.durationMinutes) {
      initialDurationSeconds = param1.durationMinutes * 60;
    }
    startedAt = param1.startedAt;
    onExpire = param1.onExpire;
  } else if (typeof param1 === "number") {
    initialDurationSeconds = param1 * 60;
    if (typeof param2 === "string") {
      startedAt = param2;
      onExpire = param3;
    } else if (typeof param2 === "function") {
      onExpire = param2;
    }
  }

  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const calculateRemaining = useCallback(() => {
    if (!startedAt) return initialDurationSeconds;
    const startTime = new Date(startedAt).getTime();
    const totalDurationMs = initialDurationSeconds * 1000;
    const endTime = startTime + totalDurationMs;
    const now = Date.now();
    return Math.max(0, Math.floor((endTime - now) / 1000));
  }, [initialDurationSeconds, startedAt]);

  const [remainingSeconds, setRemainingSeconds] =
    useState<number>(calculateRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onExpireRef.current?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateRemaining]);

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const formatted =
    hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    remainingSeconds,
    secondsLeft: remainingSeconds,
    formatted,
    formattedTime: formatted,
    isExpired: remainingSeconds <= 0,
    isUrgent: remainingSeconds > 0 && remainingSeconds <= 300,
    isCritical: remainingSeconds > 0 && remainingSeconds <= 60,
  };
}

export default useCountdown;
