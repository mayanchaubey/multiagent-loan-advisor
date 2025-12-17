from fastapi import FastAPI
from dotenv import load_dotenv
load_dotenv()

from app.db import engine
from app.models import session, loan_application, agent_event
from app.db import Base
from sqlalchemy import inspect
from app.schemas.loan_input import LoanInput
from app.agents.eligibility_agent import EligibilityAgent
from app.agents.orchestrator_agent import OrchestratorAgent
from app.db import SessionLocal
from app.models.agent_event import AgentEvent
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Multi-Agent Loan Advisor",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/debug/tables")
def debug_tables():
    inspector = inspect(engine)
    return {
        "tables": inspector.get_table_names()
    }

@app.post("/test/eligibility")
def test_eligibility(data: LoanInput):
    return EligibilityAgent.evaluate(data)

@app.post("/chat/apply-loan")
def apply_loan(data: LoanInput):
    return OrchestratorAgent.process_loan_application(data)

@app.get("/debug/agent-events")
def get_agent_events():
    db = SessionLocal()
    events = db.query(AgentEvent).all()
    return [
        {
            "agent": e.agent_name,
            "event_type": e.event_type,
            "input": e.input_snapshot,
            "output": e.output_snapshot
        }
        for e in events
    ]

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    db = SessionLocal()
    try:
        # Total Applications
        total_apps = db.query(AgentEvent).filter(AgentEvent.event_type == "eligibility_decision").count()
        
        # Approval/Rejection Counts
        approved = db.query(AgentEvent).filter(
            AgentEvent.event_type == "eligibility_decision",
            AgentEvent.output_snapshot.like('%"decision": "approved"%')
        ).count()
        
        rejected = db.query(AgentEvent).filter(
            AgentEvent.event_type == "eligibility_decision",
            AgentEvent.output_snapshot.like('%"decision": "rejected"%')
        ).count()
        
        conditional = db.query(AgentEvent).filter(
            AgentEvent.event_type == "eligibility_decision",
            AgentEvent.output_snapshot.like('%"decision": "conditional"%')
        ).count()
        
        # Risk Distribution
        # Note: In a real production app, we would query structured fields. 
        # Here we scrape JSON for simplicity or just return raw events for frontend to process if dataset is small.
        # For now, let's return the last 50 events for client-side detailed charts to keep backend simple
        recent_events = db.query(AgentEvent).filter(
            AgentEvent.event_type == "eligibility_decision"
        ).order_by(AgentEvent.timestamp.desc()).limit(50).all()
        
        events_data = [
            {
                "timestamp": e.timestamp.isoformat(),
                "decision": e.output_snapshot.get("decision"),
                "risk_probability": e.output_snapshot.get("risk_probability"),
                "eligibility_score": e.output_snapshot.get("eligibility_score")
            }
            for e in recent_events
        ]

        return {
            "summary": {
                "total": total_apps,
                "approved": approved,
                "rejected": rejected,
                "conditional": conditional
            },
            "recent_events": events_data
        }
    finally:
        db.close()
