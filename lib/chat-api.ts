import type {
  ChatRequest,
  ChatResponse,
  Conversation,
  ConversationDetail,
} from "@/types/chat";

const getApiUrl = (): string => {
  if (typeof window === "undefined") return "";
  return process.env.NEXT_PUBLIC_API_URL || "";
};

/**
 * Send a chat message and receive an AI response.
 */
export async function sendChatMessage(
  userId: string,
  request: ChatRequest
): Promise<ChatResponse> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    throw new Error("API URL is not configured");
  }

  try {
    const url = `${apiUrl}/api/${userId}/chat`;
    console.log('Sending chat message to:', url);
    console.log('Request:', request);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ ADDED - Important for CORS with auth
      body: JSON.stringify(request),
    });

    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);

    if (!response.ok) {
      let errorMessage = `HTTP error: ${response.status}`;
      let errorDetails = null;
      
      try {
        errorDetails = await response.json();
        console.log('Error response body:', errorDetails);
        errorMessage = errorDetails.detail || errorDetails.message || errorDetails.error || errorMessage;
      } catch (parseError) {
        console.log('Could not parse error response:', parseError);
        try {
          const text = await response.text();
          console.log('Error response text:', text);
          errorMessage = text || response.statusText || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
      }
      
      console.error('Full error details:', {
        status: response.status,
        statusText: response.statusText,
        errorMessage,
        errorDetails
      });
      
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error('Chat API error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to send chat message");
  }
}

/**
 * Get list of conversations for a user.
 */
export async function getConversations(
  userId: string,
  limit: number = 10
): Promise<Conversation[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    throw new Error("API URL is not configured");
  }

  try {
    const response = await fetch(
      `${apiUrl}/api/${userId}/conversations?limit=${limit}`,
      {
        credentials: "include", // ✅ ADDED
      }
    );

    if (!response.ok) {
      let errorMessage = `HTTP error: ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get conversations");
  }
}

/**
 * Get a specific conversation with messages.
 */
export async function getConversationDetail(
  userId: string,
  conversationId: number,
  limit: number = 50
): Promise<ConversationDetail> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    throw new Error("API URL is not configured");
  }

  try {
    const response = await fetch(
      `${apiUrl}/api/${userId}/conversations/${conversationId}?limit=${limit}`,
      {
        credentials: "include", // ✅ ADDED
      }
    );

    if (!response.ok) {
      let errorMessage = `HTTP error: ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to get conversation detail");
  }
}

/**
 * Delete a conversation.
 */
export async function deleteConversation(
  userId: string,
  conversationId: number
): Promise<void> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    throw new Error("API URL is not configured");
  }

  try {
    const response = await fetch(
      `${apiUrl}/api/${userId}/conversations/${conversationId}`,
      {
        method: "DELETE",
        credentials: "include", // ✅ ADDED
      }
    );

    if (!response.ok) {
      let errorMessage = `HTTP error: ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete conversation");
  }
}