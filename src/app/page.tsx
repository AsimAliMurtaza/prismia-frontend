"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Spinner,
  Container,
  Heading,
  useColorModeValue,
  extendTheme,
  ChakraProvider,
} from "@chakra-ui/react";
import { Send } from "lucide-react";

// Define the type for a single chat message
interface ChatMessage {
  type: "human" | "ai" | "tool" | "unknown";
  content: string | Array<Record<string, any>>;
  name?: string;
  role?: string; // Add role as optional to accept the Groq format when debugging
}

// Define the structure for the API response
interface AgentResponse {
  response: string; // The final AI response text
  history: ChatMessage[]; // The full conversation history in frontend format
}

// Custom theme setup (must be outside the component)
const theme = extendTheme({
  colors: {
    brand: {
      500: "#1976D2", 
      600: "#1565C0",
    },
  },
  styles: {
    global: {
      "html, body": {
        fontFamily: "Inter, sans-serif",
      },
    },
  },
});

// Helper to format messages for display
const formatMessageForDisplay = (message: ChatMessage): string => {
  if (message.type === "human") {
    return message.content as string;
  } else if (message.type === "ai") {
    return message.content as string;
  } else if (message.type === "tool") {
    // Tool messages can be complex objects; we show the content as a string.
    return `Tool (${message.name || 'System'}): ${
      typeof message.content === "string"
        ? message.content
        : JSON.stringify(message.content, null, 2)
    }`;
  }
  return JSON.stringify(message);
};

// --- CHATBOT COMPONENT ---

export default function Chatbot() {
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    // 1. Create message for optimistic display and backend payload
    const userMessage: ChatMessage = { type: "human", content: input };
    
    // 2. Prepare payload history (raw history + current user message)
    const payloadHistory = [...history, userMessage];

    // 3. Optimistically update UI
    setHistory(payloadHistory);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the full history payload to the backend
        body: JSON.stringify({
          query: userMessage.content,
          history: payloadHistory, // Send the full conversation history
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.response || "API Error");
      }

      const data: AgentResponse = await res.json();
      
      // 4. Update history with the full, complete history array from the backend
      setHistory(data.history);
      
    } catch (error: any) {
      console.error("Error:", error);
      // 5. If error, replace the last (user) message and show the error text
      setHistory((prevHistory) => {
        // Remove the optimistically added user message
        const updatedHistory = prevHistory.slice(0, -1);
        return [
          ...updatedHistory,
          { type: "human", content: userMessage.content }, // Re-add user message
          { type: "ai", content: `Error: ${error.message}. Please try again.` }, // Add error message
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const chatBgColor = useColorModeValue("white", "gray.700");

  // NOTE: ChakraProvider should ideally be in layout.tsx, but kept here for self-contained example
  return (
    <ChakraProvider theme={theme}> 
      <Container
        centerContent
        maxW="container.xl"
        p={4}
        bg={bgColor}
        minH="100vh"
      >
        <VStack
          w="full"
          maxW="2xl"
          bg={chatBgColor}
          borderRadius="xl"
          boxShadow="2xl"
          spacing={0}
          h="85vh"
          overflow="hidden"
        >
          {/* Header */}
          <Heading
            as="h1"
            size="md"
            p={4}
            bg="brand.500"
            color="white"
            w="full"
            textAlign="center"
          >
            HR Agent Template v0.1.0
          </Heading>

          {/* Messages Display Area */}
          <VStack
            flex={1}
            w="full"
            p={4}
            spacing={4}
            overflowY="auto"
            align="stretch"
          >
            {history.length === 0 && (
              <Text color="gray.500" textAlign="center" mt={10}>
                Type a message to start the conversation!
              </Text>
            )}
            {history.map((msg, index) => {
                // Filter out empty AI messages or system messages without content
                if (!msg.content && msg.type !== 'tool') return null;

                const isHuman = msg.type === "human";
                const isTool = msg.type === "tool";
                
                return (
                    <Box
                        key={index}
                        display="flex"
                        justifyContent={isHuman ? "flex-end" : "flex-start"}
                    >
                        <Box
                            maxW="70%"
                            p={3}
                            borderRadius="lg"
                            boxShadow="sm"
                            bg={
                                isHuman
                                    ? "brand.500"
                                    : isTool
                                    ? "yellow.50"
                                    : "gray.100"
                            }
                            color={
                                isHuman
                                    ? "white"
                                    : isTool
                                    ? "yellow.800"
                                    : "gray.800"
                            }
                            borderBottomRightRadius={isHuman ? "0" : "lg"}
                            borderBottomLeftRadius={!isHuman ? "0" : "lg"}
                            fontSize="sm"
                        >
                            <Text fontWeight={isTool ? "bold" : "normal"}>
                                {formatMessageForDisplay(msg)}
                            </Text>
                        </Box>
                    </Box>
                );
            })}
            {isLoading && (
              <Box display="flex" justifyContent="flex-start">
                <Spinner size="sm" color="brand.500" />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </VStack>

          {/* Input Area */}
          <HStack
            p={4}
            borderTopWidth="1px"
            spacing={3}
            w="full"
            bg={chatBgColor}
          >
            <Input
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              onKeyPress={handleKeyPress}
              placeholder="Ask Agent..."
              flex={1}
              isDisabled={isLoading}
              size="lg"
              borderRadius="full"
              focusBorderColor="brand.500"
            />
            <Button
              onClick={handleSubmit}
              colorScheme="brand"
              bg="brand.500"
              _hover={{ bg: "brand.600" }}
              size="lg"
              borderRadius="full"
              px={6}
              isDisabled={isLoading || !input.trim()}
              rightIcon={isLoading ? <Spinner size="sm" /> : <Send size={18} />}
            >
              Send
            </Button>
          </HStack>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}
