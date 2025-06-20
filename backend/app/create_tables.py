from app.db import Base, engine
# Import ALL models so they are registered with SQLAlchemy's metadata
from app.models import user, session, two_factor_auth, transaction, budget, reminder, notification, export_log, family_group, family_member, password_reset_token, audit_log

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done.")
