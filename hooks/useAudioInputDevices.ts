import { useEffect, useState } from 'react';

type AudioInputDevice = {
  deviceId: string;
  kind: 'audioinput';
  label: string;
};

export function useAudioInputDevices() {
  const [devices, setDevices] = useState<AudioInputDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function getDevices() {
      setLoading(true);
      setError(null);
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const inputDevices = allDevices
          .filter(
            (d): d is MediaDeviceInfo & { kind: 'audioinput' } =>
              d.kind === 'audioinput'
          )
          .map((d) => ({
            deviceId: d.deviceId,
            kind: d.kind,
            label: d.label,
          }));
        if (mounted) setDevices(inputDevices);
      } catch (err) {
        if (mounted) setDevices([]);
        if (mounted) setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    getDevices();

    navigator.mediaDevices.addEventListener('devicechange', getDevices);

    return () => {
      mounted = false;
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);

  return { devices, loading, error };
}