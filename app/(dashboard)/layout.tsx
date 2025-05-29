import { Flex, Grid, GridItem, HStack, Image, Text } from '@chakra-ui/react'

import { ColorModeButton } from '~/components/ui/color-mode'
// import { Sidebar } from '~/components/sidebar'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Grid
      templateAreas={`"header"
                      "main"
                      "footer"`}
      // templateAreas={`"sidebar header"
      //                 "sidebar main"
      //                 "sidebar footer"`}
      templateRows={'60px 1fr 50px'}
      // templateColumns={'250px 1fr'}
      h="100vh"
      gap="0"
    >
      {/* Header */}
      <GridItem area={'header'} bg="bg" zIndex="1">
        <Flex h="100%" px="6" align="center" justify="space-between">
          <HStack align="center" gap="4">
            <Image src="/brand.svg" alt="Brand icon" height="8" />
            <Text color="brand.600" fontWeight="bold" fontSize="lg">
              Lamigo AI
            </Text>
          </HStack>
          <Flex align="center" gap="4">
            <ColorModeButton />
          </Flex>
        </Flex>
      </GridItem>

      {/* Sidebar */}
      {/* <GridItem area={'sidebar'} bg="bg" borderRight="1px" borderColor="bg.inverted" p="4">
        <Sidebar />
      </GridItem> */}

      {/* Main Content */}
      <GridItem area={'main'} bg="bg.subtle" p="4" overflowY="auto">
        {children}
      </GridItem>

      {/* Footer */}
      <GridItem area={'footer'} bg="bg" borderTop="1px" borderColor="bg" p="3">
        <Flex justify="space-between" align="center">
          <Text fontSize="sm">© 2025 Lamigo Dashboard. All rights reserved.</Text>
        </Flex>
      </GridItem>
    </Grid>
  )
}
