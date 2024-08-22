# Bugs

- Nested JSON commands are unindented in console - it looks like this:
{
"command": admin_login,
"data": {
  "user": "admin",
  "pass: "admin123"
}
}
... instead of:
{
 "command": admin_login,
 "data": {
  "user": "admin",
  "pass: "admin123"
 }
}
- In CSS: .modal .body .buttons elements are having different size (they all are flex-grow: 1, which works, but with a bit different size for each element)
- Modal window width is not growing to 100% - 20px of screen width, when there is a long text in one row in modal body

# Features

- Add backup and restore buttons for quick commands (from / to JSON file)
- Add a possibility to move modal window (drag by title bar)
- Add WebTransport support (switch WebSocket / WebTransport - last value stored in localStorage)
