'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ScaleLoader } from 'react-spinners'
import { useSpeech } from 'react-text-to-speech'
import { LuMic, LuMicOff, LuPhone } from 'react-icons/lu'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { Box, Button, HStack, IconButton, Center } from '@chakra-ui/react'

import { AlertClosedComponent } from '~/components/ui/alert'

const MotionBox = motion.create(Box)
const MotionButton = motion.create(Button)

interface VoiceAssistantClientPageProps {
  response: string
  listening: boolean
  transcript: string
  resetTranscript: () => void
}

export default function VoiceAssistantClientPage({
  response,
  listening,
  transcript,
  resetTranscript,
}: VoiceAssistantClientPageProps) {
  const router = useRouter()
  const { browserSupportsSpeechRecognition, isMicrophoneAvailable } = useSpeechRecognition()
  // const text = `how about you`
  const {
    Text: SpeechText,
    speechStatus,
    start,
  } = useSpeech({
    text: response,
    pitch: 1,
    rate: 1,
    volume: 1,
    lang: 'en-US',
    voiceURI: 'Microsoft Ava Online (Natural) - English (United States)',
    autoPlay: false,
    highlightText: true,
    showOnlyHighlightedText: false,
    highlightMode: 'word',
  })

  useEffect(() => {
    start()
    resetTranscript()
  }, [response])

  if (!browserSupportsSpeechRecognition) {
    return (
      <Center minH="full">
        <AlertClosedComponent status="error" title="Browser doesn't support speech recognition" />
      </Center>
    )
  }

  if (!isMicrophoneAvailable) {
    return (
      <Center minH="full">
        <AlertClosedComponent status="warning" title="Microphone Access Required">
          Microphone is not available. Please check your device settings.
        </AlertClosedComponent>
      </Center>
    )
  }

  return (
    <>
      <HStack>
        <MotionButton
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => SpeechRecognition.startListening()}
          size="lg"
          rounded="full"
          loading={listening}
          spinner={<ScaleLoader color="white" height={16} />}
          disabled={speechStatus === 'started'}
        >
          {listening ? <LuMicOff size={24} /> : <LuMic size={24} />} Tap to {listening ? 'Stop' : 'Speak'}
        </MotionButton>
        <IconButton size="lg" borderRadius="full" colorPalette="red" onClick={() => router.push('/simulation/summary')}>
          <LuPhone />
        </IconButton>
      </HStack>

      {/* {isListening && (
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <HStack gap={4}>
            <Spinner size="md" borderWidth="2px" />
            <Text>Listening for your command...</Text>
          </HStack>
        </MotionBox>
      )} */}

      <MotionBox
        px={6}
        py={4}
        bg="whiteAlpha.200"
        rounded="xl"
        shadow="xl"
        backdropBlur="xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {speechStatus === 'started' ? (
          <SpeechText />
        ) : !!transcript ? (
          transcript
        ) : (
          <>
            Try saying: <strong>&quot;Nice to meet you&quot;</strong> or <strong>&quot;How have you been?&quot;</strong>
          </>
        )}
      </MotionBox>
    </>
  )
}
