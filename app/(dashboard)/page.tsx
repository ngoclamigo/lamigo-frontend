'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PiMicrophone, PiMicrophoneSlash } from 'react-icons/pi'
import {
  LuBot,
  LuBriefcase,
  LuCalendar1,
  LuChartBar,
  LuHospital,
  LuLightbulb,
  LuSearch,
  LuTarget,
  LuTrendingUp,
  LuZap,
} from 'react-icons/lu'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  HStack,
  Center,
  SimpleGrid,
  For,
  Icon,
} from '@chakra-ui/react'

import { useColorModeValue } from '~/components/ui/color-mode'
import { NativeSelect } from '~/components/ui/native-select'
import { toaster } from '~/components/ui/toaster'
import { Avatar } from '~/components/ui/avatar'
import { Field } from '~/components/ui/field'

interface WebkitWindow extends Window {
  webkitAudioContext: typeof AudioContext
}

export default function DashboardPage() {
  const router = useRouter()

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [isTestingMic, setIsTestingMic] = useState(false)
  const [toastId, setToastId] = useState<string | undefined>()

  const bgColor = useColorModeValue('brand.50', 'brand.800')

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
        toaster.error({
          title: 'Error accessing microphone',
          description: `Please ensure you have granted microphone permissions. ${errorMessage}`,
          duration: 5000,
        })
      }
    }
    getDevices()
  }, [])

  const handleStartSimulation = () => {
    router.push('/simulation')
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

      const id = toaster.create({
        type: 'info',
        title: 'Testing microphone',
        description: 'Speak to test your microphone. Click Stop Testing when done.',
      })
      setToastId(id)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toaster.error({
        title: 'Error testing microphone',
        description: `Failed to access the selected microphone. ${errorMessage}`,
        duration: 5000,
      })
    }
  }

  const stopTesting = () => {
    setIsTestingMic(false)
    if (toastId) {
      toaster.dismiss(toastId)
    }
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Box display="flex" flexDirection="column" gap={6}>
        <Box
          padding={5}
          shadow="md"
          borderWidth="2px"
          borderRadius="xl"
          borderColor="brand.fg"
          bgColor={bgColor}
          spaceY="4"
        >
          <HStack alignItems="center" gap="4">
            <Center bg="brand.fg" borderRadius="full" boxSize="8" color="white">
              1
            </Center>
            <Heading size="lg" color="brand.fg" fontWeight="bold">
              Context Verification
            </Heading>
          </HStack>
          <Text>
            I&apos;ve brought all the context form our Slack conversation. Let me confirm the details for your Vista
            Equity practice session:
          </Text>
          <Box bg="bg.subtle" padding="5" borderRadius="lg" borderWidth="1px" borderColor="border.emphasized">
            <SimpleGrid columns={2} gap="4">
              <For each={sessionDetails}>
                {(detail, index) => (
                  <HStack key={`detail-${index}`} gap="4">
                    <Icon size="md">
                      <detail.icon />
                    </Icon>
                    <Box>
                      <Text fontWeight="medium">{detail.name}</Text>
                      <Text color="fg.muted">{detail.topDesc}</Text>
                      <Text color="fg.muted">{detail.bottomDesc}</Text>
                    </Box>
                  </HStack>
                )}
              </For>
            </SimpleGrid>
          </Box>
          <HStack
            alignItems="start"
            borderWidth="1px"
            borderColor="brand.emphasized"
            padding="3"
            borderRadius="lg"
            gap="3"
          >
            <Center boxSize="9" bgColor="brand.fg" color="white" flexShrink="0" borderRadius="md">
              <LuBot />
            </Center>
            <Text>
              Perfect! I can see everything looks accurate. Now let&apos;s go your practice environment set up so you
              can have the most realistic conversation with Anne.
            </Text>
          </HStack>
        </Box>

        <Box
          padding={5}
          shadow="md"
          borderWidth="2px"
          borderRadius="xl"
          borderColor="brand.fg"
          bgColor={bgColor}
          spaceY="4"
        >
          <HStack alignItems="center" gap="4">
            <Center bg="brand.fg" borderRadius="full" boxSize="8" color="white">
              2
            </Center>
            <Heading size="lg" color="brand.fg" fontWeight="bold">
              Voice Setup & Testing
            </Heading>
          </HStack>
          <Text>
            Let&apos;s make sure your microphone is working properly for the most natural conversation experience:
          </Text>
          <Box
            bg="bg.subtle"
            padding="5"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.emphasized"
            spaceY="4"
          >
            <Field
              label="Choose a device for speaking"
              helperText="Don't worry if this isn't perfect - we can adjust during practice, and there's always a fallback to text if needed"
            >
              <NativeSelect
                items={devices.map((device) => ({
                  value: device.deviceId,
                  label: device.label || `Microphone ${device.deviceId.slice(0, 8)}...`,
                }))}
              />
            </Field>
            <Box>
              {!isTestingMic ? (
                <Button onClick={testMicrophone} disabled={!selectedDevice}>
                  <PiMicrophone /> Test Microphone
                </Button>
              ) : (
                <Button colorPalette="red" onClick={stopTesting}>
                  <PiMicrophoneSlash /> Stop Testing
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          padding={5}
          shadow="md"
          borderWidth="2px"
          borderRadius="xl"
          borderColor="brand.fg"
          bgColor={bgColor}
          spaceY="4"
        >
          <HStack alignItems="center" gap="4">
            <Center bg="brand.fg" borderRadius="full" boxSize="8" color="white">
              3
            </Center>
            <Heading size="lg" color="brand.fg" fontWeight="bold">
              Meet Your Practice Partner
            </Heading>
          </HStack>
          <Text>
            I&apos;ll be playing Anne Wojcicki from Vista Equity. Here&apos;s what you should know about how she
            communicates:
          </Text>
          <Box
            bg="bg.subtle"
            padding="5"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border.emphasized"
            spaceY="4"
          >
            <HStack gap="3">
              <Avatar name={partnerInfo.name} size="lg" />
              <Box>
                <Text fontWeight="semibold">{partnerInfo.name}</Text>
                <Text color="fg.muted">{partnerInfo.desc}</Text>
              </Box>
            </HStack>
            <SimpleGrid columns={2} gap="4">
              <For each={partnerInfo.expertise}>
                {(detail, index) => (
                  <HStack key={`detail-${index}`} gap="4" color="fg.muted" bg="bg.muted" padding="2">
                    <Icon size="md">
                      <detail.icon />
                    </Icon>
                    <Text fontWeight="medium">{detail.name}</Text>
                  </HStack>
                )}
              </For>
            </SimpleGrid>
          </Box>
          <HStack
            alignItems="start"
            borderWidth="1px"
            borderColor="brand.emphasized"
            padding="3"
            borderRadius="lg"
            gap="3"
          >
            <Center boxSize="9" bgColor="brand.fg" color="white" flexShrink="0" borderRadius="md">
              <LuBot />
            </Center>
            <Text>
              I&apos;ll give you real-time coaching during the conversation - just subtle hints when you need them.
              You&apos;ve got this! Ready to practice?
            </Text>
          </HStack>
        </Box>

        <Box display="flex" justifyContent="center">
          <Button onClick={handleStartSimulation}>Start Voice Practice</Button>
        </Box>
      </Box>
    </Container>
  )
}

const sessionDetails = [
  {
    icon: LuCalendar1,
    name: 'Meeting Details',
    topDesc: 'Vista Equity Partners - Today at 02:00 P.M',
    bottomDesc: 'Anne Wojcicki, Managing Director',
  },
  {
    icon: LuLightbulb,
    name: 'Key Opportunity',
    topDesc: 'ESG Analytics positioning',
    bottomDesc: '$2B sustainability fund launch',
  },
  {
    icon: LuTarget,
    name: 'Focus Areas',
    topDesc: 'Competitive differentiation vs Bloomberg',
    bottomDesc: 'Healthcare workflow integration',
  },
  {
    icon: LuTrendingUp,
    name: 'Your Strengths',
    topDesc: 'Product features expertise',
    bottomDesc: 'Recent Blackstone ESG success',
  },
]

const partnerInfo = {
  name: 'Anne Wojcicki (AI Character)',
  desc: 'Managing Director, Healthcare Investments',
  expertise: [
    {
      icon: LuBriefcase,
      name: 'Direct communication style',
    },
    {
      icon: LuChartBar,
      name: 'Data-driven decision making',
    },
    {
      icon: LuZap,
      name: 'Fast-paced conversation',
    },
    {
      icon: LuTarget,
      name: 'ROI-focused questions',
    },
    {
      icon: LuSearch,
      name: 'Skeptical of vendor switching',
    },
    {
      icon: LuHospital,
      name: 'Healthcare expertise depth',
    },
  ],
}
