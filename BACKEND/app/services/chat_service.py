from app.services.rules_service import RulesService
from app.services.faq_service import FaqService
from app.services.llm_service import LLMService

class ChatService:
    @staticmethod
    def process_message(message: str) -> str:
        # Phase 2: Check the Rule-Based Engine first
        rule_response = RulesService.get_rule_based_response(message)
        if rule_response: return rule_response
            
        # Phase 3: Check FAQ Database
        faq_response = FaqService.search_faq(message)
        if faq_response: return faq_response
            
        # Phase 6: Prepare LLM Fallback (If Ollama is running, it will handle it)
        llm_response = LLMService.get_llm_response(message)
        if llm_response: return llm_response
            
        # Ultimate Fallback response
        return "I'm sorry, I don't have an answer for that yet. I am currently limited to predefined rules!"