import * as React from "react";

/** @public */
export interface UseMediaDevicesProps {
  kind: MediaDeviceKind;
  /**
   * If true, the hook will request permissions via `getUserMedia` to get device labels.
   * This might trigger a permission prompt in the browser. It's best to set this to true
   * only after the user has initiated an action that requires media access.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
   */
  requestPermissions?: boolean;
  /**
   * Callback for errors that occur during device enumeration or permission requests.
   */
  onError?: (error: Error) => void;
}

/**
 * A React hook to list and select media devices (microphones, cameras).
 * It handles device enumeration, permission requests, and updates when devices change.
 *
 * @example
 * ```tsx
 * const { devices, activeDeviceId, setActiveDeviceId } = useMediaDevices({ kind: 'audioinput' });
 *
 * return (
 *   <select
 *     value={activeDeviceId}
 *     onChange={(e) => setActiveDeviceId(e.target.value)}
 *   >
 *     {devices.map((device) => (
 *       <option key={device.deviceId} value={device.deviceId}>
 *         {device.label}
 *       </option>
 *     ))}
 *   </select>
 * );
 * ```
 * @public
 */
export function useMediaDevices({
  kind,
  requestPermissions = false,
  onError,
}: UseMediaDevicesProps) {
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
  const [activeDeviceId, setActiveDeviceId] = React.useState<string>("");

  const getDevices = React.useCallback(async () => {
    try {
      // If permissions are not yet granted, device labels will be empty.
      // We can request permissions by calling getUserMedia.
      const hasPermissions = devices.length > 0 && devices.every((d) => d.label);
      if (requestPermissions && !hasPermissions) {
        // Request permissions by asking for a stream.
        const stream = await navigator.mediaDevices.getUserMedia({
          [kind === "audioinput" ? "audio" : "video"]: true,
        });
        // Stop the tracks immediately after getting permissions.
        stream.getTracks().forEach((track) => track.stop());
      }

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const filteredDevices = allDevices.filter((device) => device.kind === kind);

      setDevices(filteredDevices);

      // If there's no active device, set the first one as active.
      if (filteredDevices.length > 0 && !activeDeviceId) {
        setActiveDeviceId(filteredDevices[0].deviceId);
      }
    } catch (e) {
      if (onError && e instanceof Error) {
        onError(e);
      }
    }
  }, [kind, requestPermissions, onError, devices, activeDeviceId]);

  React.useEffect(() => {
    getDevices();

    // Add event listener for device changes.
    navigator.mediaDevices.addEventListener("devicechange", getDevices);

    // Cleanup listener on component unmount.
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
    };
  }, [getDevices]);

  return { devices, activeDeviceId, setActiveDeviceId };
}
