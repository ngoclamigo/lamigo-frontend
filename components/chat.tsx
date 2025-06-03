import type { CoreMessage } from 'ai'

import { LuSend, LuUser } from 'react-icons/lu'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useRef, useEffect } from 'react'
import { Box, VStack, HStack, Text, Input, Flex, IconButton, Separator, Spinner } from '@chakra-ui/react'

import { useColorModeValue } from './ui/color-mode'
import { Avatar } from './ui/avatar'

// Motion components
const MotionBox = motion(Box)
const MotionVStack = motion(VStack)

interface ChatProps {
  messages: CoreMessage[]
  onSubmit: (message: string) => void
  isLoading?: boolean
}

function renderMessageContent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: string | any[] | { [key: string]: any }
): React.ReactNode {
  if (typeof content === 'string') {
    return content
  }
  if (Array.isArray(content)) {
    return content.map((part, idx) => {
      if (typeof part === 'string') return part
      if (part.type === 'text' && part.text) return <span key={idx}>{part.text}</span>
      if (part.type === 'image' && part.url) return <img key={idx} src={part.url} alt={part.alt || ''} style={{ maxWidth: 200, maxHeight: 200 }} />
      if (part.type === 'file' && part.url) return <a key={idx} href={part.url} target="_blank" rel="noopener noreferrer">{part.name || 'File'}</a>
      // Add more part types as needed
      return null
    })
  }
  // Handle ToolContent or other object types
  if (content && typeof content === 'object') {
    if ('text' in content) return content.text
    if ('url' in content && content.type === 'image') return <img src={content.url} alt={content.alt || ''} style={{ maxWidth: 200, maxHeight: 200 }} />
    if ('url' in content && content.type === 'file') return <a href={content.url} target="_blank" rel="noopener noreferrer">{content.name || 'File'}</a>
    // Add more object type handling as needed
  }
  return null
}

export function Chat({ messages, onSubmit, isLoading = false }: ChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const userBg = useColorModeValue('blue.500', 'blue.600')
  const assistantBg = useColorModeValue('gray.100', 'gray.700')
  const inputBg = useColorModeValue('gray.50', 'gray.700')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSubmit(input.trim())
      setInput('')
    }
  }

  const messageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  return (
    <MotionVStack
      initial="initial"
      animate="animate"
      variants={containerVariants}
      h="full"
      gap={0}
      bg={bgColor}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
    >
      {/* Header */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        w="full"
        p={4}
        borderBottom="1px"
        borderColor={borderColor}
        bg={bgColor}
      >
        <HStack gap={3}>
          <Avatar
            size="sm"
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
          <VStack align="start" gap={0}>
            <Text fontWeight="bold" fontSize="lg">
              Anne Wojcicki
            </Text>
            <Text fontSize="sm" color="gray.500">
              Active
            </Text>
          </VStack>
        </HStack>
      </MotionBox>

      {/* Messages Container */}
      <Box
        flex={1}
        w="full"
        overflowY="auto"
        p={4}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'gray.300',
            borderRadius: '24px',
          },
        }}
      >
        <VStack gap={4} align="stretch">
          <AnimatePresence>
            {messages.map((message, index) => (
              <MotionBox
                key={`message-${index}`}
                variants={messageVariants}
                animate="animate"
                exit="exit"
                transition={{ delay: index * 0.1 }}
              >
                <Flex justify={message.role === 'user' ? 'flex-end' : 'flex-start'} mb={2}>
                  <HStack gap={3} maxW="80%" flexDirection={message.role === 'user' ? 'row-reverse' : 'row'}>
                    {message.role === 'user' ? (
                      <Avatar size="sm" bg="brand.muted" icon={<LuUser size={16} />} />
                    ) : (
                      <Avatar
                        size="sm"
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      />
                    )}
                    <Box
                      bg={message.role === 'user' ? userBg : assistantBg}
                      color={message.role === 'user' ? 'white' : 'inherit'}
                      px={4}
                      py={2}
                      borderRadius="lg"
                      borderBottomLeftRadius={message.role === 'user' ? 'lg' : 'sm'}
                      borderBottomRightRadius={message.role === 'user' ? 'sm' : 'lg'}
                      position="relative"
                    >
                      <Text fontSize="sm" lineHeight="1.5">
                        {renderMessageContent(message.content)}
                      </Text>
                    </Box>
                  </HStack>
                </Flex>
              </MotionBox>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          <AnimatePresence>
            {isLoading && (
              <MotionBox variants={messageVariants} initial="initial" animate="animate" exit="exit">
                <Flex justify="flex-start" mb={2}>
                  <HStack gap={3}>
                    <Avatar
                      size="sm"
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    />
                    <Box bg={assistantBg} px={4} py={2} borderRadius="lg" borderBottomLeftRadius="sm">
                      <HStack gap={2}>
                        <Spinner size="sm" />
                        <Text fontSize="sm" color="gray.500">
                          Thinking...
                        </Text>
                      </HStack>
                    </Box>
                  </HStack>
                </Flex>
              </MotionBox>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      <Separator />

      {/* Input Form */}
      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} w="full" p={4} bg={bgColor}>
        <form onSubmit={handleSubmit}>
          <HStack gap={3}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              bg={inputBg}
              border="1px"
              borderColor={borderColor}
              borderRadius="xl"
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px blue.500',
              }}
              _hover={{
                borderColor: 'gray.300',
              }}
              disabled={isLoading}
            />
            <IconButton
              type="submit"
              aria-label="Send message"
              colorScheme="blue"
              borderRadius="xl"
              loading={isLoading}
              disabled={!input.trim() || isLoading}
              _hover={{
                transform: 'scale(1.05)',
              }}
              transition="all 0.2s"
            >
              <LuSend size={16} />
            </IconButton>
          </HStack>
        </form>
      </MotionBox>
    </MotionVStack>
  )
}
