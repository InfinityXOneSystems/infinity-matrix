/**
 * API Service for Monaco IDE
 * Handles code editing, chat, and orchestration requests
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD ? 'https://api.infinitymatrix.io' : 'http://localhost:8000'
);

export class MonacoIDEService {
  /**
   * Send a chat message to AI assistant
   */
  static async sendChatMessage(message, codeContext = null, language = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/code/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          code_context: codeContext,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  /**
   * Request code edit from AI
   */
  static async editCode(fileName, language, originalCode, instruction) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/code/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_name: fileName,
          language,
          original_code: originalCode,
          instruction,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error editing code:', error);
      throw error;
    }
  }

  /**
   * Create orchestration task
   */
  static async orchestrateTask(taskDescription, context = {}, targetAgentType = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/code/orchestrate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_description: taskDescription,
          context,
          target_agent_type: targetAgentType,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error orchestrating task:', error);
      throw error;
    }
  }

  /**
   * Get orchestration task status
   */
  static async getTaskStatus(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/code/orchestrate/${taskId}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting task status:', error);
      throw error;
    }
  }

  /**
   * Poll task status until complete
   */
  static async pollTaskStatus(taskId, onUpdate, maxAttempts = 20, interval = 2000) {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const status = await this.getTaskStatus(taskId);
        
        if (onUpdate) {
          onUpdate(status);
        }

        if (status.status === 'completed' || status.status === 'failed') {
          return status;
        }

        await new Promise(resolve => setTimeout(resolve, interval));
        attempts++;
      } catch (error) {
        console.error('Error polling task status:', error);
        throw error;
      }
    }

    throw new Error('Task polling timeout');
  }
}

export default MonacoIDEService;
