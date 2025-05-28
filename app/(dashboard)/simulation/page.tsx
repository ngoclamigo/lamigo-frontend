'use client'

import { useState } from 'react'
import { FaMicrophone, FaMicrophoneSlash, FaPhone } from 'react-icons/fa'
import { Box, Container, VStack, HStack, Text, IconButton } from '@chakra-ui/react'

import { Progress } from '~/components/ui/progress'
import { toaster } from '~/components/ui/toaster'
import { useRouter } from 'next/navigation'

export default function SimulationPage() {
  const router = useRouter()

  const [isRecording, setIsRecording] = useState(false)

  const handleStartRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      toaster.info({
        title: 'Recording started',
        duration: 2000,
      })
    } else {
      setIsRecording(false)
      toaster.info({
        title: 'Recording stopped',
        duration: 2000,
      })
    }
  }

  const handleStopRecording = () => {
    router.push('/simulation/summary')
  }

  return (
    <Container maxW="container.xl" py={8}>
      <HStack alignItems="start" gap={6}>
        {/* Left Side - Customer Info */}
        <Box flex={1} bg="bg" padding={4} borderRadius="lg" boxShadow="base" minH="80vh">
          <VStack alignItems="stretch" gap={4}>
            <Text fontSize="xl" fontWeight="bold">
              Customer Information
            </Text>

            {/* Customer Details */}
            <Box bg="brand.subtle" p={4} borderRadius="md">
              <VStack alignItems="stretch" gap={3}>
                <HStack>
                  <Text fontWeight="semibold">Name:</Text>
                  <Text>John Smith</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Account Type:</Text>
                  <Text>Premium</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Inquiry Type:</Text>
                  <Text>Product Information</Text>
                </HStack>
              </VStack>
            </Box>

            {/* Voice Controls */}
            <Box bg="gray.50" p={4} borderRadius="md">
              <VStack gap={4}>
                <HStack gap={4}>
                  <IconButton
                    aria-label="Toggle microphone"
                    size="lg"
                    colorPalette={isRecording ? 'red' : 'brand'}
                    onClick={handleStartRecording}
                    borderRadius="full"
                  >
                    {!isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
                  </IconButton>
                  <IconButton
                    borderRadius="full"
                    aria-label="End call"
                    size="lg"
                    colorPalette="red"
                    onClick={handleStopRecording}
                  >
                    <FaPhone />
                  </IconButton>
                </HStack>
                {isRecording && <Progress width="100%" size="xs" value={70} colorScheme="green" />}
              </VStack>
            </Box>
          </VStack>
        </Box>

        {/* Right Side - Conversation Display */}
        <Box flex={2} bg="bg" padding={4} borderRadius="lg" boxShadow="base" minH="80vh" overflowY="auto">
          <VStack gap={4} alignItems="stretch">
            <Text fontSize="xl" fontWeight="bold">
              Conversation
            </Text>
            <Box bg="brand.subtle" padding={3} borderRadius="md">
              <Text fontWeight="bold">AI Coach</Text>
              <Text>
                Hello! I&apos;m your customer service training assistant. The simulation will begin when you click the
                microphone button.
              </Text>
            </Box>
            <Box bg="gray.subtle" padding={3} borderRadius="md">
              <Text fontWeight="bold">You</Text>
              <Text>Click the microphone to start speaking...</Text>
            </Box>
          </VStack>
        </Box>
      </HStack>
    </Container>
  )
}
