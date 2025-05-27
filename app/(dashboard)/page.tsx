'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Container, Heading, Text, Select, Portal, createListCollection } from '@chakra-ui/react'

import { toaster as toast } from '~/components/ui/toaster'

interface WebkitWindow extends Window {
  webkitAudioContext: typeof AudioContext
}

export default function DashboardPage() {
  const router = useRouter()

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [isTestingMic, setIsTestingMic] = useState(false)
  const [toastId, setToastId] = useState<string | undefined>()

  useEffect(() => {
    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        const devices = await navigator.mediaDevices.enumerateDevices()
        const audioDevices = devices.filter((device) => device.kind === 'audioinput')
        setDevices(audioDevices)
        if (audioDevices.length > 0) {
          setSelectedDevice(audioDevices[0].deviceId)
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        toast.create({
          title: 'Error accessing microphone',
          description: `Please ensure you have granted microphone permissions. ${errorMessage}`,
          duration: 5000,
        })
      }
    }
    getDevices()
  }, [])

  const handleStartSimulation = () => {
    router.push('/voice-practice')
  }

  const testMicrophone = async () => {
    try {
      setIsTestingMic(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedDevice },
      })
      // Create an audio context for testing
      const AudioContextClass = window.AudioContext || (window as unknown as WebkitWindow).webkitAudioContext
      const audioContext = new AudioContextClass()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      microphone.connect(analyser)

      const id = toast.create({
        type: 'info',
        title: 'Testing microphone',
        description: 'Speak to test your microphone. Click Stop Testing when done.',
      })
      setToastId(id)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error({
        title: 'Error testing microphone',
        description: `Failed to access the selected microphone. ${errorMessage}`,
        duration: 5000,
      })
    }
  }

  const stopTesting = () => {
    setIsTestingMic(false)
    if (toastId) {
      toast.dismiss(toastId)
    }
  }

  const frameworks = createListCollection({
    items: devices,
  })

  return (
    <Container maxW="container.lg" py={8}>
      <Box display="flex" flexDirection="column" gap={6}>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>
            Context Verification
          </Heading>
          <Text>Verify your simulation context and settings here</Text>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>
            Microphone Testing
          </Heading>
          <Box display="flex" flexDirection="column" gap={4}>
            <Text>Select your microphone device:</Text>
            <Select.Root collection={frameworks}>
              <Select.HiddenSelect />
              <Select.Label>Select framework - {}</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select framework" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {devices.map((device) => (
                      <Select.Item key={device.deviceId} item={device.deviceId}>
                        {device.label || `Microphone ${device.deviceId.slice(0, 8)}...`}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            <Box>
              {!isTestingMic ? (
                <Button colorScheme="blue" onClick={testMicrophone} disabled={!selectedDevice}>
                  Test Microphone
                </Button>
              ) : (
                <Button colorScheme="red" onClick={stopTesting}>
                  Stop Testing
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading size="md" mb={4}>
            Partner Information
          </Heading>
          <Text>Review information about your simulation partner</Text>
        </Box>

        <Box display="flex" justifyContent="center">
          <Button onClick={handleStartSimulation}>Start Simulation</Button>
        </Box>
      </Box>
    </Container>
  )
}
