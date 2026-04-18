from app.models.database import db
from app.models.faq_model import FAQ


class FaqService:

    # 🔥 synonym + normalization map
    SYNONYMS = {
        "docs": "document",
        "documents": "document",
        "papers": "document",
        "file": "document",

        "needed": "require",
        "require": "require",
        "required": "require",

        "registration": "register",
        "register": "register",

        "fee": "fee",
        "payment": "fee",

        "status": "status",
        "track": "status",

        "login": "login",
        "password": "password",
    }

    STOPWORDS = {"the", "is", "for", "of", "to", "a", "in", "on", "and"}

    @staticmethod
    def normalize_text(text: str):
        words = text.lower().split()

        normalized = []
        for word in words:
            if word in FaqService.STOPWORDS:
                continue

            word = FaqService.SYNONYMS.get(word, word)
            normalized.append(word)

        return normalized

    @staticmethod
    def calculate_score(user_words, question_text):
        score = 0

        for word in user_words:
            if word in question_text:
                score += 3  # strong weight

        # phrase bonus
        if " ".join(user_words) in question_text:
            score += 5

        return score

    @staticmethod
    def search_faq(user_message: str) -> str | None:

        if not user_message:
            return None

        user_words = FaqService.normalize_text(user_message)

        if not user_words:
            return None

        faqs = FAQ.query.all()

        best_match = None
        max_score = 0

        for faq in faqs:
            question = faq.question.lower()

            score = FaqService.calculate_score(user_words, question)

            if score > max_score:
                max_score = score
                best_match = faq

        print(f"[FAQ DEBUG] Input: {user_message}")
        print(f"[FAQ DEBUG] Words: {user_words}")
        print(f"[FAQ DEBUG] Score: {max_score}")
        print(f"[FAQ DEBUG] Match: {best_match.question if best_match else None}")

        # 🔥 confidence threshold
        if max_score < 3:
            return None

        return best_match.answer if best_match else None

    @staticmethod
    def initialize_sample_data():

        FAQ.__table__.create(db.engine, checkfirst=True)

        if FAQ.query.count() > 0:
            return "FAQ already exists."

        sample_faqs = [

            FAQ(
                question="register project process",
                answer="Go to Dashboard → Project Registration and fill promoter, location, and documents."
            ),

            FAQ(
                question="documents required for project registration",
                answer="You need promoter details, land documents, approvals, and project plans."
            ),

            FAQ(
                question="change agent process",
                answer="Go to Agent Registration → Change Request and update agent details."
            ),

            FAQ(
                question="reset password login issue",
                answer="Click 'Forgot Password' on login page and follow instructions."
            ),

            FAQ(
                question="login problem help",
                answer="Check credentials or reset password using Forgot Password."
            ),

            FAQ(
                question="check application status",
                answer="Use your application number in status tracking section."
            ),

            FAQ(
                question="project registration fee details",
                answer="Fee depends on project size. Use Fee Calculator in portal."
            ),

            FAQ(
                question="approval time project registration",
                answer="Approval takes around 15–30 working days after verification."
            ),

            FAQ(
                question="edit submitted application",
                answer="You can edit before final submission. After submission, approval is required."
            ),

            FAQ(
                question="promoter profile details",
                answer="Promoter profile contains builder details, past projects, and credentials."
            ),

            FAQ(
                question="withdraw money from rera account",
                answer="Withdrawals allowed based on project completion certified by CA and engineer."
            ),
        ]

        db.session.add_all(sample_faqs)
        db.session.commit()

        return "Sample FAQs inserted successfully."