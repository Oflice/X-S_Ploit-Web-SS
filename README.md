# X-S_Ploit-Web-SS
**A Web-Based Roblox Server-Side Executor**
**NOTE:** *EDUCATIONAL PURPOSES ONLY!!!*

# How to start server?
**go to cmd to node-server and type npm install now type node server.js(you must have installed Node.js)**
**Now go to localhost:3000 and open roblox studio or other game infected !!!MAKE SURE YOU JOINED INFECTED GAME FROM DEVICE WHERE STARTED SERVER!!! **

# HOW TO INFECT GAME
**ENABLE HTTP REQUESTS AND LOADSTRING AND CREATE SERVER SCRIPT AND PASTE IT**
```
local HttpService = game:GetService("HttpService")
local RunService = game:GetService("RunService")

local SERVER_URL = "http://localhost:3000/api/commands"
local AUTH_KEY = "X3D"
local POLL_INTERVAL = 0.5

local function executeAnything(code)
	local fn, err = loadstring(code)
	if not fn then return false, err end

	setfenv(fn, getfenv())
	return pcall(fn)
end

while task.wait(POLL_INTERVAL) do
	pcall(function()
		local response = HttpService:GetAsync(SERVER_URL.."?auth="..AUTH_KEY)
		local commands = HttpService:JSONDecode(response)

		for _, cmd in ipairs(commands) do
			if type(cmd.code) == "string" then
				local success, result = executeAnything(cmd.code)
				print(success and "✅ Executed" or "❌ Failed", "ID:", cmd.id)
				if not success then warn(result) end
			end
		end
	end)
end
```

# HOW TO ENABLE LOADSTRING
**CLICK ON SERVERSCRIPTSERVICE AND GO TO PROPERTIES AND CHECK LOADSTRINGENABLED**
