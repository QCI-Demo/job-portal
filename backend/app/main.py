from fastapi import FastAPI

app = FastAPI(title="Job Portal API", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok", "service": "job-portal-backend"}
