'use client'

import type { CoreMessage } from 'ai'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useSpeechRecognition } from 'react-speech-recognition'
import { LuTicketX, LuMessageCircle, LuX } from 'react-icons/lu'
import { Box, Heading, Text, HStack, Image, Card, Badge, AspectRatio, Stack, IconButton, Flex } from '@chakra-ui/react'

import { getAnswer } from '~/utils/ai-agent'
import { Tag } from '~/components/ui/tag'
import { Chat } from '~/components/chat'

const DynamicComponentWithNoSSR = dynamic(() => import('./page.client'), { ssr: false })

const MotionBox = motion.create(Box)

export default function VoiceAssistantPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [response, setResponse] = useState('')
  const [messages, setMessages] = useState<CoreMessage[]>([])

  const wasListeningRef = useRef(false)
  const { transcript, listening, resetTranscript } = useSpeechRecognition()
  useEffect(() => {
    const handleTranscription = async () => {
      const res = await getAnswer([...messages, { role: 'user', content: transcript }])
      setResponse(res.text)
      setMessages((prev) => [...prev, { role: 'user', content: transcript }, { role: 'system', content: res.text }])
    }

    if (wasListeningRef.current && !listening) {
      console.log('User finished speaking')
      handleTranscription()
    }

    wasListeningRef.current = listening
  }, [listening, transcript])

  const handleSubmit = async (message: string) => {
    const res = await getAnswer([...messages, { role: 'user', content: message }])
    setResponse(res.text)
    setMessages((prev) => [...prev, { role: 'user', content: message }, { role: 'system', content: res.text }])
  }

  return (
    <Flex h="full" w="full">
      <Stack
        flex="1"
        minH="full"
        gap={8}
        px={4}
        justifyContent="center"
        alignItems="center"
        bgGradient="linear-gradient(0deg,rgba(182, 202, 255, 1) 0%, rgba(204, 251, 241, 1) 100%)"
        borderRadius="xl"
        position="relative"
      >
        <MotionBox
          textAlign="center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          spaceY="4"
        >
          <Heading fontSize="4xl">Scenario 5</Heading>
          <Tag startElement={<LuTicketX />} size="lg">
            Cancellations
          </Tag>
        </MotionBox>

        <MotionBox initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card.Root flexDirection="row" overflow="hidden" maxW="md" p="2" borderRadius="2xl">
            <AspectRatio ratio={1} w="200px" h="200px" flexShrink={0}>
              <Image
                borderRadius="xl"
                objectFit="cover"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Caffe Latte"
              />
            </AspectRatio>
            <Box>
              <Card.Body>
                <Card.Title mb="2">Anne Wojcicki</Card.Title>
                <Card.Description>Calling in to cancel her subscription</Card.Description>
                <HStack mt="2">
                  <Badge>Healthcare</Badge>
                  <Badge>Investment</Badge>
                </HStack>
              </Card.Body>
              <Card.Footer>
                {/* <Button>Buy Latte</Button> */}
                <Text color="yellow.600" fontWeight="medium">
                  Satisfaction: 5/10
                </Text>
              </Card.Footer>
            </Box>
          </Card.Root>
        </MotionBox>

        <DynamicComponentWithNoSSR
          response={response}
          listening={listening}
          transcript={transcript}
          resetTranscript={resetTranscript}
        />

        {/* Chat Toggle Button */}
        <IconButton
          position="absolute"
          bottom="4"
          right="4"
          colorScheme="blue"
          borderRadius="full"
          size="lg"
          aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
          onClick={() => setIsChatOpen(!isChatOpen)}
          boxShadow="lg"
          _hover={{
            transform: 'scale(1.1)',
          }}
          transition="all 0.2s"
          zIndex={1000}
        >
          {isChatOpen ? <LuX size={24} /> : <LuMessageCircle size={24} />}
        </IconButton>

        {/* Collapsible Chat */}
      </Stack>
      {isChatOpen && (
        <Box w="400px" overflow="hidden">
          <Chat messages={messages} onSubmit={handleSubmit} />
        </Box>
      )}
    </Flex>
  )
}
