from transformers import AutoModelForCausalLM, AutoTokenizer

class AIAssistant:
    def __init__(self, model_name="KingNish/Qwen2.5-0.5b-Test-ft"):
        """
        Initialize the AI Assistant with the specified model.
        
        Args:
            model_name (str): The name of the model to load
        """
        self.model_name = model_name
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype="auto",
            device_map="auto"
        )
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.conversation_history = []
        self.system_message = "You are John, created by TeamPPC. You are a helpful assistant that helps users plan their time wisely."
        
    def set_system_message(self, system_message):
        """
        Update the system message for the AI.
        
        Args:
            system_message (str): New system message
        """
        self.system_message = system_message
        
    def reset_conversation(self):
        """
        Clear the conversation history.
        """
        self.conversation_history = []
        
    def get_conversation_history(self):
        """
        Get the current conversation history.
        
        Returns:
            list: List of message dictionaries
        """
        return self.conversation_history
        
    def get_answer(self, prompt, remember_conversation=True):
        """
        Get an answer from the AI model for a given prompt, maintaining conversation history.
        
        Args:
            prompt (str): The user's question or prompt
            remember_conversation (bool): Whether to add this exchange to conversation history
            
        Returns:
            str: The AI's response
        """
        # Prepare messages with system message and history
        messages = [{"role": "system", "content": self.system_message}]
        messages.extend(self.conversation_history)
        messages.append({"role": "user", "content": prompt})
        
        text = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
        
        model_inputs = self.tokenizer([text], return_tensors="pt").to(self.model.device)
        
        generated_ids = self.model.generate(
            **model_inputs,
            max_new_tokens=512
        )
        
        generated_ids = [
            output_ids[len(input_ids):] 
            for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
        ]
        
        response = self.tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
        
        # Update conversation history if remember_conversation is True
        if remember_conversation:
            self.conversation_history.append({"role": "user", "content": prompt})
            self.conversation_history.append({"role": "assistant", "content": response})
            
        return response
    
    def add_to_history(self, role, content):
        """
        Manually add a message to the conversation history.
        
        Args:
            role (str): The role of the message sender ("user" or "assistant")
            content (str): The message content
        """
        if role not in ["user", "assistant"]:
            raise ValueError("Role must be either 'user' or 'assistant'")
        self.conversation_history.append({"role": role, "content": content})
    
if __name__ == "__main__":
    # Initialize the AI assistant
    ai = AIAssistant()

    # Start a conversation
    response1 = ai.get_answer("What's your name?")
    print(response1)

    # Continue the conversation - the AI will remember previous context
    response2 = ai.get_answer("Can you help me plan my meetings for tomorrow?")
    print(response2)

    # If you want to see the conversation history
    history = ai.get_conversation_history()
    for message in history:
        print(f"{message['role'].upper()}: {message['content']}")

    # If you want to start fresh
    ai.reset_conversation()
