'use client'

import { useState } from 'react'
import { FaMicrophone, FaStop, FaPause, FaPlay } from 'react-icons/fa'
import { Box, Container, VStack, HStack, Text, IconButton } from '@chakra-ui/react'

import { Progress } from '~/components/ui/progress'
import { toaster } from '~/components/ui/toaster'

export default function SimulationPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const handleStartRecording = () => {
    setIsRecording(true)
    toaster.info({
      title: 'Recording started',
      duration: 2000,
    })
  }

  const handlePauseRecording = () => {
    setIsPaused(!isPaused)
    toaster.info({
      title: isPaused ? 'Recording resumed' : 'Recording paused',
      duration: 2000,
    })
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    toaster.info({
      title: 'Recording stopped',
      duration: 2000,
    })
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={6} align="stretch">
        {/* Conversation History */}
        <Box flex={1} bg="bg" padding={4} borderRadius="lg" boxShadow="base" minH="60vh" overflowY="auto">
          <VStack gap={4} align="stretch">
            <Box bg="brand.subtle" padding={3} borderRadius="md">
              <Text fontWeight="bold">AI Coach</Text>
              <Text>Hello! I&apos;m your English conversation coach. What would you like to practice today?</Text>
            </Box>
            <Box bg="gray.subtle" padding={3} borderRadius="md">
              <Text fontWeight="bold">You</Text>
              <Text>Click the microphone to start speaking...</Text>
            </Box>
          </VStack>
        </Box>

        {/* Voice Controls */}
        <Box bg="bg" padding={4} borderRadius="lg" boxShadow="base">
          {isRecording && <Progress defaultValue={70} size="xs" mb={4} />}
          <HStack justify="center" gap={4}>
            <IconButton aria-label="Start recording" size="lg" onClick={handleStartRecording} disabled={isRecording}>
              <FaMicrophone />
            </IconButton>
            <IconButton
              aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
              size="lg"
              onClick={handlePauseRecording}
              disabled={!isRecording}
            >
              {isPaused ? <FaPlay /> : <FaPause />}
            </IconButton>
            <IconButton
              aria-label="Stop recording"
              colorScheme="red"
              size="lg"
              onClick={handleStopRecording}
              disabled={!isRecording}
            >
              <FaStop />
            </IconButton>
          </HStack>
        </Box>
      </VStack>
    </Container>
  )
}
