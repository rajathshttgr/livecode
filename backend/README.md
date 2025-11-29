# LiveCode : A Collaborative Real-Time Code Editor for Teams

LiveCode is a web-based collaborative code editor where multiple users can work together in real time. Developers can join a shared workspace, write and edit code simultaneously, and see updates instantly. The platform includes a simple AI-powered autocomplete system to assist with faster and cleaner coding.

### TO DO: (Personal Note)

- [x] Implement File Sync (Initial load from Redis)
- [ ] Broadcast Code Deltas (Send only changes, not full file)
- [ ] Render Remote Cursors (Show other users positions/names)
- [ ] Integrate AI Autocomplete (Add code suggestions)
- [ ] Persist to Database (Save to DB when room becomes empty)
- [ ] Implement Redis Pub/Sub (Sync rooms across multiple servers)
- [ ] Handle Edit Conflicts (Prevent overwrite issues using locking or OT)
- [ ] Rate limiting and autocomplete credit tracking
- [ ] Add unit tests
