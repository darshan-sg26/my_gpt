import asyncio
import httpx

async def test_auth():
    async with httpx.AsyncClient(base_url="http://localhost:8000/api") as client:
        print("Registering user...")
        resp = await client.post("/auth/register", json={
            "username": "testuser",
            "email": "test@test.com",
            "password": "123"
        })
        print("Register response:", resp.status_code, resp.text)
        
        print("Logging in...")
        resp = await client.post("/auth/login", data={
            "username": "test@test.com",
            "password": "123"
        })
        print("Login response:", resp.status_code, resp.text)
        if resp.status_code != 200: return
        
        token = resp.json()["access_token"]
        print("Fetching me...")
        resp = await client.get("/user/me", headers={"Authorization": f"Bearer {token}"})
        print("Me response:", resp.status_code, resp.text)

if __name__ == "__main__":
    asyncio.run(test_auth())
