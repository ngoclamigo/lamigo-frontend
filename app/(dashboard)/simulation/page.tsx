'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { LuTicketX } from 'react-icons/lu'
import { Box, Heading, Text, HStack, Image, Card, Badge, AspectRatio, Stack } from '@chakra-ui/react'

import { Tag } from '~/components/ui/tag'

const DynamicComponentWithNoSSR = dynamic(() => import('./page.client'), { ssr: false })

const MotionBox = motion.create(Box)

export default function VoiceAssistantPage() {
  return (
    <Stack
      minH="full"
      gap={8}
      px={4}
      justifyContent="center"
      alignItems="center"
      bgGradient="linear-gradient(0deg,rgba(182, 202, 255, 1) 0%, rgba(204, 251, 241, 1) 100%)"
      borderRadius="xl"
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

      <DynamicComponentWithNoSSR />
    </Stack>
  )
}
