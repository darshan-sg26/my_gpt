import asyncio
import httpx

async def test_chat():
    async with httpx.AsyncClient(base_url="http://localhost:8000/api") as client:
        # login
        resp = await client.post("/auth/login", data={"username": "test@test.com", "password": "123"})
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # get chats
        resp = await client.get("/chat/", headers=headers)
        print("chats:", resp.status_code, resp.text)
        
        # create chat
        resp = await client.post("/chat/", headers=headers, json={"title": "test chat"})
        print("create chat:", resp.status_code, resp.text)
        chat_id = resp.json()["_id"]
        
        # send message
        resp = await client.post(f"/chat/{chat_id}/messages", headers=headers, json={"content": "hello there!"})
        print("send message:", resp.status_code, resp.text)

if __name__ == "__main__":
    asyncio.run(test_chat())
