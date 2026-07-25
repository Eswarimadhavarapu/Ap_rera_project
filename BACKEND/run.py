from app import create_app
from flask_talisman import Talisman
import os

app = create_app()

Talisman(app)

@app.route("/test")
def test():
    return 10 / 0

if __name__ == "__main__":
    host = "0.0.0.0"   # localhost only
    port = int(os.getenv("PORT", 8080))

    print(f"Server starting at {host}:{port}")

    app.run(
        host=host,
        port=port,
        debug=False
    )